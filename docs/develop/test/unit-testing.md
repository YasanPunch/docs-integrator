---
title: Unit Testing
---

Write automated tests for your integrations using Ballerina's built-in test framework. The framework provides annotations, assertions, and lifecycle hooks to structure reliable, repeatable tests. Test functions are never included in production builds.

## Test file structure

Ballerina test files live in a `tests/` directory within your package. Any `.bal` file inside this directory is treated as a test source file and has access to all symbols in the parent module.

```
my-integration/
  Ballerina.toml
  main.bal
  tests/
    main_test.bal
    Config.toml         # test-specific configuration
    resources/          # test data files
```

## Creating a test

1. Open the integration in WSO2 Integrator.
2. Click the **Testing** icon (flask) in the left sidebar. The **Test Explorer** panel opens, listing existing tests grouped by integration.
3. Click **+** next to the integration name to create a new test. The **Create New Test Case** form opens.

   ![Create New Test Case form showing Name, Groups, and Enabled fields](/img/develop/test/unit-testing/create-test-case-form.png)

4. Fill in the following fields:

   | Field | Description |
   |---|---|
   | **Name** | Name of the test function. Required. |
   | **Groups** | Groups this test belongs to. Use **+ Add Item** to add group names for selective execution. |
   | **Enabled** | Check to include this test in test runs. Uncheck to skip it. |

5. Expand **Advanced Configurations** to set additional options:

   | Field | Description |
   |---|---|
   | **Minimum Pass Rate (%)** | Minimum percentage of assertions that must pass for the test to succeed. Default is 100%. |
   | **Depends On** | List of test function names that must pass before this test runs. |
   | **Before Function** | Function to execute before this test runs. |
   | **After Function** | Function to execute after this test completes. |
   | **Runs** | Number of times to execute this test. |
   | **Data Provider** | Function that supplies multiple data sets to the test function. See [Data-Driven Tests](data-driven-tests.md). |

6. Click **Save**. The test opens in the flow diagram view.

   ![Test flow diagram showing the Start node and node panel with Test assertion nodes on the right](/img/develop/test/unit-testing/test-flow-diagram.png)

7. Add test logic by selecting nodes from the panel on the right. The **Test** category provides assertion nodes: `assertTrue`, `assertFalse`, `assertEquals`, `assertNotEquals`, `assertExactEquals`, `assertNotExactEquals`, `assertFail`, and `mock`.

Import the `ballerina/test` module and annotate each test function with `@test:Config`.

```ballerina
import ballerina/test;

// Function under test
function add(int a, int b) returns int {
    return a + b;
}

@test:Config {}
function testAdd() {
    test:assertEquals(add(2, 3), 5, msg = "Addition failed");
}

@test:Config {}
function testAddNegative() {
    test:assertEquals(add(-1, -4), -5);
}
```

The `@test:Config` annotation accepts these optional fields:

| Field | Type | Description |
|---|---|---|
| `enable` | `boolean` | Set to `false` to skip the test. Default `true`. |
| `groups` | `string[]` | Tag the test for selective execution. |
| `dataProvider` | `function` | Supply multiple data sets to the test function. |
| `before` | `function` | Run a setup function before this test. |
| `after` | `function` | Run a teardown function after this test. |
| `dependsOn` | `function[]` | Run this test only after the listed tests pass. |

## Assertions

In the test flow diagram, select assertion nodes from the **Test** category in the node panel. Each node exposes its parameters as fields in the configuration panel — for example, `assertEquals` accepts an **actual value**, an **expected value**, and an optional **message**.

The available assertion nodes map directly to the Ballerina assertion functions described in the **Ballerina Code** tab.

Every assertion function accepts an optional `msg` parameter for custom failure messages.

```ballerina
import ballerina/test;

@test:Config {}
function testAssertions() {
    test:assertEquals(getStatus(200), "OK");

    test:assertTrue(isValid("user@example.com"), msg = "Email should be valid");
    test:assertFalse(isValid(""), msg = "Empty string should be invalid");

    test:assertNotEquals(generateId(), "", msg = "ID must not be empty");
}

@test:Config {}
function testExpectedFailure() returns error? {
    var result = parsePayload("<<<invalid>>>");
    if result is error {
        test:assertEquals(result.message(), "Invalid payload format");
    } else {
        test:assertFail(msg = "Expected an error for invalid payload");
    }
}
```

| Assertion | Purpose |
|---|---|
| `test:assertEquals` | Values are equal |
| `test:assertNotEquals` | Values are not equal |
| `test:assertTrue` | Condition is `true` |
| `test:assertFalse` | Condition is `false` |
| `test:assertFail` | Unconditionally fail with a message |
| `test:assertExactEquals` | Reference equality (same object) |
| `test:assertNotExactEquals` | References are not the same object |

## Lifecycle hooks

Use the **Before Function** and **After Function** fields in the **Create New Test Case** form to run setup and teardown logic around individual tests. These fields accept the name of any function defined in your test file.

For suite-level setup and teardown that runs once before or after all tests in the module, use the `@test:BeforeSuite` and `@test:AfterSuite` annotations in Ballerina code (see the **Ballerina Code** tab).

```ballerina
import ballerina/test;
import ballerina/log;

@test:BeforeSuite
function setupSuite() {
    log:printInfo("Starting test suite -- initializing resources");
}

@test:AfterSuite
function teardownSuite() {
    log:printInfo("Test suite complete -- cleaning up resources");
}

@test:BeforeEach
function beforeEachTest() {
    log:printInfo("Resetting state for next test");
}

@test:AfterEach
function afterEachTest() {
    log:printInfo("Post-test cleanup");
}
```

| Annotation | Scope |
|---|---|
| `@test:BeforeSuite` | Once before any test in the module runs |
| `@test:AfterSuite` | Once after all tests in the module run |
| `@test:BeforeGroups` | Before the first test in specified groups |
| `@test:AfterGroups` | After the last test in specified groups |
| `@test:BeforeEach` | Before every test function |
| `@test:AfterEach` | After every test function |

## Running tests

In the **Test Explorer** panel, click the run (▷) icon next to a test function or integration name to execute it. Results appear inline — the counter next to each test shows how many passed out of the total (for example, `0/1` means zero of one tests passed).

Use the filter input at the top of the Test Explorer to narrow results by test name, tag, or group.

```bash
# Run all tests
bal test

# Run a specific test by name
bal test --tests testAdd

# Run tests in a specific group
bal test --groups unit
```

For more options — parallel execution, code coverage, and report formats — see [Execute Tests](execute-tests.md).

## What's next

- [Data-Driven Tests](data-driven-tests.md) — parameterize tests with data providers to run the same logic against multiple inputs
- [Test Groups](test-groups.md) — organize and selectively run tests using group tags
- [Mocking](mocking.md) — isolate your tests from external dependencies
- [Execute Tests](execute-tests.md) — all options for running tests and viewing results
