# EODHD Validation Results

Last run: 2026-05-15

## 10-Name Validation Basket

Command:

```sh
node scripts/franchise-index/fetch-price-history.mjs --provider=eodhd --symbols=MCD,YUM,WEN,MAR,DNKN,SONC,BWLD,TACO,GNC,BLIAQ --start=2007-12-31 --end=2026-05-15
node scripts/franchise-index/resolve-eodhd-symbols.mjs --symbols=TACO,BLIAQ,DNKN,SONC,BWLD,GNC
node scripts/franchise-index/fetch-price-history.mjs --provider=eodhd --symbols=TACO_old2.US,BLIAQ.US,DNKN.US,SONC.US,BWLD.US,GNC.US --start=2007-12-31 --end=2026-05-15
node scripts/franchise-index/validate-price-history.mjs --provider=eodhd --symbols=MCD,YUM,WEN,MAR,DNKN,SONC,BWLD,TACO,GNC,BLIAQ
```

Result:

| Seed Ticker | EODHD Symbol | Status | Comparable Snapshots | Max Close Difference vs Holdings |
| --- | --- | --- | ---: | ---: |
| MCD | MCD | Validated | 21 | 0.000% |
| YUM | YUM | Validated | 21 | 0.000% |
| WEN | WEN | Validated | 21 | 1.961% |
| MAR | MAR | Validated | 21 | 0.020% |
| DNKN | DNKN.US | Validated | 12 | 0.000% |
| SONC | SONC.US | Validated | 21 | 0.069% |
| BWLD | BWLD.US | Validated | 21 | 0.081% |
| TACO | TACO_old2.US | Validated | 8 | 0.000% |
| GNC | GNC.US | Validated | 14 | 0.000% |
| BLIAQ | BLIAQ.US | Needs review | 0 | n/a |

Takeaway: EODHD passed the practical validation test for active names, acquired names, and most delisted names. The important discovery is that ticker reuse must be handled through the EODHD delisted symbol list. For example, old Del Taco is `TACO_old2.US`, while current `TACO.US` is a different company.

## Full 83-Ticker Resolution

Command:

```sh
node scripts/franchise-index/resolve-eodhd-symbols.mjs
```

Result:

- 79 of 83 historical tickers received an initial EODHD match.
- 4 had no immediate U.S. symbol-list match: `DTGF`, `MTY CN`, `RSHCQ`, `THI CN`.
- Several matched tickers require manual override/review because ticker reuse or provider naming created false positives.

After pulling all resolved EODHD symbols and validating against the holdings archive:

- 83 historical tickers were written to `security_master.csv`.
- 66 are currently approved for reconstruction.
- 17 require manual review.
- Validation grades:
  - `pass_exact`: 59
  - `pass_minor_difference`: 7
  - `review`: 17

Priority manual-review examples:

- `CSH`: old Cash America resolved to a current/other listed fund unless overridden.
- `FRSH`: old Papa Murphy's resolved to Freshworks unless overridden.
- `JACK`: old Jack in the Box match has a suspicious provider name and needs validation against holdings prices.
- `SERV`: old ServiceMaster resolved to Serve Robotics unless overridden.
- `TAX`: old Liberty Tax resolved to Cambria Tax Aware ETF unless overridden.
- `WTW`: old Weight Watchers resolved to Willis Towers Watson unless overridden.
- `AAN`: needs review because old Aaron's history and later corporate actions are complex.

## Decision

EODHD is good enough to continue as the practical production data provider candidate.

Before publishing reconstructed performance, build a formal security master that stores:

- Seed ticker and company name.
- EODHD resolved symbol.
- Whether the mapping was automatic or manually approved.
- First and last available price date.
- Corporate-action treatment.
- Validation result against Bloomberg holdings snapshots.
