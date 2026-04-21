---
title: Functions
---

# Functions

Function artifacts encapsulate reusable logic that can be called from any integration artifact. Keep functions in separate `.bal` files organized by domain to maintain clean separation of concerns.

## Adding a function

1. Open the **WSO2 Integrator: BI** sidebar in VS Code.

   ![WSO2 Integrator sidebar showing the project structure with Functions listed](/img/develop/integration-artifacts/supporting/functions/step-1.png)

2. Click **+** next to **Functions** in the sidebar.

3. In the **Create New Function** form, fill in the following fields:

   ![Create New Function form showing Name, Description, Parameters, and Return Type fields](/img/develop/integration-artifacts/supporting/functions/step-2.png)

   | Field | Description |
   |---|---|
   | **Name** | A unique identifier for the function (for example, `validateOrder`). Required. |
   | **Description** | Optional description of the function's purpose. |
   | **Public** | Check **Make visible across the workspace** to export the function for use in other integrations. |
   | **Parameters** | Click **+ Add Parameter** to define each input. Each parameter has a name and a type. |
   | **Return Type** | The type of the value returned by the function. Leave empty for functions that return nothing. |

4. Click **Create**. The function opens in the **flow designer** canvas where you add integration steps.

```ballerina
// functions/validation.bal

function validateEmail(string email) returns boolean {
    return email.includes("@") && email.includes(".");
}

function validateOrderRequest(OrderRequest request) returns string[] {
    string[] errors = [];

    if request.items.length() == 0 {
        errors.push("Order must have at least one item");
    }

    foreach LineItem item in request.items {
        if item.quantity <= 0 {
            errors.push("Invalid quantity for product: " + item.productId);
        }
        if item.unitPrice < 0d {
            errors.push("Invalid price for product: " + item.productId);
        }
    }

    if request.shippingAddress.zipCode.length() != 5 {
        errors.push("ZIP code must be 5 digits");
    }

    return errors;
}
```

## Function configuration

After creating a function, click its name in the sidebar under **Functions** to reopen the configuration form. You can update the name, description, parameters, and return type.

The **Public** checkbox controls whether the function is accessible from outside the current integration project. Public functions are prefixed with `public` in the generated code.

Use access modifiers and type annotations to control visibility and type safety:

```ballerina
// functions/transforms.bal

// Public function callable from other modules
public function calculateOrderTotal(LineItem[] items, string? couponCode) returns decimal {
    decimal subtotal = 0;
    foreach LineItem item in items {
        subtotal += item.unitPrice * <decimal>item.quantity;
    }
    decimal discount = getDiscount(couponCode);
    return subtotal * (1 - discount);
}

// Private helper — not accessible from outside this file
function getDiscount(string? couponCode) returns decimal {
    match couponCode {
        "SAVE10" => { return 0.10d; }
        "SAVE20" => { return 0.20d; }
        _ => { return 0d; }
    }
}
```

## Project organization

Group functions by their domain to keep the codebase organized.

```
my-integration/
├── functions/
│   ├── validation.bal         # Input validation functions
│   ├── transforms.bal         # Data transformation functions
│   ├── notifications.bal      # Notification helper functions
│   └── formatting.bal         # String/date formatting utilities
├── types.bal
├── connections.bal
└── main.bal
```

## Best practices

| Practice | Description |
|---|---|
| **Single responsibility** | Each function should do one thing well |
| **Typed parameters** | Use specific record types instead of `json` or `anydata` |
| **Error returns** | Return `error?` for operations that can fail |
| **Isolated functions** | Mark pure functions as `isolated` for thread safety |
| **Descriptive names** | Use verb-based names like `validateOrder`, `calculateTotal` |
