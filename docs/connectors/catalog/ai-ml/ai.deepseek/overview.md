---
title: DeepSeek Connector Overview
---

# DeepSeek Connector Overview

DeepSeek is an AI company that provides powerful large language models for chat completion and reasoning tasks. The Ballerina `ballerinax/ai.deepseek` connector (v1.1.1) provides programmatic access to DeepSeek's LLM chat completion models, enabling you to integrate AI-powered chat and structured data generation into your Ballerina integration flows.

## Key features

- Chat completion using DeepSeek's LLM models with multi-turn conversation support
- Structured output generation that maps LLM responses directly to Ballerina types (records, arrays, primitives)
- Tool/function calling support for agentic workflows
- Support for both `deepseek-chat` and `deepseek-reasoner` models
- Tagged template literal prompts for safe and expressive prompt construction
- Implements the standard `ballerina/ai:ModelProvider` interface for interoperability with the Ballerina AI ecosystem
- GraalVM native image compatible for high-performance deployments

## Actions

Actions are operations you invoke on DeepSeek from your integration — sending chat messages, generating structured outputs, and using tool calls. The DeepSeek connector exposes actions through a single client:

| Client | Actions |
|--------|---------|
| `Model Provider` | Chat completion, structured generation, tool/function calling |

See the **[Action Reference](action-reference.md)** for the full list of operations, parameters, and sample code for each client.

## Documentation

* **[Setup Guide](setup-guide.md)**: This guide walks you through creating a DeepSeek account and obtaining the API key required to use the DeepSeek connector.

* **[Action Reference](action-reference.md)**: Full reference for all clients — operations, parameters, return types, and sample code.

## How to contribute

As an open source project, WSO2 welcomes contributions from the community.

To contribute to the code for this connector, please create a pull request in the following repository.

* [DeepSeek Connector GitHub repository](https://github.com/ballerina-platform/module-ballerinax-ai.deepseek)

Check the issue tracker for open issues that interest you. We look forward to receiving your contributions.
