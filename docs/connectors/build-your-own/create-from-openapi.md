---
title: Create from OpenAPI Spec
---

# Create from OpenAPI Spec

WSO2 Integrator enables you to automatically generate custom connectors from OpenAPI specifications. This allows you to integrate any API-driven service — even when a pre-built connector isn't available — without writing manual client logic.

## Overview

APIs power many of the digital services we use daily, such as notifications, SMS alerts, reminders, and transactions. Rather than manually writing client code for each API you need to integrate with, WSO2 Integrator can generate a fully functional connector from a standard OpenAPI definition file.

## Prerequisites

- An OpenAPI specification file (JSON or YAML) for the target API
- WSO2 Integrator IDE installed and configured

## Generate a connector

Follow these steps to generate a custom connector from an OpenAPI spec:

### Step 1: Open the flow diagram

Open your integration project in the Automation diagram view.

### Step 2: Add a new connection

Click the **+** icon positioned between the **Start** and **Error Handler** nodes on your flow line. From the right-side palette, choose **Add Connection**.

### Step 3: Select OpenAPI

In the **Add Connection** overlay, select **OpenAPI** under the **Connect via API Specification** section.

### Step 4: Configure the connector

In the **Connector Configuration** form, fill in the following:

| Field | Description | Example |
|---|---|---|
| **Connector Name** | A descriptive name for your connector | `stackOverflow` |
| **Import Specification File** | Browse and upload your OpenAPI definition file | `stack-overflow-api.yaml` |

### Step 5: Save and review

Click **Save Connector** to generate the connector from your OpenAPI spec. Review the connection details displayed on the following screen to verify everything looks correct.

### Step 6: Finalize

Click **Save Connection** to complete the setup. Your custom connector is now ready to use in your integration flow.

Make sure your OpenAPI specification is valid and well-structured before importing. You can validate your spec using tools like [Swagger Editor](https://editor.swagger.io/).

## What's next

Once your connector is generated, you can use it just like any pre-built connector — drag it into your integration flow, configure its operations, and map data between services.

- [Custom Development](custom-development.md) — Build a connector from scratch using Ballerina
