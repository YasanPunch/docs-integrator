---
title: Reference
---

# Reference

Pure lookup material — syntax, configuration keys, CLI commands, API docs, and specifications. No tutorials, no narrative — just the facts.

## Language

Ballerina language reference for integration developers:

- **[Syntax Quick Reference](language/ballerina-syntax-quick-reference.md)** — Core language constructs at a glance
- **[Type System](language/type-system.md)** — Structural types, unions, optional, any, stream, never
- **[Standard Library](language/standard-library-overview.md)** — Built-in functions (langlib)
- **[Query Expressions](language/query-expressions.md)** — SQL-like data processing
- **[Concurrency](language/concurrency.md)** — Workers, strands, locks, transactions
- **[Error Handling](language/error-handling.md)** — Error types and handling patterns
- **[Integration Features](language/integration-specific-features.md)** — Services, clients, listeners

## Configuration

Project and deployment configuration files:

| File                                                         | Purpose                           |
| ------------------------------------------------------------ | --------------------------------- |
| **[Ballerina.toml](config/ballerinatoml-reference.md)**               | Project metadata and dependencies |
| **[Config.toml](config/configtoml-reference.md)**                     | Runtime configuration values      |
| **[Cloud.toml](config/cloudtoml-reference.md)**                       | Cloud deployment settings         |
| **[Dependencies.toml](config/dependenciestoml-reference.md)**         | Locked dependency versions        |
| **[Environment Variables](config/environment-variables.md)** | Runtime environment configuration |

## CLI

Command-line tools reference:

| Command                                 | Purpose                                      |
| --------------------------------------- | -------------------------------------------- |
| **[bal commands](cli/bal-command-reference.md)** | Core build, run, test, and package commands  |
| **[bal persist](cli/bal-persist.md)**   | Data persistence code generation             |
| **[bal openapi](cli/bal-openapi.md)**   | Generate services/clients from OpenAPI specs |
| **[bal graphql](cli/bal-graphql.md)**   | GraphQL schema generation                    |
| **[bal grpc](cli/bal-grpc.md)**         | Generate code from .proto files              |
| **[bal edi](cli/bal-edi.md)**           | EDI schema processing                        |
| **[bal health](cli/bal-health.md)**     | FHIR/HL7 health tool                         |
| **[Update Tool](cli/ballerina-update-tool.md)**   | Manage Ballerina distributions               |
| **[Scan Tool](cli/bal-scan.md)**       | Static analysis rules                        |

## APIs

- **[Management API](api/management.md)** — Runtime management endpoints
- **[ICP API](api/icp.md)** — Integration Control Plane API
- **[Ballerina API Docs](api/ballerina-documentation.md)** — Standard library API documentation

## WSO2 Integration Control Plane

- **[Overview](icp/integration-control-plane.md)** — Components, default ports, and endpoints
- **[Server Configuration](icp/server-configuration.md)** — Server settings and authentication token keys
- **[Database Configuration](icp/database-configuration.md)** — Main database and credentials database setup
- **[Authentication](icp/authentication.md)** — Authentication backends and LDAP configuration
- **[Connect an Integration to ICP](icp/connect-runtime.md)** — Register an integration runtime with ICP
- **[Connect MI Integration to ICP](icp/connect-runtime-mi.md)** — Register a Micro Integrator runtime with ICP
- **[Observability Setup](icp/observability-setup.md)** — Set up centralized logs and metrics monitoring with Fluent Bit and OpenSearch
- **[MI Observability Setup](icp/observability-setup-mi.md)** — Set up centralized logs and metrics monitoring for MI runtimes
- **[MI Artifacts](icp/manage-mi-artficats.md)** — Navigate and manage MI artifacts in the ICP console
- **[Deployment](icp/deployment.md)** — Docker Compose profiles and distribution commands

## Specifications & formats

- **[Supported protocols](supported-protocols.md)** — Complete protocol support table
- **[Supported data formats](data-formats.md)** — Complete data format support table
- **[Ballerina by Example](ballerina-by-example.md)** — 200+ runnable examples
- **[Ballerina Specifications](ballerina-specifications.md)** — Language, library, and platform specs

## Appendix

- **[System Requirements](appendix/system-requirements.md)** — Supported platforms and versions
- **[Error Codes](error-code.md)** — Error code reference
- **[Glossary](glossary.md)** — Terminology definitions
- **[FAQ](faq.md)** — Frequently asked questions
- **[Troubleshooting](appendix/troubleshooting.md)** — Common issues and solutions
- **[Release Notes](release-notes.md)** — What's new in each release
