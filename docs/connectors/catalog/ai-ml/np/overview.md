# NP Connector Overview

The `ballerinax/np` module provides model provider implementations for Ballerina's Natural Programming (NP) feature, enabling seamless integration with OpenAI and Azure OpenAI large language models. By implementing the `np:ModelProvider` interface, it allows Ballerina's built-in `natural` expression blocks to dispatch prompts to an LLM and automatically parse structured responses back into strongly-typed Ballerina records.

## Key features

- OpenAI Chat Completions model provider via the `np.openai` sub-module
- Azure OpenAI Chat Completions model provider via the `np.azure.openai` sub-module
- Native integration with Ballerina's `natural (model) { ... }` expression syntax for LLM-powered functions
- Automatic JSON schema generation from Ballerina type descriptors to guide structured LLM output
- Automatic parsing of LLM text responses into strongly-typed Ballerina records and values
- Flexible initialization — accepts either a pre-built `openai.chat:Client` / `azure.openai.chat:Client` or a `ModelConfig` record

## Actions

Actions in the NP connector are powered by two model provider clients that implement Ballerina's `np:ModelProvider` interface, one for OpenAI and one for Azure OpenAI. Each client is passed to a `natural` expression block, which handles prompt construction, LLM invocation, and structured response parsing automatically.

| Client | Actions |
|--------|---------|
| `OpenAI Model Provider` | OpenAI Chat Completions, natural expression dispatch, structured response parsing |
| `Azure OpenAI Model Provider` | Azure OpenAI Chat Completions, natural expression dispatch, structured response parsing |

See the **[Action Reference](action-reference.md)** for the full list of operations, parameters, and sample code for each client.

## Documentation

* **[Setup Guide](setup-guide.md)**: This guide walks you through obtaining the credentials required to use the NP connector with either OpenAI or Azure OpenAI as your model provider.

* **[Action Reference](action-reference.md)**: Full reference for all clients — operations, parameters, return types, and sample code.

## How to contribute

As an open source project, WSO2 welcomes contributions from the community.

To contribute to the code for this connector, please create a pull request in the following repository.

* [NP Connector GitHub repository](https://github.com/ballerina-platform/module-ballerinax-np)

Check the issue tracker for open issues that interest you. We look forward to receiving your contributions.
