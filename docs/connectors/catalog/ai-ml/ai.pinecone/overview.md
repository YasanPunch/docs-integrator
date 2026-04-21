# Pinecone Connector Overview

Pinecone is a fully managed vector database designed for high-performance similarity search in AI applications. The Ballerina `ballerinax/ai.pinecone` connector (v1.1.2) implements the `ai:VectorStore` interface and provides dense, sparse, and hybrid vector search modes, enabling you to store, query, and manage vector embeddings within your Ballerina integration flows.

## Key features

- Dense, sparse, and hybrid vector search modes for flexible similarity retrieval
- Vector upsert for adding or updating embeddings in a Pinecone index
- Similarity search with configurable topK (1–10,000) results
- Metadata filtering support for refined search queries
- Namespace isolation to organize and partition vectors within an index
- Batch vector deletion by document IDs
- Seamless integration with Ballerina's `ai:VectorStore` interface for AI-native workflows

## Actions

Actions are operations you invoke on Pinecone from your integration — adding vectors, querying for similarity matches, and deleting entries. The Pinecone connector exposes actions through a single client:

| Client | Actions |
|--------|---------|
| `Vector Store` | Vector upsert, similarity query, and deletion |

See the **[Action Reference](action-reference.md)** for the full list of operations, parameters, and sample code for each client.

## Documentation

* **[Setup Guide](setup-guide.md)**: This guide walks you through creating a Pinecone account, setting up an index, and obtaining the API key and service URL required to use the Pinecone connector.

* **[Action Reference](action-reference.md)**: Full reference for all clients — operations, parameters, return types, and sample code.

## How to contribute

As an open source project, WSO2 welcomes contributions from the community.

To contribute to the code for this connector, please create a pull request in the following repository.

* [Pinecone Connector GitHub repository](https://github.com/ballerina-platform/module-ballerinax-ai.pinecone)

Check the issue tracker for open issues that interest you. We look forward to receiving your contributions.
