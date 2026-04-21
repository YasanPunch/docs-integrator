# MongoDB Connector Overview

MongoDB is a document-oriented NoSQL database used for high-volume data storage and flexible schema design. The Ballerina `ballerinax/mongodb` connector (v5.2.3) provides programmatic access to MongoDB through a three-level client hierarchy (Client → Database → Collection), enabling you to perform CRUD operations, aggregation pipelines, and index management from your Ballerina integration flows.

## Key features

- Three-level client model (Client → Database → Collection) mirroring the MongoDB resource hierarchy
- Full CRUD operations on documents with typed record mapping via Ballerina's data binding
- Aggregation pipeline support including $match, $group, $lookup, $sort, $project, and more
- Index management — create, list, and drop indexes including unique, sparse, and TTL indexes
- Multiple authentication mechanisms: SCRAM-SHA-1, SCRAM-SHA-256, X.509, PLAIN, and GSSAPI (Kerberos)
- Connection string URI support for simple connectivity alongside structured connection parameters
- Streaming results for find, distinct, aggregate, and listIndexes operations
- GraalVM native image compatible

## Actions

Actions are operations you invoke on MongoDB from your integration — inserting documents, querying collections, running aggregation pipelines, and managing indexes. The MongoDB connector exposes actions across three client levels:

| Client | Actions |
|--------|---------|
| `Client` | Connection management, list databases, get database references |
| `Database` | Collection management, list collections, create and drop databases |
| `Collection` | Document CRUD, queries, aggregation, distinct values, index management |

See the **[Action Reference](action-reference.md)** for the full list of operations, parameters, and sample code for each client.

## Documentation

* **[Setup Guide](setup-guide.md)**: This guide walks you through setting up a MongoDB instance and obtaining the connection details required to use the MongoDB connector.

* **[Action Reference](action-reference.md)**: Full reference for all clients — operations, parameters, return types, and sample code.

## How to contribute

As an open source project, WSO2 welcomes contributions from the community.

To contribute to the code for this connector, please create a pull request in the following repository.

* [MongoDB Connector GitHub repository](https://github.com/ballerina-platform/module-ballerinax-mongodb)

Check the issue tracker for open issues that interest you. We look forward to receiving your contributions.
