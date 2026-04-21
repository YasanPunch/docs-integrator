---
title: Create a New Integration
---

# Create a new integration

WSO2 Integrator provides a creation wizard to set up new integration projects. Launch it from the home screen and configure the project details to generate a ready-to-use Ballerina project.

## Open the creation wizard

When you open WSO2 Integrator, the home screen displays three options for getting started.

![WSO2 Integrator home screen](/img/create-new-integration/home-screen.png)

Click **Create** on the **Create New Integration** card to open the creation wizard.

## Configure the integration

The creation wizard prompts you to provide the basic details for your integration.

![Create Integration form](/img/create-new-integration/create-integration-form.png)

| Field | Description |
|---|---|
| **Integration Name** | A descriptive name for your integration (e.g., `order-sync-service`). |
| **Project Name** | The name of the project that contains this integration. |
| **Create within a project** | Enabled by default. Creates a project workspace that can hold multiple integrations and libraries in a single repository. Uncheck this to create a standalone integration. |
| **Select Path** | The directory where the integration files are created. Click **Browse** to choose a folder. The full path preview appears below the field. |

### Create within a project

By default, the **Create within a project** checkbox is enabled. In this mode, WSO2 Integrator creates a project workspace that can contain multiple integrations and libraries with shared dependencies.

1. Enter the **Integration Name**.
2. Enter the **Project Name**.
3. Select the directory using **Browse**.
4. Click **Create Integration**.

WSO2 Integrator generates the project structure and opens the [project view](../project-views/project-view.md). The file structure for a project contains a root `Ballerina.toml` and a subdirectory for each integration package:

```
project-name/
├── .choreo/
├── .vscode/
├── integration-name/
│   ├── .vscode/
│   ├── .gitignore
│   ├── agents.bal
│   ├── automation.bal
│   ├── Ballerina.toml
│   ├── config.bal
│   ├── connections.bal
│   ├── data_mappings.bal
│   ├── functions.bal
│   ├── main.bal
│   └── types.bal
└── Ballerina.toml
```

You can add more integrations and libraries to the project from the project view.

### Create a standalone integration

Uncheck the **Create within a project** checkbox to create a single integration package without a project wrapper.

1. Enter the **Integration Name**.
2. Uncheck **Create within a project**.
3. Select the directory using **Browse**.
4. Click **Create Integration**.

WSO2 Integrator generates the integration files and opens the [integration view](../project-views/integration-view.md). The file structure for a standalone integration contains the Ballerina source files directly:

```
integration-name/
├── .vscode/
├── .gitignore
├── agents.bal
├── automation.bal
├── Ballerina.toml
├── config.bal
├── connections.bal
├── data_mappings.bal
├── functions.bal
├── main.bal
└── types.bal
```

The integration view sidebar organizes these files into logical categories: **Entry Points**, **Listeners**, **Connections**, **Types**, **Functions**, **Data Mappers**, and **Configurations**.

You can convert a standalone integration into a project at any time by clicking the **+** button in the WSO2 Integrator sidebar. This adds a new integration package and wraps both in a project structure.

## Advanced configurations

Expand the **Advanced Configurations** section to customize the module ID and Ballerina package settings.

![Advanced Configurations](/img/create-new-integration/advanced-configurations.png)

### Module ID

| Field | Description |
|---|---|
| **Project ID** | A unique identifier for your project used in various contexts. This value cannot be changed after creation. |

### Ballerina package

The integration is generated as a Ballerina package. Use these fields to configure the package metadata.

| Field | Description |
|---|---|
| **Package Name** | The Ballerina package name. Defaults to the integration name. |
| **Organization Name** | Your Ballerina Central organization name. Click **Sign In** to pick from your registered organizations. |
| **Package Version** | The initial version of the package. Defaults to `0.1.0`. |

## What's next

- [Open an Existing Integration](open-integration-or-project.md) -- Work with projects already on disk
- [Explore Sample Integrations](explore-samples.md) -- Browse and learn from built-in examples
- [Project View](../project-views/project-view.md) -- Manage multi-package workspaces
- [Integration Artifacts](/docs/develop/integration-artifacts/overview) -- Understand the artifact types you can create
