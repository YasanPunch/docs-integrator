---
title: Setup Guide
---

# Setup Guide

This guide walks you through creating an Anthropic account and obtaining the API key required to use the Anthropic LLM connector.

## Prerequisites

- An active Anthropic account. If you do not have one, [sign up at anthropic.com](https://www.anthropic.com/signup).

## Step 1: Create an Anthropic account

1. Go to [https://www.anthropic.com/signup](https://www.anthropic.com/signup).
2. Sign up using your email address or a supported SSO provider.
3. Verify your email address to activate your account.

## Step 2: Navigate to the API keys page

1. Log in to the [Anthropic Console](https://console.anthropic.com/).
2. Click on **API Keys** in the left-hand sidebar (or navigate to **Settings > API Keys**).

## Step 3: Generate a new API key

1. Click **Create Key**.
2. Give your key a descriptive name (e.g., `Ballerina Connector`).
3. Copy the generated API key immediately — it will not be shown again.

Store the API key securely. Do not commit it to source control. Use Ballerina's `configurable` feature and a `Config.toml` file to supply it at runtime.

New Anthropic accounts may include free trial credits. For production use, you will need to add a payment method under the Billing section of the Anthropic Console.
