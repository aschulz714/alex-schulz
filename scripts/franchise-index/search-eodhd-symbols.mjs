import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const envPath = resolve('.env.local');

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
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

function normalize(value) {
  return String(value ?? '').toUpperCase();
}

async function fetchSymbolList(exchange, delisted, apiKey) {
  const url = new URL(`https://eodhd.com/api/exchange-symbol-list/${exchange}`);
  url.searchParams.set('api_token', apiKey);
  url.searchParams.set('fmt', 'json');
  if (delisted) url.searchParams.set('delisted', '1');

  const response = await fetch(url);
  if (!response.ok) return [];
  const payload = await response.json();
  return Array.isArray(payload) ? payload : [];
}

const args = parseArgs(process.argv.slice(2));
await loadLocalEnv();

const apiKey = process.env.EODHD_API_KEY;
if (!apiKey) throw new Error('Missing EODHD_API_KEY in .env.local.');

const query = normalize(args.query ?? args.q ?? '');
if (!query) throw new Error('Pass --query=TERM');

const exchanges = String(args.exchanges ?? 'US,TO,V')
  .split(',')
  .map((exchange) => exchange.trim())
  .filter(Boolean);

for (const exchange of exchanges) {
  const [active, delisted] = await Promise.all([
    fetchSymbolList(exchange, false, apiKey),
    fetchSymbolList(exchange, true, apiKey),
  ]);

  const matches = [
    ...active.map((row) => ({ ...row, list: 'active' })),
    ...delisted.map((row) => ({ ...row, list: 'delisted' })),
  ]
    .filter((row) => normalize(`${row.Code} ${row.Name}`).includes(query))
    .slice(0, 40);

  if (!matches.length) continue;

  console.log(`--- ${exchange} ---`);
  for (const row of matches) {
    console.log(`${row.Code}.${exchange}\t${row.list}\t${row.Exchange ?? ''}\t${row.Type ?? ''}\t${row.Name ?? ''}`);
  }
}
