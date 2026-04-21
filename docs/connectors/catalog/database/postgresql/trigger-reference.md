---
title: Triggers
---

# Triggers

The `ballerinax/postgresql` connector supports event-driven integration through Debezium-based Change Data Capture (CDC). When rows are inserted, updated, or deleted in PostgreSQL, the CDC listener captures WAL (Write-Ahead Log) events in real time, triggering your service callbacks automatically.

Three components work together:

| Component | Role |
|-----------|------|
| `postgresql:CdcListener` | Connects to PostgreSQL's logical replication stream via Debezium and captures row-level change events. |
| `cdc:Service` | Defines the `onRead`, `onCreate`, `onUpdate`, and `onDelete` callbacks invoked per change event. |

For action-based record operations, see the [Action Reference](action-reference.md).

---

## Listener

The `postgresql:Listener` establishes the connection and manages event subscriptions.

### Configuration

The listener supports the following connection strategies:

| Config Type | Description |
|-------------|-------------|
| `PostgresListenerConfiguration` | Configuration for the PostgreSQL CDC listener, including database connection and Debezium engine settings. |
| `PostgresDatabaseConnection` | Database connection settings for CDC. |

`PostgresListenerConfiguration` fields:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `database` | `PostgresDatabaseConnection` | Required | PostgreSQL database connection configuration. |

`PostgresDatabaseConnection` fields:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `hostname` | `string` | `"localhost"` | PostgreSQL server hostname. |
| `port` | `int` | `5432` | PostgreSQL server port. |
| `username` | `string` | Required | Database username with REPLICATION privilege. |
| `password` | `string` | Required | Database password. |
| `databaseName` | `string` | Required | Name of the database to capture changes from. |
| `includedSchemas` | `string\|string[]?` | `()` | Regex patterns for schemas to include in capture. |
| `excludedSchemas` | `string\|string[]?` | `()` | Regex patterns for schemas to exclude from capture. |
| `includedTables` | `string\|string[]?` | `()` | Regex patterns for tables to include (e.g., `"public.customers"`). |
| `excludedTables` | `string\|string[]?` | `()` | Regex patterns for tables to exclude. |
| `pluginName` | `PostgreSQLLogicalDecodingPlugin` | `PGOUTPUT` | Logical decoding plugin to use (`PGOUTPUT` or `DECODERBUFS`). |
| `slotName` | `string` | `"debezium"` | Name of the logical replication slot. |
| `publicationName` | `string` | `"dbz_publication"` | Name of the PostgreSQL publication for pgoutput plugin. |
| `tasksMax` | `int` | `1` | Maximum number of tasks (always 1 for PostgreSQL CDC). |

### Initializing the listener

**Basic CDC listener:**

```ballerina
import ballerinax/postgresql;
import ballerinax/postgresql.driver as _;

configurable string username = ?;
configurable string password = ?;
configurable string database = ?;

listener postgresql:CdcListener cdcListener = new (database = {
    username: username,
    password: password,
    databaseName: database
});
```

**CDC listener with table filtering:**

```ballerina
import ballerinax/postgresql;
import ballerinax/postgresql.driver as _;

configurable string username = ?;
configurable string password = ?;
configurable string database = ?;

listener postgresql:CdcListener cdcListener = new (database = {
    username: username,
    password: password,
    databaseName: database,
    hostname: "db.example.com",
    port: 5432,
    includedTables: ["public.customers", "public.orders"],
    pluginName: postgresql:PGOUTPUT,
    slotName: "my_slot"
});
```

---

## Service

A CDC service is attached to a `postgresql:CdcListener`. It receives row-level change events from PostgreSQL and dispatches them to your callback functions based on the event type (snapshot read, create, update, or delete).

### Callback signatures

| Function | Signature | Description |
|----------|-----------|-------------|
| `onRead` | `remote function onRead(record {} after) returns cdc:Error?` | Invoked for each existing row during the initial database snapshot. |
| `onCreate` | `remote function onCreate(record {} after) returns cdc:Error?` | Invoked when a new row is inserted into a captured table. |
| `onUpdate` | `remote function onUpdate(record {} before, record {} after) returns cdc:Error?` | Invoked when an existing row is updated. Receives both the before and after state. |
| `onDelete` | `remote function onDelete(record {} before) returns error?` | Invoked when a row is deleted. Receives the row state before deletion. |

You do not need to implement all four callbacks. Only implement the event types relevant to your use case.

### Full usage example

```ballerina
import ballerina/io;
import ballerinax/postgresql;
import ballerinax/postgresql.driver as _;

configurable string username = ?;
configurable string password = ?;
configurable string database = ?;

listener postgresql:CdcListener cdcListener = new (database = {
    username: username,
    password: password,
    databaseName: database
});

service on cdcListener {
    remote function onCreate(record {} after) returns cdc:Error? {
        io:println("New row inserted: ", after.toString());
    }

    remote function onUpdate(record {} before, record {} after) returns cdc:Error? {
        io:println("Row updated from: ", before.toString(), " to: ", after.toString());
    }

    remote function onDelete(record {} before) returns error? {
        io:println("Row deleted: ", before.toString());
    }
}
```

CDC requires PostgreSQL to be configured with `wal_level = logical` and the connecting user must have the `REPLICATION` privilege. The `pgoutput` plugin is included by default in PostgreSQL 10+.

---

## Supporting types

### `PostgresDatabaseConnection`

| Field | Type | Description |
|-------|------|-------------|
| `hostname` | `string` | PostgreSQL server hostname (default: `"localhost"`). |
| `port` | `int` | Server port (default: `5432`). |
| `username` | `string` | Database username. |
| `password` | `string` | Database password. |
| `databaseName` | `string` | Database name to capture changes from. |
| `pluginName` | `PostgreSQLLogicalDecodingPlugin` | Logical decoding plugin (`PGOUTPUT` or `DECODERBUFS`). |
| `slotName` | `string` | Logical replication slot name (default: `"debezium"`). |
| `publicationName` | `string` | Publication name for pgoutput (default: `"dbz_publication"`). |

### `PostgreSQLLogicalDecodingPlugin`

| Field | Type | Description |
|-------|------|-------------|
| `PGOUTPUT` | `enum` | Standard PostgreSQL logical decoding plugin (PostgreSQL 10+). |
| `DECODERBUFS` | `enum` | Protobuf-based logical decoding plugin (Debezium community). |
