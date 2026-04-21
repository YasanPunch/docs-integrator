---
title: Actions
---

# Actions

The `ballerinax/ai.mistral` package exposes the following clients:

| Client | Purpose |
|--------|---------|
| [`Model Provider`](#model-provider) | Interacts with Mistral AI LLMs for chat completions and structured text generation. |

---

## Model provider

Interacts with Mistral AI LLMs for chat completions and structured text generation.

### Configuration

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `apiKey` | `string` | Required | The Mistral AI API key for authentication. |
| `modelType` | `MISTRAL_AI_MODEL_NAMES` | Required | The Mistral AI model to use (e.g., `MISTRAL_LARGE_LATEST`, `MINISTRAL_8B_2410`). |
| `serviceUrl` | `string` | `"https://api.mistral.ai/v1"` | The base URL of the Mistral AI API endpoint. |
| `maxTokens` | `int` | `512` | The upper limit for the number of tokens in the generated response. |
| `temperature` | `decimal` | `0.7` | Controls randomness in the model's output. Lower values produce more deterministic results. |
| `connectionConfig` | `ConnectionConfig` | `{}` | Additional HTTP connection configuration (HTTP version, timeout, retry, SSL, proxy, etc.). |

### Initializing the client

```ballerina
import ballerinax/ai.mistral;

configurable string apiKey = ?;

mistral:ModelProvider mistralClient = check new (
    apiKey = apiKey,
    modelType = mistral:MISTRAL_LARGE_LATEST
);
```

### Operations

#### Chat completion

<details>
<summary>chat</summary>

Sends chat messages to the Mistral AI model and returns an assistant response. Supports multi-turn conversations with system, user, assistant, and tool messages, as well as function/tool calling.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `messages` | `ai:ChatMessage[]\|ai:ChatUserMessage` | Yes | A list of chat messages forming the conversation history, or a single user message. |
| `tools` | `ai:ChatCompletionFunctions[]` | Yes | Tool/function definitions available for the model to call. Pass an empty array if no tools are needed. |
| `stop` | `string?` | No | A stop sequence to halt the completion. |

Returns: `ai:ChatAssistantMessage|ai:Error`

Sample code:

```ballerina
import ballerina/ai;

ai:ChatMessage[] messages = [
    {role: ai:USER, content: "What is the capital of France?"}
];

ai:ChatAssistantMessage response = check mistralClient->chat(messages, []);
```

Sample response:

```ballerina
{"role": "assistant", "content": "The capital of France is Paris."}
```

</details>

#### Structured generation

<details>
<summary>generate</summary>

Sends a prompt to the Mistral AI model and returns a type-safe structured response. The model output is automatically parsed into the specified Ballerina type — records, arrays, primitives, or union types.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `prompt` | `ai:Prompt` | Yes | The prompt to send to the model. Supports tagged template literals with embedded text documents, image documents, and file documents. |
| `td` | `typedesc<anydata>` | No | Type descriptor specifying the expected return type format. |

Returns: `td|ai:Error`

Sample code:

```ballerina
type Review record {|
    string title;
    int rating;
    string comment;
|};

Review result = check mistralClient->generate(`Rate this blog out of 10.
    Title: Intro to Ballerina
    Content: Ballerina is a cloud-native programming language.`);
```

Sample response:

```ballerina
{"title": "Intro to Ballerina", "rating": 8, "comment": "Well-structured introduction to a modern cloud-native language with clear examples."}
```

</details>

#### Chat with tool calling

<details>
<summary>chat (with tools)</summary>

Sends chat messages along with tool/function definitions. The model may respond with tool call requests instead of (or in addition to) text content, enabling agentic workflows.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `messages` | `ai:ChatMessage[]\|ai:ChatUserMessage` | Yes | A list of chat messages forming the conversation history. |
| `tools` | `ai:ChatCompletionFunctions[]` | Yes | Tool/function definitions the model can choose to call. |
| `stop` | `string?` | No | A stop sequence to halt the completion. |

Returns: `ai:ChatAssistantMessage|ai:Error`

Sample code:

```ballerina
import ballerina/ai;

ai:ChatCompletionFunctions[] tools = [
    {
        name: "get_weather",
        description: "Get current weather for a location",
        parameters: {
            "type": "object",
            "properties": {
                "location": {"type": "string", "description": "City name"}
            },
            "required": ["location"]
        }
    }
];

ai:ChatMessage[] messages = [
    {role: ai:USER, content: "What's the weather in Paris?"}
];

ai:ChatAssistantMessage response = check mistralClient->chat(messages, tools);
```

Sample response:

```ballerina
{"role": "assistant", "content": null, "toolCalls": [{"name": "get_weather", "arguments": {"location": "Paris"}, "id": "a1b2c3d4e"}]}
```

</details>

#### Multi-Modal generation

<details>
<summary>generate (with text document)</summary>

Generates a structured response from a prompt that includes embedded text documents for additional context.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `prompt` | `ai:Prompt` | Yes | A tagged template literal embedding `ai:TextDocument` values. |
| `td` | `typedesc<anydata>` | No | Type descriptor for the expected return type. |

Returns: `td|ai:Error`

Sample code:

```ballerina
import ballerina/ai;

ai:TextDocument blog = {
    content: "Title: Cloud Integration Content: Best practices for cloud-native integration."
};

int rating = check mistralClient->generate(`Rate this blog out of 10. ${blog}.`);
```

Sample response:

```ballerina
7
```

</details>

<details>
<summary>generate (with image document)</summary>

Generates a structured response from a prompt that includes an image document. Supports both URL-based and binary image content. Requires a vision-capable model such as Pixtral.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `prompt` | `ai:Prompt` | Yes | A tagged template literal embedding `ai:ImageDocument` values with URL or binary content. |
| `td` | `typedesc<anydata>` | No | Type descriptor for the expected return type. |

Returns: `td|ai:Error`

Sample code:

```ballerina
import ballerina/ai;

ai:ImageDocument img = {
    content: "https://example.com/chart.png",
    metadata: {
        mimeType: "image/png"
    }
};

string description = check mistralClient->generate(`Describe the following image. ${img}.`);
```

Sample response:

```ballerina
"A bar chart showing quarterly revenue growth from Q1 to Q4 2025, with Q4 reaching $12.5M."
```

</details>

<details>
<summary>generate (with file document)</summary>

Generates a structured response from a prompt that includes a file document (e.g., PDF). Currently supports URL-based file content only.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `prompt` | `ai:Prompt` | Yes | A tagged template literal embedding `ai:FileDocument` values with a URL. |
| `td` | `typedesc<anydata>` | No | Type descriptor for the expected return type. |

Returns: `td|ai:Error`

Sample code:

```ballerina
import ballerina/ai;

ai:FileDocument pdf = {
    content: "https://example.com/report.pdf",
    metadata: {
        fileName: "report.pdf"
    }
};

string summary = check mistralClient->generate(`Summarize the following PDF. ${pdf}.`);
```

Sample response:

```ballerina
"The report covers annual performance metrics across three departments, highlighting a 15% increase in overall productivity."
```

</details>
