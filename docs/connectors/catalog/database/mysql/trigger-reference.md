---
title: Triggers
---

# Triggers

The `ballerinax/mysql` connector supports event-driven integration through Change Data Capture (CDC) powered by Debezium. When rows are inserted, updated, or deleted in monitored MySQL tables, the `mysql:CdcListener` receives change events in real time and invokes your service callbacks automatically.

Three components work together:

| Component | Role |
|-----------|------|
| `mysql:CdcListener` | Connects to MySQL binary log via Debezium and streams row-level change events to attached services. |
| `cdc:Service` | Defines the `onRead`, `onCreate`, `onUpdate`, and `onDelete` callbacks invoked per change event. |
| `MySqlDatabaseConnection` | Configuration record for the MySQL CDC database connection (host, port, credentials, database/table filters). |

For action-based record operations, see the [Action Reference](action-reference.md).

---

## Listener

The `mysql:Listener` establishes the connection and manages event subscriptions.

### Configuration

The listener supports the following connection strategies:

| Config Type | Description |
|-------------|-------------|
| `MySqlDatabaseConnection` | Configures the CDC database connection including server address, credentials, and table filtering. |
| `MySqlListenerConfiguration` | Top-level listener configuration wrapping the database connection and CDC options. |

`MySqlDatabaseConnection` fields:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `connectorClass` | `string` | `"io.debezium.connector.mysql.MySqlConnector"` | The Debezium MySQL connector class name. |
| `hostname` | `string` | `"localhost"` | The hostname of the MySQL server. |
| `port` | `int` | `3306` | The port number of the MySQL server. |
| `username` | `string` | Required | MySQL username with replication privileges. |
| `password` | `string` | Required | MySQL password for the specified user. |
| `databaseServerId` | `string` | (auto-generated random int) | Unique identifier for this MySQL server instance in the replication topology. |
| `includedDatabases` | `string\|string[]?` | `()` | Regex patterns of databases to capture changes from. Do not use alongside `excludedDatabases`. |
| `excludedDatabases` | `string\|string[]?` | `()` | Regex patterns of databases to exclude from capture. Do not use alongside `includedDatabases`. |
| `includedTables` | `string\|string[]?` | `()` | Fully-qualified table names or regex patterns to capture (e.g., `"mydb.orders"`). |
| `tasksMax` | `int` | `1` | Maximum number of tasks for the connector. The MySQL connector always uses a single task. |

`MySqlListenerConfiguration` fields:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `database` | `MySqlDatabaseConnection` | Required | The MySQL CDC database connection configuration. |
| `options` | `cdc:Options?` | `()` | Advanced CDC options such as snapshot mode, skipped operations, and offset storage. |

### Initializing the listener

**Basic CDC listener with default settings:**

```ballerina
import ballerinax/mysql;
import ballerinax/mysql.cdc.driver as _;

configurable string username = ?;
configurable string password = ?;

listener mysql:CdcListener cdcListener = new (database = {
    username: username,
    password: password
});
```

**CDC listener with database and table filters:**

```ballerina
import ballerinax/cdc;
import ballerinax/mysql;
import ballerinax/mysql.cdc.driver as _;

configurable string username = ?;
configurable string password = ?;

listener mysql:CdcListener cdcListener = new (
    database = {
        username: username,
        password: password,
        includedDatabases: "mydb",
        includedTables: "mydb.orders"
    },
    options = {
        snapshotMode: cdc:NO_DATA,
        skippedOperations: [cdc:TRUNCATE]
    }
);
```

---

## Service

A `cdc:Service` is a Ballerina service attached to a `mysql:CdcListener`. It listens for row-level change events on monitored MySQL tables and implements callbacks for each event type. You can type the callback parameters with your own Ballerina record types for automatic mapping.

### Callback signatures

| Function | Signature | Description |
|----------|-----------|-------------|
| `onRead` | `remote function onRead(record {} after) returns cdc:Error?` | Invoked during the initial snapshot for each existing row read from the database. |
| `onCreate` | `remote function onCreate(record {} after) returns cdc:Error?` | Invoked when a new row is inserted into a monitored table. |
| `onUpdate` | `remote function onUpdate(record {} before, record {} after) returns cdc:Error?` | Invoked when a row is updated, providing both the before and after state. |
| `onDelete` | `remote function onDelete(record {} before) returns error?` | Invoked when a row is deleted, providing the row state before deletion. |

You do not need to implement all four callbacks. Only implement the event types relevant to your use case.

### Full usage example

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/cdc;
import ballerinax/mysql;
import ballerinax/mysql.cdc.driver as _;

configurable string username = ?;
configurable string password = ?;

type Order record {|
    int order_id;
    int customer_id;
    decimal amount;
    string status;
|};

listener mysql:CdcListener cdcListener = new (
    database = {
        username: username,
        password: password,
        includedDatabases: "shop",
        includedTables: "shop.orders"
    },
    options = {
        snapshotMode: cdc:NO_DATA
    }
);

service cdc:Service on cdcListener {
    isolated remote function onRead(Order after) returns cdc:Error? {
        log:printInfo("Snapshot row", order = after.toString());
    }

    isolated remote function onCreate(Order after) returns cdc:Error? {
        log:printInfo("New order created",
            orderId = after.order_id,
            amount = after.amount
        );
    }

    isolated remote function onUpdate(Order before, Order after) returns cdc:Error? {
        log:printInfo("Order updated",
            orderId = after.order_id,
            oldStatus = before.status,
            newStatus = after.status
        );
    }

    isolated remote function onDelete(Order before) returns error? {
        log:printInfo("Order deleted", orderId = before.order_id);
    }
}
```

For CDC to work, MySQL must have binary logging enabled with `binlog-format=ROW`. Additionally, import the `ballerinax/mysql.cdc.driver as _` module to bundle the required Debezium drivers.

---

## Supporting types

### `MySqlDatabaseConnection`

| Field | Type | Description |
|-------|------|-------------|
| `connectorClass` | `string` | The Debezium connector class (defaults to MySQL connector). |
| `hostname` | `string` | The MySQL server hostname (default `"localhost"`). |
| `port` | `int` | The MySQL server port (default `3306`). |
| `username` | `string` | MySQL username with replication privileges. |
| `password` | `string` | Password for the specified user. |
| `databaseServerId` | `string` | Unique server identifier for the replication topology. |
| `includedDatabases` | `string\|string[]?` | Regex patterns of databases to capture changes from. |
| `excludedDatabases` | `string\|string[]?` | Regex patterns of databases to exclude from change capture. |
| `includedTables` | `string\|string[]?` | Fully-qualified table names or regex patterns to monitor. |
| `tasksMax` | `int` | Maximum number of connector tasks (always 1 for MySQL). |

### `Options`

| Field | Type | Description |
|-------|------|-------------|
| `ssl` | `SecureSocket?` | SSL/TLS configuration for the database connection. |
| `connectTimeout` | `decimal` | Connection timeout in seconds (default `30`). |
| `socketTimeout` | `decimal` | Socket read/write timeout in seconds (default `0` — no timeout). |
| `serverTimezone` | `string?` | Server timezone for date/time conversions. |
| `noAccessToProcedureBodies` | `boolean` | Allow procedure calls when metadata access is limited (default `false`). |
| `failoverConfig` | `FailoverConfig?` | Configuration for server failover with secondary servers. |

### `SecureSocket`

| Field | Type | Description |
|-------|------|-------------|
| `mode` | `SSLMode` | SSL mode: `SSL_DISABLED`, `SSL_PREFERRED` (default), `SSL_REQUIRED`, `SSL_VERIFY_CA`, or `SSL_VERIFY_IDENTITY`. |
| `key` | `KeyStore?` | Client certificate keystore configuration (`.p12` format). |
| `cert` | `TrustStore?` | Trust certificate store configuration (`.p12` format). |
| `allowPublicKeyRetrieval` | `boolean` | Allow retrieval of the server's RSA public key (default `false`). |
