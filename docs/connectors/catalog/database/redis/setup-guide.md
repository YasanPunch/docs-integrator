---
title: Setup Guide
---

# Setup Guide

This guide walks you through setting up a Redis server and obtaining the connection details required to use the Redis connector.

## Prerequisites

- A running Redis server (v6.x or later recommended). You can [download Redis](https://redis.io/download) or use a managed service such as [Redis Cloud](https://redis.com/try-free/), [Amazon ElastiCache](https://aws.amazon.com/elasticache/), or [Azure Cache for Redis](https://azure.microsoft.com/en-us/products/cache).

## Step 1: Install and start Redis

If you are running Redis locally:

1. Download and install Redis from [redis.io/download](https://redis.io/download).
2. Start the Redis server:

    ```
    redis-server
    ```

3. Verify the server is running by connecting with the CLI:

    ```
    redis-cli ping
    ```

   You should see `PONG` in the response.

For macOS, you can install Redis with Homebrew: `brew install redis && brew services start redis`.

## Step 2: Configure authentication (optional)

By default, Redis does not require authentication. To enable it:

1. Open the Redis configuration file (`redis.conf`).
2. Set a password using the `requirepass` directive:

    ```
    requirepass your_secure_password
    ```

3. Optionally, configure an ACL user with specific permissions:

    ```
    user myuser on >mypassword ~* +@all
    ```

4. Restart the Redis server to apply the changes.

Always enable authentication for production deployments. An unprotected Redis server exposed to the internet is a serious security risk.

## Step 3: Enable tLS/SSL (optional)

For encrypted connections:

1. Generate or obtain TLS certificates (CA cert, server cert, and server key).
2. Configure Redis with TLS in `redis.conf`:

    ```
    tls-port 6380
    tls-cert-file /path/to/redis.crt
    tls-key-file /path/to/redis.key
    tls-ca-cert-file /path/to/ca.crt
    ```

3. Restart the Redis server.

When using TLS, connect to the `tls-port` (default 6380) instead of the standard port (6379).

## Step 4: Note your connection details

Collect the following details for configuring the Ballerina client:

- **Host**: The Redis server hostname or IP address (default: `localhost`).
- **Port**: The Redis server port (default: `6379`, or `6380` for TLS).
- **Password**: The authentication password, if configured.
- **Username**: The ACL username, if using Redis ACLs (Redis 6.0+).

For managed Redis services, find these details in your cloud provider's console.
