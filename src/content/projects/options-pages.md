---
title: Options Pages
blurb: A Value Line for the options market — every optionable US company, its full option chain snapshotted nightly through the Schwab API, realized and implied volatility side by side with point-in-time fundamentals, run as a monitored pipeline on a home PC. Personal, not a product.
description: A personal catalog of every US-listed optionable company with each name's options-market profile, implied and realized volatility, skew, term structure, liquidity, open interest, next to XBRL fundamentals and quality scores, built from nightly full-chain snapshots via the Schwab Trader API and held to the same controls as a close process.
category: data-systems
projectType: data-system
year: 2026
plate: 8
figure:
  src: figures/options-pages.jpg
  alt: Scatter plot of every optionable US company, 30-day implied volatility against 60-day realized volatility on log axes, colored by liquidity tier, with a dashed line where implied equals realized
  caption: "The whole universe on one chart. Most names sit above the line: options imply more movement than the stock has delivered. Tier A is the deep, tight-spread end of the market."
  ratio: '2358/1306'
  source: catalog.csv from the 2026-09-23 nightly snapshot, 3,658 names with both measures
tech:
  - Python
  - Schwab Trader API
  - SQLite
  - SEC EDGAR + XBRL companyfacts
  - Cloudflare R2 archive
  - Windows Task Scheduler
status: Running nightly since August 2026; personal only
role: Designer, builder, and the reviewer who ruled on the accounting edge cases
scale:
  - 5,450 instruments from the Cboe optionable list; 3,778 companies in the catalog
  - 85,085 full-chain snapshots across 23 trading days, 1.9 million daily closes
  - 10,562 fiscal-year fundamentals rows and 3,614 scored companies, no LLM anywhere
proof:
  - Every chain archived gzipped to object storage; a failed upload is kept locally and flagged, never dropped
  - Open interest captured during market hours after the evening chain was found to zero untraded contracts
  - Universe reconciled weekly against a second source; deletions require evidence
  - Health check alerts on the absence of success, with an off-machine dead man's switch
artifact:
  label: Nightly catalog + archive
  detail: A SQLite catalog, a dated CSV per night, a gzipped chain archive, versioned pre-registered screens with outcome logging, and a paper journal that freezes the catalog row at entry.
caseStudy:
  question: What does the entire optionable universe look like at once, name by name, before choosing any strategy, and can that survey be collected reliably enough to score a year later?
  data: The Cboe optionable-symbol directory, Schwab instrument fundamentals, full option chains and 400 days of closes per name, SEC EDGAR filings and XBRL company facts.
  method: Build the universe weekly, snapshot every chain nightly after the close, compute realized vol and chain metrics, capture open interest at midday, join point-in-time fundamentals and quality scores, run versioned screens, log outcomes, and monitor for silence as well as failure.
  signal: Across 3,658 names, the median 30-day implied volatility is 50 percent against a median 60-day realized of 43, and nearly two-thirds of names carry implied above realized. Survey first, then strategy.
  why: It is the accounting close applied to market data. Idempotent steps, reconciliations, evidence for every change, and a review that rules on edge cases and writes the ruling down.
featured: false
---

## The idea

Value Line's discipline was one page per company, the same fields for everyone, updated on a schedule. This applies that to the options market. Every US-listed optionable company gets an options-market profile, implied volatility at the front, 30 and 90 days, term slope, 25-delta skew, realized volatility at 20, 60, and 252 days, liquidity tier, open interest, earnings moves, LEAPS availability, next to point-in-time fundamentals and quality scores. The point is to see the whole universe before picking a strategy.

## The pipeline

The universe is rebuilt weekly from the Cboe optionable list and Schwab's instrument data, then reconciled against a second source, with any retirement or addition shown with its evidence before it is written. Every weekday after the close a nightly job snapshots the full option chain and price history for each of roughly 3,700 companies, computes realized volatility and chain metrics, refreshes the catalog, runs the screens, writes a dated CSV, backs up the database, and reports. A midday job captures open interest during market hours, because the evening chain was found to zero every contract that did not trade that day. Every chain is archived gzipped, about 100 to 150 megabytes a day for the universe, at a cost of well under a dollar a month.

## Fundamentals without a language model

Point-in-time fundamentals come from SEC XBRL company facts: twenty standardized annual line items for the last three fiscal years, each value carrying the tag it came from or the rule that derived it. Piotroski, Altman, Magic Formula, Beneish, and Sloan scores are computed from those, with a null and a reason whenever an input is missing. Foreign filers and financials are marked not applicable rather than scored badly. The edge cases were hand-checked against the 10-Ks and ruled on in writing, including a strict reading of Piotroski's leverage test and an implied-zero rule for companies with a complete balance sheet and no debt tag.

## Controls

The job is designed to fail loudly and, more importantly, to notice when it did not run. A laptop asleep at run time produces silence, not an error, so a separate health check runs every morning, at logon, and whenever the network reconnects. It verifies the token age, the last run, the expected snapshot count, the archive, and the backup, and raises a persistent alert on any shortfall. Long jobs hold a run lock so a weekly OAuth login cannot kill a running snapshot. Both scheduled tasks consult a market calendar. Screens are versioned, and a logged version is never edited, so a year of hits can be scored honestly.

## What is not here

This is personal trading infrastructure and not investment advice. No positions, screens, or journal entries are shown. The chart is the universe as of one nightly snapshot, nothing more.
