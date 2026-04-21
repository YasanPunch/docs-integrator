---
title: IP Whitelisting
---

# IP Whitelisting

Restrict access to your integration services by allowing only trusted IP addresses or CIDR ranges.

## HTTP Interceptor Approach

Implement IP filtering using a request interceptor:

```ballerina
import ballerina/http;

configurable string[] allowedIps = ["10.0.0.0/8", "192.168.1.0/24", "203.0.113.50"];

service class IpWhitelistInterceptor {
    *http:RequestInterceptor;

    resource function 'default [string... path](
            http:RequestContext ctx, http:Request req) returns http:NextService|http:Forbidden|error? {
        string clientIp = check req.getHeader("X-Forwarded-For");
        if !isIpAllowed(clientIp) {
            return <http:Forbidden>{body: {message: "Access denied"}};
        }
        return ctx.next();
    }
}

function isIpAllowed(string clientIp) returns boolean {
    foreach string allowedRange in allowedIps {
        if matchesCidr(clientIp, allowedRange) {
            return true;
        }
    }
    return false;
}
```

## Configuration

Define allowed IPs in `Config.toml`:

```toml
# Config.toml
allowedIps = [
    "10.0.0.0/8",         # Internal network
    "172.16.0.0/12",      # VPN range
    "203.0.113.50",       # Partner system
    "198.51.100.0/24"     # Office network
]
```

## CIDR Range Support

The IP filter supports both individual addresses and CIDR notation:

| Format | Example | Matches |
|--------|---------|---------|
| Single IP | `203.0.113.50` | Exact match only |
| /8 range | `10.0.0.0/8` | 10.0.0.0 — 10.255.255.255 |
| /16 range | `172.16.0.0/16` | 172.16.0.0 — 172.16.255.255 |
| /24 range | `192.168.1.0/24` | 192.168.1.0 — 192.168.1.255 |
| /32 range | `203.0.113.50/32` | Single host (same as no prefix) |

## Infrastructure-Level Whitelisting

For production deployments, combine application-level filtering with infrastructure controls:

### Kubernetes NetworkPolicy

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-trusted-ips
spec:
  podSelector:
    matchLabels:
      app: my-integration
  ingress:
    - from:
        - ipBlock:
            cidr: 10.0.0.0/8
        - ipBlock:
            cidr: 203.0.113.0/24
```

### Cloud Load Balancer Rules

Configure IP allowlists at the load balancer level (AWS ALB, Azure Application Gateway, GCP Cloud Load Balancing) for network-level filtering before requests reach your application.

## Best Practices

1. **Layer defenses** — combine infrastructure and application-level filtering.
2. **Use CIDR ranges** instead of individual IPs where possible.
3. **Externalize the allowlist** in `Config.toml` so it can vary by environment.
4. **Log denied requests** for security monitoring and incident response.
5. **Consider X-Forwarded-For** header parsing when behind a reverse proxy.

## What's Next

- [Authentication](authentication.md) — Add authentication on top of IP filtering
- [API Security](api-security.md) — Rate limiting and request validation
