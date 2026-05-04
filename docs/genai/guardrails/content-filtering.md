---
title: Content Filtering
---

# Content Filtering

Content filtering prevents your AI integrations from generating or passing through harmful, inappropriate, or off-topic content. This is especially important for customer-facing agents where uncontrolled output can damage brand reputation or violate compliance requirements.

Content filters work alongside [input/output guardrails](inputoutput.md) but focus specifically on the semantic content of messages rather than structural validation.

## Built-In content filters

### Category-Based filtering

Block content across predefined categories.

```ballerina
import ballerinax/ai.guardrails;

final guardrails:ContentFilter contentFilter = new ({
    categories: {
        hate: {enabled: true, threshold: "low"},
        violence: {enabled: true, threshold: "medium"},
        sexual: {enabled: true, threshold: "low"},
        selfHarm: {enabled: true, threshold: "low"},
        dangerous: {enabled: true, threshold: "medium"}
    },
    action: "block"  // "block", "flag", or "redact"
});

final agent:ChatAgent safeAgent = check new (
    model: llmClient,
    systemPrompt: "You are a customer support assistant.",
    tools: [getOrderStatus],
    outputGuardrails: [contentFilter]
);
```

### Threshold levels

| Threshold | Description | Use Case |
|-----------|-------------|----------|
| `"low"` | Block most content in this category | Customer-facing, children's products |
| `"medium"` | Block clearly harmful content | General business applications |
| `"high"` | Block only extreme content | Internal tools, research applications |

## Topic filtering

Restrict the agent to specific topics and block off-topic conversations.

### Allowlist approach

```ballerina
final guardrails:ContentFilter topicFilter = new guardrails:TopicFilter({
    allowedTopics: [
        "order inquiries",
        "product information",
        "returns and refunds",
        "shipping and delivery",
        "account management"
    ],
    onOffTopic: {
        action: "redirect",
        message: "I can help you with orders, products, returns, shipping, and account questions. How can I assist you with one of these?"
    }
});
```

### Blocklist approach

```ballerina
final guardrails:ContentFilter blocklistFilter = new guardrails:TopicFilter({
    blockedTopics: [
        "competitor comparisons",
        "internal company policies",
        "employee information",
        "financial projections",
        "legal advice"
    ],
    onBlocked: {
        action: "redirect",
        message: "I'm not able to discuss that topic. Is there something else I can help you with?"
    }
});
```

## Language filtering

### Profanity filter

```ballerina
final guardrails:ContentFilter profanityFilter = new guardrails:ProfanityFilter({
    action: "redact",         // Replace with asterisks
    customBlocklist: ["offensive-term-1", "offensive-term-2"],
    applyTo: "both"          // "input", "output", or "both"
});
```

### Language detection

Restrict responses to supported languages.

```ballerina
final guardrails:ContentFilter languageFilter = new guardrails:LanguageFilter({
    allowedLanguages: ["en", "es", "fr"],
    onUnsupported: {
        action: "respond",
        message: "I currently support English, Spanish, and French. Please try again in one of these languages."
    }
});
```

## Custom content filters

Build domain-specific content filters for your industry or use case.

### Regex-Based filter

```ballerina
final guardrails:ContentFilter regexFilter = new guardrails:PatternFilter({
    patterns: [
        {
            name: "internal_urls",
            regex: "https?://internal[.-].*\\.company\\.com",
            action: "redact",
            replacement: "[internal link removed]"
        },
        {
            name: "api_keys",
            regex: "(sk|pk|api)[-_][a-zA-Z0-9]{20,}",
            action: "block"
        }
    ]
});
```

### LLM-Based content filter

Use an LLM to evaluate content quality and appropriateness.

```ballerina
final guardrails:ContentFilter llmFilter = new guardrails:LlmContentFilter({
    model: check new openai:Client({auth: {token: apiKey}, model: "gpt-4o-mini"}),
    evaluationPrompt: string `Evaluate the following AI response for a customer support context.
        Check for:
        1. Factual accuracy — does the response make claims without evidence?
        2. Appropriate tone — is it professional and empathetic?
        3. Completeness — does it address the customer's question?
        4. Safety — does it contain harmful or inappropriate content?

        Return a JSON object with: {safe: boolean, issues: string[]}`,
    blockOnUnsafe: true
});
```

## Applying multiple filters

Filters execute in sequence. The first filter to block stops the pipeline.

```ballerina
final agent:ChatAgent filteredAgent = check new (
    model: llmClient,
    systemPrompt: "You are a customer support assistant.",
    tools: [getOrderStatus, searchProducts],
    inputGuardrails: [
        profanityFilter,          // Block profane input
        topicFilter               // Block off-topic input
    ],
    outputGuardrails: [
        contentFilter,            // Block harmful output categories
        profanityFilter,          // Block profane output
        regexFilter               // Remove internal URLs and keys
    ]
);
```

## Filtering in Non-Agent contexts

Apply content filters to natural functions and direct LLM calls.

### Filtering natural function output

```ballerina
function safeClassify(string text) returns string|error {
    // Run the natural function
    string result = check classifySentiment(text);

    // Apply content filter to the output
    guardrails:FilterResult filterResult = check contentFilter.evaluate(result);
    if !filterResult.safe {
        return error("Content filter blocked the response: " +
            string:'join(", ", ...filterResult.issues));
    }
    return result;
}
```

### Middleware pattern

```ballerina
function filteredChat(agent:ChatAgent chatAgent, string message, string sessionId) returns string|error {
    // Filter input
    guardrails:FilterResult inputResult = check contentFilter.evaluate(message);
    if !inputResult.safe {
        return "I'm not able to process that request. Please rephrase your question.";
    }

    // Get agent response
    string response = check chatAgent.chat(message, sessionId);

    // Filter output
    guardrails:FilterResult outputResult = check contentFilter.evaluate(response);
    if !outputResult.safe {
        return "I apologize, but I'm unable to provide a response to that question. Can I help you with something else?";
    }

    return response;
}
```

## Monitoring filter activity

Track how often filters trigger for operational insight.

```ballerina
import ballerina/log;

function logFilterActivity(guardrails:FilterResult result, string direction) {
    if !result.safe {
        log:printWarn("Content filter triggered",
            direction = direction,
            issues = result.issues.toString(),
            category = result.triggeredCategory ?: "custom"
        );
    }
}
```

## What's next

- [Input/Output Guardrails](inputoutput.md) -- Structural validation for AI inputs and outputs
- [Token & Cost Management](token-cost-management.md) -- Control LLM usage and spending
- [AI Usage Guidelines](ai-usage-guidelines.md) -- Data handling and compliance policies
- [Responsible AI](responsible-ai.md) -- Ethical AI practices for integrations
