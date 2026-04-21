# Ollama Connector Overview

Ollama is an open-source tool for running large language models locally. The Ballerina `ballerinax/ai.ollama` connector (v1.2.1) provides programmatic access to Ollama-hosted models through the `ballerina/ai` model provider interface, enabling chat completions and structured output generation within your Ballerina integration flows.

## Key features

- Chat completion with support for multi-turn conversations using `ai:ChatMessage` arrays
- Tool/function calling support — pass tool definitions and receive structured tool call responses
- Structured output generation via the `generate` method with Ballerina type inference
- Template literal support through `ai:Prompt` for embedding documents and context into prompts
- Fine-grained model parameter tuning including temperature, top-k, top-p, mirostat sampling, and context window size
- Configurable HTTP connection settings including timeouts, retry policies, circuit breaker, and proxy support

## Actions

Actions are operations you invoke on the Ollama model from your integration — sending chat messages and generating structured outputs. The Ollama connector exposes actions through a single client:

| Client | Actions |
|--------|---------|
| `Model Provider` | Chat completions, structured output generation, tool/function calling |

See the **[Action Reference](action-reference.md)** for the full list of operations, parameters, and sample code for each client.

## Documentation

* **[Setup Guide](setup-guide.md)**: This guide walks you through installing and running an Ollama server locally so the Ballerina connector can communicate with it.

* **[Action Reference](action-reference.md)**: Full reference for all clients — operations, parameters, return types, and sample code.

## How to contribute

As an open source project, WSO2 welcomes contributions from the community.

To contribute to the code for this connector, please create a pull request in the following repository.

* [Ollama Connector GitHub repository](https://github.com/ballerina-platform/module-ballerinax-ai.ollama)

Check the issue tracker for open issues that interest you. We look forward to receiving your contributions.
