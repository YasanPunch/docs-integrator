---
title: Visual Data Mapper
---

# Visual Data Mapper

The visual data mapper lets you transform data between source and target schemas using a drag-and-drop interface in VS Code. It generates type-safe Ballerina code from your visual mappings, keeping the source code as the single source of truth.

## Opening the Data Mapper

There are two ways to launch the data mapper from the WSO2 Integrator VS Code extension.

1. Open the **Ballerina Visualizer** panel in VS Code.
2. Click **+ Add Artifact** and select **Data Mapper** under **Other Artifacts**.
3. Choose the source and target types from your project.

Define an expression-bodied function with a placeholder return value, and click the **Visualize** CodeLens that appears above it:

```ballerina
type Input record {|
    string firstName;
    string lastName;
    string email;
|};

type Output record {|
    string fullName;
    string contactEmail;
|};

// Click the "Visualize" CodeLens above this function
function transform(Input input) returns Output => {
    fullName: "",
    contactEmail: ""
};
```

## Source and Target Schema Definition

The data mapper derives its source and target panels from Ballerina record types. Define closed records with explicit field types so the mapper can display all available fields.

1. Navigate to **Types** in the sidebar and click **+** to add a new type.
2. Define your source and target records to use in the data mapper.
3. Once both types are defined, the mapper shows input fields on the left and output fields on the right.

```ballerina
// Source schema — incoming order from an external API
type OrderRequest record {|
    int orderId;
    string customerName;
    string customerEmail;
    OrderLine[] items;
|};

type OrderLine record {|
    string sku;
    int quantity;
    decimal unitPrice;
|};

// Target schema — internal order representation
type InternalOrder record {|
    string orderRef;
    string contact;
    LineItem[] lineItems;
    decimal totalAmount;
|};

type LineItem record {|
    string productCode;
    int qty;
    decimal lineTotal;
|};
```

## Field-Level Mapping

Click an input field and then click the corresponding output field to create a mapping connection. A solid line appears between compatible fields. If the field types match directly, no additional transformation is needed.

- **Direct mapping** -- click `customerEmail` on the left, then `contact` on the right to connect them.
- **Type mismatch** -- a red line indicates incompatible types. Hover over the error indicator and select **Fix by editing expression** to open the inline expression editor.

```ballerina
// Generated code from a direct field mapping
function transform(OrderRequest input) returns InternalOrder => {
    orderRef: string `ORD-${input.orderId}`,
    contact: input.customerEmail,
    lineItems: [],
    totalAmount: 0
};
```

## Conditional Mappings

Use the expression editor to add conditional logic within a mapping. The mapper supports Ballerina's ternary operator and `match` expressions.

```ballerina
// Conditional mapping: apply discount based on item quantity
function mapLineItem(OrderLine line) returns LineItem => {
    productCode: line.sku,
    qty: line.quantity,
    lineTotal: line.quantity >= 10
        ? line.unitPrice * <decimal>line.quantity * 0.9d
        : line.unitPrice * <decimal>line.quantity
};
```

## Array and Collection Handling

When mapping arrays, the data mapper uses Ballerina query expressions under the hood. You can flatten, filter, or reshape array elements.

The mapper supports `where`, `let`, `limit`, `order by`, `join`, and `outer join` clauses for array transformations.

```ballerina
function transform(OrderRequest input) returns InternalOrder => {
    orderRef: string `ORD-${input.orderId}`,
    contact: input.customerEmail,
    // Array mapping with query expression
    lineItems: from OrderLine line in input.items
        select {
            productCode: line.sku,
            qty: line.quantity,
            lineTotal: line.unitPrice * <decimal>line.quantity
        },
    totalAmount: decimal:sum(...(from OrderLine line in input.items
        select line.unitPrice * <decimal>line.quantity))
};
```

## Nested Object Mapping

For deeply nested structures, the mapper lets you expand parent fields to reveal child fields. Connect child fields individually, or map an entire nested record at once when the structures align.

```ballerina
type Address record {|
    string street;
    string city;
    string state;
    string zip;
|};

type SourceCustomer record {|
    string name;
    Address billingAddress;
    Address shippingAddress;
|};

type FlatCustomer record {|
    string name;
    string shipStreet;
    string shipCity;
    string shipState;
    string shipZip;
|};

// Flatten nested address into top-level fields
function flatten(SourceCustomer input) returns FlatCustomer => {
    name: input.name,
    shipStreet: input.shippingAddress.street,
    shipCity: input.shippingAddress.city,
    shipState: input.shippingAddress.state,
    shipZip: input.shippingAddress.zip
};
```

## Custom Transformation Functions

You can reference helper functions from within the data mapper. Define reusable transformation logic as separate Ballerina functions and invoke them in mapping expressions.

Reference your custom functions (e.g., `formatPhone()`) in the expression editor when mapping a field.

```ballerina
// Helper function for formatting phone numbers
function formatPhone(string raw) returns string {
    string digits = re `\D`.replaceAll(raw, "");
    if digits.length() == 10 {
        return string `(${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6)}`;
    }
    return raw;
}
```

## Generated Code

Every visual mapping produces a Ballerina expression-bodied function. You can switch freely between the visual mapper and the code editor -- changes in one are reflected in the other. The generated code is the single source of truth and is always committed to version control.

## What's Next

- [AI-Assisted Data Mapping](ai-assisted-mapping.md) -- Let AI suggest mappings
- [JSON Processing](json.md) -- JSON-specific transformations
