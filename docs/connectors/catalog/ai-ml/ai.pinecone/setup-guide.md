---
title: Setup Guide
---

# Setup Guide

This guide walks you through creating a Pinecone account, setting up an index, and obtaining the API key and service URL required to use the Pinecone connector.

## Prerequisites

- A Pinecone account. If you do not have one, [sign up for free](https://www.pinecone.io/start/).

## Step 1: Create a Pinecone index

1. Log in to the [Pinecone Console](https://app.pinecone.io/).
2. In the left sidebar, click **Indexes**, then click **Create Index**.
3. Enter a name for your index (e.g., `my-vectors`).
4. Set the **Dimensions** to match your embedding model's output size (e.g., `1536` for OpenAI `text-embedding-ada-002`).
5. Select a **Metric** (e.g., `cosine`, `euclidean`, or `dotproduct`).
6. Choose your deployment option (Starter, Standard, or Enterprise) and region.
7. Click **Create Index**.

The index may take a few moments to initialize. Wait until the status shows **Ready** before proceeding.

## Step 2: Obtain your API key

1. In the Pinecone Console, click **API Keys** in the left sidebar.
2. Copy your default API key, or click **Create API Key** to generate a new one.
3. Store the API key securely — this is the `apiKey` value you will use to authenticate.

Store the API key securely. Do not commit it to source control. Use Ballerina's `configurable` feature and a `Config.toml` file to supply it at runtime.

## Step 3: Get the index service URL

1. In the Pinecone Console, navigate to **Indexes** and click on your index name.
2. In the index details page, locate the **Host** value (e.g., `https://my-vectors-abc1234.svc.us-east-1-aws.pinecone.io`).
3. Copy this URL — this is the `serviceUrl` value you will use to connect.
