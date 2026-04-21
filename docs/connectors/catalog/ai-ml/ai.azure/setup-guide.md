---
title: Setup Guide
---

# Setup Guide

This guide walks you through setting up Azure OpenAI Service and Azure AI Search resources and obtaining the credentials required to use the Azure OpenAI connector.

## Prerequisites

- An active Microsoft Azure account. If you do not have one, [sign up for free](https://azure.microsoft.com/free/).
- An Azure AI Search resource (only required if using the `AiSearchKnowledgeBase` client). [Create one in the Azure portal](https://portal.azure.com/#create/Microsoft.Search).

## Step 1: Create an Azure OpenAI resource

1. Log in to the [Azure portal](https://portal.azure.com/).
2. Click **Create a resource** and search for **Azure OpenAI**.
3. Select **Azure OpenAI** and click **Create**.
4. Fill in the required fields:
    - **Subscription**: Select your Azure subscription.
    - **Resource group**: Select an existing resource group or create a new one.
    - **Region**: Choose a supported region (e.g., `East US`, `West Europe`).
    - **Name**: Enter a unique name for the resource.
    - **Pricing tier**: Select the appropriate tier.
5. Click **Review + create**, then **Create**.
6. Wait for the deployment to complete.

Azure OpenAI access may require approval. If you haven't already, apply for access at https://aka.ms/oai/access.

## Step 2: Deploy a model

1. Navigate to your Azure OpenAI resource in the Azure portal.
2. Click **Go to Azure OpenAI Studio** (or open [Azure OpenAI Studio](https://oai.azure.com/) directly).
3. In the left sidebar, click **Deployments**, then click **Create new deployment**.
4. Select the model you want to deploy (e.g., `gpt-4o`, `gpt-4`, `text-embedding-ada-002`).
5. Enter a **Deployment name** — this is your `deploymentId`.
6. Configure capacity and click **Create**.

Note the deployment name you choose — you will use it as the `deploymentId` when initializing the connector client.

## Step 3: Get the API key and endpoint

1. In the Azure portal, navigate to your Azure OpenAI resource.
2. In the left sidebar under **Resource Management**, click **Keys and Endpoint**.
3. Copy **KEY 1** (or **KEY 2**) — this is your `apiKey`.
4. Copy the **Endpoint** value (e.g., `https://your-resource.openai.azure.com/`) — this is your `serviceUrl`.

Store the API key securely. Do not commit it to source control. Use Ballerina's `configurable` feature and a `Config.toml` file to supply it at runtime.

## Step 4: Find the API version

The `apiVersion` parameter specifies the Azure OpenAI REST API version to use. Common values include:

- `2024-06-01` (GA)
- `2024-10-21` (GA)
- `2025-01-01-preview` (Preview)

Refer to the [Azure OpenAI API version documentation](https://learn.microsoft.com/en-us/azure/ai-services/openai/reference) for the latest supported versions.

## Step 5: Set up Azure AI search (optional)

If you plan to use the `AiSearchKnowledgeBase` client:

1. Navigate to your Azure AI Search resource in the Azure portal.
2. In the left sidebar, click **Keys**.
3. Copy the **Primary admin key** — this is the `apiKey` for the knowledge base client.
4. Copy the **URL** from the Overview page (e.g., `https://your-search.search.windows.net`) — this is the `serviceUrl` for the knowledge base client.
5. Create or note the name of the search index you want to use — this is the `index` parameter.

The Azure AI Search credentials are separate from the Azure OpenAI credentials. Each client uses its own service URL and API key.
