---
title: Logging & Structured Logs
---

# Logging & Structured Logs

Configure logging for your WSO2 Integrator services to capture operational data, debug issues, and feed log aggregation systems.

## Default Logging Behavior

Ballerina provides a built-in `ballerina/log` module that writes log messages to standard output (stdout). By default, the log level is set to `INFO`, and messages are emitted in a human-readable format.

```ballerina
import ballerina/log;

service /orders on new http:Listener(9090) {
    resource function post .(@http:Payload json order) returns json|error {
        log:printInfo("Order received", orderId = order.id);
        // Process order...
        log:printInfo("Order processed successfully", orderId = order.id);
        return { status: "accepted" };
    }
}
```

Default output format:

```
time=2025-03-15T10:30:00.000Z level=INFO module=myorg/order_service message="Order received" orderId="ORD-12345"
```

## Log Levels and Configuration

Ballerina supports the following log levels, from most to least verbose:

| Level | Usage |
|---|---|
| `DEBUG` | Detailed diagnostic information for development |
| `INFO` | General operational events (default) |
| `WARN` | Potentially harmful situations that deserve attention |
| `ERROR` | Error events that may still allow the service to continue |

### Setting the Log Level

Configure the log level in `Config.toml`:

```toml
# Config.toml
[ballerina.log]
level = "DEBUG"
```

Or set it via environment variable:

```bash
export BAL_CONFIG_VAR_BALLERINA_LOG_LEVEL=DEBUG
```

### Module-Specific Log Levels

Control log verbosity per module to reduce noise in production:

```toml
# Config.toml
[ballerina.log]
level = "WARN"                          # Global default

[[ballerina.log.modules]]
name = "myorg/order_service"
level = "INFO"                          # More verbose for this module

[[ballerina.log.modules]]
name = "myorg/payment_client"
level = "DEBUG"                         # Debug a specific module
```

### Using Log Functions

```ballerina
import ballerina/log;

public function processPayment(string orderId, decimal amount) returns error? {
    log:printDebug("Starting payment processing", orderId = orderId, amount = amount);

    do {
        // Process payment...
        log:printInfo("Payment completed", orderId = orderId, amount = amount);
    } on fail error e {
        log:printError("Payment failed", orderId = orderId, 'error = e);
        return e;
    }
}
```

## Structured Logging Format

Ballerina emits structured logs in key-value format by default, which is compatible with most log aggregation tools. Each log entry includes:

- `time` -- ISO 8601 timestamp
- `level` -- Log level
- `module` -- Ballerina module name
- `message` -- Log message string
- Custom key-value pairs passed as named arguments

### Adding Context to Log Entries

Pass additional context as named arguments to log functions:

```ballerina
import ballerina/log;

service /orders on new http:Listener(9090) {
    resource function post .(@http:Payload json order) returns json|error {
        string orderId = check order.id;
        string customerId = check order.customerId;
        decimal total = check order.total;

        log:printInfo("Processing order",
            orderId = orderId,
            customerId = customerId,
            total = total,
            itemCount = order.items.length()
        );

        return { status: "accepted" };
    }
}
```

Output:

```
time=2025-03-15T10:30:00.000Z level=INFO module=myorg/order_service message="Processing order" orderId="ORD-12345" customerId="CUST-789" total=149.99 itemCount=3
```

### JSON Log Format

For systems that require JSON-formatted logs, configure the log output format:

```toml
# Config.toml
[ballerina.log]
level = "INFO"
format = "json"
```

JSON output:

```json
{
  "time": "2025-03-15T10:30:00.000Z",
  "level": "INFO",
  "module": "myorg/order_service",
  "message": "Processing order",
  "orderId": "ORD-12345",
  "customerId": "CUST-789",
  "total": 149.99
}
```

## Log Aggregation

### ELK Stack (Elasticsearch, Logstash, Kibana)

Ship container logs to the ELK stack using Filebeat as a sidecar or DaemonSet:

```yaml
# k8s/filebeat-sidecar.yaml
- name: filebeat
  image: docker.elastic.co/beats/filebeat:8.11.0
  volumeMounts:
    - name: shared-logs
      mountPath: /var/log/app
  env:
    - name: ELASTICSEARCH_HOST
      value: "elasticsearch.logging:9200"
```

Alternatively, when running on Kubernetes, use the Elastic Agent DaemonSet to collect stdout logs from all pods automatically.

### Loki (with Grafana)

Loki collects logs from Kubernetes pods using Promtail. Install Promtail as a DaemonSet in your cluster:

```yaml
# promtail-config.yaml
scrape_configs:
  - job_name: kubernetes-pods
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_label_app]
        target_label: app
      - source_labels: [__meta_kubernetes_namespace]
        target_label: namespace
```

Query logs in Grafana using LogQL:

```
{app="wso2-integrator-app"} |= "ERROR"
{app="wso2-integrator-app"} | json | level="ERROR" | orderId="ORD-12345"
```

### CloudWatch Logs

On AWS ECS or EKS, send logs directly to CloudWatch using the `awslogs` log driver (ECS) or the CloudWatch agent (EKS). The structured key-value format is automatically parsed by CloudWatch Logs Insights:

```
fields @timestamp, @message
| filter @message like /ERROR/
| sort @timestamp desc
| limit 50
```

## What's Next

- [Metrics](metrics.md) -- Monitor service health with Prometheus and Grafana
- [Distributed Tracing](tracing.md) -- Trace requests across services
- [Integration Control Plane](icp.md) -- Centralized monitoring dashboard
