---
title: Setup Guide
---

# Setup Guide

This guide walks you through provisioning a Microsoft SQL Server instance and creating the database and login credentials required by the AI Memory MSSQL connector.

## Prerequisites

- Access to a Microsoft SQL Server instance (on-premises, Azure SQL Database, or a Docker-based SQL Server).

## Step 1: Provision a SQL server instance

Choose one of the following options to obtain a running SQL Server instance:

**Option A — Docker (local development):**
1. Pull and start the official SQL Server container:
    ```
    docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=<YourStrong@Password>" \
      -p 1433:1433 --name sqlserver -d mcr.microsoft.com/mssql/server:2022-latest
    ```
2. The server is now reachable at `localhost:1433` with user `sa` and the password you set.

**Option B — Azure SQL Database:**
1. In the Azure Portal, navigate to **Create a resource → SQL Database**.
2. Choose or create a **SQL Server** (logical server), set an admin login and password.
3. After deployment, note the **Server name** (e.g., `myserver.database.windows.net`).

The `sa` account has full administrative privileges. For production workloads, create a dedicated database user with least-privilege access instead.

## Step 2: Create a database

Connect to your SQL Server instance using SQL Server Management Studio (SSMS), Azure Data
Studio, or the `sqlcmd` command-line tool, then run:

```sql
CREATE DATABASE AgentMemory;
```

Replace `AgentMemory` with your preferred database name. Note this value — it maps to the
`database` field in `DatabaseConfiguration`.

## Step 3: Create a dedicated database user (recommended)

Instead of using the `sa` account, create a scoped login and user:

```sql
-- Create a server-level login
CREATE LOGIN memory_user WITH PASSWORD = '';

-- Switch to your database
USE AgentMemory;

-- Create a database user mapped to the login
CREATE USER memory_user FOR LOGIN memory_user;

-- Grant the minimum required permissions
ALTER ROLE db_datareader ADD MEMBER memory_user;
ALTER ROLE db_datawriter ADD MEMBER memory_user;
GRANT CREATE TABLE TO memory_user;
```

Note the login name, password, and database name — these are used in `DatabaseConfiguration`.

The connector auto-creates the `ChatMessages` table on first initialisation, so the `CREATE TABLE` permission is only required once. You may revoke it after the first run if your security policy requires it.

## Step 4: Configure firewall / network access

Ensure the host running your Ballerina service can reach SQL Server on port `1433`:

- **Docker:** Map port `1433` with `-p 1433:1433` (already done in Step 1).
- **Azure SQL:** In the Azure Portal, open your SQL Server resource → **Networking** →
  add a firewall rule for your client IP, or enable **Allow Azure services and resources
  to access this server** for cloud-hosted Ballerina deployments.
- **On-premises:** Confirm the Windows Firewall or network firewall allows inbound TCP
  connections on port `1433` to the SQL Server host.

## Step 5: Collect connection details

Gather the following values — you will supply them as Ballerina `configurable` variables:

| Field | Example value |
|-------|---------------|
| `host` | `localhost` or `myserver.database.windows.net` |
| `user` | `memory_user` |
| `password` | `` |
| `database` | `AgentMemory` |
| `port` | `1433` (default) |
| `instance` | Named instance, e.g. `SQLEXPRESS` (optional) |

Store sensitive values in a `Config.toml` file and never commit them to source control. Use Ballerina's `configurable` feature to inject them at runtime.
