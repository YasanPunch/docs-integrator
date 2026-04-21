---
title: MQTT
---

# MQTT

MQTT event integrations subscribe to one or more MQTT topics and trigger an `onMessage` handler as each message arrives. Use them for IoT data ingestion, sensor readings, and lightweight publish/subscribe messaging where low bandwidth and low latency are priorities.

## Creating an MQTT service

1. Click **+ Add Artifact** in the canvas or click **+** next to **Entry Points** in the sidebar.
2. In the **Artifacts** panel, select **MQTT** under **Event Integration**.
3. In the creation form, fill in the following fields:

   ![MQTT Event Integration creation form](/img/develop/integration-artifacts/event/mqtt/step-creation-form.png)

   | Field | Description | Default |
   |---|---|---|
   | **Service URI** | URI of the MQTT broker (e.g., `mqtt://localhost:1883`). | Required |
   | **Client ID** | Unique identifier for this client as recognised by the MQTT broker. | Required |
   | **Subscriptions** | Topic or topics to subscribe to. | Required |

   Expand **Advanced Configurations** to set the listener name.

   | Field | Description | Default |
   |---|---|---|
   | **Listener Name** | Identifier for the listener created with this service. | `mqttListener` |

4. Click **Create**.

5. WSO2 Integrator opens the service in the **Service Designer**. The canvas shows the attached listener pill and the **Event Handlers** section.

   ![Service Designer showing the MQTT service canvas](/img/develop/integration-artifacts/event/mqtt/step-service-designer.png)

6. Click **+ Add Handler** to add the `onMessage` handler.

```ballerina
import ballerinax/mqtt;
import ballerina/log;

configurable string serverUri = "mqtt://localhost:1883";
configurable string clientId = "unique_client_001";
configurable string subscription = "topic1";

listener mqtt:Listener mqttListener = new (serverUri, clientId);

@mqtt:ServiceConfig {
    topics: [subscription]
}
service on mqttListener {

    remote function onMessage(mqtt:Message message) returns error? {
        log:printInfo("Message received", topic = message.topic,
                      content = message.content.toString());
    }
}
```

## Listener configuration

In the **Service Designer**, click the **Configure** icon in the header to open the **MQTT Event Integration Configuration** panel. Select **mqttListener** under **Attached Listeners** to configure the listener.

![MQTT Event Integration Configuration panel](/img/develop/integration-artifacts/event/mqtt/step-listener-config.png)

| Field | Description | Default |
|---|---|---|
| **Name** | Identifier for the listener. | `mqttListener` |
| **Server Uri** | URI of the remote MQTT server (e.g., `mqtt://localhost:1883`). | Required |
| **Client Id** | Unique client ID to identify this listener to the broker. | Required |
| **Subscriptions** | Topics to subscribe to. | Required |
| **Connection Config** | Additional connection configuration as a record expression (e.g., credentials, keep-alive settings). | `{}` |
| **Manual Acks** | When set to `true`, messages must be manually acknowledged. When `false`, messages are automatically acknowledged. | — |

Click **+ Attach Listener** to attach an additional listener to the same service.

Click **Save Changes** to apply updates.

```ballerina
listener mqtt:Listener mqttListener = new (
    serverUri = "mqtt://localhost:1883",
    clientId = "unique_client_001",
    connectionConfig = {
        username: "device",
        password: "secret"
    }
);
```

`mqtt:ListenerConfiguration` fields:

| Field | Type | Default | Description |
|---|---|---|---|
| `serverUri` | `string` | Required | URI of the MQTT broker |
| `clientId` | `string` | Required | Unique client identifier |
| `connectionConfig` | `mqtt:ConnectionConfiguration?` | — | Broker credentials and connection settings |
| `manualAcks` | `boolean` | `false` | When `true`, messages must be manually acknowledged |

`@mqtt:ServiceConfig` fields:

| Field | Type | Description |
|---|---|---|
| `topics` | `string[]` | Topics to subscribe to |
| `qualityOfService` | `mqtt:QosLevel` | Message delivery guarantee level. See [QoS levels](#qos-levels). |

## Event handlers

MQTT services support a single handler type — `onMessage` — which is called for every message received on the subscribed topics.

### Adding an event handler

In the **Service Designer**, click **+ Add Handler**. The **Select Handler to Add** panel lists `onMessage`. Click it to add the handler directly — no additional configuration is required.

```ballerina
type SensorReading record {|
    string sensorId;
    float temperature;
    float humidity;
    string timestamp;
|};

@mqtt:ServiceConfig {
    topics: ["sensors/+/readings"],
    qualityOfService: mqtt:EXACTLY_ONCE
}
service on mqttListener {

    remote function onMessage(mqtt:Message message) returns error? {
        SensorReading reading = check (check message.content.ensureType(json)).fromJsonWithType();
        log:printInfo("Sensor reading",
                      sensorId = reading.sensorId,
                      temperature = reading.temperature);
        check storeSensorReading(reading);
    }
}
```

### Message type

The `onMessage` handler receives an `mqtt:Message` parameter with the message content and metadata.

| Field | Type | Description |
|---|---|---|
| `topic` | `string` | Topic the message was published to |
| `content` | `byte[]` | Raw message payload. Use `ensureType(json)` or `ensureType(string)` to cast to a usable type. |
| `qos` | `mqtt:QosLevel` | Quality of service level of the received message |
| `retained` | `boolean` | `true` if the message was a retained message from the broker |
| `duplicate` | `boolean` | `true` if the broker is redelivering the message |

### QoS levels

| Level | Constant | Guarantee |
|---|---|---|
| `0` | `mqtt:AT_MOST_ONCE` | Fire and forget — no acknowledgment |
| `1` | `mqtt:AT_LEAST_ONCE` | Acknowledged delivery — possible duplicates |
| `2` | `mqtt:EXACTLY_ONCE` | Four-step handshake — no duplicates |

## What's next

- [RabbitMQ](rabbitmq.md) — consume messages from RabbitMQ queues
- [Kafka](kafka.md) — consume messages from Apache Kafka topics
- [Connections](../supporting/connections.md) — reuse MQTT connection credentials across services
