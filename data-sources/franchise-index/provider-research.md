# Franchise Index Data Provider Research

Last checked: 2026-05-15

Goal: choose a data source for reconstructing the EQM Franchise Smart Beta Index with minimal survivorship bias, correct corporate-action treatment, and enough auditability to show the result publicly.

## What This Reconstruction Needs

Required:

- Historical daily prices for active and delisted U.S./Canadian/ADR securities.
- Total-return or adjusted-close methodology that includes dividends and splits.
- Corporate action history for mergers, bankruptcies, spin-offs, symbol changes, and delistings.
- Identifier continuity across ticker changes and reused tickers.
- S&P 500 total-return benchmark or a defensible ETF proxy.
- API or export workflow that can be automated.

Nice to have:

- Point-in-time fundamentals.
- ROIC, WACC, or enough fundamental inputs to calculate a close proxy.
- Constituents/index membership utilities.
- Bulk downloads for all required tickers.

## Recommendation

### Best Institutional Answer: CRSP, ideally with Compustat/WRDS

CRSP is the gold-standard answer for academic-style equity return reconstruction. It explicitly covers active and inactive U.S. securities, delisting information, corporate actions, survivor-bias-free history, permanent identifiers, and returns with and without dividends.

Pros:

- Strongest credibility.
- Designed for rigorous longitudinal backtesting.
- Handles delisting returns better than retail APIs.
- Permanent identifiers reduce ticker reuse problems.

Cons:

- Expensive or requires institutional/academic access.
- Not a simple self-serve developer API.
- Fundamentals would likely need Compustat or another companion dataset.

Use if: Alex can access WRDS/CRSP/Compustat through school, library, employer, or paid research access.

Source:

- https://www.crsp.org/research/crsp-us-stock-databases/

### Best Practical Self-Serve Candidate: EODHD All-In-One or EOD + Fundamentals

EODHD is the most practical self-serve candidate I found for this project because it explicitly documents delisted company handling, delisted ticker lookup, end-of-day data for delisted names, and fundamental data. It is also affordable enough to test without enterprise sales.

Pros:

- API-first.
- 30+ years of historical end-of-day coverage advertised.
- Delisted data is explicitly supported.
- Fundamental data is available.
- Pricing is transparent and relatively low.
- Good fit for our existing Node pipeline.

Cons:

- We must audit adjusted-close behavior carefully.
- It may not reproduce Bloomberg ROIC/WACC exactly.
- For a public/index-grade claim, we should validate a sample against known transactions and old holdings.

Use if: we want the fastest path to a working reconstruction and can accept an audit layer before publication.

Sources:

- https://eodhd.com/financial-academy/financial-faq/survivorship-bias-free-financial-analysis
- https://eodhd.com/pricing

### Best Enterprise API Candidate: QUODD / Xignite Historical Prices

QUODD/Xignite looks highly aligned for an official-grade reconstruction because it advertises adjusted and unadjusted prices, total-return-style adjustments, identifier stitching, corporate actions, and delisted securities via historical identifiers.

Pros:

- Built for exactly the corporate-action/identifier problems this project has.
- Claims support for delisted securities and inactive identifiers.
- Claims handling for dividends, splits, spin-offs, M&A transformations, and CUSIP changes.
- API-friendly.

Cons:

- Likely enterprise pricing.
- May be more than this portfolio project needs unless we want maximum polish.

Use if: we want a professional vendor answer and cost is acceptable.

Source:

- https://www.quodd.com/historical-stock-prices-api-global-market-data

### Strong Backtesting Dataset, Less API-Native: Norgate Data

Norgate has strong survivorship-bias-free U.S. stock coverage and explicitly includes delisted stocks at higher subscription levels. It also includes fundamentals at certain tiers.

Pros:

- Very good for historical backtesting.
- Delisted stocks included in US Platinum/Diamond subscriptions.
- Useful fundamentals available.
- Likely easier/cheaper than institutional vendors.

Cons:

- Workflow is more desktop/backtesting oriented than API-native.
- May require local Windows integration rather than clean server-side scripts.
- Need to verify whether it supports all old franchise names and benchmark total-return needs.

Use if: we want a high-quality research/backtest dataset and are comfortable with a local-data workflow.

Source:

- https://norgatedata.com/data-content-tables.php

### Good API But Not My First Choice For Official Reconstruction: Massive/Polygon

Massive has strong developer ergonomics, historical data, reference tickers with active/delisted status, and ticker metadata. It also has historical flat files and adjusted REST API access.

Pros:

- Excellent API/dev experience.
- Reference tickers include active status and delisted date.
- Price history depth is attractive on paid plans.
- Good for active/current and broad market work.

Cons:

- Flat files are unadjusted; adjusted data requires REST or manual corporate action adjustment.
- Need to verify delisted ticker pricing coverage and total-return adjustment behavior for acquired/bankrupt names.
- Fundamentals/ratios appear tied to higher-tier plans.

Use if: we want a polished developer API and are willing to do more adjustment/audit logic ourselves.

Sources:

- https://massive.com/docs/rest/stocks/tickers/all-tickers
- https://massive.com/docs/flat-files/stocks/overview

### Prototype Only: Tradier and Finnhub

Tradier and Finnhub are useful for early plumbing and active-name tests, especially because Alex already has accounts. Tradier's historical pricing endpoint is simple and claims it usually covers a company's lifetime for reasonable date ranges.

They are not my recommended final source for this reconstruction unless testing proves they can handle delisted/acquired names and adjusted total-return treatment correctly.

Pros:

- Already available.
- Useful for testing scripts and chart workflow.
- Simple API calls.

Cons:

- Not clearly positioned as survivorship-bias-free reconstruction datasets.
- Delisted coverage and exact dividend/corporate-action treatment need verification.
- Likely not enough for official-grade public performance.

Source:

- https://docs.tradier.com/reference/brokerage-api-markets-get-history

## Decision

Recommended path:

1. Use Tradier/Finnhub only for immediate pipeline smoke tests.
2. Evaluate EODHD first as the practical self-serve production candidate.
3. If EODHD fails on delisted/acquired ticker coverage or adjusted-return behavior, evaluate Norgate for a local backtesting dataset or QUODD/Xignite for a higher-cost API.
4. Keep CRSP/Compustat as the gold-standard option if Alex can access it through an institution or paid research route.

Update after first EODHD validation:

- EODHD passed the initial 10-name validation basket for 9 of 10 names.
- It returned usable history for active names and several acquired/delisted names.
- It correctly supports reused ticker handling through delisted `_old` style symbols, as shown by old Del Taco mapping to `TACO_old2.US`.
- `BLIAQ` remains unresolved for comparable 2007-2017 history and needs special handling.
- Full 83-ticker resolution found 79 initial matches, but several require manual override due ticker reuse.

See `provider-validation-results.md`.

## Validation Test Before Committing

Before choosing any provider, run a 10-name test:

- Active: `MCD`, `YUM`, `WEN`, `MAR`
- Acquired: `DNKN`, `SONC`, `BWLD`, `TACO`
- Troubled/delisted: `GNC`, `BLIAQ`

Validation basket file:

- `provider-validation-basket.csv`

EODHD command:

```sh
node scripts/franchise-index/fetch-price-history.mjs --provider=eodhd --symbols=MCD,YUM,WEN,MAR,DNKN,SONC,BWLD,TACO,GNC,BLIAQ --start=2007-12-31 --end=2026-05-15
```

Checks:

- Can we retrieve the old ticker by historical identifier?
- Does the price series stop at the right transaction/delisting date?
- Is adjusted close present?
- Are dividends reflected in total-return-style output?
- Does the provider avoid mapping old tickers onto unrelated reused tickers?
- Can we reproduce the holdings snapshot closing prices within a reasonable tolerance?

If the provider passes this test, it is good enough to wire into the full reconstruction pipeline.
