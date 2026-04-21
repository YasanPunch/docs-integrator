---
title: Query Expressions
---

# Query Expressions

Query expressions bring SQL-like syntax to Ballerina, letting you filter, transform, sort, group, join, and aggregate data collections directly in your integration code. They work with arrays, streams, tables, and XML sequences, making them essential for data integration scenarios.

## Using query expressions in the visual designer

Query expressions appear in the visual designer primarily inside **Map Data** nodes (the data mapper). To use a query expression:

1. In the flow canvas, click **+** and select **Map Data** under **Statement**.
2. In the data mapper, select the source collection and the target type.
3. For complex transformations such as filtering, joining, or grouping, switch to the expression editor and enter the query expression directly.

Query expressions are also used inside **Declare Variable** and **Update Variable** node configuration panels when assigning a computed collection value.

A query expression follows a familiar SQL-like pattern:

```ballerina
var result = from <source>
             where <condition>
             let <bindings>
             order by <expression>
             limit <count>
             select <projection>;
```

## From clause

The `from` clause declares the iteration source and a variable to bind each element.

```ballerina
// From an array
Order[] activeOrders = from Order o in allOrders
    where o.status == "ACTIVE"
    select o;

// From a stream (database query results)
stream<Customer, sql:Error?> customerStream = dbClient->query(`SELECT * FROM customers`);
Customer[] customers = from Customer c in customerStream
    select c;

// From a map
string[] headerValues = from [string, string] [key, value] in headers.entries()
    select value;

// From a range
int[] evenNumbers = from int i in 0 ..< 100
    where i % 2 == 0
    select i;
```

## Where clause

Filter elements based on conditions. Multiple `where` clauses act as logical AND.

```ballerina
Order[] largeOrders = from Order o in orders
    where o.totalAmount > 1000d
    select o;

Order[] urgentLargeOrders = from Order o in orders
    where o.totalAmount > 1000d
    where o.priority == "URGENT"
    where o.status != "CANCELLED"
    select o;
```

## Let clause

Bind intermediate computed values for use in later clauses.

```ballerina
OrderSummary[] summaries = from Order o in orders
    let decimal subtotal = calculateSubtotal(o.items)
    let decimal tax = subtotal * 0.08d
    let decimal total = subtotal + tax
    select {
        orderId: o.id,
        customerName: o.customerName,
        subtotal: subtotal,
        tax: tax,
        total: total
    };
```

## Select clause

Project each element into a new shape.

```ballerina
string[] customerEmails = from Customer c in customers
    select c.email;

ContactInfo[] contacts = from Customer c in customers
    select {
        fullName: c.firstName + " " + c.lastName,
        email: c.email,
        phone: c.phone ?: "N/A"
    };
```

## Order by clause

```ballerina
Order[] byAmountDesc = from Order o in orders
    order by o.totalAmount descending
    select o;

Order[] sorted = from Order o in orders
    order by o.priority descending, o.createdAt ascending
    select o;
```

## Limit clause

```ballerina
Order[] top10 = from Order o in orders
    order by o.totalAmount descending
    limit 10
    select o;
```

## Join clause

```ballerina
OrderWithCustomer[] enrichedOrders = from Order o in orders
    join Customer c in customers on o.customerId equals c.id
    select {
        orderId: o.id,
        amount: o.totalAmount,
        customerName: c.firstName + " " + c.lastName,
        customerEmail: c.email
    };
```

### Outer join

```ballerina
OrderReport[] report = from Order o in orders
    outer join Customer c in customers on o.customerId equals c.id
    select {
        orderId: o.id,
        amount: o.totalAmount,
        customerName: c?.firstName
    };
```

## Group by clause

```ballerina
CategorySummary[] categorySummaries = from Product p in products
    group by string category = p.category
    select {
        category: category,
        productCount: p.length(),
        avgPrice: decimal:avg(...(from Product pr in p select pr.price)),
        maxPrice: decimal:max(...(from Product pr in p select pr.price))
    };
```

## Collect clause

```ballerina
SalesTotal totals = from Order o in orders
    where o.status == "COMPLETED"
    collect {
        orderCount: o.length(),
        totalRevenue: decimal:sum(...(from Order ord in o select ord.totalAmount)),
        avgOrderValue: decimal:avg(...(from Order ord in o select ord.totalAmount))
    };
```

## Do clause (side effects)

```ballerina
check from Order o in orders
    where o.status == "PENDING"
    where o.createdAt < cutoffDate
    do {
        check sendReminder(o.customerEmail, o.id);
        log:printInfo("Reminder sent", orderId = o.id);
    };
```

## Query expressions with streams

```ballerina
function getHighValueCustomers() returns CustomerSummary[]|error {
    stream<Order, sql:Error?> orderStream = dbClient->query(
        `SELECT * FROM orders WHERE created_at > '2024-01-01'`
    );

    CustomerSummary[] summaries = from Order o in orderStream
        let decimal total = o.totalAmount
        where total > 500d
        order by total descending
        select {
            customerId: o.customerId,
            orderCount: 1,
            totalSpent: total
        };

    return summaries;
}
```

## Real-world integration examples

### Transform API response

```ballerina
function transformCrmContacts(json[] crmContacts) returns Contact[]|error {
    return from json contact in crmContacts
        let string firstName = check contact.first_name
        let string lastName = check contact.last_name
        where check contact.active == true
        select {
            fullName: firstName + " " + lastName,
            email: check contact.email_address,
            phone: (check contact.phone_number).toString(),
            source: "CRM"
        };
}
```

### Reconcile two data sources

```ballerina
function reconcileInventory(
    Product[] catalogProducts,
    WarehouseItem[] warehouseItems
) returns DiscrepancyReport[] {
    return from Product p in catalogProducts
        join WarehouseItem w in warehouseItems on p.sku equals w.sku
        let int diff = p.stockCount - w.physicalCount
        where diff != 0
        order by int:abs(diff) descending
        select {
            sku: p.sku,
            productName: p.name,
            catalogCount: p.stockCount,
            warehouseCount: w.physicalCount,
            discrepancy: diff,
            severity: int:abs(diff) > 100 ? "HIGH" : "LOW"
        };
}
```

## Query expression quick reference

| Clause | Purpose | Example |
|---|---|---|
| `from` | Iterate source | `from Order o in orders` |
| `where` | Filter elements | `where o.amount > 100d` |
| `let` | Bind intermediate values | `let decimal tax = amount * 0.08d` |
| `join` | Combine two sources | `join Customer c in customers on ...` |
| `order by` | Sort results | `order by o.date descending` |
| `group by` | Group and aggregate | `group by string cat = p.category` |
| `limit` | Restrict result count | `limit 10` |
| `select` | Project output shape | `select {name: o.name, total: o.amount}` |
| `collect` | Aggregate all into one | `collect {count: items.length()}` |
| `do` | Side effects only | `do { check process(o); }` |

## What's next

- [Expressions](expressions.md) — Inline expressions used within query clauses
- [Functions](functions.md) — Wrap query expressions in reusable functions
- [Data Persistence](/docs/develop/integration-artifacts/supporting/data-persistence) — Query over persisted data
