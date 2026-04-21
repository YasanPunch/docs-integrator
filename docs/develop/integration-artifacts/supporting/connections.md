---
title: Connections
---

# Connections

Connection artifacts centralize the configuration for external systems. Define connections once and reuse them across multiple services, event handlers, and functions in your project.

## Adding a connection

1. Open the **WSO2 Integrator: BI** sidebar in VS Code.

   ![WSO2 Integrator sidebar showing the project structure with Connections listed](/img/develop/integration-artifacts/supporting/connections/step-1.png)

2. Click **+** next to **Connections** in the sidebar.

3. In the **Add Connection** panel, select how to define the connector:

   ![Add Connection panel showing connector options](/img/develop/integration-artifacts/supporting/connections/step-2.png)

   **Create New Connector**

   | Option | Description |
   |---|---|
   | **Connect via API Specification** | Import an OpenAPI or WSDL file to generate a typed HTTP client connector. |
   | **Connect to a Database** | Enter database credentials to introspect schema and create a typed database connector. Supports MySQL, MSSQL, and PostgreSQL. |

   **Pre-built Connectors**

   Browse the connector library using the **All**, **Standard**, or **Organization** tabs. Available connectors include HTTP, GraphQL, WebSocket, TCP, UDP, FTP, and many more. Use the search box to filter by name.

4. Select a connector type. A configuration form appears with fields specific to that connector (for example, base URL and authentication for HTTP, or host, port, and credentials for a database).

5. Fill in the required fields and click **Create** (or **Save**).

6. The new connection appears under **Connections** in the sidebar and is available for use in any service, function, or event handler in your project.

```ballerina
// connections.bal
import ballerinax/mysql;
import ballerina/http;
import ballerinax/kafka;

// Database connection
configurable string dbHost = ?;
configurable int dbPort = 3306;
configurable string dbUser = ?;
configurable string dbPassword = ?;
configurable string dbName = ?;

final mysql:Client orderDb = check new (
    host = dbHost,
    port = dbPort,
    user = dbUser,
    password = dbPassword,
    database = dbName
);

// HTTP client connection
configurable string crmBaseUrl = ?;
configurable string crmApiKey = ?;

final http:Client crmClient = check new (crmBaseUrl, {
    auth: {token: crmApiKey},
    timeout: 30,
    retryConfig: {
        count: 3,
        interval: 2,
        backOffFactor: 2.0
    }
});

// Kafka producer connection
configurable string kafkaBrokers = "localhost:9092";

final kafka:Producer kafkaProducer = check new ({
    bootstrapServers: kafkaBrokers,
    acks: kafka:ACKS_ALL,
    retryCount: 3
});
```

## Connection types

The **Add Connection** panel organizes connectors into two categories:

- **Create New Connector** — generate a connector from an API spec or by introspecting a database.
- **Pre-built Connectors** — select from the connector library. Use the **Standard** tab to see connectors from the Ballerina standard library, or **Organization** for connectors from your organization's registry.

| Connection Type | Module | Use Case |
|---|---|---|
| **MySQL** | `ballerinax/mysql` | Relational database queries and persistence |
| **PostgreSQL** | `ballerinax/postgresql` | Relational database queries and persistence |
| **MSSQL** | `ballerinax/mssql` | SQL Server database access |
| **HTTP Client** | `ballerina/http` | REST API calls to external services |
| **Kafka Producer** | `ballerinax/kafka` | Publishing messages to Kafka topics |
| **RabbitMQ Client** | `ballerinax/rabbitmq` | Publishing messages to RabbitMQ |
| **FTP Client** | `ballerinax/ftp` | File transfer operations |

## Best practices

| Practice | Description |
|---|---|
| **Dedicated file** | Keep all connections in a `connections.bal` file |
| **Use `configurable`** | Externalize host, port, and credentials so they vary by environment |
| **Use `final`** | Declare connections as `final` to initialize them once at startup |
| **Retry configuration** | Add retry and timeout settings for resilient connections |
| **Connection pooling** | Database clients manage connection pools automatically |
