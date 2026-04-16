---
title: Resiliency
description: Handle transient FTP/SFTP failures with automatic retry and circuit breaker protection on client operations.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Resiliency

FTP and SFTP connections are prone to transient failures — network timeouts, server restarts, connection limits, and temporary unavailability. WSO2 Integrator provides two complementary resiliency mechanisms for `ftp:Caller` and `ftp:Client` operations:

- **Automatic retry** — Retries failed read operations with exponential backoff.
- **Circuit breaker** — Stops sending requests to an unhealthy server and allows controlled recovery.

Both are configured on the client/caller and can be used independently or together.

## Automatic retry

Retry automatically re-attempts failed **read operations** with exponential backoff. On each retry, the client reconnects to the server before retrying.

### Configuration

Add a `retryConfig` to the client configuration:

```ballerina
ftp:Client ftpClient = check new ({
    host: "ftp.example.com",
    auth: {credentials: {username: "user", password: "pass"}},
    retryConfig: {
        count: 3,
        interval: 1.0,
        backOffFactor: 2.0,
        maxWaitInterval: 30.0
    }
});
```

### RetryConfig fields

| Field | Type | Default | Description |
|---|---|---|---|
| `count` | `int` | `3` | Maximum number of retry attempts. |
| `interval` | `decimal` | `1.0` | Initial wait time in seconds between retries. |
| `backOffFactor` | `float` | `2.0` | Multiplier applied to the wait time after each retry. |
| `maxWaitInterval` | `decimal` | `30.0` | Maximum wait time cap in seconds. The wait time never exceeds this value regardless of the backoff multiplier. |

### Retry sequence

With the default configuration (`count=3`, `interval=1s`, `backOffFactor=2.0`):

```text
Attempt 1 → FAIL → Wait 1s → Reconnect
Attempt 2 → FAIL → Wait 2s → Reconnect
Attempt 3 → FAIL → Wait 4s → Reconnect
Attempt 4 → FAIL → Return AllRetryAttemptsFailedError
```

### Supported operations

Retry applies to **client read operations** only:

| Operation | Retry support |
|---|---|
| `getBytes`, `getText`, `getJson`, `getXml`, `getCsv` | Yes |
| `putBytes`, `putText`, `putJson`, `putXml`, `putCsv` | No — write operations in `APPEND` mode are not idempotent; partial writes cannot be safely retried. |
| `getBytesAsStream`, `getCsvAsStream`, `putBytesAsStream`, `putCsvAsStream` | No — stream state cannot be restored or replayed. |
| `delete`, `mkdir`, `exists` | No — these are quick atomic operations; failures typically indicate real problems, not transient issues. |

### Error handling

When all retries are exhausted, the client returns an `ftp:AllRetryAttemptsFailedError` wrapping the last failure:

```ballerina
byte[]|ftp:Error content = ftpClient->getBytes("/data/report.csv");

if content is ftp:AllRetryAttemptsFailedError {
    log:printError("All retry attempts exhausted", content);
} else if content is ftp:Error {
    log:printError("Non-retryable error", content);
}
```

## Circuit breaker

The circuit breaker prevents cascade failures by temporarily blocking requests to a server that is failing consistently. This avoids wasting resources on repeated failed connection attempts and gives the server time to recover.

### State machine

The circuit breaker has three states:

```text
┌─────────┐   failure ratio    ┌──────┐   reset time    ┌───────────┐
│ CLOSED  │ ──── exceeds ────> │ OPEN │ ──── elapses ──>│ HALF_OPEN │
│ (normal)│    threshold       │(fail)│                  │  (probe)  │
└─────────┘                    └──────┘                  └───────────┘
     ^                                                        │
     │              trial request succeeds                    │
     └────────────────────────────────────────────────────────┘
                    trial request fails → back to OPEN
```

| State | Behaviour |
|---|---|
| **CLOSED** | Requests proceed normally. Failures are tracked in a rolling window. |
| **OPEN** | All requests fail immediately with `ftp:CircuitBreakerOpenError`. No connection is attempted. |
| **HALF_OPEN** | One trial request is allowed through. If it succeeds, the circuit closes. If it fails, the circuit opens again. |

### Configuration

Add a `circuitBreaker` to the client configuration:

```ballerina
ftp:Client ftpClient = check new ({
    protocol: ftp:SFTP,
    host: "sftp.example.com",
    port: 22,
    auth: {
        credentials: {username: "user"},
        privateKey: {path: "/path/to/key"}
    },
    circuitBreaker: {
        rollingWindow: {
            timeWindow: 60,
            bucketSize: 10,
            requestVolumeThreshold: 10
        },
        failureThreshold: 0.5,
        resetTime: 30,
        failureCategories: [ftp:CONNECTION_ERROR, ftp:TRANSIENT_ERROR]
    }
});
```

### CircuitBreakerConfig fields

| Field | Type | Default | Description |
|---|---|---|---|
| `rollingWindow` | `RollingWindow` | see below | Configuration for the sliding time window that tracks failure rates. |
| `failureThreshold` | `float` | `0.5` | Failure ratio (0.0–1.0) that triggers the circuit to open. `0.5` means the circuit opens when 50% of requests fail. |
| `resetTime` | `decimal` | `30` | Seconds to wait in the OPEN state before allowing a trial request (HALF_OPEN). |
| `failureCategories` | `FailureCategory[]` | `[CONNECTION_ERROR, TRANSIENT_ERROR]` | Which error categories count toward the failure ratio. |

### RollingWindow fields

| Field | Type | Default | Description |
|---|---|---|---|
| `requestVolumeThreshold` | `int` | `10` | Minimum number of requests in the time window before the failure ratio is evaluated. Prevents tripping on low traffic. |
| `timeWindow` | `decimal` | `60` | Duration of the sliding window in seconds. |
| `bucketSize` | `decimal` | `10` | Size of each time bucket in seconds within the rolling window. |

### Failure categories

| Category | Errors counted |
|---|---|
| `CONNECTION_ERROR` | Connection refused, socket timeout, DNS resolution failure, connection reset |
| `AUTHENTICATION_ERROR` | Invalid credentials, SSH key rejection |
| `TRANSIENT_ERROR` | Connection reset during transfer, unexpected EOF, unexpected disconnection |
| `ALL_ERRORS` | Every error counts, regardless of category |

### Error handling

When the circuit is open, all operations return immediately with `ftp:CircuitBreakerOpenError`:

```ballerina
byte[]|ftp:Error result = ftpClient->getBytes("/files/data.txt");

if result is ftp:CircuitBreakerOpenError {
    log:printWarn("FTP server unavailable, using cached data");
    return getCachedData();
} else if result is ftp:Error {
    return error("Failed to fetch file", result);
}
```

## Combining retry and circuit breaker

When both are configured, the circuit breaker wraps the retry mechanism:

1. Circuit breaker checks state.
2. If **OPEN**: returns `CircuitBreakerOpenError` immediately — no retry occurs.
3. If **CLOSED** or **HALF_OPEN**: the request proceeds to the retry layer.
4. The retry layer attempts the operation with the configured retries.
5. The **final outcome** (success or failure after all retries) updates the circuit breaker's health tracking.

All retry attempts for a single operation count as **one request** for circuit breaker calculations.

```ballerina
ftp:Client ftpClient = check new ({
    host: "ftp.example.com",
    auth: {credentials: {username: "user", password: "pass"}},
    retryConfig: {
        count: 3,
        interval: 1.0,
        backOffFactor: 2.0,
        maxWaitInterval: 30.0
    },
    circuitBreaker: {
        rollingWindow: {
            timeWindow: 60,
            bucketSize: 10,
            requestVolumeThreshold: 10
        },
        failureThreshold: 0.5,
        resetTime: 60
    }
});
```

## Tuning guidelines

| Scenario | Recommended configuration |
|---|---|
| **High-traffic server** | Lower `failureThreshold` (0.3), smaller `timeWindow` (60s), higher `requestVolumeThreshold` (50) |
| **Low-traffic server** | Longer `timeWindow` (300s), lower `requestVolumeThreshold` (5), longer `resetTime` (120s) |
| **Critical operations** | Aggressive detection: `failureThreshold` 0.2, `timeWindow` 30s, `requestVolumeThreshold` 3 |

## What's next

- [FTP / SFTP](ftp-sftp.md) — service configuration, authentication, and file handlers
- [High availability](high-availability.md) — distributed listener coordination to prevent duplicate processing
- [Streaming large files](streaming-large-files.md) — process large files without loading into memory
