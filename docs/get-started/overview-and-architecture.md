---
title: Overview and Architecture
---

# Overview and Architecture

[WSO2 Integrator](https://wso2.com/integration-platform/integrator/) is a low-code integration platform that helps you connect systems, build workflows, and expose services across cloud, on-premises, and hybrid environments.

It combines a visual design experience with code-level flexibility, allowing you to design integrations visually or implement them directly in code. The platform also includes AI-assisted development, built-in connectors, and support for common integration patterns such as APIs, events, and automations.

WSO2 Integrator can be used to build and manage a wide range of integration solutions, from simple service orchestration to complex, enterprise-scale workflows. Whether you are modernizing existing systems or building new digital services, it provides a scalable and productive approach to integration.

## High-level architecture

![WSO2 Integrator architecture diagram](@site/src/assets/img/get-started/overview-and-architecture/integrator_diagram.webp)

The platform follows a three-layer architecture:

1. Design time : WSO2 Integrator IDE with a visual designer and a code editor (both enhanced by AI assistance).
2. Runtime : Ballerina-powered execution engine with built-in networking, concurrency, and type safety.
3. Deployment : Deploy anywhere: Docker, Kubernetes, cloud providers, or as a SaaS.

## Run it your way

WSO2 Integrator is available as 100% open-source self-hostable software or as a SaaS.

### Self-hosted
Full control over your stack. Deploy directly to your own servers, bare metal, or a private cloud environment. Your data never leaves your perimeter.
- Complete data sovereignty
- Air-gapped environment support
- Kubernetes, Docker, VM, or bare metal
- Bring your own CI/CD pipeline

### SaaS
Zero infrastructure to manage. WSO2 handles provisioning, upgrades, scaling, and availability. Get started in minutes.
- Data plane anywhere you want
- Centralized control and observability
- Continuous updates, zero downtime
- Multi-region availability

## Low-code / pro-code duality

This is the key differentiator. Every integration can be built two ways, and both stay in sync:

- Low-code (Visual designer) : Add components through a visual interface, configure properties visually, see the flow as a diagram
- Pro-code (Ballerina editor) : Write code directly with full IDE support, auto-complete, and type checking

Changes in one view are instantly reflected in the other. There's no "export" step and no loss of fidelity. Both experiences are further enhanced by AI assistance to speed up development.

## Powered by Ballerina

Under the hood, every integration is a Ballerina program. This means:

- Cloud-native by design : Built-in support for HTTP, gRPC, GraphQL, WebSocket, Kafka, and more
- Type-safe data handling : Catch data mapping errors at compile time, not in production
- Sequence diagrams as code : Ballerina's unique sequence diagram view shows exactly how your integration communicates with external systems
- Standard library : Rich set of packages for data formats (JSON, XML, CSV, EDI), protocols, and connectors

## Next steps

- [Why WSO2 Integrator](why-wso2-integrator.md) : How it compares to alternatives
- [Key Concepts](key-concepts.md) : Learn the vocabulary
- [Install WSO2 Integrator](install.md) : Get set up
