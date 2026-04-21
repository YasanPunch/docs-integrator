---
title: FAQ
---

# FAQ

## General

### What is WSO2 Integrator?

WSO2 Integrator is a Ballerina-powered integration platform that combines low-code visual design and pro-code development. It allows developers to build, test, and deploy integrations that connect APIs, databases, messaging systems, SaaS applications, and AI services. The platform includes a VS Code extension with a visual flow designer, a comprehensive connector library, and built-in observability.

### How does WSO2 Integrator relate to WSO2 Micro Integrator (MI)?

WSO2 Integrator is a new Ballerina-based integration platform that offers a low-code visual designer with pro-code parity. WSO2 MI continues to be fully supported as part of the WSO2 Integration Platform, with its own dedicated documentation at [mi.docs.wso2.com](https://mi.docs.wso2.com).

The two products take different approaches to integration development:

| | WSO2 Integrator | WSO2 MI |
|---|---|---|
| **Language** | Ballerina | XML (Synapse) |
| **Development** | Code-first with visual designer | XML artifact editing with Integration Studio |
| **Deployment** | Executable JARs, Docker images | CAR files |
| **Connectors** | Ballerina Central packages | Synapse connectors |

If you are starting a new project, WSO2 Integrator is the recommended choice. If you have existing MI deployments, see the [Migration from WSO2 MI](/docs/tutorials/migration/from-wso2-mi) guide or continue using MI with its [dedicated documentation](https://mi.docs.wso2.com).

### What version of Ballerina does WSO2 Integrator use?

WSO2 Integrator 1.0.0 is built on Ballerina Swan Lake Update 12 (2201.12.x). The exact distribution version is specified in each project's `Ballerina.toml` file under the `[package].distribution` field.

### Is WSO2 Integrator open source?

WSO2 Integrator builds on Ballerina, which is open source under the Apache 2.0 license. The WSO2 Integrator VS Code extension and tooling are provided by WSO2. Check the WSO2 licensing page for specific license details.

### What protocols and standards does WSO2 Integrator support?

WSO2 Integrator supports a wide range of protocols and data formats through Ballerina's standard and extended libraries:

- **API protocols:** HTTP/REST, GraphQL, gRPC, WebSocket, SOAP
- **Messaging:** Kafka, RabbitMQ, NATS, MQTT, JMS
- **Data access:** MySQL, PostgreSQL, MSSQL, Oracle, MongoDB, Redis
- **File transfer:** FTP, SFTP, local file system
- **Email:** SMTP, IMAP, POP3
- **Data formats:** JSON, XML, CSV, YAML, TOML, EDI, HL7/FHIR
- **Security:** OAuth 2.0, JWT, Basic Auth, mutual TLS

## Development

### Do I need to know Ballerina to use WSO2 Integrator?

Not to get started. The visual designer handles most common integration scenarios through drag-and-drop configuration. However, learning Ballerina unlocks advanced capabilities such as custom data transformations, complex error handling, and concurrency patterns. The visual designer and code editor sync bidirectionally, so you can switch between modes at any time.

### Can I use existing Ballerina packages?

Yes. Any package published on [Ballerina Central](https://central.ballerina.io) can be imported and used in your integration projects. Add packages by importing them in your Ballerina source code, and they will be resolved automatically during `bal build`.

### What IDE support is available?

WSO2 Integrator provides a VS Code extension that includes:

- Visual flow designer with drag-and-drop interface
- Sequence diagram view
- Pro-code editor with IntelliSense and type checking
- Integrated debugger with breakpoints and variable inspection
- Try It tool for testing services
- Visual data mapper for transformations
- Project scaffolding and templates

### How do I debug my integrations?

WSO2 Integrator supports standard VS Code debugging. Set breakpoints in either the visual designer or the code editor, then launch the debugger. You can also use remote debugging by running `bal run --debug <port>` and attaching the VS Code debugger to the specified port.

### Can I write tests for my integrations?

Yes. Ballerina has a built-in test framework (`ballerina/test`) that supports:

- Unit tests with assertions
- Service-level integration tests with mock servers
- Data-driven tests with data providers
- Test groups and selective execution
- Code coverage reports
- Mocking of clients and external dependencies

Run tests with `bal test` and generate reports with `bal test --test-report --code-coverage`.

### How do I handle secrets and sensitive configuration?

Use separate configuration files for secrets and reference them via the `BAL_CONFIG_FILES` environment variable. In Kubernetes, mount secrets as files or inject them as environment variables using `BAL_CONFIG_VAR_*` prefixes. Never commit secrets to version control in `Config.toml`. See the [Environment Variables](/docs/reference/config/environment-variables) reference for details.

## Architecture

### What types of integrations can I build?

WSO2 Integrator supports three primary integration types:

- **Services:** Network-accessible endpoints (HTTP, GraphQL, gRPC, WebSocket) that respond to incoming requests
- **Automations:** Scheduled or manually triggered jobs that run without an external request (cron-based, interval-based, or one-time)
- **Event Handlers:** Reactive integrations triggered by messages from Kafka, RabbitMQ, NATS, MQTT, or other event sources

### What is the Integration Control Plane (ICP)?

The ICP is a monitoring and management dashboard for deployed integrations. It provides:

- Real-time metrics (request count, error rate, latency percentiles)
- Log aggregation and search
- Artifact discovery (services, listeners, connectors)
- Integration lifecycle management (activate, deactivate, restart)

See the [ICP API Reference](/docs/reference/api/icp-api) for programmatic access.

### How does concurrency work?

Ballerina uses strands (lightweight threads) managed by its own scheduler. You can run code concurrently using named workers within a function or by starting asynchronous calls with the `start` keyword. Workers can communicate through message passing. The runtime handles strand scheduling and context switching transparently.

## Deployment

### Where can I deploy WSO2 Integrator applications?

WSO2 Integrator supports multiple deployment targets:

- **Docker containers:** Generate Dockerfiles and images with `bal build --cloud=docker`
- **Kubernetes:** Generate K8s manifests with `bal build --cloud=k8s` and configure via `Cloud.toml`
- **WSO2 Devant:** Deploy to WSO2's managed iPaaS platform
- **Bare metal / VM:** Run the executable JAR directly with `bal run` or `java -jar`
- **GraalVM native:** Build native executables with `bal build --graalvm` for fast startup
- **Serverless:** Deploy to AWS Lambda or Azure Functions

See [Deploy and Operate](/docs/deploy-operate/deploy/docker-kubernetes) for detailed deployment guides.

### How do I configure my application for different environments?

Use `Config.toml` for environment-specific values and provide them at deployment time. The configuration precedence (highest to lowest) is:

1. `BAL_CONFIG_VAR_*` environment variables
2. Command-line arguments (`-Ckey=value`)
3. `BAL_CONFIG_DATA` environment variable
4. Config files (via `BAL_CONFIG_FILES` or default `Config.toml`)
5. Default values in source code

This allows you to use the same built artifact across development, staging, and production by varying only the configuration.

### Does WSO2 Integrator support horizontal scaling?

Yes. Ballerina services are stateless by default, making them suitable for horizontal scaling. Configure autoscaling in `Cloud.toml` with `[cloud.deployment.autoscaling]` settings, or use your Kubernetes cluster's HPA (Horizontal Pod Autoscaler) directly.

### How do I monitor my integrations in production?

WSO2 Integrator supports observability through:

- **Metrics:** Prometheus-compatible metrics exposed at a configurable endpoint
- **Distributed tracing:** Jaeger-compatible traces for request flow analysis
- **Logging:** Structured logging via `ballerina/log` with configurable levels
- **ICP Dashboard:** Built-in monitoring UI for integration health and performance

Enable observability by setting `observabilityIncluded = true` in `Ballerina.toml` under `[build-options]`.

## Migration

### Can I migrate from MuleSoft or TIBCO?

Yes. WSO2 provides migration guides and tooling to help transition from other integration platforms. See the [Migration from MuleSoft](/docs/tutorials/migration/from-mulesoft) and [Migration from TIBCO](/docs/tutorials/migration/from-tibco) guides for platform-specific guidance. For migrating from WSO2 MI, see [Coming from WSO2 MI](/docs/tutorials/migration/from-wso2-mi).

### Can I run WSO2 MI and WSO2 Integrator side by side?

Yes. The two products use different runtimes and can coexist in the same environment. This allows you to adopt WSO2 Integrator for new projects while continuing to run your existing MI deployments. You can also migrate MI integrations incrementally using the [migration tools](/docs/develop/tools/migration-tools/overview). For MI-specific guidance, refer to the [MI documentation](https://mi.docs.wso2.com).

## What's Next

- [Get Started](/docs/get-started/install) -- Install and set up WSO2 Integrator
- [Quick Start Guide](/docs/get-started/quick-start-api) -- Build your first integration
- [Glossary](/docs/reference/glossary) -- Definitions of key terms
