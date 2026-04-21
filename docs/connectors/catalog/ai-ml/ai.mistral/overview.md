# Mistral AI Connector Overview

Mistral AI is a leading provider of high-performance large language models for chat completion and text generation tasks. The Ballerina `ballerinax/ai.mistral` connector (v1.2.1) provides seamless integration with Mistral AI models through its Chat Completions API, enabling you to incorporate powerful language generation, structured output, and tool-calling capabilities into your Ballerina integration flows.

## Key features

- Chat completions with support for multi-turn conversations using system, user, assistant, and tool messages
- Structured output generation with automatic type-safe parsing into Ballerina record types, arrays, and primitives
- Function/tool calling support for building agentic workflows with automatic tool definition marshalling
- Multi-modal input support including text documents, image documents (URL and binary), and file documents
- Access to 30+ Mistral AI models including Mistral Large, Mistral Small, Codestral, Pixtral, Ministral, and Devstral families
- Configurable temperature and max token limits for fine-grained control over model output
- Secure API key authentication with full HTTP/2 support and connection pooling
- GraalVM native image compatibility for high-performance deployments

## Actions

Actions are operations you invoke on Mistral AI from your integration — generating chat completions, producing structured outputs, and executing tool calls. The Mistral AI connector exposes actions through a single client:

| Client | Actions |
|--------|---------|
| `Model Provider` | Chat completions, structured generation, tool/function calling, multi-modal prompts |

See the **[Action Reference](action-reference.md)** for the full list of operations, parameters, and sample code for each client.

## Documentation

* **[Setup Guide](setup-guide.md)**: This guide walks you through creating a Mistral AI account and obtaining the API key required to use the Mistral AI connector.

* **[Action Reference](action-reference.md)**: Full reference for all clients — operations, parameters, return types, and sample code.

## How to contribute

As an open source project, WSO2 welcomes contributions from the community.

To contribute to the code for this connector, please create a pull request in the following repository.

* [Mistral AI Connector GitHub repository](https://github.com/ballerina-platform/module-ballerinax-ai.mistral)

Check the issue tracker for open issues that interest you. We look forward to receiving your contributions.
