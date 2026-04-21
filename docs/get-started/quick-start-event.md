---
title: 'Quick Start: Event Integration'
---

# Quick Start: Event Integration

**Time:** Under 10 minutes | **What you'll build:** An event-driven integration that consumes messages from RabbitMQ and processes them.

Event integrations are ideal for reactive workflows triggered by messages from Kafka, RabbitMQ, MQTT, or other message brokers.

## Prerequisites

- [WSO2 Integrator extension installed](install.md)
- A running RabbitMQ instance (or use Docker: `docker run -d -p 5672:5672 -p 15672:15672 rabbitmq:management`)

## Step 1: Create a New Integration Project

1. Open WSO2 Integrator.
2. Select **Create**.
3. Set **Integration Name** to `OrderProcessor`.
4. Set **Project Name** to `Quick_Start`.
5. Select **Browse**.
6. Select the project location and select **Open**.
7. Select **Create Integration**.

<ThemedImage
    alt="Create a New Integration Project"
    sources={{
        light: useBaseUrl('/img/get-started/quick-start-event/create-a-new-integration-project-light.gif'),
        dark: useBaseUrl('/img/get-started/quick-start-event/create-a-new-integration-project-dark.gif'),
    }}
/>

## Step 2: Add a RabbitMQ Event Integration Artifact

1. Select **OrderProcessor**.
2. In the design view, select **Add Artifact**.
3. Select **RabbitMQ** under Event Integration.

<ThemedImage
    alt="Add a RabbitMQ Event Integration Artifact"
    sources={{
        light: useBaseUrl('/img/get-started/quick-start-event/add-a-rabbitmq-event-integration-artifact-light.gif'),
        dark: useBaseUrl('/img/get-started/quick-start-event/add-a-rabbitmq-event-integration-artifact-dark.gif'),
    }}
/>

## Step 3: Configure the RabbitMQ Connection

1. Set **Queue Name** to `Orders`.
2. Set **Host** to `localhost`.
3. Set **Port** to `5672`.
4. Select **Create**.

<ThemedImage
    alt="Configure the RabbitMQ Connection"
    sources={{
        light: useBaseUrl('/img/get-started/quick-start-event/configure-the-rabbitmq-connection-light.gif'),
        dark: useBaseUrl('/img/get-started/quick-start-event/configure-the-rabbitmq-connection-dark.gif'),
    }}
/>

## Step 4: Add Message Processing Logic

1. Select **+ Add Handler**.
2. Select **onMessage**.
3. Select **Save**.
4. Select **+** inside the resource flow.
5. Select **Call Function**.
6. Select **printInfo**.
7. Set **Msg** to `Received order`.
8. Select **Save**.

<ThemedImage
    alt="Add Message Processing Logic"
    sources={{
        light: useBaseUrl('/img/get-started/quick-start-event/add-message-processing-logic-light.gif'),
        dark: useBaseUrl('/img/get-started/quick-start-event/add-message-processing-logic-dark.gif'),
    }}
/>

## Step 5: Run and Test the Integration

1. Select **Run**.
2. The integration starts and listens for messages on the `Orders` queue.
3. Publish a test message to the RabbitMQ `Orders` queue to see the log output.

<ThemedImage
    alt="Run and Test the Integration"
    sources={{
        light: useBaseUrl('/img/get-started/quick-start-event/run-and-test-the-integration-light.gif'),
        dark: useBaseUrl('/img/get-started/quick-start-event/run-and-test-the-integration-dark.gif'),
    }}
/>

## Supported Event Sources

| Broker | Ballerina Package |
|---|---|
| **Apache Kafka** | `ballerinax/kafka` |
| **RabbitMQ** | `ballerinax/rabbitmq` |
| **MQTT** | `ballerinax/mqtt` |
| **Azure Service Bus** | `ballerinax/azure.servicebus` |
| **Salesforce** | `ballerinax/salesforce` |
| **GitHub Webhooks** | `ballerinax/github` |

## What's Next

- [Quick Start: File Integration](quick-start-file.md) -- Process files from FTP or local directories
- [Quick Start: Integration as API](quick-start-api.md) -- Build an HTTP service
- [Event Handlers](/docs/develop/integration-artifacts/overview) -- Advanced event-driven patterns
