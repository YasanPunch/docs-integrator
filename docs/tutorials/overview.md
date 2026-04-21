---
title: Tutorials
---

# Tutorials

Complete, end-to-end examples you can follow from start to finish. Each tutorial takes 30-45 minutes and results in a working integration you can deploy.

:::info Tutorials vs. Develop
**Develop** pages are handbook lookups (3 min, specific answer). **Tutorials** are narrative walkthroughs (30-45 min, follow along). Different modes, different content.

## Walkthroughs

Step-by-step guides that build a real integration from scratch:

| Tutorial | What you'll build |
|---|---|
| **[Salesforce-Database Sync](salesforce-db-sync.md)** | Bi-directional sync between Salesforce and a database |
| **[Kafka Event Pipeline](kafka-event-pipeline.md)** | Event processing pipeline with Kafka |
| **[REST API Aggregation](rest-api-aggregation.md)** | Service orchestration across multiple REST APIs |
| **[Content-Based Routing](walkthroughs/content-based-routing.md)** | Route messages based on content |
| **[Data Transformation](walkthroughs/data-transformation-pipeline.md)** | Transform data between formats |
| **[File Batch ETL](file-batch-etl.md)** | Batch extract-transform-load from files |
| **[Healthcare HL7/FHIR](healthcare-hl7-fhir.md)** | Healthcare data integration with HL7 and FHIR |

## Enterprise Integration Patterns

Battle-tested patterns for distributed systems:

| Pattern | Use case |
|---|---|
| **[Content-Based Router](patterns/content-based-router.md)** | Route to different endpoints based on message content |
| **[Scatter-Gather](patterns/scatter-gather.md)** | Fan-out requests and aggregate responses |
| **[Circuit Breaker & Retry](patterns/circuit-breaker.md)** | Resilient calls to unreliable services |
| **[Saga / Compensation](patterns/saga-compensation.md)** | Distributed transactions with rollback |
| **[Publish-Subscribe](patterns/publish-subscribe.md)** | Decouple producers and consumers |
| **[Guaranteed Delivery](patterns/guaranteed-delivery.md)** | Ensure messages are never lost |

[View all patterns &rarr;](patterns/content-based-router.md)

## Pre-Built Samples

Ready-to-run integration samples you can clone and customize:

| Sample | Integration |
|---|---|
| **[Google Sheets &rarr; Salesforce](pre-built/google-sheets-salesforce.md)** | Sync contacts from spreadsheets |
| **[GitHub &rarr; Email Summary](pre-built/github-email-summary.md)** | Daily digest of repository activity |
| **[Gmail &rarr; Salesforce Leads](pre-built/gmail-salesforce-leads.md)** | Auto-create leads from emails (with OpenAI) |
| **[Kafka &rarr; Salesforce Price Book](pre-built/kafka-salesforce-pricebook.md)** | Real-time price updates |

[View all pre-built samples &rarr;](pre-built/overview.md)

## Sample Projects

Full GitHub projects you can clone and run:

- **[Hospital Service](samples/hospital-service.md)** — Healthcare appointment management
- **[E-Commerce Order Service](samples/ecommerce-order-service.md)** — Order processing pipeline
- **[Event-Driven Microservices](samples/event-driven-microservices.md)** — Kafka-based architecture
- **[Data Service with bal persist](samples/data-service-persist.md)** — Type-safe database CRUD
- **[RESTful API with Data Mapper](samples/restful-api-data-mapper.md)** — Visual data transformations

## Migration Guides

Coming from another platform? Start here:

- **[From WSO2 MI](migration/from-wso2-mi.md)** — Migrate from WSO2 Micro Integrator
- **[From MuleSoft](migration/from-mulesoft.md)** — Migrate from MuleSoft Anypoint
- **[From TIBCO](migration/from-tibco.md)** — Migrate from TIBCO BusinessWorks
