---
title: ICP API
---

# Integration Control Plane (ICP) API

The Integration Control Plane (ICP) provides a REST API for monitoring, observing, and managing running integrations deployed in WSO2 Integrator environments. The ICP dashboard uses this API internally, but it is also available for programmatic access, custom dashboards, and CI/CD pipeline integration.

## Base URL

```
https://<icp-host>:<port>/api/v1
```

The default ICP port is `9164`. The base path is configurable in the deployment settings.

## Authentication

All ICP API requests require authentication. The API supports Basic Authentication and OAuth 2.0 bearer tokens.

### Basic Authentication

```bash
curl -k -u admin:admin https://localhost:9164/api/v1/integrations
```

### Bearer Token

Obtain a token from the token endpoint, then include it in the `Authorization` header:

```bash
# Obtain token
curl -k -X POST https://localhost:9164/api/v1/auth/token \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin"}'

# Use token
curl -k https://localhost:9164/api/v1/integrations \
  -H "Authorization: Bearer <access_token>"
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOi...",
  "tokenType": "Bearer",
  "expiresIn": 3600
}
```

## Integration Discovery Endpoints

### List All Integrations

Returns all deployed integrations and their status.

```
GET /api/v1/integrations
```

**Response:**

```json
{
  "count": 3,
  "list": [
    {
      "name": "OrderService",
      "type": "service",
      "status": "active",
      "version": "1.0.0",
      "deployedAt": "2025-10-15T08:30:00Z",
      "listeners": ["http:9090"]
    },
    {
      "name": "InventorySync",
      "type": "automation",
      "status": "active",
      "version": "2.1.0",
      "deployedAt": "2025-10-14T12:00:00Z",
      "listeners": []
    }
  ]
}
```

### Get Integration Details

Returns detailed information about a specific integration.

```
GET /api/v1/integrations/{name}
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | path | The integration name |

**Response:**

```json
{
  "name": "OrderService",
  "type": "service",
  "status": "active",
  "version": "1.0.0",
  "package": "wso2/order_service",
  "deployedAt": "2025-10-15T08:30:00Z",
  "listeners": [
    {
      "protocol": "http",
      "port": 9090,
      "host": "0.0.0.0"
    }
  ],
  "resources": [
    {
      "method": "GET",
      "path": "/orders",
      "returnType": "Order[]|error"
    },
    {
      "method": "POST",
      "path": "/orders",
      "returnType": "Order|error"
    }
  ]
}
```

## Artifact Discovery Endpoints

### List Services

Returns all deployed Ballerina services.

```
GET /api/v1/services
```

**Response:**

```json
{
  "count": 2,
  "list": [
    {
      "name": "OrderService",
      "basePath": "/orders",
      "listeners": ["http:9090"],
      "resourceCount": 4
    }
  ]
}
```

### List Listeners

Returns all active listeners across all integrations.

```
GET /api/v1/listeners
```

**Response:**

```json
{
  "count": 2,
  "list": [
    {
      "protocol": "http",
      "port": 9090,
      "host": "0.0.0.0",
      "attachedServices": ["OrderService", "HealthCheck"]
    }
  ]
}
```

### List Connectors

Returns all external connectors (clients) in use by deployed integrations.

```
GET /api/v1/connectors
```

**Response:**

```json
{
  "count": 3,
  "list": [
    {
      "name": "mysqlClient",
      "type": "ballerinax/mysql:Client",
      "integration": "OrderService",
      "status": "connected"
    },
    {
      "name": "httpClient",
      "type": "ballerina/http:Client",
      "integration": "OrderService",
      "targetUrl": "https://inventory.example.com"
    }
  ]
}
```

## Monitoring Endpoints

### Health Check

Returns the health status of the ICP server and connected runtimes.

```
GET /api/v1/health
```

**Response:**

```json
{
  "status": "healthy",
  "uptime": "72h15m30s",
  "connectedRuntimes": 3,
  "timestamp": "2025-10-15T10:30:00Z"
}
```

### Get Metrics

Returns runtime metrics for a specific integration or the entire deployment.

```
GET /api/v1/metrics
GET /api/v1/metrics/{integrationName}
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `period` | string | `"1h"` | Time window for metrics (`5m`, `1h`, `24h`, `7d`) |
| `type` | string | `"all"` | Metric type filter (`requests`, `errors`, `latency`, `all`) |

**Response:**

```json
{
  "integrationName": "OrderService",
  "period": "1h",
  "metrics": {
    "totalRequests": 15230,
    "errorCount": 12,
    "errorRate": 0.079,
    "avgLatencyMs": 45.2,
    "p95LatencyMs": 120.5,
    "p99LatencyMs": 250.0,
    "activeConnections": 8
  }
}
```

### Get Logs

Retrieves log entries for an integration.

```
GET /api/v1/logs/{integrationName}
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `level` | string | `"INFO"` | Minimum log level (`DEBUG`, `INFO`, `WARN`, `ERROR`) |
| `limit` | int | `100` | Maximum number of log entries |
| `since` | string | — | ISO 8601 timestamp to fetch logs from |

**Response:**

```json
{
  "integrationName": "OrderService",
  "entries": [
    {
      "timestamp": "2025-10-15T10:29:55Z",
      "level": "ERROR",
      "message": "Failed to connect to database",
      "module": "wso2/order_service:db",
      "error": "Connection refused"
    }
  ]
}
```

## Runtime Management Endpoints

### Activate/Deactivate an Integration

```
PUT /api/v1/integrations/{name}/status
```

**Request Body:**

```json
{
  "status": "inactive"
}
```

**Response:**

```json
{
  "name": "OrderService",
  "previousStatus": "active",
  "currentStatus": "inactive",
  "updatedAt": "2025-10-15T10:35:00Z"
}
```

## Error Responses

All error responses follow a consistent format:

```json
{
  "error": {
    "code": "INTEGRATION_NOT_FOUND",
    "message": "Integration 'UnknownService' not found",
    "status": 404
  }
}
```

| Status Code | Description |
|-------------|-------------|
| `400` | Bad request -- invalid parameters |
| `401` | Unauthorized -- missing or invalid credentials |
| `403` | Forbidden -- insufficient permissions |
| `404` | Not found -- the specified resource does not exist |
| `500` | Internal server error |
