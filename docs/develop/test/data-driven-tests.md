---
title: Data-Driven Tests
---

Run the same test logic against multiple inputs by attaching a data provider function to a test. The framework calls the test function once per data entry, reporting each case individually so failures are easy to pinpoint.

## Configuring a data provider

1. Create a test function as described in [Unit Testing](unit-testing.md). In the **Create New Test** form, expand **Advanced Configurations**.

   ![Advanced Configurations form showing the Data Provider field at the bottom](/img/develop/test/data-driven-tests/data-provider-field.png)

2. In the **Data Provider** field, click the function selector (**fx**) to open the function picker.

   ![Data Provider function selector dropdown showing Inputs, Variables, Configurables, and Functions options](/img/develop/test/data-driven-tests/data-provider-function-select.png)

3. From the dropdown, select **Functions** to pick an existing data provider function from your test file. To create a new one, click **+ New Function**, fill in the function name and return type, then click **Create**.

4. Click **Save**. The selected function is set as the data provider for this test.

Use the `dataProvider` field in the `@test:Config` annotation to attach a data provider function to a test.

**Array-based data provider** — the framework runs the test once per row. Use this for simple, ordered cases.

```ballerina
import ballerina/test;

function dataGen() returns string[][] {
    return [
        ["1", "2", "3"],
        ["10", "20", "30"],
        ["5", "6", "11"]
    ];
}

@test:Config {
    dataProvider: dataGen
}
function stringDataProviderTest(string fValue, string sValue, string result) {
    int a = checkpanic int:fromString(fValue);
    int b = checkpanic int:fromString(sValue);
    test:assertEquals(a + b, checkpanic int:fromString(result));
}
```

**Map-based data provider** — each entry has a string key. When a case fails, the report shows the key (e.g., `fruitsDataProviderTest["banana"]`), making it clear which scenario failed.

```ballerina
import ballerina/test;

function dataGen() returns map<[int, int, string]>|error {
    map<[int, int, string]> dataSet = {
        "banana": [10, 10, "banana"],
        "cherry": [5, 5, "cherry"]
    };
    return dataSet;
}

@test:Config {
    dataProvider: dataGen
}
function fruitsDataProviderTest(int a, int b, string fruit) {
    test:assertEquals(a + b, 20, msg = fruit);
}
```

## Running specific cases

To run a single case from a data-driven test, reference the test name and the case identifier:

```bash
# Map-based: use the key name in double quotes
bal test --tests fruitsDataProviderTest#"banana"

# Array-based: use the row index (zero-based)
bal test --tests stringDataProviderTest#1
```

Wildcard patterns also work — `fruitsDataProviderTest#"b*"` runs all cases whose key starts with `b`.

## What's next

- [Test Groups](test-groups.md) — run subsets of tests by group tag
- [Execute Tests](execute-tests.md) — all options for running tests and viewing results
- [Ballerina — Data-Driven Tests](https://ballerina.io/learn/test-ballerina-code/define-data-driven-tests/) — Ballerina language reference for data providers
