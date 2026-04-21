---
title: FTP / SFTP
---

# FTP / SFTP

FTP, SFTP, and FTPS [file integrations](/docs/get-started/key-concepts#file-integrations) poll remote file servers for new files and process them as they arrive. Use them for ETL pipelines, batch processing, and B2B integrations where partners exchange data as CSV, XML, JSON, or binary files.

| Protocol | Description | Transport security | Authentication |
|---|---|---|---|
| **FTP** | Standard file transfer protocol with no encryption. Suitable for internal networks or non-sensitive data. | None | Anonymous or username/password |
| **SFTP** | File transfer over an SSH tunnel. Use this for secure transfers when the remote server supports SSH. | SSH | Username/password or private key |
| **FTPS** | FTP extended with SSL/TLS encryption. Use this when the remote server requires FTP with certificate-based security. | SSL/TLS | Username/password with certificate verification |

## Creating an FTP service

1. Click **+ Add Artifact** in the canvas or click **+** next to **Entry Points** in the sidebar.
2. In the **Artifacts** panel, select **FTP / SFTP** under **File Integration**.

   ![Artifacts panel showing FTP / SFTP under File Integration](/img/develop/integration-artifacts/file/ftp-sftp/step-2.png)

3. In the creation form, fill in the following fields:

   ![FTP service creation form](/img/develop/integration-artifacts/file/ftp-sftp/step-creation-form.png)

   **Protocol**

   | Option | Description |
   |---|---|
   | **FTP** | Unsecured File Transfer Protocol. Default port: `21`. |
   | **SFTP** | FTP over SSH. Default port: `22`. Supports private key authentication. |
   | **FTPS** | FTP over SSL/TLS. Default port: `21`. |

   **Connection**

   | Field | Description |
   |---|---|
   | **Host** | Hostname or IP address of the remote server (e.g., `ftp.example.com`). Required. |
   | **Port Number** | Port to connect on. |

   **Authentication**

   | Option | Protocols | Description |
   |---|---|---|
   | **No Authentication** | FTP, SFTP, FTPS | Connects without credentials. Suitable for anonymous FTP servers. |
   | **Basic Authentication** | FTP, FTPS | Connects with a username and password. |
   | **Certificate Based Authentication** | SFTP only | Authenticates with an SSH private key. |

   **Monitoring Path**

   | Field | Description |
   |---|---|
   | **Monitoring Path** | Directory on the remote server to monitor for new files (e.g., `/uploads` or `/incoming`). Defaults to `/`. |

   When **ftps** is selected, an additional **Secure Socket** field is available under **Advanced Configurations** to configure SSL/TLS settings (certificate store, key store, and protocol version).

4. Click **Create**.

5. WSO2 Integrator opens the service in the **Service Designer**. The header shows the attached listener pill and the **File Handlers** section.

   ![Service Designer showing the FTP service canvas](/img/develop/integration-artifacts/file/ftp-sftp/step-service-designer.png)

6. Click **+ Add File Handler** to define how incoming files are processed.

**FTP with username and password:**

```ballerina
import ballerina/ftp;

configurable string host = "ftp.example.com";
configurable int port = 21;
configurable string username = ?;
configurable string password = ?;

listener ftp:Listener ftpListener = check new ({
    protocol: ftp:FTP,
    host: host,
    port: port,
    auth: {credentials: {username, password}}
});

@ftp:ServiceConfig {
    path: "/incoming"
}
service on ftpListener {
    remote function onFileText(string content, ftp:FileInfo fileInfo) returns error? {
        // Process text file content
    }
}
```

**SFTP with private key:**

```ballerina
import ballerina/ftp;

configurable string host = "sftp.partner.com";
configurable int port = 22;
configurable string username = ?;
configurable string privateKeyPath = ?;

listener ftp:Listener sftpListener = check new ({
    protocol: ftp:SFTP,
    host: host,
    port: port,
    auth: {
        credentials: {username},
        privateKey: {path: privateKeyPath}
    }
});

@ftp:ServiceConfig {
    path: "/data/inbound"
}
service on sftpListener {
    remote function onFileCsv(string[][] content, ftp:FileInfo fileInfo) returns error? {
        // Process CSV rows
    }
}
```

**FTPS with username and password:**

```ballerina
import ballerina/ftp;

configurable string host = "ftps.example.com";
configurable int port = 21;
configurable string username = ?;
configurable string password = ?;

listener ftp:Listener ftpsListener = check new ({
    protocol: ftp:FTPS,
    host: host,
    port: port,
    auth: {credentials: {username, password}}
});

@ftp:ServiceConfig {
    path: "/incoming"
}
service on ftpsListener {
    remote function onFileText(string content, ftp:FileInfo fileInfo) returns error? {
        // Process text file content
    }
}
```

**FTPS with a custom SSL/TLS configuration:**

```ballerina
import ballerina/ftp;

configurable string host = "ftps.example.com";
configurable int port = 21;
configurable string username = ?;
configurable string password = ?;

listener ftp:Listener ftpsListener = check new ({
    protocol: ftp:FTPS,
    host: host,
    port: port,
    auth: {credentials: {username, password}},
    secureSocket: {
        cert: "/path/to/server-cert.pem"
    }
});

@ftp:ServiceConfig {
    path: "/incoming"
}
service on ftpsListener {
    remote function onFileText(string content, ftp:FileInfo fileInfo) returns error? {
        // Process text file content
    }
}
```

## Service and listener

An FTP/SFTP integration uses two constructs that serve different roles:

| Construct | Role | Configured with |
|---|---|---|
| **Listener** (`ftp:Listener`) | Represents the **connection to the remote server**. Handles protocol, host, port, authentication, and polling interval. One listener connects to one server. | Constructor arguments |
| **Service** (`ftp:Service`) | Represents the **processing logic for a specific directory**. Defines which path to monitor, file filters, and file handlers. | `@ftp:ServiceConfig` annotation |

Multiple services can share the same listener. For example, if you need to monitor `/orders` and `/invoices` on the same FTP server, create one listener and attach two services to it:

```ballerina
listener ftp:Listener ftpListener = new (
    host = "ftp.example.com",
    auth = {credentials: {username: ftpUser, password: ftpPassword}},
    pollingInterval = 30
);

@ftp:ServiceConfig { path: "/orders", fileNamePattern: ".*\\.csv" }
service on ftpListener {
    remote function onFileCsv(string[][] content, ftp:FileInfo fileInfo) returns error? {
        // Process order CSVs
    }
}

@ftp:ServiceConfig { path: "/invoices", fileNamePattern: ".*\\.xml" }
service on ftpListener {
    remote function onFileXml(xml content, ftp:FileInfo fileInfo) returns error? {
        // Process invoice XMLs
    }
}
```

For the general concept, see [Services and listeners](/docs/get-started/key-concepts#services-and-listeners). For the language-level details, see [Integration-specific features](../../../reference/language/integration-features.md).

## Service configuration

The `@ftp:ServiceConfig` annotation controls **what** the service monitors — the directory path, file filters, age constraints, and dependency conditions.

In the **Service Designer**, click **Configure** to open the **FTP Integration Configuration** panel.

| Field | Description |
|---|---|
| **Service Configuration** | Service-level settings. Accepts an `@ftp:ServiceConfig` record expression. |

Expand **Advanced Configurations** to access file name pattern, age filter, and dependency conditions.

```ballerina
@ftp:ServiceConfig {
    path: "/incoming/orders",
    fileNamePattern: ".*\\.csv",
    fileAgeFilter: {
        minAge: 30,
        maxAge: 3600
    }
}
service on ftpListener {
}
```

`@ftp:ServiceConfig` fields:

| Field | Type | Default | Description |
|---|---|---|---|
| `path` | `string` | `"/"` | Directory on the remote server to monitor for new files. |
| `fileNamePattern` | `string?` | — | Regex to filter which files trigger handlers. Only matching files are processed. |
| `fileAgeFilter` | `FileAgeFilter?` | — | Age bounds to skip files that are too new (still uploading) or too old (stale). See [File dependency and trigger conditions](file-dependency-triggers.md). |
| `fileDependencyConditions` | `FileDependencyCondition[]?` | — | Conditions that block processing until related files exist. See [File dependency and trigger conditions](file-dependency-triggers.md). |

Under **Attached Listeners**, select **ftpListener** to configure the listener the service is attached to.

## Listener configuration

The listener controls **how** to connect — protocol, host, authentication, polling interval, and connection behaviour. One listener represents one connection to one remote server.

In the **FTP Integration Configuration** panel, select **ftpListener** under **Attached Listeners**.

| Field | Description | Default |
|---|---|---|
| **Name** | Identifier for this listener. | `ftpListener` |
| **Protocol** | Connection protocol: `ftp:FTP` (unsecured), `ftp:SFTP` (over SSH), or `ftp:FTPS` (over SSL/TLS). | `ftp:FTP` |
| **Host** | Hostname or IP address of the remote server. | `"127.0.0.1"` |
| **Port** | Port number of the remote server. | `21` |
| **Auth** | Authentication record. See [Authentication](#authentication). | — |
| **Polling Interval** | Seconds between polls for new files. | `60` |
| **User Dir Is Root** | If `true`, treats the login home directory as `/` and prevents directory-change commands. Set this for chrooted or jailed servers. | `false` |

Expand **Advanced Configurations** for additional settings.

```ballerina
listener ftp:Listener ftpListener = new (
    protocol = ftp:FTP,
    host = "ftp.example.com",
    port = 21,
    auth = {
        credentials: {
            username: "user1",
            password: "pass456"
        }
    },
    pollingInterval = 30
);
```

`ListenerConfiguration` fields:

| Field | Type | Default | Description |
|---|---|---|---|
| `protocol` | `ftp:Protocol` | `ftp:FTP` | Connection protocol (`FTP`, `SFTP`, or `FTPS`). |
| `host` | `string` | `"127.0.0.1"` | Hostname or IP address of the remote server. |
| `port` | `int` | `21` | Port number of the remote server. |
| `auth` | `ftp:AuthConfiguration?` | — | Authentication credentials or private key. See [Authentication](#authentication). |
| `pollingInterval` | `decimal` | `60` | Interval in seconds between directory polls. |
| `userDirIsRoot` | `boolean` | `false` | Treat the login home directory as root and prevent directory-change commands. |
| `laxDataBinding` | `boolean` | `false` | When `true`, data binding errors return `()` instead of an error. |
| `connectTimeout` | `decimal` | `30.0` | Connection timeout in seconds. |
| `socketConfig` | `ftp:SocketConfig?` | — | Socket timeout configuration. |
| `fileTransferMode` | `ftp:FileTransferMode` | `BINARY` | File transfer mode (`BINARY` or `ASCII`). Use `ASCII` only for text-only files on servers that require line-ending conversion. |
| `retryConfig` | `ftp:RetryConfig?` | — | Retry configuration for failed polling attempts. See [Resiliency](resiliency.md). |
| `coordination` | `ftp:CoordinationConfig?` | — | Distributed coordination for multi-instance deployments. See [High availability](high-availability.md). |

## Authentication

FTP and FTPS support no authentication and basic authentication (username/password). SFTP additionally supports private key authentication. FTPS also accepts an optional `secureSocket` configuration for SSL/TLS certificate verification.

### No authentication

Connects without credentials. Suitable for anonymous FTP servers.

```ballerina
listener ftp:Listener ftpListener = check new ({
    protocol: ftp:FTP,
    host: "ftp.example.com",
    port: 21
});
```

### Username and password

Connects with a username and password. Suitable for FTP, SFTP, and FTPS.

In the creation form, select **Basic Authentication**. In the **Configure** panel, enter the `auth` record under **Configuration for ftpListener**:

```
{credentials: {username: "myuser", password: "mypass"}}
```

```ballerina
configurable string username = ?;
configurable string password = ?;

listener ftp:Listener ftpListener = check new ({
    protocol: ftp:FTP,
    host: "ftp.example.com",
    port: 21,
    auth: {credentials: {username, password}}
});
```

### Private key (SFTP)

Authenticates using an SSH private key. Recommended for SFTP.

In the **Configure** panel, enter the `auth` record under **Configuration for ftpListener**:

```
{
    credentials: {username: "myuser"},
    privateKey: {path: "/path/to/private_key"}
}
```

```ballerina
configurable string username = ?;
configurable string privateKeyPath = ?;

listener ftp:Listener sftpListener = check new ({
    protocol: ftp:SFTP,
    host: "sftp.partner.com",
    port: 22,
    auth: {
        credentials: {username},
        privateKey: {path: privateKeyPath},
        preferredMethods: [ftp:PUBLICKEY, ftp:PASSWORD]
    }
});
```

`ftp:AuthConfiguration` fields:

| Field | Type | Default | Description |
|---|---|---|---|
| `credentials` | `ftp:Credentials?` | — | Username and optional password |
| `privateKey` | `ftp:PrivateKey?` | — | Path to private key file and optional passphrase |
| `preferredMethods` | `ftp:PreferredMethod[]` | `[PUBLICKEY, PASSWORD]` | Authentication method priority order |

### SSL/TLS configuration (FTPS)

FTPS encrypts the control and data channels using SSL/TLS. In addition to `auth`, pass a `secureSocket` record to the listener to control certificate verification and key material.

In the **Configure** panel, expand **Advanced Configurations** and enter the `secureSocket` record under **Configuration for ftpsListener**:

```
{
    cert: "/path/to/server-cert.pem"
}
```

To disable certificate verification in non-production environments, set `verifyHostname` to `false` in the record.

```ballerina
configurable string username = ?;
configurable string password = ?;

listener ftp:Listener ftpsListener = check new ({
    protocol: ftp:FTPS,
    host: "ftps.example.com",
    port: 21,
    auth: {credentials: {username, password}},
    secureSocket: {
        cert: "/path/to/server-cert.pem"
    }
});
```

`ftp:SecureSocket` fields:

| Field | Type | Description |
|---|---|---|
| `cert` | `string\|ftp:TrustStore?` | Path to the trusted server certificate (PEM) or a truststore record. |
| `key` | `ftp:CertKey?` | Client certificate and private key for mutual TLS. |
| `protocol` | `record{name: ftp:TLS, versions: string[]}?` | TLS protocol version constraint (e.g., `TLSv1.2`). |
| `verifyHostname` | `boolean` | Whether to validate the server hostname against the certificate. Default: `true`. |

## File handlers

A file handler is a `remote function` that WSO2 Integrator calls each time the polling interval detects new or deleted files in the monitored directory.

### Adding a file handler

In the **Service Designer**, click **+ Add File Handler**. The **New On Create Handler Configuration** panel opens on the right.

![File handler configuration panel](/img/develop/integration-artifacts/file/ftp-sftp/step-add-file-handler.png)

| Field | Description |
|---|---|
| **File Format** | The format of incoming files. Determines the content type passed to your handler. Options: **CSV**, **JSON**, **XML**, **Text**, **Bytes**. |
| **Rows** | (CSV only) Content schema contains a row of CSV Row type. |
| **Stream (Large Files)** | Process the file content in chunks instead of loading it all into memory. Suitable for large files. |
| **+ Define Row Schema** | (CSV only) Define the schema for CSV row records. |
| **After File Processing — Success** | Action to take when the handler completes without error: **Move** to a destination path or **Delete** the file. |
| **After File Processing — Error** | Action to take when the handler returns an error: **Move** to an error directory or **Delete** the file. |
| **File Metadata (fileInfo)** | Include `ftp:FileInfo` as a parameter in the handler function, giving access to file name, path, size, and other metadata. |
| **FTP Connection (caller)** | Include `ftp:Caller` as a parameter, giving access to read/write operations on the same server. |

Click **Save** to add the handler.

The file handler is a typed `remote function` inside the service. WSO2 Integrator routes incoming files to the matching handler based on the function name. The file content is automatically read and passed as the first parameter.

**Text file handler:**

```ballerina
@ftp:ServiceConfig {
    path: "/incoming"
}
service on ftpListener {

    remote function onFileText(string content, ftp:FileInfo fileInfo) returns error? {
        // content contains the full file text
        // fileInfo.name, fileInfo.pathDecoded, fileInfo.size, etc.
    }
}
```

**CSV file handler (typed records):**

```ballerina
type Order record {
    string orderId;
    string product;
    int quantity;
};

@ftp:ServiceConfig {
    path: "/incoming"
}
service on ftpListener {

    remote function onFileCsv(Order[] content, ftp:FileInfo fileInfo) returns error? {
        foreach Order order in content {
            // Process each typed CSV row
        }
    }
}
```

**CSV streaming handler (large files):**

```ballerina
@ftp:ServiceConfig {
    path: "/incoming"
}
service on ftpListener {

    remote function onFileCsv(stream<string[], error?> content, ftp:FileInfo fileInfo) returns error? {
        check content.forEach(function(string[] row) returns error? {
            // Process each row without loading the whole file into memory
        });
    }
}
```

**JSON file handler:**

```ballerina
@ftp:ServiceConfig {
    path: "/incoming"
}
service on ftpListener {

    remote function onFileJson(json content, ftp:FileInfo fileInfo) returns error? {
        // content is the parsed JSON value
    }
}
```

**Binary file handler:**

```ballerina
@ftp:ServiceConfig {
    path: "/incoming"
}
service on ftpListener {

    remote function onFile(byte[] content, ftp:FileInfo fileInfo) returns error? {
        // content is the raw file bytes
    }
}
```

### File format options

The **File Format** field determines the handler function name and the type of the `content` parameter passed to it.

| Format | Handler function | Content type | Use when |
|---|---|---|---|
| **Text** | `onFileText` | `string` | Files are plain text (logs, EDI, custom formats). |
| **JSON** | `onFileJson` | `json` or a typed record | Files are JSON documents. |
| **XML** | `onFileXml` | `xml` or a typed record | Files are XML documents. |
| **CSV** | `onFileCsv` | `string[][]`, `record[]`, or a stream variant | Files are comma-separated values. Use a typed record to map rows automatically. Enable **Stream** for large files. |
| **Bytes** | `onFile` | `byte[]` or `stream<byte[], error?>` | Binary files or when you need raw byte access. Enable **Stream** for large files. |

### FileInfo

Each handler receives an `ftp:FileInfo` parameter with metadata about the incoming file.

| Field | Type | Description |
|---|---|---|
| `name` | `string` | File name without path |
| `path` | `string` | Full path on the remote server |
| `pathDecoded` | `string` | Normalized absolute path — use this for all `caller->` operations |
| `size` | `int` | File size in bytes |
| `lastModifiedTimestamp` | `int` | Last-modified time as UNIX epoch milliseconds |
| `extension` | `string` | File extension |
| `isFile` | `boolean` | `true` if the entry is a file |
| `isFolder` | `boolean` | `true` if the entry is a directory |

### Caller operations

For most use cases, the typed handler parameters (`string`, `json`, `xml`, records, streams) and `@ftp:FunctionConfig` post-processing actions are sufficient. When you need additional control — such as reading a related file, writing output to a different path, or managing files manually — add the `ftp:Caller` parameter to your handler. It provides typed read and write operations on the connected server using the same session.

**Reading files:**

| Operation | Return type | Description |
|---|---|---|
| `caller->getText(path)` | `string\|Error` | Read file as plain text |
| `caller->getBytes(path)` | `byte[]\|Error` | Read file as a byte array |
| `caller->getJson(path, typedesc)` | `T\|Error` | Read and deserialize JSON; pass a typed record `typedesc` to get a typed result |
| `caller->getXml(path, typedesc)` | `T\|Error` | Read and deserialize XML; pass a typed record `typedesc` to get a typed result |
| `caller->getCsv(path, typedesc)` | `T\|Error` | Read and parse CSV; pass `string[][]` or a record array `typedesc` |
| `caller->getBytesAsStream(path)` | `stream<byte[], error?>\|Error` | Read as a byte stream for large files |
| `caller->getCsvAsStream(path, typedesc)` | `stream<T, error?>\|Error` | Read CSV as a stream for large files |

**Writing files:**

All write operations accept a `ftp:FileWriteOption` third argument to control overwrite behaviour (`OVERWRITE` or `APPEND`).

| Operation | Description |
|---|---|
| `caller->putText(path, content, option)` | Write a string to a file |
| `caller->putBytes(path, content, option)` | Write a byte array to a file |
| `caller->putJson(path, content, option)` | Serialize and write JSON |
| `caller->putXml(path, content, option)` | Serialize and write XML |
| `caller->putCsv(path, content, option)` | Serialize and write CSV (`string[][]` or `record[]`) |
| `caller->putBytesAsStream(path, stream, option)` | Write a byte stream to a file |

**File management:**

| Operation | Return type | Description |
|---|---|---|
| `caller->delete(path)` | `Error?` | Delete a file |
| `caller->mkdir(path)` | `Error?` | Create a directory |
| `caller->exists(path)` | `boolean\|Error` | Check whether a path exists on the server |

### Post-processing: moving or deleting files

Use the `@ftp:FunctionConfig` annotation on a handler to automatically move or delete the file after processing, without manually calling `caller->` operations.

```ballerina
@ftp:ServiceConfig {
    path: "/incoming"
}
service on ftpListener {

    @ftp:FunctionConfig {
        afterProcess: {action: ftp:MOVE, destination: "/processed"},
        afterError: {action: ftp:MOVE, destination: "/errors"}
    }
    remote function onFileText(string content, ftp:FileInfo fileInfo) returns error? {
        check processFile(fileInfo.name, content);
    }
}
```

`@ftp:FunctionConfig` fields:

| Field | Type | Description |
|---|---|---|
| `fileNamePattern` | `string?` | Regex to filter which files this handler processes. Overrides the service-level pattern for this handler. |
| `afterProcess` | `record{action: MOVE\|DELETE, destination?: string}?` | Action to take when the handler returns without error. `destination` is required for `MOVE`. |
| `afterError` | `record{action: MOVE\|DELETE, destination?: string}?` | Action to take when the handler returns an error. `destination` is required for `MOVE`. |

## Writing output files

Use `ftp:Caller` inside your file handler to write results back to the same FTP or SFTP server. The caller reuses the existing connection — no separate client configuration is needed.

```ballerina
@ftp:ServiceConfig {
    path: "/incoming"
}
service on ftpListener {

    remote function onFileJson(json content, ftp:FileInfo fileInfo, ftp:Caller caller) returns error? {
        // Process the incoming JSON file
        json result = check transform(content);

        // Write the result to an output directory on the same server
        string outPath = string `/outgoing/${fileInfo.name}`;
        check caller->putJson(outPath, result);
    }
}
```

See [Caller operations](#caller-operations) for the full list of `caller->put*` write methods and `ftp:FileWriteOption` (overwrite or append).

## What's next

- [Local files](local-files.md) — monitor a local directory instead of a remote server
- [Connections](../supporting/connections.md) — reuse FTP connection credentials across services
- [Data Mapper](../supporting/data-mapper.md) — transform incoming file payloads between formats
- [FTP file processing tutorial](../../../tutorials/walkthroughs/edi-ftp-processing.md) — end-to-end walkthrough for EDI file processing over FTP
