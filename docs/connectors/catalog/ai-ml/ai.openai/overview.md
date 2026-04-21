# OpenAI (AI) Connector Overview

OpenAI is a leading AI research company that provides powerful large language models and embedding models through its API. The Ballerina `ballerinax/ai.openai` connector (v1.3.1) offers model provider and embedding provider interfaces for interacting with OpenAI's GPT and embedding model families, enabling chat completions, structured data generation, tool calling, and text embeddings from your Ballerina integration flows.

## Key features

- Chat completion using OpenAI GPT models via the Chat Completions API
- Structured data generation with type-safe `generate` method that returns Ballerina typed values from natural language prompts
- Tool/function calling support for agentic workflows and external system integration
- Multi-modal input support including text, images (URL and binary), and file/document content (PDF, etc.)
- Text embeddings via the Embeddings API with single-chunk and batch embedding support
- Comprehensive model coverage including GPT-4.1, GPT-4o, GPT-4 Turbo, GPT-3.5 Turbo, o1, and ChatGPT-4o families
- Configurable parameters for temperature, max tokens, and stop sequences
- Implements the standard `ai:ModelProvider` and `ai:EmbeddingProvider` interfaces for interoperability with the Ballerina AI module

## Actions

Actions are operations you invoke on OpenAI from your integration — sending chat messages, generating structured responses, using tool calls, and computing text embeddings. The OpenAI connector exposes actions through two clients:

| Client | Actions |
|--------|---------|
| `Model Provider` | Chat completions, structured generation, tool/function calling, multi-modal prompts |
| `Embedding Provider` | Single and batch text embeddings using OpenAI embedding models |

See the **[Action Reference](action-reference.md)** for the full list of operations, parameters, and sample code for each client.

## Documentation

* **[Setup Guide](setup-guide.md)**: This guide walks you through creating an OpenAI account and obtaining the API key required to use the OpenAI connector.

* **[Action Reference](action-reference.md)**: Full reference for all clients — operations, parameters, return types, and sample code.

## How to contribute

As an open source project, WSO2 welcomes contributions from the community.

To contribute to the code for this connector, please create a pull request in the following repository.

* [OpenAI (AI) Connector GitHub repository](https://github.com/ballerina-platform/module-ballerinax-ai.openai)

Check the issue tracker for open issues that interest you. We look forward to receiving your contributions.
