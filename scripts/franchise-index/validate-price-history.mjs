import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

function parseArgs(argv) {
  const args = {};
  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [key, value] = arg.slice(2).split('=');
    args[key] = value ?? true;
  }
  return args;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      field += '"';
      i += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      row.push(field);
      field = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(field);
      if (row.some((value) => value !== '')) rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }

  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

async function readValidationBasket() {
  const basketPath = resolve('data-sources/franchise-index/provider-validation-basket.csv');
  const text = await readFile(basketPath, 'utf8');
  const [headers, ...records] = parseCsv(text);
  return records.map((values) =>
    Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']))
  );
}

function toIsoDate(value) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const [month, day, year] = String(value).split('/');
  if (!month || !day || !year) return '';
  return `${year.padStart(4, '20')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function daysBetween(a, b) {
  return Math.round((new Date(`${a}T00:00:00Z`) - new Date(`${b}T00:00:00Z`)) / 86400000);
}

function findClosestPrior(rows, date) {
  let best = null;
  for (const row of rows) {
    if (row.date > date) break;
    best = row;
  }
  return best;
}

async function readJsonIfExists(path, fallback) {
  if (!existsSync(path)) return fallback;
  return JSON.parse(await readFile(path, 'utf8'));
}

const args = parseArgs(process.argv.slice(2));
const provider = String(args.provider ?? 'eodhd').toLowerCase();
const holdings = JSON.parse(
  await readFile(resolve('data-sources/franchise-index/holdings_snapshots.json'), 'utf8')
);
const allHoldingSymbols = [...new Set(holdings.map((row) => row.ticker).filter(Boolean))].sort();
const symbols =
  args.symbols
    ?.split(',')
    .map((symbol) => symbol.trim().toUpperCase())
    .filter(Boolean) ??
  (args.all ? allHoldingSymbols : (await readValidationBasket()).map((row) => row.symbol.toUpperCase()));
const resolution = await readJsonIfExists(
  resolve('data-sources/franchise-index/eodhd-symbol-resolution.json'),
  []
);
const overrides = await readJsonIfExists(
  resolve('data-sources/franchise-index/security_master_overrides.json'),
  {}
);
const resolutionByTicker = Object.fromEntries(
  resolution.map((row) => [row.seed_ticker, row.suggested_eodhd_symbol])
);

const outputRows = [];

for (const symbol of symbols) {
  const providerSymbol = overrides[symbol]?.eodhd_symbol || resolutionByTicker[symbol] || symbol;
  const pricePath = resolve(
    `data-sources/franchise-index/market-data/${provider}/prices/${providerSymbol}.json`
  );
  const symbolHoldings = holdings.filter((row) => row.ticker === symbol);

  if (!existsSync(pricePath)) {
    outputRows.push({
      symbol,
      providerSymbol,
      status: 'missing_price_file',
      holdingSnapshotCount: symbolHoldings.length,
    });
    continue;
  }

  const priceFile = JSON.parse(await readFile(pricePath, 'utf8'));
  const priceRows = priceFile.rows ?? [];
  const comparisons = [];
  let missingSnapshotCount = 0;

  for (const holding of symbolHoldings) {
    const asOfDate = toIsoDate(holding.as_of_date);
    const priceRow = findClosestPrior(priceRows, asOfDate);
    if (!priceRow) {
      missingSnapshotCount += 1;
      continue;
    }

    const lagDays = daysBetween(asOfDate, priceRow.date);
    if (lagDays > 7) {
      missingSnapshotCount += 1;
      continue;
    }

    const holdingClose = Number(holding.closing_price);
    const providerClose = Number(priceRow.close);
    const absoluteDifference = providerClose - holdingClose;
    const pctDifference = holdingClose ? absoluteDifference / holdingClose : 0;

    comparisons.push({
      snapshot: holding.snapshot_label,
      asOfDate,
      providerDate: priceRow.date,
      lagDays,
      holdingClose,
      providerClose,
      absoluteDifference,
      pctDifference,
    });
  }

  const absolutePctDifferences = comparisons.map((row) => Math.abs(row.pctDifference));
  const maxAbsPctDifference = absolutePctDifferences.length
    ? Math.max(...absolutePctDifferences)
    : null;
  const avgAbsPctDifference = absolutePctDifferences.length
    ? absolutePctDifferences.reduce((sum, value) => sum + value, 0) / absolutePctDifferences.length
    : null;

  outputRows.push({
    symbol,
    providerSymbol,
    status: comparisons.length ? 'validated_against_holdings' : 'no_comparable_snapshots',
    holdingSnapshotCount: symbolHoldings.length,
    comparableSnapshotCount: comparisons.length,
    missingSnapshotCount,
    providerRowCount: priceFile.rowCount,
    providerFirstDate: priceRows[0]?.date ?? '',
    providerLastDate: priceRows.at(-1)?.date ?? '',
    maxAbsPctDifference,
    avgAbsPctDifference,
    comparisons,
  });
}

const outputPath = resolve(`data-sources/franchise-index/market-data/${provider}/price-validation-summary.json`);
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(outputRows, null, 2)}\n`);

for (const row of outputRows) {
  const maxDiff =
    row.maxAbsPctDifference === null || row.maxAbsPctDifference === undefined
      ? 'n/a'
      : `${(row.maxAbsPctDifference * 100).toFixed(3)}%`;
  console.log(
    `${row.symbol} -> ${row.providerSymbol}: ${row.status}, comparable=${row.comparableSnapshotCount ?? 0}, maxDiff=${maxDiff}`
  );
}
console.log(`Wrote ${outputPath}`);
