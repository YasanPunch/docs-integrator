---
title: Setup Guide
---

# Setup Guide

This guide walks you through creating a HubSpot developer app and obtaining the OAuth 2.0 credentials required to use the HubSpot CRM Pipelines connector.

## Prerequisites

- A HubSpot developer account. If you do not have one, [sign up at the HubSpot Developer Portal](https://developers.hubspot.com/get-started).

## Create a HubSpot developer account and test account

1. Go to the [HubSpot Developer Portal](https://developers.hubspot.com/get-started) and sign up or log in.
2. Once logged in, navigate to **Test accounts** in the left sidebar and create a developer test account if you don't already have one. This provides a sandbox environment for testing.

A developer test account lets you test API integrations without affecting production data.

## Create a HubSpot app

1. In the HubSpot Developer Portal, navigate to **Apps** in the left sidebar.
2. Click **Create app**.
3. Enter an **App name** (e.g., `Ballerina Pipelines Connector`).
4. Go to the **Auth** tab.
5. Under **Redirect URLs**, add a redirect URI (e.g., `http://localhost:9090` for development).
6. Under **Scopes**, add the required scopes for the Pipelines API. Common scopes include:
    - `crm.objects.orders.read`
    - `crm.schemas.orders.write`
    - `crm.objects.deals.read`
    - `crm.objects.deals.write`
7. Click **Save**.
8. Copy the **Client ID** and **Client Secret** from the Auth tab.

The exact scopes required depend on which object types (deals, tickets, orders) you plan to manage pipelines for. Add the appropriate read and write scopes for each object type.

## Generate a refresh token

Use the HubSpot OAuth 2.0 Authorization Code flow to obtain a refresh token:

1. Construct the following authorization URL, replacing the placeholders:

    ```
    https://app.hubspot.com/oauth/authorize?client_id=<YOUR_CLIENT_ID>&scope=&redirect_uri=<YOUR_REDIRECT_URI>
    ```

2. Open the URL in a browser and log in with your HubSpot credentials.
3. Select the test account (or target account) when prompted and authorize the app.
4. After authorization, HubSpot redirects to your redirect URI with a `code` query parameter. Copy the `code` value.
5. Exchange the authorization code for tokens using a POST request:

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

Use a tool like [Postman](https://www.postman.com/) or `curl` to perform the token exchange in step 5.

Store the Client ID, Client Secret, and Refresh Token securely. Do not commit them to source control. Use Ballerina's `configurable` feature and a `Config.toml` file to supply them at runtime.

## Next steps

- [Actions Reference](action-reference.md) - Available operations
