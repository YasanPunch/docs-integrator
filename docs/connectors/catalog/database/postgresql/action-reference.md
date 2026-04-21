---
title: Actions
---

# Actions

The PostgreSQL connector spans 2 packages:
- `ballerinax/postgresql`
- `ballerinax/postgresql.driver`

Available clients:

| Client | Purpose |
|--------|---------|
| [`Client`](#client) | Executes SQL queries, DML/DDL statements, batch operations, and stored procedures against a PostgreSQL database. |

For event-driven integration, see the [Trigger Reference](trigger-reference.md).

---

## Client

Executes SQL queries, DML/DDL statements, batch operations, and stored procedures against a PostgreSQL database.

### Configuration

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `host` | `string` | `"localhost"` | Hostname of the PostgreSQL server. |
| `username` | `string?` | `"postgres"` | Username for database authentication. |
| `password` | `string?` | `()` | Password for database authentication. |
| `database` | `string?` | `()` | Name of the database to connect to. |
| `port` | `int` | `5432` | Port number of the PostgreSQL server. |
| `options` | `Options?` | `()` | PostgreSQL-specific connection options (SSL, timeouts, prepared statement caching, etc.). |
| `connectionPool` | `sql:ConnectionPool?` | `()` | Connection pool configuration (max connections, timeouts, keep-alive). |

### Initializing the client

```ballerina
import ballerinax/postgresql;
import ballerinax/postgresql.driver as _;

configurable string host = ?;
configurable string username = ?;
configurable string password = ?;
configurable string database = ?;

postgresql:Client dbClient = check new (
    host = host,
    username = username,
    password = password,
    database = database
);
```

### Operations

#### Query operations

<details>
<summary>query</summary>

Executes a SQL query and returns the results as a stream of records.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sqlQuery` | `sql:ParameterizedQuery` | Yes | The SQL query to execute, supporting parameterized values. |
| `rowType` | `typedesc<record {}>` | No | The expected record type for each row in the result set. |

Returns: `stream<rowType, sql:Error?>`

Sample code:

```ballerina
type Customer record {|
    int customerId;
    string firstName;
    string lastName;
    int registrationId;
    float creditLimit;
    string country;
|};

stream<Customer, error?> resultStream = dbClient->query(`SELECT * FROM Customers`);
check from Customer customer in resultStream
    do {
        // process each customer record
    };
```

Sample response:

```ballerina
{"customerId": 1, "firstName": "Peter", "lastName": "Stuart", "registrationId": 1, "creditLimit": 5000.75, "country": "USA"}
```

</details>

<details>
<summary>queryRow</summary>

Executes a SQL query that is expected to return at most one row.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sqlQuery` | `sql:ParameterizedQuery` | Yes | The SQL query to execute. |
| `returnType` | `typedesc<anydata>` | No | The expected return type for the single row. |

Returns: `returnType|sql:Error`

Sample code:

```ballerina
type Customer record {|
    int customerId;
    string firstName;
    string lastName;
    int registrationId;
    float creditLimit;
    string country;
|};

Customer result = check dbClient->queryRow(`SELECT * FROM Customers WHERE customerId = ${1}`);
```

Sample response:

```ballerina
{"customerId": 1, "firstName": "Peter", "lastName": "Stuart", "registrationId": 1, "creditLimit": 5000.75, "country": "USA"}
```

</details>

#### Data manipulation

<details>
<summary>execute</summary>

Executes a SQL statement (INSERT, UPDATE, DELETE, or DDL) and returns execution metadata.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sqlQuery` | `sql:ParameterizedQuery` | Yes | The SQL statement to execute. |

Returns: `sql:ExecutionResult|sql:Error`

Sample code:

```ballerina
sql:ExecutionResult result = check dbClient->execute(
    `INSERT INTO Customers (firstName, lastName, registrationId, creditLimit, country)
     VALUES (${"Peter"}, ${"Stuart"}, ${1}, ${5000.75}, ${"USA"})`
);
```

Sample response:

```ballerina
{"affectedRowCount": 1, "lastInsertId": 1}
```

</details>

<details>
<summary>batchExecute</summary>

Executes a batch of parameterized SQL statements in a single database round trip.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sqlQueries` | `sql:ParameterizedQuery[]` | Yes | An array of parameterized SQL statements to execute. |

Returns: `sql:ExecutionResult[]|sql:Error`

Sample code:

```ballerina
sql:ParameterizedQuery[] insertQueries = [
    `INSERT INTO Customers (firstName, lastName, registrationId, creditLimit, country)
     VALUES (${"Peter"}, ${"Stuart"}, ${1}, ${5000.75}, ${"USA"})`,
    `INSERT INTO Customers (firstName, lastName, registrationId, creditLimit, country)
     VALUES (${"Dan"}, ${"Brown"}, ${2}, ${10000.00}, ${"UK"})`
];
sql:ExecutionResult[] results = check dbClient->batchExecute(insertQueries);
```

Sample response:

```ballerina
[{"affectedRowCount": 1, "lastInsertId": 1}, {"affectedRowCount": 1, "lastInsertId": 2}]
```

</details>

#### Stored procedures

<details>
<summary>call</summary>

Calls a stored procedure or function, optionally retrieving OUT parameter values and result sets.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sqlQuery` | `sql:ParameterizedCallQuery` | Yes | The stored procedure call query. |
| `rowTypes` | `typedesc<record {}>[]` | No | Expected record types for result sets returned by the procedure. |

Returns: `sql:ProcedureCallResult|sql:Error`

Sample code:

```ballerina
int personId = 1;
string personName = "Alice";
int personAge = 25;

sql:ProcedureCallResult result = check dbClient->call(
    `CALL InsertStudent(${personId}, ${personName}, ${personAge})`
);
result.close();
```

Sample response:

```ballerina
{"executionResult": {"affectedRowCount": 1}, "queryResult": null}
```

</details>

#### Connection management

<details>
<summary>close</summary>

Closes the client connection and shuts down the connection pool.

Returns: `sql:Error?`

Sample code:

```ballerina
check dbClient.close();
```

</details>
