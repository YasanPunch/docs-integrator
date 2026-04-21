---
title: Release Notes
---

# Release Notes

## WSO2 Integrator: BI 1.0.0

**Release Date:** 2025

### Highlights

- **Visual Low-Code Designer** -- Build integrations visually in VS Code with bidirectional code sync
- **Ballerina 2201.12.0 (Swan Lake Update 12)** -- Latest Ballerina runtime with improved performance
- **GenAI and AI Agent Support** -- Build AI agents, natural functions, RAG applications, and MCP servers
- **200+ Connectors** -- Pre-built connectors for SaaS, databases, messaging, AI/LLM providers, and protocols
- **Visual Data Mapper** -- Drag-and-drop data transformation with AI-assisted field mapping
- **Comprehensive Testing** -- Unit testing, mocking, data-driven tests, AI-generated test cases, and code coverage
- **Deploy Anywhere** -- Docker, Kubernetes, OpenShift, AWS, Azure, GCP, or WSO2 Devant iPaaS
- **Integration Control Plane (ICP)** -- Monitor and manage deployed integrations
- **Migration Tools** -- Migrate from MuleSoft, TIBCO, Azure Integration Services, and WSO2 MI

### What's New

#### AI and GenAI

- **AI Agent Framework** -- `ballerinax/ai.agent` package for building LLM-powered agents with tool binding and memory
- **MCP Server Support** -- Expose integrations as MCP tools for AI assistants (Claude Desktop, GitHub Copilot)
- **Natural Functions** -- Call LLMs as typed Ballerina functions with automatic prompt engineering
- **AI-Assisted Data Mapping** -- AI suggests field mappings in the visual data mapper
- **AI Test Generation** -- Generate test cases from integration code using AI

#### Development Tools

- **Visual Flow Designer** -- Two modes: Flow Diagram and Sequence Diagram with bidirectional code sync
- **Pro-Code Editor** -- Full Ballerina IDE support with IntelliSense, diagnostics, and debugging
- **Integrated Debugging** -- Set breakpoints, inspect variables, and step through integration logic
- **Try It** -- Send test requests to running services directly from the VS Code extension
- **Ballerina Shell** -- Interactive REPL for prototyping expressions and testing transformations
- **Code Generation** -- OpenAPI, GraphQL, gRPC, AsyncAPI, and EDI tools for generating client/server code

#### Integration Capabilities

- **HTTP/REST Services** -- Build RESTful APIs with typed request/response handling
- **GraphQL Services** -- Schema-first and code-first GraphQL endpoint development
- **gRPC Services** -- Protocol Buffers-based RPC with streaming support
- **WebSocket Services** -- Real-time bidirectional communication endpoints
- **CDC Listeners** -- Real-time Change Data Capture for MySQL, PostgreSQL, and MS SQL Server
- **Scheduled Automations** -- Cron-based and interval-based task scheduling
- **Event-Driven Integrations** -- Kafka, RabbitMQ, NATS, and MQTT consumers and producers
- **Database Access** -- Type-safe SQL with MySQL, PostgreSQL, MSSQL, Oracle, and MongoDB connectors
- **File Integrations** -- FTP, SFTP, and local file system operations
- **Email** -- SMTP, IMAP, and POP3 support

#### Deployment and Operations

- **Cloud-Native Deployment** -- Docker and Kubernetes artifact generation via `Cloud.toml`
- **GraalVM Native Compilation** -- Build native executables for fast startup and low memory footprint
- **Configurable Runtime** -- `Config.toml`, environment variables, and command-line configuration overrides
- **Observability** -- Built-in support for Prometheus metrics and Jaeger distributed tracing
- **CI/CD Integration** -- GitHub Actions, Jenkins, and Azure DevOps pipeline templates

### Supported Platforms

| Component | Version |
|-----------|---------|
| **Ballerina** | 2201.12.0 (Swan Lake Update 12) |
| **VS Code Extension** | WSO2 Integrator: BI |
| **Java Runtime** | JDK 21 |
| **Node.js** (optional) | 18+ (for some tools) |
| **Docker** | 20.10+ (for container deployment) |
| **Kubernetes** | 1.25+ (for Kubernetes deployment) |

### System Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| **RAM** | 4 GB | 8 GB |
| **Disk Space** | 2 GB | 5 GB |
| **OS** | Linux (x64/ARM64), macOS (x64/ARM64), Windows (x64) | -- |
| **VS Code** | 1.85+ | Latest stable |

### Known Issues

- GraalVM native image compilation may require additional configuration for some connector packages. Check the connector documentation for GraalVM compatibility before enabling native builds.
- The visual designer does not yet support `worker` message passing constructs. These are displayed as code blocks in the flow diagram.
- Hot reload during `bal run` may not detect changes to platform JAR dependencies. Restart the application after updating JARs in the `libs/` directory.
- The `bal persist` tool does not yet support all data store types in migration mode. Check the [persist documentation](https://ballerina.io/learn/bal-persist-overview) for supported stores.

### Breaking Changes

This is the first GA release of WSO2 Integrator. There are no breaking changes from prior versions.

WSO2 Integrator is a new Ballerina-based product alongside the existing WSO2 MI. If you are an existing MI user, your current deployments continue to work and MI remains fully supported. See the [MI documentation](https://mi.docs.wso2.com) for MI-specific guidance.

### Coming from WSO2 MI?

If you are considering adopting WSO2 Integrator for new projects or migrating existing MI integrations, see the [Coming from WSO2 MI](/docs/tutorials/migration/from-wso2-mi) guide. The two products use different development approaches:

| Aspect | WSO2 MI | WSO2 Integrator |
|--------|-----------------|-----------------|
| Configuration language | XML (Synapse) | Ballerina |
| Development model | XML artifacts | Code-first with visual designer |
| Deployment unit | CAR file | Executable JAR / Docker image |
| Runtime | Java/OSGi | Ballerina/JVM |
| Mediators | XML mediator sequence | Ballerina functions |
| Connectors | Synapse connectors | Ballerina Central packages |
| Registry | Carbon registry | Config.toml / environment variables |

## Previous Releases

See the [WSO2 documentation archive](https://docs.wso2.com) for previous product releases.

## What's Next

- [Install WSO2 Integrator](/docs/get-started/install) -- Get started with the latest release
- [Quick Start Guide](/docs/get-started/quick-start-api) -- Build your first integration
