---
title: Data Mapper
---

# Data Mapper

Data mapper artifacts define transformations between data structures. Use the visual data mapper for drag-and-drop field mapping or write code-based mapping functions for complex transformations.

## Adding a data mapper

1. Open the **WSO2 Integrator: BI** sidebar in VS Code.

   ![WSO2 Integrator sidebar showing the project structure with Data Mappers listed](/img/develop/integration-artifacts/supporting/data-mapper/step-1.png)

2. Click **+** next to **Data Mappers** in the sidebar.

3. In the **Create New Data Mapper** form, fill in the following fields:

   ![Create New Data Mapper form showing Name, Inputs, and Output fields](/img/develop/integration-artifacts/supporting/data-mapper/step-2.png)

   | Field | Description |
   |---|---|
   | **Data Mapper Name** | A unique name for the mapping function (for example, `transform`). Required. |
   | **Public** | Check **Make visible across the workspace** to use this mapper from other integrations. |
   | **Inputs** | Click **+ Add Input** to define one or more source types. Each input has a name and a type. |
   | **Output** | The target type that the mapper produces. Required. |

4. Click **Create**. The visual data mapper canvas opens, showing the input type fields on the left and the output type fields on the right.

5. Draw connections between source and target fields by clicking and dragging from an input field to the corresponding output field. Add transformation expressions inline for fields that require type conversion or computation.

```ballerina
// mappers/order_mapper.bal

type ExternalOrder record {|
    string order_id;
    string customer_ref;
    ExternalLineItem[] line_items;
    string ship_to_address;
    string order_date;
|};

type ExternalLineItem record {|
    string sku;
    string description;
    int qty;
    string unit_price;
|};

function mapToInternalOrder(ExternalOrder ext) returns OrderRequest => {
    customerId: ext.customer_ref,
    items: from ExternalLineItem item in ext.line_items
        select {
            productId: item.sku,
            productName: item.description,
            quantity: item.qty,
            unitPrice: check decimal:fromString(item.unit_price)
        },
    shippingAddress: parseAddress(ext.ship_to_address),
    couponCode: ()
};
```

## When to use each approach

| Approach | Best For |
|---|---|
| **Visual Data Mapper** | Simple field-to-field mappings, non-technical users, quick prototyping |
| **Code-Based Mapping** | Complex transformations, conditional logic, aggregations, multi-step processing |

## Best practices

| Practice | Description |
|---|---|
| **Dedicated files** | Keep mapping functions in a `mappers/` directory |
| **Typed input/output** | Use specific record types for source and target |
| **Expression mappings** | Use Ballerina expressions for inline transformations (for example, type conversion, string formatting) |
| **Reusable helpers** | Extract common transformations (for example, `parseAddress`) into shared functions |
