---
title: Twilio
---

# Twilio

Twilio event integrations receive webhook callbacks from the Twilio platform and trigger handler functions as call or message status changes occur. Use them to track call progress, monitor SMS delivery, and build real-time communication workflows without polling the Twilio API.

## Creating a Twilio Events service

1. Click **+ Add Artifact** in the canvas or click **+** next to **Entry Points** in the sidebar.
2. In the **Artifacts** panel, select **Twilio** under **Event Integration**.
3. In the creation form, fill in the following fields:

   ![Twilio Event Integration creation form](/img/develop/integration-artifacts/event/twilio/step-creation-form.png)

   | Field | Description | Default |
   |---|---|---|
   | **Event Channel** | The Twilio event channel to subscribe to. Select **CallStatusService** to handle call status events or **SmsStatusService** to handle SMS status events. | Required |
   | **Webhook Listener Port** | The port on which the webhook listener accepts incoming requests from Twilio. | `8090` |

   Expand **Advanced Configurations** to set the listener name.

   | Field | Description | Default |
   |---|---|---|
   | **Listener Name** | Identifier for the listener created with this service. | `twilioListener` |

4. Click **Create**.

5. WSO2 Integrator opens the service in the **Service Designer**. The canvas shows the attached listener pill and the **Event Handlers** section with all handlers for the selected channel pre-added.

   ![Service Designer showing the Twilio Event Integration canvas](/img/develop/integration-artifacts/event/twilio/step-service-designer.png)

   All event handlers for the selected channel are added automatically. Click any handler to open it in the flow diagram view and implement the logic.

```ballerina
import ballerinax/twilio;
import ballerina/log;

configurable int port = 8090;

listener twilio:Listener twilioListener = new (port);

service twilio:CallStatusService on twilioListener {

    remote function onQueued(twilio:StatusCallback event) returns error? {
        log:printInfo("Call queued", callSid = event.callSid);
    }

    remote function onRinging(twilio:StatusCallback event) returns error? {
        log:printInfo("Call ringing", callSid = event.callSid);
    }

    remote function onInProgress(twilio:StatusCallback event) returns error? {
        log:printInfo("Call in progress", callSid = event.callSid);
    }

    remote function onCompleted(twilio:StatusCallback event) returns error? {
        log:printInfo("Call completed",
                      callSid = event.callSid,
                      duration = event.callDuration);
    }

    remote function onBusy(twilio:StatusCallback event) returns error? {
        log:printInfo("Call busy", callSid = event.callSid);
    }

    remote function onFailed(twilio:StatusCallback event) returns error? {
        log:printInfo("Call failed", callSid = event.callSid);
    }

    remote function onNoAnswer(twilio:StatusCallback event) returns error? {
        log:printInfo("Call no answer", callSid = event.callSid);
    }

    remote function onCanceled(twilio:StatusCallback event) returns error? {
        log:printInfo("Call canceled", callSid = event.callSid);
    }
}
```

## Service and listener configuration

In the **Service Designer**, click the **Configure** icon in the header to open the **Twilio Event Integration Configuration** panel.

![Twilio Event Integration Configuration panel](/img/develop/integration-artifacts/event/twilio/step-configuration.png)

The configuration panel has two sections. The top section configures the service and the bottom section configures the attached listener.

**Service configuration:**

| Field | Description |
|---|---|
| **Event Channel** | The Twilio event channel this service handles. Select **CallStatusService** or **SmsStatusService**. |

**Listener configuration** (under **Configuration for twilioListener**):

| Field | Description | Default |
|---|---|---|
| **Name** | Identifier for the listener. | `twilioListener` |
| **Listen On** | Port on which the listener accepts incoming webhook requests. | `8090` |

Click **+ Attach Listener** to attach an additional listener to the same service.

Click **Save Changes** to apply updates.

```ballerina
listener twilio:Listener twilioListener = new (8090);
```

`twilio:Listener` accepts a port number as its argument. The listener starts an HTTP server on that port to receive Twilio webhook callbacks.

For **SmsStatusService**:

```ballerina
service twilio:SmsStatusService on twilioListener {

    remote function onReceived(twilio:SmsEvent event) returns error? {
        log:printInfo("SMS received",
                      messageSid = event.messageSid,
                      from = event.'from,
                      body = event.body);
    }

    remote function onSent(twilio:SmsEvent event) returns error? {
        log:printInfo("SMS sent", messageSid = event.messageSid);
    }

    remote function onDelivered(twilio:SmsEvent event) returns error? {
        log:printInfo("SMS delivered", messageSid = event.messageSid);
    }

    remote function onFailed(twilio:SmsEvent event) returns error? {
        log:printInfo("SMS failed", messageSid = event.messageSid);
    }
}
```

## Event handlers

When a Twilio Events service is created, WSO2 Integrator adds all handlers for the selected channel automatically. Click any handler in the **Service Designer** to open the flow diagram view and implement the processing logic.

### CallStatusService handlers

The `CallStatusService` channel provides handlers for each Twilio call state.

| Handler | Triggered when |
|---|---|
| `onQueued` | The call has been created and is waiting to be dialed |
| `onRinging` | The call is ringing at the destination |
| `onInProgress` | The call has been answered and is active |
| `onCompleted` | The call ended normally |
| `onBusy` | The destination returned a busy signal |
| `onFailed` | The call could not be connected |
| `onNoAnswer` | The destination did not answer |
| `onCanceled` | The call was canceled before it was answered |

### SmsStatusService handlers

The `SmsStatusService` channel provides handlers for each Twilio SMS delivery state.

| Handler | Triggered when |
|---|---|
| `onQueued` | The message is queued for delivery |
| `onSent` | The message has been dispatched to the carrier |
| `onDelivered` | The carrier confirmed delivery to the recipient |
| `onFailed` | The message could not be sent |
| `onUndelivered` | The carrier received the message but could not deliver it |
| `onReceived` | An inbound SMS message was received |

## What's next

- [Kafka](kafka.md) — consume messages from Apache Kafka topics
- [MQTT](mqtt.md) — subscribe to MQTT topics for IoT and lightweight messaging
- [Connections](../supporting/connections.md) — reuse Twilio credentials across services
- [Twilio connector reference](../../../connectors/catalog/communication/twilio/overview.md) — full connector API reference
