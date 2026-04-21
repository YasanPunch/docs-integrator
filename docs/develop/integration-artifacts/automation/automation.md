---
title: Automation
---

# Automation

Automations run without an external request. Use them for scheduled data sync, batch processing, report generation, and other recurring tasks that need to execute on a timer or on demand.

## Creating an automation

In the WSO2 Integrator sidebar, click **+** next to **Automations**. The automation creation form opens.

Fill in the following fields:

- **Name** — enter a name for the automation. This is used as the function name in the generated code.
- **Schedule** — choose between a **Scheduled** (runs on a recurring interval) or **Manual** (triggered on demand) execution type.

Click **Create** to generate the automation.

## Designing the automation

After creation, WSO2 Integrator opens the automation in the flow designer. Use the design view to build your automation logic by adding actions, connections, and control flow.

To update the schedule or change the execution type after creation, click **Configure** in the design view toolbar. This reopens the configuration panel where you can edit the automation settings.

## Generated code

WSO2 Integrator creates an `automation.bal` file in your project with the following starter structure:

```ballerina
import ballerina/log;

public function main() returns error? {
    do {
    } on fail error e {
        log:printError("Error occurred", 'error = e);
        return e;
    }
}
```

Add your integration logic inside the `do` block. The `on fail` block handles any errors that occur during execution.

## What's next

- [Integration artifacts overview](../overview.md) — understand all available artifact types
- [HTTP service](../service/http-service.md) — expose your integration as a REST API
