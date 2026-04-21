---
title: Setup Guide
---

# Setup Guide

This guide walks you through creating an OpenAI account and obtaining the API key required to use the OpenAI connector.

## Prerequisites

- An active OpenAI account. If you do not have one, [sign up at platform.openai.com](https://platform.openai.com/signup).

## Step 1: Create an OpenAI account

1. Go to [https://platform.openai.com/signup](https://platform.openai.com/signup).
2. Sign up using your email address, Google account, Microsoft account, or Apple ID.
3. Verify your email address and complete the onboarding steps.

## Step 2: Navigate to the API keys page

1. Log in to the [OpenAI Platform](https://platform.openai.com/).
2. Click on your profile icon in the top-right corner and select **API keys** (or navigate to **Settings > API Keys**).

## Step 3: Generate a new API key

1. Click **Create new secret key**.
2. Give your key a descriptive name (e.g., `Ballerina OpenAI Connector`).
3. Optionally select the project and permissions for the key.
4. Click **Create secret key**.
5. Copy the generated API key immediately — it will not be shown again.

Store the API key securely. Do not commit it to source control. Use Ballerina's `configurable` feature and a `Config.toml` file to supply it at runtime.

OpenAI offers free trial credits for new accounts. For production use, you will need to add a payment method under the Billing section of the OpenAI Platform.
