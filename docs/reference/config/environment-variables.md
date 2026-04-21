---
title: Environment Variables
---

# Environment Variables

## Overview

Ballerina supports configuring runtime behavior through environment variables. These include variables that supply values to `configurable` declarations, variables that point to configuration files, and system-level variables used by the Ballerina runtime and build toolchain.

## Configuration Environment Variables

### `BAL_CONFIG_FILES`

Specifies one or more paths to TOML configuration files. Multiple files are separated by the OS path separator (`:` on Linux/macOS, `;` on Windows). Files listed earlier take higher precedence.

```bash
# Single file
export BAL_CONFIG_FILES="/app/Config.toml"

# Multiple files (Linux/macOS) -- first file has highest priority
export BAL_CONFIG_FILES="/run/secrets/secret.toml:/app/Config.toml"

# Multiple files (Windows)
set BAL_CONFIG_FILES="C:\secrets\secret.toml;C:\app\Config.toml"
```

When `BAL_CONFIG_FILES` is set, the default `Config.toml` in the working directory is not loaded automatically. Include it explicitly if you still need it.

### `BAL_CONFIG_DATA`

Passes TOML configuration content directly as an environment variable value. Useful in container environments and CI/CD pipelines where creating files is inconvenient.

```bash
export BAL_CONFIG_DATA='port=9090
hostname="api.example.com"
enableSSL=true'

# Single-line format using escaped newlines
export BAL_CONFIG_DATA='port=9090\nhostname="api.example.com"\nenableSSL=true'
```

When both `BAL_CONFIG_FILES` and `BAL_CONFIG_DATA` are set, values from `BAL_CONFIG_DATA` take precedence over values from the config files.

### `BAL_CONFIG_VAR_*` (Individual Variable Overrides)

Overrides individual configurable variables using specially named environment variables. This method has the highest precedence of all configuration sources.

**Naming convention:**

1. Start with `BAL_CONFIG_VAR_`.
2. For root module variables, append the variable name in uppercase.
3. For non-root or external modules, include the module path with dots replaced by underscores, all in uppercase.

```bash
# Root module variable: configurable int port = 8080;
export BAL_CONFIG_VAR_PORT=9090

# Non-root module: module myapp.db, configurable string host = ?;
export BAL_CONFIG_VAR_MYAPP_DB_HOST="db.example.com"

# External package: org ballerinax, package mysql, configurable int port = 3306;
export BAL_CONFIG_VAR_BALLERINAX_MYSQL_PORT=5432
```

**Type handling for environment variable values:**

| Ballerina Type | Environment Variable Value |
|----------------|---------------------------|
| `int` | Integer literal: `9090` |
| `float` | Decimal literal: `30.5` |
| `boolean` | `true` or `false` |
| `string` | Plain text: `api.example.com` |
| `decimal` | Decimal literal: `0.08` |

## System Environment Variables

### `BALLERINA_HOME`

Points to the Ballerina installation directory. The runtime uses this to locate the distribution, standard libraries, and tool installations.

```bash
export BALLERINA_HOME="/usr/lib/ballerina"
```

This is typically set automatically by the Ballerina installer. Override it only if you manage multiple installations or use a non-standard install path.

### `JAVA_HOME`

Points to the Java Development Kit (JDK) installation directory. Ballerina requires a JDK (Java 21 or later) for compilation and execution.

```bash
export JAVA_HOME="/usr/lib/jvm/java-21-openjdk"
```

### `BALLERINA_CENTRAL_ACCESS_TOKEN`

The personal access token used to authenticate with Ballerina Central when pushing or pulling packages.

```bash
export BALLERINA_CENTRAL_ACCESS_TOKEN="your-access-token"
```

This token is typically stored in `~/.ballerina/Settings.toml` but can be overridden with this environment variable for CI/CD pipelines.

### `BALLERINA_DEV_CENTRAL`

When set to `true`, uses the Ballerina Central staging environment instead of production. Used for development and testing.

```bash
export BALLERINA_DEV_CENTRAL=true
```

### `HTTP_PROXY` / `HTTPS_PROXY`

Configures an HTTP/HTTPS proxy for the Ballerina build tool and runtime to use when downloading dependencies or communicating with Ballerina Central.

```bash
export HTTPS_PROXY="http://proxy.example.com:8080"
export HTTP_PROXY="http://proxy.example.com:8080"
```

### `NO_PROXY`

Comma-separated list of hostnames or IP addresses that should bypass the proxy.

```bash
export NO_PROXY="localhost,127.0.0.1,.example.com"
```

## Precedence Rules

When the same configurable variable is set through multiple sources, the following precedence order applies (highest to lowest):

| Priority | Source | Example |
|----------|--------|---------|
| 1 (highest) | Individual environment variables | `BAL_CONFIG_VAR_PORT=9090` |
| 2 | Command-line arguments | `bal run -- -Cport=9090` |
| 3 | `BAL_CONFIG_DATA` | `BAL_CONFIG_DATA='port=9090'` |
| 4 | Config files (via `BAL_CONFIG_FILES`) | `/app/Config.toml` |
| 5 | Default `Config.toml` in working directory | `./Config.toml` |
| 6 (lowest) | Default values in source code | `configurable int port = 8080;` |

## Docker and Kubernetes Usage

In containerized environments, pass configuration through environment variables:

```dockerfile
# Dockerfile
ENV BAL_CONFIG_VAR_PORT=9090
ENV BAL_CONFIG_VAR_HOSTNAME="api.example.com"
```

```yaml
# Kubernetes deployment
spec:
  containers:
    - name: order-service
      env:
        - name: BAL_CONFIG_VAR_PORT
          value: "9090"
        - name: BAL_CONFIG_VAR_DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: password
        - name: BAL_CONFIG_FILES
          value: "/config/Config.toml"
      volumeMounts:
        - name: config-volume
          mountPath: /config
```

## CI/CD Pipeline Usage

```bash
# GitHub Actions example
- name: Run integration tests
  env:
    BAL_CONFIG_VAR_DB_HOST: ${{ secrets.DB_HOST }}
    BAL_CONFIG_VAR_DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
    BAL_CONFIG_VAR_API_KEY: ${{ secrets.API_KEY }}
  run: bal test
```
