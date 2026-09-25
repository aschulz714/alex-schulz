---
title: North Kai Franchise Index
blurb: A refranchising thesis turned into a licensable equity index with EQM Indexes in 2018, then rebuilt in 2026 from the original holdings files so the record could be checked.
description: A rules-based index of publicly traded franchise-driven companies, developed with EQM Indexes and calculated by Solactive, and a 2026 reconstruction of its backtest against the S&P 500 from the original semiannual holdings.
category: data-systems
projectType: research
year: 2018
plate: 6
figure:
  src: figures/north-kai-index.jpg
  alt: Line chart of the reconstructed franchise index against SPY from 2007 to 2026, with a marker where the historical holdings end in December 2017
  caption: Reconstructed index level versus SPY, base 100 at the end of 2007. Left of the marker uses the 21 historical holdings snapshots; right of it carries the last basket forward, so it is a reference line, not a track record.
  ratio: '2400/1050'
  source: EQM holdings snapshots 2007–2017, EODHD adjusted prices, SPY as benchmark
tech:
  - Index methodology
  - Bloomberg holdings snapshots
  - EODHD price history
  - Node.js reconstruction scripts
  - Security-master reconciliation
status: Methodology 2018, rebuilt 2026
role: Founder of North Kai Capital; methodology co-developer; reconstruction author
scale:
  - 21 semiannual holdings snapshots, December 2007 through December 2017
  - 4,623 daily observations in the reconstructed series through May 2026
  - Unresolved securities averaged 9% of weight; every one is listed, not hidden
proof:
  - Index manual v1.1 dated February 16, 2018; owner EQM Indexes LLC; calculator Solactive AG
  - Security master with approved, manual-review, and override files for every constituent
  - Approved-only reconstruction with renormalized weights and an unresolved-impact report
  - Annual returns published for both the backtest window and the frozen-basket extension
artifact:
  label: Index methodology + reconstruction
  detail: A published franchise-company index methodology and an auditable rebuild of its history against SPY, with the gaps in the record quantified rather than smoothed over.
caseStudy:
  question: Can a basket of public franchise businesses capture the asset-light, royalty-driven economics that a refranchising thesis describes, and can that history be rebuilt honestly years later?
  data: The 2018 franchise screen, 21 semiannual Bloomberg holdings files, the EQM methodology document, EODHD adjusted prices, and SPY as the benchmark.
  method: Reconcile every historical holding to a current security, mark the ones that cannot be priced as unresolved, renormalize the approved weights at each rebalance, and compute the index level and annual returns beside SPY.
  signal: In the 2008 to 2017 backtest window the reconstruction returned 14.1 percent a year against 8.4 percent for SPY. Carried forward with a frozen basket, it trails SPY through 2026. Both facts are on the chart.
  why: Building the index was the first product. Rebuilding it with the unresolved weight reported is the accounting habit applied to my own work.
featured: false
---

## The thesis

A winning Value Investing Congress writeup on Jack in the Box framed refranchising as a way to turn operating complexity into royalty economics. The obvious follow-up question was whether a basket of public franchise businesses could hold that pattern as an index. The category had academic evidence and an industry logic, but nobody had packaged it into something an ETF could license.

## The build

An introduction from an ETF founder led to EQM Indexes, and the personal thesis became a formal methodology. The published manual, version 1.1 dated February 16, 2018, defines the universe as U.S. business-format franchisors plus select Canadian companies operating in the U.S., with a minimum market capitalization of 100 million dollars, a minimum share price of 3 dollars, and a minimum six-month average daily traded value of 1 million dollars. Constituents are fundamentally weighted by ROIC over WACC at each semiannual adjustment, capped between 0.5 and 2.5 percent, with a 5 percent extraordinary trim. Solactive calculated it as a total-return index in dollars.

## The reconstruction

In 2026 I rebuilt the history from the original files rather than trusting the 2018 deck. Every holding in the 21 semiannual snapshots was reconciled to a security that can be priced today. The ones that cannot are carried as unresolved and their weight is reported at every rebalance: 9 percent on average, 13.4 percent at worst, in the first snapshot.

| Window | Franchise | SPY |
|---|---|---|
| Dec 2007 to Dec 2017, total return | 273% | 125% |
| Dec 2007 to Dec 2017, annualized | 14.1% | 8.4% |
| Max drawdown in the window | -58.5% | -52.3% |
| Dec 2007 to May 2026, annualized (frozen basket after 2017) | 10.5% | 11.2% |

The outperformance is concentrated in 2009 through 2013. From 2014 on, the basket trails the benchmark in most years, and after December 2017 there are no new holdings files, so the extension simply carries the last basket forward at its last known weights. That line is on the chart because leaving it off would be the more flattering choice.

## Limits

This is an approved-only, first-pass reconstruction, not an official index calculation. Unresolved securities are excluded and weights renormalized, which biases the result in an unknown direction. The methodology's official ticker, base date, and adjustment days were placeholders in the manual. Nothing here is investment advice, and the frozen-basket extension is not a track record.
