# File Integration Docs — Restructure Plan

**Owner:** File sources + file format processing team
**Status:** Draft
**Branch:** `claude/add-ftp-sftp-docs-53RvG`

Scope of this team's ownership:
- **File sources** — Develop > Integration Artifacts > File Integration (FTP/SFTP, Local Files)
- **File format processing** — Develop > Transform (CSV / flat file, EDI, XML, JSON, YAML/TOML) as it applies to file-based integrations
- Tutorials that demonstrate file-based integration end-to-end

---

## 0. Upstream verification

Verified against `wso2/docs-integrator` main branch — structure matches
niveathika fork exactly for the file integration area:

- `en/docs/develop/integration-artifacts/file/` → `ftp-sftp.md`, `local-files.md`
- `en/docs/develop/transform/` → `csv-flat-file.md`, `edi.md`, `xml.md`, `json.md`, etc.
- `en/docs/tutorials/walkthroughs/` → `csv-ftp-processing.md`, `edi-ftp-processing.md`, `ftp-listener-with-age-filter-and-file-dependency.md`

The docs-bi commit (HA, resiliency, fault-tolerance, troubleshooting) has **not**
been merged into wso2/docs-integrator. This plan is the integration path.

---

## 1. Develop section — restructure

### 1.1 Current structure

```
File Integration
├─ ftp-sftp.md          (single page, ~650 lines)
└─ local-files.md
```

Sidebar entry: `sidebars.ts` lines 126–133, category label "File Integration".

### 1.2 Proposed structure

```
File Integration
├─ Remote Servers (FTP/SFTP)            [category — renamed]
│  ├─ overview.md                        ← existing ftp-sftp.md moved here
│  ├─ csv-fault-tolerance.md             ← NEW
│  ├─ file-dependency-triggers.md        ← NEW
│  ├─ streaming-large-files.md           ← NEW
│  ├─ resiliency.md                      ← NEW
│  └─ high-availability.md               ← NEW
└─ Local Files
```

### 1.3 File moves

| From | To |
|---|---|
| `en/docs/develop/integration-artifacts/file/ftp-sftp.md` | `en/docs/develop/integration-artifacts/file/remote-servers/overview.md` |

Image folder `/img/develop/integration-artifacts/file/ftp-sftp/` stays in place — only the markdown path changes.

### 1.4 New pages

| Page | Content focus | Source material | Confidence |
|---|---|---|---|
| `csv-fault-tolerance.md` | `csv:parseList` with `failSafe`, skipping malformed rows, routing success/error files via `afterProcess`/`afterError`, zero-records-check pattern | Adapted (handbook-style) from `tutorials/walkthroughs/csv-ftp-processing.md` | High |
| `file-dependency-triggers.md` | `fileNamePattern`, `fileAgeFilter` (minAge/maxAge), `fileDependencyConditions` (targetPattern, requiredFiles, capture groups `$1`, matchingMode) | Adapted from `tutorials/walkthroughs/ftp-listener-with-age-filter-and-file-dependency.md` | High |
| `streaming-large-files.md` | When to stream vs buffer; `stream<string[], error?>` for CSV, `stream<byte[], error?>` for binary; `caller->getBytesAsStream`, `caller->getCsvAsStream`; memory considerations | Expanded from brief section already in `ftp-sftp.md` (lines ~472-484, 556-558) | High |
| `resiliency.md` | Error recovery for transient failures (connection drops, polling timeouts), retry behavior, how the listener continues after failure | **Net new** — docs-bi commit content was auto-generated and wrong. Needs correct reference material from team. | Low — blocked on source |
| `high-availability.md` | Multi-instance listener coordination, lease management, watchdog, how to enable coordination, preventing duplicate file processing across nodes | **Net new** — same blocker. | Low — blocked on source |

### 1.5 Reference updates needed

- `en/sidebars.ts` lines 127-133: change category label "File Integration" → keep as-is, change inner `ftp-sftp` entry to a nested category "Remote Servers (FTP/SFTP)" with 6 items
- `en/docs/develop/integration-artifacts/file/local-files.md:232` — update link from `ftp-sftp.md` to `remote-servers/overview.md`
- `en/docs/tutorials/walkthroughs/csv-ftp-processing.md:339` — update link target
- `en/content-gen/02-develop.md:290` — update file path reference

### 1.6 Blueprint alignment

Per the blueprint (section 6.3, Principle 4):
- Develop = handbook lookup (3 min, specific answer) ← these new pages
- Tutorials = end-to-end narrative (30-45 min, follow along) ← existing FTP tutorials remain as-is

The new Develop pages extract reusable patterns from tutorials and present them as standalone reference.

### 1.7 Open questions

1. For `resiliency.md` and `high-availability.md`, what's the source of truth? Options:
   - (a) Draft skeleton pages with TODOs for team to fill in
   - (b) Team points to ballerina/ftp module docs or sample code for coordination/retry behavior
   - (c) Skip until FTP module API stabilizes
2. Sidebar label: "Remote Servers (FTP/SFTP)" or "Remote File Servers"?
3. Overview page filename: `overview.md` (clean) or keep `ftp-sftp.md` (preserves URL)?

---

## 2. Tutorials section — survey and gaps

### 2.1 Existing file-related tutorials

| Tutorial | Path | Topic |
|---|---|---|
| CSV FTP Processing (fail-safe) | `tutorials/walkthroughs/csv-ftp-processing.md` | FTP listener + CSV parsing + fail-safe + auto-move |
| EDI FTP Processing | `tutorials/walkthroughs/edi-ftp-processing.md` | SFTP + X12 EDI parsing + REST push + archive |
| FTP Listener with Age Filter + File Dependency | `tutorials/walkthroughs/ftp-listener-with-age-filter-and-file-dependency.md` | File dependency (marker files), age filter, auto-delete |
| File Batch ETL Pipeline | `tutorials/file-batch-etl.md` | SFTP + CSV → Postgres batch load |
| FTP EDI → Salesforce (pre-built) | `tutorials/pre-built/ftp-edi-salesforce.md` | Pre-built integration sample |

### 2.2 Gaps (candidate new tutorials)

- **Local Files watcher tutorial** — no tutorial currently exists for `local-files.md` artifact
- **XML file processing from FTP** — only CSV and EDI covered
- **JSON file batch processing** — not covered
- **Fixed-width / flat file (non-CSV) processing** — not covered
- **Stream-based large file processing end-to-end** — not covered as a tutorial (only mentioned in reference)
- **FTP → Kafka (file-to-event bridge)** — not covered
- **Multiple-file correlation / join** — not covered

### 2.3 Restructure considerations

Currently file-related tutorials are spread across:
- `tutorials/walkthroughs/` (3 FTP walkthroughs)
- `tutorials/file-batch-etl.md` (top-level, not in walkthroughs/)
- `tutorials/pre-built/` (1 pre-built)

Option A: Move `file-batch-etl.md` into `walkthroughs/` for consistency.
Option B: Group file tutorials under a `walkthroughs/file-integration/` subfolder.
Recommendation: Option A (minimal disruption).

---

## 3. Transform section — file format processing

The team owns file format processing docs as well. Current state:

```
Develop > Transform
├─ data-mapper.md
├─ csv-flat-file.md           ← CSV parsing, fail-safe, projections, delimiters
├─ edi.md
├─ json.md
├─ xml.md
├─ yaml-toml.md
├─ type-system.md
├─ query-expressions.md
├─ expressions-functions.md
└─ ai-assisted-mapping.md
```

### 3.1 Overlap check — csv-flat-file.md already covers fail-safe

**Verified against wso2/docs-integrator main:** `csv-flat-file.md` already has a
dedicated "Fail-Safe Processing" section covering:
- `failSafe` option in `csv:parseList`
- Skipping malformed rows
- `enableConsoleLogs` and `fileOutputMode` config
- Code example with an `INVALID` decimal value

### 3.2 Implication for `csv-fault-tolerance.md` under Remote Servers

To avoid duplication, the new `remote-servers/csv-fault-tolerance.md` should
**not** re-document the parser itself. Instead, it should focus on the
**integration pattern** that the Remote Servers listener enables:

- How `failSafe` parser output combines with FTP's `@ftp:FunctionConfig`
  `afterProcess` / `afterError` to auto-route files to `/processed` or `/errors`
- The **zero-records-check pattern** — if every row is skipped, return an error
  so the file moves to `/errors` instead of `/processed`
- The **`do/on fail`** pattern in the handler to ensure parsing errors propagate
  as handler errors
- Cross-link to `develop/transform/csv-flat-file.md` for the parser reference

This keeps Transform = "how to parse" and Remote Servers = "how to wire parsing
into a listener flow".

---

## 4. Execution order

1. [ ] Review `csv-flat-file.md` for overlap with planned `csv-fault-tolerance.md`
2. [ ] Create `remote-servers/` directory
3. [ ] Move `ftp-sftp.md` → `remote-servers/overview.md` (or keep at parent)
4. [ ] Draft `csv-fault-tolerance.md`
5. [ ] Draft `file-dependency-triggers.md`
6. [ ] Draft `streaming-large-files.md`
7. [ ] Draft skeletons or full content for `resiliency.md` and `high-availability.md` (pending source)
8. [ ] Update `sidebars.ts`
9. [ ] Update cross-references (local-files.md, csv-ftp-processing.md tutorial, content-gen/02-develop.md)
10. [ ] Commit and push to `claude/add-ftp-sftp-docs-53RvG`
11. [ ] Separate follow-up: tutorial gaps (section 2.2)

---

## 5. Out of scope for this round

- Troubleshooting guide (deferred by request)
- Connector catalog FTP entry (`connectors/catalog/built-in/ftp/`) — separate team/scope
