#!/usr/bin/env node
/**
 * Enforces title-case on:
 *   - `label:` entries in en/sidebars.ts
 *   - Front matter `title:` and `sidebar_label:` in all .md/.mdx files
 *   - H1 (`#`) headings in all .md/.mdx files
 *
 * All other headings (##, ###, etc.) are left untouched.
 *
 * Usage:
 *   node scripts/enforce-title-case.mjs            # apply changes
 *   node scripts/enforce-title-case.mjs --dry-run  # preview only, no writes
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const enDir = resolve(here, '..');
const docsDir = join(enDir, 'docs');
const sidebarsPath = join(enDir, 'sidebars.ts');
const DRY_RUN = process.argv.includes('--dry-run');

// ─── Title-case engine ────────────────────────────────────────────────────────

// Words with fixed casing regardless of position (matched case-insensitively).
const PROTECTED = new Map(Object.entries({
  wso2: 'WSO2',
  api: 'API', apis: 'APIs',
  http: 'HTTP', https: 'HTTPS',
  rest: 'REST', restful: 'RESTful',
  json: 'JSON', yaml: 'YAML', xml: 'XML', toml: 'TOML', csv: 'CSV',
  grpc: 'gRPC', graphql: 'GraphQL',
  websocket: 'WebSocket', websub: 'WebSub',
  oauth: 'OAuth', jwt: 'JWT',
  sql: 'SQL', nosql: 'NoSQL', mysql: 'MySQL', postgresql: 'PostgreSQL', mongodb: 'MongoDB',
  mcp: 'MCP', rag: 'RAG', llm: 'LLM', ai: 'AI', genai: 'GenAI',
  ide: 'IDE', cli: 'CLI', sdk: 'SDK',
  ui: 'UI', url: 'URL', urls: 'URLs',
  ftp: 'FTP', sftp: 'SFTP', mqtt: 'MQTT', tcp: 'TCP',
  icp: 'ICP', pdf: 'PDF', edi: 'EDI',
  ci: 'CI', cd: 'CD', html: 'HTML', css: 'CSS',
  ballerina: 'Ballerina',
  javascript: 'JavaScript', typescript: 'TypeScript',
  github: 'GitHub', gitlab: 'GitLab',
  docker: 'Docker', kubernetes: 'Kubernetes',
  salesforce: 'Salesforce', slack: 'Slack',
  kafka: 'Kafka', rabbitmq: 'RabbitMQ',
  macos: 'macOS', linux: 'Linux', windows: 'Windows',
  vs: 'VS',
}));

// Minor words that stay lowercase unless they are first or last.
const MINOR = new Set([
  'a', 'an', 'the',
  'and', 'but', 'or', 'nor', 'for', 'yet', 'so',
  'as', 'at', 'by', 'in', 'of', 'on', 'to', 'up',
  'via', 'with', 'from', 'into', 'per', 'over',
  'under', 'about', 'after', 'before', 'between',
  'during', 'through', 'than', 'vs',
]);

function caseWord(word, isFirst, isLast) {
  // Peel leading/trailing non-alphanumeric characters (parentheses, commas, etc.)
  const m = word.match(/^([^a-zA-Z0-9]*)([a-zA-Z0-9].*?)([^a-zA-Z0-9]*)$/);
  if (!m) return word;
  const [, pre, core, post] = m;
  const lc = core.toLowerCase();

  // Protected words → exact fixed casing
  if (PROTECTED.has(lc)) return pre + PROTECTED.get(lc) + post;

  // Hyphenated compounds: apply rules recursively to each segment
  if (core.includes('-')) {
    const parts = core.split('-');
    const cased = parts.map((p, i) =>
      caseWord(p, isFirst && i === 0, isLast && i === parts.length - 1)
    );
    return pre + cased.join('-') + post;
  }

  // Minor words stay lowercase unless they are the first or last word
  if (!isFirst && !isLast && MINOR.has(lc)) return pre + lc + post;

  // Default: capitalize first letter, preserve the rest as-is
  return pre + core[0].toUpperCase() + core.slice(1) + post;
}

function toTitleCase(str) {
  if (!str?.trim()) return str;
  const words = str.split(' ');
  return words
    .map((w, i) => caseWord(w, i === 0, i === words.length - 1))
    .join(' ');
}

// ─── Change tracking ─────────────────────────────────────────────────────────

let totalChanges = 0;

function logChange(location, field, before, after) {
  totalChanges++;
  if (DRY_RUN) {
    console.log(`  [${field}] "${before}" → "${after}"`);
    console.log(`         ${location}`);
  }
}

// ─── Sidebar processing ───────────────────────────────────────────────────────

function processSidebars() {
  const src = readFileSync(sidebarsPath, 'utf8');

  const updated = src.replace(/(label:\s*)(['"])(.*?)\2/g, (match, prefix, quote, value) => {
    const cased = toTitleCase(value);
    if (cased !== value) logChange(sidebarsPath.replace(enDir + '/', ''), 'sidebar label', value, cased);
    return `${prefix}${quote}${cased}${quote}`;
  });

  if (!DRY_RUN && updated !== src) writeFileSync(sidebarsPath, updated, 'utf8');
}

// ─── Markdown processing ──────────────────────────────────────────────────────

function applyFrontMatterField(fmBlock, field, relPath) {
  // Quoted value: field: "value" or field: 'value'
  let result = fmBlock.replace(
    new RegExp(`(^${field}:\\s*)(['"])([^\\n]*?)\\2`, 'gm'),
    (_, pre, q, value) => {
      const cased = toTitleCase(value);
      if (cased !== value) logChange(relPath, `fm:${field}`, value, cased);
      return `${pre}${q}${cased}${q}`;
    }
  );

  // Unquoted value: field: Some Value  (does not start with a quote)
  result = result.replace(
    new RegExp(`(^${field}:\\s*)([^'"\\n][^\\n]*)`, 'gm'),
    (_, pre, value) => {
      const trimmed = value.trimEnd();
      const cased = toTitleCase(trimmed);
      if (cased !== trimmed) logChange(relPath, `fm:${field}`, trimmed, cased);
      return `${pre}${cased}`;
    }
  );

  return result;
}

function processMarkdownFile(filePath) {
  const src = readFileSync(filePath, 'utf8');
  const relPath = filePath.replace(enDir + '/', '');

  // Split front matter from body so H1 search never touches YAML comments
  const fmRe = /^---\n([\s\S]*?)\n---\n?/;
  const fmMatch = src.match(fmRe);
  let fm = fmMatch ? fmMatch[0] : '';
  let body = src.slice(fm.length);

  // Front matter fields
  if (fm) {
    fm = applyFrontMatterField(fm, 'title', relPath);
    fm = applyFrontMatterField(fm, 'sidebar_label', relPath);
  }

  // H1 heading — first `# ` line in the body only
  body = body.replace(/^(# )(.+)$/m, (_, prefix, heading) => {
    const cased = toTitleCase(heading);
    if (cased !== heading) logChange(relPath, 'h1', heading, cased);
    return `${prefix}${cased}`;
  });

  const result = fm + body;
  if (!DRY_RUN && result !== src) writeFileSync(filePath, result, 'utf8');
}

// ─── File walker ──────────────────────────────────────────────────────────────

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.mdx?$/.test(entry)) out.push(full);
  }
  return out;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

if (DRY_RUN) {
  console.log('DRY RUN — no files will be written.\n');
}

processSidebars();

const files = walk(docsDir);
for (const file of files) {
  processMarkdownFile(file);
}

if (DRY_RUN) {
  if (totalChanges > 0) {
    console.log(`\nFound ${totalChanges} title-case violation(s) across ${files.length} files and sidebars.ts.`);
    console.log('Fix by running: node scripts/enforce-title-case.mjs');
    process.exit(1);
  } else {
    console.log(`\nAll title-case checks passed (${files.length} files + sidebars.ts).`);
  }
} else {
  console.log(`\nUpdated ${totalChanges} value(s) across ${files.length} files and sidebars.ts.`);
}
