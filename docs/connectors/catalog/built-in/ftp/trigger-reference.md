# Triggers

The `ballerina/ftp` connector supports event-driven file processing through a polling-based listener. The `ftp:Listener` periodically monitors a configured directory on a remote FTP/SFTP server for file changes and delivers new file content to your service callbacks in the format you choose — bytes, text, JSON, XML, or CSV.

Three components work together:

| Component | Role |
|-----------|------|
| `ftp:Listener` | Polls a remote FTP/SFTP directory at a configurable interval and detects new or deleted files. |
| `ftp:Service` | Defines callbacks that are invoked when file changes are detected. Each callback receives file content in a specific format. |
| `ftp:Caller` | An FTP client passed to callbacks, enabling additional file operations (read, write, move, delete) within the handler. |
| `ftp:WatchEvent` | The event payload for `onFileChange`, containing lists of added and deleted files. |
| `ftp:FileInfo` | Metadata record describing a remote file — path, name, size, timestamps, and attributes. |

For action-based operations, see the [Action Reference](action-reference.md).

---

## Listener

The `ftp:Listener` establishes the connection and manages event subscriptions.

### Configuration

The listener supports the following connection strategies:

| Config Type | Description |
|-------------|-------------|
| `ListenerConfiguration` | Configuration for the FTP/SFTP listener including connection details, authentication, and polling settings. |

**`ListenerConfiguration` fields:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `protocol` | <code>Protocol</code> | `FTP` | The file transfer protocol to use (`FTP`, `FTPS`, or `SFTP`). |
| `host` | <code>string</code> | `"127.0.0.1"` | Hostname or IP address of the FTP server. |
| `port` | <code>int</code> | `21` | Port number of the FTP server. |
| `auth` | <code>AuthConfiguration</code> | `()` | Authentication configuration including credentials and/or SSH key settings. |
| `pollingInterval` | <code>decimal</code> | `60` | Interval in seconds between directory polls. |
| `userDirIsRoot` | <code>boolean</code> | `false` | Whether to treat the user's home directory as the root directory. |
| `laxDataBinding` | <code>boolean</code> | `false` | When `true`, data binding errors return `()` instead of an error. |
| `connectTimeout` | <code>decimal</code> | `30.0` | Connection timeout in seconds. |
| `socketConfig` | <code>SocketConfig</code> | `()` | Socket timeout configuration. |
| `fileTransferMode` | <code>FileTransferMode</code> | `BINARY` | File transfer mode (`BINARY` or `ASCII`). |
| `retryConfig` | <code>RetryConfig</code> | `()` | Retry configuration for failed polling attempts. |

### Initializing the listener

**Using FTP with username and password:**

```ballerina
import ballerina/ftp;

configurable string host = ?;
configurable int port = ?;
configurable string username = ?;
configurable string password = ?;

listener ftp:Listener ftpListener = check new (
    protocol = ftp:FTP,
    host = host,
    port = port,
    auth = {
        credentials: {
            username: username,
            password: password
        }
    },
    pollingInterval = 10
);
```

**Using SFTP with private key authentication:**

```ballerina
import ballerina/ftp;

configurable string host = ?;
configurable int port = ?;
configurable string username = ?;
configurable string privateKeyPath = ?;
configurable string privateKeyPassword = ?;

listener ftp:Listener sftpListener = check new (
    protocol = ftp:SFTP,
    host = host,
    port = port,
    auth = {
        credentials: {
            username: username
        },
        privateKey: {
            path: privateKeyPath,
            password: privateKeyPassword
        }
    },
    pollingInterval = 10
);
```

---

## Service

An `ftp:Service` is a Ballerina service attached to an `ftp:Listener`. It monitors a configured directory on the remote server using the `@ftp:ServiceConfig` annotation and implements one callback to handle file events. Choose the callback that matches the format you want to receive file content in.

### Callback signatures

| Function | Signature | Description |
|----------|-----------|-------------|
| `onFileChange` | <code>remote function onFileChange(ftp:WatchEvent event, ftp:Caller caller) returns error?</code> | Invoked when files are added or deleted. Receives a WatchEvent with added and deleted file lists. The `ftp:Caller` parameter is optional. |
| `onFileBytes` | <code>remote function onFileBytes(byte[] content, ftp:FileInfo fileInfo, ftp:Caller caller) returns error?</code> | Invoked for each new file, delivering content as a byte array. The `ftp:Caller` parameter is optional. |
| `onFileText` | <code>remote function onFileText(string content, ftp:FileInfo fileInfo, ftp:Caller caller) returns error?</code> | Invoked for each new file, delivering content as a string. The `ftp:Caller` parameter is optional. |
| `onFileJson` | <code>remote function onFileJson(json content, ftp:FileInfo fileInfo, ftp:Caller caller) returns error?</code> | Invoked for each new file, delivering content as a JSON value. The `ftp:Caller` parameter is optional. |
| `onFileXml` | <code>remote function onFileXml(xml content, ftp:FileInfo fileInfo, ftp:Caller caller) returns error?</code> | Invoked for each new file, delivering content as an XML value. The `ftp:Caller` parameter is optional. |
| `onFileCsv` | <code>remote function onFileCsv(stream&lt;string[], io:Error?&gt; csvStream, ftp:FileInfo fileInfo, ftp:Caller caller) returns error?</code> | Invoked for each new CSV file, delivering content as a stream of rows. The `ftp:Caller` parameter is optional. |

Implement only one callback per service — `onFileChange`, `onFileBytes`, `onFileText`, `onFileJson`, `onFileXml`, or `onFileCsv`. The callback you choose determines the format in which file content is delivered.

### Full usage example

```ballerina
import ballerina/ftp;
import ballerina/io;
import ballerina/log;

configurable string host = ?;
configurable int port = ?;
configurable string username = ?;
configurable string password = ?;

listener ftp:Listener sftpListener = check new (
    protocol = ftp:SFTP,
    host = host,
    port = port,
    auth = {
        credentials: {
            username: username,
            password: password
        }
    },
    pollingInterval = 10
);

@ftp:ServiceConfig {
    path: "/home/user/incoming",
    fileNamePattern: "(.*).csv"
}
service "CsvFileProcessor" on sftpListener {

    remote function onFileCsv(stream<string[], io:Error?> csvStream, ftp:FileInfo fileInfo,
            ftp:Caller caller) returns error? {
        log:printInfo("Processing file: " + fileInfo.name);
        check from string[] row in csvStream
            do {
                log:printInfo("Row: " + row.toString());
            };
        // Move the processed file to an archive directory
        check caller->move(fileInfo.path, "/home/user/archive/" + fileInfo.name);
    }
}
```

Use the `@ftp:ServiceConfig` annotation to specify the `path` to monitor and an optional `fileNamePattern` regex to filter files. You can also use `@ftp:FunctionConfig` on individual callbacks to set per-function file patterns and post-processing actions (`afterProcess` and `afterError` — `MOVE` or `DELETE`).

---

## Supporting types

### `WatchEvent`

| Field | Type | Description |
|-------|------|-------------|
| `addedFiles` | <code>FileInfo[]</code> | Array of metadata records for files that were added since the last poll. |
| `deletedFiles` | <code>string[]</code> | Array of file paths that were deleted since the last poll. |

### `FileInfo`

| Field | Type | Description |
|-------|------|-------------|
| `path` | <code>string</code> | The full path of the file on the remote server. |
| `name` | <code>string</code> | The file name. |
| `size` | <code>int</code> | The file size in bytes. |
| `lastModifiedTimestamp` | <code>int</code> | The Unix timestamp (milliseconds) of the last modification. |
| `isFolder` | <code>boolean</code> | Whether the entry is a directory. |
| `isFile` | <code>boolean</code> | Whether the entry is a regular file. |
| `isReadable` | <code>boolean</code> | Whether the file is readable. |
| `isWritable` | <code>boolean</code> | Whether the file is writable. |
| `extension` | <code>string</code> | The file extension. |

### `AuthConfiguration`

| Field | Type | Description |
|-------|------|-------------|
| `credentials` | <code>Credentials</code> | Username and password credentials for authentication. |
| `privateKey` | <code>PrivateKey</code> | SSH private key configuration for SFTP authentication. |
| `secureSocket` | <code>SecureSocket</code> | SSL/TLS configuration for FTPS connections. |
| `preferredMethods` | <code>PreferredMethod[]</code> | Preferred authentication methods in order of priority (default: `[PUBLICKEY, PASSWORD]`). |

### `Credentials`

| Field | Type | Description |
|-------|------|-------------|
| `username` | <code>string</code> | The username for authentication. |
| `password` | <code>string?</code> | The password for authentication. |

### `PrivateKey`

| Field | Type | Description |
|-------|------|-------------|
| `path` | <code>string</code> | Path to the SSH private key file. |
| `password` | <code>string?</code> | Passphrase for the private key, if encrypted. |
