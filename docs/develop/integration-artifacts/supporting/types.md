---
title: Types
---

# Types

Type artifacts define the data structures used throughout your integration. They ensure type safety across services, event handlers, and transformations. Define types in dedicated `.bal` files and reuse them across all artifacts in your project.

## Adding a type

1. Open the **WSO2 Integrator: BI** sidebar in VS Code.

   ![WSO2 Integrator sidebar showing the project structure with Types listed](/img/develop/integration-artifacts/supporting/types/step-1.png)

2. Click **+** next to **Types** in the sidebar (or click **+ Add Type** from the Types canvas).

3. In the **New Type** panel, choose **Create from scratch** or **Import**.

   ![New Type creation form showing Kind and Name fields](/img/develop/integration-artifacts/supporting/types/step-2.png)

   | Field | Description |
   |---|---|
   | **Kind** | The type kind: **Record**, **Enum**, **Union**, or **Table**. |
   | **Name** | A unique name for the type (for example, `OrderRequest`). |
   | **Fields** | For records — add fields using the **+** button. Each field has a name and a type. |
   | **Advanced Options** | Expand to set additional constraints such as closed record enforcement. |

4. Click **Save**. The type is added to your project and appears in the type diagram.

```ballerina
// types.bal

type OrderRequest record {|
    string customerId;
    LineItem[] items;
    Address shippingAddress;
    string? couponCode;
|};

type LineItem record {|
    string productId;
    string productName;
    int quantity;
    decimal unitPrice;
|};

type Address record {|
    string street;
    string city;
    string state;
    string zipCode;
    string country;
|};
```

## Type diagram

Click **View Type Diagram** (or the diagram icon) next to **Types** in the sidebar to open the visual type diagram. The canvas renders all types in your project as nodes, with arrows showing relationships between record types and their nested fields.

![Type diagram canvas showing the visual representation of types in the project](/img/develop/integration-artifacts/supporting/types/step-3.png)

Use the toolbar buttons at the bottom left to zoom in, zoom out, fit the diagram to the screen, or export it as an image.

Type relationships are expressed through field type references. A record that contains another record as a field creates an implicit association in the diagram:

```ballerina
type OrderRequest record {|
    string customerId;
    LineItem[] items;      // references LineItem
    Address shippingAddress; // references Address
|};
```

## Type kinds

### Records

Select **Record** from the **Kind** dropdown to define a structured type with named fields. Use **Advanced Options** to enforce a closed record (no extra fields allowed).

```ballerina
// Closed record — no extra fields permitted
type OrderRequest record {|
    string customerId;
    LineItem[] items;
    Address shippingAddress;
    string? couponCode;
|};
```

### Enums

Select **Enum** from the **Kind** dropdown to define a fixed set of string values. Add each member value using the **+** button in the **Members** section.

```ballerina
enum OrderStatus {
    PENDING,
    CONFIRMED,
    SHIPPED,
    DELIVERED,
    CANCELLED
}
```

### Unions

Select **Union** from the **Kind** dropdown to allow a value to be one of several types. Add each member type using the **+** button.

```ballerina
type PaymentMethod CreditCard|BankTransfer|DigitalWallet;

type CreditCard record {|
    string cardNumber;
    string expiryDate;
    string cvv;
|};

type BankTransfer record {|
    string bankName;
    string accountNumber;
    string routingNumber;
|};

type DigitalWallet record {|
    string provider;
    string walletId;
|};
```

### Tables

Select **Table** from the **Kind** dropdown to define an in-memory keyed collection. Specify the row type and the key field.

```ballerina
type ProductTable table key(id);

type Product record {|
    readonly string id;
    string name;
    decimal price;
    int stock;
|};

// Usage
ProductTable products = table [
    {id: "P001", name: "Widget", price: 9.99, stock: 100},
    {id: "P002", name: "Gadget", price: 24.99, stock: 50}
];

Product? widget = products["P001"];
```

## Best practices

| Practice | Description |
|---|---|
| **Closed records** | Use `record {\| ... \|}` to restrict fields to only those defined |
| **Dedicated files** | Keep type definitions in separate `types.bal` files |
| **Descriptive names** | Name types after their domain concept (for example, `OrderRequest`, not `Data`) |
| **Reuse across artifacts** | Define types once and import them in services, event handlers, and functions |
