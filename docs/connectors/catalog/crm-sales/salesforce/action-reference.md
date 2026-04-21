---
title: Actions
---

# Actions

The Salesforce connector spans 5 packages:
- `ballerinax/salesforce`
- `ballerinax/salesforce.apex`
- `ballerinax/salesforce.bulk`
- `ballerinax/salesforce.bulkv2`
- `ballerinax/salesforce.soap`

Available clients:

| Client | Purpose |
|--------|---------|
| [`Client`](#client) | REST API — record CRUD, SOQL/SOSL, metadata, reports, actions. |
| [`Apex Client`](#apex-client) | Execute custom Apex REST endpoints exposed by your Salesforce org. |
| [`Bulk Client`](#bulk-client) | Bulk API v1 — manage jobs and batches for large-scale CSV/JSON/XML data operations. |
| [`Bulk V2 Client`](#bulk-v2-client) | Bulk API v2 — simplified ingest and query jobs optimised for large-scale data loads. |
| [`Soap Client`](#soap-client) | SOAP API — lead conversion using the Salesforce SOAP protocol. |

For event-driven integration, see the [Trigger Reference](trigger-reference.md).

---

## Client

REST API — record CRUD, SOQL/SOSL, metadata, reports, actions.

### Configuration

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `baseUrl` | `string` | Required | Salesforce instance URL (e.g., `https://your-instance.salesforce.com`). |
| `auth` | `OAuth2RefreshTokenGrantConfig|BearerTokenConfig` | Required | OAuth 2.0 refresh token config or bearer token. |
| `httpVersion` | `HttpVersion` | `HTTP_2_0` | HTTP protocol version. |
| `timeout` | `decimal` | `60` | Request timeout in seconds. |
| `retryConfig` | `RetryConfig` | `()` | Retry configuration for failed requests. |
| `secureSocket` | `ClientSecureSocket` | `()` | SSL/TLS configuration. |
| `proxy` | `ProxyConfig` | `()` | Proxy server configuration. |

### Initializing the client

```ballerina
import ballerinax/salesforce;

configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshToken = ?;
configurable string baseUrl = ?;

salesforce:Client salesforceClient = check new ({
    baseUrl: baseUrl,
    auth: {
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        refreshUrl: "https://login.salesforce.com/services/oauth2/token"
    }
});
```

### Operations

#### Record CRUD

<details>
<summary>getById</summary>

Retrieves a record by its Salesforce ID.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sobjectName` | `string` | Yes | API name of the sObject (e.g., `"Account"`). |
| `id` | `string` | Yes | The Salesforce record ID. |
| `returnType` | `typedesc<record {}>` | No | Expected return type. |

Returns: `returnType|error`

Sample code:

```ballerina
record {} account = check salesforceClient->getById("Account", "0015g00000XXXXX");
```

Sample response:

```ballerina
{"Id": "0015g00000XXXXX", "Name": "Acme Corporation", "Industry": "Technology"}
```

</details>

<details>
<summary>create</summary>

Creates a new record of the specified sObject type.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sobjectName` | `string` | Yes | API name of the sObject. |
| `recordPayload` | `record {}` | Yes | Fields and values for the new record. |

Returns: `CreationResponse|error`

Sample code:

```ballerina
salesforce:CreationResponse res = check salesforceClient->create("Account", {
    Name: "New Account",
    Industry: "Technology"
});
```

Sample response:

```ballerina
{"id": "0015g00000YYYYY", "success": true, "errors": []}
```

</details>

<details>
<summary>update</summary>

Updates an existing record identified by its Salesforce ID.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sobjectName` | `string` | Yes | API name of the sObject. |
| `id` | `string` | Yes | The Salesforce record ID to update. |
| `recordPayload` | `record {}` | Yes | Fields and new values to apply. |

Returns: `error?`

Sample code:

```ballerina
check salesforceClient->update("Account", "0015g00000XXXXX", {
    Industry: "Finance"
});
```

</details>

<details>
<summary>delete</summary>

Deletes a record by its Salesforce ID.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sobjectName` | `string` | Yes | API name of the sObject. |
| `id` | `string` | Yes | The Salesforce record ID to delete. |

Returns: `error?`

Sample code:

```ballerina
check salesforceClient->delete("Account", "0015g00000XXXXX");
```

</details>

<details>
<summary>getByExternalId</summary>

Retrieves a record using an external ID field.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sobjectName` | `string` | Yes | API name of the sObject. |
| `externalIdField` | `string` | Yes | The external ID field name. |
| `externalId` | `string` | Yes | The external ID value. |
| `returnType` | `typedesc<record {}>` | No | Expected return type. |

Returns: `returnType|error`

Sample code:

```ballerina
record {} account = check salesforceClient->getByExternalId("Account", "External_Id__c", "EXT-001");
```

Sample response:

```ballerina
{"Id": "0015g00000XXXXX", "Name": "Acme Corp", "External_Id__c": "EXT-001"}
```

</details>

<details>
<summary>upsert</summary>

Creates or updates a record based on an external ID field.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sobjectName` | `string` | Yes | API name of the sObject. |
| `externalIdField` | `string` | Yes | The external ID field name used to match records. |
| `externalId` | `string` | Yes | The external ID value. |
| `recordPayload` | `record {}` | Yes | Fields and values for the upsert. |

Returns: `error?`

Sample code:

```ballerina
check salesforceClient->upsert("Account", "External_Id__c", "EXT-001", {
    Name: "Acme Corp Updated",
    Industry: "Technology"
});
```

</details>

#### Query & search

<details>
<summary>query</summary>

Executes a SOQL query and returns matching records.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `soql` | `string` | Yes | A valid SOQL query string. |
| `returnType` | `typedesc<record {}>` | No | Expected record type for results. |

Returns: `stream<returnType, error?>|error`

Sample code:

```ballerina
stream<record {}, error?> results = check salesforceClient->query(
    "SELECT Id, Name FROM Account WHERE Industry = 'Technology'"
);
check from record {} account in results
    do {
        // process each account record
    };
```

Sample response:

```ballerina
{"totalSize": 1, "done": true, "records": [{"Id": "0015g00000XXXXX", "Name": "Acme Corp"}]}
```

</details>

<details>
<summary>search</summary>

Executes a SOSL search and returns matching records.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sosl` | `string` | Yes | A valid SOSL search string. |

Returns: `stream<record {}, error?>|error`

Sample code:

```ballerina
stream<record {}, error?> results = check salesforceClient->search(
    "FIND {Acme} IN ALL FIELDS RETURNING Account(Id, Name)"
);
check from record {} item in results
    do {
        // process each search result
    };
```

</details>

#### Metadata & utilities

<details>
<summary>getAvailableApiVersions</summary>

Returns a list of all available Salesforce API versions.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|

Returns: `Version[]|error`

Sample code:

```ballerina
salesforce:Version[] versions = check salesforceClient->getAvailableApiVersions();
```

Sample response:

```ballerina
[{"label": "Winter '24", "url": "/services/data/v59.0", "version": "59.0"}]
```

</details>

<details>
<summary>getOrganizationMetaData</summary>

Retrieves metadata about the current Salesforce org.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|

Returns: `OrganizationMetadata|error`

Sample code:

```ballerina
salesforce:OrganizationMetadata meta = check salesforceClient->getOrganizationMetaData();
```

</details>

<details>
<summary>describeGlobal</summary>

Returns a list of all available sObject types in the org.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|

Returns: `SObjectMetaData[]|error`

Sample code:

```ballerina
salesforce:SObjectMetaData[] objects = check salesforceClient->describeGlobal();
```

</details>

<details>
<summary>getSobjectMetaData</summary>

Returns metadata describing a specific sObject type.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `sobjectName` | `string` | Yes | API name of the sObject. |

Returns: `SObjectMetaData|error`

Sample code:

```ballerina
salesforce:SObjectMetaData meta = check salesforceClient->getSobjectMetaData("Account");
```

</details>

#### Reports

<details>
<summary>listReports</summary>

Returns a list of all reports available in the org.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|

Returns: `Report[]|error`

Sample code:

```ballerina
salesforce:Report[] reports = check salesforceClient->listReports();
```

</details>

<details>
<summary>runReport</summary>

Executes a Salesforce report and returns its results.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `reportId` | `string` | Yes | The ID of the report to run. |

Returns: `ReportResults|error`

Sample code:

```ballerina
salesforce:ReportResults results = check salesforceClient->runReport("00O5g000005XXXXX");
```

</details>

---

## Apex client

Execute custom Apex REST endpoints exposed by your Salesforce org.

### Configuration

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `baseUrl` | `string` | Required | Salesforce instance URL. |
| `auth` | `OAuth2RefreshTokenGrantConfig|BearerTokenConfig` | Required | OAuth 2.0 refresh token config or bearer token. |
| `httpVersion` | `HttpVersion` | `HTTP_2_0` | HTTP protocol version. |
| `timeout` | `decimal` | `60` | Request timeout in seconds. |

### Initializing the client

```ballerina
import ballerinax/salesforce.apex;

configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshToken = ?;
configurable string baseUrl = ?;

apex:Client apexClient = check new ({
    baseUrl: baseUrl,
    auth: {
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        refreshUrl: "https://login.salesforce.com/services/oauth2/token"
    }
});
```

### Operations

#### Apex REST

<details>
<summary>get</summary>

Sends a GET request to a custom Apex REST endpoint.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `requestPath` | `string` | Yes | The relative path of the Apex REST resource (e.g., `"/MyEndpoint/"`). |
| `returnType` | `typedesc<record {}>` | No | Expected return type. |

Returns: `returnType|error`

Sample code:

```ballerina
record {} response = check apexClient->get("/MyApexEndpoint/");
```

</details>

<details>
<summary>post</summary>

Sends a POST request to a custom Apex REST endpoint.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `requestPath` | `string` | Yes | The relative path of the Apex REST resource. |
| `payload` | `record {}` | Yes | Request body payload. |
| `returnType` | `typedesc<record {}>` | No | Expected return type. |

Returns: `returnType|error`

Sample code:

```ballerina
record {} result = check apexClient->post("/MyApexEndpoint/", {
    accountId: "0015g00000XXXXX",
    action: "process"
});
```

</details>

<details>
<summary>put</summary>

Sends a PUT request to a custom Apex REST endpoint.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `requestPath` | `string` | Yes | The relative path of the Apex REST resource. |
| `payload` | `record {}` | Yes | Request body payload. |

Returns: `error?`

Sample code:

```ballerina
check apexClient->put("/MyApexEndpoint/EXT-001", {
    status: "active"
});
```

</details>

<details>
<summary>patch</summary>

Sends a PATCH request to a custom Apex REST endpoint.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `requestPath` | `string` | Yes | The relative path of the Apex REST resource. |
| `payload` | `record {}` | Yes | Request body payload. |

Returns: `error?`

Sample code:

```ballerina
check apexClient->patch("/MyApexEndpoint/EXT-001", {
    status: "inactive"
});
```

</details>

<details>
<summary>delete</summary>

Sends a DELETE request to a custom Apex REST endpoint.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `requestPath` | `string` | Yes | The relative path of the Apex REST resource. |

Returns: `error?`

Sample code:

```ballerina
check apexClient->delete("/MyApexEndpoint/EXT-001");
```

</details>

---

## Bulk client

Bulk API v1 — manage jobs and batches for large-scale CSV/JSON/XML data operations.

### Configuration

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `baseUrl` | `string` | Required | Salesforce instance URL. |
| `auth` | `OAuth2RefreshTokenGrantConfig|BearerTokenConfig` | Required | OAuth 2.0 refresh token config or bearer token. |
| `httpVersion` | `HttpVersion` | `HTTP_2_0` | HTTP protocol version. |
| `timeout` | `decimal` | `60` | Request timeout in seconds. |

### Initializing the client

```ballerina
import ballerinax/salesforce.bulk;

configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshToken = ?;
configurable string baseUrl = ?;

bulk:Client bulkClient = check new ({
    baseUrl: baseUrl,
    auth: {
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        refreshUrl: "https://login.salesforce.com/services/oauth2/token"
    }
});
```

### Operations

#### Job management

<details>
<summary>createJob</summary>

Creates a new Bulk API v1 job for the given operation and sObject.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `operation` | `Operation` | Yes | Bulk operation type: `INSERT`, `UPDATE`, `UPSERT`, `DELETE`, or `QUERY`. |
| `sobjectName` | `string` | Yes | API name of the sObject. |
| `contentType` | `ContentType` | Yes | Content type of the batch data: `CSV`, `JSON`, or `XML`. |

Returns: `JobInfo|error`

Sample code:

```ballerina
bulk:JobInfo job = check bulkClient->createJob(bulk:INSERT, "Contact", bulk:CSV);
```

Sample response:

```ballerina
{"id": "7505g000005XXXXX", "operation": "insert", "object": "Contact", "state": "Open"}
```

</details>

<details>
<summary>addBatch</summary>

Adds a batch of records to an open Bulk API v1 job.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `jobId` | `string` | Yes | The ID of the open job. |
| `batchData` | `string|json|xml` | Yes | The batch payload in the format matching the job's content type. |

Returns: `BatchInfo|error`

Sample code:

```ballerina
string csvData = "FirstName,LastName,Email\nJohn,Doe,john@example.com\nJane,Doe,jane@example.com";
bulk:BatchInfo batch = check bulkClient->addBatch(job.id, csvData);
```

</details>

<details>
<summary>closeJob</summary>

Closes an open Bulk API v1 job, signalling that no more batches will be added.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `jobId` | `string` | Yes | The ID of the job to close. |

Returns: `JobInfo|error`

Sample code:

```ballerina
bulk:JobInfo closedJob = check bulkClient->closeJob(job.id);
```

</details>

<details>
<summary>getBatchInfo</summary>

Returns the current status and metadata of a specific batch.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `jobId` | `string` | Yes | The ID of the job. |
| `batchId` | `string` | Yes | The ID of the batch. |

Returns: `BatchInfo|error`

Sample code:

```ballerina
bulk:BatchInfo batchInfo = check bulkClient->getBatchInfo(job.id, batch.id);
```

Sample response:

```ballerina
{"id": "7515g000001XXXXX", "jobId": "7505g000005XXXXX", "state": "Completed", "numberRecordsProcessed": 2, "numberRecordsFailed": 0}
```

</details>

<details>
<summary>getBatchResults</summary>

Retrieves the results of a completed batch.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `jobId` | `string` | Yes | The ID of the job. |
| `batchId` | `string` | Yes | The ID of the completed batch. |

Returns: `Result[]|error`

Sample code:

```ballerina
bulk:Result[] results = check bulkClient->getBatchResults(job.id, batch.id);
```

</details>

---

## Bulk V2 client

Bulk API v2 — simplified ingest and query jobs optimised for large-scale data loads.

### Configuration

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `baseUrl` | `string` | Required | Salesforce instance URL. |
| `auth` | `OAuth2RefreshTokenGrantConfig|BearerTokenConfig` | Required | OAuth 2.0 refresh token config or bearer token. |
| `httpVersion` | `HttpVersion` | `HTTP_2_0` | HTTP protocol version. |
| `timeout` | `decimal` | `60` | Request timeout in seconds. |

### Initializing the client

```ballerina
import ballerinax/salesforce.bulkv2;

configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshToken = ?;
configurable string baseUrl = ?;

bulkv2:Client bulkV2Client = check new ({
    baseUrl: baseUrl,
    auth: {
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        refreshUrl: "https://login.salesforce.com/services/oauth2/token"
    }
});
```

### Operations

#### Ingest jobs

<details>
<summary>createIngestJob</summary>

Creates a Bulk API v2 ingest job for inserting, updating, or deleting records.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `payload` | `IngestJobConfig` | Yes | Ingest job configuration including `object`, `operation`, and `lineEnding`. |

Returns: `IngestJobInfo|error`

Sample code:

```ballerina
bulkv2:IngestJobInfo ingestJob = check bulkV2Client->createIngestJob({
    'object: "Contact",
    operation: bulkv2:INSERT,
    lineEnding: bulkv2:LF
});
```

Sample response:

```ballerina
{"id": "7505g000005YYYYY", "operation": "insert", "object": "Contact", "state": "Open"}
```

</details>

<details>
<summary>addDataToIngestJob</summary>

Uploads CSV data to an open ingest job.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `jobId` | `string` | Yes | The ID of the open ingest job. |
| `csvData` | `string` | Yes | CSV data to upload. |

Returns: `error?`

Sample code:

```ballerina
string csvData = "FirstName,LastName,Email\nAlice,Smith,alice@example.com";
check bulkV2Client->addDataToIngestJob(ingestJob.id, csvData);
```

</details>

<details>
<summary>closeIngestJob</summary>

Marks an ingest job as ready to be processed.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `jobId` | `string` | Yes | The ID of the ingest job to close. |

Returns: `IngestJobInfo|error`

Sample code:

```ballerina
bulkv2:IngestJobInfo closedJob = check bulkV2Client->closeIngestJob(ingestJob.id);
```

</details>

<details>
<summary>getIngestJobInfo</summary>

Returns the current status of an ingest job.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `jobId` | `string` | Yes | The ID of the ingest job. |

Returns: `IngestJobInfo|error`

Sample code:

```ballerina
bulkv2:IngestJobInfo info = check bulkV2Client->getIngestJobInfo(ingestJob.id);
```

</details>

<details>
<summary>getSuccessfulResults</summary>

Returns CSV results for records that were successfully processed.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `jobId` | `string` | Yes | The ID of a completed ingest job. |

Returns: `string|error`

Sample code:

```ballerina
string successCsv = check bulkV2Client->getSuccessfulResults(ingestJob.id);
```

</details>

<details>
<summary>getFailedResults</summary>

Returns CSV results for records that failed processing.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `jobId` | `string` | Yes | The ID of a completed ingest job. |

Returns: `string|error`

Sample code:

```ballerina
string failedCsv = check bulkV2Client->getFailedResults(ingestJob.id);
```

</details>

#### Query jobs

<details>
<summary>createQueryJob</summary>

Creates a Bulk API v2 query job to export records using SOQL.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `payload` | `QueryJobConfig` | Yes | Query job config containing `operation` and `query` fields. |

Returns: `QueryJobInfo|error`

Sample code:

```ballerina
bulkv2:QueryJobInfo queryJob = check bulkV2Client->createQueryJob({
    operation: bulkv2:QUERY,
    query: "SELECT Id, Name, Email FROM Contact WHERE CreatedDate = TODAY"
});
```

</details>

<details>
<summary>getQueryJobResults</summary>

Retrieves results from a completed query job as a CSV string.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `jobId` | `string` | Yes | The ID of the completed query job. |
| `maxRecords` | `int` | No | Maximum number of records to return per request. |

Returns: `string|error`

Sample code:

```ballerina
string resultCsv = check bulkV2Client->getQueryJobResults(queryJob.id, maxRecords = 1000);
```

</details>

---

## Soap client

SOAP API — lead conversion using the Salesforce SOAP protocol.

### Configuration

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `baseUrl` | `string` | Required | Salesforce instance URL. |
| `auth` | `OAuth2RefreshTokenGrantConfig|BearerTokenConfig` | Required | OAuth 2.0 refresh token config or bearer token. |
| `httpVersion` | `HttpVersion` | `HTTP_2_0` | HTTP protocol version. |
| `timeout` | `decimal` | `60` | Request timeout in seconds. |

### Initializing the client

```ballerina
import ballerinax/salesforce.soap;

configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshToken = ?;
configurable string baseUrl = ?;

soap:Client soapClient = check new ({
    baseUrl: baseUrl,
    auth: {
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        refreshUrl: "https://login.salesforce.com/services/oauth2/token"
    }
});
```

### Operations

#### Lead conversion

<details>
<summary>convertLead</summary>

Converts one or more leads into accounts, contacts, and optionally opportunities.

Parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `leadConverts` | `LeadConvert[]` | Yes | Array of `LeadConvert` records specifying leads to convert and conversion options. |

Returns: `LeadConvertResult[]|error`

Sample code:

```ballerina
soap:LeadConvert[] leads = [
    {
        leadId: "00Q5g000005XXXXX",
        convertedStatus: "Closed - Converted",
        doNotCreateOpportunity: false,
        opportunityName: "Acme Opportunity"
    }
];
soap:LeadConvertResult[] results = check soapClient->convertLead(leads);
```

Sample response:

```ballerina
[{"leadId": "00Q5g000005XXXXX", "accountId": "0015g00000XXXXX", "contactId": "0035g00000XXXXX", "opportunityId": "0065g00000XXXXX", "success": true}]
```

</details>
