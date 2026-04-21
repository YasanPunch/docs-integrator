---
title: Authentication
---

# Authentication (OAuth 2.0, JWT, mTLS)

Secure your production services with industry-standard authentication mechanisms. Ballerina provides declarative auth configuration at the service level.

## JWT Validation

Protect services by validating JWT tokens from an identity provider:

```ballerina
import ballerina/http;

@http:ServiceConfig {
    auth: [
        {
            jwtValidatorConfig: {
                issuer: "https://auth.example.com",
                audience: "my-integration-api",
                signatureConfig: {
                    jwksConfig: {
                        url: "https://auth.example.com/.well-known/jwks.json",
                        cacheConfig: {
                            capacity: 100,
                            defaultMaxAge: 300
                        }
                    }
                },
                scopeKey: "scp"
            },
            scopes: ["read", "write"]
        }
    ]
}
service /api on new http:Listener(9090) {
    resource function get data(http:Request req) returns json {
        return {message: "Authenticated access"};
    }
}
```

## OAuth 2.0 Introspection

Validate opaque tokens by calling the token introspection endpoint:

```ballerina
@http:ServiceConfig {
    auth: [
        {
            oauth2IntrospectionConfig: {
                url: "https://auth.example.com/oauth2/introspect",
                clientConfig: {
                    customHeaders: {"Authorization": "Basic " + encodedCredentials}
                }
            },
            scopes: ["admin"]
        }
    ]
}
service /admin on secureListener { }
```

## Basic Authentication

For internal or legacy services:

```ballerina
@http:ServiceConfig {
    auth: [
        {
            fileUserStoreConfig: {},
            scopes: ["admin"]
        }
    ]
}
service /internal on new http:Listener(9091) { }
```

Configure users in `Config.toml`:

```toml
[[ballerina.auth.users]]
username = "admin"
password = "hashed-password"
scopes = ["admin", "read"]
```

## Mutual TLS (mTLS)

Require client certificates for service-to-service authentication:

```ballerina
listener http:Listener mtlsListener = new (9443, {
    secureSocket: {
        key: {
            certFile: "/certs/server.crt",
            keyFile: "/certs/server.key"
        },
        mutualSsl: {
            verifyClient: http:REQUIRE,
            cert: "/certs/trusted-client-ca.crt"
        }
    }
});
```

## Combining Authentication Methods

Support multiple auth mechanisms on a single service — Ballerina tries each in order:

```ballerina
@http:ServiceConfig {
    auth: [
        {jwtValidatorConfig: {issuer: "https://auth.example.com", ...}},
        {oauth2IntrospectionConfig: {url: "https://auth.example.com/introspect", ...}}
    ]
}
service /api on secureListener { }
```

## What's Next

- [API Security & Rate Limiting](api-security.md) — Rate limiting and input validation
- [Secrets & Encryption](secrets-encryption.md) — Manage credentials securely
