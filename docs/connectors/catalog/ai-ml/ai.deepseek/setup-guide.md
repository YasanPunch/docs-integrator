---
title: Setup Guide
---

# Setup Guide

This guide walks you through creating a DeepSeek account and obtaining the API key required to use the DeepSeek connector.

## Prerequisites

- A DeepSeek account. If you do not have one, [sign up at the DeepSeek Platform](https://platform.deepseek.com/).

## Step 1: Sign in to the DeepSeek platform

1. Go to the [DeepSeek Platform](https://platform.deepseek.com/).
2. Sign in with your DeepSeek account credentials.

## Step 2: Generate an API key

1. Navigate to the **API Keys** section in the left sidebar.
2. Click **Create new API key**.
3. Enter a name for your API key (e.g., `Ballerina Connector`).
4. Click **Create**.
5. Copy the generated API key immediately — it will not be shown again.

Store your API key securely. Do not commit it to source control. Use Ballerina's `configurable` feature and a `Config.toml` file to supply it at runtime.

## Step 3: Add credits (if needed)

1. Navigate to the **Billing** section in the left sidebar.
2. Check your current balance. DeepSeek API usage is billed based on token consumption.
3. Add credits if your balance is insufficient for your expected usage.

DeepSeek may offer free trial credits for new accounts. Check the Billing section for details.
