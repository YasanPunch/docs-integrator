---
title: Setup Guide
---

# Setup Guide

This guide walks you through creating a HubSpot app and obtaining the OAuth 2.0 credentials required to use the HubSpot Marketing Subscriptions connector.

## Prerequisites

- A HubSpot account with admin access. If you do not have one, [sign up for a free HubSpot account](https://app.hubspot.com/signup).
- A HubSpot developer account for creating apps. [Create a developer account](https://developers.hubspot.com/get-started) if you don't have one.

## Step 1: Create a HubSpot app

1. Log in to your [HubSpot developer account](https://app.hubspot.com/developer).
2. Navigate to **Apps** in the top navigation.
3. Click **Create app**.
4. Under **App Info**, enter a name for your app (e.g., `Ballerina Subscriptions Connector`).
5. Optionally add a description and logo.

## Step 2: Configure OAuth scopes

1. In your app settings, go to the **Auth** tab.
2. Under **Scopes**, add the following required scopes:
    - `communication_preferences.read_write`
    - `communication_preferences.statuses.batch.read`
    - `communication_preferences.statuses.batch.write`
3. Note the **Client ID** and **Client Secret** displayed on this page.

Store the Client ID and Client Secret securely. Do not commit them to source control. Use Ballerina's `configurable` feature and a `Config.toml` file to supply them at runtime.

## Step 3: Authorize and generate a refresh token

Use the HubSpot OAuth 2.0 Authorization Code flow to obtain a refresh token:

1. Construct the following authorization URL, replacing the placeholders:

    ```
    https://app.hubspot.com/oauth/authorize?client_id=<YOUR_CLIENT_ID>&redirect_uri=<YOUR_REDIRECT_URI>&scope=communication_preferences.read_write%20communication_preferences.statuses.batch.read%20communication_preferences.statuses.batch.write
    ```

2. Open the URL in a browser and log in with your HubSpot credentials.
3. Select the HubSpot account you want to connect and click **Choose Account**.
4. After authorization, HubSpot redirects to your redirect URI with a `code` query parameter. Copy the `code` value.
5. Exchange the code for tokens using a POST request:

    ```
    POST https://api.hubapi.com/oauth/v1/token
    Content-Type: application/x-www-form-urlencoded

    grant_type=authorization_code
    &code=<AUTHORIZATION_CODE>
    &client_id=<YOUR_CLIENT_ID>
    &client_secret=<YOUR_CLIENT_SECRET>
    &redirect_uri=<YOUR_REDIRECT_URI>
    ```

6. The response contains `access_token` and `refresh_token`. Copy the `refresh_token`.

HubSpot refresh tokens do not expire by default, but access tokens expire after 30 minutes. The connector handles token refresh automatically using the refresh token.
