---
title: 'Quick Start: File Integration'
---

# Quick Start: File Integration

**Time:** Under 10 minutes. **What you'll build:** A file integration that adds an `onModify` handler to track file changes and uses `printInfo` to log file modification events.

File integrations are ideal for batch uploads, scheduled file processing, and ETL workflows triggered by files appearing in a folder or FTP server.

## Prerequisites

- Install the [WSO2 Integrator extension](install.md).

## Step 1: Create the project

1. Open WSO2 Integrator.
2. Select **Create**.
3. Set **Integration Name** to `FileTracker`.
4. Set **Project Name** to `Quick_Start`.
5. Select **Browse**.
6. Select the project location and select **Open**.
7. Select **Create Integration**.

<ThemedImage
    alt="Create the Project"
    sources={{
        light: useBaseUrl('/img/get-started/quick-start-file/create-the-project-light.gif'),
        dark: useBaseUrl('/img/get-started/quick-start-file/create-the-project-dark.gif'),
    }}
/>

## Step 2: Add a file integration artifact

1. Select **FileTracker**.
2. In the design view, select **+ Add Artifact**.
3. Scroll down and select **Local Files** under **File Integration**.
4. Set **Path** to **"/tmp"**.
5. Select **Create**.

<ThemedImage
    alt="Add a File Integration Artifact"
    sources={{
        light: useBaseUrl('/img/get-started/quick-start-file/add-a-file-integration-artifact-light.gif'),
        dark: useBaseUrl('/img/get-started/quick-start-file/add-a-file-integration-artifact-dark.gif'),
    }}
/>

## Step 3: Track modified files

1. Select **Add Handler**.
2. Select **onModify**.
2. Select **onModify** again.
4. Select **+** .
5. Search `printInfo` and select **printInfo**.
6. Set **Msg** to `File modified`.
7. Select **Save**.

<ThemedImage
    alt="Tracking modified files"
    sources={{
        light: useBaseUrl('/img/get-started/quick-start-file/tracking-modified-files-light.gif'),
        dark: useBaseUrl('/img/get-started/quick-start-file/tracking-modified-files-dark.gif'),
    }}
/>

## Step 4: Run and test

1. Select **Run** in the toolbar.
2. Open a new terminal and run `echo "test" > /tmp/testfile.txt`.

<ThemedImage
    alt="Run and Test"
    sources={{
        light: useBaseUrl('/img/get-started/quick-start-file/run-and-test-light.gif'),
        dark: useBaseUrl('/img/get-started/quick-start-file/run-and-test-dark.gif'),
    }}
/>

## Supported file sources

| Source | Transport | Use case |
|---|---|---|
| **Local directory** | File system | Development, on-premise batch processing |
| **FTP** | FTP | Legacy file exchange |
| **FTPS** | FTP over TLS | Secure legacy file exchange |
| **SFTP** | SSH File Transfer | Secure file exchange |

## What's next

- [Quick start: Automation](quick-start-automation.md): Build scheduled jobs.
- [Quick start: Integration as API](quick-start-api.md): Build an HTTP service.
- [File handlers](/docs/develop/integration-artifacts/overview): Advanced file processing patterns.
