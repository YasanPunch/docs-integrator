---
title: Library View
---

# Library View

The Library View is a dedicated view in WSO2 Integrator for creating utilities and shared resources that you can use across multiple integrations. Rather than building executable integration flows, you use the Library View to package shared type definitions, utility functions, custom connections, and data mapper configurations into a centralized module that other integrations can depend on.

![Library View overview](/img/develop/project-views/library-view/overview.png)

## General navigation

The general navigation elements in the Library View function exactly as they do in the Integration View:

- **Activity bar** — Access the file explorer, global search, source control, and extension marketplace.
- **Project explorer** — View and manage all artifacts (Connections, Types, Functions, Data Mappers) organized by category.

For more details on these elements, see the [Integration View](integration-view.md) documentation.

## Library overview canvas

The main canvas provides a central dashboard for your library package. It displays:

- **Artifacts summary** — Cards showing the total number of defined Types, Functions, Data Mappers, and Connections in your library.
- **README** — A section at the bottom for documenting the library's purpose, setup instructions, and usage notes to help users understand how to use it.

## Add reusable artifacts

Click the **+ Add Artifacts** button at the top right of the canvas to add a new component to your library. This opens a menu with all available artifact types that can be created in a library package:

- **Function**
- **Data Mapper**
- **Type**
- **Connection**
- **Configuration**

![Add artifacts menu](/img/develop/project-views/library-view/add-artifacts.png)

For detailed information on configuring each specific artifact type, see the [Integration Artifacts](../integration-artifacts/overview.md) documentation.

## Artifact management

Clicking any of the artifact category cards on the main canvas (such as **Functions** or **Types**) navigates to a specific list view for those artifacts.

![Artifact list view](/img/develop/project-views/library-view/artifact-list.png)

From this view, you can:

- View all defined artifacts of that specific type.
- Search for a specific artifact using the search bar.
- Click the **+ Add [Artifact]** button (e.g., **+ Add Function**) to create a new artifact of that type directly.

## Toolbar

The toolbar sits at the top of the Library View and provides quick access to actions for configuring and publishing your library.

![Toolbar](/img/develop/project-views/library-view/toolbar.png)

### Undo and redo

Click **Undo** or **Redo** in the toolbar to reverse or reapply recent changes to your library artifacts.

### Configure

Click **Configure** to open the project-level configuration panel. Here you can edit settings such as:

- Package metadata (name, version, organization)
- Build options
- Dependency management

### Publish

Unlike standard integration packages, library packages are not executable. Therefore, instead of running or debugging them directly, you publish them.

Click **Publish** to build the library and push it to a central repository (such as Ballerina Central), making the module available for other integrations to import and use.

## What's next

- [Packages & Modules](/docs/develop/organize-code/packages-modules) -- Understand package structure
- [Publish to Ballerina Central](/docs/connectors/publish-to-central) -- Share your libraries
