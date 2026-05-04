---
title: Migrate from Azure Logic Apps
---

# Migrate from Azure Logic Apps

## Overview

The Azure Logic Apps migration tool converts Logic Apps workflow definitions (ARM templates and workflow JSON) to Ballerina code. It handles triggers, actions, connectors, control flow, and error handling patterns.

## Run the Azure Logic Apps migration tool

```bash
# Migrate an Azure Logic Apps project
bal migrate azure -i /path/to/logic-apps-project/ -o migrated/

# Migrate from an exported ARM template
bal migrate azure -i /path/to/template.json -o migrated/

# Generate report only
bal migrate azure -i /path/to/logic-apps-project/ --report-only
```

## Component mapping

| Logic Apps component | Ballerina equivalent |
|---|---|
| HTTP Trigger | `http:Listener` + service |
| Recurrence Trigger | `task:Listener` with scheduled job |
| HTTP Action | `http:Client` |
| SQL Connector | `mysql:Client` / `mssql:Client` |
| Service Bus | JMS / message broker connector |
| Compose Action | Variable assignment / record construction |
| Parse JSON | JSON data binding / record types |
| Condition | `if/else` |
| Switch | `match` |
| For Each | `foreach` |
| Until (Loop) | `while` |
| Scope (Try-Catch) | `do/on fail` error handler |
| Initialize Variable | Variable declaration |
| Set Variable | Variable assignment |
| Send Email | Email connector client |
| Blob Storage | Azure Storage connector |
| Response Action | `return` statement |

## Example: Logic Apps workflow to Ballerina service

**Azure Logic Apps workflow (JSON):**
```json
{
  "definition": {
    "triggers": {
      "manual": {
        "type": "Request",
        "kind": "Http",
        "inputs": {
          "method": "GET",
          "relativePath": "/orders/{orderId}"
        }
      }
    },
    "actions": {
      "Get_order": {
        "type": "Http",
        "inputs": {
          "method": "GET",
          "uri": "https://backend/orders/@{triggerOutputs()['relativePathParameters']['orderId']}"
        }
      },
      "Response": {
        "type": "Response",
        "inputs": {
          "statusCode": 200,
          "body": "@body('Get_order')"
        }
      }
    }
  }
}
```

**Generated Ballerina code:**
```ballerina
import ballerina/http;
import ballerina/log;

configurable string backendUrl = "https://backend";

final http:Client backendClient = check new (backendUrl);

service /orders on new http:Listener(8090) {

    resource function get [string orderId]() returns json|error {
        log:printInfo("Processing order request", orderId = orderId);

        json response = check backendClient->get("/orders/" + orderId);
        return response;
    }
}
```

## Migration report

After migration, the tool generates a report listing successfully migrated components and items that require manual attention.

```
Migration Report: OrderWorkflow
===================================

Migrated Successfully:
  - Trigger: HTTP Request -> http:Listener resource
  - Action: Get_order -> http:Client request
  - Action: Response -> return statement

Requires Manual Review:
  - Connection: SQL_Connection -> Needs Config.toml configuration
  - Action: Send_Email -> Email connector needs credentials

Unsupported (Manual Migration Required):
  - Custom Connector: SAP_Connector -> Replace with appropriate connector
  - Azure Function Action: ProcessData -> Rewrite in Ballerina
```
