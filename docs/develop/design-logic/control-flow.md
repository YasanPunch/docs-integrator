---
title: Control Flow
---

# Control Flow

Control flow constructs determine the execution path of your integration logic. Use conditionals to branch, loops to iterate, pattern matching to route, and workers to execute in parallel. Each construct is available in both the visual flow designer and code.

## If/Else statements

Branch your logic based on conditions.

1. In the flow canvas, click **+** to open the step picker.
2. Under **Control**, select **If**.

   ![Flow canvas showing an If node with condition and True/False branches](/img/develop/design-logic/control-flow/if-else.png)

3. In the configuration panel, enter the condition expression (for example, `req.items.length() == 0`).
4. Add nodes to the **True** and **False** branches.
5. Click **Save**.

```ballerina
resource function post orders(OrderRequest req) returns OrderResponse|http:BadRequest|error {
    // Simple if/else
    if req.items.length() == 0 {
        return <http:BadRequest>{body: {message: "Order must have items"}};
    }

    // If/else if/else chain
    decimal total = calculateTotal(req.items);
    string tier;
    if total > 1000d {
        tier = "PREMIUM";
    } else if total > 500d {
        tier = "STANDARD";
    } else {
        tier = "BASIC";
    }

    return processOrderWithTier(req, tier);
}
```

## Match expressions

Match expressions provide structured pattern matching, similar to switch/case but more powerful with Ballerina's type system.

1. In the flow canvas, click **+** to open the step picker.
2. Under **Control**, select **Match**.

   ![Flow canvas showing a Match node with multiple pattern branches](/img/develop/design-logic/control-flow/match.png)

3. In the configuration panel, enter the expression to match against.
4. Add a branch for each pattern. Use `_` for the default branch.
5. Click **Save**.

```ballerina
function routePayment(Payment payment) returns PaymentResult|error {
    // Match on value
    match payment.method {
        "credit_card" => {
            return processCreditCard(payment);
        }
        "bank_transfer" => {
            return processBankTransfer(payment);
        }
        "digital_wallet" => {
            return processDigitalWallet(payment);
        }
        _ => {
            return error("Unsupported payment method: " + payment.method);
        }
    }
}
```

### Type-based matching

```ballerina
type PaymentMethod CreditCard|BankTransfer|DigitalWallet;

function processPayment(PaymentMethod method) returns string|error {
    if method is CreditCard {
        return "Charged card ending in " + method.lastFour;
    } else if method is BankTransfer {
        return "Transfer initiated to " + method.bankName;
    } else {
        return "Wallet payment via " + method.provider;
    }
}
```

### Binding patterns

```ballerina
function handleResponse(json response) returns string {
    if response is map<json> {
        json|error status = response.status;
        if status is string && status == "success" {
            return "Operation succeeded";
        }
        return "Operation completed with status: " + response.toString();
    }
    return "Unexpected response format";
}
```

## Foreach loops

Iterate over arrays, maps, and other iterable types.

1. In the flow canvas, click **+** to open the step picker.
2. Under **Control**, select **Foreach**.

   ![Flow canvas showing a Foreach node iterating over a collection](/img/develop/design-logic/control-flow/foreach.png)

3. In the configuration panel, specify:

   | Field | Description |
   |---|---|
   | **Collection** | The array, map, or stream to iterate over |
   | **Variable** | The loop variable name bound to each element |

4. Add nodes inside the loop body.
5. Click **Save**.

```ballerina
function processOrderItems(LineItem[] items) returns decimal {
    decimal total = 0;

    // Basic foreach
    foreach LineItem item in items {
        total += item.unitPrice * <decimal>item.quantity;
    }

    return total;
}

// Foreach with index
function logItems(LineItem[] items) {
    foreach int i in 0 ..< items.length() {
        log:printInfo("Item " + i.toString(), name = items[i].productName);
    }
}

// Foreach over a map
function processHeaders(map<string> headers) {
    foreach [string, string] [key, value] in headers.entries() {
        log:printInfo("Header", key = key, value = value);
    }
}
```

### Foreach with early termination

```ballerina
function findFirstMatch(Order[] orders, string customerId) returns Order? {
    Order? found = ();
    foreach Order 'order in orders {
        if 'order.customerId == customerId {
            found = 'order;
            break;
        }
    }
    return found;
}
```

## While loops

Execute a block repeatedly while a condition is true.

1. In the flow canvas, click **+** to open the step picker.
2. Under **Control**, select **While**.

   ![Flow canvas showing a While node with loop condition](/img/develop/design-logic/control-flow/while.png)

3. In the configuration panel, enter the loop condition expression.
4. Add nodes inside the loop body.
5. Click **Save**.

```ballerina
function pollUntilComplete(string jobId) returns JobResult|error {
    int maxAttempts = 30;
    int attempt = 0;

    while attempt < maxAttempts {
        JobStatus status = check checkJobStatus(jobId);

        if status.state == "COMPLETED" {
            return status.result;
        }
        if status.state == "FAILED" {
            return error("Job failed: " + status.errorMessage);
        }

        runtime:sleep(2);
        attempt += 1;
    }

    return error("Job timed out after " + maxAttempts.toString() + " attempts");
}
```

## Do blocks

Use `do` blocks to create scoped execution with error handling:

```ballerina
function processWithScope() returns error? {
    do {
        json data = check fetchData();
        check validateData(data);
        check saveData(data);
        log:printInfo("Data processed successfully");
    } on fail error e {
        log:printError("Processing failed", 'error = e);
        check sendAlert("Data processing failed: " + e.message());
    }
}
```

## Parallel execution with workers

Execute multiple branches concurrently using Ballerina workers.

```ballerina
function enrichOrderData(Order 'order) returns EnrichedOrder|error {
    worker customerWorker returns Customer|error {
        return fetchCustomer('order.customerId);
    }

    worker inventoryWorker returns InventoryStatus[]|error {
        return checkInventory('order.items);
    }

    worker pricingWorker returns PricingResult|error {
        return calculatePricing('order.items);
    }

    Customer|error customer = wait customerWorker;
    InventoryStatus[]|error inventory = wait inventoryWorker;
    PricingResult|error pricing = wait pricingWorker;

    return {
        'order: 'order,
        customer: check customer,
        inventory: check inventory,
        pricing: check pricing
    };
}
```

## Range expressions

Iterate over numeric ranges:

```ballerina
// Exclusive upper bound: 0, 1, 2, ..., 9
foreach int i in 0 ..< 10 {
    log:printInfo("Index: " + i.toString());
}

// Inclusive upper bound: 1, 2, 3, ..., 10
foreach int i in 1 ... 10 {
    log:printInfo("Page: " + i.toString());
}
```

## Visual designer representation

Each control flow construct has a visual representation in the flow designer:

| Construct | Visual node |
|---|---|
| If/Else | Diamond shape with True/False branches |
| Match | Diamond with multiple labeled branches |
| Foreach | Loop block with iteration variable |
| While | Loop block with condition |
| Parallel | Fork node that splits into concurrent branches |

## What's next

- [Error Handling](error-handling.md) — Handle failures within your control flow
- [Expressions](expressions.md) — Write conditions and transformations
- [Query Expressions](query-expressions.md) — Functional-style iteration with query syntax
