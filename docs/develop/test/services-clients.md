---
title: Test Services & Clients
---

Test your services end-to-end by invoking real endpoints from within a test function, and test your client code by mocking the responses it depends on. The same test infrastructure from [Unit Testing](unit-testing.md) applies — create a test function, open it in the flow diagram, and build your test logic from there.

## Testing a service

Any services defined in your package start automatically on their configured ports when tests run and shut down after all tests complete.

1. Create a test function as described in [Unit Testing](unit-testing.md) and open it in the flow diagram view.

2. In the flow diagram, click the **+** placeholder node to add a step, then select **Add Connection** from the node panel. The **Add Connection** dialog opens.

   ![Add Connection dialog showing pre-built connectors including HTTP, GraphQL, WebSocket, TCP, UDP, and FTP](/img/develop/test/test-services-clients/add-connection-dialog.png)

3. In the **Add Connection** dialog, select the pre-built connector that matches your service type. For an HTTP service, select **HTTP** (`ballerina/http`).

4. Configure the connection — provide the service base URL (for example, `http://localhost:9090`) and any other required settings. Click **Save**.

5. The connector appears in the flow diagram. Add action nodes from the connector (for example, `http:get` or `http:post`) to invoke the endpoint you want to test.

   ![Test flow diagram showing Start node connected to an http:get action node linked to the httpClient connection](/img/develop/test/test-services-clients/test-flow-with-connection.png)

6. Add assertion nodes from the **Test** category to verify the response. See [Unit Testing — Assertions](unit-testing.md#assertions) for available assertion nodes.

Declare the service and an `http:Client` targeting it in the same test file. The test framework starts the service before tests run.

**`main.bal`** — service under test:

```ballerina
import ballerina/http;

service http:Service /foo on new http:Listener(9090) {

    resource function get bar(int value) returns http:Ok|http:BadRequest {
        if value < 0 {
            return <http:BadRequest>{body: "Incorrect ID value"};
        }
        return <http:Ok>{body: "Retrieved ID " + value.toString()};
    }
}
```

**`tests/main_test.bal`** — test using an HTTP client:

```ballerina
import ballerina/http;
import ballerina/test;

http:Client testClient = check new ("http://localhost:9090/foo");

@test:Config {}
public function testGet() returns error? {
    http:Response response = check testClient->/bar.get(value = 10);
    test:assertEquals(response.statusCode, http:STATUS_OK);
    test:assertEquals(response.getTextPayload(), "Retrieved ID 10");

    response = check testClient->/bar.get(value = -5);
    test:assertEquals(response.statusCode, http:STATUS_BAD_REQUEST);
    test:assertEquals(response.getTextPayload(), "Incorrect ID value");
}
```

To use a configurable port — useful when running multiple service tests on different ports:

```toml
# tests/Config.toml
hostName = "http://localhost:9091/foo"
port = 9091
```

## Testing a client

To test client code, use object mocking to stub the responses that the client would receive from an external service. This lets you test your client logic without depending on a live external API.

The following example tests a function that calls the Chuck Norris API and replaces "Chuck Norris" with a given name. Instead of calling the real API, the test mocks the HTTP client to return a controlled response.

![Flow diagram showing test:mock, test:thenReturn, http:get, http:getJsonPayload, and test:assertEquals nodes for a client test](/img/develop/test/test-services-clients/test-client-mock-flow.png)

For a complete guide to object and function mocking, see [Mocking](mocking.md).

**`main.bal`** — function that uses an HTTP client:

```ballerina
import ballerina/http;
import ballerina/io;

http:Client clientEndpoint = check new ("https://api.chucknorris.io/jokes/");

function getRandomJoke(string name) returns string|error {
    http:Response response = check clientEndpoint->/random;

    if response.statusCode != http:STATUS_OK {
        string errorMsg = "error occurred while sending GET request";
        io:println(errorMsg, ", status code: ", response.statusCode);
        return error(errorMsg);
    }

    json payload = check response.getJsonPayload().ensureType();
    string joke = check payload.value;
    return re `Chuck Norris`.replaceAll(joke, name);
}
```

**`tests/main_test.bal`** — test with a mocked client:

```ballerina
import ballerina/http;
import ballerina/test;

@test:Config {}
public function testGetRandomJoke() returns error? {
    clientEndpoint = test:mock(http:Client);

    test:prepare(clientEndpoint).whenResource("::path")
        .withPathParameters({path: ["random"]})
        .onMethod("get").thenReturn(getMockResponse());

    http:Response result = check clientEndpoint->/random;
    json payload = check result.getJsonPayload();

    test:assertEquals(payload, {"value": "When Chuck Norris wants an egg, he cracks open a chicken."});
}

function getMockResponse() returns http:Response {
    http:Response mockResponse = new;
    mockResponse.setPayload({"value": "When Chuck Norris wants an egg, he cracks open a chicken."});
    return mockResponse;
}
```

`test:mock` is not currently supported in the Visual Designer. To test a `final` client, extract the client initialization into a separate function and mock that function using `@test:Mock`:

For `final` clients that cannot be reassigned, extract the initialization into a separate function and mock it with `@test:Mock`:

```ballerina
// main.bal
final http:Client clientEndpoint = check intializeClient();

function intializeClient() returns http:Client|error {
    return new ("https://api.chucknorris.io/jokes/");
}
```

```ballerina
// tests/main_test.bal
@test:Mock { functionName: "intializeClient" }
function getMockClient() returns http:Client|error {
    return test:mock(http:Client);
}
```

## Best practices

- **Use unique ports** for each service under test to avoid conflicts when multiple services run during the same test suite.
- **Test both success and error paths** — send valid inputs and malformed or out-of-range values to verify your error handling.
- **Use `Config.toml` in `tests/`** to define test-specific hosts and ports so your test client points to the local test service rather than a deployed environment.
- **Mock external clients** rather than calling live APIs in tests — this keeps tests fast, deterministic, and independent of network availability.
- **Extract `final` client initialization** into a separate function so you can swap it out with a mock during testing.

## What's next

- [Unit Testing](unit-testing.md) — create test functions with assertions
- [Mocking](mocking.md) — complete guide to object and function mocking
- [Execute Tests](execute-tests.md) — run tests and view results
- [Ballerina — Test Services and Clients](https://ballerina.io/learn/test-ballerina-code/test-services-and-clients/) — Ballerina language reference for service and client testing
