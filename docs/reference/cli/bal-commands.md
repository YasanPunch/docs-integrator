---
title: bal Command Reference
---

# bal Command Reference

The `bal` command is the primary CLI tool for building, running, testing, and managing Ballerina projects in WSO2 Integrator.

```bash
bal <command> [args]
bal help <command>
```

## Core Commands

### `bal new`

Creates a new Ballerina package in a new directory.

```bash
bal new <package-name> [OPTIONS]
```

| Flag | Description |
|------|-------------|
| `--template <template>` | Use a predefined template (`lib`, `service`, `main`) |
| `--path <path>` | Create the package at the specified path |

### `bal init`

Initializes a Ballerina package in the current directory.

```bash
bal init [OPTIONS]
```

| Flag | Description |
|------|-------------|
| `--template <template>` | Use a predefined template (`lib`, `service`, `main`) |

### `bal add`

Adds a new module to the current package.

```bash
bal add <module-name>
```

### `bal build`

Compiles a Ballerina package or standalone `.bal` file into an executable.

```bash
bal build [OPTIONS] [<package>|<.bal file>]
```

| Flag | Description |
|------|-------------|
| `-o <output>`, `--output <output>` | Write the output to the given file name |
| `--offline` | Build offline without downloading dependencies |
| `--skip-tests` | Skip test execution during build |
| `--test-report` | Generate an HTML test report |
| `--code-coverage` | Enable code coverage measurement |
| `--observability-included` | Include the observability package |
| `--cloud <provider>` | Enable cloud artifact generation (`k8s`, `docker`, `choreo`) |
| `--graalvm` | Build a GraalVM native executable |
| `--graalvm-build-options <options>` | Additional GraalVM native-image arguments |
| `--export-openapi` | Export the OpenAPI specification |
| `--export-component-model` | Export the component model |
| `--target-dir <dir>` | Set the target directory for output |
| `--sticky` | Stick to dependency versions in Dependencies.toml |

### `bal run`

Builds and executes a Ballerina package or standalone `.bal` file.

```bash
bal run [OPTIONS] [<package>|<.bal file>] [-- <args>]
```

| Flag | Description |
|------|-------------|
| `--offline` | Run offline without downloading dependencies |
| `--observability-included` | Include observability |
| `--debug <port>` | Enable remote debugging on the specified port |
| `--sticky` | Stick to dependency versions in Dependencies.toml |
| `-- <args>` | Arguments passed to the program's `main` function |

### `bal test`

Executes tests defined in the `tests/` directory of a Ballerina package.

```bash
bal test [OPTIONS] [<package>|<.bal file>]
```

| Flag | Description |
|------|-------------|
| `--offline` | Test offline without downloading dependencies |
| `--test-report` | Generate an HTML test report |
| `--code-coverage` | Enable code coverage and generate a report |
| `--coverage-format <format>` | Code coverage report format (`xml`, `json`) |
| `--debug <port>` | Enable remote debugging on the specified port |
| `--tests <test-list>` | Run only specified test functions (comma-separated) |
| `--rerun-failed` | Re-run only previously failed tests |
| `--groups <groups>` | Run tests belonging to specified groups (comma-separated) |
| `--disable-groups <groups>` | Exclude tests in specified groups |
| `--list-groups` | List all test groups |
| `--parallel` | Execute tests in parallel |

### `bal clean`

Removes the `target/` directory and all build artifacts from a package.

```bash
bal clean
```

### `bal doc`

Generates API documentation for all public symbols in a Ballerina package.

```bash
bal doc [OPTIONS]
```

| Flag | Description |
|------|-------------|
| `-o <output>`, `--output <output>` | Set the output directory for generated docs |
| `-e`, `--exclude` | Exclude specified modules from documentation |

### `bal pack`

Creates a `.bala` archive (Ballerina Archive) for distribution.

```bash
bal pack [OPTIONS]
```

| Flag | Description |
|------|-------------|
| `--offline` | Pack offline without downloading dependencies |
| `--sticky` | Stick to dependency versions in Dependencies.toml |
| `-o <output>`, `--output <output>` | Set the output directory |

## Package Management Commands

### `bal push`

Publishes a `.bala` package to Ballerina Central or a custom repository.

```bash
bal push [OPTIONS]
```

| Flag | Description |
|------|-------------|
| `--repository <repo>` | Push to a custom repository (e.g., `local`) |

### `bal pull`

Downloads a package from Ballerina Central or a custom repository.

```bash
bal pull <org-name>/<package-name>[:<version>]
```

| Flag | Description |
|------|-------------|
| `--repository <repo>` | Pull from a custom repository |

### `bal search`

Searches for packages in Ballerina Central.

```bash
bal search <keyword>
```

### `bal deprecate`

Marks a published package version as deprecated on Ballerina Central.

```bash
bal deprecate <org-name>/<package-name>:<version> [OPTIONS]
```

| Flag | Description |
|------|-------------|
| `--message <msg>` | Deprecation message |
| `--undo` | Remove the deprecation notice |

### `bal graph`

Prints the dependency graph of the current package to the console.

```bash
bal graph [OPTIONS]
```

| Flag | Description |
|------|-------------|
| `--dump-raw-graphs` | Print raw dependency graphs before resolution |

### `bal semver`

Validates semantic versioning compatibility of local changes against published versions.

```bash
bal semver
```

## Code Generation Commands

### `bal openapi`

Generates Ballerina service/client code from an OpenAPI specification, or exports an OpenAPI spec from a Ballerina service.

```bash
bal openapi [OPTIONS] <openapi-file|bal-file>
```

| Flag | Description |
|------|-------------|
| `--input <file>` | Path to the OpenAPI contract file |
| `--mode <mode>` | Generation mode: `client` or `service` |
| `--tags <tags>` | Comma-separated tags to include |
| `--operations <ops>` | Comma-separated operation IDs to include |
| `--nullable` | Enable nullable field generation |
| `-o <output>`, `--output <output>` | Output directory |

### `bal graphql`

Generates Ballerina client code from a GraphQL schema or config, or generates a schema from a Ballerina service.

```bash
bal graphql [OPTIONS] <graphql-schema|bal-file>
```

### `bal grpc`

Generates Ballerina stub/skeleton code from a Protocol Buffer definition.

```bash
bal grpc [OPTIONS] --input <proto-file>
```

| Flag | Description |
|------|-------------|
| `--input <file>` | Path to the `.proto` file |
| `--mode <mode>` | Generation mode: `client` or `service` |
| `-o <output>`, `--output <output>` | Output directory |

### `bal asyncapi`

Generates Ballerina code from an AsyncAPI specification.

```bash
bal asyncapi [OPTIONS] <asyncapi-file>
```

### `bal persist`

Manages Ballerina data persistence. Subcommands handle model generation, client generation, and migrations.

```bash
bal persist <subcommand>
```

| Subcommand | Description |
|------------|-------------|
| `init` | Initialize persistence in the package |
| `generate` | Generate the persistence client from the data model |
| `add` | Add a new data model |
| `migrate` | Run database migrations |
| `push` | Push schema changes to the data store |

### `bal bindgen`

Generates Ballerina bindings for Java classes, enabling Java interoperability.

```bash
bal bindgen [OPTIONS] <class-names...>
```

| Flag | Description |
|------|-------------|
| `-cp <classpath>` | Java classpath for dependency resolution |
| `-o <output>`, `--output <output>` | Output directory for generated bindings |
| `--public` | Make generated functions public |
| `-m <module>`, `--modules <module>` | Target module for the bindings |

## Formatting and Quality

### `bal format`

Reformats Ballerina source files according to the standard coding conventions.

```bash
bal format [OPTIONS] [<module-name>]
```

| Flag | Description |
|------|-------------|
| `--dry-run` | Show formatting changes without applying them |

## Interactive and Diagnostic Commands

### `bal shell`

Launches an interactive REPL (Read-Eval-Print Loop) for evaluating Ballerina expressions and statements.

```bash
bal shell
```

### `bal profile`

Profiles a Ballerina program and generates flame graphs for performance analysis.

```bash
bal profile [OPTIONS] [<package>|<.bal file>]
```

## Tool Management

### `bal tool`

Manages CLI tool extensions installed from Ballerina Central.

```bash
bal tool <subcommand>
```

| Subcommand | Description |
|------------|-------------|
| `pull <tool-id>[:<version>]` | Install a tool from Ballerina Central |
| `remove <tool-id>[:<version>]` | Uninstall a tool |
| `update <tool-id>` | Update a tool to the latest patch version |
| `use <tool-id>:<version>` | Switch to a specific installed version |
| `list` | List all locally installed tools |
| `search <keyword>` | Search for tools in Ballerina Central |

## Distribution Management

### `bal dist`

Manages Ballerina distribution versions installed on the system.

```bash
bal dist <subcommand>
```

| Subcommand | Description |
|------------|-------------|
| `list` | List available distributions |
| `pull <version>` | Download a specific distribution |
| `update` | Update to the latest distribution |
| `use <version>` | Switch to an installed distribution |
| `remove <version>` | Remove an installed distribution |

### `bal update`

Updates the Ballerina update tool itself to the latest version.

```bash
bal update
```

## Informational Commands

### `bal version`

Displays the current Ballerina distribution version, language specification version, and update tool version.

```bash
bal version
```

### `bal help`

Displays usage details for any command.

```bash
bal help [<command>]
```

## Global Flags

The following flags are available across most commands:

| Flag | Description |
|------|-------------|
| `--help`, `-h` | Display help for the command |
| `--debug <port>` | Start in remote debug mode |
| `--offline` | Proceed without accessing the network |
| `--sticky` | Stick to the dependency versions in Dependencies.toml |
