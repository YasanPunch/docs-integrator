---
title: Kafka
---

# Kafka

Consume messages from Apache Kafka topics with consumer group management, offset control, and schema-aware deserialization.

## Creating a Kafka consumer

1. Click the **+** **Add Artifacts** button in the canvas or click **+** next to **Entry Points** in the sidebar.
2. In the **Artifacts** panel, select **Kafka** under **Event Integration**.

   ![Artifacts panel showing Kafka under Event Integration](/img/develop/integration-artifacts/event/kafka/step-2.png)

3. In the creation form, fill in the following fields:

   ![Kafka consumer creation form](/img/develop/integration-artifacts/event/kafka/step-creation-form.png)

   | Field | Description |
   |---|---|
   | **Bootstrap Servers** | Comma-separated list of Kafka broker addresses (e.g., `localhost:9092`). Required. |
   | **Topic(s)** | One or more Kafka topic names to subscribe to. Required. |

   Expand **Advanced Configurations** to set additional options including the consumer group ID, offset reset policy, and polling interval.

4. Click **Create**.

5. WSO2 Integrator opens the **Kafka Consumer Designer**. The header shows the listener configuration pill and the list of event handlers.

   ![Kafka Consumer Designer showing the listener configuration](/img/develop/integration-artifacts/event/kafka/step-3.png)

6. Click the `onConsumerRecord` handler row to open it in the **flow designer**.

   ![Flow designer showing the onConsumerRecord handler canvas](/img/develop/integration-artifacts/event/kafka/step-4.png)

7. Use the flow canvas to add integration steps — database writes, HTTP calls, and transformations.

```ballerina
import ballerinax/kafka;

configurable string bootstrapServers = "localhost:9092";
configurable string groupId = "order-processor";

type OrderEvent record {|
    string orderId;
    string customerId;
    decimal amount;
    string timestamp;
|};

listener kafka:Listener orderListener = new ({
    bootstrapServers: bootstrapServers,
    groupId: groupId,
    topics: ["orders"],
    pollingInterval: 1,
    autoCommit: false
});

service on orderListener {

    remote function onConsumerRecord(kafka:Caller caller, OrderEvent[] orders) returns error? {
        foreach OrderEvent order in orders {
            log:printInfo("Processing order", orderId = order.orderId, amount = order.amount);
            check processOrder(order);
        }
        // Manual commit after successful processing
        check caller->commit();
    }

    remote function onError(kafka:Error err) {
        log:printError("Kafka consumer error", 'error = err);
    }
}
```

## Service configuration

Service configuration controls the service name and the Kafka listener it is attached to.

In the **Kafka Consumer Designer**, click **Configure** to open the **Kafka Event Integration Configuration** panel.

The left panel shows the service name and its **Attached Listeners**. Click **Kafka Listener** under **Attached Listeners** to configure the listener connection settings in the right panel.

| Field | Description |
|---|---|
| **Bootstrap Servers** | Kafka broker addresses. Accepts a Ballerina expression or a plain text value. |
| **Group Id** | Consumer group identifier. |
| **Topics** | Topics to subscribe to. |
| **Offset Reset** | Offset reset strategy when no initial offset is present. Options: `earliest`, `latest`, `none`. |

Click **+ Attach Listener** at the bottom of the panel to attach a different or existing named listener.

Service configuration maps to the `kafka:ListenerConfiguration` record passed when constructing the listener:

```ballerina
listener kafka:Listener orderListener = new ({
    bootstrapServers: "localhost:9092",
    groupId: "order-processor",
    topics: ["orders"],
    autoOffsetReset: "earliest"
});

service on orderListener {
    // handlers
}
```

## Listener configuration

The listener connects to Kafka brokers and manages topic subscriptions and consumer group coordination. You can configure the listener directly from the **Listeners** panel in the sidebar.

In the sidebar, expand **Listeners** and click the listener name (for example, `kafkaListener`) to open the **Kafka Listener Configuration** form.

![Kafka Listener Configuration panel](/img/develop/integration-artifacts/event/kafka/listener-config-1.png)

| Field | Description |
|---|---|
| **Name** | Identifier for the listener, used in the service declaration. Required. |
| **Bootstrap Servers** | Comma-separated list of Kafka broker `host:port` addresses. Required. |
| **Topics** | Topics for the consumer to subscribe to. |
| **Group Id** | Consumer group identifier for coordinated offset tracking. |
| **Offset Reset** | Strategy when no committed offset exists: `earliest`, `latest`, or `none`. |
| **Partition Assignment Strategy** | Class that implements the partition assignment strategy among consumer group members. |
| **Metrics Recording Level** | Level of metrics recorded by the Kafka client (for example, `INFO` or `DEBUG`). |

**Named listener** — declare the listener at module level and attach services to it:

```ballerina
listener kafka:Listener kafkaListener = new ({
    bootstrapServers: "localhost:9092",
    groupId: "order-processor",
    topics: ["orders"],
    pollingInterval: 1,
    autoCommit: false,
    autoOffsetReset: "earliest"
});

service on kafkaListener {
    remote function onConsumerRecord(kafka:Caller caller, OrderEvent[] orders) returns error? {
        // process messages
    }
}
```

Key `kafka:ListenerConfiguration` fields:

| Field | Type | Default | Description |
|---|---|---|---|
| `bootstrapServers` | `string` | — | Kafka broker address list. Required. |
| `groupId` | `string` | — | Consumer group identifier. |
| `topics` | `string[]` | — | Topics to subscribe to. |
| `pollingInterval` | `decimal` | `1` | Seconds between polling cycles. |
| `autoCommit` | `boolean` | `true` | Automatically commit offsets after each poll. |
| `autoCommitInterval` | `decimal` | `5` | Auto-commit interval in seconds when `autoCommit: true`. |
| `autoOffsetReset` | `string` | `"latest"` | Offset reset strategy: `"earliest"`, `"latest"`, or `"none"`. |
| `concurrentConsumers` | `int` | `1` | Number of concurrent consumer threads. |
| `isolationLevel` | `string` | `"read_uncommitted"` | Transactional read isolation: `"read_committed"` or `"read_uncommitted"`. |

## Event handler configuration

A Kafka service defines remote functions that the runtime calls when records arrive or errors occur. Add handlers from the **Kafka Consumer Designer** using the **+ Handler** button.

In the **Kafka Consumer Designer**, the **Event Handlers** section lists all handlers. Click **+ Handler** to add a new handler. Each row shows an **Event** badge and the handler name. Click the settings icon (⚙) on a handler row to configure its parameters.

| Handler | Trigger | Required |
|---|---|---|
| **onConsumerRecord** | Called for each batch of records received from subscribed topics. | Yes |
| **onError** | Called when the Kafka consumer encounters an error. | No |

**`onConsumerRecord`** — receives a batch of messages. The message type can be `string`, `json`, `xml`, `byte[]`, or a custom record:

```ballerina
remote function onConsumerRecord(kafka:Caller caller, OrderEvent[] orders) returns error? {
    foreach OrderEvent order in orders {
        check processOrder(order);
    }
    check caller->commit();
}
```

The `kafka:Caller` parameter provides offset management methods:

| Method | Description |
|---|---|
| `caller->commit()` | Commit offsets for the current batch. Use when `autoCommit: false`. |
| `caller->seek(partition, offset)` | Seek to a specific offset on a given partition. |

**`onError`** — handles consumer-level errors such as deserialization failures or connection issues:

```ballerina
remote function onError(kafka:Error err) {
    log:printError("Consumer error", 'error = err);
}
```

**Typed message payloads** — Ballerina deserializes JSON automatically when the parameter type is a record:

```ballerina
type OrderEvent record {|
    string orderId;
    string customerId;
    decimal amount;
|};

remote function onConsumerRecord(kafka:Caller caller, OrderEvent[] orders) returns error? {
    foreach OrderEvent order in orders {
        log:printInfo("Order received", orderId = order.orderId);
    }
}
```

## Offset management strategies

| Strategy | Configuration | Behavior |
|---|---|---|
| **Auto-commit** | `autoCommit: true` | Offsets committed automatically at the polling interval |
| **Manual commit** | `autoCommit: false` | Call `caller->commit()` after processing |
| **Seek to beginning** | `autoOffsetReset: "earliest"` | Reprocess from the beginning of the topic |
| **Seek to end** | `autoOffsetReset: "latest"` | Skip to the latest messages only |

### Acknowledgment strategies

| Strategy | Guarantee | Use case |
|---|---|---|
| Auto-acknowledge | At most once | Low-value events, metrics |
| Manual acknowledge | At least once | Business-critical events |
| Transactional | Exactly once | Financial transactions |
