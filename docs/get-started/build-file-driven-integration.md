---
title: Build a File-Driven Integration
---

# Build a File-Driven Integration

**Time:** Under 10 minutes | **What you'll build:** A file integration that adds an `onModify` handler to track file changes and uses `printInfo` to log file modification events.

File integrations are ideal for batch uploads, scheduled file processing, and ETL workflows triggered by files appearing in a folder or FTP server.

## Prerequisites

- [WSO2 Integrator installed](install.md)

## Step 1: Create the project

1. Open WSO2 Integrator.
2. Select **Create New Integration**.
3. Set **Integration Name** to `FileTracker` and **Project Name** to `QuickStart`.
4. Select **Browse**.
5. Select the project location and select **Open**.
6. Select **Create Integration**.

<ThemedImage
    alt="Create the Project"
    sources={{
        light: useBaseUrl('/img/get-started/build-file-driven-integration/create-the-project-light.gif'),
        dark: useBaseUrl('/img/get-started/build-file-driven-integration/create-the-project-dark.gif'),
    }}
/>

## Step 2: Add a file integration artifact

1. Select **FileTracker**.
2. In the design view, select **+ Add Artifact**.
3. Select **Local Files** under **File Integration**.
4. Set **Path** to `/tmp` and select **Create**.

<ThemedImage
    alt="Add a File Integration Artifact"
    sources={{
        light: useBaseUrl('/img/get-started/build-file-driven-integration/add-a-file-integration-artifact-light.gif'),
        dark: useBaseUrl('/img/get-started/build-file-driven-integration/add-a-file-integration-artifact-dark.gif'),
    }}
/>

## Step 3: Track modified files

1. Select **Add Handler**, then select **onModify** from the side panel.
2. Select the **onModify** handler to open the **Flow Designer**.
3. Select **+** in the flow diagram.
4. Search for `printInfo` and select **printInfo**.
5. Set **Msg** to `File modified` and select **Save**.

<ThemedImage
    alt="Tracking modified files"
    sources={{
        light: useBaseUrl('/img/get-started/build-file-driven-integration/tracking-modified-files-light.gif'),
        dark: useBaseUrl('/img/get-started/build-file-driven-integration/tracking-modified-files-dark.gif'),
    }}
/>

## Step 4: Run and test

1. Select **Run** in the toolbar.
2. Open a new terminal and run `echo "test" > /tmp/testfile.txt`.
3. View the logs in the terminal.

<ThemedImage
    alt="Run and Test"
    sources={{
        light: useBaseUrl('/img/get-started/build-file-driven-integration/run-and-test-light.gif'),
        dark: useBaseUrl('/img/get-started/build-file-driven-integration/run-and-test-dark.gif'),
    }}
/>

## Next steps

- [Automation](build-automation.md) -- Build a scheduled job
- [AI agent](build-ai-agent.md) -- Build an intelligent agent
- [Integration as API](build-api-integration.md) -- Build an HTTP service
- [Event-driven integration](build-event-driven-integration.md) -- React to messages from brokers
