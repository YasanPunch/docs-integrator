# Azure AI Search Index Connector Overview

Azure AI Search (formerly Azure Cognitive Search) is a cloud search service from Microsoft that provides AI-powered indexing and querying over your content. The Ballerina `ballerinax/azure.ai.search.index` connector (v1.0.1) enables programmatic access to Azure AI Search index operations — searching, retrieving, indexing, autocompleting, and suggesting documents — allowing you to integrate intelligent search into your Ballerina integration flows.

## Key features

- Full-text search with simple and full Lucene query syntax
- Semantic search and vector search support for AI-powered relevance ranking
- Document CRUD via batch indexing (upload, merge, mergeOrUpload, delete)
- Autocomplete and suggestions for type-ahead search experiences
- Faceted navigation, filtering, and scoring profiles for advanced query refinement
- Document lookup by key for direct retrieval
- Document count retrieval for index statistics

## Actions

Actions are operations you invoke on Azure AI Search from your integration — searching documents, indexing content, retrieving suggestions, and more. The connector exposes actions through a single client:

| Client | Actions |
|--------|---------|
| `Client` | Document search, lookup, indexing, autocomplete, suggestions, count |

See the **[Action Reference](action-reference.md)** for the full list of operations, parameters, and sample code for each client.

## Documentation

* **[Setup Guide](setup-guide.md)**: This guide walks you through creating an Azure AI Search service and obtaining the API key and endpoint URL required to use the connector.

* **[Action Reference](action-reference.md)**: Full reference for all clients — operations, parameters, return types, and sample code.

## How to contribute

As an open source project, WSO2 welcomes contributions from the community.

To contribute to the code for this connector, please create a pull request in the following repository.

* [Azure AI Search Index Connector GitHub repository](https://github.com/ballerina-platform/module-ballerinax-azure.ai.search.index)

Check the issue tracker for open issues that interest you. We look forward to receiving your contributions.
