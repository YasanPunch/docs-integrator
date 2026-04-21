---
title: Setup Guide
---

# Setup Guide

This guide walks you through creating a Google Cloud project, enabling the Pub/Sub API, and generating a service account key to authenticate the connector.

## Prerequisites

- A Google Cloud account. If you do not have one, [sign up for a free account](https://cloud.google.com/free).
- A Google Cloud project with billing enabled.

## Step 1: Enable the pub/Sub API

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Select your project from the project selector at the top of the page.
3. In the navigation menu, go to **APIs & Services** > **Library**.
4. Search for **Cloud Pub/Sub API**.
5. Click **Cloud Pub/Sub API** and then click **Enable**.

## Step 2: Create a pub/Sub topic

1. In the Google Cloud Console, navigate to **Pub/Sub** > **Topics**.
2. Click **Create Topic**.
3. Enter a **Topic ID** (e.g., `my-topic`).
4. Configure any additional settings (message retention, schema) as needed.
5. Click **Create**.

## Step 3: Create a subscription

1. In the Google Cloud Console, navigate to **Pub/Sub** > **Subscriptions**.
2. Click **Create Subscription**.
3. Enter a **Subscription ID** (e.g., `my-subscription`).
4. Select the topic you created in the previous step.
5. Configure the delivery type as **Pull**.
6. Adjust acknowledgment deadline and other settings as needed.
7. Click **Create**.

The subscription name you set here is the value you will use in the `@pubsub:ServiceConfig` annotation's `subscription` field.

## Step 4: Create a service account and download the key

1. In the Google Cloud Console, navigate to **IAM & Admin** > **Service Accounts**.
2. Click **Create Service Account**.
3. Enter a name (e.g., `pubsub-connector`) and click **Create and Continue**.
4. Assign the **Pub/Sub Editor** role (or **Pub/Sub Publisher** and **Pub/Sub Subscriber** roles separately for least-privilege access).
5. Click **Done**.
6. Click the newly created service account, then go to the **Keys** tab.
7. Click **Add Key** > **Create new key** > **JSON** > **Create**.
8. A JSON key file will be downloaded to your computer. Store it securely.

Store the JSON key file securely and do not commit it to source control. Reference it via a file path in your Ballerina configuration.

The JSON key file grants access to your Google Cloud resources. Treat it like a password.
