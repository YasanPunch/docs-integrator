---
title: Triggers
---

# Triggers

The `ballerinax/mssql` connector supports event-driven integration through Debezium-based Change Data Capture (CDC). When records are created, updated, deleted, or read during an initial snapshot in CDC-enabled tables, the listener receives change events in real time, triggering your service callbacks automatically.

Three components work together:

| Component | Role |
|-----------|------|
| `mssql:CdcListener` | Connects to MSSQL via Debezium and streams change events from CDC-enabled tables. |
| `cdc:Service` | Defines the `onRead`, `onCreate`, `onUpdate`, `onDelete`, and `onError` callbacks invoked per event. |
| `record {}` | The change event payload passed to each callback, representing the row data before and/or after the change. |

For action-based record operations, see the [Action Reference](action-reference.md).

---

## Listener

The `mssql:Listener` establishes the connection and manages event subscriptions.

### Configuration

The listener supports the following connection strategies:

| Config Type | Description |
|-------------|-------------|
| `MsSqlListenerConfiguration` | Configuration for the MSSQL CDC listener, combining database connection settings with CDC-specific options. |

`MsSqlListenerConfiguration` fields:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `database.hostname` | `string` | `"localhost"` | Hostname of the MSSQL server. |
| `database.port` | `int` | `1433` | Port number of the MSSQL server. |
| `database.databaseNames` | `string\|string[]` | Required | Name(s) of the database(s) to capture changes from. |
| `database.databaseInstance` | `string` | `()` | Named SQL Server instance, if applicable. |
| `database.includedSchemas` | `string\|string[]` | `()` | Schema(s) to include in CDC capture (e.g., `"dbo"`). |
| `database.excludedSchemas` | `string\|string[]` | `()` | Schema(s) to exclude from CDC capture. |
| `database.tasksMax` | `int` | `1` | Maximum number of CDC tasks. |
| `includedTables` | `string[]?` | `()` | List of fully-qualified table names to monitor (e.g., `["dbo.Employees"]`). |
| `excludedTables` | `string[]?` | `()` | List of fully-qualified table names to exclude from monitoring. |
| `offsetStorage` | `cdc:FileOffsetBackingStore\|cdc:KafkaOffsetBackingStore` | File-based | Offset storage backend for tracking CDC position. |
| `offsetFlushIntervalMs` | `int` | `60000` | Interval in milliseconds between offset flushes. |

### Initializing the listener

**Basic CDC listener for a single database:**

```ballerina
import ballerinax/mssql;
import ballerinax/mssql.cdc.driver as _;

configurable string host = ?;
configurable int port = ?;
configurable string user = ?;
configurable string password = ?;
configurable string database = ?;

listener mssql:CdcListener cdcListener = new ({
    database: {
        hostname: host,
        port: port,
        username: user,
        password: password,
        databaseNames: database
    },
    includedTables: ["dbo.Transactions"]
});
```

---

## Service

A `cdc:Service` is a Ballerina service attached to a `mssql:CdcListener`. It listens for change events on the configured CDC-enabled tables and implements callbacks for each event type.

### Callback signatures

| Function | Signature | Description |
|----------|-----------|-------------|
| `onRead` | `remote function onRead(record {} after) returns cdc:Error?` | Invoked for each existing record during the initial CDC snapshot. |
| `onCreate` | `remote function onCreate(record {} after) returns cdc:Error?` | Invoked when a new record is inserted. |
| `onUpdate` | `remote function onUpdate(record {} before, record {} after) returns cdc:Error?` | Invoked when an existing record is updated. Receives both the before and after state. |
| `onDelete` | `remote function onDelete(record {} before) returns error?` | Invoked when a record is deleted. Receives the record state before deletion. |
| `onError` | `remote function onError(cdc:Error e)` | Invoked when a CDC processing error occurs. |

You do not need to implement all callbacks. Only implement the event types relevant to your use case.

### Full usage example

```ballerina
import ballerina/log;
import ballerinax/mssql;
import ballerinax/mssql.cdc.driver as _;

configurable string host = ?;
configurable int port = ?;
configurable string user = ?;
configurable string password = ?;
configurable string database = ?;

listener mssql:CdcListener cdcListener = new ({
    database: {
        hostname: host,
        port: port,
        username: user,
        password: password,
        databaseNames: database
    },
    includedTables: ["dbo.Transactions"]
});

service on cdcListener {
    remote function onCreate(record {} after) returns cdc:Error? {
        log:printInfo("New record created", data = after.toString());
    }

    remote function onUpdate(record {} before, record {} after) returns cdc:Error? {
        log:printInfo("Record updated",
            before = before.toString(),
            after = after.toString()
        );
    }

    remote function onDelete(record {} before) returns error? {
        log:printInfo("Record deleted", data = before.toString());
    }

    remote function onError(cdc:Error e) {
        log:printError("CDC error", 'error = e);
    }
}
```

CDC must be enabled on the SQL Server database and the specific tables you want to monitor. Use `sys.sp_cdc_enable_db` and `sys.sp_cdc_enable_table` to enable CDC at the database and table level.

---

## Supporting types

### `MsSqlDatabaseConnection`

| Field | Type | Description |
|-------|------|-------------|
| `hostname` | `string` | Hostname of the MSSQL server (default: `"localhost"`). |
| `port` | `int` | Port number of the MSSQL server (default: `1433`). |
| `username` | `string` | Database username for the CDC connection. |
| `password` | `string` | Database password for the CDC connection. |
| `databaseNames` | `string\|string[]` | Name(s) of the database(s) to capture changes from. |
| `databaseInstance` | `string?` | Named SQL Server instance, if applicable. |
| `includedSchemas` | `string\|string[]?` | Schema(s) to include in CDC capture. |
| `excludedSchemas` | `string\|string[]?` | Schema(s) to exclude from CDC capture. |
| `tasksMax` | `int` | Maximum number of CDC tasks (default: `1`). |
