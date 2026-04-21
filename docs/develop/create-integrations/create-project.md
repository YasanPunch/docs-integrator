---
title: Create a Project
---

# Create a project

A project is a workspace that organizes multiple integrations and libraries in a single repository with shared dependencies. Use projects when you need to manage related packages together.

## Open the creation wizard

On the WSO2 Integrator home screen, click **Show more** to reveal additional options.

![Home screen with Show more expanded](/img/create-project/home-screen.png)

Click **Create Project** to open the project creation wizard.

## Configure the project

The creation wizard prompts you to provide the basic details for your project.

![Create Project form](/img/create-project/create-project-form.png)

| Field | Description |
|---|---|
| **Project Name** | A name for your project (e.g., `Default`). |
| **Select Path** | The directory where the project is created. Click **Browse** to choose a folder. The full path preview appears below the field. |

Fill in the required fields and click **Create Project**.

### Advanced configurations

Expand the **Advanced Configurations** section to customize additional project settings.

| Field | Description |
|---|---|
| **Organization Name** | The organization that owns this project. Click **Sign In** to pick from your registered organizations. |
| **Project ID** | A unique identifier for your project used in various contexts. |

## Add integrations and libraries

After creation, WSO2 Integrator opens the [project view](../project-views/project-view.md). The project starts empty — add integrations or libraries to begin building.

![Empty project view](/img/create-project/project-view-empty.png)

Click **Add Integration or Library** in the main area, or click **Create Integration or Library** in the sidebar to open the creation dialog.

### Add an integration

![Add New Integration dialog](/img/create-project/add-new-integration.png)

1. Select **Integration (Default)** as the type.
2. Enter an **Integration Name**.
3. Optionally expand **Advanced Configurations** to set Ballerina package details:

   | Field | Description |
   |---|---|
   | **Package Name** | The Ballerina package name. Defaults to the integration name. |
   | **Organization Name** | Your Ballerina Central organization. Click **Sign In** to pick from your organizations. |
   | **Package Version** | Initial version. Defaults to `0.1.0`. |

4. Click **Add Integration**.

### Add a library

![Add New Library dialog](/img/create-project/add-new-library.png)

1. Select **Library** as the type.
2. Enter a **Library Name**.
3. Optionally expand **Advanced Configurations** to set the same Ballerina package fields as above.
4. Click **Add Library**.

## What's next

- [Project View](../project-views/project-view.md) -- Manage, run, and debug your project
- [Create a New Integration](create-new-integration.md) -- Create a standalone integration
- [Create a Library](create-library.md) -- Create a standalone library
