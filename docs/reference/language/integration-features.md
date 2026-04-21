---
title: Integration-Specific Features
---

# Integration-Specific Features

Ballerina is designed as a language for network-distributed applications. It provides first-class constructs for defining services, handling network communication, managing concurrency, and configuring runtime behavior. These features make it uniquely suited for building integrations in WSO2 Integrator.

## Service Declarations

A service is a top-level construct that groups related resource functions behind a network listener. Services are the primary way to expose HTTP, GraphQL, gRPC, WebSocket, and other protocol-based endpoints.

```ballerina
import ballerina/http;

service /orders on new http:Listener(9090) {

    // Resource function: GET /orders
    resource function get .() returns Order[]|error {
        return getOrders();
    }

    // Resource function: GET /orders/{id}
    resource function get [int id]() returns Order|http:NotFound|error {
        Order? order = check getOrderById(id);
        if order is () {
            return http:NOT_FOUND;
        }
        return order;
    }

    // Resource function: POST /orders
    resource function post .(@http:Payload OrderRequest req) returns Order|error {
        return createOrder(req);
    }
}
```

### Service Path

The base path (`/orders` above) is the root URL path for all resource functions in the service. Use `/` for the root path.

### Attach Point

The `on` clause binds the service to one or more listeners. A service can be attached to multiple listeners:

```ballerina
http:Listener httpListener = new (9090);
http:Listener httpsListener = new (9443, secureSocket = {
    key: {certFile: "server.crt", keyFile: "server.key"}
});

service /api on httpListener, httpsListener {
    // ...
}
```

## Resource Functions

Resource functions define individual API endpoints. Their signature encodes the HTTP method, URL path, parameters, and return type.

### HTTP Method Mapping

The function name maps directly to the HTTP method:

```ballerina
resource function get path()    // GET
resource function post path()   // POST
resource function put path()    // PUT
resource function delete path() // DELETE
resource function patch path()  // PATCH
resource function head path()   // HEAD
resource function options path() // OPTIONS
```

### Path Parameters

Path segments in brackets are extracted as typed parameters:

```ballerina
// GET /orders/{orderId}/items/{itemId}
resource function get orders/[int orderId]/items/[string itemId]() returns Item|error {
    // orderId and itemId are automatically parsed from the URL
}

// Rest path parameter (captures remaining segments)
resource function get files/[string... path]() returns byte[]|error {
    string fullPath = string:'join("/", ...path);
}
```

### Query Parameters

Function parameters that are not path parameters are treated as query parameters:

```ballerina
// GET /orders?status=pending&limit=10
resource function get orders(string? status, int limit = 20) returns Order[]|error {
    // status is optional (nil if not provided)
    // limit has a default value of 20
}
```

### Request Payload

Use the `@http:Payload` annotation to bind the request body:

```ballerina
resource function post orders(@http:Payload OrderRequest payload) returns Order|error {
    return createOrder(payload);
}
```

### Header Access

Use the `@http:Header` annotation to extract request headers:

```ballerina
resource function get secure(
    @http:Header {name: "Authorization"} string authHeader
) returns json|error {
    // authHeader contains the Authorization header value
}
```

### Return Types and Response Codes

The return type determines the HTTP status code:

| Return Type | HTTP Status |
|-------------|-------------|
| `T` (success type) | `200 OK` |
| `http:Created` | `201 Created` |
| `http:Accepted` | `202 Accepted` |
| `http:NoContent` | `204 No Content` |
| `http:BadRequest` | `400 Bad Request` |
| `http:NotFound` | `404 Not Found` |
| `http:InternalServerError` | `500 Internal Server Error` |
| `error` | `500 Internal Server Error` |

Union return types allow multiple possible responses:

```ballerina
resource function get [int id]() returns Order|http:NotFound|error {
    // Returns 200 with Order, or 404 if not found, or 500 on error
}
```

## Listener Lifecycle

Listeners manage the lifecycle of network connections. They implement the `Listener` object type with `init`, `attach`, `detach`, `'start`, and `gracefulStop` methods.

```ballerina
import ballerina/http;

// Inline listener (created and managed automatically)
service /api on new http:Listener(9090) { }

// Explicit listener (reusable, configurable)
configurable int port = 9090;
configurable string host = "0.0.0.0";

listener http:Listener apiListener = new (port, {host: host});

service /v1 on apiListener { }
service /v2 on apiListener { }
```

### Listener Configuration

HTTP listeners accept a comprehensive configuration record:

```ballerina
listener http:Listener secureListener = new (9443, {
    host: "0.0.0.0",
    secureSocket: {
        key: {
            certFile: "/certs/server.crt",
            keyFile: "/certs/server.key"
        },
        mutualSsl: {
            verifyClient: http:REQUIRE,
            cert: "/certs/ca.crt"
        }
    },
    timeout: 120,
    server: "WSO2-Integrator"
});
```

## Client Objects

Client objects provide type-safe access to remote services. They handle connection pooling, serialization, error handling, and resilience.

### HTTP Client

```ballerina
import ballerina/http;

final http:Client orderClient = check new ("https://api.example.com", {
    timeout: 30,
    retryConfig: {
        count: 3,
        interval: 1,
        backOffFactor: 2.0,
        maxWaitInterval: 20
    },
    circuitBreaker: {
        rollingWindow: {timeWindow: 60, bucketSize: 10},
        failureThreshold: 0.5,
        resetTime: 30
    }
});

function getOrder(int id) returns Order|error {
    Order order = check orderClient->/orders/[id];
    return order;
}

function createOrder(OrderRequest req) returns Order|error {
    Order order = check orderClient->/orders.post(req);
    return order;
}
```

### Database Client

```ballerina
import ballerinax/mysql;
import ballerina/sql;

configurable string dbHost = ?;
configurable int dbPort = 3306;
configurable string dbUser = ?;
configurable string dbPassword = ?;
configurable string dbName = ?;

final mysql:Client dbClient = check new (dbHost, dbUser, dbPassword, dbName, dbPort);

function getOrderById(int id) returns Order|error {
    Order order = check dbClient->queryRow(
        `SELECT * FROM orders WHERE id = ${id}`
    );
    return order;
}
```

## Configurable Variables

The `configurable` keyword declares variables whose values are supplied at deployment time through `Config.toml`, environment variables, or command-line arguments.

```ballerina
// Required (no default -- must be provided externally)
configurable string dbUrl = ?;
configurable string apiKey = ?;

// Optional with defaults
configurable int port = 8080;
configurable int maxRetries = 3;
configurable decimal timeout = 30.0;

// Structured configuration
configurable DatabaseConfig dbConfig = ?;

type DatabaseConfig record {|
    string host;
    int port;
    string user;
    string password;
    string database;
|};
```

See the [Config.toml Reference](../config/config-toml.md) and [Environment Variables](../config/environment-variables.md) pages for details on providing values.

## Workers and Concurrency

Ballerina provides built-in concurrency through named workers and asynchronous function calls. Workers execute concurrently within a function and can communicate through message passing.

### Named Workers

```ballerina
function processOrder(Order order) returns OrderResult|error {
    // Workers execute concurrently
    worker validate returns boolean|error {
        return validateOrder(order);
    }

    worker enrich returns EnrichedOrder|error {
        return enrichOrderData(order);
    }

    // Wait for both workers to complete
    boolean|error isValid = wait validate;
    EnrichedOrder|error enriched = wait enrich;

    if isValid is error || enriched is error {
        return error("order processing failed");
    }

    return {valid: check isValid, enrichedOrder: check enriched};
}
```

### Asynchronous Calls

The `start` keyword invokes a function on a new strand (lightweight thread):

```ballerina
function notifyAll(Order order) {
    // Fire and forget
    future<error?> _ = start sendEmail(order);
    future<error?> _ = start sendSMS(order);
    future<error?> _ = start updateDashboard(order);
}

function parallelFetch() returns [json, json]|error {
    // Start concurrent calls
    future<json|error> f1 = start fetchOrders();
    future<json|error> f2 = start fetchInventory();

    // Wait for both results
    json orders = check wait f1;
    json inventory = check wait f2;
    return [orders, inventory];
}
```

### Worker Message Passing

Workers can send and receive messages using the `->` and `<-` operators:

```ballerina
function pipeline() {
    worker producer {
        foreach int i in 1 ... 5 {
            i -> consumer;
        }
    }

    worker consumer {
        foreach int i in 1 ... 5 {
            int value = <- producer;
            io:println("Received: ", value);
        }
    }
}
```

## Transactions

Ballerina has built-in transaction support with automatic coordination across multiple transactional resources.

```ballerina
function transferFunds(string fromAccount, string toAccount, decimal amount) returns error? {
    transaction {
        check debit(fromAccount, amount);
        check credit(toAccount, amount);
        check commit;
    }
}
```

### Transaction Participants

Functions annotated with `transactional` participate in the enclosing transaction:

```ballerina
transactional function debit(string account, decimal amount) returns error? {
    check dbClient->execute(
        `UPDATE accounts SET balance = balance - ${amount} WHERE id = ${account}`
    );
}
```

## Error Handling

Ballerina's error handling model uses union types (`T|error`) and the `check` expression to propagate errors up the call stack.

```ballerina
function processRequest() returns json|error {
    // check propagates the error if the call fails
    http:Response response = check client->get("/data");
    json payload = check response.getJsonPayload();
    return transform(payload);
}
```

### `do`/`on fail` for Local Error Handling

```ballerina
function handleOrder(Order order) returns string {
    do {
        check validateOrder(order);
        check saveOrder(order);
        return "success";
    } on fail error e {
        log:printError("Order processing failed", 'error = e);
        return "failed: " + e.message();
    }
}
```
