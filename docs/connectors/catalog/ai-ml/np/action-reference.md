---
title: Actions
---

# Actions

The `ballerinax/np` package exposes the following clients:

| Client | Purpose |
|--------|---------|
| [`OpenAI Model Provider`](#openai-model-provider) | Implements the `np:ModelProvider` interface for OpenAI Chat Completions, enabling Ballerina `natural` expression blocks to send prompts to an OpenAI model and receive parsed, strongly-typed responses. |
| [`Azure OpenAI Model Provider`](#azure-openai-model-provider) | Implements the `np:ModelProvider` interface for Azure OpenAI Chat Completions, enabling Ballerina `natural` expression blocks to send prompts to an Azure-hosted OpenAI deployment and receive parsed, strongly-typed responses. |

---

## OpenAI model provider

Implements the `np:ModelProvider` interface for OpenAI Chat Completions, enabling Ballerina `natural` expression blocks to send prompts to an OpenAI model and receive parsed, strongly-typed responses.

### Configuration

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `connectionConfig` | `openai.chat:ConnectionConfig` | Required | OpenAI connection configuration. Set `connectionConfig.auth.token` to your OpenAI API key. |
| `serviceUrl` | `string?` | `()` | OpenAI Chat API base URL. Leave empty to use the default OpenAI endpoint. |

### Initializing the client

```ballerina
import ballerinax/np.openai;

configurable string? serviceUrl = ();
configurable string model = ?;
configurable string token = ?;

final openai:ModelProvider openAI = check new ({
    connectionConfig: {
        auth: {
            token
        }
    },
    serviceUrl
}, model);
```

### Operations

#### Natural language processing

<details>
<summary>call</summary>

Sends a prompt to the OpenAI Chat Completions API and parses the text response into the expected Ballerina type. This remote function is invoked automatically by the Ballerina runtime when a `natural (model) { ... }` expression is evaluated — users do not call it directly. The prompt includes the user's natural-language instruction along with a JSON schema derived from the return type, guiding the model to produce a structured response.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `prompt` | `np:Prompt` | Yes | The structured prompt built by the Ballerina runtime from the `natural` expression, including the user message and the JSON schema of the expected return type. |
| `expectedResponseTypedesc` | `typedesc<anydata>` | Yes | Type descriptor of the expected return type. Used to generate the JSON schema appended to the prompt and to parse the LLM response. |

Returns: `anydata|error`

Sample code:

```ballerina
import ballerina/np;
import ballerinax/np.openai;

type Author record {|
    string name;
    string dateOfBirth;
    record {|
        string name;
        string yearOfPublication;
        string genre;
    |}[] works;
|};

isolated function getAuthorDetails(string month, int count, np:ModelProvider model)
        returns Author|error => natural (model) {
    Who is a popular author born in ${month}? What are their ${count} most popular works?
};

Author author = check getAuthorDetails("July", 5, openAI);
```

Sample response:

```ballerina
{
  "name": "Ernest Hemingway",
  "dateOfBirth": "July 21, 1899",
  "works": [
    {"name": "The Old Man and the Sea", "yearOfPublication": "1952", "genre": "Literary Fiction"},
    {"name": "A Farewell to Arms", "yearOfPublication": "1929", "genre": "War Novel"},
    {"name": "For Whom the Bell Tolls", "yearOfPublication": "1940", "genre": "War Novel"},
    {"name": "The Sun Also Rises", "yearOfPublication": "1926", "genre": "Modernist Fiction"},
    {"name": "A Moveable Feast", "yearOfPublication": "1964", "genre": "Memoir"}
  ]
}
```

</details>

---

## Azure OpenAI model provider

Implements the `np:ModelProvider` interface for Azure OpenAI Chat Completions, enabling Ballerina `natural` expression blocks to send prompts to an Azure-hosted OpenAI deployment and receive parsed, strongly-typed responses.

### Configuration

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `serviceUrl` | `string` | Required | Azure OpenAI resource endpoint URL (e.g., `https://<resource-name>.openai.azure.com/`). |
| `connectionConfig` | `azure.openai.chat:ConnectionConfig` | Required | Azure OpenAI connection configuration. Set `connectionConfig.auth.apiKey` to your Azure OpenAI API key. |

### Initializing the client

```ballerina
import ballerinax/np.azure.openai as azureOpenAI;

configurable string serviceUrl = ?;
configurable string deploymentId = ?;
configurable string apiVersion = ?;
configurable string apiKey = ?;

final azureOpenAI:ModelProvider azureOpenAIModel = check new (
    {
        serviceUrl,
        connectionConfig: {
            auth: {
                apiKey
            }
        }
    },
    deploymentId,
    apiVersion
);
```

### Operations

#### Natural language processing

<details>
<summary>call</summary>

Sends a prompt to the Azure OpenAI Chat Completions API and parses the text response into the expected Ballerina type. This remote function is invoked automatically by the Ballerina runtime when a `natural (model) { ... }` expression is evaluated — users do not call it directly. The prompt includes the user's natural-language instruction along with a JSON schema derived from the return type, guiding the model to produce a structured response.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `prompt` | `np:Prompt` | Yes | The structured prompt built by the Ballerina runtime from the `natural` expression, including the user message and the JSON schema of the expected return type. |
| `expectedResponseTypedesc` | `typedesc<anydata>` | Yes | Type descriptor of the expected return type. Used to generate the JSON schema appended to the prompt and to parse the LLM response. |

Returns: `anydata|error`

Sample code:

```ballerina
import ballerina/np;
import ballerinax/np.azure.openai as azureOpenAI;

type ProductRecommendation record {|
    string productName;
    string category;
    decimal estimatedPrice;
    string reason;
|};

isolated function getRecommendation(string useCase, np:ModelProvider model)
        returns ProductRecommendation|error => natural (model) {
    Recommend a product suitable for the following use case: ${useCase}
};

ProductRecommendation recommendation = check getRecommendation(
    "home office setup", azureOpenAIModel);
```

Sample response:

```ballerina
{
  "productName": "Ergonomic Office Chair",
  "category": "Furniture",
  "estimatedPrice": 350.00,
  "reason": "Provides lumbar support and adjustable height for long work-from-home sessions, reducing fatigue and improving posture."
}
```

</details>
