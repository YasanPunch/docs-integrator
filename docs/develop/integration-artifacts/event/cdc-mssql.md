---
title: CDC - MSSQL
---

# CDC - MSSQL

Microsoft SQL Server CDC integrations capture row-level changes from SQL Server tables in real time using Debezium-based Change Data Capture. Use them for data synchronization, audit logging, and event-driven workflows that must react to database inserts, updates, and deletes without polling.

CDC must be enabled on the SQL Server database and on the specific tables you want to track before creating this integration. See [Prerequisites](#prerequisites).

## Prerequisites

Enable CDC on the target SQL Server database and table before configuring the integration.

```sql
-- Enable CDC on the database
EXEC sys.sp_cdc_enable_db;

-- Enable CDC on a specific table
EXEC sys.sp_cdc_enable_table
    @source_schema = N'dbo',
    @source_name   = N'customers',
    @role_name     = NULL;
```

## Creating a CDC for MSSQL service

1. Click **+ Add Artifact** in the canvas or click **+** next to **Entry Points** in the sidebar.
2. In the **Artifacts** panel, select **CDC for Microsoft SQL Server** under **Event Integration**.
3. In the creation form, select **Create new** to configure a new listener.

   ![CDC for MSSQL creation form — connection fields](/img/develop/integration-artifacts/event/cdc-mssql/step-creation-form.png)

   Under **Listener Configurations**, fill in the following fields:

   | Field | Description | Default |
   |---|---|---|
   | **Host** | Hostname of the Microsoft SQL Server. | `localhost` |
   | **Port** | Port number of the Microsoft SQL Server. | `1433` |
   | **Username** | Username for the SQL Server connection. | Required |
   | **Password** | Password for the SQL Server connection. | Required |
   | **Databases** | List of databases to capture changes from. Click **+ Add Item** to add each database name. | Required |
   | **Schemas** | Regular expressions matching schema names to capture changes from. Click **+ Add Item** to add each pattern. | — |



   Expand **Advanced Configurations** for additional settings:

   | Field | Description | Default |
   |---|---|---|
   | **Listener Name** | Identifier for the listener created with this service. | `mssqlCdcListener` |
   | **Database Instance** | Microsoft SQL Server named instance (if applicable). | — |
   | **Secure Socket** | SSL/TLS configuration for a secure connection. | — |
   | **Options** | Additional options for the CDC engine as a record expression. | — |

   Under **Table**, enter the fully-qualified table name to capture events from in the format `<database>.<schema>.<table>` (for example, `mydb.dbo.customers`).

4. Click **Create**.

5. WSO2 Integrator opens the service in the **Service Designer**. The canvas shows the attached listener pill and the table name pill.

   ![Service Designer showing the CDC MSSQL service canvas](/img/develop/integration-artifacts/event/cdc-mssql/step-service-designer.png)

6. Click **+ Add Handler** to add event handlers.

```ballerina
import ballerinax/mssql.cdc;
import ballerina/log;

configurable string hostname = "localhost";
configurable int port = 1433;
configurable string username = ?;
configurable string password = ?;

listener cdc:Listener mssqlCdcListener = new ({
    hostname: hostname,
    port: port,
    username: username,
    password: password,
    databaseNames: ["mydb"]
});

@cdc:ServiceConfig {
    tables: "mydb.dbo.customers"
}
service on mssqlCdcListener {

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

In the **Service Designer**, click the **Configure** icon in the header to open the **CDC for Microsoft SQL Server Configuration** panel. Select **CDC for Microsoft SQL Server** in the left panel.

![CDC MSSQL Configuration panel — service config and listener connection](/img/develop/integration-artifacts/event/cdc-mssql/step-service-config.png)

| Field | Description |
|---|---|
| **Service Config** | Advanced CDC configuration as a record expression. The `tables` field sets the fully-qualified table name (format: `<database>.<schema>.<table>`). |

```ballerina
@cdc:ServiceConfig {
    tables: "mydb.dbo.customers"
}
service on mssqlCdcListener { }
```

## Listener configuration

In the **CDC for Microsoft SQL Server Configuration** panel, select **mssqlCdcListener** under **Attached Listeners** to configure the listener.

| Field | Description | Default |
|---|---|---|
| **Name** | Identifier for the listener. | `mssqlCdcListener` |
| **Database** | Database connection configuration as a record expression with `hostname`, `port`, `username`, `password`, and `databaseNames` fields. | Required |
| **Engine Name** | Debezium engine instance name. | — |
| **Internal Schema Storage** | Schema history storage configuration. | `{}` |
| **Offset Storage** | Offset storage configuration for tracking CDC progress. | `{}` |
| **Liveness Interval** | Interval in seconds for checking CDC listener liveness. | `0.0` |
| **Options** | Additional connector options as a record expression. | `{}` |

Click **+ Attach Listener** to attach an additional listener to the same service.

Click **Save Changes** to apply updates.

```ballerina
listener cdc:Listener mssqlCdcListener = new ({
    hostname: "localhost",
    port: 1433,
    username: username,
    password: password,
    databaseNames: ["mydb"],
    secureSocket: {},
    options: {}
});
```

`cdc:ListenerConfiguration` fields:

| Field | Type | Default | Description |
|---|---|---|---|
| `hostname` | `string` | `"localhost"` | SQL Server hostname |
| `port` | `int` | `1433` | SQL Server port |
| `username` | `string` | Required | Database username |
| `password` | `string` | Required | Database password |
| `databaseNames` | `string[]` | Required | List of databases to capture changes from |
| `databaseInstance` | `string?` | — | SQL Server named instance |
| `secureSocket` | `cdc:SecureSocket?` | — | SSL/TLS configuration |
| `engineName` | `string?` | — | Debezium engine instance name |
| `internalSchemaStorage` | `record{}?` | — | Schema history storage configuration |
| `offsetStorage` | `record{}?` | — | Offset storage configuration |
| `livenessInterval` | `decimal` | `0.0` | Liveness check interval in seconds |
| `options` | `record{}?` | — | Additional connector options |

## Event handlers

### Adding an event handler

In the **Service Designer**, click **+ Add Handler**. The **Select Handler to Add** panel lists `onRead`, `onCreate`, `onUpdate`, `onDelete`, and `onError`.

`onRead`, `onCreate`, `onUpdate`, and `onDelete` each open a configuration panel with a **+ Define Database Entry** option to define the expected record type for the change event. Click **Save** to add the handler.

`onError` is added directly without additional configuration.

```ballerina
type CustomerRow record {|
    int id;
    string name;
    string email;
|};

@cdc:ServiceConfig {
    tables: "mydb.dbo.customers"
}
service on mssqlCdcListener {

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
| `onError` | A CDC processing error occurs | Logging failures and sending alerts |

## What's next

- [CDC - PostgreSQL](cdc-postgresql.md) — capture changes from PostgreSQL tables
- [Kafka](kafka.md) — consume messages from Apache Kafka topics
- [Connections](../supporting/connections.md) — reuse database credentials across services
