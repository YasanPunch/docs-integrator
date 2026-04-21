---
title: Setup Guide
---

# Setup Guide

This guide walks you through creating a HubSpot app and obtaining the OAuth 2.0 credentials required to use the HubSpot Marketing Events connector.

## Prerequisites

- A HubSpot account with Marketing Hub access. If you do not have one, [sign up for a free HubSpot account](https://app.hubspot.com/signup).
- A HubSpot developer account. If you do not have one, [create a developer account](https://developers.hubspot.com/get-started).

## Step 1: Create a HubSpot app

1. Log in to your [HubSpot developer account](https://app.hubspot.com/developer).
2. Click **Apps** in the top navigation.
3. Click **Create app**.
4. Under **App Info**, fill in the **Public app name** (e.g., `Ballerina Marketing Events Integration`).
5. Optionally add a description and logo.

## Step 2: Configure OAuth settings

1. Navigate to the **Auth** tab of your app.
2. Under **Redirect URLs**, add a redirect URL (e.g., `https://localhost/callback`).
3. Under **Scopes**, add the following required scopes:
    - **crm.objects.marketing_events.read**
    - **crm.objects.marketing_events.write**
4. Copy the **Client ID** and **Client Secret** from the top of the Auth tab.

The Client ID and Client Secret are displayed at the top of the Auth tab as soon as the app is created.

## Step 3: Authorize the app and get a refresh token

1. Construct the following authorization URL, replacing the placeholders:

    ```
    https://app.hubspot.com/oauth/authorize?client_id=<YOUR_CLIENT_ID>&redirect_uri=<YOUR_REDIRECT_URI>&scope=crm.objects.marketing_events.read%20crm.objects.marketing_events.write
    ```

2. Open the URL in a browser and select the HubSpot account to authorize.
3. Click **Grant access** when prompted.
4. After authorization, HubSpot redirects to your redirect URL with a `code` query parameter. Copy the `code` value.
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

Store the Client ID, Client Secret, and Refresh Token securely. Do not commit them to source control.
Use Ballerina's `configurable` feature and a `Config.toml` file to supply them at runtime.
