---
title: Setup Guide
---

# Setup Guide

This guide walks you through creating a Shopify development store and obtaining the Admin API access token required to use the Shopify Admin connector.

## Prerequisites

- A Shopify account. If you do not have one, [sign up at the Shopify signup portal](https://accounts.shopify.com/signup).
- Membership in the [Shopify Partner Program](https://www.shopify.com/partners) to access development tools.

## Step 1: Create a new organization

1. Log in to the [Shopify Partner Dashboard](https://partners.shopify.com/).
2. Connect to an existing organization or create a new one.
3. Follow the on-screen instructions, provide your main focus as a Shopify partner, and enter your business contact details.
4. Finalize the organization setup.

## Step 2: Create a development store

1. In the Shopify Partner Dashboard, select **Create a new store**.
2. Enter store details and assign a unique store name.
3. Select the appropriate account type for your development needs.
4. Complete the store setup by following the on-screen instructions.

A development store is free and intended for testing and development purposes.

## Step 3: Create a new app

1. In your development store admin, go to **Settings** > **Apps and sales channels**.
2. Select **Develop apps**.
3. Click **Allow custom app development** if prompted.
4. Click **Create an app**, enter an app name, and confirm.

## Step 4: Configure admin API scopes and generate access token

1. Once the app is created, select **Configure Admin API scopes**.
2. Select the scopes you need for your integration (e.g., `read_products`, `write_products`, `read_orders`, `write_orders`, `read_customers`, `write_customers`).
3. Click **Save** to apply the scopes.
4. Click **Install app** to generate an Admin API access token.
5. Click **Reveal token once** to copy and save the token securely.

The access token is shown only once. Copy it immediately and store it securely. Do not commit it to source control.

Use Ballerina's `configurable` feature and a `Config.toml` file to supply the access token at runtime.

## Step 5: Get your store URL

Your store URL follows this pattern:

```
https://<your-store-name>.myshopify.com
```

You can find it in the browser address bar when viewing your Shopify admin dashboard.
