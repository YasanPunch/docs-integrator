---
title: Management API
---

# Management API

The Management API provides RESTful endpoints for deploying, configuring, and controlling WSO2 Integrator instances and their integrations. Use this API to automate deployment workflows, manage runtime configuration, and integrate with CI/CD pipelines.

## Base URL

```
https://<management-host>:<port>/management/v1
```

The default management port is `9165`. The base path is configurable in the deployment settings.

## Authentication

All Management API requests require authentication using Basic Authentication or an OAuth 2.0 bearer token.

### Basic Authentication

```bash
curl -k -u admin:admin https://localhost:9165/management/v1/deployments
```

### Bearer Token

```bash
curl -k -X POST https://localhost:9165/management/v1/auth/token \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin"}'
```

Include the token in subsequent requests:

```bash
curl -k https://localhost:9165/management/v1/deployments \
  -H "Authorization: Bearer <access_token>"
```

## Deployment Endpoints

### List Deployments

Returns all deployed integration packages.

```
GET /management/v1/deployments
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `status` | string | `"all"` | Filter by deployment status (`active`, `inactive`, `failed`, `all`) |
| `limit` | int | `50` | Maximum number of results |
| `offset` | int | `0` | Pagination offset |

**Response:**

```json
{
  "count": 2,
  "total": 2,
  "list": [
    {
      "id": "dep-001",
      "name": "order-service",
      "version": "1.2.0",
      "status": "active",
      "replicas": 3,
      "createdAt": "2025-10-10T08:00:00Z",
      "updatedAt": "2025-10-15T09:00:00Z"
    },
    {
      "id": "dep-002",
      "name": "inventory-sync",
      "version": "2.0.1",
      "status": "active",
      "replicas": 1,
      "createdAt": "2025-10-12T14:00:00Z",
      "updatedAt": "2025-10-12T14:00:00Z"
    }
  ]
}
```

### Get Deployment Details

Returns detailed information about a specific deployment.

```
GET /management/v1/deployments/{deploymentId}
```

**Response:**

```json
{
  "id": "dep-001",
  "name": "order-service",
  "version": "1.2.0",
  "status": "active",
  "package": {
    "org": "wso2",
    "name": "order_service",
    "version": "1.2.0"
  },
  "replicas": 3,
  "resources": {
    "cpu": "500m",
    "memory": "512Mi"
  },
  "endpoints": [
    {
      "protocol": "http",
      "host": "order-service.default.svc.cluster.local",
      "port": 9090,
      "basePath": "/orders"
    }
  ],
  "configuration": {
    "configFiles": ["Config.toml"],
    "secrets": ["db-credentials"]
  },
  "createdAt": "2025-10-10T08:00:00Z",
  "updatedAt": "2025-10-15T09:00:00Z"
}
```

### Deploy an Integration

Deploys a new integration package or updates an existing deployment.

```
POST /management/v1/deployments
```

**Request Body:**

```json
{
  "name": "order-service",
  "package": {
    "org": "wso2",
    "name": "order_service",
    "version": "1.3.0",
    "repository": "central"
  },
  "replicas": 3,
  "resources": {
    "minCpu": "200m",
    "maxCpu": "1000m",
    "minMemory": "256Mi",
    "maxMemory": "512Mi"
  },
  "configFiles": {
    "Config.toml": "port = 9090\nhostname = \"api.example.com\""
  },
  "envVars": {
    "BAL_CONFIG_VAR_DB_PASSWORD": "secret"
  }
}
```

**Response (201 Created):**

```json
{
  "id": "dep-003",
  "name": "order-service",
  "version": "1.3.0",
  "status": "deploying",
  "createdAt": "2025-10-15T11:00:00Z"
}
```

### Update a Deployment

Updates an existing deployment (e.g., change replicas, update configuration).

```
PUT /management/v1/deployments/{deploymentId}
```

**Request Body:**

```json
{
  "replicas": 5,
  "resources": {
    "maxMemory": "1Gi"
  }
}
```

### Delete a Deployment

Removes a deployed integration.

```
DELETE /management/v1/deployments/{deploymentId}
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `force` | boolean | `false` | Force removal even if the integration is active |

**Response (204 No Content):** Empty body on success.

## Configuration Endpoints

### Get Deployment Configuration

Retrieves the current runtime configuration for a deployment.

```
GET /management/v1/deployments/{deploymentId}/config
```

**Response:**

```json
{
  "deploymentId": "dep-001",
  "configFiles": {
    "Config.toml": "port = 9090\nhostname = \"api.example.com\""
  },
  "envVars": [
    "BAL_CONFIG_VAR_PORT",
    "BAL_CONFIG_VAR_HOSTNAME"
  ],
  "secrets": [
    "db-credentials"
  ]
}
```

### Update Deployment Configuration

Updates the runtime configuration of a deployed integration. Changes may trigger a rolling restart.

```
PUT /management/v1/deployments/{deploymentId}/config
```

**Request Body:**

```json
{
  "configFiles": {
    "Config.toml": "port = 9091\nhostname = \"api-v2.example.com\""
  },
  "envVars": {
    "BAL_CONFIG_VAR_LOG_LEVEL": "DEBUG"
  },
  "restartPolicy": "rolling"
}
```

## Scaling Endpoints

### Get Scaling Status

```
GET /management/v1/deployments/{deploymentId}/scale
```

**Response:**

```json
{
  "deploymentId": "dep-001",
  "currentReplicas": 3,
  "desiredReplicas": 3,
  "minReplicas": 1,
  "maxReplicas": 10,
  "autoscaling": {
    "enabled": true,
    "targetCpuUtilization": 60
  }
}
```

### Scale a Deployment

```
PUT /management/v1/deployments/{deploymentId}/scale
```

**Request Body:**

```json
{
  "replicas": 5
}
```

## Lifecycle Endpoints

### Restart a Deployment

Performs a rolling restart of the deployment.

```
POST /management/v1/deployments/{deploymentId}/restart
```

**Request Body (optional):**

```json
{
  "strategy": "rolling"
}
```

### Suspend a Deployment

Scales the deployment to zero replicas without deleting it.

```
POST /management/v1/deployments/{deploymentId}/suspend
```

### Resume a Deployment

Restores the deployment to its configured replica count.

```
POST /management/v1/deployments/{deploymentId}/resume
```

## Environment Endpoints

### List Environments

Returns all configured deployment environments.

```
GET /management/v1/environments
```

**Response:**

```json
{
  "count": 3,
  "list": [
    {"name": "development", "status": "active", "runtimes": 2},
    {"name": "staging", "status": "active", "runtimes": 3},
    {"name": "production", "status": "active", "runtimes": 5}
  ]
}
```

### Get Environment Details

```
GET /management/v1/environments/{envName}
```

## Error Responses

All errors follow a consistent format:

```json
{
  "error": {
    "code": "DEPLOYMENT_NOT_FOUND",
    "message": "Deployment 'dep-999' not found",
    "status": 404
  }
}
```

| Status Code | Description |
|-------------|-------------|
| `400` | Bad request -- invalid request body or parameters |
| `401` | Unauthorized -- missing or invalid credentials |
| `403` | Forbidden -- insufficient permissions for the operation |
| `404` | Not found -- the specified deployment or resource does not exist |
| `409` | Conflict -- a deployment with the same name already exists |
| `422` | Unprocessable entity -- validation failed (e.g., invalid package version) |
| `500` | Internal server error |
| `503` | Service unavailable -- the management server is starting up or shutting down |
