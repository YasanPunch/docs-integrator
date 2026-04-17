# File Integration — Beta Test Scenarios

**Purpose:** Validate file integration features end-to-end with positive (happy path) and negative (error/edge case) scenarios.

---

## 1. Local Files — JSON to MySQL

**Goal:** Read JSON files from a local directory, transform, and insert into MySQL.

| # | Scenario | Type | Expected behaviour |
|---|---|---|---|
| 1.1 | Valid JSON file dropped into watched directory | Positive | File detected, parsed, transformed, rows inserted into MySQL, file archived/removed |
| 1.2 | JSON with nested objects requiring flattening | Positive | Nested fields mapped to flat DB columns correctly |
| 1.3 | Multiple JSON files dropped simultaneously | Positive | Each file processed independently, no interleaving |
| 1.4 | Malformed JSON (missing closing brace, trailing comma) | Negative | Handler returns error, file not archived, error logged |
| 1.5 | Valid JSON but schema mismatch (extra fields, missing required fields) | Negative | Binding error or partial insert depending on `laxDataBinding` setting |
| 1.6 | Empty JSON file (0 bytes) | Negative | Handler receives empty content, returns error gracefully |
| 1.7 | MySQL unavailable during insert | Negative | DB error propagates, file remains in incoming for retry on next detection |
| 1.8 | File with non-`.json` extension dropped (e.g. `.txt`) | Negative | Handler filters it out (no processing triggered) |
| 1.9 | Read permission denied on the watched directory | Negative | Listener init fails with clear error message |
| 1.10 | File created then immediately deleted before handler runs | Negative | `onCreate` fires but file read fails; handler returns error gracefully |

---

## 2. SFTP CSV to Kafka

**Goal:** Read CSV files from an SFTP server, publish each record to a Kafka topic.

| # | Scenario | Type | Expected behaviour |
|---|---|---|---|
| 2.1 | Valid CSV with header row, all rows published to Kafka | Positive | Each row becomes one Kafka message, file moved to `/processed` |
| 2.2 | CSV with 10,000+ rows | Positive | All rows published, no memory issues, file moved |
| 2.3 | Kafka broker unavailable | Negative | Publish fails, handler returns error, file moved to `/errors` via `afterError` |
| 2.4 | Kafka broker goes down mid-file (after 500 of 1000 rows) | Negative | Partial publish, error returned, file moved to `/errors`. Published messages remain on Kafka (at-least-once semantics) |
| 2.5 | CSV with malformed row mid-file (wrong column count) | Negative | If using data binding: handler error on that row. If using `string[][]`: row has wrong length, handler can skip or error |
| 2.6 | Empty CSV (header only, no data rows) | Negative | Zero records parsed, handler completes with no Kafka publishes, file moved to `/processed` (success — no data is not an error) |
| 2.7 | SFTP connection drops during file read | Negative | Read fails, handler returns error, file stays on server (not moved) |
| 2.8 | CSV file with BOM (byte order mark) | Negative | First header field may include invisible BOM character — verify parser handles or document the limitation |
| 2.9 | Very large single row (e.g. 1 MB text field) | Negative | Row parsed successfully or clear OOM error depending on content size |

---

## 3. Stream Large CSV (>3 GB) from SFTP to MySQL

**Goal:** Use `stream<RecordType, error?>` on `onFileCsv` to process files that cannot fit in memory.

| # | Scenario | Type | Expected behaviour |
|---|---|---|---|
| 3.1 | 3 GB+ CSV with valid rows, batch insert every 500 rows | Positive | Stream completes, all batches inserted, memory stays flat, file moved to `/processed` |
| 3.2 | Verify memory does not grow linearly with file size | Positive | Monitor heap: should stay within batch-size bounds regardless of file size |
| 3.3 | Malformed row at row 50,000 (type mismatch) | Negative | Stream terminates with error at row ~50K. Batches 1–99 already inserted. Handler returns error, file moved to `/errors` |
| 3.4 | Malformed row with `failSafe` enabled (structural error — wrong column count) | Negative | Corrupted row skipped, stream continues, remaining rows processed. File moved to `/processed` if handler returns nil |
| 3.5 | MySQL goes down mid-stream (after 10 batches) | Negative | Batch insert fails, handler catches error, returns it. File moved to `/errors`. 10 batches worth of data already in DB (partial) |
| 3.6 | SFTP connection drops mid-stream | Negative | Stream read error, handler returns error, file stays on server |
| 3.7 | 0-byte file | Negative | Empty stream, handler completes immediately, verify `afterProcess` still fires |
| 3.8 | Single-row CSV (header + 1 data row) at 3 GB (extremely wide row) | Negative | Stream delivers one enormous record — verify it can bind or fails gracefully |
| 3.9 | CSV with 50M+ rows, all valid | Positive | Sustained streaming over 30+ minutes, no timeout, no leak, all rows inserted |

---

## 4. FTP CSV Fail-Safe with Custom Error Record Processing

**Goal:** Use `failSafe` parsing to skip malformed rows and process error records (log, store, alert).

| # | Scenario | Type | Expected behaviour |
|---|---|---|---|
| 4.1 | CSV with 100 rows: 95 valid, 5 malformed | Positive | 95 records processed, 5 errors logged to console + error log file, file moved to `/processed` |
| 4.2 | Custom error handling: write rejected rows to a separate error CSV | Positive | Error CSV written with row number + reason, main processing completes |
| 4.3 | All rows malformed (100/100 fail) | Negative | Zero valid records, zero-records check triggers, handler returns error, file moved to `/errors` |
| 4.4 | First row malformed, rest valid | Positive | First row skipped, rows 2–N processed, error logged for row 1 |
| 4.5 | Last row malformed | Positive | Rows 1–(N-1) processed, last row logged as error, handler returns nil (success) |
| 4.6 | Error log file path is not writable (permission denied) | Negative | `failSafe` `fileOutputMode` fails — verify whether parsing continues or the whole handler errors |
| 4.7 | Malformed row has correct column count but wrong types (e.g. `"abc"` in `int` field) | Positive | `failSafe` skips the row (type coercion failure), logs it, continues |
| 4.8 | Malformed row has wrong column count (structural corruption) | Negative | Depending on stream vs buffered: if stream, row may terminate stream; if buffered with `failSafe`, row is skipped |
| 4.9 | Mixed: some type errors + some structural errors in same file | Negative | Type errors skipped by `failSafe`, structural errors may terminate stream — verify combined behaviour |

---

## 5. FTPS Connection (Client — `ftp:Client`)

**Goal:** Connect to an FTPS server using `ftp:Client` with SSL/TLS.

| # | Scenario | Type | Expected behaviour |
|---|---|---|---|
| 5.1 | FTPS with valid server certificate, read a file | Positive | TLS handshake succeeds, file content returned |
| 5.2 | FTPS with custom truststore (PEM cert path) | Positive | Client trusts server cert, connection succeeds |
| 5.3 | FTPS server with expired certificate | Negative | TLS handshake fails, clear error message about certificate expiry |
| 5.4 | FTPS server with self-signed certificate (not in truststore) | Negative | Certificate validation fails, connection refused |
| 5.5 | FTPS with hostname mismatch (cert CN ≠ host) | Negative | `verifyHostname: true` (default) rejects connection |
| 5.6 | FTPS with `verifyHostname: false` (non-production) | Positive | Connection succeeds despite hostname mismatch |
| 5.7 | Wrong port (e.g. connecting FTPS client to plain FTP port) | Negative | TLS handshake fails or connection refused |
| 5.8 | FTPS with mutual TLS (client certificate required by server) | Positive | Client provides `key` in `secureSocket`, server accepts |
| 5.9 | FTPS mutual TLS with missing client certificate | Negative | Server rejects connection, clear error |

---

## 6. FTPS File Integration (Listener — `ftp:Listener`)

**Goal:** Connect to an FTPS server using `ftp:Listener` to poll for files.

| # | Scenario | Type | Expected behaviour |
|---|---|---|---|
| 6.1 | FTPS listener with valid certificate, polls and detects files | Positive | Listener connects, polls successfully, files delivered to handler |
| 6.2 | FTPS listener with `secureSocket.cert` pointing to PEM file | Positive | TLS verified against provided cert, polling works |
| 6.3 | FTPS server certificate rotated between polling cycles | Negative | If new cert is in truststore: seamless. If not: next poll fails with TLS error, listener retries (if `retryConfig` set) |
| 6.4 | FTPS server becomes unreachable after initial connection | Negative | Next poll cycle fails, listener logs error, retries on next cycle |
| 6.5 | FTPS with `protocol: ftp:FTPS` but server only supports plain FTP | Negative | TLS handshake fails, listener cannot start |
| 6.6 | All 3 protocols in separate listeners to same server (FTP, SFTP, FTPS) | Positive | Each listener connects using its protocol; verify all 3 work independently |

---

## 7. FTP Coordination (High Availability)

**Goal:** Validate distributed listener coordination — one active, others standby.

| # | Scenario | Type | Expected behaviour |
|---|---|---|---|
| 7.1 | 2 listeners, same `coordinationGroup` — only one polls | Positive | Node A polls, Node B skips. Only one set of file handler invocations. |
| 7.2 | Active node (A) is stopped — standby (B) takes over | Positive | B detects stale heartbeat, promotes to active, begins polling. No files missed (within polling interval). |
| 7.3 | Active node (A) recovers after failover to B | Positive | A comes back as standby. B remains active. No conflict. |
| 7.4 | 3 nodes: A (active), B and C (standby). Kill A. | Positive | Either B or C promotes. Only one becomes active. |
| 7.5 | Coordination database goes down while A is active | Negative | A continues polling (it holds the lease). B/C cannot check liveness. When DB recovers, coordination resumes. |
| 7.6 | Coordination database goes down, then A crashes | Negative | B/C cannot detect A's failure until DB recovers. Files accumulate during the window. After DB recovers, failover occurs. |
| 7.7 | Two listeners with same `memberId` in same group | Negative | Should fail or produce a warning — duplicate member IDs violate uniqueness constraint |
| 7.8 | Two listeners with different `coordinationGroup` values | Positive | Independent groups — both poll simultaneously (no coordination between groups) |
| 7.9 | Clock skew >30s between nodes (default `livenessCheckInterval`) | Negative | Premature failover possible — verify behaviour and document NTP requirement |
| 7.10 | Database latency >5s on heartbeat update | Negative | Heartbeat may appear stale to standby — verify `heartbeatFrequency` vs `livenessCheckInterval` tolerance |

---

## 8. FTP Age and Dependency Filter

**Goal:** Validate `fileAgeFilter` and `fileDependencyConditions` in `@ftp:ServiceConfig`.

| # | Scenario | Type | Expected behaviour |
|---|---|---|---|
| 8.1 | File uploaded, wait 60s (minAge=30s) → file processed | Positive | File ignored on first poll (too young), processed on a subsequent poll after age threshold |
| 8.2 | File uploaded 2 hours ago (maxAge=3600s) → file skipped | Positive | File is stale, never triggers handler |
| 8.3 | `orders_42.csv` + `orders_42.final` both present | Positive | Dependency satisfied, file processed |
| 8.4 | `orders_42.csv` present, `orders_42.final` missing | Negative | Dependency not met, file skipped. Re-evaluated on next poll. |
| 8.5 | `orders_42.final` uploaded, then `orders_42.csv` uploaded | Positive | Once both present and age filter passes, file processed (upload order doesn't matter) |
| 8.6 | `fileDependencyConditions` with `matchingMode: ftp:ANY` and 1 of 2 dependencies present | Positive | ANY mode satisfied, file processed |
| 8.7 | `fileDependencyConditions` with `matchingMode: ftp:ALL` and 1 of 2 dependencies present | Negative | ALL mode not satisfied, file skipped |
| 8.8 | `fileNamePattern` regex with no capture group but `requiredFiles` uses `$1` | Negative | `$1` resolves to empty string — verify behaviour (error or literal `$1`?) |
| 8.9 | File exactly at `minAge` boundary (e.g. 30.0s when minAge=30) | Edge | Verify inclusive vs exclusive boundary — document which |
| 8.10 | File age filter with no `maxAge` (only `minAge` set) | Positive | No upper bound, any file older than minAge is processed |
| 8.11 | Dependency file deleted between detection and handler start | Negative | Race condition — file was eligible when detected, dependency gone by the time handler reads. Verify handler error path. |

---

## 9. One Listener, Multiple Services (Multiple Directories)

**Goal:** Single FTP connection, multiple services monitoring different paths.

| # | Scenario | Type | Expected behaviour |
|---|---|---|---|
| 9.1 | Listener + Service A (`/orders`) + Service B (`/invoices`) — files in both dirs | Positive | Each service processes only its own directory's files |
| 9.2 | File in `/orders` but not `/invoices` | Positive | Only Service A handler fires |
| 9.3 | Same file name in both directories (`report.csv`) | Positive | Each service processes its own copy independently |
| 9.4 | Service A handler errors, Service B handler succeeds | Positive | Failures are isolated — Service B not affected by Service A's error |
| 9.5 | One monitored path doesn't exist on the server | Negative | Service for that path fails (poll error), other service continues normally |
| 9.6 | Service A with `fileNamePattern: ".*\\.csv"`, Service B with no pattern | Positive | A filters to CSV only, B processes all files |
| 9.7 | Both services with `afterProcess: MOVE` to the same destination dir | Negative | Potential file name collision if same name exists in both source dirs — verify overwrite behaviour or error |

---

## 10. One Service, Multiple Listeners (Multiple Servers)

**Goal:** Single service attached to listeners connected to different FTP servers.

| # | Scenario | Type | Expected behaviour |
|---|---|---|---|
| 10.1 | Service on `listenerA` (server1) and `listenerB` (server2), files on both | Positive | Service handler fires for files from both servers |
| 10.2 | `listenerA` connected, `listenerB` connection refused | Negative | `listenerB` init fails — verify whether `listenerA` still works or entire service fails to start |
| 10.3 | `listenerA` disconnects mid-operation, `listenerB` healthy | Negative | `listenerA` poll fails, `listenerB` continues. Service stays up. |
| 10.4 | Same file name on both servers uploaded simultaneously | Positive | Two separate handler invocations, no conflict |
| 10.5 | `ftp:Caller` operations — which server does caller connect to? | Positive | Caller is scoped to the listener that delivered the file. Verify `caller->put*` writes to the correct server. |
| 10.6 | `afterProcess: MOVE` — file moved on the correct server | Positive | Post-processing applies to the originating server, not the other |

---

## 11. HTTP Service — Certificate / Boarding Pass *(out of scope for file integration testing)*

| # | Scenario | Type | Expected behaviour |
|---|---|---|---|
| 11.1 | Valid parameters → populated HTML template → PDF returned | Positive | PDF generated with correct data, `Content-Type: application/pdf` |
| 11.2 | Missing required parameter | Negative | 400 Bad Request with clear error message |
| 11.3 | Special characters in passenger name (unicode, accents) | Positive | Template renders correctly with UTF-8 characters |
| 11.4 | Concurrent requests (100 simultaneous) | Positive | All return valid PDFs, no template corruption |

---

## 12. EDI D03A EDIFACT from SFTP to MySQL

**Goal:** Process D03A-compliant EDIFACT files from SFTP, extract ORDERS, insert into MySQL.

| # | Scenario | Type | Expected behaviour |
|---|---|---|---|
| 12.1 | Valid D03A EDIFACT file with ORDERS message | Positive | EDI parsed, orders extracted, inserted into MySQL, file archived |
| 12.2 | EDIFACT file with multiple ORDERS messages in one interchange | Positive | All orders extracted and inserted |
| 12.3 | Wrong EDI standard version (e.g. D96A instead of D03A) | Negative | Parser rejects or warns about version mismatch |
| 12.4 | Corrupted UNB/UNZ envelope (missing segment terminator) | Negative | Parse fails, handler returns error, file moved to `/errors` |
| 12.5 | EDIFACT with missing mandatory segments (e.g. no BGM in ORDERS) | Negative | Validation fails, error logged with segment details |
| 12.6 | Valid EDI but MySQL table schema doesn't match order fields | Negative | Insert fails, handler returns error with clear column mismatch info |
| 12.7 | Very large EDI file (10,000+ orders in one interchange) | Positive | All orders parsed and batch-inserted without timeout |
| 12.8 | Non-EDI file matching the file name pattern (e.g. a CSV named `.edi`) | Negative | EDI parser fails, handler returns error, file moved to `/errors` |

---

## Cross-Cutting Negative Scenarios

These apply to most file integration scenarios above:

| # | Scenario | Applies to | Expected behaviour |
|---|---|---|---|
| X.1 | FTP/SFTP server completely down at listener startup | 2–10, 12 | Listener init fails with connection error. Service does not start. |
| X.2 | FTP/SFTP server goes down after listener is running | 2–10, 12 | Next poll cycle fails. If `retryConfig` set, retries with backoff. Otherwise waits for next `pollingInterval`. |
| X.3 | Authentication failure (wrong password / expired key) | 2–10, 12 | Connection refused with auth error. No polling occurs. |
| X.4 | Monitored directory deleted while listener is running | 2–10, 12 | Poll returns error (path not found). Listener logs error, retries on next cycle. |
| X.5 | Disk full on target system (MySQL / Kafka / local FS) | All | Write fails, handler returns error, file moves to `/errors` (or stays for local files). |
| X.6 | File modified while being read by handler | 1, 2, 3 | Partial/corrupted read — verify handler errors rather than processing garbage |
| X.7 | `afterProcess: MOVE` destination directory doesn't exist | 2–10, 12 | Move fails after handler success — verify error logging and file state |
| X.8 | File name with special characters (spaces, unicode, `#`, `%`) | All | File detected and processed, or clear error if unsupported |
| X.9 | Symbolic link in watched directory (local files) | 1 | Verify whether symlinks are followed or ignored |
| X.10 | File with no read permission | All | Handler fails to read content, returns error |
