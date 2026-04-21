---
title: Setup Guide
---

# Setup Guide

This guide walks you through setting up a Snowflake account, creating a warehouse and database, and obtaining the credentials required to use the Snowflake connector.

## Prerequisites

- A Snowflake account. If you do not have one, [sign up for a free trial](https://signup.snowflake.com/).

## Step 1: Log in and note your account identifier

1. Log in to your Snowflake account at [app.snowflake.com](https://app.snowflake.com/).
2. Note your **Account Identifier** from the URL. It follows the format `<orgname>-<account_name>` (e.g., `myorg-myaccount`).
3. You can also find it under **Admin > Accounts** in the Snowflake UI.

The account identifier is the value before `.snowflakecomputing.com` in your Snowflake URL.

## Step 2: Create a warehouse

1. In the Snowflake UI, navigate to **Admin > Warehouses**.
2. Click **+ Warehouse** to create a new warehouse.
3. Enter a name (e.g., `BALLERINA_WH`), select a size, and click **Create Warehouse**.
4. Alternatively, run the following SQL in a worksheet:

    ```
    CREATE WAREHOUSE BALLERINA_WH
      WITH WAREHOUSE_SIZE = 'XSMALL'
      AUTO_SUSPEND = 300
      AUTO_RESUME = TRUE;
    ```

## Step 3: Create a database and schema

1. Navigate to **Data > Databases** in the Snowflake UI.
2. Click **+ Database** and enter a name (e.g., `MY_DB`).
3. A default schema named `PUBLIC` is created automatically.
4. Alternatively, run the following SQL:

    ```
    CREATE DATABASE MY_DB;
    USE DATABASE MY_DB;
    CREATE SCHEMA MY_SCHEMA;
    ```

## Step 4: Set up user credentials

For **basic authentication**, use your Snowflake username and password.

For **key-pair authentication** (recommended for production):

1. Generate an RSA key pair using OpenSSL:

    ```
    openssl genrsa 2048 | openssl pkcs8 -topk8 -v2 aes256 -inform PEM -out key-aes256.p8
    openssl rsa -in key-aes256.p8 -pubout -out key-aes256.pub
    ```

2. Copy the public key content (without the header/footer lines).
3. Assign the public key to your Snowflake user:

    ```
    ALTER USER my_user SET RSA_PUBLIC_KEY='MIIBIjANBg...';
    ```

When using key-pair authentication, use the `AdvancedClient` with a `KeyBasedAuth` config instead of the basic `Client`.

## Step 5: Configure Java environment

The Snowflake JDBC driver requires a specific JVM option. Set the following environment variable before running your application:

```
export JDK_JAVA_OPTIONS="--add-opens java.base/java.nio=ALL-UNNAMED"
```

Additionally, set the `JDBC_QUERY_RESULT_FORMAT` property to `JSON` in the connector's `Options` to avoid serialization issues.

Without the `JDK_JAVA_OPTIONS` setting, the connector may fail at runtime with module access errors.
