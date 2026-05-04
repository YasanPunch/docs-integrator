# MI Artifacts in the ICP Console

## Navigating to Artifacts

After signing in, you land on the **All Projects** page under the Default Organization.

1. **Select a project** — Click a project card (e.g. sample-project) to open it.
2. **Select an integration** — The project page lists integrations in a table. Click a row to open the integration detail view.
3. **Browse artifacts** — The integration detail view shows one section per environment (e.g. Dev, Prod). Each environment section has two tabs:
   - **Entry Points** — APIs, proxies, inbound endpoints, and tasks.
   - **Supporting Artifacts** — Endpoints, sequences, templates, and other backing artifacts.

You can also navigate using the **breadcrumb bar** at the top: Organizations → Projects → Integrations. Each segment is a dropdown, so you can switch between projects or integrations without going back.

## Artifact Categories

ICP organizes MI artifacts into two categories: **Entry Points** and **Supporting Artifacts**.

## Entry Points

Entry points are the primary interfaces through which traffic enters an integration. Within an environment section, the **Entry Points** tab is selected by default. Use the dropdown to switch between individual entry points.

| Type | Status | Enable/Disable | Tracing | Statistics | Source | Parameters | Endpoints/WSDL | Trigger | Runtimes |
|------|--------|----------------|---------|------------|--------|------------|----------------|---------|----------|
| REST API | Read-only chip | — | ✓ | ✓ | ✓ | — | — | — | ✓ |
| Proxy Service | — | ✓ | ✓ | ✓ | ✓ | — | ✓ | — | ✓ |
| Inbound Endpoint | — | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ |
| Task | — | ✓ | — | — | ✓ | — | — | ✓ | ✓ |

### Column details

- **Status**: Displays current state (Enabled/Disabled) as a read-only chip (REST API only).
- **Enable/Disable**: Toggle switch to activate or deactivate the artifact on all runtimes.
- **Tracing**: Toggle to enable/disable message tracing for the artifact.
- **Statistics**: Toggle to enable/disable message statistics collection.
- **Source**: Opens a drawer showing the artifact's XML source.
- **Parameters**: Opens a drawer listing the artifact's configuration parameters (Inbound Endpoint only).
- **Endpoints/WSDL**: Opens drawers for endpoint list and WSDL definition (Proxy Service only).
- **Trigger**: Manually fires a scheduled task (Task only).
- **Runtimes**: Lists which runtime nodes have this artifact deployed and their online/offline status.

Each entry point also displays **overview fields** inline:

| Type | Overview Fields |
|------|-----------------|
| REST API | Context path, URL, resource methods and paths |
| Proxy Service | Namespace, SOAP operations |
| Inbound Endpoint | Protocol, sequence, error sequence |
| Task | Group, implementing class |

## Supporting Artifacts

Supporting artifacts appear in the **Supporting Artifacts** tab, organized by type in a side list. Each artifact card shows key fields and available controls.

| Type | Key Fields | Enable/Disable | Tracing | Statistics | Detail Tabs |
|------|------------|----------------|---------|------------|-------------|
| Endpoint | name, type | ✓ | ✓ | ✓ | Source, Runtimes |
| Sequence | name, type, container | — | ✓ | ✓ | Source, Runtimes |
| Template | name, type | — | — | ✓¹ | Source, Runtimes |
| Message Store | name, type, message count | — | — | — | Source, Runtimes |
| Message Processor | name, type | ✓ | — | — | Overview, Parameters, Source, Runtimes |
| Local Entry | name, type | — | — | — | Value, Runtimes |
| Connector | name, package, version | — | — | — | Runtimes |
| Carbon Application | name, version | — | — | — | Artifacts², Runtimes |
| Registry Resource | name, type | — | — | — | Browse, Runtimes |
| Data Service | name, description | — | — | — | Overview, Source, Runtimes |
| Data Source | name, type, driver, url | — | — | — | Overview, Parameters, Source, Runtimes |

¹ Statistics toggle appears only for sequence-type templates.
² Lists the child artifacts bundled inside the CApp.

### Detail tabs

Clicking a supporting artifact card opens a detail drawer with the tabs listed above:

- **Source**: Raw XML definition of the artifact.
- **Runtimes**: Runtime nodes that have this artifact deployed.
- **Overview**: Summary of key configuration fields.
- **Parameters**: Configuration parameter key-value pairs.
- **Value**: Content of a local entry.
- **Browse**: Registry resource browser.
- **Artifacts**: List of artifacts contained in a Carbon Application.
