---
title: Query Expressions
---

# Query Expressions

Transform collections and streams declaratively using Ballerina's built-in query expression syntax. Query expressions bring SQL-like operations directly into the language, making complex data transformations readable and concise without external libraries.

## Query Expression Basics

A query expression iterates over a collection and produces a new collection using clauses like `from`, `where`, `select`, `let`, `order by`, `limit`, and `join`.

1. **Define the record type** — Navigate to **Types** in the sidebar and click **+** to add a new type. Select **Create from scratch**, set **Kind** to **Record**, and name it `Order`. Add fields using the **+** button:

   | Field | Type |
   |---|---|
   | `orderId` | `string` |
   | `customer` | `string` |
   | `total` | `decimal` |
   | `status` | `string` |

   For details on creating types, see [Types](../integration-artifacts/supporting/types.md).

2. **Add a Variable step for the orders array** — In the flow designer, click **+** and select **Variable**. Set the type to `Order[]` and initialize it with the array literal containing the order data.

3. **Add a Variable step for the query** — Click **+** and select **Variable**. Set the type to `string[]` and the expression to `from Order o in orders where o.status == "completed" select o.orderId`.

   ![Flow designer showing Order type definition and query expression variable steps](/img/develop/transform/query-expressions/query-basics-flow.png)

```ballerina
import ballerina/io;

type Order record {|
    string orderId;
    string customer;
    decimal total;
    string status;
|};

public function main() {
    Order[] orders = [
        {orderId: "ORD-001", customer: "Acme Corp", total: 1500.00, status: "completed"},
        {orderId: "ORD-002", customer: "Globex Inc", total: 750.50, status: "pending"},
        {orderId: "ORD-003", customer: "Acme Corp", total: 3200.00, status: "completed"},
        {orderId: "ORD-004", customer: "Initech", total: 420.00, status: "cancelled"}
    ];

    // Basic query: filter and project
    string[] completedOrderIds = from Order o in orders
        where o.status == "completed"
        select o.orderId;

    io:println(completedOrderIds); // ["ORD-001", "ORD-003"]
}
```

## The `from` Clause

The `from` clause defines the input source and iteration variable. It works with arrays, maps, streams, and tables.

Each `from` variation is entered as the expression in a **Variable** step:

1. **Array iteration** — Add a **Variable** step. Set the type to `string[]` and the expression to `from Order o in orders select o.customer`.

2. **Map iteration** — Add a **Variable** step. Set the type to `map<int>` and initialize it with the inventory map. Then add another **Variable** step with type `string[]` and expression `from [string item, int qty] in inventory.entries() where qty == 0 select item`.

3. **Nested iteration** — Add a **Variable** step. Set the type to `string[][]` and initialize it with the tags array. Then add another **Variable** step with type `string[]` and expression `from string[] group in tags from string tag in group select tag`.

   ![Flow designer showing from clause variations with array, map, and nested iteration](/img/develop/transform/query-expressions/query-from-flow.png)

```ballerina
// Iterate over an array
string[] names = from Order o in orders
    select o.customer;

// Iterate over a map
map<int> inventory = {"widget": 50, "gadget": 12, "gizmo": 0};

string[] outOfStock = from [string item, int qty] in inventory.entries()
    where qty == 0
    select item;

// Multiple from clauses (nested iteration)
string[][] tags = [["urgent", "billing"], ["support", "urgent"]];

string[] allTags = from string[] group in tags
    from string tag in group
    select tag;
```

## The `where` Clause

Filter elements with boolean expressions.

1. **Define the record type** — Navigate to **Types** in the sidebar and click **+** to add a new type. Select **Create from scratch**, set **Kind** to **Record**, and name it `Employee`. Add fields:

   | Field | Type |
   |---|---|
   | `name` | `string` |
   | `department` | `string` |
   | `salary` | `decimal` |
   | `yearsOfService` | `int` |

2. **Add a Variable step for the staff array** — Click **+** and select **Variable**. Set the type to `Employee[]` and initialize it with the employee data.

3. **Add a Variable step for the simple filter** — Click **+** and select **Variable**. Set the type to `Employee[]` and the expression to `from Employee e in staff where e.department == "Engineering" select e`.

4. **Add a Variable step for compound conditions** — Click **+** and select **Variable**. Set the type to `Employee[]` and the expression to `from Employee e in staff where e.salary > 80000 && e.yearsOfService > 4 select e`.

   ![Flow designer showing where clause with simple and compound filter conditions](/img/develop/transform/query-expressions/query-where-flow.png)

```ballerina
type Employee record {|
    string name;
    string department;
    decimal salary;
    int yearsOfService;
|};

Employee[] staff = [
    {name: "Alice", department: "Engineering", salary: 95000, yearsOfService: 5},
    {name: "Bob", department: "Sales", salary: 72000, yearsOfService: 3},
    {name: "Carol", department: "Engineering", salary: 110000, yearsOfService: 8},
    {name: "Dave", department: "Sales", salary: 68000, yearsOfService: 1}
];

// Simple filter
Employee[] engineers = from Employee e in staff
    where e.department == "Engineering"
    select e;

// Compound conditions
Employee[] seniorHighEarners = from Employee e in staff
    where e.salary > 80000 && e.yearsOfService > 4
    select e;
```

## The `let` Clause

Introduce intermediate computed values within a query.

1. **Define the record type** — Navigate to **Types** in the sidebar and click **+** to add a new type. Select **Create from scratch**, set **Kind** to **Record**, and name it `OrderSummary`. Add fields:

   | Field | Type |
   |---|---|
   | `orderId` | `string` |
   | `customer` | `string` |
   | `total` | `decimal` |
   | `tax` | `decimal` |
   | `grandTotal` | `decimal` |

2. **Add a Variable step for the tax rate** — Click **+** and select **Variable**. Set the type to `decimal` and the expression to `0.08`.

3. **Add a Variable step for the query** — Click **+** and select **Variable**. Set the type to `OrderSummary[]` and the expression to `from Order o in orders where o.status == "completed" let decimal tax = o.total * taxRate let decimal grandTotal = o.total + tax select { orderId: o.orderId, customer: o.customer, ... }`.

   ![Flow designer showing let clause with computed tax and grandTotal values](/img/develop/transform/query-expressions/query-let-flow.png)

```ballerina
type OrderSummary record {|
    string orderId;
    string customer;
    decimal total;
    decimal tax;
    decimal grandTotal;
|};

decimal taxRate = 0.08;

OrderSummary[] summaries = from Order o in orders
    where o.status == "completed"
    let decimal tax = o.total * taxRate
    let decimal grandTotal = o.total + tax
    select {
        orderId: o.orderId,
        customer: o.customer,
        total: o.total,
        tax: tax,
        grandTotal: grandTotal
    };
```

## The `select` Clause

Project and reshape data into new forms.

1. **Define the record type** — Navigate to **Types** in the sidebar and click **+** to add a new type. Select **Create from scratch**, set **Kind** to **Record**, and name it `CustomerOrder`. Add fields: `customer` (string), `amount` (decimal).

2. **Add a Variable step for record projection** — Click **+** and select **Variable**. Set the type to `CustomerOrder[]` and the expression to `from Order o in orders select { customer: o.customer, amount: o.total }`.

3. **Add a Variable step for string formatting** — Click **+** and select **Variable**. Set the type to `string[]` and the expression to `` from Order o in orders select string `${o.orderId}: ${o.customer} ($${o.total})` ``.

   ![Flow designer showing select clause with record projection and string formatting](/img/develop/transform/query-expressions/query-select-flow.png)

```ballerina
// Select specific fields into a new record type
type CustomerOrder record {|
    string customer;
    decimal amount;
|};

CustomerOrder[] customerOrders = from Order o in orders
    select {
        customer: o.customer,
        amount: o.total
    };

// Select into a different type (string formatting)
string[] orderLabels = from Order o in orders
    select string `${o.orderId}: ${o.customer} ($${o.total})`;
```

## The `order by` Clause

Sort query results by one or more fields in ascending or descending order.

1. **Add a Variable step for single-field ordering** — Click **+** and select **Variable**. Set the type to `Order[]` and the expression to `from Order o in orders order by o.total descending select o`.

2. **Add a Variable step for multi-field ordering** — Click **+** and select **Variable**. Set the type to `Employee[]` and the expression to `from Employee e in staff order by e.department ascending, e.salary descending select e`.

   ![Flow designer showing order by clause with single and multi-field sorting](/img/develop/transform/query-expressions/query-orderby-flow.png)

```ballerina
// Sort by total descending
Order[] byTotal = from Order o in orders
    order by o.total descending
    select o;

// Sort by multiple fields
Employee[] sorted = from Employee e in staff
    order by e.department ascending, e.salary descending
    select e;
```

## The `limit` Clause

Restrict the number of results returned.

1. **Add a Variable step** — In the flow designer, click **+** and select **Variable**. Set the type to `Order[]` and the expression to `from Order o in orders order by o.total descending limit 3 select o`.

   ![Flow designer showing limit clause combined with order by for top-N query](/img/develop/transform/query-expressions/query-limit-flow.png)

```ballerina
// Top 3 highest-value orders
Order[] top3 = from Order o in orders
    order by o.total descending
    limit 3
    select o;
```

## The `join` Clause

Combine data from two collections based on a matching condition.

1. **Define the record types** — Navigate to **Types** in the sidebar and click **+** to add new types. Select **Create from scratch** for each:

   - `Customer` — fields: `id` (string), `name` (string), `tier` (string)
   - `OrderRecord` — fields: `orderId` (string), `customerId` (string), `total` (decimal)
   - `EnrichedOrder` — fields: `orderId` (string), `customerName` (string), `tier` (string), `total` (decimal)

   For details on creating types, see [Types](../integration-artifacts/supporting/types.md).

2. **Add a Variable step for customers** — Click **+** and select **Variable**. Set the type to `Customer[]` and initialize it with the customer data.

3. **Add a Variable step for order records** — Click **+** and select **Variable**. Set the type to `OrderRecord[]` and initialize it with the order data.

4. **Add a Variable step for the join query** — Click **+** and select **Variable**. Set the type to `EnrichedOrder[]` and the expression to `from OrderRecord o in orderRecords join Customer c in customers on o.customerId equals c.id select { orderId: o.orderId, customerName: c.name, ... }`.

   ![Flow designer showing join clause combining customer and order data](/img/develop/transform/query-expressions/query-join-flow.png)

```ballerina
type Customer record {|
    string id;
    string name;
    string tier;
|};

type OrderRecord record {|
    string orderId;
    string customerId;
    decimal total;
|};

type EnrichedOrder record {|
    string orderId;
    string customerName;
    string tier;
    decimal total;
|};

public function main() {
    Customer[] customers = [
        {id: "C1", name: "Acme Corp", tier: "gold"},
        {id: "C2", name: "Globex Inc", tier: "silver"},
        {id: "C3", name: "Initech", tier: "bronze"}
    ];

    OrderRecord[] orderRecords = [
        {orderId: "ORD-001", customerId: "C1", total: 1500.00},
        {orderId: "ORD-002", customerId: "C2", total: 750.50},
        {orderId: "ORD-003", customerId: "C1", total: 3200.00}
    ];

    // Join orders with customer data
    EnrichedOrder[] enriched = from OrderRecord o in orderRecords
        join Customer c in customers on o.customerId equals c.id
        select {
            orderId: o.orderId,
            customerName: c.name,
            tier: c.tier,
            total: o.total
        };
}
```

## Working with Tables

Query expressions work naturally with Ballerina tables, which provide key-based access.

1. **Define the table type** — Navigate to **Types** in the sidebar and click **+** to add a new type. Select **Create from scratch** and define a record with fields: `sku` (readonly string), `name` (string), `price` (decimal), `stock` (int). The table type uses `key(sku)`.

2. **Add a Variable step for the table** — In the flow designer, click **+** and select **Variable**. Set the type to `Product` and initialize it with the table literal containing the product data.

3. **Add a Variable step for the query** — Click **+** and select **Variable**. Set the expression to `from var item in catalog where item.stock < 50 && item.stock > 0 select { name: item.name, stock: item.stock }`.

   ![Flow designer showing table query with where clause filtering low stock items](/img/develop/transform/query-expressions/query-tables-flow.png)

```ballerina
type Product table<record {|
    readonly string sku;
    string name;
    decimal price;
    int stock;
|}> key(sku);

public function main() {
    Product catalog = table [
        {sku: "WDG-001", name: "Widget", price: 29.99, stock: 150},
        {sku: "GDG-002", name: "Gadget", price: 49.99, stock: 0},
        {sku: "GZM-003", name: "Gizmo", price: 19.99, stock: 42}
    ];

    // Query a table like any collection
    var lowStock = from var item in catalog
        where item.stock < 50 && item.stock > 0
        select {name: item.name, stock: item.stock};
}
```

## Stream Processing with Queries

Use query expressions with streams for lazy, memory-efficient processing of large datasets.

1. **Define the record type** — Navigate to **Types** in the sidebar and click **+** to add a new type. Select **Create from scratch**, set **Kind** to **Record**, and name it `LogEntry`. Add fields: `timestamp` (string), `level` (string), `message` (string).

2. **Create the function** — The `processLogs` function appears under **Functions** in the WSO2 Integrator sidebar — navigate there to view and edit it.

3. **Add a Variable step for the query** — Inside the function flow, click **+** and select **Variable**. Set the type to `LogEntry[]` and the expression to `from LogEntry entry in logStream where entry.level == "ERROR" select entry`.

4. **Add a Foreach step** — Click **+** and select **Foreach** under **Control**. Set the **Collection** to `errors` and the **Variable** to `entry`. Inside the loop body, add a **Function Call** step for `io:println(...)`.

   ![Flow designer showing stream processing function with query and foreach steps](/img/develop/transform/query-expressions/query-streams-flow.png)

```ballerina
import ballerina/io;

type LogEntry record {|
    string timestamp;
    string level;
    string message;
|};

public function processLogs(stream<LogEntry, error?> logStream) returns error? {
    // Process a stream lazily — only matching entries are materialized
    LogEntry[] errors = from LogEntry entry in logStream
        where entry.level == "ERROR"
        select entry;

    foreach LogEntry entry in errors {
        io:println("[", entry.timestamp, "] ", entry.message);
    }
}
```

## Collecting Results

Query expressions can produce different collection types based on the context.

1. **Define the record type** — Navigate to **Types** in the sidebar and click **+** to add a new type. Select **Create from scratch**, set **Kind** to **Record**, and name it `Sale`. Add fields: `region` (string), `amount` (decimal).

2. **Add a Variable step for the sales array** — Click **+** and select **Variable**. Set the type to `Sale[]` and initialize it with the sales data.

3. **Add a Variable step for array collection** — Click **+** and select **Variable**. Set the type to `decimal[]` and the expression to `from Sale s in sales select s.amount`.

4. **Add a Variable step for string collection** — Click **+** and select **Variable**. Set the type to `string` and the expression to `` from Sale s in sales select string `${s.region}: $${s.amount}` collect string:'join("\n") ``.

   ![Flow designer showing collecting results into array and string types](/img/develop/transform/query-expressions/query-collecting-flow.png)

```ballerina
type Sale record {|
    string region;
    decimal amount;
|};

Sale[] sales = [
    {region: "North", amount: 5000},
    {region: "South", amount: 3000},
    {region: "North", amount: 7000},
    {region: "South", amount: 4500}
];

// Collect into an array (default)
decimal[] amounts = from Sale s in sales
    select s.amount;

// Collect into a string with collect clause
string report = from Sale s in sales
    select string `${s.region}: $${s.amount}`
    collect string:'join("\n");
```

## Integration Example: API Response Transformation

Combine query expressions to reshape API data for a different consumer.

1. **Define the record types** — Navigate to **Types** in the sidebar and click **+** to add new types. Select **Create from scratch** for each:

   - `SourceProduct` — fields: `id` (int), `name` (string), `price` (decimal), `category` (string), `active` (boolean), `stockCount` (int)
   - `CatalogItem` — fields: `productId` (string), `displayName` (string), `priceLabel` (string), `availability` (string)

2. **Create the service** — This example uses a **Service** artifact — click the service `/api` entry in the WSO2 Integrator sidebar to view the service and its resource functions.

3. **Add the resource function** — The `get catalog` resource function contains the query expression. Inside the resource flow, add a **Variable** step with type `CatalogItem[]` and the expression:

   ```
   from SourceProduct p in products
       where p.active == true
       where category == () || p.category == category
       let string availability = p.stockCount > 0 ? "In Stock" : "Out of Stock"
       order by p.name ascending
       limit maxResults
       select { productId: string `PRD-${p.id}`, displayName: p.name, ... }
   ```

4. **Helper function** — The `getProductsFromUpstream()` function appears under **Functions** in the sidebar.

   ![Flow designer showing service with resource function and query expression for API transformation](/img/develop/transform/query-expressions/query-integration-flow.png)

```ballerina
import ballerina/http;

type SourceProduct record {
    int id;
    string name;
    decimal price;
    string category;
    boolean active;
    int stockCount;
};

type CatalogItem record {|
    string productId;
    string displayName;
    string priceLabel;
    string availability;
|};

service /api on new http:Listener(8080) {

    resource function get catalog(string? category, int maxResults = 50)
            returns CatalogItem[]|error {
        // Fetch raw product data from upstream
        SourceProduct[] products = check getProductsFromUpstream();

        // Transform using query expressions
        CatalogItem[] catalog = from SourceProduct p in products
            where p.active == true
            where category == () || p.category == category
            let string availability = p.stockCount > 0 ? "In Stock" : "Out of Stock"
            order by p.name ascending
            limit maxResults
            select {
                productId: string `PRD-${p.id}`,
                displayName: p.name,
                priceLabel: string `$${p.price}`,
                availability: availability
            };

        return catalog;
    }
}

function getProductsFromUpstream() returns SourceProduct[]|error {
    // Simulated upstream call
    return [];
}
```

## Best Practices

- **Prefer query expressions over manual loops** for filter/map/sort operations -- they are more readable and less error-prone
- **Use `let` for computed values** rather than duplicating expressions in `where` and `select`
- **Combine `order by` and `limit`** for top-N queries instead of sorting an entire collection and slicing
- **Use streams for large datasets** -- stream-based queries process elements lazily without loading everything into memory
- **Type your results explicitly** when the projected shape differs from the source to catch mapping errors at compile time

## What's Next

- [Expressions & Functions](expressions-functions.md) -- Built-in functions for string, date, math operations
- [Type System & Records](type-system.md) -- Define structured types for query results
- [Visual Data Mapper](data-mapper.md) -- Drag-and-drop data transformation
