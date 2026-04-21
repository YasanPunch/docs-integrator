---
title: Custom Metrics
---

# Custom Metrics

Define and publish custom application-level metrics from your WSO2 Integrator integrations to monitor business KPIs, SLA compliance, and integration health beyond the built-in metrics.

## When to Use Custom Metrics

- Track business metrics (orders processed, messages transformed, records synced)
- Monitor SLA compliance (response times, error rates per partner)
- Measure integration throughput and queue depths
- Create domain-specific dashboards

## Defining Custom Metrics

Ballerina's `observe` module provides APIs for creating counters and gauges:

### Counter (Monotonically Increasing)

```ballerina
import ballerina/observe;

final observe:Counter ordersProcessed = new ("orders_processed_total",
    description = "Total number of orders processed",
    tags = {}
);

// Increment in your service logic
ordersProcessed.increment(amount = 1);
```

### Gauge (Value That Goes Up and Down)

```ballerina
final observe:Gauge activeConnections = new ("active_connections",
    description = "Number of active connections",
    tags = {}
);

// Set or adjust the value
activeConnections.increment(amount = 1);
activeConnections.decrement(amount = 1);
```

### Tagged Metrics

Add dimensions to metrics for filtering and grouping:

```ballerina
final observe:Counter requestsByPartner = new ("requests_by_partner_total",
    description = "Requests processed per partner",
    tags = {partner: "unknown", status: "unknown"}
);

// Use tags when recording
map<string> tags = {partner: "acme-corp", status: "success"};
observe:Counter partnerCounter = requestsByPartner.withTags(tags);
partnerCounter.increment(amount = 1);
```

## Exposing Metrics

Custom metrics are automatically included in the Prometheus metrics endpoint when observability is enabled:

```toml
# Config.toml
[ballerina.observe]
metricsEnabled = true
metricsReporter = "prometheus"

[ballerina.observe.metrics.prometheus]
port = 9797
```

Access all metrics (including custom ones) at:

```
http://localhost:9797/metrics
```

## Example: Integration Health Dashboard

```ballerina
import ballerina/observe;
import ballerina/time;

// Business metrics
final observe:Counter messagesReceived = new("messages_received_total");
final observe:Counter messagesTransformed = new("messages_transformed_total");
final observe:Counter transformErrors = new("transform_errors_total");
final observe:Gauge processingTime = new("message_processing_seconds");

service /api on new http:Listener(8080) {
    resource function post transform(@http:Payload json msg) returns json|error {
        messagesReceived.increment();
        time:Utc startTime = time:utcNow();

        json|error result = transformMessage(msg);

        decimal elapsed = time:utcDiffInSeconds(time:utcNow(), startTime);
        processingTime.setValue(elapsed);

        if result is error {
            transformErrors.increment();
            return result;
        }

        messagesTransformed.increment();
        return result;
    }
}
```

## Grafana Dashboard

Use these metrics in Grafana with PromQL queries:

| Metric | PromQL | Panel Type |
|---|---|---|
| Throughput | `rate(messages_received_total[5m])` | Graph |
| Error rate | `rate(transform_errors_total[5m]) / rate(messages_received_total[5m])` | Gauge |
| Processing time | `message_processing_seconds` | Stat |
| Success ratio | `messages_transformed_total / messages_received_total` | Gauge |

## What's Next

- [Prometheus](./prometheus) — Set up Prometheus metrics collection
- [Grafana](./grafana) — Build dashboards for your metrics
- [Observability Overview](./overview) — Understand the full observability stack
