---
title: Integration View
---

# Integration View

The Integration View is the primary development interface in WSO2 Integrator. Use it to build, test, and deploy a single integration package. It combines a project explorer, a visual design canvas, and deployment options in one unified workspace.

![Integration View overview](/img/develop/project-views/integration-view/overview.png)

## Activity bar

The activity bar is the narrow vertical strip on the far-left edge of the editor. Each icon opens a different panel or tool.

| Name | Description |
|---|---|
| **Explorer** | Opens the file explorer for browsing project files |
| **Search** | Opens the global search panel |
| **Source Control** | Opens the Git source control panel |
| **WSO2 Integrator** | Opens the Integration View with the project explorer and design canvas |
| **Run and Debug** | Opens the debug panel for setting breakpoints and inspecting variables |
| **Extensions** | Opens the extensions marketplace |

Click the **WSO2 Integrator** icon to switch to the Integration View at any time.

![Activity bar](/img/develop/project-views/integration-view/activity-bar.png)

## Project explorer

The project explorer is the left sidebar that organizes all components of your integration package into a structured tree. Each section groups a specific type of artifact, making it easy to locate and manage the building blocks of your integration.

![Project explorer](/img/develop/project-views/integration-view/project-explorer.png)

### Entry points

Entry points define how your integration receives requests or gets triggered. They are the starting points of your integration logic.

Common entry point types include:

- **HTTP Service** — Exposes REST endpoints that accept HTTP requests.
- **GraphQL Service** — Exposes a GraphQL API.
- **Automation** — Runs on a schedule or at startup without an external trigger.
- **Kafka Listener** — Consumes messages from Apache Kafka topics.
- **RabbitMQ Listener** — Consumes messages from RabbitMQ queues.
- **File Watcher** — Triggers when files are created or modified in a directory.

To add an entry point:

1. Hover over the **Entry Points** section in the project explorer.
2. Click the **+** icon that appears.
3. Select the entry point type from the list.
4. Fill in the required configuration (name, port, path, etc.).

To open an entry point, click its name in the project explorer. This opens it in the visual designer where you can build the integration logic.

Each entry point has a three-dot context menu (**⋮**) with actions such as **Rename**, **Delete**, and **Go to Source**.

### Listeners

Listeners define protocol-specific configurations that entry points bind to. A listener specifies the host, port, and protocol settings for receiving incoming traffic.

Multiple entry points can share the same listener. For example, several HTTP services can bind to a single HTTP listener on port `8090`.

To add a listener, click the **+** icon next to the **Listeners** section and configure the protocol settings.

### Connections

Connections represent configured links to external systems such as databases, HTTP APIs, message brokers, and third-party services. Define a connection once and reuse it across multiple entry points.

Common connection types include:

- **HTTP Client** — Connects to external REST APIs.
- **Database** — Connects to MySQL, PostgreSQL, MSSQL, or other databases.
- **Message Broker** — Connects to Kafka, RabbitMQ, or NATS.
- **gRPC Client** — Connects to gRPC services.

To add a connection:

1. Click the **+** icon next to the **Connections** section.
2. Select the connection type.
3. Provide the connection URL, credentials, and other required settings.

### Types

Types define custom record types, enums, and type aliases used in your integration. They help you model your data structures and enforce type safety across your integration logic.

To add a type, click the **+** icon next to the **Types** section and select the type kind (**Record**, **Enum**, or **Type Alias**).

### Functions

Functions are reusable logic blocks that you can call from entry points or other functions. Use functions to extract common logic, keep your entry points clean, and improve testability.

To add a function, click the **+** icon next to the **Functions** section. Choose the function type:

- **Regular** — A standard function.
- **Isolated** — A concurrency-safe function.
- **Remote** — A function that makes network calls.

### Data mappers

Data mappers provide a visual interface for transforming data between different structures. Use them to map fields from a source type to a target type without writing transformation code manually.

To add a data mapper, click the **+** icon next to the **Data Mappers** section, then select the source and target types.

### Configurations

Configurations list the configurable variables defined in your integration. These variables get their values from the `Config.toml` file at runtime, allowing you to change behavior across environments without modifying code.

Click a configuration entry to view or edit its default value and type.

## Design canvas

The design canvas is the central area of the Integration View. It displays a visual overview of your integration package, showing how entry points, listeners, connections, and services relate to each other.

![Design canvas](/img/develop/project-views/integration-view/design-canvas.png)

### Service diagram

The service diagram renders your integration as an interactive graph. Each node represents a component:

- **Entry points** appear as the primary nodes on the left.
- **Listeners** connect to the entry points they serve.
- **External connections** appear on the right, showing which services your integration calls.
- **Lines** between nodes indicate data flow and dependencies.

Click any node to open that component in the visual designer. Right-click a node or click its three-dot menu (**⋮**) to access context actions such as **Open in Source**, **Rename**, and **Delete**.

### Zoom and navigation controls

Use the controls in the bottom-right corner of the canvas to adjust the view:

- **+** — Zoom in.
- **−** — Zoom out.
- **Fit to screen** — Automatically adjusts the zoom level to show all nodes.

You can also scroll to zoom and drag to pan across the canvas.

### Generate with AI

Click the **Generate** button at the top of the canvas to create integration logic using AI. Describe what you want in natural language, and WSO2 Integrator generates the entry points, connections, and logic for you.

The AI generation creates a working starting point that you can refine in the visual designer or code editor.

### Add artifact

Click the **+ Add Artifact** button at the top of the canvas to add a new component to your integration. This opens a menu with all available artifact types organized by category:

- **Entry Points** — HTTP Service, GraphQL Service, Automation, event listeners
- **Connections** — HTTP Client, Database, Message Broker, and more
- **Types** — Record, Enum, Type Alias
- **Functions** — Regular, Isolated, Remote
- **Data Mappers** — Visual transformation mappings

## Toolbar

The toolbar sits at the top of the Integration View and provides quick access to common actions for building, running, and debugging your integration.

![Toolbar](/img/develop/project-views/integration-view/toolbar.png)

### Undo and redo

Click **Undo** or **Redo** in the toolbar to reverse or reapply recent changes to your integration. These actions work across both the visual designer and the code editor.

### Configure

Click **Configure** to open the project-level configuration panel. Here you can edit settings such as:

- Package metadata (name, version, organization)
- Build options
- Dependency management
- `Config.toml` values for different environments

### Run

Click **Run** to build and run your integration locally. WSO2 Integrator compiles the Ballerina code, starts the services, and displays the output in the terminal panel. Use this to test your integration before deploying.

### Debug

Click **Debug** to start a debug session. This launches your integration with the debugger attached, allowing you to:

- Set breakpoints in the visual designer or code editor
- Step through execution line by line
- Inspect variables, request payloads, and response data
- Evaluate expressions at runtime

## Editor toolbar

The editor toolbar appears on the right side of the editor tab bar when the Integration View is open. It provides quick actions for the current integration.

![Editor toolbar](/img/develop/project-views/integration-view/editor-toolbar.png)

| Action | Description |
|---|---|
| **WSO2 Integrator Copilot** | Opens the WSO2 Integrator Copilot chat panel to get AI-powered assistance for building and troubleshooting your integration |
| **Run** | Builds and runs the integration locally, starting all services and displaying output in the terminal |
| **Debug** | Launches the integration with the debugger attached so you can set breakpoints and inspect variables |
| **Show Source** | Switches to the Ballerina source code view for direct code editing |

## Deployment options panel

The deployment options panel appears on the right sidebar and provides shortcuts to deploy your integration to different environments.

![Deployment options](/img/develop/project-views/integration-view/deployment-options.png)

### Deploy to Devant

Deploy your integration to [WSO2 Devant](/docs/deploy-operate/deploy/devant), a fully managed cloud platform. Devant handles provisioning, scaling, and monitoring so you can focus on building integrations.

### Deploy with Docker

Package your integration as a [Docker container](/docs/deploy-operate/deploy/docker-kubernetes) for deployment to any container orchestration platform, including Kubernetes and OpenShift.

### Deploy on a VM

Generate a runnable artifact and [deploy it directly on a virtual machine](/docs/deploy-operate/deploy/vm-based) or bare-metal server.

### Integration Control Plane

Connect your integration to the [Integration Control Plane (ICP)](/docs/deploy-operate/observe/icp) for centralized observability, monitoring, and management across all your deployed integrations.

## README section

The README section at the bottom of the Integration View displays the contents of your project's `README.md` file. Use it to document the purpose, setup instructions, and usage notes for your integration.

Click **Edit** to modify the README directly. You can also click **Generate with AI** to create a README automatically based on your project's components and configuration.

## What's next

- [Design integration logic](/docs/develop/design-logic/overview) — Build logic using the visual designer
- [Integration artifacts](/docs/develop/integration-artifacts/overview) — Learn about artifact types and their configuration
- [Deploy to Devant](/docs/deploy-operate/deploy/devant) — Deploy your integration to the cloud
