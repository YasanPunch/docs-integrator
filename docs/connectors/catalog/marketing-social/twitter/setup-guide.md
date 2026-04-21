---
title: Setup Guide
---

# Setup Guide

This guide walks you through creating a Twitter Developer App and obtaining the OAuth 2.0 credentials required to use the Twitter connector.

## Prerequisites

- A Twitter (X) account. If you do not have one, [sign up at x.com](https://x.com).
- A Twitter Developer account with an approved project. [Apply for access here](https://developer.twitter.com/en/apply-for-access).

## Step 1: Create a Twitter developer project

1. Open the [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard).
2. Click on the **Projects & Apps** tab.
3. Select an existing project or click **New Project** to create one.
4. Provide a project name, select a use case, and provide a project description.
5. Within the project, create a new App (or use an existing one).

## Step 2: Set up user authentication settings

1. In your App's settings page, scroll down to the **User authentication settings** section.
2. Click **Set up** to configure user authentication.
3. Select **OAuth 2.0** as the authentication type.
4. Choose the appropriate **App permissions** for your use case (e.g., Read, Read and Write, Read and Write and Direct Messages).
5. Set the **Type of App** to **Web App, Automated App, or Bot**.
6. Provide a **Callback URI / Redirect URL** (e.g., `http://example.com` for development).
7. Provide a **Website URL** for your application.
8. Click **Save**.

Make sure to select the correct app permissions. If you plan to post tweets or send DMs, you need at least Read and Write permissions.

## Step 3: Obtain client ID and client secret

1. After completing the user authentication setup, you will be presented with your **Client ID** and **Client Secret**.
2. Copy and save both values securely.

Store the Client ID and Client Secret securely. Do not commit them to source control.
Use Ballerina's `configurable` feature and a `Config.toml` file to supply them at runtime.

## Step 4: Generate an access token via OAuth 2.0 PKCE flow

Use the OAuth 2.0 Authorization Code with PKCE flow to obtain an access token:

1. Generate a **code verifier** (a random string) and derive a **code challenge** from it.
   - For the `plain` method, the code challenge is the same as the code verifier.
   - For the `S256` method, the code challenge is the base64 URL-encoded SHA256 hash of the verifier.

2. Construct the authorization URL:

    ```
    https://twitter.com/i/oauth2/authorize?response_type=code&client_id=<YOUR_CLIENT_ID>&redirect_uri=<YOUR_REDIRECT_URI>&scope=tweet.read%20tweet.write%20users.read%20follows.read%20dm.read%20dm.write%20offline.access&state=state&code_challenge=<YOUR_CODE_CHALLENGE>&code_challenge_method=plain
    ```

3. Open the URL in a browser and authorize the application.

4. After authorization, copy the `code` parameter from the redirect URL.

5. Exchange the authorization code for an access token:

    ```
    POST https://api.twitter.com/2/oauth2/token
    Content-Type: application/x-www-form-urlencoded

    code=<AUTHORIZATION_CODE>
    &grant_type=authorization_code
    &client_id=<YOUR_CLIENT_ID>
    &redirect_uri=<YOUR_REDIRECT_URI>
    &code_verifier=<YOUR_CODE_VERIFIER>
    ```

6. The response contains `access_token`, `refresh_token` (if `offline.access` scope was requested), and `token_type`. Copy the `access_token`.

Include the `offline.access` scope in your authorization URL to receive a refresh token, which prevents the access token from expiring after 2 hours.

You can also use OAuth 2.0 App-Only authentication (Bearer Token) for endpoints that support it. Refer to the [Twitter API v2 authentication mapping](https://developer.twitter.com/en/docs/authentication/guides/v2-authentication-mapping) for details.
