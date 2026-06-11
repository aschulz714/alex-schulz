import { readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { relative, resolve } from 'node:path';

const holdingsPath = resolve('data-sources/franchise-index/holdings_snapshots.json');
const exceptionsPath = resolve('data-sources/franchise-index/holdings_exceptions.json');
const resolutionPath = resolve('data-sources/franchise-index/eodhd-symbol-resolution.json');
const validationPath = resolve(
  'data-sources/franchise-index/market-data/eodhd/price-validation-summary.json'
);
const auditPath = resolve('data-sources/franchise-index/constituents_audit.json');
const overridesPath = resolve('data-sources/franchise-index/security_master_overrides.json');
const priceDir = resolve('data-sources/franchise-index/market-data/eodhd/prices');

const outputCsvPath = resolve('data-sources/franchise-index/security_master.csv');
const outputJsonPath = resolve('data-sources/franchise-index/security_master.json');
const reviewCsvPath = resolve('data-sources/franchise-index/security_master_manual_review.csv');
const reviewJsonPath = resolve('data-sources/franchise-index/security_master_manual_review.json');
const summaryPath = resolve('data-sources/franchise-index/security_master_summary.json');

const manualReviewNotes = {
  AAN: "Aaron's history requires review because EODHD maps the ticker to The Aaron's Company Inc. and the old/new equity chain may not be continuous.",
  BAGL: 'EODHD found Einstein Noah Restaurant Group but returned zero price rows.',
  BH: 'Large mismatch against Bloomberg holdings snapshots; likely split or price adjustment convention issue.',
  BLIAQ: 'EODHD has a BLIAQ price file, but no comparable 2007-2017 price history for the holdings snapshots.',
  CKR: 'Large mismatch against Bloomberg holdings snapshots; review old CKE Restaurants security mapping.',
  CSH: 'Ticker reuse risk: old Cash America should not map to a fund or unrelated security.',
  DTGF: 'No EODHD symbol match yet for old Dollar Thrifty Automotive.',
  FRS: "Large mismatch against Bloomberg holdings snapshots; review old Frisch's Restaurants security mapping.",
  FRSH: "Ticker reuse risk: old Papa Murphy's should not map to Freshworks.",
  HTZ: 'Hertz went through bankruptcy/relisting; old and current HTZ should not be naively spliced.',
  MDS: 'Large mismatch against Bloomberg holdings snapshots; review old Midas security mapping.',
  'MTY CN': 'Canadian listing needs EODHD Canadian-exchange mapping or ADR/share-class decision.',
  RSHCQ: 'No EODHD symbol match yet for old RS Legacy / RadioShack bankruptcy security.',
  SERV: 'Ticker reuse risk: old ServiceMaster/Terminix should not map to Serve Robotics.',
  TAX: 'Ticker reuse risk: old Liberty Tax / Franchise Group chain should not map to Cambria Tax Aware ETF.',
  'THI CN': 'Canadian Tim Hortons listing needs EODHD Canadian-exchange mapping or transaction treatment.',
  WTW: 'Ticker reuse risk: old Weight Watchers should not map to Willis Towers Watson; likely needs WW/old ticker treatment.',
};

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

async function readJson(path, fallback = []) {
  if (!existsSync(path)) return fallback;
  return JSON.parse(await readFile(path, 'utf8'));
}

function groupBy(rows, keyFn) {
  return rows.reduce((groups, row) => {
    const key = keyFn(row);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
    return groups;
  }, new Map());
}

function mostRecentName(rows) {
  const sorted = [...rows].sort((a, b) => String(a.snapshot_label).localeCompare(String(b.snapshot_label)));
  return sorted.at(-1)?.security_name ?? sorted[0]?.security_name ?? '';
}

function minDate(values) {
  return values.filter(Boolean).sort()[0] ?? '';
}

function maxDate(values) {
  return values.filter(Boolean).sort().at(-1) ?? '';
}

async function priceFileBySymbol() {
  if (!existsSync(priceDir)) return new Map();
  const files = await readdir(priceDir);
  return new Map(files.map((file) => [file.replace(/\.json$/i, '').toUpperCase(), resolve(priceDir, file)]));
}

function summarizeValidation(validation) {
  if (!validation) {
    return {
      validation_status: 'not_validated',
      validation_grade: 'pending',
      validation_notes: 'No validation summary row yet.',
    };
  }

  const maxDiff = Number(validation.maxAbsPctDifference);
  if (validation.status !== 'validated_against_holdings') {
    return {
      validation_status: validation.status,
      validation_grade: 'review',
      validation_notes: 'No comparable holdings snapshots validated against provider prices.',
    };
  }

  if (!Number.isFinite(maxDiff)) {
    return {
      validation_status: validation.status,
      validation_grade: 'review',
      validation_notes: 'Validated status present but max difference is unavailable.',
    };
  }

  if (maxDiff <= 0.005) {
    return {
      validation_status: validation.status,
      validation_grade: 'pass_exact',
      validation_notes: 'Provider closes match Bloomberg holdings snapshots within 0.50%.',
    };
  }

  if (maxDiff <= 0.05) {
    return {
      validation_status: validation.status,
      validation_grade: 'pass_minor_difference',
      validation_notes:
        'Provider closes are within 5% of Bloomberg holdings snapshots; review if this name becomes performance-sensitive.',
    };
  }

  return {
    validation_status: validation.status,
    validation_grade: 'review',
    validation_notes: 'Provider closes differ from Bloomberg holdings snapshots by more than 5%.',
  };
}

function inferCorporateTreatment({ audit, validation, priceLastDate }) {
  if (audit?.price_history_treatment) return audit.price_history_treatment;
  if (validation?.status !== 'validated_against_holdings') return 'manual_review_required';
  if (priceLastDate && priceLastDate < '2025-01-01') return 'price_series_stops_at_delisting_or_acquisition';
  return 'provider_adjusted_price_series';
}

const holdings = await readJson(holdingsPath);
const exceptions = await readJson(exceptionsPath);
const resolutionRows = await readJson(resolutionPath);
const validationRows = await readJson(validationPath);
const auditRows = await readJson(auditPath);
const overrides = await readJson(overridesPath, {});
const priceFiles = await priceFileBySymbol();

const holdingsByTicker = groupBy(holdings, (row) => row.ticker);
const exceptionsByTicker = groupBy(exceptions, (row) => row.ticker);
const resolutionByTicker = Object.fromEntries(resolutionRows.map((row) => [row.seed_ticker, row]));
const validationByTicker = Object.fromEntries(validationRows.map((row) => [row.symbol, row]));
const auditByTicker = Object.fromEntries(auditRows.map((row) => [row.seed_ticker, row]));

const securityRows = [];

for (const [ticker, tickerHoldings] of [...holdingsByTicker.entries()].sort(([a], [b]) => a.localeCompare(b))) {
  const resolution = resolutionByTicker[ticker] ?? {};
  const validation = validationByTicker[ticker];
  const audit = auditByTicker[ticker];
  const override = overrides[ticker] ?? {};
  const providerSymbol = override.eodhd_symbol || resolution.suggested_eodhd_symbol || ticker;
  const providerFilePath = priceFiles.get(providerSymbol.toUpperCase());
  const priceFile = providerFilePath ? await readJson(providerFilePath, {}) : {};
  const priceRows = priceFile.rows ?? [];
  const priceFirstDate = priceRows[0]?.date ?? '';
  const priceLastDate = priceRows.at(-1)?.date ?? '';
  const validationSummary = {
    ...summarizeValidation(validation),
    ...(override.validation_grade ? { validation_grade: override.validation_grade } : {}),
  };
  const manualNote = override.review_reason ?? manualReviewNotes[ticker] ?? '';
  const noMatch = !providerSymbol || providerSymbol === ticker && !resolution.suggested_eodhd_symbol;
  const noPriceRows = providerFilePath && !priceRows.length;
  const inferredNeedsManualReview =
    noMatch ||
    noPriceRows ||
    validationSummary.validation_grade === 'review' ||
    validationSummary.validation_status === 'missing_price_file';
  const mappingStatus =
    override.mapping_status ??
    (inferredNeedsManualReview ? 'manual_review_required' : 'approved_for_reconstruction');
  const needsManualReview = mappingStatus !== 'approved_for_reconstruction';

  const reviewReasons = [
    manualNote,
    noMatch ? 'No EODHD symbol match.' : '',
    noPriceRows ? 'EODHD price file exists but has zero rows.' : '',
    validationSummary.validation_grade === 'review' ? validationSummary.validation_notes : '',
  ].filter(Boolean);

  const maxWeight = Math.max(...tickerHoldings.map((row) => Number(row.weight_pct) || 0));
  const minWeight = Math.min(...tickerHoldings.map((row) => Number(row.weight_pct) || 0));

  securityRows.push({
    seed_ticker: ticker,
    seed_name: mostRecentName(tickerHoldings),
    eodhd_symbol: providerSymbol === ticker && !resolution.suggested_eodhd_symbol ? '' : providerSymbol,
    eodhd_match_name: resolution.suggested_name ?? '',
    eodhd_match_list: resolution.suggested_list ?? '',
    eodhd_match_type: resolution.suggested_type ?? '',
    eodhd_match_count: resolution.match_count ?? 0,
    mapping_status: mappingStatus,
    needs_manual_review: needsManualReview ? 'yes' : 'no',
    review_reason: reviewReasons.join(' | '),
    holdings_snapshot_count: tickerHoldings.length,
    first_snapshot: minDate(tickerHoldings.map((row) => row.snapshot_label)),
    last_snapshot: maxDate(tickerHoldings.map((row) => row.snapshot_label)),
    min_weight_pct: minWeight,
    max_weight_pct: maxWeight,
    bloomberg_exception_count: exceptionsByTicker.get(ticker)?.length ?? 0,
    provider: 'eodhd',
    provider_price_file: providerFilePath ? relative(resolve('.'), providerFilePath) : '',
    provider_row_count: priceFile.rowCount ?? priceRows.length ?? 0,
    provider_first_date: priceFirstDate,
    provider_last_date: priceLastDate,
    validation_status: validationSummary.validation_status,
    validation_grade: validationSummary.validation_grade,
    validation_comparable_snapshots: validation?.comparableSnapshotCount ?? 0,
    validation_missing_snapshots: validation?.missingSnapshotCount ?? tickerHoldings.length,
    validation_max_abs_pct_difference:
      validation?.maxAbsPctDifference === null || validation?.maxAbsPctDifference === undefined
        ? ''
        : validation.maxAbsPctDifference,
    validation_avg_abs_pct_difference:
      validation?.avgAbsPctDifference === null || validation?.avgAbsPctDifference === undefined
        ? ''
        : validation.avgAbsPctDifference,
    corporate_action_status: audit?.audit_status ?? '',
    corporate_action_treatment:
      override.corporate_action_treatment ?? inferCorporateTreatment({ audit, validation, priceLastDate }),
    corporate_action_notes: audit?.notes ?? '',
  });
}

const headers = [
  'seed_ticker',
  'seed_name',
  'eodhd_symbol',
  'eodhd_match_name',
  'eodhd_match_list',
  'eodhd_match_type',
  'eodhd_match_count',
  'mapping_status',
  'needs_manual_review',
  'review_reason',
  'holdings_snapshot_count',
  'first_snapshot',
  'last_snapshot',
  'min_weight_pct',
  'max_weight_pct',
  'bloomberg_exception_count',
  'provider',
  'provider_price_file',
  'provider_row_count',
  'provider_first_date',
  'provider_last_date',
  'validation_status',
  'validation_grade',
  'validation_comparable_snapshots',
  'validation_missing_snapshots',
  'validation_max_abs_pct_difference',
  'validation_avg_abs_pct_difference',
  'corporate_action_status',
  'corporate_action_treatment',
  'corporate_action_notes',
];

const reviewRows = securityRows.filter((row) => row.needs_manual_review === 'yes');
const summary = securityRows.reduce(
  (acc, row) => {
    acc.total += 1;
    acc.byMappingStatus[row.mapping_status] = (acc.byMappingStatus[row.mapping_status] ?? 0) + 1;
    acc.byValidationGrade[row.validation_grade] = (acc.byValidationGrade[row.validation_grade] ?? 0) + 1;
    return acc;
  },
  { total: 0, byMappingStatus: {}, byValidationGrade: {}, manualReviewCount: reviewRows.length }
);

await writeFile(outputCsvPath, toCsv(securityRows, headers));
await writeFile(outputJsonPath, `${JSON.stringify(securityRows, null, 2)}\n`);
await writeFile(reviewCsvPath, toCsv(reviewRows, headers));
await writeFile(reviewJsonPath, `${JSON.stringify(reviewRows, null, 2)}\n`);
await writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`);

console.log(`Wrote ${securityRows.length} security master rows`);
console.log(`Manual review rows: ${reviewRows.length}`);
console.log(outputCsvPath);
console.log(reviewCsvPath);
console.log(JSON.stringify(summary, null, 2));
