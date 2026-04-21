---
title: OpenAPI Tool
---

# OpenAPI tool

The `bal openapi` tool bridges OpenAPI specifications and Ballerina code. It generates type-safe Ballerina service stubs and client connectors from OpenAPI (Swagger) YAML or JSON files, and can also export an OpenAPI specification from an existing Ballerina service. This ensures your integrations conform to API contracts and eliminates boilerplate.

## Prerequisites

The OpenAPI tool is included with the Ballerina distribution. Verify it is available:

```bash
bal openapi --help
```

## Generating a Ballerina service from OpenAPI

Create a service skeleton that matches an OpenAPI specification. The generated code includes resource functions, request/response types, and validation constraints.

1. Click the **+** **Add Artifacts** button in the canvas or click **+** next to **Entry Points** in the sidebar.
2. In the **Artifacts** panel, select **HTTP Service** under **Integration as API**.
3. Select **Import From OpenAPI Specification** under **Service Contract**.

   ![Select Import From OpenAPI Specification](/img/develop/tools/openapi-tool/step-import-spec.png)

4. Browse or enter the path to your OpenAPI specification file (YAML or JSON).
5. Configure the **Service Base Path** and listener settings.
6. Click **Create**.
7. WSO2 Integrator generates the service with resource function stubs, request/response types, and validation constraints matching your OpenAPI specification.

### Basic service generation

```bash
# Generate a service from an OpenAPI spec
bal openapi -i openapi.yaml --mode service

# Specify output directory
bal openapi -i openapi.yaml --mode service -o generated/

# Generate from a remote URL
bal openapi -i https://petstore3.swagger.io/api/v3/openapi.json --mode service
```

### Generated service structure

For an OpenAPI spec defining a `/orders` resource, the tool generates:

```
generated/
├── openapi_service.bal     # Service with resource function stubs
├── types.bal               # Request/response record types
└── utils.bal               # Helper utilities
```

The generated service file includes empty resource functions matching each OpenAPI operation:

```ballerina
import ballerina/http;

listener http:Listener ep = new (8090);

service /api on ep {

    // GET /orders
    resource function get orders(string? status, int 'limit = 20)
            returns Order[]|http:InternalServerError {
        // TODO: Implement logic
    }

    // POST /orders
    resource function post orders(OrderRequest payload)
            returns http:Created|http:BadRequest {
        // TODO: Implement logic
    }

    // GET /orders/{orderId}
    resource function get orders/[string orderId]()
            returns Order|http:NotFound {
        // TODO: Implement logic
    }
}
```

The generated types file includes record definitions derived from the OpenAPI schemas:

```ballerina
// Auto-generated from OpenAPI schema definitions
type Order record {|
    string id;
    string customerId;
    LineItem[] items;
    decimal total;
    "PENDING"|"CONFIRMED"|"SHIPPED" status;
|};

type OrderRequest record {|
    string customerId;
    LineItem[] items;
|};

type LineItem record {|
    string productId;
    int quantity;
    decimal unitPrice;
|};
```

## Generating a Ballerina client from OpenAPI

Create a type-safe HTTP client that wraps all API operations defined in the spec.

1. Click the **+** **Add Artifacts** button in the canvas.
2. In the **Artifacts** panel, select **Connection** under **Other Artifacts**.
3. Select **Connect Via API Specification** and provide the OpenAPI spec file.

   ![Client generation from OpenAPI](/img/develop/tools/openapi-tool/step-client-generation.png)

4. In the **Create Connection** step, configure the connection details. Expand **Advanced Configurations** to set the following optional fields:

   - **Config** — The configurations to use when initializing the connector.
   - **Service Url** — URL of the target service.

   ![Connection details configuration](/img/develop/tools/openapi-tool/step-connection-details.png)

5. Enter a **Connection Name** for the generated client (for example, `openapiClient`).
6. Click **Save Connection**.
7. WSO2 Integrator generates a type-safe client connector with methods matching each API operation.

### Basic client generation

```bash
# Generate a client connector
bal openapi -i openapi.yaml --mode client

# Generate with a specific client class name
bal openapi -i openapi.yaml --mode client --client-methods resource
```

### Using the generated client

```ballerina
import generated_client as api;

configurable string apiUrl = ?;
configurable string apiKey = ?;

final api:Client orderClient = check new (apiUrl, {
    httpVersion: http:HTTP_1_1,
    customHeaders: {"X-API-Key": apiKey}
});

function getOrders(string? status) returns api:Order[]|error {
    // The client method name matches the operationId from the spec
    return check orderClient->getOrders(status = status);
}

function createOrder(api:OrderRequest req) returns api:Order|error {
    return check orderClient->createOrder(req);
}
```

## Generating both service and client

```bash
# Generate service and client together
bal openapi -i openapi.yaml

# This creates both:
#   openapi_service.bal  -- Service stub
#   openapi_client.bal   -- Client connector
#   types.bal            -- Shared types
```

## Exporting OpenAPI from a Ballerina service

Generate an OpenAPI specification from an existing Ballerina HTTP service:

1. Open the HTTP service in the **Service Designer**.
2. Click **Export** in the service header toolbar.
3. Select **Export OpenAPI Specification**.

   ![Export OpenAPI from service](/img/develop/tools/openapi-tool/step-export.png)

4. Choose the output location.
5. Click **Select OAS Save Location**.

```bash
# Export OpenAPI spec from a Ballerina project
bal openapi -i service.bal --mode export

# Export to a specific file
bal openapi -i service.bal --mode export -o api-spec/openapi.yaml
```

Given this service:

```ballerina
service /api on new http:Listener(8090) {
    resource function get orders() returns Order[]|error { ... }
    resource function post orders(OrderRequest req) returns Order|http:BadRequest|error { ... }
    resource function get orders/[string id]() returns Order|http:NotFound|error { ... }
}
```

The tool produces an OpenAPI YAML describing the paths, request/response schemas, and status codes.

## Command reference

| Command | Description |
|---|---|
| `bal openapi -i <spec>` | Generate service and client from spec |
| `bal openapi -i <spec> --mode service` | Generate service only |
| `bal openapi -i <spec> --mode client` | Generate client only |
| `bal openapi -i <service.bal> --mode export` | Export OpenAPI from service |
| `-o <dir>` | Output directory |
| `--nullable` | Make fields nullable by default |
| `--client-methods resource` | Use resource methods in client |
| `--client-methods remote` | Use remote methods in client |
| `--tags <tag1,tag2>` | Generate only operations with specified tags |
| `--operations <op1,op2>` | Generate only specified operation IDs |

## Customizing generated code

### Filtering by tags or operations

```bash
# Generate only order-related operations
bal openapi -i openapi.yaml --mode service --tags orders

# Generate specific operations
bal openapi -i openapi.yaml --mode client --operations getOrders,createOrder
```

### Handling nullable fields

```bash
# Treat all optional fields as nullable
bal openapi -i openapi.yaml --nullable
```

## Workflow example

A typical workflow for building an API integration:

1. **Obtain the OpenAPI spec** from the API provider.
2. **Generate the client**: `bal openapi -i partner-api.yaml --mode client`
3. **Write integration logic** using the generated client types.
4. **Generate your own service**: `bal openapi -i my-api.yaml --mode service`
5. **Implement the service** resource functions with your integration logic.
6. **Export your spec**: `bal openapi -i service.bal --mode export` to share with consumers.

## What's next

- [GraphQL Tool](graphql-tool.md) -- Generate GraphQL services from SDL schemas
- [gRPC Tool](grpc-tool.md) -- Generate gRPC services from Protocol Buffer definitions
- [Visual Flow Designer](/docs/develop/design-logic/flow-designer) -- Build logic visually on top of generated stubs
