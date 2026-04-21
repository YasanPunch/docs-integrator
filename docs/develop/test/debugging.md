---
title: Debugging in VS Code
---

Debug your integrations and tests step-by-step in VS Code using the WSO2 Integrator extension. Set breakpoints, inspect variables, and trace execution flow to diagnose issues quickly.

## Setting Breakpoints

Click in the gutter to the left of any line number to set a breakpoint. A red dot appears, indicating that execution will pause at that line.

### Breakpoints in Integration Code

Set breakpoints in your service resource functions, transformation logic, or connector calls to inspect data at runtime.

```ballerina
import ballerina/http;

service /api on new http:Listener(9090) {

    resource function post orders(http:Request req) returns json|error {
        json payload = check req.getJsonPayload();  // Set breakpoint here
        string orderId = check generateOrderId();
        json response = check processOrder(orderId, payload);  // Or here
        return response;
    }
}
```

### Breakpoints in Test Code

Breakpoints work in test files exactly the same way. Set them inside `@test:Config` functions to debug failing assertions.

```ballerina
import ballerina/test;

@test:Config {}
function testOrderProcessing() returns error? {
    json input = {item: "Widget", quantity: 5};
    json result = check processOrder("ORD-TEST", input);  // Breakpoint here
    test:assertEquals(result.status, "created");           // Or here
}
```

### Conditional Breakpoints

Right-click a breakpoint and select **Edit Breakpoint** to add a condition. The debugger only pauses when the condition evaluates to `true`. For example, enter `orderId == "ORD-005"` to pause only for a specific order.

### Logpoints

Instead of pausing execution, a logpoint prints a message to the debug console. Right-click in the gutter, select **Add Logpoint**, and enter a message template such as `Order received: {payload.toJsonString()}`. This avoids modifying source code with temporary log statements.

## Starting a Debug Session

### Debug an Integration

1. Open your Ballerina source file in VS Code.
2. Set breakpoints at the lines you want to inspect.
3. Click the **Debug** CodeLens above the `service` or `main` function, or press `F5`.
4. The service starts in debug mode. Send requests via the [Try-It tool](try-it.md) or an external client to hit your breakpoints.

### Debug a Test

1. Open a test file in the `tests/` directory.
2. Set breakpoints inside your test function.
3. Click the **Debug** icon next to the `@test:Config` annotation, or open the Testing panel and click the debug button.
4. The test runs and pauses at your breakpoints.

### Debug Configuration in launch.json

VS Code stores debug configurations in `.vscode/launch.json`. The WSO2 Integrator extension auto-generates configurations, but you can customize them.

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Ballerina Debug",
            "type": "ballerina",
            "request": "launch",
            "programArgs": [],
            "commandOptions": []
        },
        {
            "name": "Ballerina Test Debug",
            "type": "ballerina",
            "request": "launch",
            "debugTests": true,
            "commandOptions": ["--tests", "testOrderProcessing"]
        }
    ]
}
```

## Stepping Through Execution

Once the debugger pauses at a breakpoint, use the debug toolbar controls:

| Control        | Shortcut | Description                                    |
|----------------|----------|------------------------------------------------|
| **Continue**   | `F5`     | Resume execution until the next breakpoint     |
| **Step Over**  | `F10`    | Execute the current line and move to the next  |
| **Step Into**  | `F11`    | Enter the function being called on this line   |
| **Step Out**   | `Shift+F11` | Finish the current function and return to the caller |
| **Restart**    | `Ctrl+Shift+F5` | Restart the debug session                |
| **Stop**       | `Shift+F5` | End the debug session                        |

Use **Step Into** to trace execution into your helper functions and transformations. Use **Step Over** to skip standard library calls you do not need to inspect.

## Inspecting Variables and Payloads

### Variables Panel

The **Variables** panel in the Debug sidebar shows all variables in the current scope, organized into:

- **Local** -- variables defined in the current function.
- **Global** -- module-level variables and configurable values.

Expand complex types (records, JSON, arrays) to drill into nested fields. This is particularly useful for inspecting HTTP request payloads and transformation results.

### Watch Expressions

Add expressions to the **Watch** panel to monitor specific values across debug steps. For example:

- `payload.orderId` -- track a specific field in a JSON payload.
- `orders.length()` -- monitor the size of a collection.
- `result is error` -- check whether a result is an error type.

### Debug Console

Use the **Debug Console** to evaluate Ballerina expressions interactively while paused at a breakpoint. Type any expression to inspect values or test logic without modifying your code.

## Remote Debugging

Attach the VS Code debugger to a Ballerina service running in a remote environment or a separate terminal session.

1. Start your service with the debug flag:

   ```bash
   bal run --debug 5005
   ```

2. In VS Code, add an attach configuration to `.vscode/launch.json`:

   ```json
   {
       "name": "Ballerina Remote Debug",
       "type": "ballerina",
       "request": "attach",
       "debuggeeHost": "127.0.0.1",
       "debuggeePort": 5005
   }
   ```

3. Start the **Ballerina Remote Debug** configuration from the Run and Debug panel. The debugger connects and pauses at your breakpoints.

## Log-Based Debugging

When interactive debugging is not practical (such as in CI environments or production), use strategic logging.

```ballerina
import ballerina/log;

resource function post orders(http:Request req) returns json|error {
    json payload = check req.getJsonPayload();
    log:printDebug("Received order payload", payload = payload);

    string orderId = check generateOrderId();
    log:printInfo("Processing order", orderId = orderId);

    json result = check processOrder(orderId, payload);
    log:printDebug("Order processed", result = result);
    return result;
}
```

Control log output with the `--debug` flag or by configuring log levels in `Config.toml`:

```toml
[ballerina.log]
level = "DEBUG"
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Breakpoints not hit | Verify the service is running in debug mode (not `bal run` without `--debug`) |
| Debugger does not connect | Check that the debug port (default 5005) is not in use by another process |
| Variables show as "unavailable" | Step forward one line -- some values are only available after their assignment |
| Test breakpoints skipped | Use the debug icon next to the test, not the regular run button |

## What's Next

- [Built-in Try-It Tool](try-it.md) -- Send requests to your service while debugging
- [Code Coverage](code-coverage.md) -- Identify untested code paths
