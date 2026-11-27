"""Checks on accrue_receipts.py. Standard library only.

    python -m unittest test_accrue_receipts -v

Each test copies the sample month to a temporary folder, changes one thing, and runs the script
the way a person would. The two files in evidence/ are compared with what the script prints
today, so the output shown on the method page cannot drift from the code.
"""
from __future__ import annotations

import contextlib
import io
import shutil
import tempfile
import unittest
from pathlib import Path

import accrue_receipts

HERE = Path(__file__).resolve().parent
MONTH = "2026-10"


def run_in(root: Path) -> tuple[int, str]:
    printed = io.StringIO()
    with contextlib.redirect_stdout(printed):
        code = accrue_receipts.main(["--month", MONTH, "--root", str(root)])
    return code, printed.getvalue()


class AccrueReceipts(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        shutil.copytree(HERE / "inputs", self.root / "inputs")
        self.receipts = self.root / "inputs" / MONTH / "receipts.csv"
        self.out = self.root / "out" / MONTH

    def tearDown(self) -> None:
        self.tmp.cleanup()

    def change(self, old: str, new: str) -> None:
        text = self.receipts.read_text(encoding="utf-8")
        self.assertEqual(text.count(old), 1)
        self.receipts.write_bytes(text.replace(old, new).encode("utf-8"))

    def assert_stopped(self, code: int, printed: str, phrase: str) -> None:
        self.assertEqual(code, 1)
        self.assertIn(phrase, printed)
        self.assertTrue(printed.endswith("Nothing was written.\n"))
        self.assertFalse((self.out / "journal.csv").exists())
        self.assertFalse((self.out / "run_log.json").exists())

    def test_sample_month_ties_and_matches_the_saved_run(self) -> None:
        code, printed = run_in(self.root)
        self.assertEqual(code, 0)
        self.assertEqual(printed, (HERE / "evidence" / "run-ok.txt").read_text(encoding="utf-8"))
        for name in ("journal.csv", "run_log.json"):
            self.assertEqual((self.out / name).read_bytes(), (HERE / "out" / MONTH / name).read_bytes(), name)

    def test_two_runs_give_identical_files(self) -> None:
        run_in(self.root)
        first = {name: (self.out / name).read_bytes() for name in ("journal.csv", "run_log.json")}
        code, _ = run_in(self.root)
        self.assertEqual(code, 0)
        for name, content in first.items():
            self.assertEqual((self.out / name).read_bytes(), content, name)

    def test_truncated_file_is_refused(self) -> None:
        lines = self.receipts.read_text(encoding="utf-8").splitlines(keepends=True)
        self.receipts.write_bytes("".join(lines[:-1]).encode("utf-8"))
        code, printed = run_in(self.root)
        self.assert_stopped(code, printed, "has 11 rows, but the receiving system reported 12")
        self.assertEqual(printed, (HERE / "evidence" / "run-stopped.txt").read_text(encoding="utf-8"))

    def test_changed_amount_is_refused(self) -> None:
        self.change("R-1006,2026-10-15,Supplier C,PO-4430,48,121.50,N", "R-1006,2026-10-15,Supplier C,PO-4430,48,112.50,N")
        code, printed = run_in(self.root)
        self.assert_stopped(code, printed, "add up to 9,530.00, but the receiving system reported 9,962.00")

    def test_repeated_receipt_is_refused(self) -> None:
        self.change("R-1005,", "R-1004,")
        code, printed = run_in(self.root)
        self.assert_stopped(code, printed, "appear more than once: R-1004")

    def test_receipt_from_another_month_is_refused(self) -> None:
        self.change("R-1012,2026-10-30", "R-1012,2026-11-01")
        code, printed = run_in(self.root)
        self.assert_stopped(code, printed, "dated outside October 2026: R-1012")

    def test_a_stopped_run_removes_an_earlier_journal(self) -> None:
        code, _ = run_in(self.root)
        self.assertEqual(code, 0)
        self.assertTrue((self.out / "journal.csv").exists())
        self.change("R-1012,2026-10-30,Supplier A,PO-4451,600,0.85,N", "R-1012,2026-10-30,Supplier A,PO-4451,six hundred,0.85,N")
        code, printed = run_in(self.root)
        self.assert_stopped(code, printed, "The quantity on receipt R-1012 is not a number")


if __name__ == "__main__":
    unittest.main()
