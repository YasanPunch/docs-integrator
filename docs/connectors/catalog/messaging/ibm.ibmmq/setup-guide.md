---
title: Setup Guide
---

# Setup Guide

This guide walks you through setting up an IBM MQ queue manager and creating the queues and topics required to use the IBM MQ connector.

## Prerequisites

- An IBM MQ server instance. You can [download IBM MQ](https://www.ibm.com/products/mq) or run it as a Docker container using the `icr.io/ibm-messaging/mq:latest` image.

## Step 1: Start an IBM MQ queue manager

If using Docker, start a queue manager with the following command:

```
docker run --env LICENSE=accept --env MQ_QMGR_NAME=QM1 \
  --publish 1414:1414 --publish 9443:9443 \
  icr.io/ibm-messaging/mq:latest
```

This starts a queue manager named `QM1` with the default developer configuration,
which pre-creates a server connection channel (`DEV.APP.SVRCONN`), queues
(`DEV.QUEUE.1`, `DEV.QUEUE.2`, `DEV.QUEUE.3`), and a topic (`DEV.BASE.TOPIC`).

The default developer configuration creates a user `app` with password `password` for application connections.

## Step 2: Configure queues and topics

If you need custom queues or topics beyond the defaults, use the IBM MQ web console
or the `runmqsc` command-line tool:

1. Open the MQ web console at `https://localhost:9443/ibmmq/console/` (default credentials: `admin`/`passw0rd`).
2. Navigate to **Manage** > **Local queue managers** > **QM1**.
3. To create a queue, click **Create** under Queues and specify a queue name.
4. To create a topic, click **Create** under Topics and specify a topic name and topic string.

Alternatively, use `runmqsc` inside the container:

```
docker exec -it <container_id> runmqsc QM1
DEFINE QLOCAL('MY.QUEUE')
DEFINE TOPIC('MY.TOPIC') TOPICSTR('my/topic/string')
END
```

## Step 3: Configure sSL/TLS (optional)

For secure connections:

1. In the MQ web console, navigate to your queue manager's **Communication** settings.
2. Configure a key repository with your server certificate.
3. Set the SSL cipher spec on the server connection channel (e.g., `ANY_TLS12_OR_HIGHER`).
4. Export the server's public certificate and create a client trust store (`.p12` or `.jks` file).
5. If mutual TLS is required, generate a client certificate and create a client key store.

For development, the default Docker image does not require SSL. Enable SSL/TLS for production deployments.

## Step 4: Note your connection details

Collect the following details for configuring the Ballerina connector:

- **Queue Manager Name**: e.g., `QM1`
- **Host**: e.g., `localhost`
- **Port**: e.g., `1414`
- **Channel**: e.g., `DEV.APP.SVRCONN`
- **User ID**: e.g., `app`
- **Password**: e.g., `password`
- **Queue/Topic Names**: e.g., `DEV.QUEUE.1`, `DEV.BASE.TOPIC`
