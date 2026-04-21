---
title: Actions
---

# Actions

The MySQL connector spans 3 packages:
- `ballerinax/mysql`
- `ballerinax/mysql.driver`
- `ballerinax/mysql.cdc.driver`

Available clients:

| Client | Purpose |
|--------|---------|
| [`Client`](#client) | Provides standard SQL operations — query, execute, batch execute, and stored procedure calls — against a MySQL database. |

For event-driven integration, see the [Trigger Reference](trigger-reference.md).

---

## Client

Provides standard SQL operations — query, execute, batch execute, and stored procedure calls — against a MySQL database.

### Configuration

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `host` | `string` | `"localhost"` | MySQL server hostname or IP address. |
| `user` | `string?` | `"root"` | Database username. |
| `password` | `string?` | `()` | Database password. |
| `database` | `string?` | `()` | Name of the database to connect to. |
| `port` | `int` | `3306` | MySQL server port. |
| `options` | `Options?` | `()` | Advanced connection options including SSL, timeouts, and failover configuration. |
| `connectionPool` | `sql:ConnectionPool?` | `()` | Connection pool configuration. If not provided, the global shared pool is used. |

### Initializing the client

```ballerina
import ballerinax/mysql;
import ballerinax/mysql.driver as _;

configurable string host = ?;
configurable string user = ?;
configurable string password = ?;
configurable string database = ?;
configurable int port = 3306;

mysql:Client dbClient = check new (
    host = host,
    user = user,
    password = password,
    database = database,
    port = port
);
```

### Operations

#### Query operations

<details>
<summary>query</summary>

Executes a SQL SELECT query and returns multiple results as a stream of records.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sqlQuery` | `sql:ParameterizedQuery` | Yes | SQL query with optional parameters (e.g., `` `SELECT * FROM users WHERE id = ${userId}` ``). |
| `rowType` | `typedesc<record {}>` | No | Record type to map query results to. |

Returns: `stream<rowType, sql:Error?>`

Sample code:

```ballerina
type Student record {
    int id;
    int age;
    string name;
};

int minAge = 18;
sql:ParameterizedQuery query = `SELECT * FROM students WHERE age > ${minAge}`;
stream<Student, sql:Error?> resultStream = dbClient->query(query);
```

Sample response:

```ballerina
{"id": 1, "age": 22, "name": "Alice"}
{"id": 2, "age": 25, "name": "Bob"}
```

</details>

<details>
<summary>queryRow</summary>

Executes a SQL query expected to return a single row or a scalar value. Returns `sql:NoRowsError` if no results are found.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sqlQuery` | `sql:ParameterizedQuery` | Yes | SQL query expected to return one row or value. |
| `returnType` | `typedesc<anydata>` | No | Expected return type — a record for a full row, or a primitive type for a scalar value. |

Returns: `returnType|sql:Error`

Sample code:

```ballerina
type Student record {
    int id;
    int age;
    string name;
};

int studentId = 1;
Student student = check dbClient->queryRow(
    `SELECT * FROM students WHERE id = ${studentId}`
);
```

Sample response:

```ballerina
{"id": 1, "age": 22, "name": "Alice"}
```

</details>

#### Execute operations

<details>
<summary>execute</summary>

Executes a SQL DDL or DML statement (CREATE, INSERT, UPDATE, DELETE) and returns execution metadata.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sqlQuery` | `sql:ParameterizedQuery` | Yes | SQL statement with optional parameters. |

Returns: `sql:ExecutionResult|sql:Error`

Sample code:

```ballerina
// Insert a record
string name = "Alice";
int age = 22;
sql:ExecutionResult result = check dbClient->execute(
    `INSERT INTO students (name, age) VALUES (${name}, ${age})`
);
```

Sample response:

```ballerina
{"affectedRowCount": 1, "lastInsertId": 5}
```

</details>

<details>
<summary>batchExecute</summary>

Executes a batch of parameterized SQL statements in a single call, useful for bulk inserts or updates.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sqlQueries` | `sql:ParameterizedQuery[]` | Yes | Array of parameterized SQL statements to execute as a batch. |

Returns: `sql:ExecutionResult[]|sql:Error`

Sample code:

```ballerina
var data = [
    {name: "John", age: 25},
    {name: "Jane", age: 22},
    {name: "Peter", age: 24}
];

sql:ParameterizedQuery[] batch = from var row in data
    select `INSERT INTO students (name, age) VALUES (${row.name}, ${row.age})`;

sql:ExecutionResult[] results = check dbClient->batchExecute(batch);
```

Sample response:

```ballerina
[{"affectedRowCount": 1, "lastInsertId": 6}, {"affectedRowCount": 1, "lastInsertId": 7}, {"affectedRowCount": 1, "lastInsertId": 8}]
```

</details>

#### Stored procedures

<details>
<summary>call</summary>

Calls a stored procedure and returns result sets and output parameter values.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sqlQuery` | `sql:ParameterizedCallQuery` | Yes | Stored procedure call query (e.g., `` `{CALL GetStudents(${id})}` ``). |
| `rowTypes` | `typedesc<record {}>[]` | No | Array of record types for mapping result sets returned by the procedure. |

Returns: `sql:ProcedureCallResult|sql:Error`

Sample code:

```ballerina
sql:InOutParameter id = new (1);
sql:IntegerOutParameter totalCount = new;

sql:ProcedureCallResult result = check dbClient->call(
    `{CALL GetCount(${id}, ${totalCount})}`
);

// Access result set
stream<record {}, error?>? resultStream = result.queryResult;
if resultStream is stream<record {}, error?> {
    check from record {} row in resultStream
        do {
            io:println("Row: ", row);
        };
}
```

</details>

#### Connection management

<details>
<summary>close</summary>

Closes the client and releases the associated connection pool (if not shared by other clients). Should be called only at the end of the application lifetime.

Returns: `error?`

Sample code:

```ballerina
check dbClient.close();
```

</details>
