---
title: Managing Connections
---

# Managing Connections

Connections define how your integration communicates with external systems — databases, HTTP APIs, message brokers, cloud services, and SaaS applications. WSO2 Integrator provides a centralized connection management experience that lets you configure connections once and reuse them across all your integration artifacts.

## Creating a connection

1. Open the **WSO2 Integrator: BI** sidebar and expand **Connections**.
2. Click **+** next to **Connections**, or in the flow canvas click **+** and select **Add Connection** under the **Connections** section.

   ![Flow canvas showing an HTTP GET call node linked to the apiClient connection](/img/develop/design-logic/connections/call-endpoint.png)

3. In the **Add Connection** panel, select the connector type (for example, MySQL, HTTP, Kafka).
4. Fill in the connection parameters.
5. Click **Save**.

The connection appears under **Connections** in the sidebar and is available to all flows in the project.

Define connections as module-level client declarations with `configurable` parameters:

```ballerina
import ballerinax/mysql;
import ballerina/http;
import ballerinax/kafka;

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
    database = dbName,
    options = {
        connectTimeout: 10,
        socketTimeout: 30
    },
    connectionPool = {
        maxOpenConnections: 10,
        minIdleConnections: 2,
        maxConnectionLifeTime: 1800
    }
);

configurable string crmBaseUrl = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string tokenUrl = ?;

final http:Client crmClient = check new (crmBaseUrl, {
    auth: {
        tokenUrl: tokenUrl,
        clientId: clientId,
        clientSecret: clientSecret,
        scopes: ["read", "write"]
    },
    timeout: 30,
    retryConfig: {
        count: 3,
        interval: 2,
        backOffFactor: 2.0,
        maxWaitInterval: 30
    },
    circuitBreaker: {
        rollingWindow: {timeWindow: 60, bucketSize: 10},
        failureThreshold: 0.5,
        resetTime: 30
    }
});
```

## Connection types

### Database connections

```ballerina
import ballerinax/mysql;
import ballerinax/postgresql;
import ballerinax/mssql;

// MySQL
final mysql:Client mysqlDb = check new (
    host = "localhost", port = 3306,
    user = "root", password = "secret",
    database = "mydb"
);

// PostgreSQL
final postgresql:Client postgresDb = check new (
    host = "localhost", port = 5432,
    username = "postgres", password = "secret",
    database = "mydb"
);

// Microsoft SQL Server
final mssql:Client mssqlDb = check new (
    host = "localhost", port = 1433,
    user = "sa", password = "secret",
    database = "mydb"
);
```

### HTTP/REST connections

```ballerina
import ballerina/http;

// Basic auth
final http:Client basicClient = check new ("https://api.example.com", {
    auth: {username: "user", password: "pass"}
});

// API key via header
final http:Client apiKeyClient = check new ("https://api.example.com", {
    httpVersion: http:HTTP_1_1,
    customHeaders: {"X-API-Key": apiKey}
});

// Bearer token
final http:Client bearerClient = check new ("https://api.example.com", {
    auth: {token: bearerToken}
});

// Mutual TLS (mTLS)
final http:Client mtlsClient = check new ("https://secure.example.com", {
    secureSocket: {
        key: {certFile: "/certs/client.crt", keyFile: "/certs/client.key"},
        cert: "/certs/ca.crt"
    }
});
```

### Message broker connections

```ballerina
import ballerinax/kafka;
import ballerinax/rabbitmq;

// Kafka producer
final kafka:Producer kafkaProducer = check new ({
    bootstrapServers: "broker1:9092,broker2:9092",
    acks: kafka:ACKS_ALL,
    retryCount: 3
});

// RabbitMQ client
final rabbitmq:Client rmqClient = check new ("localhost", 5672, {
    username: "guest",
    password: "guest"
});
```

## Connection pooling

For database connections, configure the connection pool to optimize resource usage:

```ballerina
final mysql:Client db = check new (
    host = dbHost, user = dbUser, password = dbPassword, database = dbName,
    connectionPool = {
        maxOpenConnections: 25,
        minIdleConnections: 5,
        maxConnectionLifeTime: 1800
    }
);
```

| Parameter | Description | Default |
|---|---|---|
| `maxOpenConnections` | Maximum number of open connections | `15` |
| `minIdleConnections` | Minimum idle connections in the pool | `0` |
| `maxConnectionLifeTime` | Max lifetime of a connection (seconds) | `1800` |

## Testing connections

Click the **Test Connection** button in the connection configuration panel. The test verifies connectivity, authentication, and basic operations.

```ballerina
function testDbConnection() returns error? {
    _ = check orderDb->queryRow(`SELECT 1`);
    log:printInfo("Database connection successful");
}

function testApiConnection() returns error? {
    http:Response response = check crmClient->get("/health");
    if response.statusCode == 200 {
        log:printInfo("API connection successful");
    }
}
```

## Resilience configuration

### Retry

```ballerina
final http:Client resilientClient = check new ("https://api.example.com", {
    retryConfig: {
        count: 3,
        interval: 2,
        backOffFactor: 2.0,
        maxWaitInterval: 30,
        statusCodes: [500, 502, 503]
    }
});
```

### Circuit breaker

```ballerina
final http:Client protectedClient = check new ("https://api.example.com", {
    circuitBreaker: {
        rollingWindow: {timeWindow: 60, bucketSize: 10},
        failureThreshold: 0.5,
        resetTime: 30
    }
});
```

## Environment-specific configuration

Use `Config.toml` to vary connection details per environment:

```toml
# Config.toml (development)
dbHost = "localhost"
dbPort = 3306
dbUser = "root"
dbPassword = "dev-password"
dbName = "orders_dev"
crmBaseUrl = "https://sandbox.crm.example.com"
```

```toml
# Config.toml (production)
dbHost = "db.prod.internal"
dbPort = 3306
dbUser = "app_user"
dbPassword = "prod-encrypted-password"
dbName = "orders"
crmBaseUrl = "https://api.crm.example.com"
```

## What's next

- [Control Flow](control-flow.md) — Use connections in branching and looping logic
- [Error Handling](error-handling.md) — Handle connection failures gracefully
- [Configuration Management](configuration-management.md) — Manage connection settings per environment
