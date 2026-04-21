---
title: Setup Guide
---

# Setup Guide

This guide walks you through obtaining the credentials required to use the NP connector with either OpenAI or Azure OpenAI as your model provider.

## Prerequisites

- An active OpenAI account for the OpenAI provider, or an Azure subscription with Azure OpenAI service access for the Azure OpenAI provider.

## Step 1: Generate an OpenAI API key (OpenAI provider)

1. Log in to your account at [platform.openai.com](https://platform.openai.com/).
2. Click on your profile icon in the top-right corner and select **API keys**.
3. Click **Create new secret key**.
4. Give the key a descriptive name and click **Create secret key**.
5. Copy the generated API key immediately — it will not be shown again.
6. Note the model name you intend to use (e.g., `gpt-4o`). Available models are listed in the [OpenAI Models documentation](https://platform.openai.com/docs/models).

Store the API key securely. Use Ballerina's `configurable` feature and a `Config.toml` file to supply it at runtime rather than hardcoding it in source code.

## Step 2: Create an Azure OpenAI resource (Azure OpenAI provider)

1. Log in to the [Azure Portal](https://portal.azure.com/).
2. In the search bar, type **Azure OpenAI** and select the service.
3. Click **Create** and fill in the required fields:
    - **Subscription**: Select your Azure subscription.
    - **Resource Group**: Create a new resource group or select an existing one.
    - **Region**: Select a supported region.
    - **Name**: Enter a unique name for the resource.
    - **Pricing Tier**: Select the appropriate tier.
4. Click **Review + Create**, then **Create** to provision the resource.

## Step 3: Deploy a model in Azure OpenAI studio (Azure OpenAI provider)

1. Navigate to your Azure OpenAI resource in the Azure Portal.
2. Under **Resource Management**, click **Model Deployments**.
3. Click **Manage Deployments** to open Azure OpenAI Studio.
4. In Azure OpenAI Studio, go to **Deployments** and click **Deploy model**.
5. Select a base model (e.g., `gpt-4o`) and enter a **Deployment name** — this becomes your `deploymentId`.
6. Click **Deploy** to complete the deployment.

The `deploymentId` is the custom name you assign to the deployment, not the model name itself.

## Step 4: Retrieve Azure OpenAI credentials (Azure OpenAI provider)

1. In the Azure Portal, navigate to your Azure OpenAI resource.
2. Under **Resource Management**, click **Keys and Endpoint**.
3. Copy **Key 1** — this is your `apiKey`.
4. Copy the **Endpoint** URL — this is your `serviceUrl` (e.g., `https://<resource-name>.openai.azure.com/`).
5. Note the **API version** you want to use (e.g., `2024-02-15-preview`). Refer to the Azure OpenAI API reference for the list of supported versions.
