# Weaviate Connector Overview

Weaviate is an open-source vector database that enables storage of data objects alongside vector embeddings from machine learning models for high-performance semantic search. The Ballerina `ballerinax/ai.weaviate` connector (v1.0.2) implements the `ai:VectorStore` interface, providing seamless interaction with Weaviate instances for vector storage, similarity search with metadata filtering, and data management operations.

## Key features

- Implements the standard `ai:VectorStore` interface for consistent vector database interactions
- Add vector entries with embeddings, content chunks, and custom metadata to Weaviate collections
- Perform vector similarity searches with configurable top-K results and certainty scoring
- Filter query results using metadata conditions with support for comparison and logical operators
- Delete vector entries by single ID or batch with transactional integrity
- Secure communication via API key authentication and configurable SSL/TLS settings
- GraalVM native image compatibility for cloud-native deployments

## Actions

Actions are operations you invoke on Weaviate from your integration — adding vector entries, performing similarity searches, and deleting data. The connector exposes a single client:

| Client | Actions |
|--------|---------|
| `Vector Store` | Vector entry storage, similarity search with metadata filtering, entry deletion |

See the **[Action Reference](action-reference.md)** for the full list of operations, parameters, and sample code for each client.

## Documentation

* **[Setup Guide](setup-guide.md)**: This guide walks you through creating a Weaviate Cloud account, setting up a cluster, and obtaining the API key and service URL required to use the Weaviate connector.

* **[Action Reference](action-reference.md)**: Full reference for all clients — operations, parameters, return types, and sample code.

## How to contribute

As an open source project, WSO2 welcomes contributions from the community.

To contribute to the code for this connector, please create a pull request in the following repository.

* [Weaviate Connector GitHub repository](https://github.com/ballerina-platform/module-ballerinax-ai.weaviate)

Check the issue tracker for open issues that interest you. We look forward to receiving your contributions.
