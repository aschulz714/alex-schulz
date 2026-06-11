import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const envPath = resolve('.env.local');
const auditPath = resolve('data-sources/franchise-index/holdings_snapshots.json');
const outputPath = resolve('data-sources/franchise-index/eodhd-symbol-resolution.json');

function parseArgs(argv) {
  const args = {};
  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [key, value] = arg.slice(2).split('=');
    args[key] = value ?? true;
  }
  return args;
}

async function loadLocalEnv() {
  if (!existsSync(envPath)) return;

  const text = await readFile(envPath, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;

    const [key, ...valueParts] = trimmed.split('=');
    const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function normalize(value) {
  return String(value ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function nameScore(sourceName, candidateName) {
  const source = normalize(sourceName);
  const candidate = normalize(candidateName);
  if (!source || !candidate) return 0;
  if (source === candidate) return 100;
  if (source.includes(candidate) || candidate.includes(source)) return 80;

  const sourceWords = new Set(source.match(/[A-Z0-9]{3,}/g) ?? []);
  const candidateWords = new Set(candidate.match(/[A-Z0-9]{3,}/g) ?? []);
  let overlap = 0;
  for (const word of sourceWords) {
    if (candidateWords.has(word)) overlap += 1;
  }
  return overlap;
}

function uniqueBy(items, keyFn) {
  const seen = new Set();
  const output = [];
  for (const item of items) {
    const key = keyFn(item);
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(item);
  }
  return output;
}

const args = parseArgs(process.argv.slice(2));
await loadLocalEnv();

const apiKey = process.env.EODHD_API_KEY;
if (!apiKey) {
  throw new Error('Missing EODHD_API_KEY. Add it to .env.local.');
}

const holdings = JSON.parse(await readFile(auditPath, 'utf8'));
const symbols =
  args.symbols
    ?.split(',')
    .map((symbol) => symbol.trim().toUpperCase())
    .filter(Boolean) ??
  uniqueBy(holdings, (row) => row.ticker)
    .map((row) => row.ticker)
    .filter(Boolean)
    .sort();

if (!symbols.length) {
  throw new Error('No symbols to resolve.');
}

const sourceByTicker = Object.fromEntries(
  uniqueBy(
    holdings.filter((row) => symbols.includes(row.ticker)),
    (row) => row.ticker
  ).map((row) => [row.ticker, row])
);

async function fetchSymbolList(delisted) {
  const url = new URL('https://eodhd.com/api/exchange-symbol-list/US');
  url.searchParams.set('api_token', apiKey);
  url.searchParams.set('fmt', 'json');
  if (delisted) url.searchParams.set('delisted', '1');

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`EODHD symbol list failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

const [activeSymbols, delistedSymbols] = await Promise.all([
  fetchSymbolList(false),
  fetchSymbolList(true),
]);

const resolved = symbols.map((symbol) => {
  const source = sourceByTicker[symbol] ?? { ticker: symbol, security_name: '' };
  const activeMatches = activeSymbols.filter((candidate) => candidate.Code?.toUpperCase() === symbol);
  const delistedMatches = delistedSymbols.filter((candidate) => {
    const code = candidate.Code?.toUpperCase() ?? '';
    return code === symbol || code === `${symbol}_OLD` || code.startsWith(`${symbol}_`);
  });
  const allMatches = [
    ...activeMatches.map((candidate) => ({ ...candidate, list: 'active' })),
    ...delistedMatches.map((candidate) => ({ ...candidate, list: 'delisted' })),
  ].sort(
    (a, b) =>
      nameScore(source.security_name, b.Name) - nameScore(source.security_name, a.Name) ||
      String(a.Code).localeCompare(String(b.Code))
  );

  const best = allMatches[0];

  return {
    seed_ticker: symbol,
    seed_name: source.security_name,
    suggested_eodhd_symbol: best ? `${best.Code}.US` : '',
    suggested_list: best?.list ?? '',
    suggested_name: best?.Name ?? '',
    suggested_exchange: best?.Exchange ?? '',
    suggested_type: best?.Type ?? '',
    match_count: allMatches.length,
    matches: allMatches.map((candidate) => ({
      code: candidate.Code,
      name: candidate.Name,
      exchange: candidate.Exchange,
      type: candidate.Type,
      list: candidate.list,
      name_score: nameScore(source.security_name, candidate.Name),
    })),
  };
});

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(resolved, null, 2)}\n`);

for (const row of resolved) {
  console.log(
    `${row.seed_ticker}: ${row.suggested_eodhd_symbol || 'NO MATCH'} ${row.suggested_name}`.trim()
  );
}
console.log(
  `Resolved ${resolved.filter((row) => row.suggested_eodhd_symbol).length}/${resolved.length} symbols`
);
console.log(`Wrote ${outputPath}`);
