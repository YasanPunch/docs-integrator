---
title: AI-Powered Customer Support Agent
---

# AI-Powered Customer Support Agent

## What You'll Build

An AI-powered customer support agent that receives requests over HTTP, reasons about the customer's intent using an LLM, and calls backend tools (order lookup, refund processing, FAQ search) to resolve support tickets automatically.

```mermaid
flowchart TD
    User([HTTP Request<br/>(chat message)])
    subgraph Agent["Customer Support Agent"]
        LLM[LLM<br/>(OpenAI)]
        Router{Tool Router}
        LLM ----> Router
    end
    Order[(Order<br/>Lookup DB)]
    Refund[Refund<br/>Service]
    FAQ[FAQ<br/>Search]

    User ----> LLM
    Router ----> Order
    Router ----> Refund
    Router ----> FAQ
```

## What You'll Learn

- Creating an AI agent with LLM integration in WSO2 Integrator
- Defining tools that the agent can invoke via function calling
- Binding an agent to an HTTP service endpoint
- Managing conversation context and memory
- Handling tool execution errors gracefully

## Prerequisites

- WSO2 Integrator VS Code extension installed
- An OpenAI API key (or compatible LLM provider)
- A running PostgreSQL database for order data

**Time estimate:** 30--45 minutes

## Step-by-Step Walkthrough

### Step 1: Create the Project

1. Open VS Code and run **WSO2 Integrator: Create New Project**.
2. Name the project `customer-support-agent`.
3. Open `Config.toml` and add your credentials:

```toml
[customerSupportAgent]
openAiKey = "<YOUR_OPENAI_API_KEY>"

[customerSupportAgent.db]
host = "localhost"
port = 5432
database = "orders"
user = "admin"
password = "admin"
```

### Step 2: Define the Data Types

Create the record types for orders and support requests in `types.bal`:

```ballerina
// types.bal

// Represents an incoming chat message from the customer.
type ChatRequest record {|
    string sessionId;
    string message;
|};

// The agent's reply.
type ChatResponse record {|
    string sessionId;
    string reply;
|};

// An order record retrieved from the database.
type Order record {|
    string orderId;
    string customerEmail;
    string status;       // "pending" | "shipped" | "delivered" | "cancelled"
    decimal total;
    string createdAt;
|};

// Input for the refund tool.
type RefundRequest record {|
    string orderId;
    string reason;
|};

type RefundResult record {|
    boolean success;
    string refundId;
|};
```

### Step 3: Build the Tools

Tools are regular Ballerina functions that the agent can call. Create `tools.bal`:

```ballerina
// tools.bal
import ballerinax/postgresql;
import ballerina/http;

configurable string openAiKey = ?;
configurable string dbHost = ?;
configurable int dbPort = ?;
configurable string dbName = ?;
configurable string dbUser = ?;
configurable string dbPassword = ?;

final postgresql:Client orderDb = check new (dbHost, dbUser, dbPassword, dbName, dbPort);

// Tool 1: Look up an order by ID.
isolated function lookupOrder(string orderId) returns Order|error {
    Order order = check orderDb->queryRow(
        `SELECT order_id, customer_email, status, total, created_at
         FROM orders WHERE order_id = ${orderId}`
    );
    return order;
}

// Tool 2: Look up orders by customer email.
isolated function lookupOrdersByEmail(string email) returns Order[]|error {
    stream<Order, error?> orderStream = orderDb->query(
        `SELECT order_id, customer_email, status, total, created_at
         FROM orders WHERE customer_email = ${email}
         ORDER BY created_at DESC LIMIT 5`
    );
    return from Order o in orderStream select o;
}

// Tool 3: Process a refund.
final http:Client refundService = check new ("https://internal-api.example.com/refunds");

isolated function processRefund(RefundRequest req) returns RefundResult|error {
    RefundResult result = check refundService->post("/", req);
    return result;
}

// Tool 4: Search the FAQ knowledge base.
isolated function searchFaq(string query) returns string|error {
    // Calls an internal vector search endpoint for FAQ articles.
    http:Client faqClient = check new ("https://internal-api.example.com/faq");
    record {string answer;} result = check faqClient->get(string `/search?q=${query}`);
    return result.answer;
}
```

### Step 4: Create the Agent

Define the agent with its system prompt and tool bindings in `agent.bal`:

```ballerina
// agent.bal
import ballerinax/ai.agent;

const SYSTEM_PROMPT = string `You are a helpful customer support agent for Acme Corp.
Your responsibilities:
1. Look up order information when customers ask about their orders.
2. Process refunds for eligible orders (status must be "delivered" or "shipped").
3. Answer general questions using the FAQ knowledge base.
4. Be polite, concise, and always confirm before processing refunds.
If you cannot resolve the issue, tell the customer a human agent will follow up.`;

// Define tools the agent can invoke.
final agent:Tool orderLookupTool = {
    name: "lookupOrder",
    description: "Look up a single order by its order ID.",
    parameters: {
        properties: {
            "orderId": {'type: agent:STRING, description: "The order ID to look up"}
        },
        required: ["orderId"]
    },
    caller: lookupOrder
};

final agent:Tool emailLookupTool = {
    name: "lookupOrdersByEmail",
    description: "Find recent orders for a customer by their email address.",
    parameters: {
        properties: {
            "email": {'type: agent:STRING, description: "Customer email address"}
        },
        required: ["email"]
    },
    caller: lookupOrdersByEmail
};

final agent:Tool refundTool = {
    name: "processRefund",
    description: "Process a refund for a delivered or shipped order. Always confirm with the customer first.",
    parameters: {
        properties: {
            "orderId": {'type: agent:STRING, description: "The order ID to refund"},
            "reason": {'type: agent:STRING, description: "Reason for the refund"}
        },
        required: ["orderId", "reason"]
    },
    caller: processRefund
};

final agent:Tool faqTool = {
    name: "searchFaq",
    description: "Search the FAQ knowledge base for answers to general questions about policies, shipping, and products.",
    parameters: {
        properties: {
            "query": {'type: agent:STRING, description: "The search query"}
        },
        required: ["query"]
    },
    caller: searchFaq
};

// Create the agent with OpenAI as the LLM backend.
final agent:Agent supportAgent = check new (
    model: check new agent:OpenAiModel(openAiKey, "gpt-4o"),
    systemPrompt: SYSTEM_PROMPT,
    tools: [orderLookupTool, emailLookupTool, refundTool, faqTool]
);
```

### Step 5: Expose the Agent as an HTTP Service

Create `main.bal` to wire the agent to an HTTP endpoint:

```ballerina
// main.bal
import ballerina/http;

// In-memory session store (use Redis or a database for production).
isolated map<string[]> sessionHistory = {};

service /support on new http:Listener(8090) {

    // POST /support/chat — send a message to the agent.
    resource function post chat(ChatRequest req) returns ChatResponse|error {
        string reply = check supportAgent.run(req.message, sessionId = req.sessionId);
        return {sessionId: req.sessionId, reply};
    }

    // GET /support/health — health check.
    resource function get health() returns http:Ok {
        return http:OK;
    }
}
```

### Step 6: Handle Errors

Wrap tool calls with error handling so the agent degrades gracefully:

```ballerina
// error_handler.bal
import ballerina/log;

// Wrap any tool call with logging and a fallback message.
isolated function safeToolCall(function () returns anydata|error toolFn) returns anydata|error {
    anydata|error result = toolFn();
    if result is error {
        log:printError("Tool execution failed", result);
        return error("I'm sorry, I encountered an issue processing your request. " +
                      "A human agent will follow up shortly.");
    }
    return result;
}
```

### Step 7: Test It

1. Start the service:

```bash
bal run
```

2. Send a test message:

```bash
curl -X POST http://localhost:8090/support/chat \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "sess-001",
    "message": "Hi, I need to check the status of order ORD-12345"
  }'
```

3. Expected response:

```json
{
  "sessionId": "sess-001",
  "reply": "I found your order ORD-12345. It was shipped on March 5 and is currently in transit. The estimated delivery date is March 10. Is there anything else I can help you with?"
}
```

4. Test a refund flow:

```bash
curl -X POST http://localhost:8090/support/chat \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "sess-001",
    "message": "I would like a refund for that order, the item arrived damaged."
  }'
```

5. Run the automated tests:

```bash
bal test
```

## Extend It

- **Add a WebSocket endpoint** for real-time chat instead of request-response.
- **Integrate a vector database** (e.g., Pinecone, Weaviate) for richer FAQ search.
- **Add multi-language support** by including a translation natural function.
- **Track analytics** by logging each conversation to a Kafka topic for downstream analysis.
- **Implement rate limiting** to prevent abuse of the LLM endpoint.

## Full Source Code

Find the complete working project on GitHub:
[wso2/integrator-samples/customer-support-agent](https://github.com/wso2/integrator-samples/tree/main/customer-support-agent)
