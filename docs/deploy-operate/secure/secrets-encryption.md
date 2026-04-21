---
title: Secrets & Encryption
---

# Secrets & Encryption

Protect sensitive data in your integrations — API keys, database passwords, certificates, and tokens.

## Secrets in Config.toml

Store secrets in `Config.toml` and **never commit this file** to version control:

```toml
# Config.toml
dbPassword = "s3cur3-p@ssw0rd"
apiKey = "sk-abc123..."
oauthClientSecret = "client-secret-value"
```

Add `Config.toml` to `.gitignore`:

```
# .gitignore
Config.toml
**/Config.toml
```

## Environment Variables

Pass secrets via environment variables instead of files:

```ballerina
configurable string dbPassword = ?;
configurable string apiKey = ?;
```

```bash
export BAL_CONFIG_VAR_DB_PASSWORD="s3cur3-p@ssw0rd"
export BAL_CONFIG_VAR_API_KEY="sk-abc123"
bal run
```

## Kubernetes Secrets

Mount Kubernetes Secrets as files or environment variables:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: integration-secrets
type: Opaque
data:
  dbPassword: czNjdXIzLXBAc3N3MHJk    # base64 encoded
  apiKey: c2stYWJjMTIz

---
apiVersion: apps/v1
kind: Deployment
spec:
  template:
    spec:
      containers:
        - name: integration
          envFrom:
            - secretRef:
                name: integration-secrets
          # Or mount as a Config.toml file:
          volumeMounts:
            - name: config-volume
              mountPath: /app/Config.toml
              subPath: Config.toml
      volumes:
        - name: config-volume
          secret:
            secretName: integration-config
```

## HashiCorp Vault Integration

Fetch secrets from Vault at startup using a Ballerina initialization function:

```ballerina
import ballerina/http;

configurable string vaultAddr = "https://vault.example.com";
configurable string vaultToken = ?;

final http:Client vaultClient = check new (vaultAddr, {
    auth: {token: vaultToken}
});

function getSecret(string path) returns string|error {
    json response = check vaultClient->get("/v1/secret/data/" + path);
    return (check response.data.data).toString();
}
```

For production, use the Vault Agent sidecar pattern to inject secrets as environment variables or files.

## AWS Secrets Manager

```ballerina
import ballerinax/aws.secretsmanager;

secretsmanager:Client smClient = check new ({
    region: "us-east-1",
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
});

string dbPassword = check smClient->getSecretValue("prod/db/password");
```

## TLS Configuration

### Server TLS

```ballerina
listener http:Listener secureListener = new (9443, {
    secureSocket: {
        key: {
            certFile: "/certs/server.crt",
            keyFile: "/certs/server.key"
        }
    }
});
```

### Client TLS (Trust Custom CA)

```ballerina
final http:Client secureClient = check new ("https://internal-api.example.com", {
    secureSocket: {
        cert: "/certs/internal-ca.crt"
    }
});
```

### Mutual TLS

```ballerina
listener http:Listener mtlsListener = new (9443, {
    secureSocket: {
        key: {certFile: "/certs/server.crt", keyFile: "/certs/server.key"},
        mutualSsl: {
            verifyClient: http:REQUIRE,
            cert: "/certs/trusted-client-ca.crt"
        }
    }
});
```

## Encryption at Rest

For database encryption, configure at the database level:

- **MySQL** — Enable InnoDB tablespace encryption
- **PostgreSQL** — Use pgcrypto extension or Transparent Data Encryption
- **MongoDB** — Enable encryption at rest with WiredTiger
- **AWS RDS** — Enable storage encryption in RDS settings

## Best Practices

1. **Never hardcode secrets** in source code — always use `configurable` variables.
2. **Never commit Config.toml** to version control.
3. **Use a secrets manager** (Vault, AWS Secrets Manager, Azure Key Vault) in production.
4. **Rotate secrets regularly** — use short-lived tokens where possible.
5. **Enable TLS everywhere** — all service-to-service communication should be encrypted.
6. **Use mTLS** for sensitive internal service communication.

## What's Next

- [Authentication](authentication.md) — Secure service endpoints
- [Compliance](compliance.md) — Audit logging and data protection
- [Runtime Security](runtime-security.md) — Additional runtime security measures
