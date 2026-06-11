# Franchise Index Methodology Draft

Working thesis: a strong franchise business can combine local operator incentives, scaled brand demand, recurring royalty economics, and asset-light cash generation. The index should identify public companies where the franchise model is a meaningful source of enterprise value, then weight toward quality, durability, and investability.

This document is a draft. The final website should distinguish between:

- **Official methodology:** rules we are willing to publish and defend.
- **Research variants:** experiments used to evaluate weighting, rebalancing, and factor choices.

## Verified Source Documents

The archive now includes a real methodology file:

- `archive/Methodology-EQM Franchise Smart Beta Index.docx`
- `archive/EQM Index Research Summary 2-12-18.pptx`
- 21 semiannual holdings files from `2007-12-31` through `2017-12-31`

Important verified points:

- Index manual version: 1.1 dated February 16, 2018.
- Index owner: EQM Indexes LLC.
- Index calculator/publisher: Solactive AG.
- Index type: total return.
- Currency: USD.
- Target sector: U.S. franchising sector, consisting primarily of U.S. business format franchises plus select Canadian public companies operating in the U.S.
- Minimum market cap: USD 100 million.
- Minimum price: USD 3 per share.
- Minimum six-month average daily traded value: USD 1 million.
- Official weighting rule in the manual: fundamentally weighted by Bloomberg ROIC/WACC ratio at adjustment.
- Weight cap at adjustment: 0.50% minimum and 2.50% maximum per constituent.
- Extraordinary trim threshold: 5% relative index weight.
- Research deck confirms semiannual rebalancing and tests of ROIC, ROIC/WACC, EBITDA margin, equal weight, cap weight, and optimized risk/reward.

Open items:

- Official ticker, ISIN, base date, and base value are placeholders in the methodology document.
- Exact adjustment months/days are partially placeholder text. Holdings files indicate semiannual snapshots at 6/30 and 12/31 for the historical backtest.

## Objective

Build an investable index of publicly traded franchise-driven businesses and compare its historical performance against the S&P 500.

The public claim should not be "we selected the version that had the best historical chart." The stronger claim is:

> The index applies a rules-based franchise-quality framework to public equities, emphasizing recurring royalty economics, capital-light growth, brand durability, and tradable market exposure.

## Starting Universe

Start from the original 2018 Bloomberg-style franchise screen in `constituents_seed_2018_screen_wo_liquidity.csv`, then rebuild the universe through time with market-data-provider validation.

Eligible securities should generally be:

- Publicly traded common equity or ADRs.
- Companies where franchising, licensing, dealership networks, branded local-unit economics, or royalty-like franchise revenue are central to the business model.
- Sufficiently liquid for index calculation.
- Large enough to avoid microcap distortion.

## Exclusions

Exclude or separately review:

- Companies where the franchise exposure is incidental.
- Companies with stale or non-tradable securities.
- Post-bankruptcy relistings where the new equity is not a clean continuation of the old equity.
- Acquired companies after their transaction close date unless transaction consideration is explicitly modeled.
- Complex spin-offs until successor economics are reconstructed.

## Candidate Factor Framework

The initial scoring model should test these dimensions.

| Dimension | Why It Matters | Candidate Inputs |
| --- | --- | --- |
| Franchise intensity | Measures whether the franchise model is central, not cosmetic. | Franchise locations, franchise percentage of system locations, royalty/franchise revenue share where available |
| Quality economics | Asset-light royalty systems should convert revenue into high-return cash flow. | ROIC, ROIC/WACC, EBITDA margin, FCF margin |
| Durability | Strong systems tend to have brand recognition, geographic breadth, and unit density. | Systemwide locations, years public, category leadership, volatility controls |
| Financial resilience | Franchise economics can still be impaired by leverage or weak liquidity. | Net debt/EBITDA, interest coverage, free cash flow consistency |
| Valuation discipline | Quality can underperform if bought at any price. | FCF yield, EV/EBITDA, earnings yield |
| Investability | The index must be tradable and not dominated by thin names. | Market cap, median dollar volume, free float where available |

## Baseline Official Reconstruction

Current best reconstruction:

1. Universe: franchise-driven U.S. and select Canadian public companies operating in the U.S.
2. Screens: USD 100 million market cap, USD 3 minimum price, USD 1 million six-month average daily traded value.
3. Rebalance: semiannual, with available backtest holdings at 6/30 and 12/31.
4. Weighting: ROIC/WACC ratio from Bloomberg, subject to 0.50% minimum and 2.50% maximum at adjustment.
5. Trim rule: extraordinary adjustment if a position exceeds 5%.
6. Benchmark: S&P 500 total return or SPY adjusted-price proxy for prototype work.
7. Return type: total-return style.

This gives us a defensible official reconstruction track. The research track can still test improved score-weighted variants, but the public "official" chart should start from this source-backed framework.

## Research Variants To Test

These variants should be tested as research, then narrowed before publication:

- Equal-weight franchise universe.
- Market-cap-weighted franchise universe.
- Quality-weighted franchise universe.
- Quality plus valuation guardrail.
- Quality plus momentum guardrail.
- Top 25, top 35, and top 50 constituent versions.
- Quarterly versus semiannual rebalancing.
- Maximum constituent caps of 5%, 7.5%, and 10%.

## Anti-Overfitting Rules

Before publishing a chart, apply these controls:

- Freeze the methodology before selecting the final public performance period.
- Keep a visible split between in-sample research and out-of-sample validation.
- Compare against S&P 500 and at least one consumer discretionary or quality-factor reference.
- Show annualized return, volatility, drawdown, and rolling relative performance, not just a cumulative line.
- Preserve delisted, acquired, and bankrupt names so the backtest avoids survivorship bias.

## Data Requirements

To produce an official-grade performance series, we need:

- Historical constituent universe by rebalance date.
- Corporate-action history for acquired, delisted, spun, merged, or renamed securities.
- Adjusted daily price history, including delisted names.
- Benchmark total-return history.
- Fundamental snapshots available as of each rebalance date, not restated look-ahead values.
- Methodology decisions for weighting, caps, rebalance frequency, and eligibility.

## Website Presentation

The portfolio site should frame this as proof of Alex's edge:

- He read a value-investing thesis and saw a broader investable pattern.
- He translated that pattern into a rules-based index concept.
- He worked with an index provider to refine methodology.
- He is now rebuilding the performance layer with modern data tooling and AI-assisted research workflows.

The chart should include a plain-language caveat: performance is reconstructed from historical market data and methodology files, and the methodology may differ from any live licensed index record unless explicitly verified.
