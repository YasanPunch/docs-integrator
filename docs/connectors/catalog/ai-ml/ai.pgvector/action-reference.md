---
title: Actions
---

# Actions

The `ballerinax/ai.pgvector` package exposes the following clients:

| Client | Purpose |
|--------|---------|
| [`Vector Store`](#vector-store) | Store, search, and manage vector embeddings in PostgreSQL with pgvector. |

---

## Vector store

Store, search, and manage vector embeddings in PostgreSQL with pgvector.

### Configuration

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `host` | `string` | Required | Hostname or IP address of the PostgreSQL server. |
| `user` | `string` | Required | Database username for authentication. |
| `password` | `string` | Required | Database password for authentication. |
| `database` | `string` | Required | Name of the PostgreSQL database. |
| `tableName` | `string` | `"vector_store"` | Name of the table to store vectors in. |
| `port` | `int` | `5432` | PostgreSQL server port number. |
| `options` | `postgresql:Options` | `{}` | Additional PostgreSQL connection options. |
| `connectionPool` | `sql:ConnectionPool` | `{}` | Connection pool configuration. |
| `configs` | `Configuration` | `{}` | Vector store configuration including embedding type, vector dimension, and similarity metric. |

### Initializing the client

```ballerina
import ballerinax/ai.pgvector;

configurable string host = ?;
configurable string user = ?;
configurable string password = ?;
configurable string database = ?;

pgvector:VectorStore vectorStore = check new (
    host = host,
    user = user,
    password = password,
    database = database,
    tableName = "embeddings",
    configs = {
        vectorDimension: 1536,
        similarityMetric: pgvector:COSINE
    }
);
```

### Operations

#### Vector operations

<details>
<summary>add</summary>

Adds one or more vector entries with embeddings, content chunks, and optional metadata to the vector store table.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `entries` | `ai:VectorEntry[]` | Yes | Array of vector entries to add. Each entry contains an optional `id`, an `embedding` (dense, sparse, or hybrid), and a `chunk` with content and optional metadata. |

Returns: `ai:Error?`

Sample code:

```ballerina
import ballerina/uuid;

check vectorStore->add([
    {
        id: uuid:createRandomUuid(),
        embedding: [0.1, 0.2, 0.3],
        chunk: {
            'type: "text",
            content: "PostgreSQL is an advanced open-source relational database.",
            metadata: {"source": "docs", "category": "database"}
        }
    },
    {
        id: uuid:createRandomUuid(),
        embedding: [0.4, 0.5, 0.6],
        chunk: {
            'type: "text",
            content: "pgvector adds vector similarity search to PostgreSQL.",
            metadata: {"source": "docs", "category": "extensions"}
        }
    }
]);
```

</details>

<details>
<summary>query</summary>

Searches the vector store for entries most similar to the given embedding, with optional metadata filters and a configurable result limit.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `query` | `ai:VectorStoreQuery` | Yes | Query containing the embedding to search for, optional metadata filters, and a `topK` limit (default `10`). |

Returns: `ai:VectorMatch[]|ai:Error`

Sample code:

```ballerina
import ballerina/ai;

ai:VectorMatch[] results = check vectorStore->query({
    embedding: [0.1, 0.2, 0.3],
    topK: 5,
    filters: {
        filters: [
            {key: "category", operator: ai:EQUAL, value: "database"}
        ],
        condition: ai:AND
    }
});
```

Sample response:

```ballerina
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "embedding": [0.1, 0.2, 0.3],
    "chunk": {
      "type": "text",
      "content": "PostgreSQL is an advanced open-source relational database.",
      "metadata": {"source": "docs", "category": "database"}
    },
    "similarityScore": 1.0
  }
]
```

</details>

<details>
<summary>delete</summary>

Removes one or more vector entries from the store by ID.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `ids` | `string\|string[]` | Yes | A single entry ID or an array of entry IDs to delete. |

Returns: `ai:Error?`

Sample code:

```ballerina
// Delete a single entry
check vectorStore->delete("a1b2c3d4-e5f6-7890-abcd-ef1234567890");

// Delete multiple entries
check vectorStore->delete([
    "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "b2c3d4e5-f6a7-8901-bcde-f12345678901"
]);
```

</details>
