---
title: Project View
---

# Project View

The Project View is the top-level view in WSO2 Integrator. It appears when you open a project that contains multiple integration and library packages, giving you an overview of all packages, deployment options, and project-level actions in one place.

![Project View overview](/img/develop/project-views/project-view/overview.png)

## General navigation

The general navigation elements in the Project View function the same way as in the Integration View:

- **Activity bar** — Access the file explorer, global search, source control, and extension marketplace.
- **Project explorer** — View and manage all packages in the project. Unlike the Integration View, the project explorer at the project level displays all packages (integrations and libraries) grouped by name. Each package is expandable to show its own artifact tree (Entry Points, Connections, Types, Data Mappers, Configurations).

For more details on these elements, see the [Integration View](integration-view.md) documentation.

## Project overview canvas

The project overview canvas is the central area of the Project View. It displays the project name as a heading and provides a unified dashboard for managing all packages in the project.

### Integrations and libraries

The **Integrations & Libraries** section displays a card grid showing each package in the project. Each card shows:

- The package name (e.g., "Integration1", "Library1").
- A type badge for library packages (e.g., "Library") to distinguish them from integrations.

Click any card to navigate to the [Integration View](integration-view.md) or [Library View](library-view.md) for that package, where you can build and manage its artifacts.

### Generate with AI

Click the **Generate with AI** button at the top of the canvas to create a new integration using AI. Describe what you want in natural language, and WSO2 Integrator generates the integration package with the appropriate entry points, connections, and logic.

### Add package

Click the **+ Add** button at the top of the canvas to add a new integration or library package to the project. Select the package type, provide a name and configuration, and the new package appears in the card grid and project explorer.

## Deployment options panel

The deployment options panel appears on the right sidebar and provides shortcuts to deploy your integrations to different environments.

### Deploy to WSO2 Cloud

Deploy your integrations to [WSO2 Cloud](/docs/deploy-operate/deploy/devant), a fully managed cloud platform. WSO2 Cloud handles provisioning, scaling, and monitoring so you can focus on building integrations.

### Deploy with Docker

Package your integrations as [Docker containers](/docs/deploy-operate/deploy/docker-kubernetes) for deployment to any container orchestration platform, including Kubernetes and OpenShift.

### Deploy on a VM

Generate runnable artifacts and [deploy them directly on a virtual machine](/docs/deploy-operate/deploy/vm-based) or bare-metal server.

### Integration Control Plane

Connect your integrations to the [Integration Control Plane (ICP)](/docs/deploy-operate/observe/icp) for centralized observability, monitoring, and management across all your deployed integrations.

At the project level, click **Enable ICP for all integrations** to activate ICP monitoring for every integration package in the project at once.

## README section

The README section at the bottom of the Project View displays the contents of your project's `README.md` file. Use it to document the purpose, setup instructions, and usage notes for your project, integrations, and libraries.

Click **Edit** to modify the README directly. If the project does not have a README yet, click **Add a README** to create one.

## What's next

- [Integration View](integration-view.md) — The primary development interface for individual integrations
- [Library View](library-view.md) — Build and manage reusable library packages
- [Packages & Modules](/docs/develop/organize-code/packages-modules) — Understand package structure
