---
title: Integration Control Plane (ICP)
---

# Integration Control Plane (ICP)

The Integration Control Plane (ICP) is a centralized dashboard for monitoring, managing, and troubleshooting running WSO2 Integrator services in production.

## Overview

The ICP provides a single pane of glass for all your deployed integrations, regardless of whether they run on Kubernetes, VMs, or WSO2 Devant. It collects runtime data from connected integration nodes and presents it through a web-based dashboard and a REST API.

Key capabilities:

- **Service inventory** -- View all running integration services, their versions, and deployment status
- **Real-time monitoring** -- Observe request rates, error rates, and latency for each service
- **Log aggregation** -- View logs from connected services without accessing individual nodes
- **Configuration management** -- Inspect and update runtime configuration
- **Health status** -- See the health of each service instance and receive alerts on failures
- **Deployment history** -- Track when services were deployed or updated

## Setting Up ICP Connection

### Configuring the Integration Node

Each WSO2 Integrator service connects to the ICP by adding configuration in `Config.toml`:

```toml
# Config.toml
[wso2.integrator.icp]
enabled = true
url = "https://icp.example.com"
authToken = "${ICP_AUTH_TOKEN}"
heartbeatIntervalSeconds = 30
nodeId = "order-service-prod-01"
groupName = "order-service"
```

| Property | Description |
|---|---|
| `enabled` | Enable or disable ICP connectivity |
| `url` | URL of the ICP server |
| `authToken` | Authentication token for the ICP API |
| `heartbeatIntervalSeconds` | How often the node reports status to ICP |
| `nodeId` | Unique identifier for this service instance |
| `groupName` | Logical group name for related service instances |

### Kubernetes Deployment Configuration

When deploying on Kubernetes, pass ICP configuration via environment variables:

```yaml
# k8s/deployment.yaml
spec:
  containers:
    - name: app
      env:
        - name: BAL_CONFIG_VAR_WSO2_INTEGRATOR_ICP_ENABLED
          value: "true"
        - name: BAL_CONFIG_VAR_WSO2_INTEGRATOR_ICP_URL
          value: "https://icp.example.com"
        - name: BAL_CONFIG_VAR_WSO2_INTEGRATOR_ICP_AUTH_TOKEN
          valueFrom:
            secretKeyRef:
              name: icp-credentials
              key: auth-token
        - name: BAL_CONFIG_VAR_WSO2_INTEGRATOR_ICP_NODE_ID
          valueFrom:
            fieldRef:
              fieldPath: metadata.name
```

Using `metadata.name` as the `nodeId` ensures each pod has a unique identifier.

## Dashboard Walkthrough

### Service Overview

The main dashboard displays all registered services with the following information:

- **Service name and version** -- The Ballerina package name and build version
- **Instance count** -- Number of running instances in the group
- **Status** -- Healthy, degraded, or down
- **Request rate** -- Current requests per second
- **Error rate** -- Percentage of 4xx and 5xx responses
- **P99 latency** -- 99th percentile response time

### Service Detail View

Clicking on a service opens the detail view with:

- **Instance list** -- All running instances, their node IDs, and individual health status
- **Metrics graphs** -- Request rate, error rate, and latency over time
- **Recent logs** -- Latest log entries from all instances in the group
- **API endpoints** -- List of exposed resource functions with per-endpoint metrics
- **Configuration** -- Current runtime configuration values (secrets are masked)

### Topology View

The topology view shows the dependency graph of your integration services, displaying which services call which other services and external endpoints. This view is constructed from distributed trace data.

## Managing Integrations via ICP

### Updating Configuration

Push configuration updates to running services without redeployment:

```bash
# Update a configuration value via the ICP CLI
icp config set order-service --key logLevel --value DEBUG --env production

# View current configuration
icp config get order-service --env production
```

Or use the ICP dashboard:

1. Navigate to the service detail view
2. Click the **Configuration** tab
3. Edit the desired value
4. Click **Apply** to push the change to all instances in the group

### Service Lifecycle

Control service instances from the ICP:

```bash
# Restart all instances in a service group
icp service restart order-service --env production

# Stop a specific instance
icp service stop --node order-service-prod-01

# Scale a service group (requires Kubernetes)
icp service scale order-service --replicas 5 --env production
```

### Alerts and Notifications

Configure alerts based on service metrics:

```bash
# Create an alert rule
icp alert create \
  --name "high-error-rate" \
  --service order-service \
  --condition "error_rate > 5%" \
  --duration 5m \
  --severity critical \
  --notify "ops-team@example.com"
```

Alert conditions include:

- Error rate thresholds
- Latency thresholds (P50, P95, P99)
- Instance health changes (instance down)
- Request rate anomalies

## ICP API for Automation

The ICP exposes a REST API for programmatic access, enabling integration with CI/CD pipelines, custom dashboards, and automation scripts.

### Authentication

```bash
# Obtain an API token
curl -X POST https://icp.example.com/api/v1/auth/token \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin"}'
```

### Common API Endpoints

**List all services:**

```bash
curl -H "Authorization: Bearer ${ICP_TOKEN}" \
  https://icp.example.com/api/v1/services
```

**Get service details:**

```bash
curl -H "Authorization: Bearer ${ICP_TOKEN}" \
  https://icp.example.com/api/v1/services/order-service
```

**Get service metrics:**

```bash
curl -H "Authorization: Bearer ${ICP_TOKEN}" \
  "https://icp.example.com/api/v1/services/order-service/metrics?period=1h"
```

**Update service configuration:**

```bash
curl -X PATCH \
  -H "Authorization: Bearer ${ICP_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"logLevel": "DEBUG"}' \
  https://icp.example.com/api/v1/services/order-service/config
```

**Get service logs:**

```bash
curl -H "Authorization: Bearer ${ICP_TOKEN}" \
  "https://icp.example.com/api/v1/services/order-service/logs?lines=100&level=ERROR"
```

### CI/CD Integration

Use the ICP API in your CI/CD pipeline to verify deployments:

```yaml
# GitHub Actions step
- name: Verify deployment health
  run: |
    for i in {1..30}; do
      STATUS=$(curl -s -H "Authorization: Bearer ${{ secrets.ICP_TOKEN }}" \
        https://icp.example.com/api/v1/services/order-service/health | jq -r '.status')
      if [ "$STATUS" = "healthy" ]; then
        echo "Deployment is healthy"
        exit 0
      fi
      sleep 10
    done
    echo "Deployment health check timed out"
    exit 1
```

## What's Next

- [Logging](logging.md) -- Configure structured logging
- [Metrics](metrics.md) -- Prometheus metrics and Grafana dashboards
- [Distributed Tracing](tracing.md) -- Trace requests across services
