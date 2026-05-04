---
title: Build an Event-Driven Integration
---

# Build an Event-Driven Integration

**Time:** Under 10 minutes | **What you'll build:** An event-driven integration that consumes messages from RabbitMQ and processes them.

Event integrations are ideal for reactive workflows triggered by messages from Kafka, RabbitMQ, MQTT, or other message brokers.

## Prerequisites

- [WSO2 Integrator extension installed](install.md)
- A running RabbitMQ instance (or use Docker: `docker run -d -p 5672:5672 -p 15672:15672 rabbitmq:management`)

## Step 1: Create a new integration project

1. Open WSO2 Integrator.
2. Select **Create**.
3. Set **Integration Name** to `OrderProcessor`.
4. Set **Project Name** to `QuickStart`.
5. Select **Browse**.
6. Select the project location and select **Open**.
7. Select **Create Integration**.

<ThemedImage
    alt="Create a New Integration Project"
    sources={{
        light: useBaseUrl('/img/get-started/build-event-driven-integration/create-a-new-integration-project-light.gif'),
        dark: useBaseUrl('/img/get-started/build-event-driven-integration/create-a-new-integration-project-dark.gif'),
    }}
/>

## Step 2: Add a RabbitMQ event integration artifact

1. Select **OrderProcessor**.
2. In the design view, select **Add Artifact**.
3. Select **RabbitMQ** under Event Integration.

<ThemedImage
    alt="Add a RabbitMQ Event Integration Artifact"
    sources={{
        light: useBaseUrl('/img/get-started/build-event-driven-integration/add-a-rabbitmq-event-integration-artifact-light.gif'),
        dark: useBaseUrl('/img/get-started/build-event-driven-integration/add-a-rabbitmq-event-integration-artifact-dark.gif'),
    }}
/>

## Step 3: Configure the RabbitMQ connection

1. Set **Queue Name** to `Orders`.
2. Set **Host** to `localhost`.
3. Set **Port** to `5672`.
4. Select **Create**.

<ThemedImage
    alt="Configure the RabbitMQ Connection"
    sources={{
        light: useBaseUrl('/img/get-started/build-event-driven-integration/configure-the-rabbitmq-connection-light.gif'),
        dark: useBaseUrl('/img/get-started/build-event-driven-integration/configure-the-rabbitmq-connection-dark.gif'),
    }}
/>

## Step 4: Add message processing logic

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
        light: useBaseUrl('/img/get-started/build-event-driven-integration/add-message-processing-logic-light.gif'),
        dark: useBaseUrl('/img/get-started/build-event-driven-integration/add-message-processing-logic-dark.gif'),
    }}
/>

## Step 5: Run and test the integration

1. Select **Run**.
2. The integration starts and listens for messages on the `Orders` queue.
3. Publish a test message to the RabbitMQ `Orders` queue to see the log output.

<ThemedImage
    alt="Run and Test the Integration"
    sources={{
        light: useBaseUrl('/img/get-started/build-event-driven-integration/run-and-test-the-integration-light.gif'),
        dark: useBaseUrl('/img/get-started/build-event-driven-integration/run-and-test-the-integration-dark.gif'),
    }}
/>

## Supported event sources

| Broker | Ballerina Package |
|---|---|
| **Apache Kafka** | `ballerinax/kafka` |
| **RabbitMQ** | `ballerinax/rabbitmq` |
| **MQTT** | `ballerinax/mqtt` |
| **Azure Service Bus** | `ballerinax/azure.servicebus` |
| **Salesforce** | `ballerinax/salesforce` |
| **GitHub Webhooks** | `ballerinax/github` |

## What's next

- [Automation](build-automation.md) -- Build a scheduled job
- [AI agent](build-ai-agent.md) -- Build an intelligent agent
- [Integration as API](build-api-integration.md) -- Build an HTTP service
- [File-driven integration](build-file-driven-integration.md) -- Process files from FTP or local directories
