# Section 5: Get Started

**Question this section answers:** "I'm new — what is this and how do I begin?"

**Audience:** Developer evaluating WSO2 Integrator for the first time. May come from Java/Spring, MuleSoft, TIBCO, or Node.js background. Knows nothing about Ballerina.

**Tone:** Welcoming, concise, zero jargon. Get them to "Hello World" fast.

---

## Page: Introduction
**File:** `en/docs/get-started/introduction.md`
**Status:** EXISTS — review and enhance if needed

**What to cover:**
- What WSO2 Integrator is (one paragraph)
- Three-layer architecture: Design time (WSO2 Integrator IDE) → Runtime (Ballerina) → Deployment (Docker/K8s/Cloud)
- Low-code / pro-code duality — both views stay in sync, no export step
- Powered by Ballerina — cloud-native, type-safe, sequence diagrams as code
- What's Next links to: Why WSO2 Integrator, Key Concepts, Install

---

## Page: Why WSO2 Integrator

**File:** `en/docs/get-started/why-wso2-integrator.md`

**What to cover:**
- Comparison with alternatives (without bashing them): vs MuleSoft, vs TIBCO, vs Spring Integration, vs custom code
- Key differentiators: low-code + pro-code duality, Ballerina's network-native type system, built-in connectors, AI-powered development
- When to choose WSO2 Integrator (good fit vs not a fit)
- What's Next: Key Concepts, Install

---

## Page: Concepts

**File:** `en/docs/get-started/concepts/concepts.md` (landing), `core-concepts.md`, `ipaas-concepts.md`
**Status:** EXISTS — review against blueprint

**What to cover:**
Single page introducing every major component in 2–3 sentences each. Each links to its detailed page.

Components to cover (in this order):
1. **Services** — HTTP, GraphQL, gRPC, WebSub, TCP listeners
2. **Automations** — Scheduled or triggered tasks without a listener
3. **Event Handlers** — Kafka, RabbitMQ, MQTT consumers
4. **File Processors** — FTP/SFTP watchers, local file triggers
5. **AI Agents** — LLM-powered agents with tools and memory
6. **Connectors** — 200+ pre-built integrations for external services
7. **Visual Data Mapper** — Drag-and-drop data transformation
8. **Query Expressions** — SQL-like data processing in Ballerina
9. **Natural Functions** — AI-powered function implementations
10. **Integration Tools** — OpenAPI, GraphQL, gRPC, AsyncAPI, FHIR, EDI, WSDL, XSD code generators
11. **bal persist** — Type-safe database CRUD
12. **Config.toml** — Runtime configuration
13. **ICP** — Integration Control Plane for observability
14. **Ballerina** — The language under the hood
15. **Low-code / Pro-code** — Two views, one truth
16. **Ballerina Copilot** — AI-assisted development in the IDE
17. **Ballerina Central** — Package registry

---

## Page: System requirements and prerequisites

**File:** `en/docs/get-started/system-requirements.md`

**What to cover:**
- Supported OS: Windows, macOS, Linux (with versions)
- Required software: JDK 17+
- Recommended: Docker (for deployment), Git
- Hardware: minimum RAM, disk space
- Network: ports used, proxy considerations

---

## Page: Install WSO2 Integrator

**File:** `en/docs/get-started/install.md`
**Status:** EXISTS — review and enhance

**What to cover:**
- Download and install WSO2 Integrator IDE (comes with integration plugin built-in)
- Verify installation
- First launch experience
- Troubleshooting common install issues

---

## Page: Create your first project

**File:** `en/docs/get-started/first-project.md`

**What to cover:**
- Create new project in WSO2 Integrator IDE (Command Palette or File menu)
- Project structure explained (Ballerina.toml, main.bal, modules/)
- Run it: `bal run` or IDE play button
- What each file does

---

## Page: Understand the IDE

**File:** `en/docs/get-started/understand-the-ide.md`

**What to cover:**
- Visual Designer panel — drag-and-drop integration building
- Pro-Code editor — full Ballerina IDE with IntelliSense
- Switching between views (they stay in sync)
- HTTP/GraphQL Designers — specialized visual editors
- Data Mapper — visual data transformation tool
- Copilot — AI suggestions and code generation
- Notebooks — interactive Ballerina notebooks
- Activity Bar icons and what they do

---

## Page: Quick start — Build an automation

**File:** `en/docs/get-started/build-automation.md`

**What to cover:**
- Scheduled task that runs every N minutes
- Or: one-shot automation triggered by an event

---

## Page: Quick start — Build an AI agent

**File:** `en/docs/get-started/build-ai-agent.md`

**What to cover:**
- Simple AI agent with one tool
- Connect to OpenAI or Anthropic
- Cross-link to GenAI section for deep dive
- Note: This is a gateway page — detailed AI content lives in GenAI

---

## Page: Quick start — Build an API integration

**File:** `en/docs/get-started/build-api-integration.md`
**Status:** EXISTS — review

**What to cover:**
- Build a simple REST API service in under 10 minutes
- Step-by-step: create project → add HTTP service → add resource → test with Try-It
- Show BOTH low-code and pro-code approaches
- Expected output / what you should see
- What's Next: Quick Start Event, Develop section

---

## Page: Quick start — Build an event-driven integration

**File:** `en/docs/get-started/build-event-driven-integration.md`

**What to cover:**
- Kafka consumer that processes messages
- Or: webhook listener that reacts to GitHub events

---

## Page: Quick start — Build a file-driven integration

**File:** `en/docs/get-started/build-file-driven-integration.md`

**What to cover:**
- FTP/SFTP file watcher that processes uploaded files
