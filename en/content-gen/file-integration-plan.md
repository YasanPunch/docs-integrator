# File Integration Docs — Restructure Plan

**Owner:** File sources + file format processing team
**Status:** Draft — revised after team feedback (round 1)
**Branch:** `claude/add-ftp-sftp-docs-53RvG`

Scope of this team's ownership:
- **File sources** — Develop > Integration Artifacts > File Integration (FTP/SFTP, Local Files)
- **File format processing** — Develop > Transform (CSV, EDI, XML, JSON, YAML/TOML) as it applies to file-based integrations
- Tutorials that demonstrate file-based integration end-to-end

> Note: Fixed-width / flat-file is **not** supported by the product — removed
> from this plan.

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

### 1.2 Proposed structure (revised — no file moves)

```
File Integration
├─ Remote Servers (FTP/SFTP)            [category — renamed label only]
│  ├─ ftp-sftp.md                        ← kept at current path
│  ├─ csv-fault-tolerance.md             ← NEW
│  ├─ file-dependency-triggers.md        ← NEW
│  ├─ streaming-large-files.md           ← NEW
│  ├─ resiliency.md                      ← NEW
│  └─ high-availability.md               ← NEW
└─ Local Files
```

### 1.3 File paths and image folder (revised)

**Decision:** keep all existing paths unchanged. `ftp-sftp.md` stays at
`en/docs/develop/integration-artifacts/file/ftp-sftp.md`. Image folder
`/img/develop/integration-artifacts/file/ftp-sftp/` stays. New pages are
siblings of `ftp-sftp.md` in the same directory.

Rationale: maintainability — no existing links or image references break.

**No file moves. Only additions.**

### 1.4 New pages

| Page (path under `file/`) | Content focus | Source material | Confidence |
|---|---|---|---|
| `csv-fault-tolerance.md` | How `failSafe` parser output combines with `@ftp:FunctionConfig` `afterProcess`/`afterError` to auto-route files, zero-records-check pattern, `do/on fail` pattern. Cross-links to `transform/csv-flat-file.md`. | Adapted from `tutorials/walkthroughs/csv-ftp-processing.md` | High |
| `file-dependency-triggers.md` | `fileNamePattern`, `fileAgeFilter` (minAge/maxAge), `fileDependencyConditions` (targetPattern, requiredFiles, capture groups `$1`, matchingMode) | Adapted from `tutorials/walkthroughs/ftp-listener-with-age-filter-and-file-dependency.md` | High |
| `streaming-large-files.md` | **RESOLVED:** Binding `stream<RecordType, error?>` as first param of `onFileCsv`. `onFile` supports `stream<byte[], error?>`. Other formats (JSON/XML) do NOT have streamed variants. Error terminates stream (except CSV fault-tolerance: corrupted rows skip if failSafe enabled). `afterProcess`/`afterError` fire based on handler return value (nil vs error). | Confirmed by team | High |
| `resiliency.md` | **Client-side** retry with exponential backoff (`RetryConfig`) for read operations + circuit breaker (`CircuitBreakerConfig`) with CLOSED/OPEN/HALF_OPEN states, failure categories, rolling window. Both on `ftp:ClientConfiguration`. | BEP #1420 (retry) + BEP #1422 (circuit breaker) — specs fetched | High |
| `high-availability.md` | **Listener-side** distributed coordination via `CoordinationConfig`. Active-passive (warm standby). Database-backed (MySQL/PostgreSQL) leader election, heartbeat, liveness check. Only active node polls. Automatic failover. | BEP #1418 — spec fetched | High |

### 1.5 Corrections to existing `ftp-sftp.md`

The existing file is auto-generated and has two correctness issues that must
be fixed as part of this round:

| # | Section (line approx.) | Issue | Fix |
|---|---|---|---|
| 1 | "Caller operations" (L546–580) | Presented as the primary read/write mechanism | Reframe: `ftp:Caller` is an **optional handler parameter used for backup control when the user needs post-processing beyond `afterProcess`/`afterError`**. The primary path is typed handler parameters (`string`, `json`, `xml`, records, streams) + `@ftp:FunctionConfig` post-actions. |
| 2 | "Writing output files" (L610–641) | Creates a new `ftp:Client` to write output | Replace with `caller->putText` / `caller->putBytes` / `caller->putJson` / `caller->putXml` / `caller->putCsv` inside the handler. Same session, no new client needed. |

Everything else in `ftp-sftp.md` is accepted as-is.

### 1.6 Reference updates needed (revised — lighter)

- `en/sidebars.ts` lines 127-133: change inner `ftp-sftp` entry from a single
  doc to a nested `category` "Remote Servers (FTP/SFTP)" whose items are the
  6 pages (existing + 5 new), all at current paths.
- **No link fixes required** in `local-files.md`, `csv-ftp-processing.md`, or
  `content-gen/02-develop.md` since `ftp-sftp.md` stays put.

### 1.7 Open questions — all resolved

| # | Question | Resolution |
|---|---|---|
| 1 | Source for `resiliency.md` and `high-availability.md` | **Resolved.** Specs fetched from niveathika/ballerina-spec fork branches: `coordination`, `ftp-retry`, `ftp-circuit-breaker`. BEP #1418 (coordination), #1420 (retry), #1422 (circuit breaker). |
| 2 | Sidebar label | **"Remote Servers (FTP/SFTP)"** |
| 3 | Overview filename | **Keep `ftp-sftp.md`** (no rename) |
| 4 | Tutorial restructure | **Defer to round 2** |

### 1.7.1 Streaming semantics — resolved

| # | Question | Answer |
|---|---|---|
| 1 | Typed record stream for CSV | **Yes.** `stream<Order, error?>` where `Order` is a user record. Rows bound per-element as stream is consumed. |
| 2 | Other formats | **Only** `onFile` (`stream<byte[], error?>`) and `onFileCsv`. JSON/XML do NOT have streamed variants. |
| 3 | Error behaviour | Error element **terminates** the stream. **Exception:** CSV with `failSafe` enabled — corrupted row structure is skipped and stream continues. |
| 4 | Post-processing | Depends on handler return value: `nil` → `afterProcess`, `error` → `afterError`. Stream consumption itself doesn't affect this. |

### 1.7.2 ftp-sftp.md corrections — resolved

| # | Question | Answer |
|---|---|---|
| 1 | Drop `ftp:Client` from page? | **Yes, drop it for now.** |
| 2 | Caller de-emphasis style | Go with overall tone of the page (no strong preference). |

---

## 2. Tutorials section — survey and gaps *(deferred to round 2)*

Survey retained for reference; execution deferred.

### 2.1 Existing file-related tutorials

| Tutorial | Path | Topic |
|---|---|---|
| CSV FTP Processing (fail-safe) | `tutorials/walkthroughs/csv-ftp-processing.md` | FTP listener + CSV parsing + fail-safe + auto-move |
| EDI FTP Processing | `tutorials/walkthroughs/edi-ftp-processing.md` | SFTP + X12 EDI parsing + REST push + archive |
| FTP Listener with Age Filter + File Dependency | `tutorials/walkthroughs/ftp-listener-with-age-filter-and-file-dependency.md` | File dependency (marker files), age filter, auto-delete |
| File Batch ETL Pipeline | `tutorials/file-batch-etl.md` | SFTP + CSV → Postgres batch load |
| FTP EDI → Salesforce (pre-built) | `tutorials/pre-built/ftp-edi-salesforce.md` | Pre-built integration sample |

### 2.2 Candidate gaps (round 2)

- Local Files watcher tutorial
- XML file processing from FTP
- JSON file batch processing
- Stream-based large file processing end-to-end
- FTP → Kafka (file-to-event bridge)
- Multiple-file correlation / join

*(Fixed-width / flat-file removed — not supported.)*

### 2.3 Consistency observation

`tutorials/file-batch-etl.md` sits at the tutorials root while the other 3 FTP
walkthroughs live under `walkthroughs/`. Flag for round 2.

---

## 3. Transform section — file format processing

Current state:

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

### 3.1 Overlap with `csv-fault-tolerance.md`

`csv-flat-file.md` already has a "Fail-Safe Processing" section covering
`failSafe`, `enableConsoleLogs`, `fileOutputMode`, and the `INVALID` value
example.

**Decision:** `remote-servers/csv-fault-tolerance.md` does **not** re-document
the parser. It focuses on the integration pattern (listener + `afterProcess` /
`afterError` + zero-records check + `do/on fail`), and cross-links to
`transform/csv-flat-file.md` for parser details.

### 3.2 Naming note

The filename `csv-flat-file.md` is pre-existing. Since flat-file is not
supported, the filename is misleading. **Rename consideration (not blocking
this round):** rename to `csv.md` in a future cleanup. Flagging only.

---

## 4. Execution order (revised)

All unblocked:
1. [ ] Fix `ftp-sftp.md` — reframe Caller, drop Writing output files `ftp:Client`
2. [ ] Draft `csv-fault-tolerance.md` (integration pattern; cross-link to `csv-flat-file.md`)
3. [ ] Draft `file-dependency-triggers.md`
4. [ ] Draft `streaming-large-files.md` (stream binding for onFileCsv + onFile)
5. [ ] Draft `resiliency.md` (BEP #1420 retry + BEP #1422 circuit breaker)
6. [ ] Draft `high-availability.md` (BEP #1418 listener coordination)
7. [ ] Update `sidebars.ts` — nested "Remote Servers (FTP/SFTP)" category
8. [ ] Commit and push

Round 2 (separate):
9. [ ] Tutorial survey, Transform rename

---

## 5. Out of scope for this round

- Troubleshooting guide (deferred by request)
- Connector catalog FTP entry (`connectors/catalog/built-in/ftp/`) — separate team/scope
- Tutorial restructuring and gap coverage — round 2
- `csv-flat-file.md` rename — future cleanup
