---
title: TCP Service
---

# TCP Service

TCP services handle raw TCP connections and are suitable for custom binary or text-based protocol implementations where HTTP overhead is not acceptable. WSO2 Integrator generates a service with a pre-defined `onConnect` handler that returns a connection service instance to manage per-connection lifecycle events.

:::note Beta
TCP service support is currently in beta.

## Creating a TCP service

1. Open the **WSO2 Integrator** sidebar in VS Code.
2. Click **+** next to **Entry Points**.
3. Select **TCP Service**.
4. In the creation form, fill in the required fields:

   | Field | Description | Default |
   |---|---|---|
   | **TCP Port** | Port on which the TCP service listens | `80` |

5. Optionally expand **Advanced Configurations** and set the **Listener Name** (default: `tcpListener`).
6. Click **Create**.

![TCP Service creation form](../../../../static/img/develop/integration-artifacts/service/tcp-service/step-creation-form.png)

```ballerina
import ballerina/tcp;

configurable int port = 80;

listener tcp:Listener tcpListener = new (port);

service on tcpListener {

    remote function onConnect(tcp:Caller caller) returns tcp:ConnectionService {
        return new TcpConnectionService();
    }
}

service class TcpConnectionService {
    *tcp:ConnectionService;

    remote function onBytes(tcp:Caller caller, readonly & byte[] data) returns error? {
        // Handle incoming bytes
    }

    remote function onClose() {
        // Handle connection close
    }

    remote function onError(tcp:Error err) {
        // Handle connection errors
    }
}
```

## TCP service designer

After creating the service, WSO2 Integrator opens the **TCP Service Designer** — a view that shows the attached listener and the event handlers generated for the service.

![TCP Service Designer showing the Event Handlers section](../../../../static/img/develop/integration-artifacts/service/tcp-service/step-designer.png)

The designer shows:

- **Listener pill** — displays the attached listener (for example, `tcpListener`).
- **Event Handlers** section — lists the handlers that define how the service responds to connection events. The `onConnect` handler is pre-defined and generated automatically when the service is created.

Use the **Configure** button in the top right to open the service configuration view.

## Service configuration

Click **Configure** to open the **TCP Service Configuration** panel. The left navigation shows **TCP Service** and its **Attached Listeners**. Select the listener (for example, `tcpListener`) to view and edit its settings.

![TCP Service Configuration panel](../../../../static/img/develop/integration-artifacts/service/tcp-service/step-service-config.png)

| Field | Description |
|---|---|
| **Name** | Name of the listener |
| **Local Port** | Port number the listener binds to |
| **Local Host** | Hostname the listener binds to |
| **Secure Socket** | SSL/TLS configurations for the listener |

Click **Save Changes** to apply the configuration. Use **+ Attach Listener** at the bottom of the panel to attach an additional listener to the service.

## Implementing connection logic

Click the **onConnect** handler row in the **TCP Service Designer** to open the **flow designer view** for that handler.

![Flow designer for the onConnect handler](../../../../static/img/develop/integration-artifacts/service/tcp-service/step-flow.png)

The `onConnect` handler is a remote function that runs when a new client connects. Its flow includes a **Declare Variable** step that instantiates the connection service class (for example, `new TcpEchoService()`) and a **Return** step that returns the connection service instance to the runtime.

```ballerina
import ballerina/log;

service on tcpListener {

    remote function onConnect(tcp:Caller caller) returns tcp:ConnectionService {
        log:printInfo("New TCP connection");
        return new TcpHandler();
    }
}

service class TcpHandler {
    *tcp:ConnectionService;

    remote function onBytes(tcp:Caller caller, readonly & byte[] data) returns error? {
        string message = check string:fromBytes(data);
        log:printInfo("Received", data = message);
        check caller->writeBytes("ACK".toBytes());
    }

    remote function onClose() {
        log:printInfo("Connection closed");
    }

    remote function onError(tcp:Error err) {
        log:printError("Connection error", 'error = err);
    }
}
```

## Implementing connection service handlers

The `onBytes`, `onClose`, and `onError` handlers are implemented inside the connection service class (for example, `TcpEchoService`) rather than in the main TCP service. Access the service class through the **Types** panel in the sidebar.

**Finding the connection service class**

In the `onConnect` flow designer, click the **Declare Variable** step. The right panel shows the variable details, including the **Type** field that identifies the connection service class (for example, `TcpEchoService`).

![Declare Variable panel showing TcpEchoService as the connection service type](../../../../static/img/develop/integration-artifacts/service/tcp-service/step-declare-variable.png)

**Opening the type diagram**

In the sidebar, expand **Types** and click the connection service class name (for example, `TcpEchoService`). This opens the **Types** view, which shows the type diagram for that class. The type node lists its methods: `onBytes`, `onError`, and `onClose`.

![Types view showing the TcpEchoService type node with onBytes, onError, and onClose](../../../../static/img/develop/integration-artifacts/service/tcp-service/step-type-diagram.png)

**Opening the Service Class Designer**

Click the `TcpEchoService` type node in the diagram to open the **Service Class Designer**. This view shows:

- **Class Variables** — shared state available across all handler methods; use **+ Variable** to add one.
- **Methods** — the `onBytes`, `onError`, and `onClose` remote functions generated for the connection service.

![Service Class Designer showing Class Variables and Methods for TcpEchoService](../../../../static/img/develop/integration-artifacts/service/tcp-service/step-service-class-designer.png)

Click any method row (for example, `onBytes`) to open the **flow designer view** for that handler, where you can define the logic for processing incoming data, handling errors, or cleaning up on close.

## Connection lifecycle callbacks

| Callback | Trigger | Typical use |
|---|---|---|
| `onConnect` | New TCP client connects | Instantiate and return the connection service |
| `onBytes` | Data received from client | Parse and process the payload; write a response with `caller->writeBytes()` |
| `onClose` | Client disconnects | Release per-connection resources |
| `onError` | Connection error | Log and handle error conditions |
