# pgvector Connector Overview

pgvector is a PostgreSQL extension that adds support for vector similarity search, enabling storage and retrieval of high-dimensional embeddings alongside relational data. The Ballerina `ballerinax/ai.pgvector` connector (v1.0.3) provides a `VectorStore` client that implements the `ai:VectorStore` interface, allowing you to add, query, and delete vector entries in a PostgreSQL database with pgvector installed.

## Key features

- Store dense, sparse, and hybrid vector embeddings in PostgreSQL with pgvector
- Similarity search using cosine, Euclidean, or Manhattan distance metrics
- Automatic table and HNSW index creation on initialization
- Metadata filtering on queries with composable AND/OR filter conditions
- Configurable vector dimensions and embedding types (dense, sparse, hybrid)
- Bulk insertion of vector entries with associated content chunks and metadata
- Delete entries by single ID or batch of IDs

## Actions

Actions are operations you invoke on PostgreSQL with pgvector from your integration — adding vector entries, querying for similar vectors, and deleting entries. The pgvector connector exposes actions through a single client:

| Client | Actions |
|--------|---------|
| `Vector Store` | Add, query, and delete vector embeddings with similarity search |

See the **[Action Reference](action-reference.md)** for the full list of operations, parameters, and sample code for each client.

## Documentation

* **[Setup Guide](setup-guide.md)**: This guide walks you through setting up a PostgreSQL instance with the pgvector extension required to use the pgvector connector.

* **[Action Reference](action-reference.md)**: Full reference for all clients — operations, parameters, return types, and sample code.

## How to contribute

As an open source project, WSO2 welcomes contributions from the community.

To contribute to the code for this connector, please create a pull request in the following repository.

* [pgvector Connector GitHub repository](https://github.com/ballerina-platform/module-ballerinax-ai.pgvector)

Check the issue tracker for open issues that interest you. We look forward to receiving your contributions.
