---
title: XML Processing
---

# XML Processing

Work with XML data -- common in enterprise and legacy system integrations. Ballerina provides `xml` as a first-class type with native literal syntax, navigation, iteration, and conversion capabilities.

## XML Literals and Construction

Create XML values directly in Ballerina code using backtick templates. The `xml` type covers elements, text nodes, comments, and processing instructions.

1. **Add a Variable step** — In the flow designer, click **+** and select **Variable**. Set the type to `xml` and enter an XML backtick template as the expression.

2. **Use embedded expressions** — Reference variables inside XML templates using `${variableName}` syntax. Each XML variable appears as a separate **Declare Variable** step in the flow.

   ![Flow designer showing Declare Variable steps for XML literal construction including dynamic expressions](/img/develop/transform/xml/xml-literals-flow.png)

3. **Configure the expression** — Click a variable node to view and edit the XML template expression in the side panel.

   ![Side panel showing the dynamic XML variable with embedded expression](/img/develop/transform/xml/xml-literals-dynamic-panel.png)

```ballerina
import ballerina/io;

public function main() {
    // XML element
    xml greeting = xml `<greeting>Hello, World!</greeting>`;

    // Nested elements
    xml order = xml `<order id="ORD-100">
        <customer>Acme Corp</customer>
        <items>
            <item sku="WDG-01" qty="5"/>
            <item sku="GDG-02" qty="2"/>
        </items>
    </order>`;

    // XML with embedded expressions
    string name = "Globex Inc";
    int quantity = 10;
    xml dynamic = xml `<shipment>
        <recipient>${name}</recipient>
        <units>${quantity}</units>
    </shipment>`;

    io:println(dynamic);
}
```

### XML text and comments

Add **Variable** steps with the type set to `xml` for each XML node type — text, comment, or processing instruction. Each appears as a **Declare Variable** step in the flow.

![Flow designer showing Declare Variable steps for XML text, comment, and processing instruction nodes](/img/develop/transform/xml/xml-text-comments-flow.png)

```ballerina
// Text node
xml text = xml `Hello, World!`;

// Comment
xml comment = xml ``;

// Processing instruction
xml pi = xml `<?xml-stylesheet type="text/xsl" href="style.xsl"?>`;
```

## Navigating XML

Access child elements, attributes, and text content using Ballerina's XML navigation methods.

1. **Navigate child elements** — Add a **Variable** step with the expression `catalog/<product>` to select child elements by name, or `catalog/*` to select all children.

2. **Access text content** — Use `.data()` in a variable expression (for example, `(firstProduct/<name>).data()`) to extract text content from an element.

3. **Access attributes** — Use `.getAttributes()["attributeName"]` to read element attributes.

4. **Filter descendants** — Use `catalog/**/<name>` to find all matching elements at any depth.

   ![Flow designer showing Declare Variable steps for XML navigation including child access, text content, attributes, and descendant filtering](/img/develop/transform/xml/xml-navigating-flow.png)

5. **View the expression** — Click a variable node to see the navigation expression in the side panel.

   ![Side panel showing the products variable with catalog child access expression](/img/develop/transform/xml/xml-navigating-child-panel.png)

```ballerina
import ballerina/io;

public function main() {
    xml catalog = xml `<catalog>
        <product id="P1" category="electronics">
            <name>Widget</name>
            <price>29.99</price>
        </product>
        <product id="P2" category="tools">
            <name>Gadget</name>
            <price>49.99</price>
        </product>
    </catalog>`;

    // Get child elements by name
    xml products = catalog/<product>;

    // Get all children
    xml children = catalog/*;

    // Access element text content
    xml firstProduct = (catalog/<product>)[0];
    string productName = (firstProduct/<name>).data();
    io:println(productName); // Widget

    // Access attributes
    string? id = (firstProduct).getAttributes()["id"];
    io:println(id); // P1

    // Filter descendants
    xml names = catalog/**/<name>;
    io:println(names);
    // <name>Widget</name><name>Gadget</name>
}
```

## XML Namespaces

Handle namespaced XML using `xmlns` declarations in Ballerina.

1. **Declare namespace bindings** — The `xmlns` declarations in the code appear implicitly in the flow. Add **Variable** steps that use namespace-prefixed XML templates and navigation expressions.

2. **Navigate namespaced elements** — Use the namespace prefix in navigation expressions (for example, `nsOrder/<cmn:customer>`).

   ![Flow designer showing Declare Variable steps for namespaced XML construction and navigation](/img/develop/transform/xml/xml-namespaces-flow.png)

```ballerina
public function main() {
    xmlns "http://example.com/orders" as ord;
    xmlns "http://example.com/common" as cmn;

    xml nsOrder = xml `<ord:order>
        <cmn:customer>Acme Corp</cmn:customer>
        <ord:total>1500.00</ord:total>
    </ord:order>`;

    // Navigate namespaced elements
    xml customer = nsOrder/<cmn:customer>;
}
```

## Iterating Over XML

Use `foreach` or query expressions to process XML sequences.

1. **Add a Foreach step** — Click **+** and select **Foreach** under **Control**. In the configuration panel, specify:

   | Field | Description |
   |---|---|
   | **Collection** | The XML sequence to iterate over (for example, `items/<item>`) |
   | **Variable** | The loop variable name bound to each XML element |

2. **Add steps inside the loop** — Add **Variable** steps inside the loop body to extract data using XML navigation expressions like `(item/<sku>).data()`.

3. **Use query expressions** — For filtering, add a **Variable** step with a query expression as the value.

   ![Flow designer showing a Foreach node iterating over XML items with variable extraction steps inside the loop body](/img/develop/transform/xml/xml-iterating-flow.png)

```ballerina
import ballerina/io;

public function main() {
    xml items = xml `<items>
        <item><sku>A1</sku><qty>3</qty></item>
        <item><sku>B2</sku><qty>7</qty></item>
        <item><sku>C3</sku><qty>1</qty></item>
    </items>`;

    // Iterate with foreach
    foreach xml item in items/<item> {
        string sku = (item/<sku>).data();
        string qty = (item/<qty>).data();
        io:println(string `SKU: ${sku}, Quantity: ${qty}`);
    }

    // Filter with query expressions
    xml highQty = from xml item in items/<item>
        let string qtyStr = (item/<qty>).data()
        let int qty = check int:fromString(qtyStr)
        where qty > 2
        select item;
}
```

## XML Mutation

Modify XML structures by setting children or attributes.

1. **Add a Variable step** — Create a **Variable** step with the type set to `xml:Element` and initialize it with the XML literal.

2. **Add a Custom Expression step** — Click **+** and select **Custom Expression**. Enter the mutation expression (for example, `doc.setChildren(xml '...')`). The `setChildren` call appears as a **Custom Expression** node in the flow.

   ![Flow designer showing a Declare Variable step for the XML document followed by a Custom Expression step for setChildren](/img/develop/transform/xml/xml-mutation-flow.png)

```ballerina
public function main() {
    xml doc = xml `<order><status>pending</status></order>`;

    // Replace children
    doc.setChildren(xml `<status>completed</status><updatedAt>2025-01-15</updatedAt>`);
}
```

## XML to record conversion

Use the `ballerina/data.xmldata` module to convert XML into typed Ballerina records for safer manipulation.

1. **Define the target record types** — Navigate to **Types** in the sidebar and click **+** to add a new type. Select the **Import** tab in the right-hand panel, then paste the record definitions for `PurchaseOrder`, `ShipTo`, and `Item`. For details on creating types, see [Types](../integration-artifacts/supporting/types.md).

   ![New Type panel showing the Import tab with XML format selected](/img/develop/transform/xml/types-import-tab.png)

2. **Add a Variable step** — Open your resource function in the flow designer. Add a **Variable** step, set the type to `PurchaseOrder`, and set the expression to `check xmldata:parseAsType(payload)`.

   ![Flow designer showing the xmldata parseAsType variable step and mapOrder transformation in the processXml resource](/img/develop/transform/xml/flow-xml-parse-step.png)

3. **Map fields visually** — To transform the parsed record into another type, use the [Visual Data Mapper](data-mapper.md).

   ![Data Mapper showing PurchaseOrder input fields on the left and OrderSummary output fields on the right](/img/develop/transform/xml/data-mapper-xml-to-record.png)

```ballerina
import ballerina/data.xmldata;
import ballerina/io;

type PurchaseOrder record {|
    string orderDate;
    ShipTo shipTo;
    Item[] item;
|};

type ShipTo record {|
    string name;
    string street;
    string city;
|};

type Item record {|
    @xmldata:Attribute
    string partNum;
    string productName;
    int quantity;
    decimal price;
|};

public function main() returns error? {
    xml po = xml `<PurchaseOrder orderDate="2025-03-15">
        <shipTo>
            <name>Acme Corp</name>
            <street>123 Main St</street>
            <city>Springfield</city>
        </shipTo>
        <item partNum="WDG-01">
            <productName>Widget</productName>
            <quantity>10</quantity>
            <price>29.99</price>
        </item>
    `;

    PurchaseOrder order = check xmldata:parseAsType(po);
    io:println(order.shipTo.name); // Acme Corp
}
```

## Record to XML conversion

Convert Ballerina records back to XML using `xmldata:toXml()`.

1. **Define the record type** — Navigate to **Types** in the sidebar and click **+** to add a new type. Select the **Import** tab in the right-hand panel, then paste the record definition (for example, `Invoice`). For details on creating types, see [Types](../integration-artifacts/supporting/types.md).

   ![New Type panel showing the Import tab with XML format selected](/img/develop/transform/xml/types-import-tab.png)

2. **Add a Variable step** — In the flow designer, add a **Variable** step, set the type to `xml`, and set the expression to `check xmldata:toXml(inv)`.

The same flow designer pattern shown in the [XML to record conversion](#xml-to-record-conversion) section applies here — each `xmldata` function call appears as a dedicated step in the flow.

```ballerina
import ballerina/data.xmldata;

type Invoice record {|
    string invoiceId;
    string customer;
    decimal total;
|};

public function main() returns error? {
    Invoice inv = {
        invoiceId: "INV-2001",
        customer: "Globex Inc",
        total: 1500.00
    };

    xml invoiceXml = check xmldata:toXml(inv);
    // Produces: <invoiceId>INV-2001</invoiceId>...
}
```

## XML to JSON conversion

Convert between XML and JSON using `xmldata:toJson()` and `xmldata:fromJson()`.

1. **Define the record types** — Navigate to **Types** in the sidebar and click **+** to add a new type. Select the **Import** tab in the right-hand panel, then paste the record definitions for both the source and target types. For details on creating types, see [Types](../integration-artifacts/supporting/types.md).

   ![New Type panel showing the Import tab with XML format selected](/img/develop/transform/xml/types-import-tab.png)

2. **Add Variable steps** — In the flow designer, add a **Variable** step with the expression `check xmldata:parseAsType(payload)` to parse XML into a typed record. Then add a second **Variable** step or a **Return** step with the expression `record.toJson()` to convert the record to JSON.

   ![Flow designer showing the XML parse, mapOrder, and toJson return steps in sequence](/img/develop/transform/xml/flow-xml-parse-step.png)

3. **Map fields visually** — To map fields between the parsed XML record and a target record before converting to JSON, use the [Visual Data Mapper](data-mapper.md).

```ballerina
import ballerina/data.xmldata;
import ballerina/io;

public function main() returns error? {
    xml source = xml `<customer>
        <name>Acme Corp</name>
        <email>info@acme.com</email>
    </customer>`;

    // XML to JSON via record conversion
    record {string name; string email;} cust = check xmldata:parseAsType(source);
    json customerJson = cust.toJson();
    io:println(customerJson);

    // JSON to XML
    xml result = check xmldata:fromJson(customerJson);
    io:println(result);
}
```

## Best Practices

- **Use typed records** for XML processing whenever the schema is known -- this catches mapping errors at compile time
- **Prefer `data.xmldata` over manual navigation** for complex documents to reduce boilerplate
- **Handle namespaces explicitly** -- declare `xmlns` bindings at the top of functions that work with namespaced XML
- **Use query expressions** for filtering and transforming XML sequences instead of manual loops

## What's Next

- [CSV & Flat File Processing](csv-flat-file.md) -- Tabular data formats
