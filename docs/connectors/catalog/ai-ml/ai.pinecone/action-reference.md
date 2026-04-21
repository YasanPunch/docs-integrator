---
title: Actions
---

# Actions

The `ballerinax/ai.pinecone` package exposes the following clients:

| Client | Purpose |
|--------|---------|
| [`Vector Store`](#vector-store) | Implements the ai:VectorStore interface for Pinecone — vector upsert, similarity query, and deletion. |

---

## Vector store

Implements the ai:VectorStore interface for Pinecone — vector upsert, similarity query, and deletion.

### Configuration

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `serviceUrl` | `string` | Required | URL of the Pinecone index host (e.g., `https://my-index-abc123.svc.us-east-1-aws.pinecone.io`). |
| `apiKey` | `string` | Required | Pinecone API key for authentication. |
| `queryMode` | `ai:VectorStoreQueryMode` | `ai:DENSE` | Vector search mode: `ai:DENSE`, `ai:SPARSE`, or `ai:HYBRID`. |
| `config` | `Configuration` | `{}` | Additional Pinecone configuration (namespace, filters, sparse vector). |
| `httpConfig` | `vector:ConnectionConfig` | `{}` | HTTP client configuration for the Pinecone connection (timeout, retry, TLS, proxy, etc.). |

### Initializing the client

```ballerina
import ballerina/ai;
import ballerinax/ai.pinecone;

configurable string serviceUrl = ?;
configurable string apiKey = ?;

pinecone:VectorStore vectorStore = check new (
    serviceUrl = serviceUrl,
    apiKey = apiKey
);
```

### Operations

#### Vector operations

<details>
<summary>add</summary>

Adds (upserts) an array of vector entries to the Pinecone index.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `entries` | `ai:VectorEntry[]` | Yes | Array of vector entries to add. Each entry contains an embedding, a text chunk, and optional metadata. |

Returns: `ai:Error?`

Sample code:

```ballerina
ai:VectorEntry[] entries = [
    {
        id: "vec-001",
        embedding: [0.1, 0.2, 0.3, 0.4],
        chunk: {
            content: "Ballerina is an open-source programming language for cloud-native integration.",
            metadata: {"source": "docs", "category": "programming"}
        }
    },
    {
        id: "vec-002",
        embedding: [0.5, 0.6, 0.7, 0.8],
        chunk: {
            content: "Pinecone is a managed vector database for machine learning applications.",
            metadata: {"source": "docs", "category": "databases"}
        }
    }
];
check vectorStore->add(entries);
```

</details>

<details>
<summary>query</summary>

Queries the Pinecone index with an embedding vector and returns the top similarity matches.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `queryVector` | `ai:VectorStoreQuery` | Yes | The query containing the embedding vector, topK count (1–10,000), and optional metadata filters. |

Returns: `ai:VectorMatch[]|ai:Error`

Sample code:

```ballerina
ai:VectorMatch[] matches = check vectorStore->query({
    embedding: [0.1, 0.2, 0.3, 0.4],
    topK: 5
});
```

Sample response:

```ballerina
[
  {
    "id": "vec-001",
    "embedding": [0.1, 0.2, 0.3, 0.4],
    "chunk": {
      "content": "Ballerina is an open-source programming language for cloud-native integration.",
      "metadata": {"source": "docs", "category": "programming"}
    },
    "similarityScore": 0.98
  },
  {
    "id": "vec-002",
    "embedding": [0.5, 0.6, 0.7, 0.8],
    "chunk": {
      "content": "Pinecone is a managed vector database for machine learning applications.",
      "metadata": {"source": "docs", "category": "databases"}
    },
    "similarityScore": 0.82
  }
]
```

</details>

<details>
<summary>delete</summary>

Deletes vector entries from the Pinecone index by their reference document IDs.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `refDocIds` | `string\|string[]` | Yes | A single document ID or an array of document IDs to delete. |

Returns: `ai:Error?`

Sample code:

```ballerina
check vectorStore->delete(["vec-001", "vec-002"]);
```

</details>
