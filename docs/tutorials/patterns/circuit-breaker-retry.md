---
title: Circuit Breaker & Retry
---

# Circuit Breaker & Retry

## Problem

When a downstream service becomes slow or unavailable, your integration keeps sending requests that time out or fail. This wastes resources, increases latency for end users, and can create cascading failures across the system. Simple retry logic without backoff or limits can make the problem worse by overwhelming the struggling service.

## Solution

Apply the **Circuit Breaker** pattern to monitor the health of downstream calls. The circuit has three states:

- **Closed** (normal): Requests flow through. Failures are counted.
- **Open** (tripped): Requests are immediately rejected without calling the backend. This gives the failing service time to recover.
- **Half-Open** (testing): After a cooldown period, a single probe request is allowed through. If it succeeds, the circuit closes; if it fails, the circuit reopens.

Combine this with **retry with exponential backoff** for transient failures that resolve quickly.

```mermaid
flowchart TD
    CLOSED[CLOSED<br/>(normal)]
    OPEN[OPEN<br/>(blocking)]
    HALF_OPEN[HALF-OPEN<br/>(probing)]

    CLOSED ---->|failures >= threshold| OPEN
    OPEN ---->|cooldown expires| HALF_OPEN
    HALF_OPEN ---->|probe fails| OPEN
    HALF_OPEN ---->|failures < threshold| CLOSED
```

## When to Use It

- Calling external REST APIs, databases, or third-party services that may become temporarily unavailable.
- You want to **fail fast** rather than wait for timeouts when a dependency is known to be down.
- Protecting your system from cascading failures when one service in a chain degrades.
- Combined with retry for transient errors like network glitches or brief service restarts.

Avoid this pattern for local operations or in-memory calls where failure is not expected.

## Implementation

Ballerina's HTTP client has built-in circuit breaker and retry support through client configuration:

```ballerina
import ballerina/http;
import ballerina/log;

// HTTP client with circuit breaker and retry configuration.
final http:Client backendClient = check new ("http://backend-service:8080", {
    // Retry configuration: attempt up to 3 retries with exponential backoff.
    retryConfig: {
        count: 3,
        interval: 1,          // Initial interval in seconds
        backOffFactor: 2.0,    // Exponential multiplier: 1s, 2s, 4s
        maxWaitInterval: 10    // Maximum wait between retries in seconds
    },
    // Circuit breaker configuration.
    circuitBreaker: {
        rollingWindow: {
            timeWindow: 60,        // Evaluate failures over the last 60 seconds
            bucketSize: 10         // In 10-second buckets
        },
        failureThreshold: 0.5,    // Open circuit when 50% of requests fail
        resetTime: 30,            // Try half-open after 30 seconds
        statusCodes: [500, 502, 503]  // HTTP codes that count as failures
    },
    timeout: 5                     // Per-request timeout in seconds
});

type PaymentResult record {|
    string transactionId;
    string status;
|};

service /api on new http:Listener(8090) {

    resource function post pay(record {|string customerId; decimal amount;|} req)
            returns PaymentResult|http:ServiceUnavailable|http:InternalServerError {

        PaymentResult|error result = backendClient->post("/charge", req);

        if result is http:CircuitBreakerError {
            log:printWarn("Circuit is OPEN -- payment service is unavailable");
            return <http:ServiceUnavailable>{
                body: {message: "Payment service is temporarily unavailable. Please try again later."}
            };
        }

        if result is error {
            log:printError("Payment call failed after retries", result);
            return <http:InternalServerError>{body: {message: "Payment processing failed"}};
        }

        return result;
    }
}
```

For cases where you need manual circuit breaker control (e.g., wrapping a database call or a non-HTTP dependency):

```ballerina
import ballerina/log;
import ballerina/time;

// Manual circuit breaker state.
isolated int failureCount = 0;
isolated int successCount = 0;
isolated string circuitState = "CLOSED";  // "CLOSED" | "OPEN" | "HALF_OPEN"
isolated int lastFailureTime = 0;

const int FAILURE_THRESHOLD = 5;
const int RESET_TIMEOUT_MS = 30000;

isolated function callWithCircuitBreaker(function () returns anydata|error fn) returns anydata|error {
    lock {
        // Check if circuit is OPEN.
        if circuitState == "OPEN" {
            int now = time:monotonicNow();
            if now - lastFailureTime > RESET_TIMEOUT_MS {
                circuitState = "HALF_OPEN";
                log:printInfo("Circuit moved to HALF_OPEN");
            } else {
                return error("Circuit is OPEN -- call rejected");
            }
        }
    }

    anydata|error result = fn();

    lock {
        if result is error {
            failureCount += 1;
            lastFailureTime = time:monotonicNow();
            if failureCount >= FAILURE_THRESHOLD {
                circuitState = "OPEN";
                log:printWarn(string `Circuit OPENED after ${failureCount} failures`);
            }
        } else {
            if circuitState == "HALF_OPEN" {
                circuitState = "CLOSED";
                failureCount = 0;
                log:printInfo("Circuit CLOSED -- backend recovered");
            }
            successCount += 1;
        }
    }

    return result;
}
```

## Considerations

- **Threshold tuning**: Set the failure threshold based on normal error rates. Too sensitive and the circuit trips on transient blips; too lenient and it does not protect the system.
- **Reset time**: Choose a cooldown period that gives the backend enough time to recover. Monitor and adjust based on typical recovery times.
- **Fallback responses**: When the circuit is open, return a meaningful fallback (cached data, default response, or a clear error message) rather than a generic 500.
- **Monitoring**: Emit metrics for circuit state transitions (open/close events) so operations teams can react quickly.
- **Granularity**: Apply circuit breakers per endpoint or per operation, not per entire service, to avoid blocking healthy endpoints when only one path is failing.

## Related Patterns

- [API Gateway & Orchestration](api-gateway-orchestration.md) -- Circuit breakers are commonly applied within gateway orchestration flows.
- [Saga / Compensation](saga-compensation.md) -- Use circuit breakers on individual saga steps to detect unrecoverable failures early.
- [Scatter-Gather](scatter-gather.md) -- Apply circuit breakers to individual parallel branches.
