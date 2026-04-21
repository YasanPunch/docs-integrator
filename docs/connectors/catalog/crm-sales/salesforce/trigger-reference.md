---
title: Triggers
---

# Triggers

The `ballerinax/salesforce` connector supports event-driven integration through Salesforce Change Data Capture (CDC). When records are created, updated, deleted, or restored in Salesforce, the listener receives change events in real time, triggering your service callbacks automatically — no polling required.

Three components work together:

| Component | Role |
|-----------|------|
| `salesforce:Listener` | Connects to Salesforce Streaming API and subscribes to change event channels. |
| `salesforce:Service` | Defines the `onCreate`, `onUpdate`, `onDelete`, and `onRestore` callbacks invoked per event. |
| `salesforce:EventData` | The change event payload passed to each callback. |

For action-based record operations, see the [Action Reference](action-reference.md).

---

## Listener

The `salesforce:Listener` establishes the connection and manages event subscriptions.

### Configuration

The listener supports the following connection strategies:

| Config Type | Description |
|-------------|-------------|
| `SoapBasedListenerConfig` | Authenticates using a username and password (with security token). Simpler setup for development. |
| `RestBasedListenerConfig` | Authenticates using OAuth 2.0 refresh token. Recommended for production. |

`SoapBasedListenerConfig` fields:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `username` | `string` | Required | Salesforce username (email). |
| `password` | `string` | Required | Salesforce password concatenated with the security token (e.g., `"MyPassword" + "SecurityToken"`). |
| `baseUrl` | `string` | Required | The Salesforce instance URL. |
| `port` | `int` | `443` | Port for the streaming connection. |

`RestBasedListenerConfig` fields:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `baseUrl` | `string` | Required | The Salesforce instance URL. |
| `auth` | `OAuth2RefreshTokenGrantConfig` | Required | OAuth 2.0 refresh token configuration. |
| `port` | `int` | `443` | Port for the streaming connection. |

### Initializing the listener

**Using SOAP-based authentication (username + password):**

```ballerina
import ballerinax/salesforce;

configurable string username = ?;
configurable string password = ?;
configurable string baseUrl = ?;

listener salesforce:Listener sfListener = new ({
    username: username,
    password: password,
    baseUrl: baseUrl
});
```

**Using REST-based authentication (OAuth 2.0):**

```ballerina
import ballerinax/salesforce;

configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshToken = ?;
configurable string baseUrl = ?;

listener salesforce:Listener sfListener = new ({
    baseUrl: baseUrl,
    auth: {
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        refreshUrl: "https://login.salesforce.com/services/oauth2/token"
    }
});
```

---

## Service

A `salesforce:Service` is a Ballerina service attached to a `salesforce:Listener`. It listens for change events on a specific Salesforce object channel and implements callbacks for each event type.

### Callback signatures

| Function | Signature | Description |
|----------|-----------|-------------|
| `onCreate` | `remote function onCreate(salesforce:EventData event) returns error?` | Invoked when a record is created. |
| `onUpdate` | `remote function onUpdate(salesforce:EventData event) returns error?` | Invoked when a record is updated. |
| `onDelete` | `remote function onDelete(salesforce:EventData event) returns error?` | Invoked when a record is deleted. |
| `onRestore` | `remote function onRestore(salesforce:EventData event) returns error?` | Invoked when a deleted record is restored (undeleted). |

You do not need to implement all four callbacks. Only implement the event types relevant to your use case.

### Full usage example

```ballerina
import ballerina/log;
import ballerinax/salesforce;

configurable string username = ?;
configurable string password = ?;
configurable string baseUrl = ?;

listener salesforce:Listener sfListener = new ({
    username: username,
    password: password,
    baseUrl: baseUrl
});

// Subscribe to Account change events
// Channel format: /data/ChangeEvent
service salesforce:Service on sfListener {
    remote function onCreate(salesforce:EventData event) returns error? {
        string? entityName = event.changeEventMetadata.entityName;
        string[]? recordIds = event.changeEventMetadata.recordIds;
        log:printInfo("Record created",
            entity = entityName,
            ids = recordIds,
            data = event.changedData.toString()
        );
    }

    remote function onUpdate(salesforce:EventData event) returns error? {
        string[]? recordIds = event.changeEventMetadata.recordIds;
        log:printInfo("Record updated",
            ids = recordIds,
            changedFields = event.changedData.keys()
        );
    }

    remote function onDelete(salesforce:EventData event) returns error? {
        string[]? recordIds = event.changeEventMetadata.recordIds;
        log:printInfo("Record deleted", ids = recordIds);
    }

    remote function onRestore(salesforce:EventData event) returns error? {
        string[]? recordIds = event.changeEventMetadata.recordIds;
        log:printInfo("Record restored (undeleted)", ids = recordIds);
    }
}
```

The service path corresponds to the Salesforce CDC channel. For object-specific channels, Salesforce uses the naming convention `/data/ChangeEvent` (e.g., `/data/AccountChangeEvent`). For all change events, use `/data/ChangeEvents`.

---

## Supporting types

### `EventData`

| Field | Type | Description |
|-------|------|-------------|
| `changedData` | `map<anydata>` | A map of changed field names to their new values. |
| `changeEventMetadata` | `salesforce:ChangeEventMetadata` | Metadata about the change event (entity, type, record IDs). |

### `ChangeEventMetadata`

| Field | Type | Description |
|-------|------|-------------|
| `entityName` | `string?` | The API name of the sObject that changed (e.g., `"Account"`). |
| `changeType` | `string?` | The type of change: `CREATE`, `UPDATE`, `DELETE`, or `UNDELETE`. |
| `changeOrigin` | `string?` | The source of the change (e.g., `"com/salesforce/api/rest/57.0"`). |
| `transactionKey` | `string?` | A unique key identifying the transaction. |
| `sequenceNumber` | `int?` | The sequence number of the event within the transaction. |
| `commitTimestamp` | `int?` | The Unix timestamp (milliseconds) when the change was committed. |
| `commitNumber` | `int?` | The transaction commit number. |
| `commitUser` | `string?` | The ID of the user who initiated the change. |
| `recordIds` | `string[]?` | Array of record IDs affected by the change. |
