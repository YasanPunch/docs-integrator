---
title: Configurations
---

# Configurations

Configuration artifacts externalize values that change between environments using Ballerina's `configurable` keyword. This separates environment-specific settings (URLs, credentials, feature flags) from your integration logic.

## Adding a configuration

1. Open the **WSO2 Integrator: BI** sidebar in VS Code.

   ![WSO2 Integrator sidebar showing the project structure with Configurations listed](/img/develop/integration-artifacts/supporting/configurations/step-1.png)

2. Click **+** next to **Configurations** in the sidebar.

3. In the **Add Configurable Variable** panel, fill in the following fields:

   ![Add Configurable Variable form showing Variable Name, Variable Type, Default Value, and Documentation fields](/img/develop/integration-artifacts/supporting/configurations/step-2.png)

   | Field | Description |
   |---|---|
   | **Variable Name** | The identifier used to reference the variable in code (for example, `apiEndpoint`). Required. |
   | **Variable Type** | The Ballerina type of the variable (for example, `string`, `int`, `boolean`). Required. |
   | **Default Value** | An optional default value. Leave empty to make the variable required — the integration will not start unless it is provided in `Config.toml`. |
   | **Documentation** | Optional description in Markdown format, used as inline documentation. |

4. Click **Save**. The variable is added to your project's configurable declarations.

```ballerina
// config.bal

// Required configuration (must be provided in Config.toml)
configurable string apiEndpoint = ?;
configurable string apiKey = ?;

// Optional with defaults
configurable int maxRetries = 3;
configurable decimal timeoutSeconds = 30.0;
configurable boolean enableCache = true;
configurable int cacheMaxSize = 1000;

// Complex configuration using records
configurable NotificationConfig notificationConfig = {
    emailEnabled: true,
    slackEnabled: false,
    slackWebhookUrl: ""
};

type NotificationConfig record {|
    boolean emailEnabled;
    boolean slackEnabled;
    string slackWebhookUrl;
|};
```

## Viewing configurations

Click **View Configurations** (or the configurations icon) next to **Configurations** in the sidebar to open the **Configurable Variables** panel.

![Configurable Variables panel showing variables grouped by Integration and Imported libraries](/img/develop/integration-artifacts/supporting/configurations/step-3.png)

The panel organizes variables into two groups:

- **Integration** — variables declared in your integration project. Each entry shows the variable name, type, and default value.
- **Imported libraries** — configurable variables exposed by libraries your integration depends on (for example, `ballerina/http` or `ballerina/log`).

Use the **Search Configurables** box to filter by name. Click a variable to edit or delete it.

Provide values for configurable variables in a `Config.toml` file at the project root:

```toml
apiEndpoint = "https://api.example.com/v2"
apiKey = "sk-abc123"
maxRetries = 5
timeoutSeconds = 60.0
enableCache = true
cacheMaxSize = 5000

[notificationConfig]
emailEnabled = true
slackEnabled = true
slackWebhookUrl = "https://hooks.slack.com/services/..."
```

## Configuration types

| Type | Example | Notes |
|---|---|---|
| **Required** | `configurable string apiKey = ?;` | Must be provided; build fails otherwise |
| **With default** | `configurable int maxRetries = 3;` | Uses default if not specified |
| **Boolean flag** | `configurable boolean enableCache = true;` | Feature toggles |
| **Record** | `configurable DbConfig db = {...};` | Grouped settings for a subsystem |
| **Array** | `configurable string[] allowedOrigins = [];` | Lists of values |

## Environment-specific overrides

Use different `Config.toml` files for each environment.

```
my-integration/
├── Config.toml              # Development defaults
├── Config-staging.toml      # Staging overrides
├── Config-production.toml   # Production overrides
└── ...
```

## Best practices

| Practice | Description |
|---|---|
| **Dedicated file** | Keep all configurable declarations in a `config.bal` file |
| **Use `?` for secrets** | Mark sensitive values as required so they are never hardcoded |
| **Group related settings** | Use record types to group related configuration values |
| **Document defaults** | Add comments explaining the purpose and valid range of each setting |
