import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const inputPath = resolve('data-sources/franchise-index/constituents_seed_2018_screen_wo_liquidity.csv');
const outputCsvPath = resolve('data-sources/franchise-index/constituents_audit.csv');
const outputJsonPath = resolve('data-sources/franchise-index/constituents_audit.json');

const corporateActionOverrides = {
  AAN: {
    audit_status: 'acquired_private',
    current_ticker: '',
    successor_tickers: 'IQVentures',
    price_history_treatment: 'cash_acquisition_stop_series',
    notes: "Aaron's was acquired by IQVentures in 2024; do not treat old AAN as a current live ticker.",
  },
  BOJA: {
    audit_status: 'acquired_private',
    current_ticker: '',
    successor_tickers: 'Durational Capital Management; The Jordan Company',
    price_history_treatment: 'cash_acquisition_stop_series',
    notes: 'Bojangles was taken private in 2019.',
  },
  DNKN: {
    audit_status: 'acquired_private',
    current_ticker: '',
    successor_tickers: 'Inspire Brands',
    price_history_treatment: 'cash_acquisition_stop_series',
    notes: "Dunkin' Brands was acquired by Inspire Brands in 2020.",
  },
  FRGI: {
    audit_status: 'acquired_private',
    current_ticker: '',
    successor_tickers: 'Authentic Restaurant Brands',
    price_history_treatment: 'cash_acquisition_stop_series',
    notes: 'Fiesta Restaurant Group was taken private by Authentic Restaurant Brands in 2023.',
  },
  GNC: {
    audit_status: 'bankruptcy_acquired_private',
    current_ticker: '',
    successor_tickers: 'Harbin Pharmaceutical Group',
    price_history_treatment: 'bankruptcy_stop_series',
    notes: 'GNC filed for bankruptcy and was later acquired; old equity should not be spliced into any live ticker.',
  },
  HTZ: {
    audit_status: 'bankruptcy_relisted',
    current_ticker: 'HTZ',
    successor_tickers: 'HTZ',
    price_history_treatment: 'bankruptcy_do_not_splice_old_and_new_series',
    notes: 'Old Hertz equity went through bankruptcy; current HTZ is not a clean continuation without adjustment.',
  },
  JMBA: {
    audit_status: 'acquired_private',
    current_ticker: '',
    successor_tickers: 'Focus Brands',
    price_history_treatment: 'cash_acquisition_stop_series',
    notes: 'Jamba was acquired by Focus Brands in 2018.',
  },
  LQ: {
    audit_status: 'acquired_public',
    current_ticker: '',
    successor_tickers: 'WH',
    price_history_treatment: 'acquisition_and_spin_review',
    notes: "La Quinta's hotel franchising and management business was acquired by Wyndham; handle separately from WH spin history.",
  },
  RCII: {
    audit_status: 'ticker_changed',
    current_ticker: 'UPBD',
    successor_tickers: 'UPBD',
    price_history_treatment: 'ticker_change_continuation_pending_provider_check',
    notes: 'Rent-A-Center changed its corporate name to Upbound Group and ticker to UPBD.',
  },
  RLH: {
    audit_status: 'acquired_private',
    current_ticker: '',
    successor_tickers: 'Sonesta',
    price_history_treatment: 'cash_acquisition_stop_series',
    notes: 'Red Lion Hotels was acquired by Sonesta in 2021.',
  },
  RUTH: {
    audit_status: 'acquired_public',
    current_ticker: '',
    successor_tickers: 'DRI',
    price_history_treatment: 'cash_acquisition_stop_series',
    notes: "Ruth's Hospitality Group was acquired by Darden in 2023.",
  },
  SERV: {
    audit_status: 'acquired_public',
    current_ticker: '',
    successor_tickers: 'RTO.L; RTO',
    price_history_treatment: 'ticker_change_then_acquisition_review',
    notes: 'ServiceMaster became Terminix, which was acquired by Rentokil Initial in 2022.',
  },
  SONC: {
    audit_status: 'acquired_private',
    current_ticker: '',
    successor_tickers: 'Inspire Brands',
    price_history_treatment: 'cash_acquisition_stop_series',
    notes: 'Sonic was acquired by Inspire Brands in 2018.',
  },
  TACO: {
    audit_status: 'acquired_public',
    current_ticker: '',
    successor_tickers: 'JACK',
    price_history_treatment: 'cash_acquisition_stop_series',
    notes: 'Del Taco was acquired by Jack in the Box in 2022.',
  },
  TAX: {
    audit_status: 'corporate_action_review',
    current_ticker: '',
    successor_tickers: 'FRG',
    price_history_treatment: 'complex_corporate_action_review',
    notes: 'Liberty Tax became part of Franchise Group; later Franchise Group was taken private. Needs detailed corporate-action review.',
  },
  WTW: {
    audit_status: 'ticker_changed',
    current_ticker: 'WW',
    successor_tickers: 'WW',
    price_history_treatment: 'ticker_change_continuation_pending_provider_check',
    notes: 'Weight Watchers changed ticker from WTW to WW in 2019.',
  },
  WYN: {
    audit_status: 'spin_successor',
    current_ticker: 'TNL',
    successor_tickers: 'WH; TNL',
    price_history_treatment: 'spin_off_chain_review',
    notes: 'Wyndham Worldwide spun off Wyndham Hotels and later became Travel + Leisure Co.; include both successor economics for historical reconstruction.',
  },
};

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

function formatCsvValue(value) {
  const stringValue = String(value ?? '');
  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replaceAll('"', '""')}"`;
  }
  return stringValue;
}

function toCsv(rows) {
  return `${rows.map((row) => row.map(formatCsvValue).join(',')).join('\n')}\n`;
}

function toNumber(value) {
  if (value === undefined || value === null || value === '') return '';
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : '';
}

function normalizeTicker(rawTicker) {
  return rawTicker
    .replace(/\s+US\s+Equity$/i, '')
    .replace(/\s+Equity$/i, '')
    .trim();
}

function normalizeRow(row) {
  const ticker = normalizeTicker(row.Ticker);
  const override = corporateActionOverrides[ticker] ?? {};
  const defaultStatus = {
    audit_status: 'pending_provider_check',
    current_ticker: ticker,
    successor_tickers: '',
    price_history_treatment: 'use_adjusted_price_series_pending_provider_check',
    notes: 'Needs provider lookup for current listing, corporate actions, and adjusted price continuity.',
  };

  return {
    seed_ticker_raw: row.Ticker,
    seed_ticker: ticker,
    seed_name: row.Name,
    franchise_locations: toNumber(row['Retail - Num of Franchise Locations:Q']),
    total_locations: toNumber(row['Retail - Num of Locations (End):Q']),
    market_cap_2018_screen: toNumber(row['Market Cap']),
    ebitda_to_net_sales_lf: toNumber(row['EBITDA to Net Sales LF']),
    roic_lf: toNumber(row['ROIC LF']),
    fcf_t12m: toNumber(row['FCF T12M']),
    roic_wacc_ratio: toNumber(row['ROIC/WACC Ratio']),
    avg_daily_price_6m: toNumber(row['Avg of Daily Price over 6 Months']),
    ...defaultStatus,
    ...override,
  };
}

const input = await readFile(inputPath, 'utf8');
const [headers, ...records] = parseCsv(input);
const sourceRows = records.map((values) =>
  Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']))
);
const auditRows = sourceRows.map(normalizeRow);

const outputHeaders = [
  'seed_ticker_raw',
  'seed_ticker',
  'seed_name',
  'franchise_locations',
  'total_locations',
  'market_cap_2018_screen',
  'ebitda_to_net_sales_lf',
  'roic_lf',
  'fcf_t12m',
  'roic_wacc_ratio',
  'avg_daily_price_6m',
  'audit_status',
  'current_ticker',
  'successor_tickers',
  'price_history_treatment',
  'notes',
];

await mkdir(dirname(outputCsvPath), { recursive: true });
await writeFile(
  outputCsvPath,
  toCsv([outputHeaders, ...auditRows.map((row) => outputHeaders.map((header) => row[header]))])
);
await writeFile(outputJsonPath, `${JSON.stringify(auditRows, null, 2)}\n`);

const statusCounts = auditRows.reduce((counts, row) => {
  counts[row.audit_status] = (counts[row.audit_status] ?? 0) + 1;
  return counts;
}, {});

console.log(`Wrote ${auditRows.length} audit rows`);
console.log(outputCsvPath);
console.log(outputJsonPath);
console.log(statusCounts);
