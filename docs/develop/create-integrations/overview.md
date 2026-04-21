---
title: Create Integrations
---

# Create Integrations

Get started by creating a new integration project, opening an existing one, or exploring the built-in samples. WSO2 Integrator provides multiple ways to bootstrap your work so you can focus on building integration logic rather than project scaffolding.

## Project Types

WSO2 Integrator supports several project types, each tailored to a specific integration scenario:

| Project Type | Description | Use Case |
|---|---|---|
| **Service** | Exposes an HTTP, GraphQL, gRPC, or WebSocket endpoint | API backends, data services, webhooks |
| **Event Handler** | Reacts to messages from a broker or external system | Stream processing, event-driven workflows |
| **Automation** | Runs on a schedule or manual trigger | Batch jobs, periodic sync, reports |
| **File Handler** | Processes files from FTP, SFTP, or local directories | ETL pipelines, file-based integrations |
| **AI Agent** | Orchestrates LLM calls with tool functions | Intelligent assistants, RAG applications |

## Creating your first project

The fastest way to start is through the creation wizard on the WSO2 Integrator home screen:

1. Open WSO2 Integrator.
2. Click **Create** on the **Create New Integration** card.
3. Enter the integration name and select a directory.
4. Click **Create Integration**.

The wizard generates a complete Ballerina project with the correct directory structure, dependencies, and a starter template.

## Project Structure

Every integration project follows the standard Ballerina project layout:

```
my-integration/
├── .vscode/
├── .gitignore
├── agents.bal              # AI agent definitions
├── automation.bal          # Scheduled and manual automations
├── Ballerina.toml          # Project metadata and dependencies
├── config.bal              # Configuration variables
├── connections.bal          # Connection configurations
├── data_mappings.bal       # Data transformation mappings
├── functions.bal           # Reusable functions
├── main.bal                # Entry point / service definition
└── types.bal               # Shared type definitions
```

The `Ballerina.toml` file identifies the project and declares its dependencies.

## Guides

- [Create a New Integration](create-new-integration.md) -- Start a new project from scratch or from a template
- [Open an Existing Integration](open-integration-or-project.md) -- Open and work with projects on disk or from version control
- [Explore Sample Integrations](explore-samples.md) -- Browse and learn from built-in examples
- [Import External Integrations](migrate-3rd-party-integrations.md) -- Import projects from other tools or formats

## What's Next

- [Integration Artifacts](/docs/develop/integration-artifacts/overview) -- Learn about the different artifact types you can create
- [Design Logic](/docs/develop/design-logic/overview) -- Build your integration logic visually or in code
