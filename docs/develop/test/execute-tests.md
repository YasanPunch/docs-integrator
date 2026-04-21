---
title: Execute tests
---

Ballerina executes test functions through a well-defined lifecycle of setup and teardown stages. You can run tests from the WSO2 Integrator visual designer, the code editor, or the Ballerina CLI, and optionally enable parallel execution for faster feedback.

## Test execution lifecycle

The test framework runs setup and teardown functions in a fixed order around every test function:

1. **BeforeSuite** — runs once before all tests in the module.
2. **BeforeGroups** — runs once before the first test in each listed group.
3. **BeforeEach** — runs before every individual test function.
4. **Before (per-test)** — runs before a specific test, set via the `before` field in `@test:Config`.
5. **Test function** — the actual test.
6. **After (per-test)** — runs after that specific test, set via the `after` field in `@test:Config`.
7. **AfterEach** — runs after every individual test function.
8. **AfterGroups** — runs once after the last test in each listed group.
9. **AfterSuite** — runs once after all tests in the module complete.

```ballerina
import ballerina/io;
import ballerina/test;

// Runs once before all tests
@test:BeforeSuite
function beforeSuite() {
    io:println("Setting up test suite");
}

// Runs before the first test in the "integration" group
@test:BeforeGroups {value: ["integration"]}
function beforeIntegrationGroup() {
    io:println("Setting up integration group");
}

// Runs before every test
@test:BeforeEach
function beforeEach() {
    io:println("Setting up individual test");
}

@test:Config {groups: ["integration"]}
function testOrderCreation() {
    test:assertTrue(true, msg = "Order creation failed");
}

// Runs after every test
@test:AfterEach
function afterEach() {
    io:println("Cleaning up individual test");
}

// Runs after the last test in the "integration" group
@test:AfterGroups {value: ["integration"]}
function afterIntegrationGroup() {
    io:println("Cleaning up integration group");
}

// Runs once after all tests
@test:AfterSuite
function afterSuite() {
    io:println("Tearing down test suite");
}
```

### Failure behavior

When a lifecycle function fails, the framework skips or continues subsequent stages as follows:

| Failed stage | Effect |
|---|---|
| **BeforeSuite** | All tests, group-level, and per-test functions are skipped. |
| **BeforeGroups** | Tests in that group and their teardowns are skipped. `AfterGroups` is also skipped unless `alwaysRun` is enabled. |
| **BeforeEach** | All remaining tests are skipped. `AfterSuite` still executes. |
| **Before (per-test)** | That test and its `after` function are skipped. |
| **Test function** | Other lifecycle functions continue normally. |
| **AfterEach** | Subsequent `BeforeEach`, `AfterEach`, and tests are skipped. |

Set `alwaysRun` to `true` on `@test:AfterGroups` or `@test:AfterSuite` to ensure teardown functions execute even when earlier stages fail. This is useful for releasing resources like database connections or stopping services.

```ballerina
@test:AfterSuite {alwaysRun: true}
function cleanupResources() {
    // Always runs, even if BeforeSuite or tests fail
}
```

## Run tests

WSO2 Integrator provides a **Test Explorer** panel that lists all tests in your project, organized by integration and group.

![Test Explorer panel showing 5 of 6 tests failed with execution time, test tree organized by groups g1 and g2, and the code editor displaying Run, Debug, and Visualize codelens links with inline error details above each test function](/img/develop/test/execute-tests/test-explorer.png)

To run tests from the visual designer:

1. Click the **Testing** icon (flask) in the left sidebar to open the **Test Explorer**.
2. Use the controls at the top of the panel:
   - Click the **Run All Tests** button to execute every test in the project.
   - Click the **Run** icon next to a specific integration, group, or individual test to run only that subset.
3. In the code editor, click the **Run** codelens link above any `@test:Config` function to execute that single test. Use **Debug** to run with breakpoints enabled.

Test results appear in the terminal panel. Passed tests show a green checkmark and failed tests show a red cross in the Test Explorer tree.

Use the `bal test` command to execute tests from the terminal.

### Run all tests

```bash
bal test
```

### Run specific tests

```bash
# Run a single test by function name
bal test --tests testOrderCreation

# Run a test in the default module
bal test --tests MyPackage:testOrderCreation

# Run all tests in a specific module
bal test --tests MyPackage.transforms:*
```

### Run a specific data-driven test case

```bash
# Run a single case from a data provider
bal test --tests testOrderCreation#Case1
```

### Filter by group

```bash
# List all available groups
bal test --list-groups

# Run tests in specific groups
bal test --groups integration,unit

# Exclude specific groups
bal test --disable-groups slow,flaky
```

### Rerun failed tests

Focus on fixing failures without rerunning the entire suite.

```bash
bal test --rerun-failed
```

## Run tests in parallel

By default, Ballerina runs tests sequentially. Use the `--parallel` flag to enable concurrent execution for faster test runs.

```bash
bal test --parallel
```

### Concurrency safety requirements

The framework evaluates each test for concurrency safety before running it in parallel. A test must meet all of the following conditions:

- **Test function** must be `isolated`. If the function is not publicly exposed and meets all conditions for `isolated` functions, the compiler infers it automatically.
- **Data provider function** (if any) must be `isolated`, and the test function parameters must be subtypes of `readonly`.
- **Setup and teardown functions** (`before`, `after`, `BeforeEach`, `AfterEach`, `BeforeGroups`, `AfterGroups`) associated with the test must be `isolated`.

Tests that do not meet these conditions run sequentially, even when the `--parallel` flag is set. The framework prints diagnostic warnings at the start of execution listing the reason each test was excluded from parallel runs.

### Exclude a test from parallel execution

For tests that depend on shared state or external resources, set `serialExecution` to `true` to force sequential execution regardless of the `--parallel` flag.

```ballerina
import ballerina/test;

// This test runs in parallel (if isolated conditions are met)
@test:Config {}
isolated function testCalculateTotal() {
    test:assertEquals(10 + 20, 30);
}

// This test always runs sequentially
@test:Config {serialExecution: true}
function testDatabaseMigration() {
    // Modifies shared database state — not safe for parallel execution
    test:assertTrue(true);
}
```

:::caution When to avoid parallel execution
Avoid parallel execution when tests share mutable state, use the same database tables, or bind to the same network ports. Use the `serialExecution` flag or test groups to isolate conflicting tests.

## Troubleshooting

| Issue | Solution |
|---|---|
| Port already in use | Use unique ports per service or add an `@test:AfterSuite {alwaysRun: true}` cleanup function. |
| Tests pass locally, fail in CI | Check for environment-dependent values in `tests/Config.toml`. |
| Timeout errors | Increase client timeout values in test configurations. |
| Random test failures | Check for shared mutable state. Disable parallel execution or use `serialExecution: true`. |
| Tests not discovered | Verify test files are in the `tests/` directory and functions have `@test:Config`. |
| Parallel flag has no effect | Ensure test functions and their lifecycle functions are `isolated`. Check diagnostic warnings. |

## What's next

- [Code coverage and reports](code-coverage.md) -- Generate test reports, measure coverage, and configure report formats
- [Test groups](test-groups.md) -- Organize tests with groups for selective execution
- [Mocking](mocking.md) -- Replace external dependencies with controlled stubs
- [Debugging](/docs/develop/debugging/editor-debugging) -- Debug failing tests step-by-step
