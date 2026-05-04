---
title: Observability Setup
---

# Observability Setup

ICP provides centralized observability for BI runtimes. Logs and metrics are collected via Fluent Bit, stored in OpenSearch, and displayed in the ICP Console.

For MI runtimes, see [MI Observability Setup](observability-setup-mi.md).

## Architecture

```
┌──────────┐   log files   ┌───────────┐   HTTP    ┌────────────┐
│    BI    │──────────────▶│ Fluent Bit │─────────▶│ OpenSearch  │
│ Runtime  │               └───────────┘           └─────┬──────┘
└────┬─────┘                                             │
     │ heartbeat                                         │ query
     ▼                                                   ▼
┌─────────┐                                     ┌──────────────┐
│   ICP   │◀────────────────────────────────────│ ICP Console  │
│  Server │          GraphQL / REST              │  (Browser)   │
└─────────┘                                     └──────────────┘
```

1. The BI runtime writes structured logs to two separate files: application logs and metrics logs.
2. Fluent Bit tails both files and ships each to its own OpenSearch index.
3. ICP Server queries OpenSearch when a user opens the Logs or Metrics page in the Console.

## Prerequisites

| Component | Purpose |
|-----------|---------|
| OpenSearch | Log and metrics storage |
| Fluent Bit | Log collection and forwarding |
| ICP Server | Observability API layer |
| ICP Console secret | Created in the Console under the organization's environment settings. Format: `<keyId>.<keyMaterial>`. |

## Step 1: Deploy OpenSearch

Any single-node or clustered OpenSearch deployment works. ICP needs HTTP(S) access to the OpenSearch REST API.

Note the host, port, and credentials — you will configure them in the ICP Server and Fluent Bit.

### Evaluation setup

For a quick single-node setup, download and extract the [OpenSearch distribution](https://opensearch.org/downloads.html). To skip TLS and authentication during evaluation, disable the security plugin:

```yaml
# config/opensearch.yml — append:
plugins.security.disabled: true
```

Then start OpenSearch:

```bash
# Linux / macOS
./bin/opensearch

# Windows
.\bin\opensearch.bat
```

Verify:

```bash
curl http://localhost:9200
```

With security disabled, OpenSearch listens on plain HTTP (port 9200). Set `tls Off` in Fluent Bit and use `http://` in the ICP Server config (see Steps 3 and 5).

## Step 2: Create Index Templates

Index templates ensure OpenSearch maps fields with the correct types before any data arrives. Apply them once per cluster.

### Application logs template

```bash
curl -X PUT 'http://<opensearch-host>:9200/_index_template/wso2_integration_application_log_template' \
  -H 'Content-Type: application/json' \
  -d '{
    "index_patterns": ["ballerina-application-logs-*"],
    "template": {
      "mappings": {
        "properties": {
          "time":           { "type": "date", "format": "yyyy-MM-dd'\''T'\''HH:mm:ss.SSS'\''Z'\''||strict_date_optional_time||epoch_millis" },
          "message":        { "type": "text" },
          "icp_runtimeId":  { "type": "keyword" }
        }
      }
    }
  }'
```

If your OpenSearch requires authentication, add `-u admin:<password>`. For HTTPS with self-signed certs, add `-k`.

### Metrics logs template

A separate template ensures correct numeric types for latency fields:

```bash
curl -X PUT 'http://<opensearch-host>:9200/_index_template/wso2_integration_metrics_log_template' \
  -H 'Content-Type: application/json' \
  -d '{
    "index_patterns": ["ballerina-metrics-logs-*"],
    "template": {
      "mappings": {
        "properties": {
          "time":                   { "type": "date", "format": "yyyy-MM-dd'\''T'\''HH:mm:ss.SSS'\''Z'\''||strict_date_optional_time||epoch_millis" },
          "message":                { "type": "text" },
          "response_time_seconds":  { "type": "float" },
          "response_time":          { "type": "long" }
        }
      }
    }
  }'
```

## Step 3: Configure ICP Server

Add the OpenSearch connection to ICP Server's `deployment.toml`:

```toml
opensearchUrl = "https://localhost:9200"
opensearchUsername = "admin"
opensearchPassword = "<your-opensearch-password>"
```

If OpenSearch is running without TLS (e.g. with the security plugin disabled), use `http://`:

```toml
opensearchUrl = "http://localhost:9200"
```

The ICP config file ships with `opensearchUrl`, `opensearchUsername`, and `opensearchPassword` commented out near the bottom, after `[ballerina.http.traceLogAdvancedConfig]`. **Do not uncomment those lines.** Because they fall under a `[section]` header, Ballerina treats them as section-scoped values and rejects them. Always add the OpenSearch keys **before the first `[section]` header** — ideally the very first lines of the file.

## Step 4: Configure the Integration

Observability requires changes in the integration project itself — these are not server-side settings.

### 1. Add dependencies and enable observability

In `Ballerina.toml`, enable both remote management and observability:

```toml
[build-options]
remoteManagement = true
observabilityIncluded = true
```

`observabilityIncluded = true` is required for metrics collection. Without it, the `ballerinax/metrics.logs` module cannot emit per-request metrics.

In your Ballerina project's `main.bal` (or any `.bal` file), import the ICP runtime bridge and metrics logger:

```ballerina
import wso2/icp.runtime.bridge as _;
import ballerinax/metrics.logs as _;
```

Both are blank imports (`as _`) — they activate automatically at startup.

### 2. Enable logging and metrics in `Config.toml`

```toml
[ballerina.observe]
metricsLogsEnabled = true

[ballerina.log]
format = "logfmt"

[[ballerina.log.destinations]]
path = "./logs/app.log"

[ballerinax.metrics.logs]
logFilePath = "./logs/metrics.log"
```

This produces two separate log files:

| File | Content | OpenSearch index |
|------|---------|------------------|
| `logs/app.log` | Application logs (startup, errors, user log statements) | `ballerina-application-logs-*` |
| `logs/metrics.log` | Per-request metrics (response times, status codes, endpoints) | `ballerina-metrics-logs-*` |

| Setting | Purpose |
|---------|---------|
| `metricsLogsEnabled = true` | Enables the Ballerina runtime to emit per-request metrics |
| `format = "logfmt"` | Structured log output that Fluent Bit's `bal_logfmt_parser` can parse |
| `path = "./logs/app.log"` | Application log destination |
| `logFilePath = "./logs/metrics.log"` | Metrics log destination (separate file via `ballerinax/metrics.logs`) |

The log file paths must match the Fluent Bit input `Path` patterns. Adjust both sides if you change the directory layout.

### 3. Configure the ICP runtime bridge

Also in `Config.toml`, configure the bridge so the runtime registers with ICP and sends heartbeats:

```toml
[wso2.icp.runtime.bridge]
serverUrl = "https://<icp-server-host>:9445"
secret = "<key-id>.<key-material>"
project = "my-project"
integration = "my-integration"
environment = "dev"
heartbeatInterval = 10
```

The `secret` must be created **before** starting the BI runtime. See [Connect an Integration to ICP](connect-runtime.md) for details.

## Step 5: Configure Fluent Bit

Fluent Bit tails the BI log files and ships them to OpenSearch.

You need two config files side by side:

- **`fluent-bit.conf`** — pipeline (inputs, filters, outputs)
- **`parsers.conf`** — log format parser

### Inputs and outputs

Since the integration writes app logs and metrics to separate files, Fluent Bit uses two independent inputs — no tag-rewriting or filtering needed to separate them:

| Input `Path` | Tag | Parser | Output index prefix | Content |
|-------------|-----|--------|---------------------|---------|
| `<bi-logs>/app.log` | `ballerina_app_logs` | `bal_logfmt_parser` | `ballerina-application-logs-` | Application logs |
| `<bi-logs>/metrics.log` | `ballerina_metrics` | `bal_logfmt_parser` | `ballerina-metrics-logs-` | Per-request metrics |

### Parser definition

Ballerina logfmt logs use ISO 8601 timestamps (`2026-04-30T07:09:27.966Z`). Define the parser in `parsers.conf`:

```ini
# parsers.conf

[PARSER]
    Name        bal_logfmt_parser
    Format      logfmt
    Time_Key    time
    Time_Format %Y-%m-%dT%H:%M:%S.%LZ
    Time_Keep   On
```

### fluent-bit.conf

Replace `<bi-logs>` with the actual path to your BI application's `logs/` directory. Use forward slashes on all platforms.

```ini
[SERVICE]
    Flush        1
    Parsers_File parsers.conf
    Log_Level    info

# ── App logs ──
[INPUT]
    Name         tail
    Path         <bi-logs>/app.log
    Parser       bal_logfmt_parser
    Tag          ballerina_app_logs
    Read_from_Head On
    Path_Key     log_file_path

# ── Metrics logs ──
[INPUT]
    Name         tail
    Path         <bi-logs>/metrics.log
    Parser       bal_logfmt_parser
    Tag          ballerina_metrics
    Read_from_Head On
    Path_Key     log_file_path

# ── Outputs ──
[OUTPUT]
    Name            opensearch
    Match           ballerina_app_logs
    Host            localhost
    Port            9200
    Logstash_Format On
    Logstash_Prefix ballerina-application-logs
    Replace_Dots    On
    Suppress_Type_Name On
    tls             Off
    HTTP_User       admin
    HTTP_Passwd     admin

[OUTPUT]
    Name            opensearch
    Match           ballerina_metrics
    Host            localhost
    Port            9200
    Logstash_Format On
    Logstash_Prefix ballerina-metrics-logs
    Replace_Dots    On
    Suppress_Type_Name On
    tls             Off
    HTTP_User       admin
    HTTP_Passwd     admin
```

**TLS**: Set `tls On` and `tls.verify Off` if OpenSearch uses HTTPS with a self-signed certificate. Set `tls Off` for plain HTTP (e.g. security plugin disabled).

**Auth**: `HTTP_User` / `HTTP_Passwd` are required even when OpenSearch has security disabled — Fluent Bit sends them and OpenSearch ignores them.

`Replace_Dots On` is important — Ballerina logfmt fields contain dots (e.g. `src.module`, `http.method`) which OpenSearch rejects as field names. This setting converts them to underscores.

## Verification

### Check OpenSearch indices

After the BI runtime has been running for a minute or two:

```bash
curl http://localhost:9200/_cat/indices/ballerina-*?v
```

You should see:

```
ballerina-application-logs-2026.04.30
ballerina-metrics-logs-2026.04.30
```

If your OpenSearch requires authentication, add `-u admin:<password>`. For HTTPS, add `-k`.

### Check ICP Console

1. Log into the ICP Console.
2. Navigate to a project that has a connected BI runtime.
3. Open **Logs** — you should see runtime log entries.
4. Open **Metrics** — you should see request counts and latency charts.

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Metrics page shows "No metrics data" | BI runtime has no inbound HTTP requests | Metrics are generated per-request — send traffic first |
| Metrics page shows "No metrics data" | `metricsLogsEnabled` not set | Add `metricsLogsEnabled = true` to `[ballerina.observe]` in `Config.toml` |
| Metrics page shows "No metrics data" | Metrics log file not configured | Set `logFilePath` in `[ballerinax.metrics.logs]` |
| Logs page shows "Observability service is unavailable" | ICP Server can't reach OpenSearch | Verify `opensearchUrl` in ICP Server's `deployment.toml` |
| OpenSearch rejects documents with "total fields [1000] exceeded" | Deeply nested JSON in log messages | Increase limit: `curl -X PUT '.../_settings' -d '{"index.mapping.total_fields.limit": 2000}'` or add to the index template |

## Index Lifecycle

Indices are created daily with a date suffix (e.g. `ballerina-metrics-logs-2026-04-28`). To manage disk usage:

- Use [OpenSearch Index State Management (ISM)](https://opensearch.org/docs/latest/im-plugin/ism/index/) policies to automatically delete or roll over old indices.
- A typical retention policy keeps 30 days of logs and 90 days of metrics.

## Security Notes

- In production, enable TLS on OpenSearch and set `tls.verify On` in Fluent Bit.
- Use dedicated OpenSearch credentials for Fluent Bit (write-only) and ICP Server (read-only).
- The ICP Server generates short-lived JWTs (2 min) for internal communication between its observability service and its OpenSearch adapter — no user configuration needed.
