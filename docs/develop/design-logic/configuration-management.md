---
title: Configuration Management
---

# Configuration Management

Integration projects typically run in multiple environments — development, staging, and production — each with different database endpoints, API keys, and feature flags. WSO2 Integrator uses Ballerina's built-in configuration system to separate settings from code. You declare configurable variables in your source, provide values in a `Config.toml` file (or environment variables), and the runtime injects them at startup.

## Configurable variables

Configurable variables defined in your project appear as available values in expression fields throughout the visual designer — in node configuration panels, connection settings, and condition inputs.

![Flow canvas showing the Automation where configurable variable values are referenced in node expressions](/img/develop/design-logic/configurations/config-vars.png)

To declare a configurable variable:

1. In the WSO2 Integrator sidebar, expand **Configurations**.
2. Click **+** to add a new configurable variable.
3. Specify the variable name, type, and whether a default value is provided.
4. The variable is now available in any expression field across your flows.

To supply values, edit the `Config.toml` file in the project root. Variables with no default (initialized with `?`) must be provided at runtime or the program will not start.

Declare a configurable variable with the `configurable` keyword at the module level:

```ballerina
import ballerina/http;
import ballerina/log;

// Required -- no default, must be supplied via Config.toml or env var
configurable string dbHost = ?;
configurable string dbUser = ?;
configurable string dbPassword = ?;

// Optional -- has a default value
configurable int dbPort = 3306;
configurable int maxRetries = 3;
configurable decimal requestTimeoutSeconds = 30.0d;
configurable boolean enableCaching = true;
```

If a required variable (one initialized with `?`) is missing at startup, the program exits with a clear error message.

### Supported types

| Type | Example |
|---|---|
| `int` | `configurable int port = 8080;` |
| `float` | `configurable float threshold = 0.75;` |
| `decimal` | `configurable decimal taxRate = 0.08d;` |
| `string` | `configurable string apiKey = ?;` |
| `boolean` | `configurable boolean debug = false;` |
| `int[]`, `string[]` | `configurable string[] allowedOrigins = ["*"];` |
| `map<string>` | `configurable map<string> headers = {};` |
| Records | `configurable DatabaseConfig dbConfig = ?;` |
| Tables | `configurable table key(id) employees = table [];` |

### Record-typed configuration

Group related settings into a record type:

```ballerina
type DatabaseConfig record {|
    string host;
    int port = 3306;
    string username;
    string password;
    string database;
    int maxConnections = 10;
|};

type ApiConfig record {|
    string baseUrl;
    string apiKey;
    decimal timeoutSeconds = 30.0d;
    int maxRetries = 3;
|};

configurable DatabaseConfig orderDb = ?;
configurable ApiConfig crmApi = ?;
```

Provide values in `Config.toml`:

```toml
[orderDb]
host = "db.dev.internal"
port = 3306
username = "app"
password = "dev-secret"
database = "orders_dev"
maxConnections = 5

[crmApi]
baseUrl = "https://sandbox.crm.example.com"
apiKey = "dev-key-123"
timeoutSeconds = 15.0
```

## Config.toml

`Config.toml` is the primary configuration file. Place it in the project root directory (alongside `Ballerina.toml`). The runtime reads it automatically at startup.

### Basic structure

```toml
dbHost = "localhost"
dbPort = 3306
dbUser = "root"
dbPassword = "dev-password"
enableCaching = true
maxRetries = 3

allowedOrigins = ["https://app.example.com", "https://admin.example.com"]

[orderDb]
host = "localhost"
port = 3306
username = "root"
password = "dev-password"
database = "orders_dev"
```

### Module-qualified keys

For multi-module projects, prefix keys with the module name:

```toml
apiPort = 8090

[myorg.myproject.billing]
taxRate = 0.08
currency = "USD"

[myorg.myproject.notifications]
smtpHost = "smtp.example.com"
smtpPort = 587
```

## Environment variables

Override any configurable variable with an environment variable using the pattern `BAL_CONFIG_VAR_<name>`:

```bash
export BAL_CONFIG_VAR_dbHost=db.prod.internal
export BAL_CONFIG_VAR_dbPassword=prod-encrypted-password
bal run
```

Point to an alternative `Config.toml` file:

```bash
BAL_CONFIG_FILES=/etc/myapp/config.toml bal run
```

### Priority order

| Priority | Source |
|---|---|
| 1 (highest) | Command-line arguments (`-Ckey=value`) |
| 2 | Environment variables (`BAL_CONFIG_VAR_<name>`) |
| 3 | `Config.toml` |
| 4 (lowest) | Default values declared in code |

## Per-environment configuration

```
my-integration/
├── Ballerina.toml
├── Config.toml              # Default / development
├── config/
│   ├── dev.toml
│   ├── staging.toml
│   └── prod.toml
└── main.bal
```

```toml
# config/dev.toml
dbHost = "localhost"
dbPort = 3306
dbUser = "root"
dbPassword = "dev-password"
dbName = "orders_dev"
crmBaseUrl = "https://sandbox.crm.example.com"
enableCaching = false
logLevel = "DEBUG"
```

```toml
# config/prod.toml
dbHost = "db.prod.internal"
dbPort = 3306
dbUser = "app_user"
dbPassword = "prod-encrypted-password"
dbName = "orders"
crmBaseUrl = "https://api.crm.example.com"
enableCaching = true
logLevel = "WARN"
```

```bash
BAL_CONFIG_FILES=config/dev.toml bal run
BAL_CONFIG_FILES=config/prod.toml bal run
```

## Secrets management

Never store secrets in plain text in `Config.toml` files committed to version control.

### Environment variables for secrets

```ballerina
configurable string dbPassword = ?;
configurable string apiSecret = ?;
```

```bash
export BAL_CONFIG_VAR_dbPassword="$(vault read -field=password secret/db)"
export BAL_CONFIG_VAR_apiSecret="$(vault read -field=key secret/api)"
bal run
```

### Separate secrets file

```
my-integration/
├── Config.toml          # Non-sensitive config (committed)
├── secrets.toml         # Sensitive config (gitignored)
└── .gitignore           # Contains: secrets.toml
```

```bash
BAL_CONFIG_FILES=Config.toml:secrets.toml bal run
```

## Complete example

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/mysql;

configurable string dbHost = ?;
configurable int dbPort = 3306;
configurable string dbUser = ?;
configurable string dbPassword = ?;
configurable string dbName = ?;

configurable string crmBaseUrl = ?;
configurable string crmApiKey = ?;

configurable int servicePort = 8090;
configurable boolean enableRequestLogging = false;

final mysql:Client orderDb = check new (
    host = dbHost, port = dbPort,
    user = dbUser, password = dbPassword,
    database = dbName
);

final http:Client crmClient = check new (crmBaseUrl, {
    httpVersion: http:HTTP_1_1,
    customHeaders: {"X-API-Key": crmApiKey}
});

service /api on new http:Listener(servicePort) {

    resource function get orders() returns json|error {
        if enableRequestLogging {
            log:printInfo("GET /api/orders");
        }
        stream<record {}, error?> resultStream = orderDb->query(`SELECT * FROM orders`);
        return resultStream.toArray();
    }
}
```

## What's next

- [Functions](functions.md) — Organize configurable logic into reusable functions
- [Connections](connections.md) — Use configurable variables to parameterize connections
- [Error Handling](error-handling.md) — Handle missing or invalid configuration gracefully
