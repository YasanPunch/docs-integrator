---
title: Deploy & Operate
---

# Deploy & Operate

Everything from pushing your first build to production to monitoring it at scale. This section covers all deployment targets and integration types, including GenAI agents.

:::tip Where does Develop end?
If your code is still on your machine, you're in [Develop](../develop/overview.md). Once you're pushing it somewhere else, you're here.

## Deploy

Get your integration running in any environment:

| Target | Description |
|---|---|
| **[Run Locally](deploy/local.md)** | Test on your machine before deploying |
| **[VM-Based](deploy/vm-based.md)** | Standalone and centralized (consolidated packages) |
| **[Docker & Kubernetes](deploy/docker-kubernetes.md)** | Containerized deployments with orchestration |
| **[OpenShift](deploy/openshift.md)** | Red Hat OpenShift deployments |
| **[Serverless](deploy/serverless.md)** | AWS Lambda, Azure Functions |
| **[Push to Cloud](deploy/devant.md)** | One-click deploy from WSO2 Integrator IDE |
| **[Cloud Providers](deploy/cloud-providers.md)** | Deploy to AWS, Azure, or GCP |
| **[GraalVM Native](deploy/graalvm.md)** | Ahead-of-time compiled binaries for fast startup |

**Environment management:** [Environments](deploy/environments.md) | [Managing Configurations](deploy/managing-configurations.md) | [Scaling & High Availability](deploy/scaling-ha.md)

## CI/CD

Automate your build and deploy pipeline:

- **[GitHub Actions](cicd/github-actions.md)** — Workflows for build, test, and deploy
- **[Jenkins](cicd/jenkins.md)** — Pipeline configuration
- **[GitLab CI](cicd/gitlab.md)** — `.gitlab-ci.yml` setup
- **[Azure DevOps](cicd/azure-devops.md)** — Azure Pipelines integration

## Observe

Monitor, trace, and debug in production:

| | |
|---|---|
| **[Observability Overview](observe/overview.md)** | Logging, metrics, and tracing concepts |
| **[Integration Control Plane](observe/icp.md)** | Centralized management dashboard |
| **[WSO2 Integration Platform](observe/devant.md)** | Cloud-native observability |
| **[Prometheus & Grafana](observe/prometheus.md)** | Metrics collection and dashboards |
| **[Jaeger & Zipkin](observe/jaeger.md)** | Distributed tracing |
| **[Custom Metrics](observe/custom-metrics.md)** | Application-specific counters and gauges |

**Third-party integrations:** [Datadog](observe/datadog.md) | [New Relic](observe/new-relic.md) | [Elastic Stack](observe/elastic.md) | [OpenSearch](observe/opensearch.md)

## Secure

Harden your integrations for production:

- **[Runtime Security](secure/runtime-security.md)** — JVM security, keystores, non-root execution
- **[Authentication](secure/authentication.md)** — OAuth 2.0, JWT, mTLS
- **[API Security & Rate Limiting](secure/api-security.md)** — Protect your endpoints
- **[Secrets & Encryption](secure/secrets-encryption.md)** — Keystores, environment variables, vault integration
- **[Compliance](secure/compliance.md)** — Compliance considerations

## Capacity Planning

- **[Overview & Sizing Guidelines](capacity-planning/overview.md)** — Right-size your deployment
- **[Performance Reports](capacity-planning/performance-reports.md)** — Benchmarks per scenario
