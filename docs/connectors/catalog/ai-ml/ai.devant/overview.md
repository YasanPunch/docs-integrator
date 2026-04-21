# AI Devant Connector Overview

Devant by WSO2 is an AI-powered document processing service that enables intelligent chunking of binary documents such as PDFs into semantically meaningful segments. The Ballerina `ballerinax/ai.devant` connector (v1.0.2) provides a `Chunker` class that sends documents to the Devant API for chunking using configurable strategies, and a `BinaryDataLoader` utility for loading documents from the local file system — making it straightforward to build document ingestion pipelines for retrieval-augmented generation (RAG) and AI applications.

## Key features

- Binary document chunking via the Devant AI API — splits PDFs and other binary files into semantically meaningful `ai:Chunk` arrays
- Four configurable chunking strategies: `RECURSIVE`, `SENTENCE`, `PARAGRAPH`, and `CHARACTER`
- Tunable `maxChunkSize` and `maxOverlapSize` parameters for fine-grained control over chunk granularity and context overlap
- Local file and directory loading with `BinaryDataLoader` — load a single file or all first-level files in a directory as `ai:Document` objects
- Bearer token authentication for secure access to the Devant service endpoint
- Implements the `ballerina/ai` standard interfaces (`ai:Chunker`, `ai:DataLoader`) for seamless interoperability with the Ballerina AI ecosystem

## Actions

Actions are operations you invoke on Devant from your integration — loading binary documents from the file system and chunking them via the Devant AI service. The connector exposes two classes: `Chunker` for API-based document chunking, and `BinaryDataLoader` for local document loading.

| Client | Actions |
|--------|---------|
| `Chunker` | Document chunking via the Devant AI API using configurable chunking strategies |
| `Binary Data Loader` | Load binary documents from a local file path or directory |

See the **[Action Reference](action-reference.md)** for the full list of operations, parameters, and sample code for each client.

## Documentation

* **[Setup Guide](setup-guide.md)**: This guide walks you through creating a Devant project and obtaining the service URL and access token required to use the AI Devant connector.

* **[Action Reference](action-reference.md)**: Full reference for all clients — operations, parameters, return types, and sample code.

## How to contribute

As an open source project, WSO2 welcomes contributions from the community.

To contribute to the code for this connector, please create a pull request in the following repository.

* [AI Devant Connector GitHub repository](https://github.com/ballerina-platform/module-ballerinax-ai.devant)

Check the issue tracker for open issues that interest you. We look forward to receiving your contributions.
