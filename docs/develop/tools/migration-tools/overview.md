---
title: Migration tools
---

# Migration tools

WSO2 Integrator provides migration tools that help you move existing integrations from other platforms to WSO2 Integrator. The tools analyze your existing integration artifacts, generate equivalent Ballerina code, and produce a migration report highlighting items that require manual attention.

## Supported platforms

| Source platform | Command | Status |
|---|---|---|
| [WSO2 MI](mi.md) | `bal migrate mi` | Available |
| [MuleSoft](mule.md) | `bal migrate mule` | Available |
| [TIBCO BusinessWorks](tibco.md) | `bal migrate tibco` | Available |
| [Azure Logic Apps](azure-logic-apps.md) | `bal migrate azure` | Available |

## Migration workflow

Follow these steps for a successful migration:

1. **Assess** — Run the migration tool with `--report-only` to understand the scope.
2. **Generate** — Run the full migration to produce Ballerina code.
3. **Review** — Check the migration report for items needing manual attention.
4. **Configure** — Set up `Config.toml` with connection details and environment-specific values.
5. **Implement** — Complete any manually flagged items (custom mediators, complex transformations).
6. **Test** — Write tests for the migrated integrations and compare behavior.
7. **Deploy** — Deploy to WSO2 Integrator runtime.

## Command reference

| Command | Description |
|---|---|
| `bal migrate mi -i <dir>` | Migrate from WSO2 MI |
| `bal migrate mule -i <dir>` | Migrate from MuleSoft |
| `bal migrate tibco -i <dir>` | Migrate from TIBCO BusinessWorks |
| `bal migrate azure -i <dir>` | Migrate from Azure Logic Apps |
| `-o <dir>` | Output directory |
| `--report-only` | Generate migration report without code |
| `--artifacts <types>` | Migrate specific artifact types |
| `--version <ver>` | Source platform version |
