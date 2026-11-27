# Goods received, not invoiced: a script that ties out or stops

The worked example from the [method page](https://aschulz714.github.io/alex-schulz/method/) of this site.
One Python file, standard library only. The shop, its suppliers and every amount are invented.

| Path | What it is |
|---|---|
| `accrue_receipts.py` | The script. One command, one month. |
| `inputs/2026-10/` | The sample month: the receiving log, and what the receiving system reported at the export. |
| `out/2026-10/` | What the run wrote: a two-line journal and a run log. |
| `evidence/` | What the script printed for the sample month, and for the same file with one row removed. |
| `test_accrue_receipts.py` | Seven tests: the sample ties, two runs match byte for byte, five kinds of bad input are refused. |
| `RUNBOOK.md` | How a person runs it, and what to do when it stops. |

    python accrue_receipts.py --month 2026-10
    python -m unittest test_accrue_receipts -v

Needs Python 3.10 or later.
