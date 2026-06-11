# Approved-Only Reconstruction Results

Last run: 2026-05-15

## Scope

This is an internal first-pass reconstruction. It uses:

- Bloomberg holdings snapshots from `2007-12-31` through `2017-12-31`.
- Approved rows from `security_master.csv`.
- EODHD adjusted prices.
- SPY adjusted price history as the benchmark proxy.

Important caveat: unresolved securities are excluded and approved weights are renormalized at each rebalance. This is not yet a final official reconstruction.

## Outputs

- `index_reconstruction_approved_only.csv`
- `index_reconstruction_approved_only.json`
- `index_reconstruction_annual_returns.csv`
- `index_reconstruction_annual_returns.json`
- `index_reconstruction_summary.json`
- `unresolved_impact_report.csv`
- `unresolved_impact_report.json`

Regenerate with:

```sh
node scripts/franchise-index/calculate-index-reconstruction.mjs
```

The site-friendly performance series through the current EODHD pull date is generated with:

```sh
node scripts/franchise-index/calculate-index-reconstruction.mjs --through-current
```

That writes:

- `franchise_performance_series.csv`
- `franchise_performance_series.json`
- `franchise_performance_annual_returns.csv`
- `franchise_performance_annual_returns.json`
- `franchise_performance_summary.json`
- `franchise_performance_unresolved_impact.csv`
- `franchise_performance_unresolved_impact.json`

## Summary

| Metric | Approved Franchise Reconstruction | SPY Benchmark |
| --- | ---: | ---: |
| Start date | 2007-12-31 | 2007-12-31 |
| End date | 2017-12-29 | 2017-12-29 |
| Start level | 100.00 | 100.00 |
| End level | 373.12 | 224.97 |
| Total return | 273.1% | 125.0% |
| Annualized return | 14.1% | 8.4% |
| Max drawdown | -58.5% | -52.3% |

Unresolved-security impact:

- Average unresolved weight: 9.20%.
- Maximum unresolved weight: 13.36%.
- Minimum unresolved weight: 4.35%.

## Annual Returns

| Year | Franchise | SPY | Excess |
| --- | ---: | ---: | ---: |
| 2008 | -42.4% | -36.2% | -6.2% |
| 2009 | 79.9% | 22.7% | 57.2% |
| 2010 | 37.1% | 13.1% | 23.9% |
| 2011 | 18.4% | 0.9% | 17.5% |
| 2012 | 17.4% | 14.2% | 3.2% |
| 2013 | 45.3% | 29.0% | 16.3% |
| 2014 | 13.5% | 14.6% | -1.0% |
| 2015 | -9.3% | 1.3% | -10.6% |
| 2016 | 9.9% | 13.6% | -3.6% |
| 2017 | 13.3% | 20.8% | -7.4% |

## Interpretation

The first-pass result is promising: the approved-only franchise basket outperformed SPY by roughly 5.6 percentage points annualized over the tested period.

The result should not be used publicly yet without caveats because the unresolved securities had meaningful weight, especially in the early years. The next quality step is an unresolved-name impact analysis or external data search for the remaining 8 names.

## Performance Series Through 2026

This version extends the practical performance series to `2026-05-15`. It uses approved securities from `security_master.csv`, historical Bloomberg holdings weights through 2017, and the latest reconstructed basket thereafter. Securities without later prices are carried at their last available adjusted price.

| Metric | Franchise Performance Series | SPY Benchmark |
| --- | ---: | ---: |
| Start date | 2007-12-31 | 2007-12-31 |
| End date | 2026-05-15 | 2026-05-15 |
| Start level | 100.00 | 100.00 |
| End level | 628.06 | 707.98 |
| Total return | 528.1% | 608.0% |
| Annualized return | 10.5% | 11.2% |
| Max drawdown | -58.5% | -52.3% |

Interpretation:

- The franchise series strongly outperformed during the original 2007-2017 reconstruction window.
- SPY overtakes the carried-forward franchise basket over the longer 2007-2026 window.
- The site should show both the strong original reconstruction and the longer practical performance view, because together they tell a more honest and more interesting story.
