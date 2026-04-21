---
title: Setup Guide
---

# Setup Guide

This guide walks you through creating a Devant project and obtaining the service URL and access token required to use the AI Devant connector.

## Prerequisites

- A WSO2 Devant account. If you do not have one, sign up at [console.devant.io](https://console.devant.io).

## Step 1: Create a Devant organization and project

1. Log in to your Devant console at [console.devant.io](https://console.devant.io).
2. Click **Create Organization** if you do not already have one, or select an existing organization.
3. Inside your organization, click **New Project**.
4. Enter a **Project Name** and an optional description, then click **Create**.

## Step 2: Deploy or locate the chunking service

1. Inside your project, navigate to the **Components** section.
2. Locate the deployed chunking service or deploy a new one using the Devant document chunking component.
3. Once deployed, copy the **Service URL** — this is the `serviceUrl` you will supply to the `Chunker` constructor.

The service URL typically follows the pattern `https://<your-org>-<your-project>.devant.io/<component-path>`. Verify the exact URL from the component's Overview tab in the Devant console.

## Step 3: Generate an access token

1. In the Devant console, navigate to your project's **Settings** or **API Keys** section.
2. Click **Generate Token** or **Create API Key**.
3. Give the token a descriptive name (e.g., `ballerina-connector`) and set the required scopes.
4. Click **Generate** and copy the token value immediately — it will not be shown again.

Store the access token securely. Do not commit it to source control.
Use Ballerina's `configurable` feature and a `Config.toml` file to supply it at runtime.
