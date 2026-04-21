---
title: Mocking
---

Mocking replaces real clients and functions with controlled stubs so tests run in isolation, without live services or side effects. The `ballerina/test` module supports two approaches: stubbing object methods and replacing functions with `@test:Mock`.

## Mocking objects

In the test flow diagram, use nodes from the **Test** category to stub method behavior. Add a `test:mock` node to create the mock object, then chain `test:prepare` and `thenReturn` nodes to control what each method returns.

![PLACEHOLDER: Flow diagram showing test:mock and test:prepare nodes used to stub an HTTP client method](/img/develop/test/mocking/flow-diagram.png)

`test:mock` is not fully supported in the Visual Designer for `final` clients. For those, extract client initialization into a separate function and mock it with `@test:Mock` (see [Mocking functions](#mocking-functions)).

**Stubbing** — use `test:prepare()` to control return values without replacing the entire client. Prefer this approach for simple cases.

```ballerina
import ballerina/http;
import ballerina/test;

http:Client backendClient = check new ("http://localhost:9090");

@test:Config {}
function testGetOrder() returns error? {
    http:Response mockResponse = new;
    mockResponse.statusCode = 200;
    mockResponse.setJsonPayload({orderId: "ORD-001", status: "completed"});

    // Basic return
    test:prepare(backendClient).when("get").thenReturn(mockResponse);

    // Argument-matched returns
    http:Response notFoundResponse = new;
    notFoundResponse.statusCode = 404;
    test:prepare(backendClient).when("get").withArguments("/orders/ORD-001").thenReturn(mockResponse);
    test:prepare(backendClient).when("get").withArguments("/orders/INVALID").thenReturn(notFoundResponse);

    // Sequential returns — useful for testing retry logic
    http:Response errorResponse = new;
    errorResponse.statusCode = 503;
    test:prepare(backendClient).when("get").thenReturnSequence(errorResponse, mockResponse);

    // Do nothing — suppress side effects such as sending email
    test:prepare(smtpClient).when("sendMessage").doNothing();
}
```

**Test doubles** — create a custom mock class and pass it to `test:mock()` for full control over behavior.

```ballerina
import ballerina/http;
import ballerina/test;

http:Client orderClient = check new ("http://localhost:9090");

client class MockOrderClient {
    resource function get orders/[string id]() returns json|error {
        return {orderId: id, status: "pending", total: 49.99};
    }

    resource function post orders(json payload) returns json|error {
        return {orderId: "ORD-NEW", status: "created"};
    }
}

@test:Config {}
function testWithMockClient() returns error? {
    orderClient = test:mock(http:Client, new MockOrderClient());

    json result = check orderClient->/orders/["ORD-001"];
    test:assertEquals(result.status, "pending");
}
```

**Stubbing resource methods** — for resource-based client stubs, use `whenResource`. More specific stubs take precedence over general ones.

```ballerina
// General stub
test:prepare(empClient).whenResource("employee/welcome/:id")
    .onMethod("get").thenReturn("Welcome — general stub");

// Path-parameter-specific stub
test:prepare(empClient).whenResource("employee/welcome/:id")
    .onMethod("get").withPathParameters({id: "emp014"})
    .thenReturn("Welcome — emp014");

// Most specific (path + arguments) — takes precedence over the above
test:prepare(empClient).whenResource("employee/welcome/:id")
    .onMethod("get").withPathParameters({id: "emp014"})
    .withArguments("vijay", "kumar")
    .thenReturn("Welcome — most specific");
```

## Mocking functions

The `@test:Mock` annotation is defined in code. In the flow diagram, nodes downstream of the mocked function behave normally — the mock transparently replaces what the function does when called during the test.

![PLACEHOLDER: Flow diagram showing a test function whose mocked dependency returns a controlled value via thenReturn](/img/develop/test/mocking/function-mock-flow.png)

Declare a `test:MockFunction` with `@test:Mock`, then use `test:when()` to define behavior.

```ballerina
import ballerina/test;

@test:Mock {functionName: "getCurrentTimestamp"}
test:MockFunction getCurrentTimestampMock = new ();

@test:Config {}
function testTimeSensitiveLogic() {
    // Return a fixed value for all calls
    test:when(getCurrentTimestampMock).thenReturn("2025-01-15T10:00:00Z");

    // Override for specific arguments
    test:when(getCurrentTimestampMock).withArguments(0, 0).thenReturn("1970-01-01T00:00:00Z");

    string result = formatEventTime();
    test:assertEquals(result, "Event scheduled at 2025-01-15T10:00:00Z");
}
```

**Mock imported functions** — specify `moduleName` to mock functions from external modules:

```ballerina
import ballerina/test;
import ballerina/io;

@test:Mock {moduleName: "ballerina/io", functionName: "println"}
test:MockFunction printlnMock = new ();

@test:Config {}
function testWithMockedPrintln() {
    test:when(printlnMock).doNothing();
    processAndLog("test data");
}
```

**Call an alternate function** — redirect a mocked function to a different implementation:

```ballerina
@test:Mock {functionName: "sendNotification"}
test:MockFunction sendNotificationMock = new ();

function mockSendNotification(string to, string message) returns error? {
    return; // no-op instead of sending a real notification
}

@test:Config {}
function testNotificationFlow() returns error? {
    test:when(sendNotificationMock).call("mockSendNotification");
    check processOrder("ORD-001");
}
```

**Call the original function** — restore real behavior after using a mock:

```ballerina
test:when(intAddMockFn).call("mockIntAdd");
test:assertEquals(addValues(11, 6), 5); // calls mock

test:when(intAddMockFn).callOriginal();
test:assertEquals(addValues(11, 6), 17); // calls real function
```

## What's next

- [Test Services & Clients](test-services-clients.md) — end-to-end service testing using real HTTP clients
- [Unit Testing](unit-testing.md) — test framework fundamentals and assertions
- [Execute Tests](execute-tests.md) — all options for running and filtering tests
- [Ballerina — Mocking](https://ballerina.io/learn/test-ballerina-code/mocking/) — Ballerina language reference for mocking
