---
title: Database
---

# Database

## Available connectors

| Connector | Description | Operations | Authentication |
|-----------|-------------|------------|----------------|
| [AWS Redshift](aws.redshift/aws-redshift-connector-overview.md) | Cloud data warehouse with SQL queries, batch operations, and stored procedure support | Query, Execute, Batch Execute, Call | Username/Password |
| [AWS Redshift data](aws.redshiftdata/aws-redshift-data-connector-overview.md) | Data warehouse with async SQL execution, batch operations, and streamed result retrieval via the Redshift data API | Execute, Batch Execute, Query, Describe | AWS Access Key / IAM Role |
| [CDC](cdc/connector-overview.md) | Change Data Capture framework for streaming real-time database row changes (MySQL, PostgreSQL, MSSQL, Oracle) | Snapshot Read, Insert, Update, Delete, Truncate | Database Credentials |
| [Java JDBC](java.jdbc/java-jdbc-connector-overview.md) | Generic JDBC database connectivity with queries, DML, batch operations, and stored procedures | Query, Insert, Update, Delete, Batch Execute, Call Procedures | Username/Password |
| [MongoDB](mongodb/connector-overview.md) | Document database with CRUD, aggregation pipelines, and index management | Insert, Find, Update, Delete, Aggregate, Index | SCRAM-SHA-256 / Connection String |
| [MSSQL](mssql/connector-overview.md) | Relational database with SQL queries, batch operations, stored procedures, and CDC event triggers | Query, Execute, Batch Execute, Call, CDC | Username / Password |
| [MySQL](mysql/connector-overview.md) | Relational database with SQL queries, batch operations, stored procedures, and CDC triggers | Query, Insert, Update, Delete, Batch Execute, Call, CDC Events | Username / Password |
| [Oracle DB](oracledb/oracle-db-connector-overview.md) | Enterprise relational database with SQL queries, DML, stored procedures, and Oracle-specific type support | Query, Execute, Batch Execute, Call, Close | Username/Password |
| [PostgreSQL](postgresql/connector-overview.md) | Object-relational database with SQL queries, batch operations, stored procedures, and CDC triggers | Query, Execute, Batch Execute, Call, CDC | Username/Password |
| [Redis](redis/connector-overview.md) | In-memory data store with string, list, set, sorted set, and hash operations | Get, Set, List, Hash, Set, Sorted Set, Key Management | Password / ACL |
| [Snowflake](snowflake/connector-overview.md) | Cloud data warehouse with SQL queries, DML/DDL execution, batch operations, and stored procedures | Query, Execute, Batch Execute, Call | Basic Auth, Key-Pair Auth |
