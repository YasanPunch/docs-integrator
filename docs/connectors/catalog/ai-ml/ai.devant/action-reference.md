# Actions

The `ballerinax/ai.devant` package exposes the following clients:

| Client | Purpose |
|--------|---------|
| [`Chunker`](#chunker) | Sends binary documents to the Devant AI API and returns an array of semantic chunks. |
| [`Binary Data Loader`](#binary-data-loader) | Loads binary documents from a local file or directory into `ai:Document` objects ready for processing. |

---

## Chunker

Sends binary documents to the Devant AI API and returns an array of semantic chunks.

### Configuration

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `serviceUrl` | `string` | Required | The base URL of the Devant chunking service endpoint. |
| `accessToken` | `string` | Required | Bearer token used to authenticate requests to the Devant API. |
| `maxChunkSize` | `int` | `500` | Maximum number of characters allowed per chunk. |
| `maxOverlapSize` | `int` | `50` | Maximum number of characters to reuse from the end of the previous chunk to preserve context. |
| `strategy` | `devant:ChunkStrategy` | `RECURSIVE` | Chunking strategy: `RECURSIVE`, `SENTENCE`, `PARAGRAPH`, or `CHARACTER`. |
| `connectionConfig` | `ai:ConnectionConfig` | `{}` | Additional HTTP connection configuration (timeouts, proxy, SSL, etc.). |

### Initializing the client

```ballerina
import ballerinax/ai.devant;

configurable string serviceUrl = ?;
configurable string accessToken = ?;

devant:Chunker chunker = check new (
    serviceUrl = serviceUrl,
    accessToken = accessToken,
    maxChunkSize = 500,
    maxOverlapSize = 50,
    strategy = devant:RECURSIVE
);
```

### Operations

#### Document chunking

<details>
<summary>chunk</summary>

Sends a binary document to the Devant AI service and returns the document split into an array of semantic chunks according to the configured strategy.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `document` | `ai:Document` | Yes | The binary document to chunk. Must be an `ai:BinaryDocument` with `metadata.fileName` set. |

Returns: `ai:Chunk[]|ai:Error`

Sample code:

```ballerina
devant:BinaryDataLoader loader = check new ("./documents/sample.pdf");
ai:Document doc = check loader.load();

ai:Chunk[] chunks = check chunker.chunk(doc);
```

Sample response:

```ballerina
[
  {
    "content": "Introduction to artificial intelligence and machine learning concepts.",
    "metadata": {"chunk_id": 0, "fileName": "sample.pdf", "source": "sample.pdf"}
  },
  {
    "content": "Machine learning is a subset of AI that enables systems to learn from data.",
    "metadata": {"chunk_id": 1, "fileName": "sample.pdf", "source": "sample.pdf"}
  },
  {
    "content": "Deep learning uses neural networks with multiple layers to model complex patterns.",
    "metadata": {"chunk_id": 2, "fileName": "sample.pdf", "source": "sample.pdf"}
  }
]
```

</details>

---

## Binary data loader

Loads binary documents from a local file or directory into `ai:Document` objects ready for processing.

### Configuration

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `path` | `string` | Required | The absolute or relative file system path to a single file or a directory of files to load. |

### Initializing the client

```ballerina
import ballerinax/ai.devant;

devant:BinaryDataLoader loader = check new ("./documents/sample.pdf");
```

### Operations

#### Document loading

<details>
<summary>load</summary>

Loads documents from the configured file system path. Returns a single `ai:Document` if the path points to a file, or an `ai:Document[]` if the path points to a directory (loads all first-level regular files; subdirectories are excluded).

Returns: `ai:Document[]|ai:Document|ai:Error`

Sample code:

```ballerina
// Load a single file
devant:BinaryDataLoader loader = check new ("./documents/report.pdf");
ai:Document doc = check loader.load();

// Load all files in a directory
devant:BinaryDataLoader dirLoader = check new ("./documents/");
ai:Document[] docs = check dirLoader.load();
```

Sample response:

```ballerina
{
  "content": "<binary content>",
  "metadata": {
    "fileName": "report.pdf",
    "fileSize": 204800,
    "lastModified": 1710758400000
  }
}
```

</details>
