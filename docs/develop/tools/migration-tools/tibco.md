---
title: Migrate from TIBCO BusinessWorks
---

# Migrate from TIBCO BusinessWorks

## Overview

The TIBCO migration tool converts TIBCO BusinessWorks process definitions to Ballerina code. It handles process flows, activities, transitions, shared resources, and error handling configurations.

## Run the TIBCO migration tool

The migration wizard guides you through a 3-step process to convert your TIBCO BusinessWorks project into a WSO2 Integrator project.

### Step 1: Select source project

1. Open WSO2 Integrator and select **Migrate External Integration**.
2. Select **TIBCO** as the source platform.
3. Under **Select Your Project Folder**, click **Browse** and select your TIBCO BusinessWorks project folder or main configuration file.
4. Under **Configure TIBCO Settings**, set the following:
   - **Migrate Multiple Projects** — Enable this option to process all TIBCO projects in the selected folder.
5. Click **Start Migration**.

   ![Select TIBCO source project](/img/develop/tools/migration-tools/tibco-select-source.png)

### Step 2: Static migration progress

After the migration completes, the wizard displays a summary of the migration coverage:

- **Migration Coverage** — Percentage of activities that were automatically migrated.
- **Total Projects** — Number of TIBCO projects analyzed.
- **Total activities** — Total number of TIBCO activities analyzed.
- **Migratable activities** — Activities successfully converted to Ballerina.
- **Non-migratable activities** — Activities that require manual attention.

   ![Migration progress showing coverage statistics](/img/develop/tools/migration-tools/tibco-migration-progress.png)

Click **View Aggregate Report** to see a detailed migration report. The report includes:

- **Overview** — Number of projects analyzed, total lines of code generated, and average automated migration coverage.
- **Manual Work Estimation** — Estimated effort for completing non-migratable items.
- **Per-project breakdown** — Individual coverage and manual work estimation for each migrated project.
- **Currently Unsupported Elements** — List of elements that could not be automatically migrated.

   ![Full migration report](/img/develop/tools/migration-tools/tibco-migration-report.png)

Click **Save Reports** to download the report for future reference, then click **Next**.

### Step 3: Configure project

1. Under **Select Path**, click **Browse** and choose where to save the migrated integrations.
2. Enable **Create a new folder for the packages** to organize migrated projects, and enter a **Folder Name**.
3. Under **AI Enhancement**, select one of the following:
   - **Enable AI Enhancement** — AI automatically resolves unmapped elements, fixes build errors, and improves the quality of the migration.
   - **Skip for Now – Enhance Later** — Open the project as-is. You can trigger AI enhancement later from the BI Copilot.
4. Click **Create and Start AI Enhancement** (or **Create** if you chose to skip AI enhancement).

   ![Configure migrated project](/img/develop/tools/migration-tools/tibco-configure-project.png)

```bash
# Migrate a TIBCO BusinessWorks project
bal migrate tibco -i /path/to/tibco-project/ -o migrated/

# Specify the TIBCO BusinessWorks version
bal migrate tibco -i /path/to/tibco-project/ --version 6 -o migrated/

# Generate report only
bal migrate tibco -i /path/to/tibco-project/ --report-only
```

## Component mapping

| TIBCO component | Ballerina equivalent |
|---|---|
| Process Definition | Ballerina service / function |
| HTTP Receiver | `http:Listener` + service |
| HTTP Request | `http:Client` |
| JDBC Connection | `mysql:Client` / `postgresql:Client` |
| JDBC Query / Update | Database query functions |
| XML Parse / Render | XML data binding / record types |
| Mapper Activity | Data transformation expressions |
| Choice (If/Else) | `if/else` |
| Iterate / Loop | `foreach` / `while` |
| Group (Transaction) | `transaction` block |
| Catch / Fault Handler | `do/on fail` error handler |
| Timer | `task:Listener` with scheduled job |
| JMS Receiver / Sender | JMS connector client |
| File Read / Write | File I/O functions |
| Log Activity | `log:printInfo()` / `log:printError()` |
| Sub-Process | Function call |
| Shared Variable | Module-level variable / `isolated` variable |

## Example: TIBCO process to Ballerina service

**TIBCO BusinessWorks process (XML):**
```xml
<pd:ProcessDefinition xmlns:pd="http://xmlns.tibco.com/bw/process/2003"
                       xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <pd:name>GetOrder</pd:name>
    <pd:startName>HTTP Receiver</pd:startName>
    <pd:endName>Send HTTP Response</pd:endName>

    <pd:activity name="HTTP Receiver">
        <pd:type>com.tibco.plugin.http.HTTPEventSource</pd:type>
        <config>
            <sharedChannel>/SharedResources/HTTP Connection.sharedhttp</sharedChannel>
            <outputMode>String</outputMode>
            GET
            /api/orders/{orderId}
        </config>
    </pd:activity>

    <pd:activity name="Log Request">
        <pd:type>com.tibco.pe.core.WriteToLogActivity</pd:type>
        <config>
            <message>Processing order request</message>
        </config>
    </pd:activity>

    <pd:activity name="Query Database">
        <pd:type>com.tibco.plugin.jdbc.JDBCQueryActivity</pd:type>
        <config>
            <jdbcSharedConfig>/SharedResources/JDBC Connection.sharedjdbc</jdbcSharedConfig>
            <statement>SELECT name, total FROM orders WHERE id = ?</statement>
        </config>
    </pd:activity>

    <pd:activity name="Send HTTP Response">
        <pd:type>com.tibco.plugin.http.HTTPSendResponseActivity</pd:type>
        <config>
            <responseCode>200</responseCode>
        </config>
    </pd:activity>
</pd:ProcessDefinition>
```

**Generated Ballerina code:**
```ballerina
import ballerina/http;
import ballerina/log;
import ballerina/sql;
import ballerinax/mysql;

configurable string dbHost = ?;
configurable string dbUser = ?;
configurable string dbPassword = ?;

final mysql:Client dbClient = check new (dbHost, dbUser, dbPassword, "orders_db");

service /api/orders on new http:Listener(8090) {

    resource function get [string orderId]() returns json|error {
        log:printInfo("Processing order request", orderId = orderId);

        record {|string name; decimal total;|} result = check dbClient->queryRow(
            `SELECT name, total FROM orders WHERE id = ${orderId}`
        );

        return {
            id: orderId,
            name: result.name,
            total: result.total
        };
    }
}
```
