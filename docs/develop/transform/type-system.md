---
title: Type System & Records
---

# Type System & Records

Ballerina's type system catches data mapping errors at compile time, not in production. Records, union types, optional fields, and type narrowing give you precise control over the shape of data flowing through your integrations.

## Defining Record Types

Records are the primary way to model structured data in Ballerina. Use closed records (`record {|...|}`) for strict schemas and open records (`record {...}`) when extra fields are acceptable.

```ballerina
// Closed record -- only these fields are allowed
type Customer record {|
    string id;
    string name;
    string email;
    string phone;
|};

// Open record -- additional fields are preserved as anydata
type ApiResponse record {
    int statusCode;
    string message;
};

// Records with default values
type ConnectionConfig record {|
    string host;
    int port = 8080;
    int timeoutSeconds = 30;
    boolean useTls = true;
|};
```

### Closed vs. open records

| Aspect | Closed (`record {\|...\|}`) | Open (`record {...}`) |
| --- | --- | --- |
| Extra fields | Rejected at compile time | Stored as `anydata` |
| JSON projection | Filters unknown fields | Preserves all fields |
| Use case | Strict internal schemas | External API responses |

## Optional Fields and Nil

Mark fields as optional with `?` or make their type nilable with `?` suffix on the type. These are distinct concepts.

```ballerina
type Order record {|
    string orderId;
    string customer;
    decimal total;
    string? notes;          // Field is always present, value may be nil
    string shippingRef?;    // Field may be absent entirely
|};

public function main() {
    // notes is nil, shippingRef is absent
    Order order = {
        orderId: "ORD-100",
        customer: "Acme Corp",
        total: 1500.00,
        notes: ()
    };

    // Access optional field safely
    string ref = order.shippingRef ?: "N/A";
}
```

## Union Types

Union types let a value be one of several types. They are essential for modeling data that varies by context.

```ballerina
// A payment can be one of several types
type CreditCard record {|
    string cardNumber;
    string expiry;
    string cvv;
|};

type BankTransfer record {|
    string accountNumber;
    string routingNumber;
|};

type PayPal record {|
    string email;
|};

type PaymentMethod CreditCard|BankTransfer|PayPal;

function processPayment(PaymentMethod payment) returns string {
    if payment is CreditCard {
        return string `Charging card ending in ${payment.cardNumber.substring(12)}`;
    } else if payment is BankTransfer {
        return string `Transferring from account ${payment.accountNumber}`;
    } else {
        return string `PayPal payment to ${payment.email}`;
    }
}
```

## Type Guards and Narrowing

Ballerina's `is` expression narrows a union type within a conditional block, giving you type-safe access to fields.

```ballerina
type SuccessResponse record {|
    int statusCode;
    json data;
|};

type ErrorResponse record {|
    int statusCode;
    string errorMessage;
    string errorCode;
|};

type ApiResult SuccessResponse|ErrorResponse;

function handleResult(ApiResult result) {
    if result is SuccessResponse {
        // Compiler knows result is SuccessResponse here
        json data = result.data;
    } else {
        // Compiler knows result is ErrorResponse here
        string msg = result.errorMessage;
    }
}
```

### Narrowing with `match`

```ballerina
type Shape "circle"|"square"|"triangle";

function sides(Shape shape) returns int {
    match shape {
        "circle" => { return 0; }
        "square" => { return 4; }
        "triangle" => { return 3; }
    }
}
```

## Type Conversion

Convert between types using `cloneWithType()`, `ensureType()`, and explicit casts.

### `cloneWithType` -- safe conversion between structures

```ballerina
type ExternalOrder record {
    string order_id;
    string customer_name;
    decimal amount;
};

type InternalOrder record {|
    string order_id;
    string customer_name;
    decimal amount;
|};

public function main() returns error? {
    json payload = {
        "order_id": "ORD-100",
        "customer_name": "Acme Corp",
        "amount": 1500.00
    };

    // Convert json to a typed record
    ExternalOrder ext = check payload.cloneWithType();

    // Convert between record types (open to closed)
    InternalOrder internal = check ext.cloneWithType();
}
```

### `ensureType` -- runtime type assertion

```ballerina
public function main() returns error? {
    any value = "hello";

    // Assert that the value is a string
    string s = check value.ensureType(string);
}
```

### Explicit casting

```ballerina
public function main() {
    int count = 42;
    float ratio = <float>count / 100.0;

    decimal price = 29.99d;
    float priceFloat = <float>price;
}
```

## Using Types with the Data Mapper

The visual data mapper in the WSO2 Integrator VS Code extension reads your record type definitions to build its source and target panels. Well-defined types produce better mapping experiences:

- **Closed records** show exactly the fields available for mapping.
- **Union types** let the mapper display conditional branches.
- **Optional fields** appear with indicators showing they may be absent.

```ballerina
// These types drive the data mapper's UI
type SourcePayload record {|
    string firstName;
    string lastName;
    string email;
    Address[] addresses;
|};

type TargetPayload record {|
    string fullName;
    string primaryEmail;
    string mailingAddress;
|};

// The mapper generates this function from your visual connections
function transform(SourcePayload src) returns TargetPayload => {
    fullName: src.firstName + " " + src.lastName,
    primaryEmail: src.email,
    mailingAddress: src.addresses.length() > 0
        ? src.addresses[0].street + ", " + src.addresses[0].city
        : ""
};
```

## Best Practices

- **Prefer closed records** for internal data models to catch unexpected fields at compile time
- **Use open records** for external API responses where the schema may evolve
- **Model variants with union types** instead of optional fields when the shapes are fundamentally different
- **Convert to typed records early** in your integration flow to benefit from compile-time checks throughout

## What's Next

- [Expressions & Functions](expressions-functions.md) -- Transform data with expressions
