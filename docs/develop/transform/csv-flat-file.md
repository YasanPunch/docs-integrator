---
title: CSV & Flat File Processing
---

# CSV & Flat File Processing

Handle tabular data formats -- CSV, TSV, and fixed-width files. The `ballerina/data.csv` module provides type-safe parsing, transformation, and serialization for comma-separated and delimited data.

## Reading CSV into Records

Parse CSV content directly into typed Ballerina records using `csv:parseString()`. Define a record type whose fields match the CSV column headers.

1. **Define the record type** — Navigate to **Types** in the sidebar and click **+** to add a new type. Select **Create from scratch**, set **Kind** to **Record**, and name it `Employee`. Add fields using the **+** button:

   | Field | Type |
   |---|---|
   | `name` | `string` |
   | `department` | `string` |
   | `salary` | `decimal` |
   | `yearsOfService` | `int` |

   For details on creating types, see [Types](../integration-artifacts/supporting/types.md).

   ![Types panel showing the Employee record created from scratch with fields matching CSV columns](/img/develop/transform/csv-flat-file/csv-reading-type-panel.png)

2. **Add a Variable step** — In the flow designer, click **+** and select **Statement** → **Declare Variable**. Set the type to `string` and the name to `csvData`. Switch the toggle from **Record** to **Expression**, then enter the CSV string value.

3. **Parse the CSV string** — Click **+** and select **Call Function**. Search for `parseString` and select it under **data.csv**. Configure:
   - **Csv String***: `csvData`
   - **Result***: `employees`
   - **T***: `Employee[]`

4. **Add a Foreach step** — Click **+** and select **Foreach** under **Control**. Set:
   - **Collection**: `employees`
   - **Variable Name***: `emp`
   - **Variable Type***: `Employee`

5. **Add println inside the loop** — Inside the Foreach body, click **+** and select **Call Function**. Search under standard library → **io** → select `println`. Use **Add Item** to add three items. For each, search **variables**, expand `emp`, and select `name`, `department`, and `salary` respectively.

   ![Flow designer showing CSV parsing variable and foreach loop](/img/develop/transform/csv-flat-file/csv-reading-flow.png)

```ballerina
import ballerina/data.csv;
import ballerina/io;

type Employee record {|
    string name;
    string department;
    decimal salary;
    int yearsOfService;
|};

public function main() returns error? {
    string csvData = string `name,department,salary,yearsOfService
Alice,Engineering,95000.00,5
Bob,Sales,72000.00,3
Carol,Engineering,110000.00,8`;

    Employee[] employees = check csv:parseString(csvData);

    foreach Employee emp in employees {
        io:println(string `${emp.name} (${emp.department}): $${emp.salary}`);
    }
}
```

## Reading CSV from Files and Streams

Use `csv:parseBytes()` for byte arrays or `csv:parseStream()` for streaming large files without loading them entirely into memory.

1. **Define the record type** — Navigate to **Types** and click **+**. Select **Create from scratch**, set **Kind** to **Record**, and name it `Transaction`. Add fields: `date` (string), `description` (string), `amount` (decimal), `category` (string). For details on creating types, see [Types](../integration-artifacts/supporting/types.md).

2. **Read the file as bytes** — In the flow designer, click **+** and select **Call Function**. Search under **io** and select `fileReadBytes`. Configure:
   - **Path***: `transactions.csv`
   - **Result***: `content`

3. **Parse the bytes as CSV** — Click **+** and select **Call Function**. Search for `parseBytes` and select it under **data.csv**. Configure:
   - **Csv Bytes***: `content`
   - **Result***: `transactions`
   - **T***: `Transaction[]`

4. **(Optional) Stream large files** — For memory-efficient processing of large files, use `io:fileReadBlocksAsStream` followed by `csv:parseStream` instead of the bytes approach above.

   ![Flow designer showing file read and CSV parse steps](/img/develop/transform/csv-flat-file/csv-files-streams-flow.png)

```ballerina
import ballerina/data.csv;
import ballerina/io;

type Transaction record {|
    string date;
    string description;
    decimal amount;
    string category;
|};

public function main() returns error? {
    // Read from file as bytes
    byte[] content = check io:fileReadBytes("transactions.csv");
    Transaction[] transactions = check csv:parseBytes(content);

    // Or stream large files for memory efficiency
    stream<byte[], io:Error?> byteStream = check io:fileReadBlocksAsStream("large-data.csv");
    Transaction[] streamed = check csv:parseStream(byteStream);
}
```

## Selective Column Projection

Use closed record types to select only the columns you need. Columns not represented in the target record are automatically skipped.

1. **Define a subset record type** — Navigate to **Types** and click **+**. Select **Create from scratch**, set **Kind** to **Record**, and name it `EmployeeSummary`. Add only the fields you need: `name` (string) and `salary` (decimal). Columns not represented in the record are automatically skipped during parsing.

2. **Add a Variable step** — Click **+** and select **Statement** → **Declare Variable**. Set the type to `string` and the name to `csvData`. Switch the toggle from **Record** to **Expression**, then enter the CSV string value.

3. **Parse the CSV string** — Click **+** and select **Call Function**. Search for `parseString` and select it under **data.csv**. Configure:
   - **Csv String***: `csvData`
   - **Result***: `summaries`
   - **T***: `EmployeeSummary[]`

   ![Flow designer showing selective column projection with a subset record type](/img/develop/transform/csv-flat-file/csv-projection-flow.png)

```ballerina
import ballerina/data.csv;

// Only extract name and salary from a CSV with many columns
type EmployeeSummary record {|
    string name;
    decimal salary;
|};

public function main() returns error? {
    string csvData = string `name,department,salary,yearsOfService,location
Alice,Engineering,95000.00,5,Seattle
Bob,Sales,72000.00,3,New York`;

    // Only name and salary are extracted
    EmployeeSummary[] summaries = check csv:parseString(csvData);
}
```

## Custom Delimiters and Options

Configure parsing behavior for TSV, pipe-delimited, or other non-standard formats.

1. **Define the record type** — Navigate to **Types** and click **+**. Select **Create from scratch**, set **Kind** to **Record**, and name it `LogEntry`. Add fields: `timestamp` (string), `level` (string), `message` (string).

2. **Add a Variable step** — Click **+** and select **Statement** → **Declare Variable**. Set the type to `string` and the name to `tsvData`. Switch the toggle from **Record** to **Expression**, then enter the tab-separated string value.

3. **Parse with custom delimiter** — Click **+** and select **Call Function**. Search for `parseString` and select it under **data.csv**. Configure:
   - **Csv String***: `tsvData`
   - **Result***: `logs`
   - **T***: `LogEntry[]`

   Under **Advanced Configurations**:
   - **Options**: Switch the toggle from **Record** to **Expression**, then enter `{delimiter: "\t"}`

   ![Flow designer showing CSV parse with custom delimiter configuration](/img/develop/transform/csv-flat-file/csv-custom-delimiters-flow.png)

```ballerina
import ballerina/data.csv;

type LogEntry record {|
    string timestamp;
    string level;
    string message;
|};

public function main() returns error? {
    // Tab-separated values
    string tsvData = string `timestamp	level	message
2025-03-15T10:00:00Z	INFO	Service started
2025-03-15T10:01:23Z	ERROR	Connection refused`;

    LogEntry[] logs = check csv:parseString(tsvData, {delimiter: "\t"});
}
```

## Headerless CSV

Parse CSV files that have no header row by specifying `{header: null}` and using array-based output or mapping by position.

1. **Declare the CSV data variable** — In the flow designer, click **+** and select **Statement** → **Declare Variable**. Set the type to `string` and the name to `csvData`. Switch the toggle from **Record** to **Expression**, then enter the headerless CSV string value (no header row).

2. **Parse as headerless CSV** — Click **+** and select **Call Function**. Search for `parseString` and select it under **data.csv**. Configure:
   - **Csv String***: `csvData`
   - **Result***: `rows`
   - **T***: `string[][]`

   Under **Advanced Configurations**:
   - **Options**: Switch the toggle from **Record** to **Expression**, then enter `{header: null}`

   ![Flow designer showing headerless CSV parsing into string arrays](/img/develop/transform/csv-flat-file/csv-headerless-flow.png)

```ballerina
import ballerina/data.csv;

public function main() returns error? {
    string csvData = string `Alice,Engineering,95000
Bob,Sales,72000`;

    // Parse into arrays of strings
    string[][] rows = check csv:parseString(csvData, {header: null});
}
```

## Writing CSV Output

Write record arrays directly to CSV files using `io:fileWriteCsv()`.

1. **Define the record type** — Navigate to **Types** and click **+**. Select **Create from scratch**, set **Kind** to **Record**, and name it `Product`. Add fields: `sku` (string), `name` (string), `price` (decimal), `stock` (int). For details on creating types, see [Types](../integration-artifacts/supporting/types.md).

2. **Add a Variable step** — Click **+** and select **Statement** → **Declare Variable**. Set the name to `products`, type to `Product[]`. Switch the toggle to **Expression** and enter the array of product records.

3. **Write to CSV file** — Click **+** and select **Call Function**. Search under **io** and select `fileWriteCsv`. Configure:
   - **Path***: `products.csv`
   - **Content***: `products`

   ![Flow designer showing CSV transform and file write steps](/img/develop/transform/csv-flat-file/csv-writing-flow.png)

```ballerina
import ballerina/io;

type Product record {|
    string sku;
    string name;
    decimal price;
    int stock;
|};

public function main() returns error? {
    Product[] products = [
        {sku: "WDG-01", name: "Widget", price: 29.99, stock: 150},
        {sku: "GDG-02", name: "Gadget", price: 49.99, stock: 42},
        {sku: "GZM-03", name: "Gizmo", price: 19.99, stock: 0}
    ];

    check io:fileWriteCsv(path = "products.csv", content = products);
}
```

## Transforming Between Record Types

Use `csv:transform()` to reshape CSV data from one record type to another.

1. **Define the source and target record types** — Navigate to **Types** and click **+**. Create two records:
   - `RawOrder` with fields: `order_id` (string), `customer_name` (string), `item_sku` (string), `quantity` (string), `unit_price` (string) — all strings since this is the raw CSV data.
   - `ProcessedOrder` with fields: `orderId` (string), `customer` (string), `total` (decimal).

   For details on creating types, see [Types](../integration-artifacts/supporting/types.md).

2. **Add a Variable step** — Click **+** and select **Statement** → **Declare Variable**. Set the type to `string` and the name to `csvData`. Switch the toggle to **Expression** and enter the CSV string value.

3. **Parse the CSV string** — Click **+** and select **Call Function**. Search for `parseString` and select it under **data.csv**. Configure:
   - **Csv String***: `csvData`
   - **Result***: `raw`
   - **T***: `RawOrder[]`

4. **Transform using a query expression** — Click **+** and select **Statement** → **Declare Variable**. Set the name to `processed`, type to `ProcessedOrder[]`. Switch the toggle to **Expression** and enter the full query expression:

   ```
   from RawOrder r in raw
   let int qty = check int:fromString(r.quantity)
   let decimal price = check decimal:fromString(r.unit_price)
   select {
       orderId: r.order_id,
       customer: r.customer_name,
       total: <decimal>qty * price
   }
   ```

5. **Iterate and print results** — Click **+** and select **Foreach** under **Control**. Set:
   - **Collection***: `processed`
   - **Variable Name***: `ord`
   - **Variable Type***: `ProcessedOrder`

   Inside the Foreach body, add a **Call Function** → **io** → `println` to print the order details.

   ![Flow designer showing CSV parse, query transform, and foreach output steps](/img/develop/transform/csv-flat-file/csv-transform-flow.png)

```ballerina
import ballerina/data.csv;
import ballerina/io;

type RawOrder record {|
    string order_id;
    string customer_name;
    string item_sku;
    string quantity;
    string unit_price;
|};

type ProcessedOrder record {|
    string orderId;
    string customer;
    decimal total;
|};

public function main() returns error? {
    string csvData = string `order_id,customer_name,item_sku,quantity,unit_price
ORD-001,Acme Corp,WDG-01,5,29.99
ORD-002,Globex Inc,GDG-02,2,49.99`;

    RawOrder[] raw = check csv:parseString(csvData);

    // Transform to a different record type
    ProcessedOrder[] processed = from RawOrder r in raw
        let int qty = check int:fromString(r.quantity)
        let decimal price = check decimal:fromString(r.unit_price)
        select {
            orderId: r.order_id,
            customer: r.customer_name,
            total: <decimal>qty * price
        };

    foreach ProcessedOrder ord in processed {
        io:println(string `${ord.orderId}: ${ord.customer} - $${ord.total}`);
    }
}
```

## Fail-Safe Processing

When parsing CSV data, rows may contain invalid or malformed values (for example, `"INVALID"` where a `decimal` is expected). By default, `csv:parseString` fails on the first bad row. The `failSafe` option allows parsing to continue — invalid rows are skipped and errors are logged to the console and/or a file.

1. **Define the record type** — Navigate to **Types** and click **+**. Select **Create from scratch**, set **Kind** to **Record**, and name it `Book`. Add fields: `name` (string), `author` (string), `price` (decimal), `publishDate` (string).

2. **Add a Variable step** — Click **+** and select **Statement** → **Declare Variable**. Set the type to `string` and the name to `csvData`. Switch the toggle to **Expression** and enter the CSV string value. Include at least one row with invalid data to test fail-safe behavior (for example, `"INVALID"` in a decimal column).

3. **Parse with fail-safe options** — Click **+** and select **Call Function**. Search for `parseString` and select it under **data.csv**. Configure:
   - **Csv String***: `csvData`
   - **Result***: `books`
   - **T***: `Book[]`

   Under **Advanced Configurations**:
   - **Options**: Switch the toggle to **Expression** and enter:
     ```
     {
         failSafe: {
             enableConsoleLogs: true,
             fileOutputMode: {
                 filePath: "./logs/book-errors.log",
                 contentType: csv:METADATA,
                 fileWriteOption: csv:APPEND
             }
         }
     }
     ```

   ![Flow designer showing fail-safe CSV parsing configuration](/img/develop/transform/csv-flat-file/csv-failsafe-flow.png)

```ballerina
import ballerina/data.csv;
import ballerina/io;

type Book record {|
    string name;
    string author;
    decimal price;
    string publishDate;
|};

public function main() returns error? {
    string csvData = string `name,author,price,publishDate
Clean Code,Robert Martin,25.50,2008-08-01
Design Patterns,Gang of Four,INVALID,1994-10-31`;

    Book[] books = check csv:parseString(csvData, {
        failSafe: {
            enableConsoleLogs: true,
            fileOutputMode: {
                filePath: "./logs/book-errors.log",
                contentType: csv:METADATA,
                fileWriteOption: csv:APPEND
            }
        }
    });
    io:println(books);
}
```

The invalid row ("Design Patterns") is skipped, an error is logged, and only valid rows are returned. The error is also written to the log file at the specified path.

## Edge Cases

### Quoted fields and special characters

The `ballerina/data.csv` module handles RFC 4180 compliant CSV by default, including quoted fields with commas, newlines, and escaped quotes.

### Encoding

Specify byte encoding when reading files with non-UTF-8 content by converting to byte arrays before parsing.

### Large files

Use `csv:parseStream()` or `csv:parseToStream()` for memory-efficient processing of large CSV files. The stream-based API processes records incrementally without loading the entire file.

## What's Next

- [EDI Processing](edi.md) -- Enterprise data interchange formats
