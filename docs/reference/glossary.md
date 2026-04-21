---
title: Glossary
---

# Glossary

| Term | Definition |
|------|-----------|
| **any** | A Ballerina type that represents any value except `error`. Used when the specific type is not known at compile time. |
| **anydata** | A Ballerina type that represents any pure data value (no behavioral types). Includes `nil`, `boolean`, `int`, `float`, `decimal`, `string`, `xml`, and structured values composed of `anydata`. Fundamental for serialization. |
| **Automation** | A scheduled or manually triggered integration that runs without an external request. Defined using `task:Listener` or a `main()` function. |
| **Ballerina** | The cloud-native programming language powering WSO2 Integrator. Designed for network-distributed applications with built-in support for HTTP, data types, and concurrency. |
| **Ballerina Central** | The package registry at [central.ballerina.io](https://central.ballerina.io) where connectors and libraries are published and discovered. |
| **Ballerina.toml** | The package manifest file that declares metadata, dependencies, and build options for a Ballerina project. |
| **CDC** | Change Data Capture -- a pattern for streaming database changes (inserts, updates, deletes) in real time. Supported by MySQL, PostgreSQL, and MS SQL connectors. |
| **check** | A Ballerina keyword that propagates errors. If the expression evaluates to an error, the enclosing function returns it immediately. Eliminates the need for verbose try-catch blocks. |
| **Client** | A Ballerina object that provides remote method calls to external systems -- databases, APIs, message brokers. Created with the `new` keyword and typically stored as a module-level `final` variable. |
| **Cloud.toml** | Configuration file for cloud deployment settings including Docker image details, Kubernetes resource limits, autoscaling, and health probes. |
| **Config.toml** | Environment-specific runtime configuration file. Provides values for `configurable` variables. Should not be committed to version control when it contains secrets. |
| **configurable** | A Ballerina keyword that marks a variable as externally configurable via `Config.toml`, environment variables, or CLI arguments. Use `= ?` for required values with no default. |
| **Connector** | A pre-built `ballerinax` package for connecting to an external system (Salesforce, Kafka, MySQL, etc.). Handles authentication, serialization, and error mapping. |
| **Dependencies.toml** | Auto-generated lock file that records the exact resolved versions of all package dependencies. Should be committed to version control. |
| **Devant** | WSO2's managed integration platform as a service (iPaaS). Deploy integrations without managing infrastructure. |
| **distinct error** | A Ballerina error type with a unique identity, allowing pattern matching on specific error categories. Used to define application-specific error hierarchies. |
| **do/on fail** | Ballerina's error handling block. Code in `do` runs normally; `on fail` catches errors from `check` expressions within the block. Supports catching specific error types. |
| **Error** | A Ballerina basic type representing an error condition. Carries a message (`string`), optional cause (`error?`), and optional detail record. Errors are values, not exceptions. |
| **Event Handler** | A reactive integration triggered by messages from Kafka, RabbitMQ, NATS, MQTT, or other message brokers. Implemented as a service attached to a messaging listener. |
| **Flow Designer** | The visual drag-and-drop interface in the VS Code extension for building integration logic. Generates valid Ballerina code bidirectionally. |
| **ICP** | Integration Control Plane -- a dashboard for monitoring, managing, and troubleshooting running integrations in production. Provides metrics, logs, and artifact discovery. |
| **Integration** | The top-level unit of work in WSO2 Integrator. A Ballerina package containing one or more artifacts (services, automations, event handlers). |
| **json** | A Ballerina union type: `()\|boolean\|int\|float\|decimal\|string\|json[]\|map<json>`. Represents any value serializable to JSON format. |
| **Listener** | A Ballerina construct that binds to a network port or event source and dispatches incoming requests/messages to services. Examples: `http:Listener`, `kafka:Listener`, `task:Listener`. |
| **MCP** | Model Context Protocol -- an open standard that lets AI assistants discover and call integration functions as tools. |
| **Module** | A sub-unit of a Ballerina package. A package has a default module (root) and can contain multiple named modules under the `modules/` directory. |
| **Natural Function** | An LLM call treated as a typed function call in Ballerina. You define input/output types and the platform handles the prompt, API call, and response parsing. |
| **Package** | The unit of code distribution in Ballerina. Defined by `Ballerina.toml` and publishable to Ballerina Central. Contains one or more modules. |
| **Pro-code** | The Ballerina source code editing mode (as opposed to the visual designer). Full IDE support with auto-complete, type checking, and debugging. |
| **Query Expression** | Ballerina's SQL-like syntax for filtering, transforming, and aggregating data within code. Supports `from`, `where`, `let`, `select`, `order by`, `limit`, and `join` clauses. |
| **RAG** | Retrieval-Augmented Generation -- a pattern that combines document retrieval from a vector database with LLM generation for knowledge-grounded AI responses. |
| **Record** | A Ballerina structural type with named fields. The primary data structure for representing JSON-like data with compile-time type safety. Can be open (allows extra fields) or closed. |
| **Resource Function** | A function in a Ballerina service that maps to an HTTP method and path. Example: `resource function get customers()` handles `GET /customers`. |
| **Service** | A Ballerina construct that exposes endpoints over HTTP, GraphQL, gRPC, WebSocket, or TCP. The most common integration artifact in WSO2 Integrator. |
| **Strand** | Ballerina's lightweight execution unit (similar to a green thread or goroutine). Workers and async calls execute on strands managed by the Ballerina scheduler. |
| **Structural Typing** | Ballerina's type compatibility model. Types are compatible based on their structure (shape of values) rather than their declared names. |
| **Transaction** | A Ballerina language construct for coordinating atomic operations across multiple resources. Supports distributed transactions with automatic rollback on failure. |
| **Try It** | A built-in tool in the VS Code extension for sending test requests to running services and viewing responses inline. |
| **Union Type** | A Ballerina type that can hold values of multiple types. Written as `TypeA\|TypeB`. Used extensively for error handling (`string\|error`) and optional values (`T?` is `T\|()`). |
| **Visual Designer** | The low-code drag-and-drop UI in the VS Code extension. Shows integration logic as a flow diagram with bidirectional sync to Ballerina source code. |
| **Worker** | A Ballerina concurrency primitive. Workers execute code in parallel within a function and can communicate via message passing using the `->` and `<-` operators. |
| **xml** | A Ballerina built-in sequence type for XML data. Supports elements, text, comments, and processing instructions with XPath-like navigation syntax. |
