---
title: Actions
---

# Actions

The `ballerinax/ai.ollama` package exposes the following clients:

| Client | Purpose |
|--------|---------|
| [`Model Provider`](#model-provider) | Connects to an Ollama server to perform chat completions and structured output generation. |

---

## Model provider

Connects to an Ollama server to perform chat completions and structured output generation.

### Configuration

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `httpVersion` | `http:HttpVersion` | `HTTP_2_0` | HTTP protocol version to use for the connection. |
| `timeout` | `decimal` | `60` | Request timeout in seconds. |
| `retryConfig` | `http:RetryConfig` | `()` | Retry configuration for failed requests. |
| `circuitBreaker` | `http:CircuitBreakerConfig` | `()` | Circuit breaker configuration for fault tolerance. |
| `secureSocket` | `http:ClientSecureSocket` | `()` | SSL/TLS configuration for secure connections. |
| `proxy` | `http:ProxyConfig` | `()` | Proxy server configuration. |
| `poolConfig` | `http:PoolConfiguration` | `()` | Connection pool configuration. |
| `compression` | `http:Compression` | `COMPRESSION_AUTO` | Compression setting for HTTP requests. |
| `cache` | `http:CacheConfig` | `()` | HTTP response cache configuration. |
| `validation` | `boolean` | `true` | Enable or disable payload validation. |

### Initializing the client

```ballerina
import ballerinax/ai.ollama;

final ollama:ModelProvider ollamaModel = check new (
    "llama2",
    serviceUrl = "http://localhost:11434"
);
```

### Operations

#### Chat completion

<details>
<summary>chat</summary>

Sends a chat conversation to the Ollama model and returns the assistant's response. Supports multi-turn conversations and tool/function calling.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `messages` | `ai:ChatMessage[]\|ai:ChatUserMessage` | Yes | The conversation history as an array of chat messages, or a single user message. |
| `tools` | `ai:ChatCompletionFunctions[]` | No | Tool/function definitions the model can call. Defaults to `[]`. |
| `stop` | `string?` | No | A stop sequence that causes the model to stop generating. Defaults to `()`. |

Returns: `ai:ChatAssistantMessage|ai:Error`

Sample code:

```ballerina
ai:ChatMessage[] chatMessages = [
    {role: "user", content: "What is the capital of France?"}
];
ai:ChatAssistantMessage response = check ollamaModel->chat(chatMessages);
```

Sample response:

```ballerina
{"role": "assistant", "content": "The capital of France is Paris."}
```

</details>

#### Structured output generation

<details>
<summary>generate</summary>

Generates a structured output from a prompt using Ballerina type inference. The model output is automatically parsed into the specified Ballerina type.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `prompt` | `ai:Prompt` | Yes | A template literal prompt that can embed documents and context using tagged templates. |
| `td` | `typedesc<anydata>` | No | The expected return type descriptor. Inferred from the assignment target type. |

Returns: `td|ai:Error`

Sample code:

```ballerina
int rating = check ollamaModel->generate(`Rate the movie "Inception" out of 10.`);
```

Sample response:

```ballerina
8
```

</details>
