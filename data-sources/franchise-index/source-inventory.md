# Franchise Index Source Inventory

Last checked: 2026-05-15

## Files Found In Downloads

Copied into `data-sources/franchise-index/archive/`:

- `Methodology-EQM Franchise Smart Beta Index.docx`
- `EQM Index Research Summary 2-12-18.pptx`
- `Holdings 12-31-07.xls`
- `Holdings 06-30-08.xls`
- `Holdings 12-31-08.xls`
- `Holdings 06-30-09.xls`
- `Holdings 12-31-09.xls`
- `Holdings 06-30-10.xls`
- `Holdings 12-31-10.xls`
- `Holdings 06-30-11.xls`
- `Holdings 12-31-11.xls`
- `Holdings 06-30-12.xls`
- `Holdings 12-31-12.xls`
- `Holdings 06-30-13.xls`
- `Holdings 12-31-13.xls`
- `Holdings 06-30-14.xls`
- `Holdings 12-31-14.xls`
- `Holdings 06-30-15.xls`
- `Holdings 12-31-15.xls`
- `Holdings 06-30-16.xls`
- `Holdings 12-31-16.xls`
- `Holdings 06-30-17.xls`
- `Holdings 12-31-17.xls`

## Extracted Data

- `holdings_snapshots.csv`
- `holdings_snapshots.json`
- `holdings_exceptions.csv`
- `holdings_exceptions.json`

The holdings archive currently gives us:

- 21 semiannual snapshots.
- 1,321 holding rows.
- 83 unique tickers.
- Coverage from `2007-12-31` through `2017-12-31`.

The exception archive currently gives us:

- 549 Bloomberg exception rows.
- Common reasons include unavailable price/security matured-called and inactive instruments.

## Methodology Document Findings

Source: `Methodology-EQM Franchise Smart Beta Index.docx`

- Document title: `Index Manual relating to the EQM Franchise Smart Beta Index`.
- Version: `1.1 dated February 16, 2018`.
- Index owner: EQM Indexes LLC.
- Index calculator/publisher: Solactive AG.
- Index type: total return index.
- Currency: USD.
- Objective: track financial market performance of the U.S. franchising sector.
- Eligible universe: U.S. business format franchises and select Canadian publicly traded companies operating in the U.S.
- Minimum market cap: USD 100 million.
- Minimum price: USD 3 per share.
- Minimum average daily traded value: USD 1 million over the last six months.
- Non-U.S. companies: use U.S. exchange traded ADR version if available.
- Weighting: fundamentally weighted by ROIC/WACC ratio as defined by Bloomberg at the time of adjustment.
- Constituent weight at adjustment: minimum 0.50%, maximum 2.50%.
- Extraordinary trim: holdings trimmed if they exceed 5% relative index weight.
- Insolvency handling: component can remain until next adjustment; if no market price is available, trading price is set to zero unless committee removes earlier.

Open methodology items:

- The document has placeholders for index ticker, ISIN, start date, adjustment months, and first adjustment date.
- The body says ordinary adjustment is semiannual, while the definitions section has placeholder language for adjustment days.
- Holdings files strongly suggest semiannual 6/30 and 12/31 backtest snapshots, but the exact official live rebalance calendar still needs confirmation.

Plain-English note on the missing identity fields:

- **Index ticker:** the Bloomberg/Reuters/Solactive symbol visitors could use to identify the index.
- **ISIN:** the formal security/index identifier used in index manuals and data systems.
- **Base date:** the date the index officially starts from.
- **Base value:** the starting level, often 100 or 1,000.
- **Launch date:** when the index was first formally published or made available.

These fields do not block reconstruction from the holdings files, but they matter if we want the public website to say "official EQM Franchise Smart Beta Index" with the same kind of identifiers a fact sheet would show.

## Research Deck Findings

Source: `EQM Index Research Summary 2-12-18.pptx`

- Confirms the franchise screen: U.S. and Canadian franchise names, USD 100 million market cap, USD 3 minimum price, USD 1 million traded value.
- Shows historical screen counts from 2010 through 2017.
- Confirms a seven-year backtest period.
- Confirms semiannual rebalance.
- Confirms rules-based fundamental weighting tests.
- Tested factors/variants include:
  - ROIC.
  - ROIC/WACC ratio.
  - EBITDA margin.
  - Equal weight.
  - Cap weight.
  - Optimized risk/reward.

The results slides appear to use embedded images rather than editable chart data, so the deck confirms variants and framing but is not enough by itself to regenerate an auditable performance series.
