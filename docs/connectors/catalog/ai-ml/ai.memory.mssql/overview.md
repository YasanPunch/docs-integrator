# AI Memory MSSQL Connector Overview

The `ballerinax/ai.memory.mssql` connector provides a Microsoft SQL Server–backed short-term memory store for AI agent conversations. It implements the `ai:ShortTermMemoryStore` interface from the `ballerina/ai` module, enabling persistent, key-scoped storage and retrieval of chat messages (system, user, assistant, and function roles) with optional in-memory caching and configurable message-count limits.

## Key features

- MSSQL-backed persistence of chat messages across system, user, assistant, and function roles
- Implements the `ai:ShortTermMemoryStore` interface for seamless integration with Ballerina AI agents
- Key-scoped message storage allowing independent conversation histories per session or user
- Optional in-memory caching layer (`cache:CacheConfig`) to reduce database round-trips
- Configurable maximum interactive message count per key with `isFull` and `getCapacity` helpers
- Auto-creates the `ChatMessages` table on initialisation — no manual schema setup required
- Accepts either a pre-configured `mssql:Client` or a `DatabaseConfiguration` record for flexible connection setup
- Thread-safe (`isolated`) implementation suitable for concurrent Ballerina services

## Actions

Actions are operations you invoke on the MSSQL memory store from your integration — storing chat messages, retrieving conversation history, and managing message lifecycle. All operations are exposed on the `mssql:ShortTermMemoryStore` class.

| Client | Actions |
|--------|---------|
| `Short Term Memory Store` | Store, retrieve, and remove chat messages (system, interactive) keyed by session ID; capacity checks |

See the **[Action Reference](action-reference.md)** for the full list of operations, parameters, and sample code for each client.

## Documentation

* **[Setup Guide](setup-guide.md)**: This guide walks you through provisioning a Microsoft SQL Server instance and creating the database and login credentials required by the AI Memory MSSQL connector.

* **[Action Reference](action-reference.md)**: Full reference for all clients — operations, parameters, return types, and sample code.

## How to contribute

As an open source project, WSO2 welcomes contributions from the community.

To contribute to the code for this connector, please create a pull request in the following repository.

* [AI Memory MSSQL Connector GitHub repository](https://github.com/ballerina-platform/module-ballerinax-ai.memory.mssql)

Check the issue tracker for open issues that interest you. We look forward to receiving your contributions.
