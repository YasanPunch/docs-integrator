---
title: Standard Library Overview
---

# Standard Library Overview

The Ballerina standard library is a collection of packages under the `ballerina/*` and `ballerinax/*` namespaces. These packages provide network protocols, data formats, security, I/O, and utility functions used throughout WSO2 Integrator projects.

Import a standard library package with:

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/mysql;
```

## Language Library (`ballerina/lang.*`)

Built-in functions and methods for Ballerina's core types. These are automatically available and do not require explicit imports.

| Package | Description |
|---------|-------------|
| `lang.array` | Array operations: `push`, `pop`, `sort`, `filter`, `map`, `reduce`, `indexOf`, `slice`, `reverse` |
| `lang.boolean` | Boolean utilities: `fromString` parsing |
| `lang.decimal` | Decimal operations: `abs`, `round`, `floor`, `ceiling`, `fromString`, `sum`, `min`, `max` |
| `lang.error` | Error type utilities: `message`, `cause`, `detail`, `stackTrace` |
| `lang.float` | Floating-point operations: `abs`, `round`, `floor`, `ceiling`, `sqrt`, `pow`, `isNaN`, `isInfinite` |
| `lang.function` | Function type support: `call` |
| `lang.future` | Asynchronous computation: `cancel` |
| `lang.int` | Integer operations: `abs`, `sum`, `min`, `max`, `fromString`, `toHexString`, `fromHexString` |
| `lang.map` | Map operations: `get`, `keys`, `hasKey`, `entries`, `filter`, `map`, `reduce`, `toArray`, `remove` |
| `lang.object` | Object type support |
| `lang.query` | Query expression support: `createPipeline`, `addStreamFunction` |
| `lang.regexp` | Regular expressions: `find`, `findAll`, `isFullMatch`, `replace`, `replaceAll`, `split` |
| `lang.runtime` | Runtime utilities: `sleep`, `registerListener`, `deregisterListener`, `getStackTrace` |
| `lang.stream` | Stream operations: `next`, `close`, `filter`, `map`, `reduce`, `iterator` |
| `lang.string` | String operations: `length`, `substring`, `indexOf`, `trim`, `toLowerAscii`, `toUpperAscii`, `split`, `join`, `startsWith`, `endsWith`, `includes`, `replace`, `toBytes`, `fromBytes` |
| `lang.table` | Table operations: `add`, `get`, `put`, `remove`, `keys`, `filter`, `map`, `reduce`, `toArray` |
| `lang.transaction` | Transaction management: `info`, `onCommit`, `onRollback`, `setRollbackOnly` |
| `lang.typedesc` | Type descriptor utilities |
| `lang.value` | Value operations: `toJson`, `toJsonString`, `fromJsonString`, `toBalString`, `clone`, `cloneReadOnly`, `ensureType`, `mergeJson` |
| `lang.xml` | XML operations: `length`, `get`, `children`, `elements`, `filter`, `map`, `text`, `getName`, `setName`, `getAttributes` |

## Network Protocols

### HTTP (`ballerina/http`)

HTTP/1.1 and HTTP/2 client and server support with request/response handling, content negotiation, SSL/TLS, and resilience patterns (retry, circuit breaker, load balancing).

### WebSocket (`ballerina/websocket`)

Full-duplex WebSocket client and server for real-time bidirectional communication.

### GraphQL (`ballerina/graphql`)

GraphQL server implementation with schema-first and code-first approaches, subscriptions, and federation support.

### gRPC (`ballerina/grpc`)

Protocol Buffers-based gRPC client and server with unary, server streaming, client streaming, and bidirectional streaming support.

### TCP (`ballerina/tcp`)

Low-level TCP socket client and server for custom protocol implementations.

### UDP (`ballerina/udp`)

UDP datagram client and server for connectionless network communication.

### Email (`ballerina/email`)

SMTP client for sending emails and POP3/IMAP clients for receiving emails.

### FTP (`ballerina/ftp`)

FTP and SFTP client for file transfer operations: upload, download, list, delete, rename.

### WebSub (`ballerina/websub`)

WebSub subscriber implementation for the W3C WebSub protocol (publish-subscribe over HTTP).

### WebSub Hub (`ballerina/websubhub`)

WebSub hub implementation for managing topic subscriptions and content distribution.

## Messaging and Event Streaming

Available as extended library packages (`ballerinax/*`):

| Package | Description |
|---------|-------------|
| `ballerinax/kafka` | Apache Kafka producer and consumer |
| `ballerinax/rabbitmq` | RabbitMQ client for AMQP messaging |
| `ballerinax/nats` | NATS client for lightweight messaging |
| `ballerinax/mqtt` | MQTT v3.1.1 and v5 client for IoT messaging |
| `ballerinax/java.jms` | JMS client for Java Message Service brokers |

## Data Access

### SQL (`ballerina/sql`)

Common SQL abstractions: `Client`, `ParameterizedQuery`, `ExecutionResult`, and typed result mapping.

### Database Connectors (`ballerinax/*`)

| Package | Description |
|---------|-------------|
| `ballerinax/mysql` | MySQL and MariaDB connector |
| `ballerinax/postgresql` | PostgreSQL connector |
| `ballerinax/mssql` | Microsoft SQL Server connector |
| `ballerinax/oracledb` | Oracle Database connector |
| `ballerinax/mongodb` | MongoDB connector |
| `ballerinax/redis` | Redis connector |

## Data Formats

| Package | Description |
|---------|-------------|
| `ballerina/io` | File and stream I/O: read/write strings, bytes, CSV, JSON, XML |
| `ballerina/mime` | MIME type handling and multipart message construction |
| `ballerina/data.jsondata` | JSON data binding: `parseString`, `parseBytes`, `parseStream`, `toJson` |
| `ballerina/data.xmldata` | XML data binding: `parseString`, `parseBytes`, `toXml`, `fromXml` |
| `ballerina/data.csv` | CSV parsing and generation |
| `ballerina/data.yaml` | YAML parsing and generation |
| `ballerina/xmldata` | XML-to-record and record-to-XML conversion |
| `ballerina/xslt` | XSLT 1.0 transformations |
| `ballerina/toml` | TOML parsing and generation |
| `ballerina/yaml` | YAML parsing and generation |

## Security

| Package | Description |
|---------|-------------|
| `ballerina/auth` | Basic authentication and credential handling |
| `ballerina/jwt` | JSON Web Token (JWT) issuing, validation, and parsing |
| `ballerina/oauth2` | OAuth 2.0 client credentials, authorization code, and token refresh flows |
| `ballerina/crypto` | Cryptographic operations: hashing (SHA, MD5), HMAC, encryption (AES, RSA), digital signatures, key management |

## Observability

| Package | Description |
|---------|-------------|
| `ballerina/log` | Structured logging with configurable levels: `DEBUG`, `INFO`, `WARN`, `ERROR` |
| `ballerina/observe` | Metrics and distributed tracing APIs compatible with Prometheus and Jaeger |

## Utility Packages

| Package | Description |
|---------|-------------|
| `ballerina/cache` | In-memory LRU cache with TTL-based eviction |
| `ballerina/task` | Scheduled task execution: interval-based and cron-based triggers |
| `ballerina/time` | Time and date operations: `Utc`, `Civil`, `Duration`, timezone handling, formatting, parsing |
| `ballerina/file` | File system operations: create, delete, rename, copy, list, watch for changes |
| `ballerina/os` | Operating system interaction: environment variables, user info, process execution |
| `ballerina/url` | URL encoding and decoding |
| `ballerina/uuid` | UUID generation (v1, v3, v4, v5) and validation |
| `ballerina/regex` | Regular expression matching, replacement, and splitting |
| `ballerina/test` | Test framework: assertions, mocking, test groups, data providers, setup/teardown |
| `ballerina/cloud` | Annotations for cloud deployment artifact generation |

## AI

| Package | Description |
|---------|-------------|
| `ballerina/ai` | AI agent framework and LLM integration utilities |

## SaaS and Enterprise Connectors (`ballerinax/*`)

Ballerina Central hosts a large collection of connectors for enterprise systems. Some commonly used ones include:

| Package | Description |
|---------|-------------|
| `ballerinax/salesforce` | Salesforce CRM operations |
| `ballerinax/github` | GitHub API |
| `ballerinax/googleapis.sheets` | Google Sheets API |
| `ballerinax/googleapis.gmail` | Gmail API |
| `ballerinax/slack` | Slack messaging API |
| `ballerinax/twilio` | Twilio SMS and voice API |
| `ballerinax/aws.s3` | Amazon S3 object storage |
| `ballerinax/aws.sqs` | Amazon SQS messaging |
| `ballerinax/azure.service.bus` | Azure Service Bus messaging |

Browse all available connectors on [Ballerina Central](https://central.ballerina.io/).
