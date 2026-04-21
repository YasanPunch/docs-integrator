---
title: Setup Guide
---

# Setup Guide

This guide walks you through enabling the Gmail API in Google Cloud and obtaining the OAuth 2.0 credentials required to use the Gmail connector.

## Prerequisites

- A Google account. If you do not have one, [create a Google account](https://accounts.google.com/signup).
- Access to the [Google Cloud Console](https://console.cloud.google.com/).

## Step 1: Create a Google cloud project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project dropdown at the top of the page and select **New Project**.
3. Enter a **Project name** (e.g., `Ballerina Gmail Integration`).
4. Click **Create** and wait for the project to be provisioned.
5. Make sure the newly created project is selected in the project dropdown.

## Step 2: Enable the Gmail API

1. In the Google Cloud Console, navigate to **APIs & Services > Library**.
2. Search for **Gmail API**.
3. Click on **Gmail API** in the results and then click **Enable**.

## Step 3: Configure the OAuth consent screen

1. Navigate to **APIs & Services > OAuth consent screen**.
2. Select **External** as the user type (or **Internal** if using Google Workspace) and click **Create**.
3. Fill in the required fields:
    - **App name**: Enter a name (e.g., `Ballerina Gmail Connector`).
    - **User support email**: Select your email address.
    - **Developer contact information**: Enter your email address.
4. Click **Save and Continue**.
5. On the **Scopes** page, click **Add or Remove Scopes** and add the following scope:
    - `https://mail.google.com/`
6. Click **Update**, then **Save and Continue**.
7. On the **Test users** page, click **Add Users**, enter your Gmail address, and click **Save and Continue**.
8. Review the summary and click **Back to Dashboard**.

For production use, you will need to submit your app for Google verification. During development, the app works for test users you add in step 7.

## Step 4: Create OAuth client credentials

1. Navigate to **APIs & Services > Credentials**.
2. Click **Create Credentials** and select **OAuth client ID**.
3. Set **Application type** to **Web application**.
4. Enter a **Name** (e.g., `Ballerina Gmail Client`).
5. Under **Authorized redirect URIs**, add:
    ```
    https://developers.google.com/oauthplayground
    ```
6. Click **Create**.
7. Copy the **Client ID** and **Client Secret** from the dialog that appears.

Store the Client ID and Client Secret securely. Do not commit them to source control. Use Ballerina's `configurable` feature and a `Config.toml` file to supply them at runtime.

## Step 5: Obtain a refresh token

1. Go to the [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground).
2. Click the gear icon (⚙️) in the top-right corner and check **Use your own OAuth credentials**.
3. Enter your **Client ID** and **Client Secret** from the previous step.
4. In the **Step 1** panel on the left, find **Gmail API v1** and select the scope:
    - `https://mail.google.com/`
5. Click **Authorize APIs** and sign in with your Google account.
6. Grant the requested permissions when prompted.
7. In the **Step 2** panel, click **Exchange authorization code for tokens**.
8. Copy the **Refresh Token** from the response.

The refresh token may expire if your OAuth consent screen is in testing mode and the token is not used for 7 days. For long-lived tokens, consider publishing your app or using a service account.
