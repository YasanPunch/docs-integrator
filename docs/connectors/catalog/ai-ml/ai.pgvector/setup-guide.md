---
title: Setup Guide
---

# Setup Guide

This guide walks you through setting up a PostgreSQL instance with the pgvector extension required to use the pgvector connector.

## Prerequisites

- A running PostgreSQL instance (v12 or later). You can use a managed service or a local installation.
- The pgvector extension installed on your PostgreSQL server. See [pgvector installation instructions](https://github.com/pgvector/pgvector#installation).

## Step 1: Set up PostgreSQL with pgvector

The simplest way to get started is using the official pgvector Docker image:

```
docker run -d --name pgvector \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=your_database \
  -p 5432:5432 \
  pgvector/pgvector:pg17
```

This starts a PostgreSQL 17 instance with the pgvector extension pre-installed.

If you already have a PostgreSQL instance, you can install the pgvector extension manually. Refer to the [pgvector GitHub repository](https://github.com/pgvector/pgvector) for build and install instructions.

## Step 2: Enable the pgvector extension

Connect to your PostgreSQL database and enable the pgvector extension:

```
psql -h localhost -U postgres -d your_database
```

Then run:

```
CREATE EXTENSION IF NOT EXISTS vector;
```

This registers the `vector` data type and distance operators used by the connector.

The connector automatically runs `CREATE EXTENSION IF NOT EXISTS vector` during initialization, but you may need superuser privileges for the first-time extension creation.

## Step 3: Create a database user (optional)

For production use, create a dedicated database user with appropriate permissions:

```
CREATE USER connector_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE your_database TO connector_user;
```

Grant schema-level permissions as needed:

```
GRANT ALL ON SCHEMA public TO connector_user;
```

Avoid using the PostgreSQL superuser in production. Create a dedicated user with the minimum required privileges.

## Step 4: Note your connection details

Gather the following connection details for configuring the Ballerina connector:

- **Host**: The hostname or IP address of your PostgreSQL server (e.g., `localhost`).
- **Port**: The port number (default: `5432`).
- **Database**: The name of the database where vectors will be stored.
- **Username**: The database user.
- **Password**: The user's password.
