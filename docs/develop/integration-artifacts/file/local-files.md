---
title: Local Files
---

# Local Files

Local file services monitor a directory on the local file system and trigger event handlers when files are created, modified, or deleted. Use them for on-premise batch processing, development workflows, and integrations that consume files dropped into a watched directory.

## Creating a local file service

1. Click **+ Add Artifact** in the canvas or click **+** next to **Entry Points** in the sidebar.
2. In the **Artifacts** panel, select **Local Files** under **File Integration**.

   ![Artifacts panel showing Local Files under File Integration](/img/develop/integration-artifacts/file/local-files/step-2.png)

3. In the creation form, fill in the following fields:

   ![Local Files creation form](/img/develop/integration-artifacts/file/local-files/step-creation-form.png)

   | Field | Description | Default |
   |---|---|---|
   | **Path** | Directory path to monitor for file events (e.g., `/data/incoming`). | Required |
   | **Recursive** | When set to `True`, monitors all sub-directories under the specified path. | `False` |

   Expand **Advanced Configurations** to set the listener name.

   | Field | Description | Default |
   |---|---|---|
   | **Listener Name** | Identifier for the listener created with this service. | `fileListener` |

4. Click **Create**.

5. WSO2 Integrator opens the service in the **Service Designer**. The canvas shows the attached listener pill and the **Event Handlers** section.

   ![Service Designer showing the local file service canvas](/img/develop/integration-artifacts/file/local-files/step-service-designer.png)

6. Click **+ Add Handler** to define how file events are processed.

```ballerina
import ballerina/file;
import ballerina/log;

configurable string path = "/data/incoming";
configurable boolean recursive = false;

listener file:Listener fileListener = check new ({
    path: path,
    recursive: recursive
});

service on fileListener {

    remote function onCreate(file:FileEvent event) returns error? {
        log:printInfo("File created", path = event.name);
    }

    remote function onModify(file:FileEvent event) returns error? {
        log:printInfo("File modified", path = event.name);
    }

    remote function onDelete(file:FileEvent event) returns error? {
        log:printInfo("File deleted", path = event.name);
    }
}
```

## Service and listener configuration

In the **Service Designer**, click the **Configure** icon in the header to open the **Local Files Configuration** panel.

![Local Files Configuration panel](/img/develop/integration-artifacts/file/local-files/step-configure.png)

Select **Local Files** in the left panel to view service-level settings, or select **fileListener** under **Attached Listeners** to configure the listener.

**Configuration for fileListener**

| Field | Description | Default |
|---|---|---|
| **Name** | Identifier for the listener. | `fileListener` |
| **Path** | Directory path which the listener monitors. | Required |
| **Recursive** | When enabled, recursively monitors all sub-folders in the given directory path. | `False` |

Click **+ Attach Listener** to attach an additional listener to the same service.

Click **Save Changes** to apply updates.

The listener configuration is set when constructing `file:Listener`:

```ballerina
listener file:Listener fileListener = check new ({
    path: "/data/incoming",
    recursive: false
});
```

`file:ListenerConfig` fields:

| Field | Type | Default | Description |
|---|---|---|---|
| `path` | `string` | Required | Directory path to monitor |
| `recursive` | `boolean` | `false` | Monitor all sub-directories under the path |

## File handlers

A file handler is a `remote function` that WSO2 Integrator calls each time a matching file system event occurs in the monitored directory.

### Adding a file handler

In the **Service Designer**, click **+ Add Handler**. A **Select Handler to Add** panel opens on the right listing the available event types. Click the event type to add it directly — no further configuration is required.

| Handler | Triggered when |
|---|---|
| **onCreate** | A new file is created in the monitored directory |
| **onDelete** | A file is deleted from the monitored directory |
| **onModify** | An existing file in the monitored directory is modified |

Add the handler as a `remote function` inside the service. Each handler receives a `file:FileEvent` parameter containing details about the event.

**onCreate handler:**

```ballerina
service on fileListener {

    remote function onCreate(file:FileEvent event) returns error? {
        string filePath = event.name;
        log:printInfo("New file detected", path = filePath);
        check processFile(filePath);
    }
}
```

**onModify handler:**

```ballerina
service on fileListener {

    remote function onModify(file:FileEvent event) returns error? {
        log:printInfo("File modified", path = event.name);
    }
}
```

**onDelete handler:**

```ballerina
service on fileListener {

    remote function onDelete(file:FileEvent event) returns error? {
        log:printInfo("File deleted", path = event.name);
    }
}
```

### FileEvent

Each handler receives a `file:FileEvent` parameter with details about the file system event.

| Field | Type | Description |
|---|---|---|
| `name` | `string` | Absolute path of the file that triggered the event |
| `addedFiles` | `file:FileInfo[]` | List of files added in this event cycle (available in `onCreate`) |
| `lastModifiedTimestamp` | `int` | Last-modified time of the file as UNIX epoch milliseconds |

## Writing output files

Use the `ballerina/io` module to write results to the local file system from within a handler.

```ballerina
import ballerina/io;
import ballerina/log;

type OrderSummary record {|
    string orderId;
    decimal total;
    string status;
|};

function writeResults(OrderSummary[] summaries) returns error? {
    // Write a CSV file
    check io:fileWriteCsv("/data/outgoing/summary.csv", summaries);

    // Write a plain text file
    check io:fileWriteString("/data/outgoing/report.txt", "Processing complete.");

    log:printInfo("Output files written", count = summaries.length());
}
```

`io` write functions:

| Function | Description |
|---|---|
| `io:fileWriteString(path, content)` | Write a string to a file, overwriting any existing content |
| `io:fileWriteString(path, content, option)` | Write a string with `io:APPEND` or `io:OVERWRITE` option |
| `io:fileWriteCsv(path, content)` | Serialize a `record[]` or `string[][]` and write it as CSV |
| `io:fileWriteBytes(path, content)` | Write a byte array to a file |
| `io:fileWriteLines(path, content)` | Write a `string[]` as lines to a file |

## What's next

- [FTP / SFTP](ftp-sftp.md) — monitor a remote file server instead of a local directory
- [Connections](../supporting/connections.md) — reuse connection credentials across services
- [Data Mapper](../supporting/data-mapper.md) — transform incoming file payloads between formats
