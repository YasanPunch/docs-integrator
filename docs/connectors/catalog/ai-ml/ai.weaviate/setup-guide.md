---
title: Setup Guide
---

# Setup Guide

This guide walks you through creating a Weaviate Cloud account, setting up a cluster, and obtaining the API key and service URL required to use the Weaviate connector.

## Prerequisites

- A Weaviate Cloud account. If you do not have one, [sign up for a free account at weaviate.io](https://weaviate.io/).

## Step 1: Create a Weaviate cloud account

1. Go to [weaviate.io](https://weaviate.io/) and click **Sign Up** or **Get Started Free**.
2. Register using your email address or a supported SSO provider.
3. Verify your email address to activate the account.

## Step 2: Create a cluster

1. Log in to the [Weaviate Cloud Console](https://console.weaviate.cloud/).
2. Click **Create Cluster**.
3. Choose a cluster name and configure your preferred settings (region, tier).
4. Click **Create** and wait for the cluster to be provisioned.
5. Once the cluster is ready, copy the **REST Endpoint URL** — this is your `serviceUrl`.

The REST Endpoint URL typically looks like `https://<cluster-name>.<region>.weaviate.cloud`.

## Step 3: Generate an API key

1. In the Weaviate Cloud Console, navigate to your cluster's dashboard.
2. Go to the **API Keys** section.
3. Click **Generate API Key** (or copy the existing admin key if one was created with the cluster).
4. Securely save the generated API key — this is the `apiKey` you will use to authenticate.

Store the API key securely. Do not commit it to source control. Use Ballerina's `configurable` feature and a `Config.toml` file to supply it at runtime.

## Step 4: Create a collection

1. In the Weaviate Cloud Console or using the Weaviate REST API, create a collection (class) for your data.
2. Define the collection schema with the properties you need (e.g., a text field for content, metadata fields for filtering).
3. Note the **collection name** — you will use it as the `collectionName` in the connector configuration.

The collection must exist in your Weaviate instance before the connector can add or query data. Ensure the collection schema includes the properties that match the metadata fields you plan to use.
