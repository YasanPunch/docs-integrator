---
title: AI-Generated Test Cases
---

Let AI analyze your integration code and generate test cases automatically. WSO2 Integrator uses AI to produce Ballerina test functions based on your service definitions, resource functions, and data transformation logic.

## How AI Test Generation Works

The AI test generation feature reads your Ballerina source code and performs the following analysis:

1. **Identifies testable units** -- resource functions, helper functions, data transformations, and connectors.
2. **Infers input/output types** -- reads function signatures, record types, and payload structures.
3. **Generates test scenarios** -- produces test functions covering the happy path, edge cases, and error conditions.
4. **Creates mock stubs** -- generates mocking boilerplate for external service calls so generated tests are self-contained.

The generated tests use the standard `ballerina/test` framework, so they integrate directly with the existing test runner and CLI.

## Generating Tests for a Service

### Step 1: Open your service

Open the service you want to test in the visual designer or the code editor.

### Step 2: Trigger AI test generation

Use one of these methods:

1. **Visual designer** -- In the Service Designer, click **Generate Tests** in the toolbar or from the resource action menu.
2. **Code editor** -- Click the **Generate Tests** CodeLens link that appears above a service or function definition.

:::tip Other ways to trigger generation
You can also press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS) and search for **WSO2 Integrator: Generate Tests**, or right-click inside a function body and select **Generate Tests** from the context menu.

### Step 3: Review the generated output

The AI creates a new test file (or appends to an existing one) in the `tests/` directory. For a service like:

In the Service Designer, the service shows its Listener (`http:Listener` on port `9090`), Base Path (`/api`), and a list of resources — `GET /orders` and `POST /orders`. Each resource function appears as a selectable item in the designer.

```ballerina
import ballerina/http;

service /api on new http:Listener(9090) {

    resource function get orders() returns json[] {
        return [{orderId: "ORD-001", status: "pending"}];
    }

    resource function post orders(json payload) returns json|error {
        // Order creation logic
        return {orderId: "ORD-002", status: "created"};
    }
}
```

The AI might generate:

```ballerina
import ballerina/http;
import ballerina/test;

http:Client testClient = check new ("http://localhost:9090");

@test:Config {
    groups: ["api", "orders"]
}
function testGetOrders() returns error? {
    json[] response = check testClient->/api/orders;
    test:assertTrue(response.length() > 0, msg = "Expected at least one order");
}

@test:Config {
    groups: ["api", "orders"]
}
function testCreateOrder() returns error? {
    json payload = {item: "Widget", quantity: 3, unitPrice: 12.50};
    json response = check testClient->/api/orders.post(payload);
    test:assertEquals(response.status, "created");
}

@test:Config {
    groups: ["api", "orders", "negative"]
}
function testCreateOrderEmptyPayload() returns error? {
    json payload = {};
    json|error response = testClient->/api/orders.post(payload);
    test:assertTrue(response is error, msg = "Empty payload should return an error");
}
```

## Reviewing and Customizing Generated Tests

AI-generated tests are a starting point, not a finished product. Review each generated test for the following:

### Verify Assertions

Check that assertions match your actual business logic. The AI infers expected values from your code, but it may not capture all domain-specific rules.

```ballerina
// AI generated this assertion based on the return type
test:assertEquals(response.status, "created");

// You might need to add additional assertions
test:assertTrue(response.orderId.toString().startsWith("ORD-"));
test:assertEquals(response.item, "Widget");
```

### Add Edge Cases

The AI covers common patterns, but you should add tests for edge cases specific to your integration:

- Boundary values (zero quantities, maximum payload sizes).
- Invalid authentication or expired tokens.
- Timeout scenarios for external service calls.
- Concurrent request handling.

### Adjust Mock Behavior

If the AI generated mock stubs, verify they return realistic data. Update mock return values to match your actual backend responses.

```ballerina
// AI-generated mock -- update with realistic response data
test:prepare(backendClient).when("get")
    .thenReturn({customerId: "C-100", name: "Jane Doe", tier: "premium"});
```

### Rename Test Functions

The AI generates functional but sometimes generic names. Rename them to describe the specific scenario being tested.

```ballerina
// Before: generic AI name
function testPostOrders() returns error? { ... }

// After: describes the specific scenario
function testCreateOrderWithValidPayloadReturnsCreated() returns error? { ... }
```

## Generating Tests for Data Transformations

AI test generation is particularly effective for data transformation functions, where input and output types are clearly defined.

```ballerina
// Your transformation function
function transformOrder(json input) returns xml|error {
    string orderId = check input.orderId;
    string status = check input.status;
    xml output = xml `${orderId}${status}`;
    return output;
}
```

The AI generates test cases covering valid inputs, missing fields, and type mismatches -- ensuring your transformation handles diverse payloads.

## Coverage Analysis

After generating tests, run them with code coverage enabled to see what percentage of your source code the AI tests cover.

```bash
bal test --code-coverage
```

Review the coverage report at `target/report/test_results.html` to identify gaps. Common areas that may need additional manual tests:

- **Error handling branches** -- catch blocks and error-return paths.
- **Conditional logic** -- all branches of `if/else` and `match` statements.
- **Configuration variations** -- code paths triggered by different configurable values.

Use the coverage report to guide where you write additional manual tests to complement the AI-generated suite.

## Best Practices

- **Generate first, then refine** -- use AI tests as scaffolding and add domain-specific assertions.
- **Do not commit generated tests without review** -- always verify that assertions are correct and meaningful.
- **Regenerate after major changes** -- when your service API changes significantly, regenerate tests and merge relevant updates.
- **Combine with manual tests** -- AI covers breadth; manually written tests cover depth for critical business logic.
- **Tag generated tests** -- use test groups like `"ai-generated"` to distinguish them from hand-written tests.

## What's Next

- [Debugging](/docs/develop/debugging/editor-debugging) -- Debug failing tests step-by-step
- [Code Coverage](code-coverage.md) -- Measure and improve test coverage
- [Unit Testing](unit-testing.md) -- Test framework fundamentals and assertions
