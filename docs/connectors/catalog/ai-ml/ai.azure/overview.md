---
title: Azure OpenAI Connector Overview
---

# Azure OpenAI Connector Overview

Azure OpenAI provides access to OpenAI's powerful language and embedding models hosted on Microsoft Azure. The Ballerina `ballerinax/ai.azure` connector (v1.4.1) offers a model provider for chat completions, an embedding provider for vector generation, and an Azure AI Search knowledge base for document ingestion and retrieval — enabling you to build AI-powered integration flows in Ballerina.

## Key features

- Chat completion using Azure-hosted OpenAI language models via the Chat Completions API
- Structured data generation with type-safe `generate` method that returns Ballerina typed values from natural language prompts
- Tool/function calling support for agentic workflows and external system integration
- Text embedding generation for single chunks and batch operations via Azure OpenAI Embeddings API
- Azure AI Search knowledge base with document ingestion, vector retrieval, and metadata filtering
- Automatic document chunking with configurable strategies (auto, manual, or disabled)
- Implements standard `ai:ModelProvider`, `ai:EmbeddingProvider`, and `ai:KnowledgeBase` interfaces for interoperability with the Ballerina AI module

## Actions

Actions are operations you invoke on Azure OpenAI from your integration — sending chat messages, generating embeddings, ingesting documents, and querying a knowledge base. The connector exposes actions through three clients:

| Client | Actions |
|--------|---------|
| `OpenAI Model Provider` | Chat completions, structured generation, tool/function calling |
| `Embedding Provider` | Single and batch text embedding generation |
| `AI Search Knowledge Base` | Document ingestion, vector retrieval, metadata-filtered search, deletion |

See the **[Action Reference](action-reference.md)** for the full list of operations, parameters, and sample code for each client.

## Documentation

* **[Setup Guide](setup-guide.md)**: This guide walks you through setting up Azure OpenAI Service and Azure AI Search resources and obtaining the credentials required to use the Azure OpenAI connector.

* **[Action Reference](action-reference.md)**: Full reference for all clients — operations, parameters, return types, and sample code.

## How to contribute

As an open source project, WSO2 welcomes contributions from the community.

To contribute to the code for this connector, please create a pull request in the following repository.

* [Azure OpenAI Connector GitHub repository](https://github.com/ballerina-platform/module-ballerinax-ai.azure)

Check the issue tracker for open issues that interest you. We look forward to receiving your contributions.
