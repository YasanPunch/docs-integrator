---
title: bal graphql CLI
---

# bal graphql CLI

The `bal graphql` tool generates Ballerina source code from GraphQL Schema Definition Language (SDL) files. It can produce service skeletons for implementing a GraphQL API or generate client code for consuming an existing GraphQL endpoint.

## Commands overview

| Command | Description |
|---------|-------------|
| `bal graphql -i <schema>` | Generate Ballerina source from a GraphQL SDL schema or a GraphQL endpoint |

## Syntax

```bash
bal graphql -i <schema-file-or-url> [options]
```

## Flags

| Flag | Alias | Required | Default | Description |
|------|-------|----------|---------|-------------|
| `-i`, `--input` | — | Yes | — | Path to the GraphQL SDL file (`.graphql`) or a GraphQL endpoint URL |
| `--mode` | — | No | `service` | Generation mode: `service`, `client`, or `schema` |
| `-o`, `--output` | No | — | Current directory | Output directory for generated files |
| `-s`, `--service` | No | — | — | Service base path for service generation |
| `--use-records-for-objects` | — | No | `false` | Generate Ballerina records instead of service classes for object types |

### Client mode additional flags

| Flag | Required | Default | Description |
|------|----------|---------|-------------|
| `-d`, `--documents` | Yes (client mode) | — | Path to a file containing GraphQL queries and mutations |

## Generate a GraphQL service

Generate a Ballerina service skeleton from a GraphQL SDL schema file.

### Example SDL schema

```graphql
# schema.graphql
type Query {
    book(id: ID!): Book
    books(author: String): [Book!]!
}

type Mutation {
    addBook(input: BookInput!): Book!
}

type Book {
    id: ID!
    title: String!
    author: String!
    year: Int
}

input BookInput {
    title: String!
    author: String!
    year: Int
}
```

### Generate service

```bash
# Generate service skeleton from SDL
bal graphql -i schema.graphql --mode service

# Generate to a specific directory
bal graphql -i schema.graphql --mode service -o src/

# Generate with a custom service base path
bal graphql -i schema.graphql --mode service -s /api
```

### Generated service output

```
service.bal           # Service skeleton with resolver stubs
types.bal             # Ballerina types from the schema
```

### Generated service example

```ballerina
import ballerina/graphql;

service /graphql on new graphql:Listener(9090) {

    resource function get book(graphql:Field 'field, string id) returns Book? {
        // TODO: Implement resolver
    }

    resource function get books(graphql:Field 'field, string? author) returns Book[] {
        // TODO: Implement resolver
    }

    remote function addBook(BookInput input) returns Book {
        // TODO: Implement mutation
    }
}
```

## Generate a GraphQL client

Generate a type-safe Ballerina client from a GraphQL schema and a set of query/mutation documents.

### Example query document

```graphql
# queries.graphql
query GetBook($id: ID!) {
    book(id: $id) {
        id
        title
        author
    }
}

query ListBooks($author: String) {
    books(author: $author) {
        id
        title
    }
}

mutation AddBook($input: BookInput!) {
    addBook(input: $input) {
        id
        title
    }
}
```

### Generate client

```bash
# Generate client from schema and query documents
bal graphql -i schema.graphql --mode client -d queries.graphql

# Generate client from a live GraphQL endpoint
bal graphql -i http://localhost:9090/graphql --mode client -d queries.graphql
```

### Generated client output

```
client.bal            # GraphQL client with typed operations
types.bal             # Response and input types
utils.bal             # Utility functions
config_types.bal      # Client configuration types
```

### Generated client usage

```ballerina
import myapp.graphql_client;

public function main() returns error? {
    graphql_client:Client cl = check new ("http://localhost:9090/graphql");

    // Execute a query
    graphql_client:GetBookResponse bookResp = check cl->getBook(id = "1");
    string? title = bookResp?.book?.title;

    // Execute a mutation
    graphql_client:BookInput input = {
        title: "New Book",
        author: "Author Name",
        year: 2024
    };
    graphql_client:AddBookResponse addResp = check cl->addBook(input);
}
```

## Export schema from service

Generate a GraphQL SDL schema file from an existing Ballerina GraphQL service.

```bash
# Export SDL from a Ballerina service
bal graphql -i service.bal --mode schema

# Export to a specific output directory
bal graphql -i service.bal --mode schema -o specs/
```

## GraphQL to Ballerina type mapping

| GraphQL Type | Ballerina Type |
|-------------|----------------|
| `String` | `string` |
| `Int` | `int` |
| `Float` | `float` |
| `Boolean` | `boolean` |
| `ID` | `string` |
| `[T]` | `T[]` |
| `T!` | `T` (non-optional) |
| `T` (nullable) | `T?` |
| `enum` | `enum` |
| `input` | `record {}` |
| `type` | `service class` or `record {}` |
| `union` | Union type |
| `interface` | `distinct service class` |

## See also

- [bal Command Reference](bal-command-reference.md) -- All bal subcommands
- [Ballerina by Example](/docs/reference/by-example) -- Runnable examples
