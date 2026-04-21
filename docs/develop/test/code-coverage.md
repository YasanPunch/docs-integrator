---
title: Code coverage and reports
---

Generate HTML test reports to review results at a glance, measure how much of your integration code is exercised by tests, and enforce coverage thresholds in CI/CD pipelines.

## Test reports

Use the `--test-report` flag to generate an HTML report of your test results.

```bash
bal test --test-report
```

The report is generated at `target/report/test_results.html`. Open it in a browser to see:

- Summary of total, passed, failed, and skipped tests
- Package-level and module-level test breakdowns
- Execution time per test
- Failure details with stack traces

![Ballerina Test Report showing 4 total tests with 3 passed, 1 failed, and 0 skipped, along with a package-level breakdown table](/img/develop/test/execute-tests/test-report.png)

### Console output

Test results also appear in the console by default.

```bash
Compiling source
    myorg/mypackage:0.1.0

Running Tests

    mypackage

        [pass] testOrderCreation
        [pass] testOrderValidation
        [fail] testPaymentProcessing

                Error: assertEqual failed
                    expected: "approved"
                    actual:   "declined"
                at mypackage:tests/payment_test.bal:45

        2 passing
        1 failing
        0 skipped
```

## Generate coverage reports

Add the `--code-coverage` flag along with `--test-report` to generate an HTML report that includes coverage data.

```bash
# HTML test report with code coverage
bal test --test-report --code-coverage
```

Coverage results are generated at:

```bash
target/report/test_results.html    # HTML report with coverage
target/report/coverage/            # Raw coverage data
```

Code coverage only includes Ballerina source files being tested. Files under the `tests/` directory are automatically excluded from coverage calculations.

## Understanding coverage metrics

The coverage report tracks several metrics:

| Metric | Description |
|--------|-------------|
| **Line coverage** | Percentage of executable lines that were run during tests |
| **Branch coverage** | Percentage of conditional branches (if/else, match) that were taken |
| **Function coverage** | Percentage of functions that were called at least once |

### Reading the HTML report

The HTML coverage report provides:

- **Package-level summary** — overall coverage percentage averaged across modules
- **Module-level detail** — coverage breakdown per module
- **File-level detail** — coverage breakdown per source file
- **Line-level highlighting** — green (covered), red (not covered), yellow (partially covered)

## Coverage report formats

### JaCoCo XML format

Generate JaCoCo-compatible XML reports for integration with CI/CD platforms like CodeCov.

```bash
# JaCoCo XML coverage report
bal test --code-coverage --coverage-format=xml

# HTML and JaCoCo XML together
bal test --test-report --code-coverage --coverage-format=xml
```

The XML report covers both Ballerina source and native Java source coverage.

### Exclude files from coverage

Use the `--excludes` flag to omit specific files or directories from coverage calculations.

```bash
bal test --test-report --code-coverage --excludes='./generated'
```

| Pattern | Effect |
|---|---|
| `./` or `./**` | Excludes all source files |
| `./*` | Excludes default module files only |
| `./generated/**` | Excludes a specific directory |
| `./modules/**` | Excludes all module files |
| `./modules/*/util.bal` | Excludes a specific file across modules |

## Coverage for integration services

When testing HTTP services, coverage tracks which resource functions and code paths your tests exercise.

```ballerina
import ballerina/http;

service /api on new http:Listener(9090) {

    // Covered if a test sends GET /api/orders
    resource function get orders() returns json[] {
        return [{"id": "ORD-001"}];
    }

    // Covered if a test sends POST /api/orders with valid payload
    resource function post orders(json payload) returns http:Created|http:BadRequest {
        if payload == () {
            return http:BAD_REQUEST;  // Only covered if test sends empty payload
        }
        return http:CREATED;  // Only covered if test sends valid payload
    }

    // Not covered if no test calls DELETE
    resource function delete orders/[string id]() returns http:NoContent {
        return http:NO_CONTENT;
    }
}
```

To achieve full coverage of this service, you need tests that:

1. Send a GET request to `/api/orders`
2. Send a POST with a valid payload
3. Send a POST with an empty/null payload
4. Send a DELETE request

## Improving coverage

### Identifying gaps

Use the HTML report to find uncovered code, then write targeted tests.

```ballerina
import ballerina/test;
import ballerina/http;

http:Client testClient = check new ("http://localhost:9090");

// Test the happy path
@test:Config {groups: ["coverage"]}
function testCreateOrderSuccess() returns error? {
    json payload = {"item": "Widget", "quantity": 5};
    http:Response resp = check testClient->/api/orders.post(payload);
    test:assertEquals(resp.statusCode, 201);
}

// Test the error path to cover the BadRequest branch
@test:Config {groups: ["coverage"]}
function testCreateOrderBadRequest() returns error? {
    http:Response resp = check testClient->/api/orders.post(());
    test:assertEquals(resp.statusCode, 400);
}

// Cover the DELETE endpoint
@test:Config {groups: ["coverage"]}
function testDeleteOrder() returns error? {
    http:Response resp = check testClient->/api/orders/["ORD-001"].delete;
    test:assertEquals(resp.statusCode, 204);
}
```

### Covering error handling paths

Error handling code is commonly under-tested. Write tests that trigger error conditions.

```ballerina
import ballerina/test;

function processPayment(decimal amount) returns string|error {
    if amount <= 0 {
        return error("Invalid amount: must be positive");
    }
    if amount > 10000 {
        return error("Amount exceeds single transaction limit");
    }
    return "approved";
}

@test:Config {}
function testPaymentSuccess() returns error? {
    string result = check processPayment(150.00);
    test:assertEquals(result, "approved");
}

@test:Config {}
function testPaymentNegativeAmount() {
    string|error result = processPayment(-50.00);
    test:assertTrue(result is error);
    if result is error {
        test:assertTrue(result.message().includes("must be positive"));
    }
}

@test:Config {}
function testPaymentExceedsLimit() {
    string|error result = processPayment(15000.00);
    test:assertTrue(result is error);
    if result is error {
        test:assertTrue(result.message().includes("exceeds single transaction limit"));
    }
}
```

## Enforcing coverage thresholds

### Minimum coverage flag

Use the `--min-coverage` flag to fail the build when coverage falls below a threshold.

```bash
# Fail if coverage is below 80%
bal test --code-coverage --min-coverage=80
```

The command returns a non-zero exit code if coverage is below the specified percentage, which naturally fails CI pipelines.

### CI/CD integration

```yaml
# GitHub Actions example
- name: Run tests with coverage
  run: bal test --test-report --code-coverage --min-coverage=80

- name: Upload coverage report
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: coverage-report
    path: target/report/
```

## Excluding code from coverage

Some code does not need test coverage, such as generated code or test utilities. Use the `tests/` directory convention — test files are automatically excluded from coverage calculations.

For main source code that should be excluded, restructure to separate testable logic from infrastructure code:

```ballerina
// main.bal — infrastructure (harder to test, lower coverage expectation)
public function main() returns error? {
    // Start listeners, configure runtime
}

// order_logic.bal — business logic (high coverage expected)
public function validateOrder(json order) returns boolean|error {
    // Pure logic, easily testable
    string? item = check order.item;
    return item is string && item.length() > 0;
}
```

## Best practices

- **Aim for meaningful coverage, not 100%** — focus on business logic, error paths, and conditional branches
- **Track coverage trends** — falling coverage on a PR indicates untested new code
- **Cover both success and error paths** — error handling branches are where many production bugs hide
- **Use coverage to find gaps, not as a goal** — high coverage with weak assertions provides false confidence
- **Review coverage on every PR** — integrate coverage reports into code review workflow
- **Exclude generated code** — do not chase coverage in auto-generated code or boilerplate

## What's next

- [Execute tests](execute-tests.md) — Run tests from the visual designer, CLI, or in parallel
- [Unit testing](unit-testing.md) — Write effective unit tests
- [Test services and clients](test-services-clients.md) — Integration testing patterns
