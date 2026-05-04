---
title: Migrate from WSO2 MI
---

# Migrate from WSO2 MI

WSO2 MI continues to be fully supported. For MI-specific documentation, visit [mi.docs.wso2.com](https://mi.docs.wso2.com). Use this migration tool when you are ready to adopt WSO2 Integrator for your MI-based integrations.

## Overview

The MI migration tool converts WSO2 MI artifacts (Synapse XML configurations) to Ballerina code. It handles APIs, proxy services, sequences, endpoints, data services, scheduled tasks, and message mediators.

## Run the MI migration tool

```bash
# Migrate a complete MI project (Carbon Application)
bal migrate mi -i /path/to/mi-project/ -o migrated/

# Migrate specific artifact types
bal migrate mi -i /path/to/mi-project/ --artifacts api,proxy -o migrated/

# Generate migration report only (no code generation)
bal migrate mi -i /path/to/mi-project/ --report-only
```

![Terminal output during MI migration](/img/develop/tools/migration-tools/terminal-migration.png)

## Artifact mapping

The tool maps MI artifacts to their Ballerina equivalents:

| MI artifact | Ballerina equivalent |
|---|---|
| API | HTTP service with resource functions |
| Proxy Service | HTTP service |
| Sequence | Function |
| Endpoint | `http:Client` / connector client |
| Data Service | Database query functions |
| Scheduled Task | `task:Listener` with scheduled job |
| Message Store + Processor | Kafka/message broker integration |
| Inbound Endpoint | Listener service |

## Mediator mapping

| MI mediator | Ballerina equivalent |
|---|---|
| Log | `log:printInfo()` / `log:printError()` |
| Property | Variable assignment |
| Call | `client->get()` / `client->post()` |
| Filter | `if/else` |
| Switch | `match` |
| PayloadFactory | Record construction / JSON/XML template |
| XSLT | XML transformation functions |
| Iterate | `foreach` |
| Aggregate | Query expression with `collect` |
| Respond | `return` statement |
| Fault | `do/on fail` error handler |
| Enrich | Field assignment / spread operator |
| DB Lookup | `db->queryRow()` |

## Example: MI API to Ballerina service

**MI Synapse XML:**
```xml
<api name="OrderAPI" context="/api/orders">
    <resource methods="GET" uri-template="/{orderId}">
        <inSequence>
            <log level="custom">
                <property name="message" value="Fetching order"/>
            </log>
            <call>
                <endpoint>
                    <http method="GET"
                          uri-template="http://backend:8080/orders/{uri.var.orderId}"/>
                </endpoint>
            </call>
            <respond/>
        </inSequence>
        <faultSequence>
            <log level="custom">
                <property name="message" expression="get-property('ERROR_MESSAGE')"/>
            </log>
            <payloadFactory media-type="json">
                <format>{"error": "$1"}</format>
                <args>
                    <arg expression="get-property('ERROR_MESSAGE')"/>
                </args>
            </payloadFactory>
            <respond/>
        </faultSequence>
    </resource>
</api>
```

**Generated Ballerina code:**
```ballerina
import ballerina/http;
import ballerina/log;

configurable string backendUrl = "http://backend:8080";

final http:Client backendClient = check new (backendUrl);

service /api/orders on new http:Listener(8090) {

    resource function get [string orderId]() returns json|error {
        log:printInfo("Fetching order");
        do {
            json response = check backendClient->get("/orders/" + orderId);
            return response;
        } on fail error e {
            log:printError(e.message());
            return {'error: e.message()};
        }
    }
}
```

## Migration report

The tool generates a detailed report listing what was migrated automatically and what requires manual attention:

![Migration report showing migrated and manually reviewed items](/img/develop/tools/migration-tools/migration-report.png)

```
Migration Report: OrderIntegration
===================================

Migrated Successfully:
  - API: OrderAPI -> order_api_service.bal
  - API: CustomerAPI -> customer_api_service.bal
  - Sequence: LogAndTransform -> log_and_transform.bal (function)
  - Endpoint: BackendEP -> configurable http:Client

Requires Manual Review:
  - Sequence: CustomMediator (class mediator) -> Manual implementation required
  - Data Service: OrderDS -> Database queries need connection configuration
  - Message Store: OrderStore -> Kafka integration needs broker configuration

Unsupported (Manual Migration Required):
  - XSLT Mediator in TransformSequence -> Replace with Ballerina XML transformation
  - Custom Class Mediator: com.example.CustomProcessor -> Rewrite in Ballerina or use Java interop
```
