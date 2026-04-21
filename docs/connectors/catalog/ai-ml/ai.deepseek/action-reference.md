---
title: Actions
---

# Actions

The `ballerinax/ai.deepseek` package exposes the following clients:

| Client | Purpose |
|--------|---------|
| [`Model Provider`](#model-provider) | Provides chat completion and structured generation using DeepSeek LLM models. |

---

## Model provider

Provides chat completion and structured generation using DeepSeek LLM models.

### Configuration

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `apiKey` | `string` | Required | The DeepSeek API key for authentication. |
| `modelType` | `DEEPSEEK_MODEL_NAMES` | `DEEPSEEK_CHAT` | The DeepSeek model to use. Options: `DEEPSEEK_CHAT` (`"deepseek-chat"`), `DEEPSEEK_REASONER` (`"deepseek-reasoner"`). |
| `serviceUrl` | `string` | `"https://api.deepseek.com"` | The base URL of the DeepSeek API endpoint. |
| `maxTokens` | `int` | `512` | Upper limit for the number of tokens in the response. |
| `temperature` | `decimal` | `0.7` | Controls randomness in the model's output. Higher values produce more creative responses. |
| `connectionConfig` | `ConnectionConfig` | `{}` | Additional HTTP client configurations (timeout, retry, proxy, SSL, etc.). |

### Initializing the client

```ballerina
import ballerinax/ai.deepseek;

configurable string apiKey = ?;

deepseek:ModelProvider deepseekModel = check new (apiKey);
```

### Operations

#### Chat completion

<details>
<summary>chat</summary>

Generates a chat completion message from a DeepSeek model. Supports multi-turn conversations and tool/function calling.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `messages` | `ai:ChatMessage[]\|ai:ChatUserMessage` | Yes | A list of chat messages representing the conversation history, or a single user message. |
| `tools` | `ai:ChatCompletionFunctions[]` | Yes | Tool definitions available for the model to call. Pass an empty array if no tools are needed. |
| `stop` | `string?` | No | A stop sequence to halt the completion. |

Returns: `ai:ChatAssistantMessage|ai:Error`

Sample code:

```ballerina
import ballerina/ai;

ai:ChatMessage[] chatMessages = [
    {role: "user", content: "What is the capital of France?"}
];
ai:ChatAssistantMessage response = check deepseekModel->chat(chatMessages, tools = []);
```

Sample response:

```ballerina
{"role": "assistant", "content": "The capital of France is Paris."}
```

</details>

#### Structured generation

<details>
<summary>generate</summary>

Sends a prompt to the model and generates a value that conforms to the specified Ballerina type descriptor. Supports records, arrays, primitives, and other `anydata` types.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `prompt` | `ai:Prompt` | Yes | The prompt to send, constructed using a tagged template literal. |
| `td` | `typedesc<anydata>` | No | Type descriptor specifying the expected return type. Inferred from the assignment target if omitted. |

Returns: `td|ai:Error`

Sample code:

```ballerina
type Review record {|
    int rating;
    string comment;
|};

Review result = check deepseekModel->generate(`Please rate this blog out of 10.
    Title: Introduction to Ballerina
    Content: Ballerina is a cloud-native programming language...`);
```

Sample response:

```ballerina
{"rating": 8, "comment": "Well-structured introduction with clear examples. Could benefit from more advanced use cases."}
```

</details>
