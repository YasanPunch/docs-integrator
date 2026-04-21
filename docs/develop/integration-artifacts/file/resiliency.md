---
title: Resiliency
---

# Resiliency

FTP and SFTP connections are prone to transient failures — network timeouts, server restarts, connection limits, and temporary unavailability. When the listener fails to connect during a polling cycle, it can automatically retry with exponential backoff instead of silently skipping the cycle.

## Automatic retry

Add a `retryConfig` to the listener configuration to enable automatic retries for failed polling attempts. On each retry, the listener waits for an increasing interval and reconnects to the server before polling again.

In the **FTP Integration Configuration** panel, select **ftpListener** under **Attached Listeners** and expand **Advanced Configurations**. Configure the **Retry Configuration** fields.

```ballerina
import ballerina/ftp;

listener ftp:Listener ftpListener = new (
    protocol = ftp:FTP,
    host = "ftp.example.com",
    port = 21,
    auth = {credentials: {username: "user", password: "pass"}},
    pollingInterval = 30,
    retryConfig = {
        count: 3,
        interval: 1.0,
        backOffFactor: 2.0,
        maxWaitInterval: 30.0
    }
);
```

### RetryConfig fields

| Field | Type | Default | Description |
|---|---|---|---|
| `count` | `int` | `3` | Maximum number of retry attempts per failed polling cycle. |
| `interval` | `decimal` | `1.0` | Initial wait time in seconds between retries. |
| `backOffFactor` | `float` | `2.0` | Multiplier applied to the wait time after each retry. |
| `maxWaitInterval` | `decimal` | `30.0` | Maximum wait time cap in seconds. The wait time never exceeds this value regardless of the backoff multiplier. |

### Retry sequence

With the default configuration (`count=3`, `interval=1s`, `backOffFactor=2.0`):

```text
Poll → connection fails → Wait 1s → Reconnect → Retry 1
                           FAIL    → Wait 2s → Reconnect → Retry 2
                                     FAIL    → Wait 4s → Reconnect → Retry 3
                                               FAIL    → Skip this cycle, wait for next pollingInterval
```

If the connection succeeds on any retry, the listener polls normally and the retry counter resets. If all retries are exhausted, the listener waits for the next `pollingInterval` and tries again from scratch.

### When retries help

| Scenario | Retry useful? |
|---|---|
| FTP server temporarily unreachable (restart, network blip) | Yes — the server is likely back within a few seconds. |
| DNS resolution failure | Yes — transient DNS issues often resolve within seconds. |
| Connection limit exceeded on the server | Yes — a short backoff lets existing connections close. |
| Invalid credentials or wrong host | No — these are configuration errors, not transient. Retries will keep failing. |
| Server permanently decommissioned | No — fix the listener configuration. |

## What's next

- [FTP / SFTP](ftp-sftp.md) — service configuration, authentication, and file handlers
- [High availability](high-availability.md) — distributed listener coordination to prevent duplicate processing
- [Streaming large files](streaming-large-files.md) — process large files without loading into memory
