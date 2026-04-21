---
title: AI-Assisted Data Mapping
---

# AI-Assisted Data Mapping

Let AI analyze your source and target schemas and suggest field mappings automatically. The WSO2 Integrator VS Code extension includes an **Auto Map** feature that uses an LLM to generate data mapping suggestions, reducing manual effort for routine transformations.

## How AI Mapping Assistance Works

The AI mapping feature analyzes the field names, types, and structures of your source and target record types, then generates Ballerina mapping expressions. The process follows these steps:

1. **Schema analysis** -- The AI reads the source and target record type definitions from your project.
2. **Semantic matching** -- Field names, types, and nesting structures are compared to find likely correspondences (e.g., `customer_name` maps to `customerName`, `email_address` maps to `contactEmail`).
3. **Expression generation** -- For each matched pair, the AI produces a Ballerina expression -- direct assignments for compatible types, or transformation expressions for type mismatches.
4. **Code insertion** -- The suggested mappings are inserted into the data mapper as a Ballerina expression-bodied function that you can review and edit.

## Launching Auto Map

To use AI-assisted mapping in the visual data mapper:

1. Open the data mapper by clicking the **Visualize** CodeLens on an expression-bodied function, or through the Ballerina Visualizer panel.
2. Ensure your source and target record types are defined.
3. Click the **Auto Map** button in the data mapper toolbar.
4. Sign in to **Ballerina Copilot** if prompted -- the AI feature requires authentication.
5. Wait for the suggestions to appear as connections in the mapper.

```ballerina
type SourceContact record {|
    string first_name;
    string last_name;
    string email_address;
    string phone_number;
    string company;
    string job_title;
|};

type CrmContact record {|
    string fullName;
    string email;
    string phone;
    string organization;
    string role;
|};

// Before Auto Map -- empty transformation
function transform(SourceContact src) returns CrmContact => {
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    role: ""
};

// After Auto Map -- AI-suggested mappings
function transform(SourceContact src) returns CrmContact => {
    fullName: src.first_name + " " + src.last_name,
    email: src.email_address,
    phone: src.phone_number,
    organization: src.company,
    role: src.job_title
};
```

## Reviewing and Accepting Suggestions

After the AI generates mappings, each suggestion appears as a connection line in the visual mapper. Review them before accepting:

- **Solid green lines** indicate high-confidence matches where field names and types align closely.
- **Dashed lines** indicate lower-confidence matches that may need manual adjustment.
- **Click a connection line** to view the generated expression in the expression editor.
- **Delete a connection** by selecting it and pressing the delete key if the suggestion is incorrect.
- **Edit an expression** by clicking the expression icon to refine the AI's output.

All suggestions are preliminary until you save the file. The generated Ballerina code is always visible in the code editor, so you can verify the logic directly.

## Manual Override and Refinement

You can combine AI suggestions with manual mappings:

- Accept the AI mappings that are correct.
- Delete incorrect connections and create manual ones by clicking source and target fields.
- Edit generated expressions to add business logic the AI cannot infer.

```ballerina
// AI suggested a direct mapping for phone, but you need formatting
function transform(SourceContact src) returns CrmContact => {
    fullName: src.first_name + " " + src.last_name,  // AI suggestion -- accepted
    email: src.email_address,                          // AI suggestion -- accepted
    phone: formatPhone(src.phone_number),              // Manual override -- added formatting
    organization: src.company,                         // AI suggestion -- accepted
    role: src.job_title                                // AI suggestion -- accepted
};

function formatPhone(string raw) returns string {
    string digits = re `\D`.replaceAll(raw, "");
    if digits.length() == 10 {
        return string `(${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6)}`;
    }
    return raw;
}
```

## When AI Mapping Works Well

The AI mapper produces the best results in these scenarios:

- **Renaming fields** -- `customer_name` to `customerName`, `email_address` to `email`.
- **Simple concatenation** -- combining `first_name` and `last_name` into `fullName`.
- **Direct type-compatible mappings** -- string-to-string, number-to-number.
- **Flattening or nesting** -- mapping between nested and flat record structures when field names provide clear hints.

## Limitations

Be aware of the following limitations:

- **Complex business logic** -- The AI cannot infer domain-specific rules such as discount calculations, tax rates, or conditional routing.
- **Custom function calls** -- The AI does not know about helper functions defined elsewhere in your project. Add these manually.
- **Ambiguous field names** -- Generic names like `value`, `data`, or `type` may produce incorrect matches.
- **Array transformations** -- Complex array mappings with filtering, grouping, or aggregation typically need manual query expressions.
- **Experimental feature** -- The Auto Map capability is under active development. Results improve as the underlying model evolves.

## Best Practices

- **Start with Auto Map** for new transformations to get a baseline, then refine manually.
- **Use descriptive field names** in your record types -- the AI matches more accurately when names are semantically meaningful.
- **Review every suggestion** before saving -- never assume the AI mappings are correct without verification.
- **Combine with the expression editor** for hybrid workflows where the AI handles simple fields and you handle complex logic.

## What's Next

- [Visual Data Mapper](data-mapper.md) -- Manual mapping for precision
