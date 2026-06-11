# Franchise Index Pipeline Plan

Goal: produce an official-grade historical performance series for the franchise index and a website-ready comparison against the S&P 500.

## Pipeline Stages

### 1. Source Archive

Collect every old index artifact into `data-sources/franchise-index/archive/`.

Useful files:

- EQM methodology documents.
- Fact sheets.
- Constituent exports.
- Rebalance files.
- Launch announcement or licensing material.
- Old presentations.
- Bloomberg screenshots or exports.
- Notes about weighting, caps, liquidity, and rebalance schedule.

Current archive status:

- Methodology manual found.
- Research deck found.
- 21 holdings files found from `2007-12-31` through `2017-12-31`.
- Holdings have been extracted into `holdings_snapshots.csv/json`.
- Bloomberg exceptions have been extracted into `holdings_exceptions.csv/json`.

### 2. Security Master

Create a canonical file that maps each historical security to the correct price-history treatment.

Existing starting point:

- `constituents_audit.csv`
- `constituents_audit.json`
- `holdings_snapshots.csv`
- `holdings_exceptions.csv`
- `security_master.csv`
- `security_master_manual_review.csv`

Needed additions:

- Exchange.
- FIGI, CUSIP, ISIN, or provider security ID where available.
- First eligible date.
- Last eligible date.
- Delisting/acquisition date.
- Cash/stock transaction treatment.
- Successor ticker only where a true economic continuation exists.

Current status:

- 83 historical tickers in the security master.
- 75 approved for reconstruction.
- 8 flagged for manual review before they should enter the index calculator.
- Review queue lives in `security_master_manual_review.csv`.
- Override notes live in `security_master_overrides.json` and `security-master-cleanup.md`.

### 3. Methodology Config

Convert the final rules into a machine-readable config.

Candidate file:

- `methodology.config.json`

Fields:

- Base date. Still missing from manual.
- Base value. Still missing from manual.
- Rebalance frequency. Source docs support semiannual.
- Reconstitution frequency.
- Minimum market cap. Source docs: USD 100 million.
- Minimum price. Source docs: USD 3.
- Minimum liquidity. Source docs: USD 1 million average daily traded value over six months.
- Max constituent count.
- Min constituent count.
- Weighting model. Source docs: Bloomberg ROIC/WACC ratio.
- Constituent cap. Source docs: 0.50% minimum and 2.50% maximum at adjustment; trim above 5%.
- Sector/category cap if needed.
- Factor score weights.

### 4. Market Data Pull

Fetch daily adjusted prices for:

- Franchise index constituents.
- S&P 500 benchmark.
- Optional comparison references such as consumer discretionary and quality-factor ETFs.

Provider needs:

- Delisted security history.
- Corporate actions.
- Adjusted close or total-return data.
- Reliable symbol mapping.

Current available accounts:

- Finnhub: useful for prototyping daily candle pulls and reference data.
- Tradier: useful for prototyping daily historical market data.

Free or retail brokerage APIs can prototype the workflow, but official-grade reconstruction likely needs a provider with delisted-history support and clearly documented adjustment methodology.

Implemented prototype:

```sh
node scripts/franchise-index/fetch-price-history.mjs --provider=tradier --limit=5 --dry-run
node scripts/franchise-index/fetch-price-history.mjs --provider=finnhub --limit=5 --dry-run
node scripts/franchise-index/fetch-price-history.mjs --provider=eodhd --limit=5 --dry-run
```

Provider research:

- `provider-research.md`
- Current recommendation: smoke-test with Tradier/Finnhub, then evaluate EODHD as the first practical production candidate.
- Gold-standard option: CRSP/Compustat if accessible.
- Higher-cost API option: QUODD/Xignite if EODHD fails delisted/corporate-action validation.
- Validation basket: `provider-validation-basket.csv`

### 5. Fundamental Data Pull

Fetch point-in-time fundamentals at each rebalance date.

Candidate fields:

- Market cap.
- Free cash flow.
- EBITDA margin.
- ROIC.
- WACC or proxy.
- Franchise/systemwide locations.
- Revenue mix if available.
- Debt and interest coverage.
- Valuation multiples.

Avoid using today's restated values for old rebalance decisions.

### 6. Index Calculation

For each rebalance date:

1. Build eligible universe.
2. Score constituents.
3. Select final index basket.
4. Apply caps and weights.
5. Calculate daily returns until next rebalance.
6. Chain the series from base value.
7. Store constituents and weights for audit.

Outputs:

- `index-levels.csv`
- `index-returns.csv`
- `index-constituents-by-rebalance.csv`
- `index-weights-by-rebalance.csv`
- `performance-summary.json`
- `website-chart.json`

Current first-pass implementation:

```sh
node scripts/franchise-index/calculate-index-reconstruction.mjs
```

Current outputs:

- `index_reconstruction_approved_only.csv/json`
- `index_reconstruction_annual_returns.csv/json`
- `index_reconstruction_summary.json`
- `unresolved_impact_report.csv/json`

The current calculator uses only approved securities from `security_master.csv`, renormalizes approved weights at each rebalance, and measures excluded unresolved weight separately. It is useful for internal analysis, but not yet the final public official reconstruction.

### 7. Website Integration

Render the chart from generated JSON, not hard-coded data.

Recommended chart views:

- Cumulative performance versus S&P 500.
- Rolling 1-year and 3-year excess return.
- Drawdown.
- Annual returns table.
- Current or latest reconstructed constituents.

## What Alex Needs To Provide

Highest value items:

1. Any EQM methodology or fact sheet files.
2. Any official index ticker/name/base date/base value.
3. Any constituent history beyond the 2018 screen.
4. Any rebalance or weighting records.
5. Whether the official index should be quality-weighted, equal-weighted, market-cap-weighted, or score-weighted.
6. Whether we can use a paid data provider, Bloomberg exports, or must prototype from free data first.

## Recommended Next Decision

Use a two-track build:

- **Official reconstruction track:** replicate verified historical methodology as closely as possible.
- **Research methodology track:** test improved score-weighted variants, then freeze one as the future-facing methodology.

The website can eventually show the official story, while the private research notebook can decide whether the refined methodology is strong enough to become the revived version.
