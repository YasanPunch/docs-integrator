---
title: Streaming Large Files
---

# Streaming Large Files

By default, file handlers load the entire file content into memory before your handler runs. For large files (hundreds of megabytes or more), this can exhaust available memory. Streaming lets you process content incrementally — one row at a time for CSV, or in byte chunks for binary files.

## When to stream

| Scenario | Approach |
|---|---|
| Files under ~50 MB | Use buffered (non-stream) handlers. Simpler code, random access to all rows. |
| CSV files over ~50 MB | Use `stream<RecordType, error?>` in `onFileCsv`. Rows are parsed and bound one at a time. |
| Binary files over ~50 MB | Use `stream<byte[], error?>` in `onFile`. Byte chunks are delivered incrementally. |

Streaming is supported for **`onFileCsv`** and **`onFile`** only. JSON and XML handlers (`onFileJson`, `onFileXml`) do not have streamed variants.

## Streaming CSV with typed records

Declare the `onFileCsv` handler's first parameter as `stream<RecordType, error?>` where `RecordType` is a user-defined record. Each row is automatically parsed and bound to the record type as the stream is consumed.

When adding a file handler, select **CSV** as the file format, define a row schema, and enable **Stream (Large Files)**. This generates a handler that receives a typed record stream.

```ballerina
type Order record {|
    string orderId;
    string customerId;
    string product;
    int quantity;
    decimal unitPrice;
|};

@ftp:ServiceConfig {
    path: "/incoming"
}
service on ftpListener {

    @ftp:FunctionConfig {
        afterProcess: {moveTo: "/processed"},
        afterError: {moveTo: "/errors"}
    }
    remote function onFileCsv(stream<Order, error?> content,
                              ftp:FileInfo fileInfo) returns error? {
        check content.forEach(function(Order order) {
            log:printInfo(string `Order: ${order.orderId}, Qty: ${order.quantity}`);
        });
    }
}
```

You can also use `stream<string[], error?>` to receive raw row arrays and parse them yourself:

```ballerina
remote function onFileCsv(stream<string[], error?> content,
                          ftp:FileInfo fileInfo) returns error? {
    check content.forEach(function(string[] row) {
        // row[0], row[1], ... — manual column access
    });
}
```

## Streaming binary files

Declare the `onFile` handler's first parameter as `stream<byte[], error?>` to receive byte chunks.

```ballerina
@ftp:ServiceConfig {
    path: "/incoming"
}
service on ftpListener {

    remote function onFile(stream<byte[], error?> content,
                           ftp:FileInfo fileInfo) returns error? {
        // Write chunks to local storage incrementally
        check content.forEach(function(byte[] chunk) {
            // Process each byte chunk
        });
    }
}
```

## Error handling in streams

When a row cannot be bound to the target record type, the stream produces an error element and **terminates**. The handler should catch this and decide how to proceed.

```ballerina
remote function onFileCsv(stream<Order, error?> content,
                          ftp:FileInfo fileInfo) returns error? {
    error? streamErr = content.forEach(function(Order order) {
        log:printInfo(string `Processing: ${order.orderId}`);
    });

    if streamErr is error {
        log:printError("Stream terminated with error", 'error = streamErr);
        return streamErr;  // triggers afterError
    }
    // All rows consumed successfully — triggers afterProcess
}
```

### Fault tolerance with streaming CSV

There is one exception to the terminate-on-error behaviour: when **CSV fault tolerance** is enabled and a row has a **structural error** (corrupted column count, not a type mismatch), the row is skipped and the stream continues. This applies only to `onFileCsv` with `failSafe` enabled.

For details on enabling fail-safe parsing, see [CSV fault tolerance](csv-fault-tolerance.md) and [CSV processing](../../transform/csv-flat-file.md).

## Post-processing

`@ftp:FunctionConfig` `afterProcess` and `afterError` work the same way with streams as with buffered content. The action is determined by the handler's return value:

| Handler returns | Action triggered |
|---|---|
| `nil` (no error) | `afterProcess` — move or delete the file |
| `error` | `afterError` — move or delete the file |

The stream is always fully closed before the post-processing action runs.

## What's next

- [FTP / SFTP](ftp-sftp.md) — service configuration, file handlers, and authentication
- [CSV fault tolerance](csv-fault-tolerance.md) — skip malformed rows and route files based on outcome
- [File dependency and trigger conditions](file-dependency-triggers.md) — control when files are processed
