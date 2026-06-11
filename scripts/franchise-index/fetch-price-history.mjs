import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const auditPath = resolve('data-sources/franchise-index/constituents_audit.json');
const envPath = resolve('.env.local');

const providerConfigs = {
  finnhub: {
    keyName: 'FINNHUB_API_KEY',
    baseUrl: 'https://finnhub.io/api/v1/stock/candle',
  },
  tradier: {
    keyName: 'TRADIER_API_KEY',
    baseUrl: 'https://api.tradier.com/v1/markets/history',
  },
  eodhd: {
    keyName: 'EODHD_API_KEY',
    baseUrl: 'https://eodhd.com/api/eod',
  },
};

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

function toUnixSeconds(dateString) {
  return Math.floor(new Date(`${dateString}T00:00:00Z`).getTime() / 1000);
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function getTickerRows(auditRows, symbolArg) {
  if (symbolArg) {
    const symbols = symbolArg
      .split(',')
      .map((symbol) => symbol.trim().toUpperCase())
      .filter(Boolean);

    return symbols.map((symbol) => ({
      seed_ticker: symbol,
      current_ticker: symbol,
      audit_status: 'manual_symbol',
      price_history_treatment: 'manual_fetch',
    }));
  }

  return auditRows.filter((row) =>
    ['pending_provider_check', 'ticker_changed'].includes(row.audit_status) && row.current_ticker
  );
}

function normalizeTradierHistory(payload) {
  const days = payload?.history?.day;
  const rows = Array.isArray(days) ? days : days ? [days] : [];

  return rows.map((day) => ({
    date: day.date,
    open: Number(day.open),
    high: Number(day.high),
    low: Number(day.low),
    close: Number(day.close),
    volume: Number(day.volume),
  }));
}

function normalizeFinnhubHistory(payload) {
  if (payload?.s !== 'ok') return [];

  return payload.t.map((timestamp, index) => ({
    date: new Date(timestamp * 1000).toISOString().slice(0, 10),
    open: Number(payload.o[index]),
    high: Number(payload.h[index]),
    low: Number(payload.l[index]),
    close: Number(payload.c[index]),
    volume: Number(payload.v[index]),
  }));
}

function normalizeEodhdHistory(payload) {
  const rows = Array.isArray(payload) ? payload : [];

  return rows.map((day) => ({
    date: day.date,
    open: Number(day.open),
    high: Number(day.high),
    low: Number(day.low),
    close: Number(day.close),
    adjustedClose: Number(day.adjusted_close),
    volume: Number(day.volume),
  }));
}

function toEodhdSymbol(symbol) {
  return symbol.includes('.') ? symbol : `${symbol}.US`;
}

async function fetchTradierHistory({ symbol, start, end, apiKey }) {
  const url = new URL(providerConfigs.tradier.baseUrl);
  url.searchParams.set('symbol', symbol);
  url.searchParams.set('interval', 'daily');
  url.searchParams.set('start', start);
  url.searchParams.set('end', end);

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Tradier ${symbol} failed: ${response.status} ${response.statusText}`);
  }

  return normalizeTradierHistory(await response.json());
}

async function fetchFinnhubHistory({ symbol, start, end, apiKey }) {
  const url = new URL(providerConfigs.finnhub.baseUrl);
  url.searchParams.set('symbol', symbol);
  url.searchParams.set('resolution', 'D');
  url.searchParams.set('from', String(toUnixSeconds(start)));
  url.searchParams.set('to', String(toUnixSeconds(end)));
  url.searchParams.set('token', apiKey);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Finnhub ${symbol} failed: ${response.status} ${response.statusText}`);
  }

  return normalizeFinnhubHistory(await response.json());
}

async function fetchEodhdHistory({ symbol, start, end, apiKey }) {
  const providerSymbol = toEodhdSymbol(symbol);
  const url = new URL(`${providerConfigs.eodhd.baseUrl}/${providerSymbol}`);
  url.searchParams.set('api_token', apiKey);
  url.searchParams.set('fmt', 'json');
  url.searchParams.set('period', 'd');
  url.searchParams.set('from', start);
  url.searchParams.set('to', end);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`EODHD ${providerSymbol} failed: ${response.status} ${response.statusText}`);
  }

  return normalizeEodhdHistory(await response.json());
}

async function writeHistory({ provider, symbol, start, end, rows }) {
  const outputPath = resolve(
    `data-sources/franchise-index/market-data/${provider}/prices/${symbol}.json`
  );

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(
    outputPath,
    `${JSON.stringify(
      {
        provider,
        symbol,
        start,
        end,
        rowCount: rows.length,
        pulledAt: new Date().toISOString(),
        priceAdjustmentStatus:
          'provider_daily_history_unverified_for_total_return_or_delisted_security_coverage',
        rows,
      },
      null,
      2
    )}\n`
  );

  return outputPath;
}

const args = parseArgs(process.argv.slice(2));
await loadLocalEnv();

const provider = String(args.provider ?? process.env.FRANCHISE_INDEX_PROVIDER ?? 'tradier').toLowerCase();
const providerConfig = providerConfigs[provider];

if (!providerConfig) {
  throw new Error(`Unsupported provider "${provider}". Use finnhub or tradier.`);
}

const start = String(args.start ?? '2018-01-01');
const end = String(args.end ?? todayIsoDate());
const limit = args.limit === undefined ? undefined : Number(args.limit);
const dryRun = Boolean(args['dry-run']);
const apiKey = process.env[providerConfig.keyName];
const auditRows = JSON.parse(await readFile(auditPath, 'utf8'));
const rowsToFetch = getTickerRows(auditRows, args.symbols);
const selectedRows = Number.isFinite(limit) ? rowsToFetch.slice(0, limit) : rowsToFetch;

console.log(`Provider: ${provider}`);
console.log(`Date range: ${start} to ${end}`);
console.log(`Symbols: ${selectedRows.map((row) => row.current_ticker).join(', ')}`);

if (dryRun) {
  console.log('Dry run only. No API requests made.');
  process.exit(0);
}

if (!apiKey) {
  throw new Error(
    `Missing ${providerConfig.keyName}. Add it to .env.local or set it in the shell environment.`
  );
}

const fetchHistoryByProvider = {
  tradier: fetchTradierHistory,
  finnhub: fetchFinnhubHistory,
  eodhd: fetchEodhdHistory,
};
const fetchHistory = fetchHistoryByProvider[provider];
const results = [];

for (const row of selectedRows) {
  const symbol = row.current_ticker;
  try {
    const historyRows = await fetchHistory({ symbol, start, end, apiKey });
    const outputPath = await writeHistory({ provider, symbol, start, end, rows: historyRows });
    results.push({ symbol, ok: true, rowCount: historyRows.length, outputPath });
    console.log(`OK ${symbol}: ${historyRows.length} rows`);
  } catch (error) {
    results.push({ symbol, ok: false, error: error.message });
    console.error(`FAIL ${symbol}: ${error.message}`);
  }
}

const summaryPath = resolve(`data-sources/franchise-index/market-data/${provider}/fetch-summary.json`);
await mkdir(dirname(summaryPath), { recursive: true });
await writeFile(
  summaryPath,
  `${JSON.stringify(
    {
      provider,
      start,
      end,
      pulledAt: new Date().toISOString(),
      results,
    },
    null,
    2
  )}\n`
);

console.log(`Summary: ${summaryPath}`);
