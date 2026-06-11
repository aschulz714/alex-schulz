import { readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const holdingsPath = resolve('data-sources/franchise-index/holdings_snapshots.json');
const securityMasterPath = resolve('data-sources/franchise-index/security_master.json');
const priceDir = resolve('data-sources/franchise-index/market-data/eodhd/prices');

let outputCsvPath = resolve('data-sources/franchise-index/index_reconstruction_approved_only.csv');
let outputJsonPath = resolve('data-sources/franchise-index/index_reconstruction_approved_only.json');
let summaryPath = resolve('data-sources/franchise-index/index_reconstruction_summary.json');
let annualCsvPath = resolve('data-sources/franchise-index/index_reconstruction_annual_returns.csv');
let annualJsonPath = resolve('data-sources/franchise-index/index_reconstruction_annual_returns.json');
let unresolvedCsvPath = resolve('data-sources/franchise-index/unresolved_impact_report.csv');
let unresolvedJsonPath = resolve('data-sources/franchise-index/unresolved_impact_report.json');

const BASE_LEVEL = 100;
const BENCHMARK_SYMBOL = 'SPY.US';

function parseArgs(argv) {
  const args = {};
  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [key, value] = arg.slice(2).split('=');
    args[key] = value ?? true;
  }
  return args;
}

function formatCsvValue(value) {
  const stringValue = String(value ?? '');
  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replaceAll('"', '""')}"`;
  }
  return stringValue;
}

function toCsv(rows, headers) {
  return `${[headers, ...rows.map((row) => headers.map((header) => row[header]))]
    .map((row) => row.map(formatCsvValue).join(','))
    .join('\n')}\n`;
}

function toIsoDate(value) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const [month, day, year] = String(value ?? '').split('/');
  if (!month || !day || !year) return '';
  return `${year.padStart(4, '20')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function groupBy(rows, keyFn) {
  return rows.reduce((groups, row) => {
    const key = keyFn(row);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
    return groups;
  }, new Map());
}

function valueForPriceRow(row) {
  const adjusted = Number(row?.adjustedClose);
  if (Number.isFinite(adjusted) && adjusted > 0) return adjusted;

  const close = Number(row?.close);
  return Number.isFinite(close) && close > 0 ? close : null;
}

function makePriceSeries(priceFile) {
  const rows = (priceFile.rows ?? [])
    .map((row) => ({
      date: row.date,
      value: valueForPriceRow(row),
      close: Number(row.close),
    }))
    .filter((row) => row.date && Number.isFinite(row.value) && row.value > 0)
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    rows,
    firstDate: rows[0]?.date ?? '',
    lastDate: rows.at(-1)?.date ?? '',
  };
}

function findOnOrBefore(series, date, maxLagDays = 7) {
  const rows = series.rows;
  let low = 0;
  let high = rows.length - 1;
  let best = null;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (rows[mid].date <= date) {
      best = rows[mid];
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  if (!best) return null;
  const lagDays = Math.round((new Date(`${date}T00:00:00Z`) - new Date(`${best.date}T00:00:00Z`)) / 86400000);
  return lagDays <= maxLagDays ? best : null;
}

function tradingDatesBetween(series, startDate, endDate) {
  return series.rows
    .map((row) => row.date)
    .filter((date) => date >= startDate && date <= endDate);
}

function yearsBetween(startDate, endDate) {
  return (new Date(`${endDate}T00:00:00Z`) - new Date(`${startDate}T00:00:00Z`)) / (365.25 * 86400000);
}

function maxDrawdown(rows, key) {
  let peak = -Infinity;
  let maxDd = 0;
  let troughDate = '';
  let peakDate = '';
  let currentPeakDate = '';

  for (const row of rows) {
    const value = Number(row[key]);
    if (!Number.isFinite(value)) continue;
    if (value > peak) {
      peak = value;
      currentPeakDate = row.date;
    }
    const drawdown = peak ? value / peak - 1 : 0;
    if (drawdown < maxDd) {
      maxDd = drawdown;
      troughDate = row.date;
      peakDate = currentPeakDate;
    }
  }

  return { maxDrawdown: maxDd, peakDate, troughDate };
}

function annualReturns(rows) {
  const groups = groupBy(rows, (row) => row.date.slice(0, 4));
  return [...groups.entries()]
    .map(([year, yearRows]) => {
      const first = yearRows[0];
      const last = yearRows.at(-1);
      return {
        year,
        start_date: first.date,
        end_date: last.date,
        franchise_start_level: first.franchise_level,
        franchise_end_level: last.franchise_level,
        franchise_return: last.franchise_level / first.franchise_level - 1,
        benchmark_start_level: first.benchmark_spy_level,
        benchmark_end_level: last.benchmark_spy_level,
        benchmark_return: last.benchmark_spy_level / first.benchmark_spy_level - 1,
        excess_return:
          last.franchise_level / first.franchise_level -
          1 -
          (last.benchmark_spy_level / first.benchmark_spy_level - 1),
      };
    })
    .filter((row) => row.start_date !== row.end_date);
}

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

async function loadPriceFiles() {
  const files = await readdir(priceDir);
  const entries = await Promise.all(
    files
      .filter((file) => file.endsWith('.json'))
      .map(async (file) => {
        const symbol = file.replace(/\.json$/i, '').toUpperCase();
        const payload = await readJson(resolve(priceDir, file));
        return [symbol, makePriceSeries(payload)];
      })
  );
  return new Map(entries);
}

function getSeries(priceFiles, symbol) {
  return priceFiles.get(String(symbol).toUpperCase());
}

const args = parseArgs(process.argv.slice(2));
const throughCurrent = Boolean(args['through-current'] || args['extend-last-basket']);

if (throughCurrent) {
  outputCsvPath = resolve('data-sources/franchise-index/franchise_performance_series.csv');
  outputJsonPath = resolve('data-sources/franchise-index/franchise_performance_series.json');
  summaryPath = resolve('data-sources/franchise-index/franchise_performance_summary.json');
  annualCsvPath = resolve('data-sources/franchise-index/franchise_performance_annual_returns.csv');
  annualJsonPath = resolve('data-sources/franchise-index/franchise_performance_annual_returns.json');
  unresolvedCsvPath = resolve('data-sources/franchise-index/franchise_performance_unresolved_impact.csv');
  unresolvedJsonPath = resolve('data-sources/franchise-index/franchise_performance_unresolved_impact.json');
}

const holdings = await readJson(holdingsPath);
const securityMaster = await readJson(securityMasterPath);
const priceFiles = await loadPriceFiles();

const securityByTicker = Object.fromEntries(securityMaster.map((row) => [row.seed_ticker, row]));
const benchmark = getSeries(priceFiles, BENCHMARK_SYMBOL);

if (!benchmark) {
  throw new Error(`Missing benchmark price file for ${BENCHMARK_SYMBOL}. Fetch it before calculating.`);
}

const snapshotGroups = [...groupBy(holdings, (row) => row.snapshot_label).entries()]
  .map(([snapshotLabel, rows]) => ({
    snapshotLabel,
    rebalanceDate: toIsoDate(rows[0]?.as_of_date),
    rows,
  }))
  .filter((snapshot) => snapshot.rebalanceDate)
  .sort((a, b) => a.rebalanceDate.localeCompare(b.rebalanceDate));

const finalDate = throughCurrent ? benchmark.lastDate : snapshotGroups.at(-1).rebalanceDate;
const benchmarkStart = findOnOrBefore(benchmark, snapshotGroups[0].rebalanceDate);
const benchmarkStartValue = benchmarkStart?.value;

if (!benchmarkStartValue) {
  throw new Error(`Could not find benchmark start value for ${snapshotGroups[0].rebalanceDate}.`);
}

const unresolvedReports = [];
const outputRows = [];
let indexLevelAtRebalance = BASE_LEVEL;

for (let i = 0; i < snapshotGroups.length; i += 1) {
  const snapshot = snapshotGroups[i];
  const nextSnapshot = snapshotGroups[i + 1];
  const intervalEndDate = nextSnapshot?.rebalanceDate ?? finalDate;

  if (snapshot.rebalanceDate >= intervalEndDate) continue;

  const holdingsWithSecurity = snapshot.rows.map((holding) => ({
    holding,
    security: securityByTicker[holding.ticker],
    weightPct: Number(holding.weight_pct) || 0,
  }));

  const approvedHoldings = holdingsWithSecurity.filter(
    ({ security }) => security?.mapping_status === 'approved_for_reconstruction' && security.eodhd_symbol
  );
  const unresolvedHoldings = holdingsWithSecurity.filter(
    ({ security }) => security?.mapping_status !== 'approved_for_reconstruction'
  );

  const approvedWeightPct = approvedHoldings.reduce((sum, row) => sum + row.weightPct, 0);
  const unresolvedWeightPct = unresolvedHoldings.reduce((sum, row) => sum + row.weightPct, 0);
  const totalWeightPct = holdingsWithSecurity.reduce((sum, row) => sum + row.weightPct, 0);

  const positions = [];
  const missingApproved = [];

  for (const row of approvedHoldings) {
    const series = getSeries(priceFiles, row.security.eodhd_symbol);
    const startPrice = series ? findOnOrBefore(series, snapshot.rebalanceDate)?.value : null;

    if (!series || !startPrice) {
      missingApproved.push({
        ticker: row.holding.ticker,
        name: row.holding.security_name,
        eodhdSymbol: row.security.eodhd_symbol,
        weightPct: row.weightPct,
      });
      continue;
    }

    positions.push({
      ticker: row.holding.ticker,
      name: row.holding.security_name,
      eodhdSymbol: row.security.eodhd_symbol,
      rawWeightPct: row.weightPct,
      normalizedWeight: approvedWeightPct ? row.weightPct / approvedWeightPct : 0,
      series,
      startPrice,
    });
  }

  const activeWeightPct = positions.reduce((sum, position) => sum + position.rawWeightPct, 0);
  const dateRows = tradingDatesBetween(benchmark, snapshot.rebalanceDate, intervalEndDate);
  const unresolvedTickers = unresolvedHoldings
    .map((row) => `${row.holding.ticker}:${row.weightPct.toFixed(2)}%`)
    .join('; ');

  unresolvedReports.push({
    snapshot_label: snapshot.snapshotLabel,
    rebalance_date: snapshot.rebalanceDate,
    next_rebalance_date: intervalEndDate,
    total_holdings_count: holdingsWithSecurity.length,
    approved_holdings_count: approvedHoldings.length,
    priced_approved_holdings_count: positions.length,
    unresolved_holdings_count: unresolvedHoldings.length,
    missing_approved_price_count: missingApproved.length,
    total_weight_pct: totalWeightPct,
    approved_weight_pct: approvedWeightPct,
    priced_approved_weight_pct: activeWeightPct,
    unresolved_weight_pct: unresolvedWeightPct,
    missing_approved_weight_pct: missingApproved.reduce((sum, row) => sum + row.weightPct, 0),
    unresolved_tickers: unresolvedTickers,
    missing_approved_tickers: missingApproved.map((row) => `${row.ticker}:${row.weightPct.toFixed(2)}%`).join('; '),
  });

  for (const date of dateRows) {
    const intervalMultiplier = positions.reduce((sum, position) => {
      const price = findOnOrBefore(position.series, date, throughCurrent ? 36500 : 7);
      const value = price?.value ?? position.startPrice;
      return sum + position.normalizedWeight * (value / position.startPrice);
    }, 0);
    const franchiseLevel = indexLevelAtRebalance * intervalMultiplier;
    const benchmarkPrice = findOnOrBefore(benchmark, date)?.value;
    const benchmarkLevel = benchmarkPrice ? BASE_LEVEL * (benchmarkPrice / benchmarkStartValue) : null;

    outputRows.push({
      date,
      franchise_level: franchiseLevel,
      benchmark_spy_level: benchmarkLevel,
      interval_snapshot: snapshot.snapshotLabel,
      interval_rebalance_date: snapshot.rebalanceDate,
      interval_end_date: intervalEndDate,
      approved_weight_pct: approvedWeightPct,
      priced_approved_weight_pct: activeWeightPct,
      unresolved_weight_pct: unresolvedWeightPct,
      approved_holdings_count: approvedHoldings.length,
      priced_approved_holdings_count: positions.length,
      unresolved_holdings_count: unresolvedHoldings.length,
    });
  }

  const endRow = outputRows.findLast((row) => row.date <= intervalEndDate);
  if (endRow) indexLevelAtRebalance = endRow.franchise_level;
}

const dedupedOutputRows = [];
const seenDates = new Set();
for (const row of outputRows) {
  if (seenDates.has(row.date)) continue;
  seenDates.add(row.date);
  dedupedOutputRows.push(row);
}

const startRow = dedupedOutputRows[0];
const endRow = dedupedOutputRows.at(-1);
const years = yearsBetween(startRow.date, endRow.date);
const franchiseTotalReturn = endRow.franchise_level / startRow.franchise_level - 1;
const benchmarkTotalReturn = endRow.benchmark_spy_level / startRow.benchmark_spy_level - 1;
const franchiseAnnualizedReturn = (endRow.franchise_level / startRow.franchise_level) ** (1 / years) - 1;
const benchmarkAnnualizedReturn = (endRow.benchmark_spy_level / startRow.benchmark_spy_level) ** (1 / years) - 1;
const franchiseDrawdown = maxDrawdown(dedupedOutputRows, 'franchise_level');
const benchmarkDrawdown = maxDrawdown(dedupedOutputRows, 'benchmark_spy_level');
const annualReturnRows = annualReturns(dedupedOutputRows);
const maxUnresolved = unresolvedReports.reduce(
  (max, row) => (row.unresolved_weight_pct > max.unresolved_weight_pct ? row : max),
  unresolvedReports[0]
);
const avgUnresolvedWeightPct =
  unresolvedReports.reduce((sum, row) => sum + row.unresolved_weight_pct, 0) / unresolvedReports.length;

const summary = {
  methodology: throughCurrent
    ? 'practical_franchise_performance_reconstruction_through_current'
    : 'approved_only_reconstruction_from_bloomberg_holdings_weights',
  caveat:
    throughCurrent
      ? 'Uses approved securities from security_master.csv, historical Bloomberg holdings weights through 2017, and the latest reconstructed basket thereafter. Securities without later prices are carried at their last available adjusted price.'
      : 'Uses only securities approved in security_master.csv and renormalizes approved weights at each rebalance. Unresolved names are excluded and measured in unresolved_impact_report.csv.',
  benchmark: BENCHMARK_SYMBOL,
  start_date: startRow.date,
  end_date: endRow.date,
  observation_count: dedupedOutputRows.length,
  rebalance_count: unresolvedReports.length,
  base_level: BASE_LEVEL,
  franchise_start_level: startRow.franchise_level,
  franchise_end_level: endRow.franchise_level,
  franchise_total_return: franchiseTotalReturn,
  franchise_annualized_return: franchiseAnnualizedReturn,
  franchise_max_drawdown: franchiseDrawdown.maxDrawdown,
  franchise_max_drawdown_peak_date: franchiseDrawdown.peakDate,
  franchise_max_drawdown_trough_date: franchiseDrawdown.troughDate,
  benchmark_start_level: startRow.benchmark_spy_level,
  benchmark_end_level: endRow.benchmark_spy_level,
  benchmark_total_return: benchmarkTotalReturn,
  benchmark_annualized_return: benchmarkAnnualizedReturn,
  benchmark_max_drawdown: benchmarkDrawdown.maxDrawdown,
  benchmark_max_drawdown_peak_date: benchmarkDrawdown.peakDate,
  benchmark_max_drawdown_trough_date: benchmarkDrawdown.troughDate,
  excess_total_return: franchiseTotalReturn - benchmarkTotalReturn,
  excess_annualized_return: franchiseAnnualizedReturn - benchmarkAnnualizedReturn,
  average_unresolved_weight_pct: avgUnresolvedWeightPct,
  max_unresolved_weight_pct: maxUnresolved.unresolved_weight_pct,
  max_unresolved_snapshot: maxUnresolved.snapshot_label,
};

const outputHeaders = [
  'date',
  'franchise_level',
  'benchmark_spy_level',
  'interval_snapshot',
  'interval_rebalance_date',
  'interval_end_date',
  'approved_weight_pct',
  'priced_approved_weight_pct',
  'unresolved_weight_pct',
  'approved_holdings_count',
  'priced_approved_holdings_count',
  'unresolved_holdings_count',
];
const impactHeaders = [
  'snapshot_label',
  'rebalance_date',
  'next_rebalance_date',
  'total_holdings_count',
  'approved_holdings_count',
  'priced_approved_holdings_count',
  'unresolved_holdings_count',
  'missing_approved_price_count',
  'total_weight_pct',
  'approved_weight_pct',
  'priced_approved_weight_pct',
  'unresolved_weight_pct',
  'missing_approved_weight_pct',
  'unresolved_tickers',
  'missing_approved_tickers',
];
const annualHeaders = [
  'year',
  'start_date',
  'end_date',
  'franchise_start_level',
  'franchise_end_level',
  'franchise_return',
  'benchmark_start_level',
  'benchmark_end_level',
  'benchmark_return',
  'excess_return',
];

await writeFile(outputCsvPath, toCsv(dedupedOutputRows, outputHeaders));
await writeFile(outputJsonPath, `${JSON.stringify(dedupedOutputRows, null, 2)}\n`);
await writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`);
await writeFile(annualCsvPath, toCsv(annualReturnRows, annualHeaders));
await writeFile(annualJsonPath, `${JSON.stringify(annualReturnRows, null, 2)}\n`);
await writeFile(unresolvedCsvPath, toCsv(unresolvedReports, impactHeaders));
await writeFile(unresolvedJsonPath, `${JSON.stringify(unresolvedReports, null, 2)}\n`);

console.log(`Wrote ${dedupedOutputRows.length} index rows`);
console.log(outputCsvPath);
console.log(summaryPath);
console.log(annualCsvPath);
console.log(unresolvedCsvPath);
console.log(JSON.stringify(summary, null, 2));
