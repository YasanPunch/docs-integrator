---
title: Setup Guide
---

# Setup Guide

This guide walks you through creating a HubSpot App and obtaining the OAuth 2.0 credentials required to use the HubSpot CRM Commerce Carts connector.

## Prerequisites

- A HubSpot account with access to a CRM instance. If you do not have one, [sign up for a free HubSpot account](https://app.hubspot.com/signup).
- A HubSpot Developer account. If you do not have one, [register as a HubSpot developer](https://developers.hubspot.com/get-started).

## Create a HubSpot app

1. Log in to the [HubSpot Developer Portal](https://app.hubspot.com/developer).
2. Click **Apps** in the top navigation bar.
3. Click **Create app**.
4. Fill in the **App Info** tab with a name (e.g., `Ballerina Carts Connector`) and description.
5. Navigate to the **Auth** tab.

## Configure OAuth scopes

1. On the **Auth** tab, locate the **Scopes** section.
2. Add the following scopes:
    - `crm.objects.carts.read`
    - `crm.objects.carts.write`
3. Note the **Client ID** and **Client Secret** displayed at the top of the Auth tab.

Store the Client ID and Client Secret securely. Do not commit them to source control. Use Ballerina's `configurable` feature and a `Config.toml` file to supply them at runtime.

## Set the redirect URI

1. Under **Redirect URLs** on the Auth tab, click **Add redirect URL**.
2. Enter your redirect URI (e.g., `https://localhost:9090/callback` for local development).
3. Click **Save**.

## Obtain a refresh token

Use the HubSpot OAuth 2.0 Authorization Code flow to obtain a refresh token:

1. Construct the following authorization URL, replacing the placeholders:

    ```
    https://app.hubspot.com/oauth/authorize?client_id=<YOUR_CLIENT_ID>&scope=crm.objects.carts.read%20crm.objects.carts.write&redirect_uri=<YOUR_REDIRECT_URI>
    ```

2. Open the URL in a browser and select the HubSpot account to authorize.
3. After authorization, HubSpot redirects to your redirect URI with a `code` query parameter. Copy the `code` value.
4. Exchange the code for tokens using a POST request:

    ```
    POST https://api.hubapi.com/oauth/v1/token
    Content-Type: application/x-www-form-urlencoded

    grant_type=authorization_code
    &code=<AUTHORIZATION_CODE>
    &client_id=<YOUR_CLIENT_ID>
    &client_secret=<YOUR_CLIENT_SECRET>
    &redirect_uri=<YOUR_REDIRECT_URI>
    ```

5. The response contains `access_token` and `refresh_token`. Copy the `refresh_token`.

Use a tool like [Postman](https://www.postman.com/) or `curl` to perform the token exchange in step 4.

The refresh token does not expire by default, but can be revoked. Store it securely alongside your Client ID and Client Secret.

## Next steps

- [Actions Reference](action-reference.md) - Available operations
