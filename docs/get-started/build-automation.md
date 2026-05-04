---
title: Build an Automation
---

# Build an Automation

**Time:** Under 10 minutes | **What you'll build:** An automation that can run on demand or configured for periodic invocation from external systems.

Automations are ideal for data synchronization, report generation, and routine maintenance jobs.

## Prerequisites

- Install WSO2 Integrator and complete the required setup by following the [installation guide](install.md).

## Step 1: Create the project

1. Open WSO2 Integrator.
2. Select **Create New Integration**.
3. Set **Integration Name** to `HelloWorld`.
4. Set **Project Name** to `QuickStart`.
5. Select **Browse**.
6. Select the project location and select **Open**.
7. Select **Create Integration**.

<ThemedImage
    alt="Create the project"
    sources={{
        light: useBaseUrl('/img/get-started/build-automation/create-the-project-light.gif'),
        dark: useBaseUrl('/img/get-started/build-automation/create-the-project-dark.gif'),
    }}
/>

## Step 2: Add an automation artifact

1. Select **HelloWorld**.
2. In the design view, select **Add Artifact**.
3. Select **Automation** artifact.
4. Select **Create**.

<ThemedImage
    alt="Add an automation artifact"
    sources={{
        light: useBaseUrl('/img/get-started/build-automation/add-an-automation-artifact-light.gif'),
        dark: useBaseUrl('/img/get-started/build-automation/add-an-automation-artifact-dark.gif'),
    }}
/>

## Step 3: Add logic

1. Select **+** after the **Start** node to open the node panel.
2. Select **Call Function** node to the flow.
3. Select **Print** from the node panel.
4. Select **Initialize Array** from the node panel.
5. Set **Values** to `"Hello World"` and select **Save**.

<ThemedImage
    alt="Add logic"
    sources={{
        light: useBaseUrl('/img/get-started/build-automation/add-logic-light.gif'),
        dark: useBaseUrl('/img/get-started/build-automation/add-logic-dark.gif'),
    }}
/>

## Step 4: Run and test

1. Select **Run**.
2. The automation executes immediately and prints output to the terminal.
3. Check the terminal output for `Hello World`.

<ThemedImage
    alt="Run and test"
    sources={{
        light: useBaseUrl('/img/get-started/build-automation/run-and-test-light.gif'),
        dark: useBaseUrl('/img/get-started/build-automation/run-and-test-dark.gif'),
    }}
/>

## Scheduling automations

Periodic invocation is configured in an external system once the automation is deployed. Available options include:

- **Cron job** — schedule the automation from a `cron` entry on a Unix or Linux host.
- **Kubernetes** — define a `CronJob` resource to run the automation on a recurring schedule.
- **VM** — use a host scheduler such as Windows Task Scheduler or `systemd` timers.
- **WSO2 Cloud** — configure the schedule in WSO2 Cloud when the integration is pushed to the cloud.

## What's next

- [AI agent](build-ai-agent.md) -- Build an intelligent agent
- [Integration as API](build-api-integration.md) -- Build an HTTP service
- [Event-driven integration](build-event-driven-integration.md) -- React to messages from brokers
- [File-driven integration](build-file-driven-integration.md) -- Process files from FTP or local directories
