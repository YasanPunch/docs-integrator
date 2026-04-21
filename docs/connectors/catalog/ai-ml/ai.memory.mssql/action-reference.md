---
title: Actions
---

# Actions

The `ballerinax/ai.memory.mssql` package exposes the following clients:

| Client | Purpose |
|--------|---------|
| [`Short Term Memory Store`](#short-term-memory-store) | Persists and retrieves key-scoped AI chat messages in a Microsoft SQL Server database. |

---

## Short term memory store

Persists and retrieves key-scoped AI chat messages in a Microsoft SQL Server database.

### Configuration

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `host` | `string` | `"localhost"` | Hostname or IP address of the SQL Server instance. |
| `user` | `string` | `"sa"` | SQL Server login username. |
| `password` | `string` | `()` | SQL Server login password. |
| `database` | `string` | Required | Name of the target database. |
| `port` | `int` | `1433` | TCP port of the SQL Server instance. |
| `instance` | `string` | `()` | Named SQL Server instance (e.g., `SQLEXPRESS`). Leave empty for the default instance. |
| `options` | `mssql:Options` | `()` | Advanced MSSQL driver options such as TLS settings. |
| `connectionPool` | `sql:ConnectionPool` | `()` | Connection pool configuration for managing database connections. |

### Initializing the client

```ballerina
import ballerina/ai;
import ballerinax/ai.memory.mssql as mssqlMemory;

configurable string host = ?;
configurable string user = ?;
configurable string password = ?;
configurable string database = ?;

// Option 1: config-based initialisation
ai:ShortTermMemoryStore store = check new mssqlMemory:ShortTermMemoryStore(
    {host, user, password, database},
    maxMessagesPerKey = 20,
    cacheConfig = {capacity: 10},
    tableName = "ChatMessages"
);

// Option 2: supply an existing mssql:Client
// import ballerinax/mssql;
// mssql:Client mssqlClient = check new (host, user, password, database);
// ai:ShortTermMemoryStore store = check new mssqlMemory:ShortTermMemoryStore(mssqlClient);
```

### Operations

#### Message storage

<details>
<summary>put</summary>

Inserts one or more chat messages for the given key. A system message is upserted (replacing any existing system message), while interactive messages (user, assistant, function) are appended.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `key` | `string` | Yes | Unique identifier for the conversation or session. |
| `message` | `ai:ChatMessage\|ai:ChatMessage[]` | Yes | A single chat message or an array of chat messages to store. |

Returns: `Error?`

Sample code:

```ballerina
check store->put("session-001", {role: ai:SYSTEM, content: "You are a helpful assistant."});
check store->put("session-001", [
    {role: ai:USER, content: "What is the capital of France?"},
    {role: ai:ASSISTANT, content: "The capital of France is Paris."}
]);
```

</details>

#### Message retrieval

<details>
<summary>getChatSystemMessage</summary>

Retrieves the system message stored for the given key, or `()` if none exists.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `key` | `string` | Yes | Unique identifier for the conversation or session. |

Returns: `ai:ChatSystemMessage|Error?`

Sample code:

```ballerina
ai:ChatSystemMessage? sysMsg = check store->getChatSystemMessage("session-001");
```

Sample response:

```ballerina
{"role": "system", "content": "You are a helpful assistant."}
```

</details>

<details>
<summary>getChatInteractiveMessages</summary>

Retrieves all interactive (user, assistant, function) messages for the given key in insertion order.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `key` | `string` | Yes | Unique identifier for the conversation or session. |

Returns: `ai:ChatInteractiveMessage[]|Error`

Sample code:

```ballerina
ai:ChatInteractiveMessage[] messages = check store->getChatInteractiveMessages("session-001");
```

Sample response:

```ballerina
[
  {"role": "user", "content": "What is the capital of France?"},
  {"role": "assistant", "content": "The capital of France is Paris."}
]
```

</details>

<details>
<summary>getAll</summary>

Retrieves all messages for the given key. Returns a tuple starting with the system message followed by interactive messages if a system message exists, or an array of only interactive messages otherwise.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `key` | `string` | Yes | Unique identifier for the conversation or session. |

Returns: `[ai:ChatSystemMessage, ai:ChatInteractiveMessage...]|ai:ChatInteractiveMessage[]|Error`

Sample code:

```ballerina
var allMessages = check store->getAll("session-001");
```

Sample response:

```ballerina
[
  {"role": "system", "content": "You are a helpful assistant."},
  {"role": "user", "content": "What is the capital of France?"},
  {"role": "assistant", "content": "The capital of France is Paris."}
]
```

</details>

#### Message removal

<details>
<summary>removeChatSystemMessage</summary>

Deletes the system message stored for the given key.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `key` | `string` | Yes | Unique identifier for the conversation or session. |

Returns: `Error?`

Sample code:

```ballerina
check store->removeChatSystemMessage("session-001");
```

</details>

<details>
<summary>removeChatInteractiveMessages</summary>

Removes interactive messages for the given key. When `count` is specified, removes only the first `count` messages (oldest first); otherwise removes all interactive messages.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `key` | `string` | Yes | Unique identifier for the conversation or session. |
| `count` | `int?` | No | Number of oldest interactive messages to remove. Omit to remove all. |

Returns: `Error?`

Sample code:

```ballerina
// Remove oldest 2 interactive messages
check store->removeChatInteractiveMessages("session-001", 2);

// Remove all interactive messages
check store->removeChatInteractiveMessages("session-001");
```

</details>

<details>
<summary>removeAll</summary>

Removes all messages (system and interactive) stored for the given key.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `key` | `string` | Yes | Unique identifier for the conversation or session. |

Returns: `Error?`

Sample code:

```ballerina
check store->removeAll("session-001");
```

</details>

#### Capacity management

<details>
<summary>isFull</summary>

Returns `true` if the number of interactive messages stored for the key has reached or exceeded the configured `maxMessagesPerKey` limit.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `key` | `string` | Yes | Unique identifier for the conversation or session. |

Returns: `boolean|Error`

Sample code:

```ballerina
boolean full = check store->isFull("session-001");
```

Sample response:

```ballerina
false
```

</details>

<details>
<summary>getCapacity</summary>

Returns the maximum number of interactive messages allowed per key, as set during initialisation.

Returns: `int`

Sample code:

```ballerina
int capacity = store->getCapacity();
```

Sample response:

```ballerina
20
```

</details>
