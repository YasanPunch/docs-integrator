---
title: FTP
---

FTP (File Transfer Protocol) is a standard network protocol used for transferring files between a client and a server. The Ballerina `ballerina/ftp` connector (v2.18.0) provides programmatic access to FTP, FTPS, and SFTP servers, enabling you to read, write, and manage remote files and directories, as well as listen for file change events in your Ballerina integration flows.

## Key Features

- Read remote files in multiple formats — bytes, text, JSON, XML, and CSV — with built-in data binding
- Write files to remote servers in bytes, text, JSON, XML, and CSV formats with overwrite or append options
- Stream-based reading and writing for large files using byte and CSV streams
- Directory management including create, remove, list, and directory detection
- File management operations including rename, move, copy, delete, existence check, and size retrieval
- Event-driven file monitoring with a polling-based listener that detects new and deleted files
- Support for FTP, FTPS (FTP over SSL/TLS), and SFTP (FTP over SSH) protocols
- Built-in retry and circuit breaker support for resilient file transfer operations

## Actions

Actions are operations you invoke on remote FTP/SFTP servers from your integration — reading files, uploading content, managing directories, and more. The FTP connector exposes actions through a single client:

| Client | Actions |
|--------|---------|
| `Client` | File read/write in multiple formats, directory management, file operations, streaming |

See the **[Action Reference](action-reference.md)** for the full list of operations, parameters, and sample code for each client.

## Triggers

Triggers allow your integration to react to file changes on a remote FTP/SFTP server in real time. The connector uses a polling-based `ftp:Listener` that periodically checks a configured directory for new or deleted files and invokes your service callbacks automatically.

Supported trigger events:

| Event | Callback | Description |
|-------|----------|-------------|
| File change detected | `onFileChange` | Fired when files are added or deleted in the monitored directory, providing a WatchEvent with details. |
| File received as bytes | `onFileBytes` | Fired for each new file, delivering the content as a byte array. |
| File received as text | `onFileText` | Fired for each new file, delivering the content as a string. |
| File received as JSON | `onFileJson` | Fired for each new file, delivering the content as a JSON value with optional data binding. |
| File received as XML | `onFileXml` | Fired for each new file, delivering the content as an XML value with optional data binding. |
| File received as CSV | `onFileCsv` | Fired for each new file, delivering the content as a CSV stream or array. |

See the **[Trigger Reference](trigger-reference.md)** for listener configuration, service callbacks, and the event payload structure.

## Documentation

* **[Action Reference](action-reference.md)**: Full reference for all clients — operations, parameters, return types, and sample code.

* **[Trigger Reference](trigger-reference.md)**: Reference for event-driven integration using the listener and service model.

## How to contribute

As an open source project, WSO2 welcomes contributions from the community.

To contribute to the code for this module, please create a pull request in the following repository.

* [FTP Module GitHub repository](https://github.com/ballerina-platform/module-ballerina-ftp)

Check the issue tracker for open issues that interest you. We look forward to receiving your contributions.
