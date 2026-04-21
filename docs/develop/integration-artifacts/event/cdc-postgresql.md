---
title: CDC - PostgreSQL
---

# CDC - PostgreSQL

PostgreSQL CDC integrations capture row-level changes from PostgreSQL tables in real time using Debezium-based Change Data Capture. Use them for data synchronization, audit logging, and event-driven workflows that must react to database inserts, updates, deletes, and truncates without polling.

Logical replication must be enabled on the PostgreSQL database and on the specific tables you want to track before creating this integration. See [Prerequisites](#prerequisites).

## Prerequisites

Enable logical replication on the target PostgreSQL database before configuring the integration.

```sql
-- Set in postgresql.conf
wal_level = logical

-- Grant replication permission to the user
ALTER USER <username> REPLICATION;

-- Enable full replica identity on the table
ALTER TABLE <schema>.<table> REPLICA IDENTITY FULL;
```

## Creating a CDC for PostgreSQL service

1. Click **+ Add Artifact** in the canvas or click **+** next to **Entry Points** in the sidebar.
2. In the **Artifacts** panel, select **CDC for PostgreSQL** under **Event Integration**.
3. In the creation form, select **Create new** to configure a new listener.

   ![CDC for PostgreSQL creation form — connection fields](/img/develop/integration-artifacts/event/cdc-postgresql/step-creation-form.png)

   Under **Listener Configurations**, fill in the following fields:

   | Field | Description | Default |
   |---|---|---|
   | **Host** | Hostname of the PostgreSQL server. | `localhost` |
   | **Port** | Port number of the PostgreSQL server. | `5432` |
   | **Username** | Username for the PostgreSQL connection. | Required |
   | **Password** | Password for the PostgreSQL connection. | Required |
   | **Database** | Name of the database to capture changes from. | Required |
   | **Schemas** | Regular expressions matching schema names to capture changes from. Click **+ Add Item** to add each pattern. | — |



   Expand **Advanced Configurations** for additional settings:

   | Field | Description | Default |
   |---|---|---|
   | **Listener Name** | Identifier for the listener created with this service. | `postgresqlCdcListener` |
   | **Secure Socket** | SSL/TLS configuration for a secure connection. | — |
   | **Options** | Additional options for the CDC engine as a record expression. | — |

   Under **Table**, enter the fully-qualified table name to capture events from in the format `<database>.<schema>.<table>` (for example, `mydb.public.customers`).

4. Click **Create**.

5. WSO2 Integrator opens the service in the **Service Designer**. The canvas shows the attached listener pill and the table name pill.

   ![Service Designer showing the CDC PostgreSQL service canvas](/img/develop/integration-artifacts/event/cdc-postgresql/step-service-designer.png)

6. Click **+ Add Handler** to add event handlers.

```ballerina
import ballerinax/postgresql.cdc;
import ballerina/log;

configurable string hostname = "localhost";
configurable int port = 5432;
configurable string username = ?;
configurable string password = ?;

listener cdc:Listener postgresqlCdcListener = new ({
    hostname: hostname,
    port: port,
    username: username,
    password: password,
    databaseName: "mydb"
});

@cdc:ServiceConfig {
    tables: "mydb.public.customers"
}
service on postgresqlCdcListener {

    remote function onCreate(cdc:ChangeEvent event) returns error? {
        log:printInfo("Row inserted", data = event.after.toString());
    }

    remote function onUpdate(cdc:ChangeEvent event) returns error? {
        log:printInfo("Row updated",
                      before = event.before.toString(),
                      after = event.after.toString());
    }

    remote function onDelete(cdc:ChangeEvent event) returns error? {
        log:printInfo("Row deleted", data = event.before.toString());
    }

    remote function onError(error err) returns error? {
        log:printError("CDC error", 'error = err);
    }
}
```

## Service configuration

In the **Service Designer**, click the **Configure** icon in the header to open the **CDC for PostgreSQL Configuration** panel. Select **CDC for PostgreSQL** in the left panel.

![CDC PostgreSQL Configuration panel — service config and listener connection](/img/develop/integration-artifacts/event/cdc-postgresql/step-service-config.png)

| Field | Description |
|---|---|
| **Service Config** | Advanced CDC configuration as a record expression. The `tables` field sets the fully-qualified table name (format: `<database>.<schema>.<table>`). |

```ballerina
@cdc:ServiceConfig {
    tables: "mydb.public.customers"
}
service on postgresqlCdcListener { }
```

## Listener configuration

In the **CDC for PostgreSQL Configuration** panel, select **postgresqlCdcListener** under **Attached Listeners** to configure the listener.

| Field | Description | Default |
|---|---|---|
| **Name** | Identifier for the listener. | `postgresqlCdcListener` |
| **Database** | Database connection configuration as a record expression with `hostname`, `port`, `username`, `password`, and `databaseName` fields. | Required |
| **Engine Name** | Debezium engine instance name. | — |
| **Internal Schema Storage** | Schema history storage configuration. | `{}` |
| **Offset Storage** | Offset storage configuration for tracking CDC progress. | `{}` |
| **Liveness Interval** | Interval in seconds for checking CDC listener liveness. | `0.0` |
| **Options** | Additional connector options as a record expression. | `{}` |

Click **+ Attach Listener** to attach an additional listener to the same service.

Click **Save Changes** to apply updates.

```ballerina
listener cdc:Listener postgresqlCdcListener = new ({
    hostname: "localhost",
    port: 5432,
    username: username,
    password: password,
    databaseName: "mydb",
    secureSocket: {},
    options: {}
});
```

`cdc:ListenerConfiguration` fields:

| Field | Type | Default | Description |
|---|---|---|---|
| `hostname` | `string` | `"localhost"` | PostgreSQL hostname |
| `port` | `int` | `5432` | PostgreSQL port |
| `username` | `string` | Required | Database username |
| `password` | `string` | Required | Database password |
| `databaseName` | `string` | Required | Database to capture changes from |
| `secureSocket` | `cdc:SecureSocket?` | — | SSL/TLS configuration |
| `engineName` | `string?` | — | Debezium engine instance name |
| `internalSchemaStorage` | `record{}?` | — | Schema history storage configuration |
| `offsetStorage` | `record{}?` | — | Offset storage configuration |
| `livenessInterval` | `decimal` | `0.0` | Liveness check interval in seconds |
| `options` | `record{}?` | — | Additional connector options |

## Event handlers

### Adding an event handler

In the **Service Designer**, click **+ Add Handler**. The **Select Handler to Add** panel lists `onRead`, `onCreate`, `onUpdate`, `onDelete`, `onTruncate`, and `onError`.

`onRead`, `onCreate`, `onUpdate`, and `onDelete` each open a configuration panel with a **+ Define Database Entry** option to define the expected record type for the change event. Expand **Advanced Parameters** to find the **TableName** checkbox, which scopes the handler to a specific table. Click **Save** to add the handler.

`onTruncate` and `onError` are added directly without additional configuration.

![onRead/onCreate/onUpdate/onDelete handler configuration panel](/img/develop/integration-artifacts/event/cdc-postgresql/step-add-handler.png)

```ballerina
type CustomerRow record {|
    int id;
    string name;
    string email;
|};

@cdc:ServiceConfig {
    tables: "mydb.public.customers"
}
service on postgresqlCdcListener {

    remote function onRead(cdc:ChangeEvent event) returns error? {
        log:printInfo("Initial snapshot row", data = event.after.toString());
    }

    remote function onCreate(cdc:ChangeEvent event) returns error? {
        log:printInfo("Row inserted", data = event.after.toString());
        check syncToDownstream("INSERT", event.after);
    }

    remote function onUpdate(cdc:ChangeEvent event) returns error? {
        log:printInfo("Row updated",
                      before = event.before.toString(),
                      after = event.after.toString());
        check syncToDownstream("UPDATE", event.after);
    }

    remote function onDelete(cdc:ChangeEvent event) returns error? {
        log:printInfo("Row deleted", data = event.before.toString());
        check syncToDownstream("DELETE", event.before);
    }

    remote function onTruncate(cdc:ChangeEvent event) returns error? {
        log:printInfo("Table truncated");
    }

    remote function onError(error err) returns error? {
        log:printError("CDC processing error", 'error = err);
    }
}
```

### Handler types

| Handler | Triggered when | Use when |
|---|---|---|
| `onRead` | A row is read during the initial snapshot of the table | Bootstrapping downstream systems with existing data |
| `onCreate` | A row is inserted into the tracked table | Syncing new records to downstream systems |
| `onUpdate` | A row is updated in the tracked table | Propagating field changes |
| `onDelete` | A row is deleted from the tracked table | Removing records from downstream systems |
| `onTruncate` | The tracked table is truncated | Clearing or resetting downstream data |
| `onError` | A CDC processing error occurs | Logging failures and sending alerts |

## What's next

- [CDC - MSSQL](cdc-mssql.md) — capture changes from Microsoft SQL Server tables
- [Kafka](kafka.md) — consume messages from Apache Kafka topics
- [Connections](../supporting/connections.md) — reuse database credentials across services
