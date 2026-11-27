"""Month-end accrual for goods received but not yet invoiced.

    python accrue_receipts.py --month 2026-10

Reads   inputs/<month>/receipts.csv         the month's receiving log, exactly as exported
        inputs/<month>/source_totals.txt   what the receiving system itself reported at the export
Writes  out/<month>/journal.csv             a two-line journal, ready for a person to review
        out/<month>/run_log.json            what was read, what was checked, what it tied to
or it stops, says why in plain words, and writes nothing.

Run it twice on the same files and the output is identical: no clock, no random numbers, no network.
The shop, its suppliers and every amount in the sample files are invented.
"""
from __future__ import annotations

import argparse
import calendar
import csv
import hashlib
import json
import sys
from decimal import ROUND_HALF_UP, Decimal, InvalidOperation
from pathlib import Path

# ---- settings: change a value here, never in the code below ----
DEBIT_ACCOUNT = "Inventory"
CREDIT_ACCOUNT = "Accrued purchases (received, not invoiced)"
COLUMNS = ["receipt_id", "received_on", "supplier", "po_number", "quantity", "unit_cost", "invoiced"]
CENT = Decimal("0.01")


class Stop(Exception):
    """A check failed. The message is written for whoever runs the task, in their words."""


def money(value: Decimal) -> str:
    return f"{value:,.2f}"


def number(text: str, what: str) -> Decimal:
    try:
        return Decimal(text)
    except InvalidOperation:
        raise Stop(f"{what} is not a number: '{text}'.") from None


def read_control(path: Path) -> dict[str, str]:
    if not path.exists():
        raise Stop(f"{path.name} is missing. Record the row count and the uninvoiced total the "
                   "receiving system showed at the export, then re-run.")
    pairs = (line.split("=", 1) for line in path.read_text(encoding="utf-8").splitlines()
             if "=" in line and not line.lstrip().startswith("#"))
    control = {key.strip(): value.strip() for key, value in pairs}
    for key in ("period", "rows", "uninvoiced_total"):
        if key not in control:
            raise Stop(f"{path.name} has no '{key}' line.")
    return control


def read_receipts(path: Path) -> list[dict[str, str]]:
    if not path.exists():
        raise Stop(f"{path.name} is missing. Export the month's receiving log into {path.parent.as_posix()}/.")
    with path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        if reader.fieldnames != COLUMNS:
            raise Stop(f"{path.name} does not have the expected columns. Expected: {', '.join(COLUMNS)}.")
        return list(reader)


# --- checks ---
def check(rows: list[dict[str, str]], control: dict[str, str],
          month: str, label: str) -> Decimal:
    """Every check passes before anything is written. Returns the accrual."""
    if control["period"] != month:
        raise Stop(
            f"source_totals.txt is for {control['period']}, not {month}."
        )

    expected = number(control["rows"], "The row count in source_totals.txt")
    if len(rows) != expected:
        raise Stop(
            f"receipts.csv has {len(rows)} rows, but the receiving system "
            f"reported {control['rows']} for {label}.\n"
            "The export is incomplete or was filtered. "
            "Export the receiving log again and re-run."
        )

    ids = [row["receipt_id"] for row in rows]
    repeated = sorted({i for i in ids if ids.count(i) > 1})
    if repeated:
        raise Stop(
            f"These receipts appear more than once: {', '.join(repeated)}."
            " Find out why before accruing."
        )

    outside = [row["receipt_id"] for row in rows
               if not row["received_on"].startswith(month + "-")]
    if outside:
        raise Stop(
            f"These receipts are dated outside {label}: "
            f"{', '.join(outside)}. "
            "The date filter was not set on the export."
        )

    unclear = [row["receipt_id"] for row in rows
               if row["invoiced"] not in ("Y", "N")]
    if unclear:
        raise Stop(
            "These receipts are not marked Y or N for invoiced: "
            f"{', '.join(unclear)}."
        )

    total = Decimal("0.00")
    for row in rows:
        if row["invoiced"] == "N":
            receipt = f"on receipt {row['receipt_id']}"
            quantity = number(row["quantity"], f"The quantity {receipt}")
            unit_cost = number(row["unit_cost"], f"The unit cost {receipt}")
            total += (quantity * unit_cost).quantize(CENT, ROUND_HALF_UP)

    reported = number(control["uninvoiced_total"],
                      "The uninvoiced total in source_totals.txt")
    if total != reported:
        raise Stop(
            f"Receipts not yet invoiced add up to {money(total)}, but the "
            f"receiving system reported {money(reported)} "
            f"(difference {money(total - reported)}).\n"
            "The file and the control are from different exports, or a line "
            "changed. Export both again and re-run."
        )
    return total
# --- end checks ---


def build_journal(month: str, label: str, total: Decimal) -> list[dict[str, str]]:
    year, month_number = (int(part) for part in month.split("-"))
    last_day = calendar.monthrange(year, month_number)[1]
    shared = {
        "journal_id": f"RNI-{month}",  # the same id on every run, so a re-run cannot post twice
        "date": f"{month}-{last_day:02d}",
        "memo": f"Goods received not invoiced, {label}",
    }
    lines = [
        {**shared, "account": DEBIT_ACCOUNT, "debit": f"{total:.2f}", "credit": ""},
        {**shared, "account": CREDIT_ACCOUNT, "debit": "", "credit": f"{total:.2f}"},
    ]
    debits = sum(Decimal(line["debit"] or "0") for line in lines)
    credits = sum(Decimal(line["credit"] or "0") for line in lines)
    if debits != credits:
        raise Stop(f"The journal is out of balance: debits {money(debits)}, credits {money(credits)}.")
    return lines


def run(month: str, root: Path) -> None:
    try:
        year, month_number = (int(part) for part in month.split("-"))
        calendar.monthrange(year, month_number)
    except ValueError:
        raise Stop(f"'{month}' is not a month. Use YYYY-MM, for example 2026-10.") from None
    label = f"{calendar.month_name[month_number]} {year}"
    source = root / "inputs" / month / "receipts.csv"
    out_dir = root / "out" / month

    # Clear this month's earlier output first, so a stopped run can never leave an old journal behind.
    for name in ("journal.csv", "run_log.json"):
        (out_dir / name).unlink(missing_ok=True)

    control = read_control(source.with_name("source_totals.txt"))
    rows = read_receipts(source)
    total = check(rows, control, month, label)
    lines = build_journal(month, label, total)
    open_receipts = [row["receipt_id"] for row in rows if row["invoiced"] == "N"]

    out_dir.mkdir(parents=True, exist_ok=True)
    with (out_dir / "journal.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(lines[0]), lineterminator="\n")
        writer.writeheader()
        writer.writerows(lines)
    log = {
        "task": "goods received not invoiced",
        "month": month,
        "input": {
            "file": source.name,
            "bytes": source.stat().st_size,
            "sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
            "exported": control.get("pulled", "not recorded"),
        },
        "rows": {"in_file": len(rows), "reported_by_source": int(Decimal(control["rows"]))},
        "uninvoiced_total": {"computed": f"{total:.2f}", "reported_by_source": control["uninvoiced_total"]},
        "receipts_accrued": open_receipts,
        "journal": {"id": lines[0]["journal_id"], "debits": f"{total:.2f}", "credits": f"{total:.2f}"},
        "result": "tied",
        "posted": False,
    }
    (out_dir / "run_log.json").write_text(json.dumps(log, indent=2) + "\n", encoding="utf-8", newline="\n")

    print(f"{label}: receipts.csv has {len(rows)} rows (the receiving system reported {control['rows']}).")
    print(f"{len(open_receipts)} receipts not yet invoiced, total {money(total)} "
          f"(the receiving system reported {money(Decimal(control['uninvoiced_total']))}).")
    print(f"Journal {lines[0]['journal_id']} balances: debits {money(total)}, credits {money(total)}.")
    print(f"Tied. Wrote out/{month}/journal.csv and out/{month}/run_log.json for review. "
          "Nothing has been posted.")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Accrue goods received but not yet invoiced, for one month.")
    parser.add_argument("--month", required=True, help="the month to accrue, as YYYY-MM")
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parent,
                        help="folder holding inputs/ and out/ (default: beside this script)")
    args = parser.parse_args(argv)
    try:
        run(args.month, args.root)
    except Stop as stop:
        print(f"STOPPED. {stop}\nNothing was written.")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
