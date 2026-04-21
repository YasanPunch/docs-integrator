---
title: Messaging
---

# Messaging

## Available connectors

| Connector | Description | Operations | Authentication |
|-----------|-------------|------------|----------------|
| [AWS SQS](aws.sqs/overview.md) | Fully managed message queuing with standard and FIFO queues, batch operations, and event-driven consumption | Send, Receive, Delete, Batch Send, Batch Delete, Queue Management | AWS IAM (Access Key + Secret Key) |
| [Azure Service Bus](asb/overview.md) | Enterprise message broker with queues, topics, subscriptions, and event-driven message processing | Send, Receive, Schedule, Settle, Admin, Listen | Connection String |
| [Confluent Avro SerDes](confluent.cavroserdes/overview.md) | Avro serialization and deserialization library using the Confluent Schema Registry wire format | Serialize, Deserialize | API Key |
| [Confluent Schema Registry](confluent.cregistry/overview.md) | Schema management for Kafka with schema registration and retrieval | Register, Retrieve | API Key |
| [Google Cloud Pub/Sub](gcloud.pubsub/overview.md) | Pub/Sub messaging service with topic publishing, subscription consumption, and flow control | Publish, Subscribe, Ack, Nack | GCP Service Account Key |
| [IBM MQ](ibm.ibmmq/overview.md) | Enterprise messaging middleware with queue and topic operations, and event-driven message consumption | Put, Get, Publish, Subscribe, Transactions | Username/Password |
| [JMS](java.jms/overview.md) | JMS broker integration with queue/topic messaging, durable subscriptions, and event-driven consumption | Send, Receive, Subscribe, Acknowledge, Commit, Rollback | Username/Password |
| [Kafka](kafka/overview.md) | Distributed event streaming with producers, consumers, and listener-based triggers | Produce, Consume, Poll, Subscribe, Commit, Seek | SASL (PLAIN, SCRAM-SHA-256, SCRAM-SHA-512) |
| [NATS](nats/overview.md) | High-performance pub/sub and persistent JetStream messaging with publish, subscribe, request-reply, and stream management | Publish, Subscribe, Request-Reply, Stream Create/Update/Delete/Purge, Consume, Ack/Nak | None / Username-Password / Token / Mutual TLS |
| [RabbitMQ](rabbitmq/overview.md) | AMQP 0-9-1 message broker with queue/exchange management, pub/sub, and consumer services | Publish, Consume, Queue Declare, Exchange Declare, Bind, Ack, Nack | Username / Password |
| [Solace](solace/overview.md) | Event broker with publish/subscribe, queuing, durable subscriptions, and listener triggers | Send, Receive, Acknowledge, Commit, Rollback | Basic Auth, Kerberos, OAuth 2.0 |
