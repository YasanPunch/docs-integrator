---
title: Database
---

# Database

## Available connectors

| Connector | Description | Operations | Authentication |
|-----------|-------------|------------|----------------|
| [AWS Redshift](aws.redshift/overview.md) | Cloud data warehouse with SQL queries, batch operations, and stored procedure support | Query, Execute, Batch Execute, Call | Username/Password |
| [AWS Redshift Data](aws.redshiftdata/overview.md) | Data warehouse with async SQL execution, batch operations, and streamed result retrieval via the Redshift Data API | Execute, Batch Execute, Query, Describe | AWS Access Key / IAM Role |
| [CDC](cdc/overview.md) | Change Data Capture framework for streaming real-time database row changes (MySQL, PostgreSQL, MSSQL, Oracle) | Snapshot Read, Insert, Update, Delete, Truncate | Database Credentials |
| [Java JDBC](java.jdbc/overview.md) | Generic JDBC database connectivity with queries, DML, batch operations, and stored procedures | Query, Insert, Update, Delete, Batch Execute, Call Procedures | Username/Password |
| [MongoDB](mongodb/overview.md) | Document database with CRUD, aggregation pipelines, and index management | Insert, Find, Update, Delete, Aggregate, Index | SCRAM-SHA-256 / Connection String |
| [MSSQL](mssql/overview.md) | Relational database with SQL queries, batch operations, stored procedures, and CDC event triggers | Query, Execute, Batch Execute, Call, CDC | Username / Password |
| [MySQL](mysql/overview.md) | Relational database with SQL queries, batch operations, stored procedures, and CDC triggers | Query, Insert, Update, Delete, Batch Execute, Call, CDC Events | Username / Password |
| [Oracle DB](oracledb/overview.md) | Enterprise relational database with SQL queries, DML, stored procedures, and Oracle-specific type support | Query, Execute, Batch Execute, Call, Close | Username/Password |
| [PostgreSQL](postgresql/overview.md) | Object-relational database with SQL queries, batch operations, stored procedures, and CDC triggers | Query, Execute, Batch Execute, Call, CDC | Username/Password |
| [Redis](redis/overview.md) | In-memory data store with string, list, set, sorted set, and hash operations | Get, Set, List, Hash, Set, Sorted Set, Key Management | Password / ACL |
| [Snowflake](snowflake/overview.md) | Cloud data warehouse with SQL queries, DML/DDL execution, batch operations, and stored procedures | Query, Execute, Batch Execute, Call | Basic Auth, Key-Pair Auth |
