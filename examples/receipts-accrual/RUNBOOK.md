# Runbook: goods received, not invoiced

**Purpose:** build the month-end journal for goods the shop has received but has not been billed for.

**Timing:** once the receiving log is closed for the month.

**Sample data:** the shop, its suppliers and every amount in this folder are invented.

## Before you run it

Put two files in `inputs/YYYY-MM/`.

| File | Source |
|---|---|
| `receipts.csv` | The receiving log, filtered to the month, exported as CSV. |
| `source_totals.txt` | Typed at the moment of the export: the row count and the uninvoiced total shown on the receiving system's screen. |

## Run it

    python accrue_receipts.py --month YYYY-MM

## A good run

- The final line printed begins with `Tied.`
- `out/YYYY-MM/` holds `journal.csv` (two lines that balance) and `run_log.json` (what was read and what it tied to).

## After the run (a person does these)

1. Compare the journal with the receiving log: the number of open receipts and their total.
2. Post it in the ledger yourself. The script never posts.
3. Keep the two inputs, the journal and the run log with the month's support.

## When it stops

- **"has N rows, but the receiving system reported M"**: the export is short or was filtered. Export again.
- **"add up to X, but the receiving system reported Y"**: the file and the totals are from different exports, or a line changed. Export both again.
- **"appear more than once"**: a receipt was entered twice. Find out why before accruing.
- **"dated outside"**: the date filter was not set on the export.
- Anything else: stop and ask. A stopped run is the script doing its job, so don't book around it.

A stopped run writes nothing, and it removes any journal an earlier run left for that month.

## Test the script

    python -m unittest test_accrue_receipts -v

Seven tests: the sample month ties, two runs give identical files, and five kinds of bad input are refused.
