---
title: Run Locally
---

# Run Locally

Run your WSO2 Integrator projects on your local machine during development and testing.

## Running from VS Code

The WSO2 Integrator VS Code extension provides an integrated development experience with a built-in run button.

1. Open your integration project in VS Code
2. Open the main `.bal` file or the project root
3. Click the **Run** button in the editor toolbar, or press `F5`
4. View the output in the **Terminal** panel

The extension automatically detects `Config.toml` in your project root and applies it during local runs. It also supports breakpoint debugging -- set breakpoints in your Ballerina code and use the **Debug** button to start a debugging session.

### Run Configuration

VS Code launch configurations are stored in `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Run Integration",
      "type": "ballerina",
      "request": "launch",
      "script": "${workspaceFolder}",
      "env": {
        "BAL_CONFIG_FILES": "${workspaceFolder}/Config.toml"
      }
    },
    {
      "name": "Debug Integration",
      "type": "ballerina",
      "request": "launch",
      "script": "${workspaceFolder}",
      "debugPort": 5005
    }
  ]
}
```

## Running from CLI

Build and run your project using the Ballerina CLI:

```bash
# Run the project directly (compiles and executes)
bal run

# Run with a specific Config.toml
BAL_CONFIG_FILES=config/dev-Config.toml bal run

# Run a pre-built JAR
bal run target/bin/my_integration.jar
```

### Command-Line Configuration Overrides

Pass configuration values directly from the command line:

```bash
# Override a configurable variable
bal run -- -CmyModule.port=8080

# Override multiple values
bal run -- -CmyModule.port=8080 -CmyModule.dbHost=localhost
```

### Running with Environment Variables

Set configurable values through environment variables:

```bash
# Set configuration via environment variable
export BAL_CONFIG_VAR_MY_MODULE_PORT=8080
export BAL_CONFIG_VAR_MY_MODULE_DB_HOST=localhost
bal run
```

The naming convention for environment variables is `BAL_CONFIG_VAR__` with uppercase letters and underscores replacing dots.

## JAR Distribution

For environments without the Ballerina toolchain, distribute the compiled JAR:

```bash
# Build the project
bal build

# The executable JAR is created at:
# target/bin/<project-name>.jar

# Run the JAR on any machine with Java 17+
java -jar target/bin/my_integration.jar
```

Ensure the target machine has Java 17 or later installed. The JAR is self-contained and includes all Ballerina dependencies.

## Configuration for Local Development

Create a `Config.toml` in your project root with development-appropriate values:

```toml
# Config.toml (local development)
[myModule]
port = 9090
dbHost = "localhost"
dbPort = 3306
dbName = "integration_dev"
dbUser = "dev_user"
dbPassword = "dev_password"
logLevel = "DEBUG"

[myModule.external]
apiUrl = "https://sandbox.api.example.com"
apiKey = "dev-api-key-12345"
```

### Multiple Config Files

Maintain separate configuration files for different local scenarios:

```
project-root/
  Config.toml              # Default local config
  config/
    dev-Config.toml        # Development settings
    test-Config.toml       # Local testing settings
    docker-Config.toml     # Config for Docker Compose runs
```

Switch between them using the `BAL_CONFIG_FILES` environment variable:

```bash
BAL_CONFIG_FILES=config/test-Config.toml bal run
```

## Hot Reload and Iterative Development

Ballerina supports watch mode for automatic recompilation and restart when source files change:

```bash
# Run with automatic reload on file changes
bal run --watch
```

In watch mode, the runtime monitors your `.bal` source files and `Config.toml`. When a change is detected, it recompiles the project and restarts the service automatically. This provides a rapid feedback loop during development.

## Local Docker Compose for Multi-Service Setups

When your integration depends on external services (databases, message brokers, or other APIs), use Docker Compose to run the full stack locally.

```yaml
# docker-compose.yml
version: "3.8"

services:
  integration:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "9090:9090"
    environment:
      - BAL_CONFIG_FILES=/app/config/Config.toml
    volumes:
      - ./config/docker-Config.toml:/app/config/Config.toml
    depends_on:
      - mysql
      - rabbitmq

  mysql:
    image: mysql:8
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: integration_dev
      MYSQL_USER: dev_user
      MYSQL_PASSWORD: dev_password
    volumes:
      - mysql_data:/var/lib/mysql

  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"

volumes:
  mysql_data:
```

Create a Dockerfile for local container builds:

```dockerfile
# Dockerfile
FROM ballerina/ballerina:2201.10.0 AS build
COPY . /app
WORKDIR /app
RUN bal build

FROM eclipse-temurin:17-jre
COPY --from=build /app/target/bin/*.jar /app/app.jar
EXPOSE 9090
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
```

Start the full stack:

```bash
docker compose up -d
```

## What's Next

- [Deploy to Devant](devant.md) -- Deploy to the WSO2 managed cloud
- [Environments](environments.md) -- Manage configuration across environments
- [Deploy to AWS / Azure / GCP](cloud-providers.md) -- Self-managed cloud deployments
