---
title: Anthropic LLM Connector Overview
---

# Anthropic LLM Connector Overview

Anthropic is an AI safety company that builds reliable, steerable AI systems. The Ballerina `ballerinax/ai.anthropic` connector (v1.3.1) provides a model provider interface for interacting with Anthropic's Claude family of large language models, enabling chat completions and structured data generation from your Ballerina integration flows.

## Key features

- Chat completion using Anthropic's Claude LLM models via the Messages API
- Structured data generation with type-safe `generate` method that returns Ballerina typed values from natural language prompts
- Tool/function calling support for agentic workflows and external system integration
- Multi-modal input support including text, images (URL and binary), and file/document content (PDF, etc.)
- Comprehensive model coverage including Claude 4.6, 4.5, 4, 3.7, 3.5, and 3 model families
- Configurable parameters for temperature, max tokens, and stop sequences
- Implements the standard `ai:ModelProvider` interface for interoperability with the Ballerina AI module

## Actions

Actions are operations you invoke on the Anthropic model provider from your integration — sending chat messages, generating structured responses, and using tool calls. The connector exposes a single client:

| Client | Actions |
|--------|---------|
| `Model Provider` | Chat completions, structured generation, tool/function calling |

See the **[Action Reference](action-reference.md)** for the full list of operations, parameters, and sample code for each client.

## Documentation

* **[Setup Guide](setup-guide.md)**: This guide walks you through creating an Anthropic account and obtaining the API key required to use the Anthropic LLM connector.

* **[Action Reference](action-reference.md)**: Full reference for all clients — operations, parameters, return types, and sample code.

## How to contribute

As an open source project, WSO2 welcomes contributions from the community.

To contribute to the code for this connector, please create a pull request in the following repository.

* [Anthropic LLM Connector GitHub repository](https://github.com/ballerina-platform/module-ballerinax-ai.anthropic)

Check the issue tracker for open issues that interest you. We look forward to receiving your contributions.
