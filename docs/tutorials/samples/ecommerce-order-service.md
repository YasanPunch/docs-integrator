---
title: E-Commerce Order Service
---

# E-Commerce Order Service

## Overview

A complete event-driven order processing service for an e-commerce platform. The service exposes a REST API for placing orders, validates inventory, processes payments, and publishes events to Kafka for downstream consumers (fulfillment, notifications, analytics). It demonstrates production patterns including idempotency, saga-based transactions, and dead-letter queue handling.

## Architecture Diagram

```mermaid
flowchart TD
    Request([POST /orders<br/>GET /orders/{id}])
    subgraph OrderService["Order Service"]
        Validate["Validate Request"]
        Reserve["Reserve Inventory"]
        Payment["Process Payment"]
        Publish["Publish Events"]

        Validate ----> Reserve ----> Payment ----> Publish
    end
    Kafka((Kafka))
    Fulfillment["Fulfillment Service"]
    Notification["Notification Service"]
    Analytics["Analytics Service"]

    Request ----> Validate
    Publish ----> Kafka
    Kafka ----> Fulfillment & Notification & Analytics
```

## Features Demonstrated

- **REST API** with typed request/response payloads and proper HTTP status codes
- **Saga pattern** for multi-step order processing with compensation on failure
- **Kafka event publishing** for decoupled downstream processing
- **PostgreSQL persistence** with parameterized queries
- **Idempotency** -- duplicate order submissions return the original order without reprocessing
- **Error handling** with structured error responses and DLQ
- **Health check** and readiness endpoints for container orchestration

## Prerequisites

- WSO2 Integrator VS Code extension installed
- Docker and Docker Compose (for Kafka and PostgreSQL)
- Basic familiarity with REST APIs and event-driven architecture

## Quick Start

```bash
git clone https://github.com/wso2/integrator-samples.git
cd integrator-samples/ecommerce-order-service
cp Config-example.toml Config.toml

# Start dependencies (Kafka + PostgreSQL)
docker-compose up -d

# Run database migrations
bal run -- --migrate

# Start the service
bal run
```

The service starts on port 8090. Test with:

```bash
# Place an order
curl -X POST http://localhost:8090/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "CUST-001",
    "items": [{"sku": "SKU-100", "quantity": 2}],
    "paymentMethod": "credit_card",
    "shippingAddress": {"street": "123 Main St", "city": "Springfield", "state": "IL", "zip": "62704"}
  }'

# Check order status
curl http://localhost:8090/orders/ORD-001

# List orders for a customer
curl "http://localhost:8090/orders?customerId=CUST-001"
```

## Code Walkthrough

### Project Structure

```
ecommerce-order-service/
├── Ballerina.toml
├── Config.toml
├── Config-example.toml
├── docker-compose.yml         # Kafka + PostgreSQL
├── main.bal                   # HTTP service with order endpoints
├── order_processor.bal        # Saga-based order processing logic
├── types.bal                  # All record type definitions
├── repository.bal             # Database access layer
├── events.bal                 # Kafka event publisher
├── inventory_client.bal       # Inventory service HTTP client
├── payment_client.bal         # Payment service HTTP client
├── resources/
│   └── migrations/
│       └── 001_create_tables.sql
└── tests/
    ├── order_test.bal
    └── mock_services.bal
```

### Order Processing Saga (`order_processor.bal`)

The core logic follows the saga pattern -- each step has a compensating action:

```ballerina
function processOrder(OrderRequest req) returns Order|error {
    // Step 1: Validate and persist the order.
    Order order = check createOrderRecord(req);

    // Step 2: Reserve inventory.
    string|error reservationId = reserveInventory(order);
    if reservationId is error {
        check updateOrderStatus(order.orderId, "failed_inventory");
        return reservationId;
    }

    // Step 3: Charge payment.
    string|error paymentId = chargePayment(order);
    if paymentId is error {
        check releaseInventory(<string>reservationId);
        check updateOrderStatus(order.orderId, "failed_payment");
        return paymentId;
    }

    // Step 4: Confirm the order and publish events.
    check updateOrderStatus(order.orderId, "confirmed");
    check publishOrderEvent(order, "order.confirmed");
    return order;
}
```

### Event Publishing (`events.bal`)

```ballerina
import ballerinax/kafka;

final kafka:Producer eventProducer = check new ({bootstrapServers, acks: "all"});

function publishOrderEvent(Order order, string eventType) returns error? {
    json event = {eventType, orderId: order.orderId, timestamp: time:utcToString(time:utcNow()), data: order.toJson()};
    check eventProducer->send({topic: "order-events", key: order.orderId.toBytes(), value: event.toJsonString().toBytes()});
}
```

### Testing

Run the full test suite (uses testcontainers for Kafka and PostgreSQL):

```bash
bal test
```

## GitHub

[wso2/integrator-samples/ecommerce-order-service](https://github.com/wso2/integrator-samples/tree/main/ecommerce-order-service)
