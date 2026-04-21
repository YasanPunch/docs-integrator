---
title: Setup Guide
---

# Setup Guide

This guide walks you through creating a Stripe account and obtaining the API secret key required to authenticate with the Stripe connector.

## Prerequisites

- A Stripe account. If you do not have one, [sign up for free](https://dashboard.stripe.com/register).

## Step 1: Log in to Stripe

1. Sign in to your [Stripe dashboard](https://dashboard.stripe.com/login).

## Step 2: Navigate to the developer portal

1. Click the **Developers** button in the top-right corner of the Stripe dashboard.

## Step 3: Retrieve your secret key

1. In the Developers section, click **API keys** in the left navigation bar.
2. Locate and copy the **Secret key**. This is the token you will use to authenticate
   the Stripe connector.

If you need more granular permissions, you can set up and use **Restricted keys** instead of the full secret key. Restricted keys allow you to limit access to specific API resources.

Store your secret key securely. Do not commit it to source control. Use Ballerina's `configurable` feature and a `Config.toml` file to supply it at runtime.

For testing purposes, use the test-mode secret key (prefixed with `sk_test_`). Switch to the live-mode key (prefixed with `sk_live_`) when you are ready for production.
