---
title: POP3/IMAP4
---

# POP3/IMAP4

Poll email inboxes for incoming messages and trigger integration logic when new emails arrive. WSO2 Integrator supports both the POP3 and IMAP4 protocols through polling-based listeners that check for new messages at a configurable interval.

Creating a POP3 or IMAP4 listener requires Ballerina code. Once the listener exists, you can use the visual designer to implement logic for the `onMessage` handler.

| Protocol | Description | Default port |
|---|---|---|
| **POP3** | Downloads messages from the server; messages are typically removed after retrieval | `995` (SSL) |
| **IMAP4** | Synchronizes with the server; messages remain on the server after retrieval | `993` (SSL) |

## Creating a POP3 listener

```ballerina
import ballerina/email;

configurable string host = "pop.example.com";
configurable string username = "reader@example.com";
configurable string password = ?;

listener email:PopListener popListener = check new ({
    host: host,
    username: username,
    password: password,
    pollingInterval: 60,
    port: 995
});

service on popListener {

    remote function onMessage(email:Message msg) returns error? {
        // Process incoming email
    }

    remote function onError(email:Error err) {
        // Handle polling errors
    }

    remote function onClose() {
        // Handle listener shutdown
    }
}
```

## Creating an IMAP4 listener

IMAP4 keeps messages on the server after retrieval and lets you specify which folder to monitor.

```ballerina
import ballerina/email;

configurable string host = "imap.example.com";
configurable string username = "reader@example.com";
configurable string password = ?;

listener email:ImapListener imapListener = check new ({
    host: host,
    username: username,
    password: password,
    pollingInterval: 60,
    port: 993,
    folder: "INBOX"
});

service on imapListener {

    remote function onMessage(email:Message msg) returns error? {
        // Process incoming email
    }

    remote function onError(email:Error err) {
        // Handle polling errors
    }

    remote function onClose() {
        // Handle listener shutdown
    }
}
```

## Listener configuration

Both `email:PopListenerConfiguration` and `email:ImapListenerConfiguration` share the following fields. `ImapListenerConfiguration` additionally supports `folder`.

| Field | Type | Description |
|---|---|---|
| `host` | `string` | Email server hostname |
| `username` | `string` | Email account username |
| `password` | `string` | Email account password or app-specific token |
| `pollingInterval` | `decimal` | Seconds between polling cycles. Default: `60`. |
| `port` | `int` | Server port. Default: `995` for POP3, `993` for IMAP4. |
| `folder` | `string` | *(IMAP4 only)* Mailbox folder to monitor. Default: `"INBOX"`. |
| `secureSocket` | `email:SecureSocket?` | SSL/TLS configuration for the connection |

## Event handler configuration

| Handler | Trigger | Typical use |
|---|---|---|
| `onMessage` | New email arrives during a polling cycle | Parse subject and body, route to a downstream system |
| `onError` | A polling cycle fails | Log the error, alert on repeated failures |
| `onClose` | Listener shuts down | Release resources, flush in-flight state |

## Implementing email processing

The `onMessage` handler receives an `email:Message` record containing the full message:

```ballerina
remote function onMessage(email:Message msg) returns error? {
    string sender = msg.'from;
    string subject = msg.subject ?: "(no subject)";
    string body = msg.body ?: "";

    log:printInfo("Email received", sender = sender, subject = subject);

    if subject.includesMatch(re `[Oo]rder`) {
        check processOrderEmail(sender, body);
    } else if subject.includesMatch(re `[Ss]upport`) {
        check createSupportTicket(sender, subject, body);
    }
}
```

`email:Message` fields:

| Field | Type | Description |
|---|---|---|
| `'from` | `string` | Sender address |
| `to` | `string\|string[]?` | Primary recipients |
| `cc` | `string\|string[]?` | CC recipients |
| `subject` | `string?` | Email subject line |
| `body` | `string?` | Plain text body |
| `htmlBody` | `string?` | HTML body |
| `attachments` | `email:Attachment\|email:Attachment[]?` | File attachments |
| `headers` | `map<string>?` | Additional email headers |
| `date` | `time:Civil?` | Message date and time |

## Designing logic with the visual designer

Although POP3/IMAP4 listener creation is not supported in the visual designer, you can use it to implement logic for event handlers defined in code. Once the listener exists in the project, it appears in the **Entry Points** sidebar and on the design canvas.

![Cavas](/img/develop/integration-artifacts/event/pop3-imap4/step-canvas.png)

Click the service node (or the service name in the sidebar) to open the **Email Listener Designer**, which lists the event handlers.

![Service Designer](/img/develop/integration-artifacts/event/pop3-imap4/step-service.png)

Click the `onMessage` handler row to open its **flow designer view**, where you can define the integration logic visually.

![Flow Designer View](/img/develop/integration-artifacts/event/pop3-imap4/step-flow.png)

Not all listener configuration options are available through the visual designer. For full control — including SSL/TLS and polling interval settings — use Ballerina code directly.

## For more details

See the [Ballerina email specification](https://ballerina.io/spec/email/#41-pop3-listener) for the complete language-level reference, including SSL/TLS configuration, folder selection, and attachment handling.
