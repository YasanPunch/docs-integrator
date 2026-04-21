---
title: Process FTP Order Batches with Age Filter and File Dependency
---

# Process FTP Order Batches with Age Filter and File Dependency

Build an FTP file processing service that watches a directory for order batch CSV files, waits for a `.final` marker file to confirm the upload is complete, and processes each order only within a safe age window.

## What You'll Build

An FTP listener that monitors the root directory for batch CSV files (e.g. `orders_42.csv`). Each batch has a corresponding marker file (`orders_42.final`) uploaded separately to signal that the CSV is fully written. The service waits until both files exist before processing, logs each order record, then deletes the processed files automatically.

## What You'll Learn

- Configuring an FTP listener with authentication, polling interval, and `userDirIsRoot`
- Using `fileNamePattern` to narrow which files trigger the listener
- Using `fileAgeFilter` to skip files that are still uploading or stale
- Using `fileDependencyConditions` to block processing until a corresponding file exists
- Using capture group back-references (`$1`) to dynamically match paired files
- Using `@ftp:FunctionConfig` with `afterProcess: ftp:DELETE` to auto-delete files after processing
- Parsing CSV content with `customHeaders` using `csv:parseList`
- Handling processing errors with `do/on fail`

## Prerequisites

- WSO2 Integrator VS Code extension installed
- Basic familiarity with Ballerina syntax
- A running FTP server (e.g. vsftpd or FileZilla Server) accessible at `127.0.0.1:21`

**Time estimate:** 20--30 minutes

## Architecture

```text
FTP Server (root /)
  ├── orders_42.csv        ← batch data (uploaded first)
  └── orders_42.final      ← marker file (uploaded after CSV is complete)
          │
          │  Age window satisfied (30s–3600s)?  ✓
          │  orders_42.final exists?            ✓
          ▼
  FTP Listener (onFileCsv)
          │
          │  csv:parseList (customHeaders) → OrderRecord[]
          │
          ▼
  log: "New order is processed. Order Id: 1001, ..."
  log: "New order is processed. Order Id: 1002, ..."
  ...  (files deleted via afterProcess: ftp:DELETE)
```

## Step 1: Create the Ballerina Project

Create a new Ballerina project:

```bash
bal new ftp-file-process
cd ftp-file-process
```

This creates a project directory with a `Ballerina.toml` and a default `main.bal`. You will replace the generated files with the ones below.

## Step 2: Define the Data Types

Create `types.bal` in the project root with the record type for order data:

```ballerina
// types.bal

type OrderRecord record {|
    string orderId;
    string customerId;
    string productId;
    string quantity;
    string unitPrice;
|};
```

## Step 3: Add Configurable Values

Create `config.bal` in the project root to declare the FTP connection and age threshold values so they can be set per environment:

```ballerina
// config.bal

configurable string ftpHost = "127.0.0.1";
configurable int ftpPort = 21;
configurable string ftpUser = "admin";
configurable string ftpPassword = "admin";

configurable decimal minAgeSeconds = 30;
configurable decimal maxAgeSeconds = 3600;
```

## Step 4: Build the FTP Listener and Service

Replace the contents of `main.bal` with the listener and service:

```ballerina
// main.bal
import ballerina/data.csv;
import ballerina/ftp;
import ballerina/log;

listener ftp:Listener ftpListener = new (protocol = ftp:FTP, host = ftpHost, port = ftpPort,
    auth = {credentials: {username: ftpUser, password: ftpPassword}},
    userDirIsRoot = true, pollingInterval = 10
);

@ftp:ServiceConfig {
    path: "/",
    fileNamePattern: "orders_.*\\.csv",
    fileAgeFilter: {
        minAge: minAgeSeconds,
        maxAge: maxAgeSeconds
    },
    fileDependencyConditions: [
        {
            targetPattern: "orders_(.*)\\.csv",
            requiredFiles: ["orders_$1.final"],
            matchingMode: ftp:ALL
        }
    ]
}
service on ftpListener {

    @ftp:FunctionConfig {
        afterProcess: ftp:DELETE
    }
    remote function onFileCsv(string[][] content, ftp:FileInfo fileInfo) returns error? {
        do {
            OrderRecord[] orders = check csv:parseList(content, {customHeaders: ["orderId", "customerId", "productId", "quantity", "unitPrice"]});
            foreach OrderRecord newOrder in orders {
                log:printInfo(string `New order is processed. Order Id: ${newOrder.orderId}, Product Id: ${newOrder.productId}, Quantity: ${newOrder.quantity}, Unit Price: ${newOrder.unitPrice}`);
            }
        } on fail error err {
            return error("unhandled error", err);
        }
    }
}
```

## Step 5: Prepare Sample Data

Create a `sample-data/` directory in the project root:

```bash
mkdir sample-data
```

Create `sample-data/orders_42.csv` with the following content. The header row must match the `OrderRecord` field names exactly:

```csv
orderId,customerId,productId,quantity,unitPrice
1001,CUST-A,PROD-X,5,19.99
1002,CUST-B,PROD-Y,2,49.50
1003,CUST-C,PROD-Z,1,99.00
```

Create an empty `sample-data/orders_42.final` marker file. Once uploaded, it signals that the CSV upload is complete.

## Step 6: Start the FTP Server

Create a `docker-compose.yml` in the project root:

```yaml
services:
  ftp:
    image: stilliard/pure-ftpd
    environment:
      - FTP_USER_NAME=${FTP_USER}
      - FTP_USER_PASS=${FTP_PASS}
      - FTP_USER_HOME=/home/ballerina
    ports:
      - "21:21"
      - "30000-30009:30000-30009"
```

Start the FTP server:

```bash
docker-compose up -d
```

## Step 7: Run and Test

Start the Ballerina service:

```bash
bal run
```

Set your credentials as environment variables, then upload the CSV first followed by the marker file:

```bash
export FTP_USER=admin
export FTP_PASS=admin

# 1. Upload the batch data
curl -T sample-data/orders_42.csv ftp://127.0.0.1/orders_42.csv --user "$FTP_USER:$FTP_PASS"

# 2. Upload the marker to signal the CSV is fully written
curl -T sample-data/orders_42.final ftp://127.0.0.1/orders_42.final --user "$FTP_USER:$FTP_PASS"
```

The listener detects both files exist within the age window and fires `onFileCsv`. After processing, both files are deleted from the FTP server. Expected output:

```text
time=... level=INFO message="New order is processed. Order Id: 1001, Product Id: PROD-X, Quantity: 5, Unit Price: 19.99"
time=... level=INFO message="New order is processed. Order Id: 1002, Product Id: PROD-Y, Quantity: 2, Unit Price: 49.50"
time=... level=INFO message="New order is processed. Order Id: 1003, Product Id: PROD-Z, Quantity: 1, Unit Price: 99.0"
```

### Testing the age filter

The `fileAgeFilter` has two bounds — you can verify each one independently.

**Scenario 01 — File uploaded but not yet processed:**

Upload both files and immediately check whether the listener fires within the first 30 seconds. It should stay silent until the CSV is at least 30 seconds old:

```bash
curl -T sample-data/orders_42.csv ftp://127.0.0.1/orders_42.csv --user "$FTP_USER:$FTP_PASS"
curl -T sample-data/orders_42.final ftp://127.0.0.1/orders_42.final --user "$FTP_USER:$FTP_PASS"
# wait < 30s — no output expected yet
# wait > 30s — onFileCsv fires on the next poll
```

**Scenario 02 — Simulate a stale file:**

Override `maxAgeSeconds` to a small value before starting the service so a freshly uploaded file immediately exceeds the limit.

Upload the files and wait more than 5 seconds before uploading the marker. The CSV will be skipped as stale and no output will appear.

If you upload both files and wait between 30 seconds and 1 hour, the listener will correctly pick them up on the next poll cycle and process them normally.

## Extend It

- **Move processed files** — Use the `afterProcess` field in `@ftp:FunctionConfig` to move the files to a specific location
- **Delete the marker file** — Call `ftpClient->delete(markerPath)` after processing to keep the watch directory clean
- **Validate records** — Add field-level validation before logging and skip or quarantine invalid rows
- **Write to a database** — Improve the business logic in the `onFileCsv` method to insert data into a database after processing.
