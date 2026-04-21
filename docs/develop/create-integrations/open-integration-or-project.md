---
title: Open an Existing Integration
---

# Open an existing integration

If you already have an integration or project on your local machine, you can open it directly from the WSO2 Integrator home screen. WSO2 Integrator detects the project structure and activates its tooling automatically.

## Open from the home screen

When you open WSO2 Integrator, the home screen displays three options for getting started.

![WSO2 Integrator home screen](/img/open-integration/home-screen.png)

Click **Open** on the **Open Integration** card to browse your local filesystem.

## Select the integration or project

A file browser dialog appears. Navigate to the directory that contains your integration or project.

![Browse dialog](/img/open-integration/browse-dialog.png)

You can select either:

- **A project folder** — A directory that contains a root `Ballerina.toml` and one or more integration or library subdirectories. WSO2 Integrator opens the [project view](../project-views/project-view.md).
- **An integration or library folder** — A single package directory that contains a `Ballerina.toml` and `.bal` source files. WSO2 Integrator opens the [integration view](../project-views/integration-view.md) or [library view](../project-views/library-view.md) depending on the package type.

Select the folder and click **Open**.

## What's next

- [Create a New Integration](create-new-integration.md) -- Start a new project from scratch
- [Explore Sample Integrations](explore-samples.md) -- Browse and learn from built-in examples
- [Project View](../project-views/project-view.md) -- Manage multi-package workspaces
