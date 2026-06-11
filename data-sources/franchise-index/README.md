# Franchise Index Source Data

This folder contains the seed universe and audit files for rebuilding Alex's franchise index performance against the S&P 500.

## Source

- Original workbook: `C:\Users\alexj\Downloads\Screen wo Liquidity.xlsx`
- Extracted seed universe: `constituents_seed_2018_screen_wo_liquidity.csv`
- Source context: old Bloomberg-style franchise company screen, likely from the 2018 index development work.
- Source inventory: `source-inventory.md`
- Provider research: `provider-research.md`
- Provider validation: `provider-validation-results.md`
- Security master cleanup: `security-master-cleanup.md`
- Reconstruction results: `reconstruction-results.md`

The seed file is not a live index file. It is the starting universe we can use to reconstruct the historical index with an auditable process.

## Generated Files

- `constituents_audit.csv`
- `constituents_audit.json`
- `holdings_snapshots.csv`
- `holdings_snapshots.json`
- `holdings_exceptions.csv`
- `holdings_exceptions.json`
- `security_master.csv`
- `security_master.json`
- `security_master_manual_review.csv`
- `security_master_manual_review.json`
- `security_master_overrides.json`
- `index_reconstruction_approved_only.csv`
- `index_reconstruction_summary.json`
- `index_reconstruction_annual_returns.csv`
- `unresolved_impact_report.csv`
- `franchise_performance_series.csv`
- `franchise_performance_summary.json`
- `franchise_performance_annual_returns.csv`

Regenerate them with:

```sh
node scripts/franchise-index/build-seed-audit.mjs
python scripts/franchise-index/extract-holdings-archive.py
node scripts/franchise-index/resolve-eodhd-symbols.mjs
node scripts/franchise-index/validate-price-history.mjs --provider=eodhd --all
node scripts/franchise-index/build-security-master.mjs
node scripts/franchise-index/calculate-index-reconstruction.mjs
node scripts/franchise-index/calculate-index-reconstruction.mjs --through-current
```

The audit adds normalized ticker symbols, preliminary corporate-action handling, and a treatment note for each constituent.
The holdings extractor converts legacy Bloomberg `.xls` holdings files from `archive/` into normalized snapshot files.
The security master links historical tickers to provider symbols, validation status, corporate-action treatment, and manual-review flags.
The override file stores manually approved EODHD symbols and explicit caveats for reused tickers, bankruptcy cases, and price-scale mismatches.
The reconstruction calculator creates the first approved-only index series and unresolved-security impact report.

## API Keys

Keep API keys out of git. Copy `.env.example` to `.env.local`, then fill in the keys locally:

```sh
FINNHUB_API_KEY=your_key_here
TRADIER_API_KEY=your_key_here
EODHD_API_KEY=your_key_here
FRANCHISE_INDEX_PROVIDER=tradier
```

`.env.local` is ignored by git.

## Price-History Prototype

Dry run the request plan without calling an API:

```sh
node scripts/franchise-index/fetch-price-history.mjs --provider=tradier --limit=5 --dry-run
node scripts/franchise-index/fetch-price-history.mjs --provider=finnhub --limit=5 --dry-run
node scripts/franchise-index/fetch-price-history.mjs --provider=eodhd --limit=5 --dry-run
```

Fetch a small test set:

```sh
node scripts/franchise-index/fetch-price-history.mjs --provider=tradier --symbols=MCD,SPY --start=2018-01-01 --end=2018-01-31
```

Run the provider validation basket:

```sh
node scripts/franchise-index/fetch-price-history.mjs --provider=eodhd --symbols=MCD,YUM,WEN,MAR,DNKN,SONC,BWLD,TACO,GNC,BLIAQ --start=2007-12-31 --end=2026-05-15
```

Pulled market data is written under `data-sources/franchise-index/market-data/`, which is ignored by git. Before using any provider output in a public chart, verify whether the data includes split adjustment, dividend adjustment, delisted security coverage, and transaction-date handling.

## Current Audit State

- `pending_provider_check`: active or likely active tickers that still need confirmation against a market-data provider.
- `ticker_changed`: former tickers that likely map to a continuous successor ticker.
- `acquired_private` / `acquired_public`: acquired companies where the price series should stop at the transaction unless we explicitly model the transaction consideration.
- `bankruptcy_*`: names that require special treatment and should not be naively spliced into a current ticker.
- `spin_successor` / `corporate_action_review`: complex events that need manual reconstruction before the performance series is published.

## Next Build Step

The real website chart should be built from generated market-data artifacts, not hard-coded slide numbers.

Recommended pipeline:

1. Confirm each seed ticker against a paid or reliable free historical data provider.
2. Pull adjusted daily prices for each constituent and for the S&P 500 benchmark.
3. Apply corporate-action treatment from `constituents_audit.csv`.
4. Rebalance using the final methodology chosen for the franchise index.
5. Write a small JSON file into `src/data/generated/` or `public/data/` for the site to chart.

Important: the audit files are a draft reconstruction aid, not investment advice or an official current index record.
