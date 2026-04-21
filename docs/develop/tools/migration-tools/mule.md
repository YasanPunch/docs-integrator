---
title: Migrate from MuleSoft
---

# Migrate from MuleSoft

## Overview

The MuleSoft migration tool converts MuleSoft Anypoint flows (XML configurations) to Ballerina code. It handles HTTP listeners, request connectors, DataWeave transformations, routers, and error handling patterns.

## Run the MuleSoft migration tool

The migration wizard guides you through a 3-step process to convert your MuleSoft project into a WSO2 Integrator project.

### Step 1: Select source project

1. Open WSO2 Integrator and select **Migrate External Integration**.
2. Select **MuleSoft** as the source platform.
3. Under **Select Your Project Folder**, click **Browse** and select your MuleSoft project's root folder or main configuration XML file.
4. Under **Configure MuleSoft Settings**, set the following:
   - **Force Version** — Select a specific Mule version or use **Auto Detect** to let the tool determine it from your project.
   - **Migrate Multiple Projects** — Enable this option to process all MuleSoft projects in the selected folder.
5. Click **Start Migration**.

   ![Select MuleSoft source project](/img/develop/tools/migration-tools/mule-select-source.png)

### Step 2: Static migration progress

After the migration completes, the wizard displays a summary of the migration coverage:

- **Migration Coverage** — Percentage of code lines that were automatically migrated.
- **Total code lines** — Total number of source code lines analyzed.
- **Migratable code lines** — Lines successfully converted to Ballerina.
- **Non-migratable code lines** — Lines that require manual attention.

   ![Migration progress showing coverage statistics](/img/develop/tools/migration-tools/mule-migration-progress.png)

Click **View Full Report** to see a detailed migration report. The report includes:

- **Migration Coverage Overview** — Overall coverage percentage with a breakdown of total, migratable, and non-migratable code lines.
- **Breakdown Components** — Separate coverage for Mule Elements and DataWeave expressions.
- **Manual Work Estimation** — Estimated effort (best, average, and worst case) for completing non-migratable items.
- **Currently Unsupported Elements** — List of elements that could not be automatically migrated.
- **Element Blocks that Require Manual Conversion** — Specific code blocks that need manual implementation.

   ![Full migration report](/img/develop/tools/migration-tools/mule-migration-report.png)

Click **Save Report** to download the report for future reference, then click **Next**.

### Step 3: Configure project

1. Enter an **Integration Name** for your migrated project.
2. Configure the project settings:
   - **Project Name** — Name of the project (defaults to `Default`).
   - **Create within a project** — Enable project mode to manage multiple integrations and libraries within a single repository.
   - **Select Path** — Choose where to create the migrated project.
3. Under **AI Enhancement**, select one of the following:
   - **Enable AI Enhancement** — AI automatically resolves unmapped elements, fixes build errors, and improves the quality of the migration.
   - **Skip for Now – Enhance Later** — Open the project as-is. You can trigger AI enhancement later from the BI Copilot.
4. Click **Create and Start AI Enhancement** (or **Create** if you chose to skip AI enhancement).

   ![Configure migrated project](/img/develop/tools/migration-tools/mule-configure-project.png)

```bash
# Migrate a MuleSoft project
bal migrate mule -i /path/to/mule-project/ -o migrated/

# Specify the MuleSoft version
bal migrate mule -i /path/to/mule-project/ --version 4 -o migrated/

# Generate report only
bal migrate mule -i /path/to/mule-project/ --report-only
```

## Component mapping

| MuleSoft component | Ballerina equivalent |
|---|---|
| HTTP Listener | `http:Listener` + service |
| HTTP Request | `http:Client` |
| Database Connector | `mysql:Client` / `postgresql:Client` |
| Transform (DataWeave) | Ballerina query expressions + data mapper |
| Flow Reference | Function call |
| Choice Router | `if/else` or `match` |
| For Each | `foreach` |
| Scatter-Gather | Workers (parallel execution) |
| Try | `do/on fail` |
| Object Store | Configurable state management |
| Scheduler | `task:Listener` |

## Example: MuleSoft flow to Ballerina

**MuleSoft flow (XML):**
```xml
<flow name="getOrderFlow">
    <http:listener config-ref="HTTP_Listener" path="/orders/{orderId}" method="GET"/>
    <logger message="Received order request for #[attributes.uriParams.orderId]" level="INFO"/>
    <http:request config-ref="Backend_Request" method="GET"
                  path="/orders/#[attributes.uriParams.orderId]"/>
    <ee:transform>
        <ee:message>
            <ee:set-payload><![CDATA[%dw 2.0
                output application/json
                ---
                {
                    id: payload.orderId,
                    customer: payload.customerName,
                    total: payload.amount
                }]]>
            </ee:set-payload>
        </ee:message>
    </ee:transform>
</flow>
```

**Generated Ballerina code:**
```ballerina
import ballerina/http;
import ballerina/log;

configurable string backendUrl = ?;

final http:Client backendClient = check new (backendUrl);

service /orders on new http:Listener(8090) {

    resource function get [string orderId]() returns json|error {
        log:printInfo("Received order request", orderId = orderId);

        json payload = check backendClient->get("/orders/" + orderId);

        // Transformed from DataWeave
        return {
            id: check payload.orderId,
            customer: check payload.customerName,
            total: check payload.amount
        };
    }
}
```
