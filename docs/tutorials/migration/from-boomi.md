---
title: Coming from Boomi
---

# Coming from Boomi

A guide for developers migrating integrations from Dell Boomi to WSO2 Integrator.

## Concept Mapping

| In Boomi | In WSO2 Integrator | Notes |
|---|---|---|
| Process | Service / Automation | HTTP-triggered processes become **services**; scheduled processes become **automations** |
| Connector | Connector | Similar concept -- pre-built modules for external systems (Salesforce, databases, etc.) |
| Connection | Config.toml | Connection credentials and endpoints live in `Config.toml` instead of a separate connection UI |
| Map | Visual Data Mapper | Drag-and-drop field mapping with AI-assisted suggestions |
| Map Function | Ballerina expression | Custom transformations written as Ballerina expressions instead of Groovy scripts |
| Atom | Ballerina runtime | The local execution environment; runs as a standard process (no JVM required) |
| Molecule | Kubernetes cluster | Multi-node deployment uses containers and Kubernetes instead of Boomi Molecules |
| Environment | Config.toml per environment | Each environment (dev, staging, prod) gets its own `Config.toml` |
| Process Property | Configurable variable | Declared with `configurable` keyword in Ballerina code |
| Document Property | Variable / record field | Data flowing through the integration is carried in typed records |
| Branch (Decision) | `if`/`else` or `match` | Conditional routing uses Ballerina control flow or the visual decision shape |
| Flow Control (Parallel) | Workers | Parallel paths use Ballerina workers for concurrent execution |
| Try/Catch | `do`/`on fail` | Error handling uses Ballerina's structured error model |
| Cross-reference Table | Database lookup | No built-in cross-reference; use a database or in-memory map |
| Process Reporting | Integration Control Plane (ICP) | Centralized monitoring dashboard for all deployed integrations |
| AtomSphere API | Management REST API | Manage deployments and configurations programmatically |

## Key Differences

### Development Experience

Boomi uses a fully browser-based visual designer. WSO2 Integrator uses VS Code with a visual designer that is bidirectionally synced with Ballerina code. You can switch between the visual canvas and the code editor at any time -- changes in one are instantly reflected in the other.

### Data Handling

In Boomi, data flows as "documents" through a process and must be explicitly split, combined, or transformed at each shape. In WSO2 Integrator, data is represented as **typed Ballerina records** that flow through function calls. The type system catches schema mismatches at compile time rather than at runtime.

### Error Handling

Boomi uses Try/Catch shapes and error documents. WSO2 Integrator uses Ballerina's `do`/`on fail` blocks with typed errors. Every error has a distinct type, so you can handle specific failures differently:

```ballerina
// Boomi Try/Catch equivalent in Ballerina
do {
    Order order = check inventoryClient->get(string `/orders/${orderId}`);
    check processOrder(order);
} on fail http:ClientError err {
    // Handle HTTP-specific errors (timeout, connection refused, etc.)
    log:printError("Backend call failed", err);
} on fail error err {
    // Handle all other errors
    log:printError("Unexpected error", err);
}
```

### Scripting

Boomi uses Groovy scripts for custom logic. WSO2 Integrator uses Ballerina -- a statically typed language purpose-built for integration. Most Groovy script logic translates directly to Ballerina expressions or functions:

```ballerina
// Boomi Groovy: dataContext.getProperty("AccountId")
// Ballerina equivalent: a typed record field
string accountId = order.accountId;

// Boomi Groovy: for (int i = 0; i < documents.size(); i++) { ... }
// Ballerina equivalent:
Order[] orders = check getOrders();
Order[] filtered = from Order o in orders where o.status == "active" select o;
```

### Deployment

Boomi deploys to Atoms (local runtimes) or the Boomi Cloud. WSO2 Integrator projects compile to standalone executables that can be deployed to:
- **Local machine** for development
- **WSO2 Devant** (managed cloud platform)
- **Any cloud provider** (AWS, Azure, GCP) via Docker containers
- **Kubernetes** for production-scale deployments

No proprietary runtime agent is required.

## Step-by-Step Migration

### 1. Inventory Your Boomi Processes

List all Boomi processes grouped by type:
- **API processes** (triggered by HTTP) --> will become WSO2 Integrator **services**
- **Scheduled processes** --> will become **automations**
- **Listener processes** (triggered by events) --> will become **event handlers**

### 2. Map Connectors

For each Boomi connector used, find the equivalent WSO2 Integrator connector:
- Most common connectors (Salesforce, databases, Kafka, FTP, HTTP) have direct equivalents.
- For connectors without a direct match, use the generic HTTP connector or write a custom Ballerina client.
- Check the [Connectors](/docs/connectors/overview) page for the full list.

### 3. Migrate Data Maps

For each Boomi Map shape:
1. Open the WSO2 Integrator Visual Data Mapper.
2. Define the source and target record types (equivalent to Boomi profiles).
3. Draw the field mappings visually.
4. Replace Boomi map functions with Ballerina expressions.

### 4. Convert Process Logic

For each Boomi process, create a corresponding WSO2 Integrator project:

1. **Create the project** using the VS Code extension.
2. **Define record types** in `types.bal` for all data shapes (equivalent to Boomi profiles).
3. **Configure connections** in `Config.toml` (equivalent to Boomi connection settings).
4. **Build the flow** using the visual designer or code:
   - Decision shapes --> `if`/`else` or `match`
   - Branch shapes --> Workers (for parallel execution)
   - Map shapes --> Visual Data Mapper or inline transforms
   - Try/Catch --> `do`/`on fail`
5. **Test** using the built-in Try-It tool or `bal test`.

### 5. Set Up Deployment

Replace your Boomi Atom/Molecule with one of these deployment targets:
- For development: `bal run` locally
- For production: deploy to WSO2 Devant, Kubernetes, or a VM

## Common Gotchas

- **No implicit document splitting**: Boomi automatically splits batch documents. In Ballerina, iterate over arrays explicitly with `foreach` or query expressions.
- **Typed errors**: Boomi errors are generic documents. Ballerina errors are typed -- check function signatures for the specific error types they return.
- **No process properties at runtime**: Boomi process properties persist across executions. In WSO2 Integrator, use a database or cache for cross-execution state.
- **File-based configuration**: Boomi stores connection credentials in the AtomSphere UI. WSO2 Integrator uses `Config.toml` files or environment variables -- make sure to exclude credentials from version control.

## Before/After Examples

### HTTP API Process

**Boomi**: HTTP Listener shape --> Map shape --> Database Connector shape --> Return shape

**WSO2 Integrator**:

```ballerina
import ballerina/http;
import ballerinax/postgresql;

final postgresql:Client db = check new ("localhost", "user", "pass", "mydb", 5432);

type Customer record {|
    string id;
    string name;
    string email;
|};

service /api on new http:Listener(8090) {
    resource function get customers/[string id]() returns Customer|http:NotFound|error {
        Customer? customer = check db->queryRow(
            `SELECT id, name, email FROM customers WHERE id = ${id}`
        );
        if customer is () {
            return http:NOT_FOUND;
        }
        return customer;
    }
}
```

### Scheduled Sync Process

**Boomi**: Scheduler shape --> Salesforce Query shape --> Map shape --> Database Insert shape

**WSO2 Integrator**:

```ballerina
import ballerina/task;
import ballerinax/salesforce as sf;
import ballerinax/postgresql;

final sf:Client sfClient = check new ({/* config */});
final postgresql:Client db = check new (/* config */);

@task:AppointmentConfig {cronExpression: "0 0 * * * ?"}
function syncContacts() returns error? {
    stream<record {}, error?> contacts = check sfClient->query("SELECT Id, Email, Name FROM Contact");
    check from record {} c in contacts
        do {
            _ = check db->execute(
                `INSERT INTO contacts (sf_id, email, name)
                 VALUES (${c["Id"].toString()}, ${c["Email"].toString()}, ${c["Name"].toString()})
                 ON CONFLICT (sf_id) DO UPDATE SET email = EXCLUDED.email, name = EXCLUDED.name`
            );
        };
}
```
