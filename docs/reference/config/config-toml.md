---
title: Config.toml Reference
---

# Config.toml Reference

## Overview

`Config.toml` provides runtime values for `configurable` variables declared in Ballerina source code. Place this file in the working directory where you run `bal run`, or specify one or more config files via the `BAL_CONFIG_FILES` environment variable.

Ballerina uses a TOML v0.4-compatible syntax with module-qualified keys to map configuration values to their corresponding `configurable` declarations.

## How Configurable Variables Work

In Ballerina source code, declare a configurable variable with the `configurable` keyword:

```ballerina
// In main.bal (root module)
configurable int port = 8080;
configurable string hostname = "localhost";

// A configurable without a default value is required
configurable string dbUrl = ?;
```

In `Config.toml`, supply values using the variable names:

```toml
port = 9090
hostname = "api.example.com"
dbUrl = "jdbc:mysql://db.example.com:3306/orders"
```

## Module-Qualified Names

When configurable variables are in non-root modules or external packages, use TOML table headers to specify the module context.

### Root Module (same package)

Variables in the root module of the current package require no qualifier:

```toml
port = 9090
hostname = "api.example.com"
```

### Non-Root Module (same package)

Variables in a non-root module of the current package use the module name as the table header:

```ballerina
// In module: mypackage.db
configurable string dbHost = ?;
configurable int dbPort = 3306;
```

```toml
[mypackage.db]
dbHost = "db.example.com"
dbPort = 5432
```

### External Package

Variables in an external package require the full `org-name.package-name` or `org-name.package-name.module-name` qualifier:

```toml
[ballerinax.mysql]
host = "db.example.com"
port = 3306
user = "admin"
```

## Supported Types

### Primitive Types

```toml
# boolean
enableSSL = true

# int / byte
port = 9090
maxRetries = 3

# float / decimal
timeout = 30.5
taxRate = 0.08

# string
hostname = "api.example.com"

# xml (as a string value)
template = "<greeting>Hello</greeting>"
```

### Enum Types

```toml
logLevel = "INFO"     # Must match one of the enum members
environment = "PROD"
```

### Arrays

```toml
# Array of primitives
allowedOrigins = ["https://app.example.com", "https://admin.example.com"]
retryIntervals = [1, 2, 5, 10]
enabledFeatures = [true, false, true]
```

### Records (Tables)

Map configurable `record` types using TOML tables:

```ballerina
type DatabaseConfig record {|
    string host;
    int port;
    string user;
    string password;
    string database;
|};

configurable DatabaseConfig dbConfig = ?;
```

```toml
[dbConfig]
host = "db.example.com"
port = 3306
user = "admin"
password = "secret"
database = "orders"
```

### Nested Records

```ballerina
type SSLConfig record {|
    string certPath;
    string keyPath;
|};

type ServerConfig record {|
    int port;
    SSLConfig ssl;
|};

configurable ServerConfig server = ?;
```

```toml
[server]
port = 443

[server.ssl]
certPath = "/certs/server.crt"
keyPath = "/certs/server.key"
```

### Array of Records (Table Arrays)

Map configurable arrays of records using TOML array-of-tables syntax (`[[...]]`):

```ballerina
type Endpoint record {|
    string name;
    string url;
    int timeout;
|};

configurable Endpoint[] endpoints = ?;
```

```toml
[[endpoints]]
name = "orders"
url = "https://orders.example.com"
timeout = 30

[[endpoints]]
name = "inventory"
url = "https://inventory.example.com"
timeout = 15
```

### Maps

Map configurable `map` types using TOML tables:

```ballerina
configurable map<string> headers = ?;
```

```toml
[headers]
"Content-Type" = "application/json"
"X-API-Key" = "abc123"
Authorization = "Bearer token"
```

### Tables

Configure `table` types with TOML array-of-tables:

```ballerina
type Employee record {|
    readonly int id;
    string name;
    string department;
|};

configurable table key(id) employees = ?;
```

```toml
[[employees]]
id = 1
name = "Alice"
department = "Engineering"

[[employees]]
id = 2
name = "Bob"
department = "Marketing"
```

## Precedence Rules

When the same configurable variable is set through multiple sources, the following precedence order applies (highest to lowest):

1. **Environment variables** (`BAL_CONFIG_VAR_*`) -- highest priority
2. **Command-line arguments** (`-Ckey=value`)
3. **TOML content via `BAL_CONFIG_DATA`**
4. **Config files** (via `BAL_CONFIG_FILES` or default `Config.toml`)
5. **Default values in source code** -- lowest priority

## Sensitive Data

Avoid placing secrets (passwords, API keys, tokens) in `Config.toml` files that are committed to version control. Instead, use a separate TOML file for secrets and prioritize it via `BAL_CONFIG_FILES`:

```bash
export BAL_CONFIG_FILES="/run/secrets/secret-config.toml:/app/Config.toml"
```

In Kubernetes, mount secrets as files and reference them through the `BAL_CONFIG_FILES` variable or `Cloud.toml`'s `[[cloud.config.secrets]]` section.

## Complete Example

```toml
# Root module variables
port = 9090
hostname = "api.example.com"
enableSSL = true

# Database module
[myapp.db]
host = "db.example.com"
port = 5432
user = "app_user"
password = "secure_password"
database = "orders_db"

# External package configuration
[ballerinax.mysql]
host = "db.example.com"
port = 3306

# Array of endpoint records
[[endpoints]]
name = "orders"
url = "https://orders.example.com"
timeout = 30

[[endpoints]]
name = "payments"
url = "https://payments.example.com"
timeout = 60

# Custom headers map
[headers]
"Content-Type" = "application/json"
"X-Request-ID" = "auto"
```
