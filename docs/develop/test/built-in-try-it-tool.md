---
title: Built-in Try-It Tool
---

The built-in Try-It tool lets you test your integrations directly from WSO2 Integrator without switching to an external client. It detects your service endpoints and provides an interface for composing requests, setting parameters and headers, and inspecting responses.

The Try-It tool supports the following integration types:

- **HTTP service** — test REST APIs and HTTP resources
- **MCP server** — test Model Context Protocol servers
- **Chat agent** — test AI agents through a conversational interface
- **GraphQL service** — test GraphQL queries through a built-in GraphiQL editor

Clicking **Try It** or **Chat** automatically starts the integration if it is not already running.

## Testing HTTP services

### Opening the Try-It panel

You can open the Try-It panel from the visual designer or directly from the code editor:

- **Service Designer view** — Click **Try It** in the service header toolbar (next to **Configure** and **More**). This opens the Try-It panel listing all resources defined in the service.
- **Flow diagram view** — Open a specific resource in the flow diagram, then click **Try It** in the toolbar. This opens the Try-It panel scoped to that resource.
- **Code editor (CodeLens)** — When viewing `main.bal` in the editor, a CodeLens action bar appears above the service declaration showing **Run | Debug | Visualize | Try it**. Click **Try it** to open the Try-It panel without leaving the code editor.

![Service Designer toolbar with Try It button and Try-It panel open on the right](/img/develop/test/try-it/http-service-tryit-panel.png)

The Try-It panel on the right lists each resource as a collapsible section with its HTTP method, path, and a request form.

### Composing and sending a request

For each resource, fill in the request details before sending:

- **Path parameters** — For endpoints with path segments such as `/orders/{id}`, an input field appears for each parameter.
- **Query parameters** — For endpoints that accept query parameters, dedicated input fields appear below the path.
- **Headers** — Use the **Headers** section to add `Authorization`, `Content-Type`, or any custom header your service requires.
- **Request body** — For `POST`, `PUT`, and `PATCH` resources, a body editor appears. The tool auto-generates a sample payload based on your resource's parameter types — edit it to match your test scenario.

Click the run icon next to the endpoint to dispatch the request.

### Viewing the response

After sending a request, the response panel displays:

- **Status code** — The HTTP status code (e.g., `200 OK`, `404 Not Found`)
- **Response body** — Formatted JSON, XML, or plain text with syntax highlighting
- **Response headers** — All headers returned by the service
- **Elapsed time** — How long the request took

## Testing MCP servers

The Try-It experience for MCP servers follows the same pattern as HTTP services. Open the MCP server in the Service Designer or flow diagram view, then click **Try It** in the toolbar. The panel lists all available MCP tools and lets you invoke them with input parameters.

## Testing chat agents

For AI chat agents, the Try-It experience is replaced by a conversational chat interface.

### Opening the chat panel

1. Open the chat agent in the flow diagram view.
2. Click **Chat** in the toolbar (next to **Tracing: Off**).

![AI Chat Agent flow diagram with Chat button and Agent Chat panel open on the right](/img/develop/test/try-it/chat-agent-chat-panel.png)

The **Agent Chat** panel opens on the right with a text input field at the bottom.

### Sending messages

Type your message in the input field and press **Enter** or click the send icon. The agent processes the message and returns a response in the chat panel. Use this interface to:

- Validate the agent's conversational behavior and response quality
- Test edge cases and unexpected inputs
- Refine the agent's system prompt based on observed responses

## Testing GraphQL services

The GraphQL Try-It experience uses a built-in GraphiQL editor. The entry point is different from HTTP and MCP services.

### Opening the GraphiQL editor

1. Run the integration by clicking the green play button in the toolbar. After the integration starts, a popup appears asking whether you want to open the Try-It panel — click **Yes**.
2. If the popup does not appear, open the Command Palette (`Cmd+Shift+P` on macOS or `Ctrl+Shift+P` on Windows/Linux), type **Try It**, and select the command. Choose the correct service and port from the list.

![GraphQL Diagram view showing a GraphQL service](/img/develop/test/try-it/graphql-diagram-view.png)

The **GraphQL Try It** tab opens with:

- **Explorer** (left panel) — browse available queries and mutations
- **Query editor** (center) — write your GraphQL query
- **Response panel** (right) — view the query result
- **Variables** and **Headers** tabs (bottom of the query editor)

![GraphQL Try It panel showing the built-in GraphiQL editor](/img/develop/test/try-it/graphql-tryit-panel.png)

Click the pink run button to execute the query.

The schema Explorer may show **No Schema Available** if schema introspection is not supported by your service configuration. You can still write and execute queries manually in the query editor.

## Tips for effective testing

- **Try It starts the integration automatically** — you do not need to run the integration separately before clicking **Try It** or **Chat**.
- **Use auto-generated payloads** as a starting point, then modify specific fields for your test scenario.
- **Test error paths** — send malformed payloads or omit required fields to verify your error handling logic.
- **Check response headers** — verify that your service returns the correct `Content-Type`, caching, and CORS headers.
- **Combine with debugging** — set breakpoints in your integration code, then send a request via Try-It to step through the execution. See [Debugging](/docs/develop/debugging/editor-debugging) for details.

## What's next

- [Unit testing](unit-testing.md) — automated test suites with assertions
- [Debugging](/docs/develop/debugging/editor-debugging) — step through code while testing with Try-It
