---
title: Expressions
---

# Expressions

Expressions are the building blocks of integration logic. They compute values, transform data, evaluate conditions, and construct payloads. Ballerina provides a rich expression language that is type-safe, null-aware, and designed for data-centric programming.

## Where expressions are used

Expressions appear everywhere in your integration:

- **Conditions** — `if`, `while`, and `match` guards
- **Variable assignments** — computing values from inputs
- **Function arguments** — inline transformation before passing data
- **Template literals** — constructing strings, XML, and regular expressions
- **Resource paths** — dynamic URL segments and query parameters

## Using expressions in the visual designer

Expression fields appear throughout the node configuration panels — in conditions, variable values, function arguments, and path parameters.

![Flow canvas showing the Automation with expression-capable node configuration](/img/develop/design-logic/expressions/expression-editor.png)

When you click an expression field in a node's configuration panel:

- Type a literal value directly (for example, `"pending"`, `100`, `true`)
- Type a variable name to reference a value from an earlier step
- Use dot notation to access record fields (for example, `order.customerId`)
- Use the expression syntax for computed values (for example, `order.total * 0.08`)
- Use the `?:` elvis operator for nil-safe defaults (for example, `customer.email ?: "no-email"`)

Expressions appear inline in Ballerina code wherever a value is expected:

```ballerina
// Arithmetic
decimal subtotal = item.price * <decimal>item.quantity;
decimal tax = subtotal * 0.08d;
decimal total = subtotal + tax;

// String template
string greeting = string `Hello, ${customer.firstName} ${customer.lastName}!`;

// Nil-safe with default
string name = customer.middleName ?: "";

// Optional field access
string? city = customer?.address?.city;
string cityOrDefault = customer?.address?.city ?: "Unknown";
```

## Arithmetic expressions

```ballerina
decimal subtotal = item.price * <decimal>item.quantity;
decimal tax = subtotal * 0.08d;
decimal total = subtotal + tax;

int remainder = total % batchSize;
float percentage = <float>completed / <float>total * 100.0;
```

## String expressions

### Template literals

```ballerina
string greeting = string `Hello, ${customer.firstName} ${customer.lastName}!`;
string url = string `/api/v2/orders/${orderId}/items`;
string query = string `SELECT * FROM orders WHERE status = '${status}'`;
```

### String operations

```ballerina
int len = name.length();
string first3 = name.substring(0, 3);
string upper = name.toUpperAscii();
string lower = name.toLowerAscii();
string trimmed = input.trim();

boolean hasAt = email.includes("@");
boolean isOrder = ref.startsWith("ORD-");
boolean isCsv = filename.endsWith(".csv");

string csv = string:'join(",", ...tags);
string[] parts = re `,`.split(csvLine);
```

### Regular expressions

```ballerina
import ballerina/regexp;

boolean isValidEmail = re `^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$`.isFullMatch(email);
string sanitized = re `[^a-zA-Z0-9]`.replaceAll(input, "_");

regexp:Groups? groups = re `(\d{3})-(\d{3})-(\d{4})`.findGroups(phone);
if groups is regexp:Groups {
    string areaCode = (<regexp:Span>groups[1]).substring();
}
```

## Numeric type conversions

```ballerina
decimal d = <decimal>intValue;
int|error i = int:fromString("42");
decimal|error dec = decimal:fromString("19.99");
float f = <float>intValue;
string price = "$" + total.toString();
```

## Nil-aware expressions

### Elvis operator

```ballerina
string name = customer.middleName ?: "";
int port = configuredPort ?: 8080;
```

### Optional field access

```ballerina
string? city = customer?.address?.city;
string cityOrDefault = customer?.address?.city ?: "Unknown";
```

### Nil check

```ballerina
string? email = getEmail(userId);
if email is string {
    sendEmail(email);
}

string? value = map.get(key);
if value is () {
    log:printWarn("Key not found", key = key);
}
```

## JSON expressions

### Constructing JSON

```ballerina
json payload = {
    orderId: order.id,
    customer: {
        name: customer.firstName + " " + customer.lastName,
        email: customer.email
    },
    items: from LineItem item in order.items
        select {
            sku: item.productId,
            qty: item.quantity,
            price: item.unitPrice
        },
    metadata: {
        createdAt: time:utcToString(time:utcNow()),
        source: "integration"
    }
};
```

### Accessing JSON fields

```ballerina
json response = check httpClient->get("/api/data");

json|error name = response.name;
json|error nested = response.customer.address.city;

string customerName = check response.name;
int count = check response.totalCount;
```

## XML expressions

```ballerina
xml invoice = xml `

        ${invoiceId}
        ${customerName}
        ${total.toString()}

`;

xml items = invoice/;
xml allPrices = invoice/**/;
```

## Collection expressions

```ballerina
// Array operations
string[] tags = ["urgent", "billing", "support"];
int count = tags.length();
tags.push("new-tag");
string[] allTags = [...existingTags, ...newTags];
string[] firstTwo = tags.slice(0, 2);

// Map operations
map<string> headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
};
string? contentType = headers["Content-Type"];
boolean hasAuth = headers.hasKey("Authorization");
```

## Type expressions

```ballerina
// Type check
if response is http:Response {
    int statusCode = response.statusCode;
} else if response is error {
    log:printError("Request failed", 'error = response);
}

// Type cast
decimal amount = check response.ensureType(decimal);
string name = <string>jsonValue;
Customer customer = check jsonPayload.fromJsonWithType();
```

## Let expressions

```ballerina
string summary = let decimal subtotal = calculateSubtotal(items),
                     decimal tax = subtotal * 0.08d,
                     decimal total = subtotal + tax
                 in string `Subtotal: $${subtotal}, Tax: $${tax}, Total: $${total}`;
```

## What's next

- [Query Expressions](query-expressions.md) — SQL-like expressions for filtering and transforming collections
- [Functions](functions.md) — Encapsulate expressions in reusable functions
- [Ballerina Pro-Code](ballerina-pro-code.md) — Full language features for complex expressions
