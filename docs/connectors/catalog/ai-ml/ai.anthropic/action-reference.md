---
title: Actions
---

# Actions

The `ballerinax/ai.anthropic` package exposes the following clients:

| Client | Purpose |
|--------|---------|
| [`Model Provider`](#model-provider) | Provides chat completion and structured generation using Anthropic Claude models. |

---

## Model provider

Provides chat completion and structured generation using Anthropic Claude models.

### Configuration

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `apiKey` | `string` | Required | The Anthropic API key for authentication. |
| `modelType` | `ANTHROPIC_MODEL_NAMES` | Required | The Claude model to use (e.g., `CLAUDE_SONNET_4_5`, `CLAUDE_3_7_SONNET_20250219`). |
| `serviceUrl` | `string` | `https://api.anthropic.com/v1` | The base URL of the Anthropic API endpoint. |
| `maxTokens` | `int` | `512` | The upper limit for the number of tokens in the generated response. |
| `temperature` | `decimal` | `0.7` | Controls randomness in the model's output. Lower values produce more deterministic results. |
| `connectionConfig` | `ConnectionConfig` | `{}` | Additional HTTP connection configuration (HTTP version, timeout, retry, SSL, proxy, etc.). |

### Initializing the client

```ballerina
import ballerina/ai;
import ballerinax/ai.anthropic;

configurable string apiKey = ?;

final ai:ModelProvider anthropicModel = check new anthropic:ModelProvider(
    apiKey,
    anthropic:CLAUDE_SONNET_4_5
);
```

### Operations

#### Chat completion

<details>
<summary>chat</summary>

Sends a list of chat messages to the Anthropic model and returns an assistant response. Supports tool/function calling when tool definitions are provided.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `messages` | `ai:ChatMessage[]|ai:ChatUserMessage` | Yes | A list of chat messages (user, assistant, system, function) or a single user message. |
| `tools` | `ai:ChatCompletionFunctions[]` | No | Tool definitions available for the model to invoke. Defaults to `[]`. |
| `stop` | `string?` | No | A stop sequence that causes the model to stop generating. Defaults to `()`. |

Returns: `ai:ChatAssistantMessage|ai:Error`

Sample code:

```ballerina
ai:ChatMessage[] chatMessages = [
    {role: "user", content: "What is the capital of France?"}
];
ai:ChatAssistantMessage response = check anthropicModel->chat(chatMessages, tools = []);
```

Sample response:

```ballerina
{"role": "assistant", "content": "The capital of France is Paris.", "toolCalls": null}
```

</details>

#### Structured generation

<details>
<summary>generate</summary>

Sends a natural language prompt to the model and returns a typed Ballerina value matching the specified type descriptor. Uses tool-based extraction internally to produce structured output.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `prompt` | `ai:Prompt` | Yes | A tagged template literal prompt that can include text, image documents, file documents, and interpolated values. |
| `td` | `typedesc<anydata>` | No | Type descriptor specifying the expected return type (e.g., `int`, `string`, a record type, or an array type). Inferred from the call site. |

Returns: `td|ai:Error`

Sample code:

```ballerina
type Review record {|
    string title;
    int rating;
    string summary;
|};

Review result = check anthropicModel->generate(`Rate this blog out of 10.
    Title: "Ballerina for Integration"
    Content: "Ballerina is a cloud-native programming language..."`);
```

Sample response:

```ballerina
{"title": "Ballerina for Integration", "rating": 8, "summary": "A well-written introduction to Ballerina's integration capabilities."}
```

</details>
