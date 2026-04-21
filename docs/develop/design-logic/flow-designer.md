---
title: Visual Flow Designer
---

# Visual Flow Designer

The visual flow designer lets you build integration logic by composing nodes on a canvas rather than writing code. Each node represents a step in your integration — calling an API, transforming data, making a decision, or handling an error. The designer generates valid Ballerina code, and changes sync bidirectionally between the visual and code views.

## Opening the flow designer

Click any **Automation**, handler, or function listed under **Entry Points** in the WSO2 Integrator sidebar. The flow canvas opens in the editor panel.

![Flow canvas showing the Automation with Start node, action buttons, and Flow/Sequence tabs](/img/develop/design-logic/flow-designer/canvas-overview.png)

The canvas shows:

- **Start** node — the entry point of the flow
- **Action buttons** below the Start node — add a step (**+**), add a sub-flow, or generate with AI
- **Flow / Sequence** tabs — switch between the vertical flow diagram and the sequence diagram view

## Design view components

| Component | Location | Purpose |
|---|---|---|
| **Project Explorer** | Left sidebar | Browse Entry Points, Listeners, Connections, Types, Functions, Data Mappers, and Configurations |
| **Canvas** | Central panel | Visual representation of the integration flow with interactive nodes |
| **Flow / Sequence tabs** | Top of canvas | Switch between flow diagram and sequence diagram views |

## Adding steps to the flow

1. In the flow canvas, click the **+** button below the **Start** node (or between any two nodes).
2. The step picker panel opens, showing all available node categories.

   ![Step picker panel showing Connections, Statement, Control, AI, Error Handling, Concurrency, and Logging sections](/img/develop/design-logic/flow-designer/step-picker.png)

3. Select a node from the appropriate section:

   | Section | Nodes |
   |---|---|
   | **Connections** | Add Connection — invoke a configured connector |
   | **Statement** | Declare Variable, Update Variable, Call Function, Map Data |
   | **Control** | If, Match, While, Foreach, Return |
   | **AI** | AI-assisted generation nodes |
   | **Error Handling** | Do/on-fail, Retry, and other error handling nodes |
   | **Concurrency** | Worker-based parallel execution |
   | **Logging** | Log statement nodes |

4. The node is added to the canvas. Click it to open its configuration panel.

```ballerina
public function main() returns error? {
    // Each node in the visual designer corresponds to a Ballerina statement
    // Declare Variable → variable declaration
    string orderId = "ORD-001";

    // Call Function → function call expression
    check processOrder(orderId);

    // If node → if/else block
    if orderId.startsWith("ORD-") {
        log:printInfo("Valid order", orderId = orderId);
    }

    // Foreach node → foreach loop
    string[] items = ["item1", "item2"];
    foreach string item in items {
        log:printInfo("Processing", item = item);
    }
}
```

## Two logic view modes

### Flow diagram mode

The default view shows a vertical execution path with service calls, conditionals, and error handlers rendered as connected nodes. Hover over a node to access AI assistance, comments, and insertion points. Click the three-dot menu on a node for edit, delete, breakpoint, and source view options.

### Sequence diagram mode

Click the **Sequence** tab to see how your integration communicates with external systems — displayed as a structured sequence diagram showing interactions between services, clients, and functions.

## Bidirectional sync

Changes in the visual designer immediately update the Ballerina code, and vice versa:

- Edit code and see the flow update in real time
- Rearrange nodes visually and see the code reorder
- Add code constructs not available in the designer — they appear as collapsed code blocks in the flow

:::info Unsupported constructs
Some advanced Ballerina constructs (such as worker message passing or lock statements) do not have visual representations. They appear as collapsed code blocks in the flow designer that you can expand and edit inline.

## What's next

- [Connections](connections.md) — Configure the connections used in your flow
- [Control Flow](control-flow.md) — Detailed guide to branching and looping nodes
- [Error Handling](error-handling.md) — Error handling patterns in the designer
