---
title: Actions
---

# Actions

The `ballerinax/ai.openai` package exposes the following clients:

| Client | Purpose |
|--------|---------|
| [`Model Provider`](#model-provider) | Provides chat completion and structured generation using OpenAI GPT models. |
| [`Embedding Provider`](#embedding-provider) | Generates text embeddings using OpenAI embedding models for semantic search, clustering, and similarity tasks. |

---

## Model provider

Provides chat completion and structured generation using OpenAI GPT models.

### Configuration

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `apiKey` | `string` | Required | The OpenAI API key for authentication. |
| `modelType` | `OPEN_AI_MODEL_NAMES` | Required | The OpenAI model to use (e.g., `GPT_4O`, `GPT_4_1`, `O1`). |
| `serviceUrl` | `string` | `https://api.openai.com/v1` | The base URL of the OpenAI API endpoint. |
| `maxTokens` | `int` | `512` | The upper limit for the number of tokens in the generated response. |
| `temperature` | `decimal` | `0.7` | Controls randomness in the model's output. Lower values produce more deterministic results. |
| `connectionConfig` | `ConnectionConfig` | `{}` | Additional HTTP connection configuration (HTTP version, timeout, retry, SSL, proxy, etc.). |

### Initializing the client

```ballerina
import ballerina/ai;
import ballerinax/ai.openai;

configurable string apiKey = ?;

final ai:ModelProvider openaiModel = check new openai:ModelProvider(
    apiKey,
    openai:GPT_4O
);
```

### Operations

#### Chat completion

<details>
<summary>chat</summary>

Sends a list of chat messages to the OpenAI model and returns an assistant response. Supports tool/function calling when tool definitions are provided.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `messages` | `ai:ChatMessage[]\|ai:ChatUserMessage` | Yes | A list of chat messages (user, assistant, system, function) or a single user message. |
| `tools` | `ai:ChatCompletionFunctions[]` | Yes | Tool definitions available for the model to invoke. Pass an empty array if no tools are needed. |
| `stop` | `string?` | No | A stop sequence that causes the model to stop generating. Defaults to `()`. |

Returns: `ai:ChatAssistantMessage|ai:Error`

Sample code:

```ballerina
import ballerina/ai;

ai:ChatMessage[] messages = [
    {role: ai:USER, content: "What is the capital of France?"}
];

ai:ChatAssistantMessage response = check openaiModel->chat(messages, []);
```

Sample response:

```ballerina
{"role": "assistant", "content": "The capital of France is Paris."}
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

Review result = check openaiModel->generate(`Rate this blog out of 10.
    Title: "Ballerina for Integration"
    Content: "Ballerina is a cloud-native programming language..."`);
```

Sample response:

```ballerina
{"title": "Ballerina for Integration", "rating": 8, "summary": "A well-written introduction to Ballerina's integration capabilities."}
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
    {role: ai:USER, content: "What's the weather in San Francisco?"}
];

ai:ChatAssistantMessage response = check openaiModel->chat(messages, tools);
```

Sample response:

```ballerina
{"role": "assistant", "content": null, "toolCalls": [{"name": "get_weather", "arguments": {"location": "San Francisco"}, "id": "call_abc123"}]}
```

</details>

#### Multi-Modal generation

<details>
<summary>generate (with image document)</summary>

Generates a structured response from a prompt that includes an image document. Supports both URL-based and binary image content. Requires a vision-capable model such as GPT-4o.

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

string description = check openaiModel->generate(`Describe the following image. ${img}.`);
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

string summary = check openaiModel->generate(`Summarize the following PDF. ${pdf}.`);
```

Sample response:

```ballerina
"The report covers annual performance metrics across three departments, highlighting a 15% increase in overall productivity."
```

</details>

---

## Embedding provider

Generates text embeddings using OpenAI embedding models for semantic search, clustering, and similarity tasks.

### Configuration

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `apiKey` | `string` | Required | The OpenAI API key for authentication. |
| `modelType` | `OPEN_AI_EMBEDDING_MODEL_NAMES` | Required | The OpenAI embedding model to use (e.g., `TEXT_EMBEDDING_3_SMALL`, `TEXT_EMBEDDING_3_LARGE`, `TEXT_EMBEDDING_ADA_002`). |
| `serviceUrl` | `string` | `https://api.openai.com/v1` | The base URL of the OpenAI API endpoint. |
| `connectionConfig` | `ConnectionConfig` | `{}` | Additional HTTP connection configuration (HTTP version, timeout, retry, SSL, proxy, etc.). |

### Initializing the client

```ballerina
import ballerina/ai;
import ballerinax/ai.openai;

configurable string apiKey = ?;

final ai:EmbeddingProvider openaiEmbeddings = check new openai:EmbeddingProvider(
    apiKey,
    openai:TEXT_EMBEDDING_3_SMALL
);
```

### Operations

#### Embedding operations

<details>
<summary>embed</summary>

Generates an embedding vector for a single text chunk using the configured OpenAI embedding model.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `chunk` | `ai:Chunk` | Yes | A text chunk to embed. Contains the text content and optional metadata. |

Returns: `ai:Embedding|ai:Error`

Sample code:

```ballerina
import ballerina/ai;

ai:Chunk chunk = {
    text: "Ballerina is a cloud-native programming language for integration."
};

ai:Embedding embedding = check openaiEmbeddings->embed(chunk);
```

Sample response:

```ballerina
{"index": 0, "vector": [0.0023064255, -0.009327292, 0.015797347, -0.0077816844, ...], "chunk": {"text": "Ballerina is a cloud-native programming language for integration."}}
```

</details>

<details>
<summary>batchEmbed</summary>

Generates embedding vectors for multiple text chunks in a single API call for efficient batch processing.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `chunks` | `ai:Chunk[]` | Yes | An array of text chunks to embed. |

Returns: `ai:Embedding[]|ai:Error`

Sample code:

```ballerina
import ballerina/ai;

ai:Chunk[] chunks = [
    {text: "Ballerina is a cloud-native programming language."},
    {text: "OpenAI provides powerful language models."},
    {text: "Embeddings are useful for semantic search."}
];

ai:Embedding[] embeddings = check openaiEmbeddings->batchEmbed(chunks);
```

Sample response:

```ballerina
[{"index": 0, "vector": [0.0023064255, -0.009327292, ...], "chunk": {"text": "Ballerina is a cloud-native programming language."}}, {"index": 1, "vector": [0.0012548763, -0.007463821, ...], "chunk": {"text": "OpenAI provides powerful language models."}}, {"index": 2, "vector": [0.0045127893, -0.011284756, ...], "chunk": {"text": "Embeddings are useful for semantic search."}}]
```

</details>
