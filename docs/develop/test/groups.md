---
title: Test Groups
---

Assign tests to named groups and run or exclude specific subsets using the `--groups` and `--disable-groups` flags. Group tags let you separate fast unit tests from slow integration tests and control what runs at each stage.

## Defining groups

1. Open a test in the **Test Explorer** or click **+** to create one. In the **Create New Test Case** (or **Update Test Case**) form, click **+ Add Item** under **Groups** and enter a group name.

   ![Update Test Case form showing the Groups field with "g1" added and the Test Explorer on the left displaying tests organized under group nodes g1 and g2](/img/develop/test/test-groups/test-groups-form.png)

2. Click **Save**. The test appears under the group name in the **Test Explorer**.

A test can belong to multiple groups — click **+ Add Item** again to add more group names.

Use the `groups` field in `@test:Config` to assign one or more group names to a test.

```ballerina
import ballerina/test;

@test:Config {
    groups: ["g1"]
}
function testFunction1() {
    test:assertTrue(true);
}

@test:Config {
    groups: ["g2"]
}
function testFunction2() {
    test:assertTrue(true);
}

@test:Config {
    groups: ["g1", "g2"]
}
function testFunction3() {
    // Belongs to both g1 and g2.
    test:assertTrue(true);
}
```

## Running tests by group

In the **Test Explorer**, groups appear as tree nodes. Hover over a group name to reveal the play (▷) and debug icons. Click the play icon to run all tests in that group.

```bash
# Run tests in a single group
bal test --groups g1

# Run tests in multiple groups
bal test --groups g1,g2
```

## Excluding groups

Use `--disable-groups` to skip tests belonging to specific groups:

```bash
bal test --disable-groups g2
```

## What's next

- [Execute Tests](execute-tests.md) — all CLI options for running and filtering tests
- [Data-Driven Tests](data-driven-tests.md) — parameterize tests with data providers
- [Ballerina — Test Groups](https://ballerina.io/learn/test-ballerina-code/define-test-groups/) — Ballerina language reference for test groups
