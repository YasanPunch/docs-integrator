# Section 11: Reference

**Question this section answers:** "What's the exact syntax / config / API for Z?"

**Audience:** Developer who knows what they're looking for — needs the exact syntax, flag, config key, or API signature. Not learning, just looking up.

**Tone:** Terse, precise, no narrative. Tables, code blocks, signatures. Think "man page" not "blog post". Titles should be descriptive, not action-oriented.

---

## Language (7 pages)

### Page: Ballerina Syntax Quick Reference

**File:** `en/docs/reference/language/syntax.md`

**What to cover:**

- Complete syntax reference in table/code-block format
- Variable declarations, type annotations
- Function definitions
- Service and resource definitions
- Module and import syntax
- Comments and documentation
- NOT a tutorial — just the syntax

### Page: Type System

**File:** `en/docs/reference/language/type-system.md`

**What to cover:**

- All Ballerina types in a hierarchy diagram
- Structural types: record, array, map, tuple, table
- Behavioral types: object, function, future, stream
- Special types: union, optional, any, anydata, never, byte
- Type narrowing and type guards
- Type compatibility rules

### Page: Standard Library Functions (langlib)

**File:** `en/docs/reference/language/stdlib.md`

**What to cover:**

- Categorized list of all langlib functions
- String functions (length, substring, trim, etc.)
- Array functions (push, pop, filter, map, etc.)
- Map functions (get, keys, values, etc.)
- Int/float/decimal functions
- Error functions
- For each: signature, parameters, return type, one-line example

### Page: Query Expressions Reference

**File:** `en/docs/reference/language/query-expressions.md`

**What to cover:**

- Complete query expression syntax
- All clauses: from, where, let, join, order by, limit, select, collect
- Supported input types (array, map, stream, table, XML)
- Aggregation functions
- Each clause with syntax and example

### Page: Concurrency

**File:** `en/docs/reference/language/concurrency.md`

**What to cover:**

- Workers: named workers, worker communication (send/receive)
- Strands: lightweight threads, strand lifecycle
- Lock: lock blocks for shared state
- Transactions: transaction blocks, commit, rollback, retry
- Wait: wait for workers, wait for any/all

### Page: Error Handling Reference

**File:** `en/docs/reference/language/error-handling.md`

**What to cover:**

- Error type definition
- Error construction
- `check` keyword behavior
- `checkpanic` keyword
- `trap` expression
- `fail` statement
- `do/on fail` blocks
- Distinct error types
- Error detail record

### Page: Integration-Specific Features

**File:** `en/docs/reference/language/integration-features.md`

**What to cover:**

- Service declaration syntax
- Resource function syntax (GET, POST, etc.)
- Client objects (remote methods)
- Listener interface
- Annotations for HTTP, GraphQL, gRPC
- Configurable variables

---

## Configuration (5 pages)

### Pages: Ballerina.toml, Config.toml, Cloud.toml, Dependencies.toml, Environment Variables

**Files:** `en/docs/reference/config/ballerina-toml.md`, `config-toml.md`, `cloud-toml.md`, `dependencies-toml.md`, `environment-variables.md`

**For each config file, cover:**

- Complete key reference (every valid key with description)
- Format: TOML syntax rules
- Example file (complete, with comments)
- Where the file goes (project root, home dir, etc.)
- Precedence rules (env vars override Config.toml, etc.)

**Specific focus:**

- **Ballerina.toml** — `[package]`, `[build-options]`, `[platform.java17]` sections
- **Config.toml** — Configurable variable mapping, secret values, module-qualified keys
- **Cloud.toml** — `[container.image]`, `[cloud.deployment]`, K8s resource limits
- **Dependencies.toml** — Auto-generated, when to edit manually, version resolution
- **Environment Variables** — Naming convention (`BAL_CONFIG_*`), overriding Config.toml values

---

## CLI (9 pages)

### Page: bal Command Reference

**File:** `en/docs/reference/cli/bal-commands.md`

**What to cover:**

- Every `bal` subcommand with flags
- `bal new`, `bal build`, `bal run`, `bal test`, `bal pack`, `bal push`, `bal pull`
- `bal dist` for distribution management
- `bal format`, `bal doc`, `bal clean`
- Each command: syntax, all flags with descriptions, examples

### Pages: bal persist, bal openapi, bal graphql, bal grpc, bal edi, bal health

**Files:** `en/docs/reference/cli/bal-persist.md`, `bal-openapi.md`, `bal-graphql.md`, `bal-grpc.md`, `bal-edi.md`, `bal-health.md`

**For each tool CLI, cover:**

- All subcommands
- All flags with descriptions
- Input/output format
- Example commands with expected output

### Page: Update Tool

**File:** `en/docs/reference/cli/update-tool.md`

**What to cover:**

- `bal dist list` — available distributions
- `bal dist pull` — install specific version
- `bal dist update` — update to latest
- `bal dist use` — switch between versions

### Page: Scan Tool

**File:** `en/docs/reference/cli/scan-tool.md`

**What to cover:**

- `bal scan` — run static analysis
- Available rules
- Custom rule configuration
- Output format

---

## APIs (3 pages)

### Page: Management API

**File:** `en/docs/reference/api/management-api.md`

**What to cover:**

- Runtime management REST API endpoints
- Deployment info, service listing, health check
- Authentication for management API
- Endpoint reference (method, path, request/response)

### Page: ICP API

**File:** `en/docs/reference/api/icp-api.md`

**What to cover:**

- Integration Control Plane API endpoints
- Service registration, status reporting, log streaming
- API authentication

### Page: Ballerina API Docs

**File:** `en/docs/reference/api/ballerina-api-docs.md`

**What to cover:**

- Link to official Ballerina API docs
- How to navigate module documentation
- Key modules for integration developers

---

## Standalone Reference Pages

### Section: WSO2 Integration Control Plane (ICP)

The ICP reference is split across the following pages under `en/docs/manage/icp/`:

#### Page: Overview

**File:** `en/docs/manage/icp/index.md`

**What to cover:**

- Components: ICP Server, dashboard, database
- Default ports table (9446, 9445, 5173) with protocol and description
- Endpoint paths table (GraphQL, auth, observability, REST management)

#### Page: Server Configuration

**File:** `en/docs/reference/icp/server-configuration.md`

**What to cover:**

- All `deployment.toml` server settings keys (table format: key, type, default, description)
- Authentication token settings (JWT secret, expiry times, refresh token rotation)

#### Page: Database Configuration

**File:** `en/docs/reference/icp/database-configuration.md`

**What to cover:**

- Main database configuration keys under `[icp_server.storage]` for MySQL, PostgreSQL, MSSQL, and H2 (with copy-paste TOML examples)
- Credentials database flat keys with copy-paste TOML example
- Security note: use placeholders / secrets manager for passwords

#### Page: Authentication

**File:** `en/docs/reference/icp/authentication-config.md`

**What to cover:**

- Authentication backend modes: Default User Store, LDAP, SSO/OIDC, Custom Backend
- Full LDAP configuration key reference: connection, user search, group/role lookup
- Required vs optional LDAP keys (flag keys with no default as required)

#### Page: Connecting a Runtime to ICP

**File:** `en/docs/manage/icp/runtime-connection.md`

**What to cover:**

- WSO2 Integrator (BI) runtime: `Config.toml` snippet with `[wso2.icp.runtime.bridge]`, `Ballerina.toml` `remoteManagement = true`, and `import wso2/icp.runtime.bridge as _` in `main.bal`
- WSO2 Micro Integrator (MI) runtime: `deployment.toml` snippet with `[icp_config]` and `enabled = true`
- Configuration key tables for both runtimes
- Port 9445 noted as the runtime communication port


---

### Page: Supported Protocols Reference

**File:** `en/docs/reference/protocols.md`

**What to cover:**

- Complete table of all supported protocols
- Columns: Protocol, Module, Listener, Client, Version
- HTTP/1.1, HTTP/2, WebSocket, gRPC, GraphQL, TCP, UDP, SMTP, POP3, IMAP, FTP, SFTP, Kafka, RabbitMQ, MQTT, NATS, JMS, AMQP

### Page: Supported Data Formats Reference

**File:** `en/docs/reference/data-formats.md`

**What to cover:**

- Complete table of all supported data formats
- Columns: Format, Module, Read, Write, Transform
- JSON, XML, CSV, YAML, TOML, EDI, FHIR, HL7, Protocol Buffers, Avro, Parquet

### Page: Ballerina by Example

**File:** `en/docs/reference/by-example.md`

**What to cover:**

- Link to Ballerina by Example (200+ examples)
- Categorized index of most relevant examples for integration developers
- How to run examples locally

### Page: Ballerina Specifications

**File:** `en/docs/reference/specifications.md`

**What to cover:**

- Link to Ballerina language specification
- Link to Ballerina library specifications
- Link to Ballerina platform specification

---

## Appendix (6 pages)

### Page: System Requirements

**File:** `en/docs/reference/appendix/system-requirements.md`

**What to cover:**

- Supported OS versions (Windows, macOS, Linux)
- JDK requirements
- WSO2 Integrator IDE version requirements
- Docker version (if using containers)
- Hardware: CPU, RAM, disk

### Page: Error Codes

**File:** `en/docs/reference/error-code.md`

**What to cover:**

- Complete list of WSO2 Integrator error codes
- For each: code, message, cause, resolution
- Organized by category (build, runtime, deployment)

### Page: Glossary

**File:** `en/docs/reference/glossary.md`

**What to cover:**

- Every term used in the documentation, alphabetically
- Each term: one-paragraph definition, link to relevant page
- Include both WSO2 Integrator terms and Ballerina terms

### Page: FAQ

**File:** `en/docs/reference/faq.md`

**What to cover:**

- Top 20 most frequently asked questions
- Organized by category: General, Development, Deployment, AI, Connectors
- Each: question, concise answer, link to detailed page

### Page: Release Notes

**File:** `en/docs/reference/release-notes.md`

**What to cover:**

- Latest release highlights
- New features, improvements, bug fixes
- Breaking changes (if any)
- Migration notes from previous version
- Link to full changelog
