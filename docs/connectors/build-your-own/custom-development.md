---
title: Custom Development
---

# Custom Development

Build a custom Ballerina connector when you need full control over the connector implementation — including custom logic, advanced authentication, or publishing to Ballerina Central.

## Overview

Ballerina connectors are special packages containing one or more Ballerina clients that allow communication with external services, typically via REST APIs. You can create, share, and manage connectors for public distribution on [Ballerina Central](https://central.ballerina.io/) or for private organizational use.

This guide walks through generating a Ballerina connector from an OpenAPI specification — one of the fastest and most reliable ways to build connectors.

## Prerequisites

- Basic knowledge of [Ballerina Swan Lake](https://ballerina.io/) with the latest version installed
- An OpenAPI specification for the target API, plus any relevant API credentials
- A GitHub account with Git installed locally
- VS Code with the [Ballerina extension](https://marketplace.visualstudio.com/items?itemName=WSO2.ballerina)

## Step 1: Set up the project structure

Create a GitHub repository for your connector. The naming convention is:

```
module-ballerinax-<connector-name>
```

For example: `module-ballerinax-twitter`

Clone the repository and copy the project structure from the [Ballerina generated connector template](https://github.com/ballerina-platform/ballerina-library/tree/main/library-templates/generated-connector-template/files):

```bash
git clone https://github.com/<your-username>/module-ballerinax-<connector-name>.git
cd module-ballerinax-<connector-name>
```

The expected project structure:

```
module-ballerinax-myconnector/
├── .github/
├── ballerina/
│   ├── tests/
│   ├── Ballerina.toml
│   ├── README.md
│   ├── build.gradle
│   └── client.bal
├── build-config/
├── docs/
│   └── spec/
│       └── sanitations.md
├── examples/
│   ├── README.md
│   ├── build.gradle
│   └── build.sh
├── gradle/
├── .gitignore
├── LICENSE
├── README.md
├── build.gradle
├── gradle.properties
├── gradlew
├── gradlew.bat
└── settings.gradle
```

The template contains placeholders. Use the [provided Ballerina script](https://github.com/ballerina-platform/ballerina-library/blob/main/library-templates/generated-connector-template/scripts/replace_placeholders.bal) to update them with your connector-specific metadata.

## Step 2: Prepare the OpenAPI definition

1. Obtain the OpenAPI definition from the target API's documentation and save it as `openapi.yaml` (or `openapi.json`) in the `docs/spec` directory.

2. Flatten the OpenAPI definition to relocate all inline embedded schemas to the `components` section:

    ```bash
    bal openapi flatten -i docs/spec/openapi.yaml -o docs/spec
    ```

3. Align the flattened definition according to Ballerina best practices:

    ```bash
    bal openapi align -i docs/spec/flattened_openapi.yaml -o docs/spec
    ```

4. Remove the original `openapi.yaml` and `flattened_openapi.yaml`, then rename `aligned_ballerina_openapi.yaml` to `openapi.yaml`.

Preprocessing often reduces the need for manual sanitization. If further changes are required (e.g., security schemes or schema redefinitions), document them in `docs/spec/sanitations.md`.

## Step 3: Generate the Ballerina client

Run the following command from the project root to generate the client code:

```bash
bal openapi -i docs/spec/openapi.yaml --mode client -o ballerina
```

This generates the following files in the `ballerina/` directory:

| File | Description |
|---|---|
| `client.bal` | Client implementation with API operations |
| `types.bal` | Data types used by the client |
| `utils.bal` | Utility functions |

The Ballerina OpenAPI tool supports multiple customization options when generating clients. See the [OpenAPI tool documentation](https://ballerina.io/learn/openapi-tool/) for details.

## Step 4: Test the connector

Add test files to the `ballerina/tests` directory with test cases covering key operations. Aim for comprehensive API use case coverage.

Run the tests:

```bash
bal test
```

See the [Ballerina testing guide](https://ballerina.io/learn/test-ballerina-code/test-a-simple-function/) for detailed testing information.

## Step 5: Document the connector

### Package README (`ballerina/README.md`)

This is displayed on the Ballerina Central package landing page. Include:

- Overview — Concise introduction, purpose, and key features
- Setup — Step-by-step configuration instructions and prerequisites (API keys, environment setup)
- Quickstart — A basic, clear example for immediate use
- Examples — Links to additional use cases and scenarios

### Repository README (root `README.md`)

This is displayed on the GitHub repository landing page. Include the same information as the package README, plus:

- Building from Source
- Contributing
- License

### Examples (`examples/` directory)

Add practical examples that demonstrate real-world scenarios. Each example should be a separate Ballerina package with its own `README.md`.

## Step 6: Publish the connector

Update `Ballerina.toml` with your connector metadata:

```toml
[package]
org = "your_org"
name = "myconnector"
version = "1.0.0"
license = ["Apache-2.0"]
authors = ["Your Name"]
keywords = ["integration", "myservice"]
repository = "https://github.com/your-username/module-ballerinax-myconnector"
icon = "icon.png"
```

Then follow the [package publishing guide](https://ballerina.io/learn/publish-packages-to-ballerina-central/) to publish to Ballerina Central.

## What's next

- [Create from OpenAPI Spec](create-from-openapi.md) — Quickly generate a connector directly in the WSO2 Integrator IDE
