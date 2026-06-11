# Security Master Cleanup Notes

Last run: 2026-05-15

## Result

The manual-review pass reduced the security master queue from 17 names to 8 names.

Current security master:

- 83 historical tickers.
- 75 approved for reconstruction.
- 8 still requiring manual review.

Validation grades:

- `pass_exact`: 68
- `pass_minor_difference`: 7
- `manual_override_accepted`: 1
- `review`: 7

## Overrides Added

Overrides live in `security_master_overrides.json`.

Fixed by better EODHD old-symbol mappings:

| Seed Ticker | Corrected EODHD Symbol | Note |
| --- | --- | --- |
| CSH | `CSH_old.US` | Old Cash America, not reused/current CSH. |
| FRSH | `FRSH_old.US` | Old Papa Murphy's, not Freshworks. |
| HTZ | `HTZ_old.US` | Old Hertz pre-bankruptcy history; do not splice into current HTZ. |
| RSHCQ | `RSH.US` | RadioShack / RS Legacy pre-bankruptcy history. |
| SERV | `SERV_old.US` | Old ServiceMaster, not Serve Robotics. |
| TAX | `TAXA.US` | Old Liberty Tax, not Cambria Tax Aware ETF. |
| MTY CN | `MTY.TO` | Canadian MTY listing. |
| THI CN | `THI.TO` | Canadian Tim Hortons listing. |

Accepted with explicit caveat:

| Seed Ticker | EODHD Symbol | Note |
| --- | --- | --- |
| BH | `BH.US` | Bloomberg holdings prices are consistently 1.5x EODHD closes. Daily returns are still usable, but do not use EODHD close prices to recompute historical share counts. |

## Remaining Review Queue

| Seed Ticker | Issue | Current Treatment |
| --- | --- | --- |
| AAN | `AAN_old.US` validates from 2009 onward, but does not cover early 2007-2008 holdings snapshots. | Partial price history; external data needed for early period or use a documented fallback. |
| BAGL | EODHD identifies `BAGL.US`, but returns zero rows. | External price history needed. |
| BLIAQ | EODHD history starts after the 2007-2017 holdings snapshots. | Bankruptcy/liquidation treatment or external data needed. |
| CKR | EODHD `CKR.US` fails holdings-price validation after 2007. | External price history needed. |
| DTGF | Correct old Dollar Thrifty 2007-2012 series not found. `DTG`/`DTG_old` are reused or unrelated later tickers. | External price history needed. |
| FRS | EODHD `FRS.US` fails holdings-price validation. | External price history needed. |
| MDS | EODHD `MDS.US` fails holdings-price validation. | External price history needed. |
| WTW | Old Weight Watchers conflicts with Willis Towers Watson in EODHD. `WW`/`WGHTQ` do not provide the required 2007-2017 history. | External price history needed. |

## Next Calculator Rule

The first index calculator should only use rows with `mapping_status = approved_for_reconstruction`.

For the 8 review names, choose one of these before publishing:

1. Source missing daily data from another provider.
2. Use a documented fallback based on available holdings snapshots, only if methodologically defensible.
3. Exclude from the reconstructed series and clearly label the impact.

Option 1 is best. Option 3 is acceptable for an internal prototype but weak for a public "official reconstruction" claim.
