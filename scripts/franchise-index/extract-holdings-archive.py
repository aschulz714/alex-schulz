from __future__ import annotations

import csv
import json
import re
from pathlib import Path

try:
    import xlrd
except ImportError as error:
    raise SystemExit(
        "This extractor requires xlrd for legacy .xls files. "
        "Install xlrd or run with Alex's Anaconda Python environment."
    ) from error


ROOT = Path(__file__).resolve().parents[2]
ARCHIVE_DIR = ROOT / "data-sources" / "franchise-index" / "archive"
HOLDINGS_OUTPUT_CSV = ROOT / "data-sources" / "franchise-index" / "holdings_snapshots.csv"
HOLDINGS_OUTPUT_JSON = ROOT / "data-sources" / "franchise-index" / "holdings_snapshots.json"
EXCEPTIONS_OUTPUT_CSV = ROOT / "data-sources" / "franchise-index" / "holdings_exceptions.csv"
EXCEPTIONS_OUTPUT_JSON = ROOT / "data-sources" / "franchise-index" / "holdings_exceptions.json"


def clean(value):
    if isinstance(value, str):
        return value.strip()
    if isinstance(value, float) and value.is_integer():
        return int(value)
    return value


def clean_row(row):
    return [clean(value) for value in row]


def normalize_ticker(raw_ticker):
    ticker = str(raw_ticker or "").strip()
    ticker = re.sub(r"\s+US(?:\s+Equity)?$", "", ticker, flags=re.IGNORECASE)
    ticker = re.sub(r"\s+Equity$", "", ticker, flags=re.IGNORECASE)
    return ticker.strip()


def snapshot_label_from_filename(path):
    match = re.search(r"Holdings\s+([0-9]{2})-([0-9]{2})-([0-9]{2})", path.name)
    if not match:
        return ""

    month, day, year = match.groups()
    return f"20{year}-{month}-{day}"


def find_as_of_date(sheet):
    for row_index in range(sheet.nrows):
        row = clean_row(sheet.row_values(row_index))
        for column_index, value in enumerate(row):
            if str(value).strip().lower() == "as-of date" and column_index + 1 < len(row):
                return str(row[column_index + 1]).strip()
    return ""


def find_header_row(sheet, expected):
    for row_index in range(sheet.nrows):
        row = [str(value).strip().lower() for value in sheet.row_values(row_index)]
        if expected.lower() in row:
            return row_index
    return -1


def parse_holdings_sheet(path, sheet):
    header_row = find_header_row(sheet, "Ticker")
    if header_row < 0:
        return []

    summary_row = clean_row(sheet.row_values(header_row + 1))
    index_name = str(summary_row[0]).strip()
    reported_instruments = summary_row[2] if len(summary_row) > 2 else ""
    reported_weight = summary_row[4] if len(summary_row) > 4 else ""
    reported_market_value = summary_row[5] if len(summary_row) > 5 else ""
    as_of_date = find_as_of_date(sheet)
    snapshot_label = snapshot_label_from_filename(path)
    rows = []

    for row_index in range(header_row + 2, sheet.nrows):
        row = clean_row(sheet.row_values(row_index))
        if len(row) < 9:
            continue

        security_name = str(row[1]).strip()
        raw_ticker = str(row[3]).strip()
        if not security_name or not raw_ticker:
            continue

        if raw_ticker.lower() == "ticker":
            continue

        rows.append(
            {
                "snapshot_file": path.name,
                "snapshot_label": snapshot_label,
                "as_of_date": as_of_date,
                "index_name": index_name,
                "reported_instruments": reported_instruments,
                "reported_weight_pct": reported_weight,
                "reported_market_value": reported_market_value,
                "security_name": security_name,
                "ticker_raw": raw_ticker,
                "ticker": normalize_ticker(raw_ticker),
                "weight_pct": row[4],
                "market_value": row[5],
                "position": row[6],
                "closing_price": row[7],
                "currency": row[8],
            }
        )

    return rows


def parse_exceptions_sheet(path, sheet):
    header_row = find_header_row(sheet, "Identifier")
    if header_row < 0:
        return []

    as_of_date = find_as_of_date(sheet)
    snapshot_label = snapshot_label_from_filename(path)
    rows = []

    for row_index in range(header_row + 1, sheet.nrows):
        row = clean_row(sheet.row_values(row_index))
        if len(row) < 4:
            continue

        identifier = str(row[0]).strip()
        if not identifier:
            continue

        rows.append(
            {
                "snapshot_file": path.name,
                "snapshot_label": snapshot_label,
                "as_of_date": as_of_date,
                "identifier_raw": identifier,
                "ticker": normalize_ticker(identifier),
                "security_name": str(row[1]).strip(),
                "reason": str(row[2]).strip(),
                "source": str(row[3]).strip(),
            }
        )

    return rows


def write_csv(path, rows):
    path.parent.mkdir(parents=True, exist_ok=True)
    if not rows:
        path.write_text("", encoding="utf-8")
        return

    fieldnames = list(rows[0].keys())
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def write_json(path, rows):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(rows, indent=2) + "\n", encoding="utf-8")


holdings_rows = []
exception_rows = []

for workbook_path in sorted(ARCHIVE_DIR.glob("Holdings *.xls")):
    workbook = xlrd.open_workbook(str(workbook_path))

    if "Holdings" in workbook.sheet_names():
        holdings_rows.extend(parse_holdings_sheet(workbook_path, workbook.sheet_by_name("Holdings")))

    if "Exceptions - Holdings" in workbook.sheet_names():
        exception_rows.extend(
            parse_exceptions_sheet(workbook_path, workbook.sheet_by_name("Exceptions - Holdings"))
        )

write_csv(HOLDINGS_OUTPUT_CSV, holdings_rows)
write_json(HOLDINGS_OUTPUT_JSON, holdings_rows)
write_csv(EXCEPTIONS_OUTPUT_CSV, exception_rows)
write_json(EXCEPTIONS_OUTPUT_JSON, exception_rows)

print(f"Wrote {len(holdings_rows)} holding rows to {HOLDINGS_OUTPUT_CSV}")
print(f"Wrote {len(exception_rows)} exception rows to {EXCEPTIONS_OUTPUT_CSV}")
