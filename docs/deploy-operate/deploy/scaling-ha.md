---
title: Scaling & High Availability
---

# Scaling & High Availability

Design and configure your WSO2 Integrator deployments for horizontal scaling, high availability, and resilience in production environments.

## Stateless Design Principles

Ballerina services in WSO2 Integrator are designed to be stateless, making them straightforward to scale horizontally. Follow these principles to ensure your integrations scale correctly:

- **Avoid in-memory state** -- Do not store session or request state in module-level variables. Use external stores (databases, Redis, or distributed caches) for shared state.
- **Externalize configuration** -- Use `Config.toml` and environment variables rather than hardcoded values.
- **Idempotent operations** -- Design resource functions to produce the same result when called multiple times, allowing safe retries behind a load balancer.

```ballerina
import ballerina/http;
import ballerina/cache;

// Use an external cache or database for shared state
configurable string redisHost = "localhost";
configurable int redisPort = 6379;

service /orders on new http:Listener(9090) {
    // Each request is self-contained -- no in-memory session state
    resource function get [string orderId]() returns json|error {
        // Fetch from external data store
        json order = check getOrderFromDatabase(orderId);
        return order;
    }
}
```

## Horizontal Scaling Configuration

### Kubernetes Replica Scaling

Set the number of replicas in your Kubernetes deployment:

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: wso2-integrator-app
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: wso2-integrator-app
  template:
    metadata:
      labels:
        app: wso2-integrator-app
    spec:
      containers:
        - name: app
          image: registry.example.com/wso2-integrator-app:latest
          ports:
            - containerPort: 9090
          resources:
            requests:
              cpu: "250m"
              memory: "256Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"
```

### Horizontal Pod Autoscaler (HPA)

Automatically scale based on CPU or memory utilization:

```yaml
# k8s/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: wso2-integrator-app-hpa
  namespace: production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: wso2-integrator-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Pods
          value: 1
          periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 30
      policies:
        - type: Pods
          value: 2
          periodSeconds: 60
```

### Cloud.toml Auto-Scaling

Configure auto-scaling directly in your project's `Cloud.toml`:

```toml
# Cloud.toml
[cloud.deployment.autoscaling]
min_replicas = 2
max_replicas = 10
cpu_threshold = 70
memory_threshold = 80
```

## Load Balancing Considerations

### Kubernetes Service

Expose your deployment through a Kubernetes Service for internal load balancing:

```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: wso2-integrator-service
  namespace: production
spec:
  type: ClusterIP
  selector:
    app: wso2-integrator-app
  ports:
    - port: 80
      targetPort: 9090
      protocol: TCP
```

### Ingress Configuration

For external traffic, configure an Ingress resource:

```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: wso2-integrator-ingress
  namespace: production
  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/proxy-body-size: "10m"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "60"
spec:
  tls:
    - hosts:
        - api.example.com
      secretName: tls-secret
  rules:
    - host: api.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: wso2-integrator-service
                port:
                  number: 80
```

### Session Affinity

If your integration requires sticky sessions (not recommended for stateless services), configure session affinity on the Service:

```yaml
spec:
  sessionAffinity: ClientIP
  sessionAffinityConfig:
    clientIP:
      timeoutSeconds: 600
```

## Health Checks

Configure health probes so Kubernetes can detect unhealthy instances and route traffic away from them.

### Ballerina Health Endpoint

Ballerina HTTP services support health check endpoints. Add a health resource to your service:

```ballerina
import ballerina/http;

service /orders on new http:Listener(9090) {

    // Health check endpoint for Kubernetes probes
    resource function get healthz() returns http:Ok {
        return http:OK;
    }

    // Readiness check -- verify external dependencies
    resource function get readyz() returns http:Ok|http:ServiceUnavailable {
        boolean dbHealthy = checkDatabaseConnection();
        if dbHealthy {
            return http:OK;
        }
        return http:SERVICE_UNAVAILABLE;
    }
}
```

### Kubernetes Probe Configuration

```yaml
spec:
  containers:
    - name: app
      livenessProbe:
        httpGet:
          path: /orders/healthz
          port: 9090
        initialDelaySeconds: 15
        periodSeconds: 10
        failureThreshold: 3
      readinessProbe:
        httpGet:
          path: /orders/readyz
          port: 9090
        initialDelaySeconds: 10
        periodSeconds: 5
        failureThreshold: 3
      startupProbe:
        httpGet:
          path: /orders/healthz
          port: 9090
        initialDelaySeconds: 5
        periodSeconds: 5
        failureThreshold: 30
```

## Failover and Resilience

### Multi-Zone Deployment

Distribute pods across availability zones using topology spread constraints:

```yaml
spec:
  topologySpreadConstraints:
    - maxSkew: 1
      topologyKey: topology.kubernetes.io/zone
      whenUnsatisfiable: DoNotSchedule
      labelSelector:
        matchLabels:
          app: wso2-integrator-app
```

### Pod Disruption Budget

Ensure a minimum number of pods remain available during voluntary disruptions (node upgrades, scaling events):

```yaml
# k8s/pdb.yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: wso2-integrator-pdb
  namespace: production
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: wso2-integrator-app
```

## Graceful Shutdown

Ballerina services handle graceful shutdown automatically. When a `SIGTERM` signal is received, the runtime stops accepting new requests and waits for in-flight requests to complete before shutting down.

Configure the Kubernetes termination grace period to allow enough time for in-flight requests:

```yaml
spec:
  terminationGracePeriodSeconds: 60
  containers:
    - name: app
      lifecycle:
        preStop:
          exec:
            command: ["sleep", "5"]  # Allow load balancer to deregister
```

The `preStop` sleep ensures the pod is removed from the Service endpoints before the application begins shutting down, preventing requests from being routed to a terminating pod.

## What's Next

- [Environments](environments.md) -- Manage configuration across environments
- [Deploy to AWS / Azure / GCP](cloud-providers.md) -- Cloud-specific scaling options
- [Metrics](../observe/metrics.md) -- Monitor scaling behavior with Prometheus
