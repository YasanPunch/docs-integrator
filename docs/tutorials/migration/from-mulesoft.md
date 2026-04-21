---
title: Coming from MuleSoft
---

# Coming from MuleSoft

A guide for developers migrating integrations from MuleSoft Anypoint to WSO2 Integrator.

## Concept Mapping

| In MuleSoft | In WSO2 Integrator | Notes |
|---|---|---|
| Mule Flow | Service / Automation | HTTP-triggered flows become **services**; scheduler-triggered flows become **automations** |
| Sub-flow | Function | Reusable flow fragments become Ballerina functions |
| Connector | Connector | Pre-built modules for external systems (Salesforce, DB, Kafka, etc.) |
| Connection Configuration | Config.toml | Credentials and endpoints live in `Config.toml` |
| DataWeave | Visual Data Mapper / Ballerina | Visual drag-and-drop mapping plus Ballerina expressions for complex transforms |
| DataWeave expression | Ballerina expression | Inline transformations written in Ballerina instead of DataWeave |
| API Kit Router | Service resources | HTTP routing is built into the service resource definition |
| RAML / OAS | Ballerina service contract | Generate a service from an OpenAPI spec, or auto-generate the spec from your service |
| Object Store | Database / Cache | Use `ballerina/cache` for in-memory state or a database for persistence |
| Mule Event (payload + attributes + vars) | Function parameters + records | Data flows as typed parameters and return values, not as a mutable event object |
| Choice Router | `if`/`else` or `match` | Conditional routing uses Ballerina control flow |
| Scatter-Gather | Workers | Parallel execution uses Ballerina workers |
| For Each / Batch | `foreach` / query expressions | Iteration uses standard Ballerina constructs |
| Error Handler (On Error Continue/Propagate) | `do`/`on fail` | Ballerina's error handling is typed and structural |
| Try Scope | `do`/`on fail` block | Same construct handles both try and error scopes |
| Async | `start` / Workers | Fire-and-forget calls use the `start` keyword |
| CloudHub | WSO2 Devant / Kubernetes | Deploy to managed cloud or self-hosted Kubernetes |
| Runtime Manager | Integration Control Plane (ICP) | Centralized monitoring and management |
| MUnit | `bal test` | Built-in test framework with mocking support |
| Maven (pom.xml) | Ballerina.toml | Dependency and build configuration |
| properties file | Config.toml | Environment-specific configuration |

## Key Differences

### DataWeave vs. Ballerina

MuleSoft's DataWeave is a domain-specific language for data transformation. In WSO2 Integrator, the equivalent is **Ballerina itself** -- a general-purpose language with first-class support for data transformation.

**DataWeave:**
```dataweave
%dw 2.0
output application/json
---
payload.orders map (order) -> {
    id: order.orderId,
    total: order.items reduce ((item, acc = 0) -> acc + item.price * item.qty),
    status: if (order.shipped) "shipped" else "pending"
}
```

**Ballerina equivalent:**
```ballerina
type OrderOutput record {|
    string id;
    decimal total;
    string status;
|};

function transformOrders(Order[] orders) returns OrderOutput[] {
    return from Order order in orders
        select {
            id: order.orderId,
            total: order.items.reduce(
                isolated function(decimal acc, OrderItem item) returns decimal =>
                    acc + item.price * <decimal>item.qty, 0d
            ),
            status: order.shipped ? "shipped" : "pending"
        };
}
```

Key differences:
- DataWeave is dynamically typed. Ballerina is statically typed -- schema errors are caught at compile time.
- DataWeave uses `map`, `filter`, `reduce` with a functional style. Ballerina offers both functional style and **query expressions** (`from ... where ... select`).
- DataWeave handles format conversion (JSON to XML, etc.) implicitly. In Ballerina, use explicit conversion functions or the Visual Data Mapper.

### Mule Flows vs. Ballerina Services

In MuleSoft, a flow is a pipeline of message processors triggered by an inbound endpoint. In WSO2 Integrator, a **service** is a collection of HTTP resources (similar to APIkit Router), and each resource is a function.

**MuleSoft flow (conceptual XML):**
```xml
<flow name="getOrderFlow">
    <http:listener path="/orders/{orderId}" method="GET"/>
    <db:select config-ref="Database_Config">
        <db:sql>SELECT * FROM orders WHERE id = :orderId</db:sql>
    </db:select>
    <ee:transform>

    </ee:transform>
</flow>
```

**WSO2 Integrator equivalent:**
```ballerina
import ballerina/http;
import ballerinax/postgresql;

final postgresql:Client db = check new (/* config */);

service /api on new http:Listener(8090) {
    resource function get orders/[string orderId]() returns Order|http:NotFound|error {
        Order? order = check db->queryRow(
            `SELECT * FROM orders WHERE id = ${orderId}`
        );
        if order is () {
            return http:NOT_FOUND;
        }
        return order;
    }
}
```

Differences:
- MuleSoft uses XML configuration. WSO2 Integrator uses either the visual designer or Ballerina code (bidirectionally synced).
- MuleSoft passes data through a mutable `MuleEvent` (payload, attributes, variables). Ballerina uses typed function parameters and return values -- no implicit state.
- In MuleSoft, the flow pipeline processes one message at a time. In Ballerina, each resource function handles one request and returns a typed response.

### Error Handling

**MuleSoft:**
```xml
<error-handler>
    <on-error-continue type="DB:CONNECTIVITY">
        <set-payload value="Database unavailable"/>
    </on-error-continue>
    <on-error-propagate type="ANY">
        <set-payload value="Unexpected error"/>
    </on-error-propagate>
</error-handler>
```

**WSO2 Integrator:**
```ballerina
do {
    Order order = check db->queryRow(`SELECT * FROM orders WHERE id = ${orderId}`);
    return order;
} on fail postgresql:Error dbErr {
    // Equivalent to on-error-continue for DB errors
    log:printError("Database error", dbErr);
    return <http:ServiceUnavailable>{body: {message: "Database unavailable"}};
} on fail error err {
    // Equivalent to on-error-propagate for all other errors
    log:printError("Unexpected error", err);
    return <http:InternalServerError>{body: {message: "Unexpected error"}};
}
```

The key advantage: Ballerina errors are typed. You handle `postgresql:Error` specifically rather than matching on a string error type like `DB:CONNECTIVITY`.

## Step-by-Step Migration

### 1. Inventory Your Mule Applications

Categorize each Mule flow:
- **API flows** (HTTP Listener + APIkit) --> WSO2 Integrator **services**
- **Scheduler flows** --> **automations**
- **JMS/Kafka listener flows** --> **event handlers**
- **Batch jobs** --> **automations** with streaming/query expressions

### 2. Convert DataWeave to Ballerina

For each DataWeave transformation:
1. Define the **input and output record types** in Ballerina (equivalent to DataWeave type definitions).
2. Simple field mappings --> use the **Visual Data Mapper** (drag and drop).
3. Complex transformations --> write Ballerina **query expressions** (similar to DataWeave `map`/`filter`).
4. Format conversions (JSON to XML, CSV, etc.) --> use `ballerina/data.xmldata`, `ballerina/data.csv`, etc.

### 3. Map Connectors

For each MuleSoft connector:
- **Database** (`db:select`, `db:insert`) --> `ballerinax/postgresql`, `ballerinax/mysql`, etc.
- **HTTP Request** --> `ballerina/http` client
- **Salesforce** --> `ballerinax/salesforce`
- **Kafka** --> `ballerinax/kafka`
- **File/FTP** --> `ballerina/ftp`, `ballerina/io`
- **JMS** --> `ballerinax/java.jms` or migrate to Kafka
- **Email** --> `ballerina/email`
- Check the [Connectors](/docs/connectors/overview) page for the full list.

### 4. Convert Flow Logic

For each Mule flow:

1. **Create a new WSO2 Integrator project** using the VS Code extension.
2. **Define record types** in `types.bal` for all data shapes used in the flow.
3. **Set up connectors** in `Config.toml` (replaces connection configurations).
4. **Build the service** using the visual designer or code:
   - APIkit Router --> `service` resource functions with path parameters
   - Choice Router --> `if`/`else` or `match`
   - Scatter-Gather --> Ballerina workers
   - For Each --> `foreach` loop or query expression
   - Try/Error Handler --> `do`/`on fail`
   - Set Variable --> local variable (`let`, `var`)
   - Set Payload --> return value from the function
5. **Write tests** using `bal test` (replaces MUnit).

### 5. Set Up Deployment

Replace MuleSoft CloudHub / Runtime Fabric with:
- **Development**: `bal run` locally
- **Testing**: Deploy to a staging environment via CI/CD
- **Production**: Deploy to WSO2 Devant (managed cloud), Kubernetes, or a VM

## Common Gotchas

- **No mutable event object**: MuleSoft's `MuleEvent` carries payload, attributes, and variables through the flow. In Ballerina, pass data explicitly as function parameters -- there is no global mutable state.
- **DataWeave `payload` keyword**: There is no equivalent. Data arrives as typed function parameters or return values from connector calls.
- **Flow references**: MuleSoft's `flow-ref` calls a sub-flow. In Ballerina, extract a function and call it directly.
- **Object Store persistence**: MuleSoft Object Store provides key-value persistence. Use a database (`ballerinax/postgresql`) or `ballerina/cache` for in-memory caching.
- **Batch processing**: MuleSoft has a dedicated batch module. In Ballerina, use streaming with query expressions or chunked processing in a `foreach` loop.
- **MEL expressions**: Mule Expression Language is replaced by Ballerina expressions. All expressions are statically typed.

## Before/After Examples

### REST API with Database

**MuleSoft** (simplified):
- HTTP Listener on `/api/customers/{id}`
- `db:select` with query `SELECT * FROM customers WHERE id = :id`
- DataWeave to transform `{ "customerId": payload.id, "fullName": payload.first_name ++ " " ++ payload.last_name }`
- Return JSON response

**WSO2 Integrator**:

```ballerina
import ballerina/http;
import ballerinax/postgresql;

final postgresql:Client db = check new ("localhost", "user", "pass", "mydb", 5432);

type DbCustomer record {|
    int id;
    string first_name;
    string last_name;
    string email;
|};

type CustomerResponse record {|
    int customerId;
    string fullName;
    string email;
|};

service /api on new http:Listener(8090) {
    resource function get customers/[int id]() returns CustomerResponse|http:NotFound|error {
        DbCustomer? row = check db->queryRow(
            `SELECT id, first_name, last_name, email FROM customers WHERE id = ${id}`
        );
        if row is () {
            return http:NOT_FOUND;
        }
        return {
            customerId: row.id,
            fullName: string `${row.first_name} ${row.last_name}`,
            email: row.email
        };
    }
}
```

### Kafka Consumer with Transformation

**MuleSoft**: Kafka Listener --> DataWeave transform --> HTTP POST to downstream service

**WSO2 Integrator**:

```ballerina
import ballerinax/kafka;
import ballerina/http;
import ballerina/log;

listener kafka:Listener orderListener = check new ({
    bootstrapServers: "localhost:9092",
    groupId: "order-processor",
    topics: ["orders"]
});

final http:Client downstream = check new ("http://fulfillment-service:8080");

type KafkaOrder record {|
    string orderId;
    string customerId;
    decimal total;
|};

type FulfillmentRequest record {|
    string orderRef;
    string customer;
    decimal amount;
|};

service on orderListener {
    remote function onConsumerRecord(kafka:Caller caller, kafka:ConsumerRecord[] records) returns error? {
        foreach kafka:ConsumerRecord rec in records {
            json payload = check (check string:fromBytes(rec.value)).fromJsonString();
            KafkaOrder order = check payload.cloneWithType();

            // Transform (equivalent to DataWeave)
            FulfillmentRequest req = {
                orderRef: order.orderId,
                customer: order.customerId,
                amount: order.total
            };

            _ = check downstream->post("/fulfill", req);
        }
        check caller->commit();
    }
}
```
