#!/usr/bin/env python3
import argparse
import csv
import json
import re
import sys
from datetime import date
from pathlib import Path

PACKAGE = "com.flashtech.flash"
MAX_SAFE_INTEGER = 2**53 - 1
REQUIRED_COLUMNS = {"Date", "Package Name", "Total User Installs"}
DIMENSION_COLUMNS = {
    "app version",
    "carrier",
    "country",
    "country code",
    "device",
    "device model",
    "device type",
    "form factor",
    "language",
    "os version",
    "android version",
}
DATE_PATTERN = re.compile(r"^\d{4}-\d{2}-\d{2}$")
COUNT_PATTERN = re.compile(r"^(?:\d+|[1-9]\d{0,2}(?:,\d{3})+)$")


def parse_report(source: Path) -> dict:
    with source.open("rb") as file:
        has_utf16_bom = file.read(2) in (b"\xff\xfe", b"\xfe\xff")

    encoding = "utf-16" if has_utf16_bom else "utf-8-sig"
    totals = {}
    with source.open(encoding=encoding, newline="") as file:
        reader = csv.DictReader(file)
        if reader.fieldnames is None:
            raise ValueError("Export has no CSV header")

        reader.fieldnames = [name.strip() if name is not None else name for name in reader.fieldnames]
        missing_columns = REQUIRED_COLUMNS.difference(reader.fieldnames)
        if missing_columns:
            raise ValueError("Export is missing required install-total columns")

        dimension_headers = {
            name for name in reader.fieldnames if name.casefold() in DIMENSION_COLUMNS
        }
        for row in reader:
            if row.get("Package Name", "").strip() != PACKAGE:
                continue

            populated_dimensions = [
                name for name in dimension_headers if (row.get(name) or "").strip()
            ]
            if populated_dimensions:
                raise ValueError("Expected an app-wide export; a breakdown dimension is populated")

            report_date_text = (row.get("Date") or "").strip()
            if not DATE_PATTERN.fullmatch(report_date_text):
                raise ValueError("Export contains an invalid report date")
            report_date = date.fromisoformat(report_date_text)

            count_text = (row.get("Total User Installs") or "").strip()
            if not COUNT_PATTERN.fullmatch(count_text):
                raise ValueError("Export contains an invalid Total User Installs value")
            count = int(count_text.replace(",", ""))
            if count > MAX_SAFE_INTEGER:
                raise ValueError("Total User Installs exceeds the safe published integer range")
            if report_date in totals:
                raise ValueError(f"Export contains duplicate totals for {report_date.isoformat()}")

            totals[report_date] = count

    if not totals:
        raise ValueError(f"No install totals found for {PACKAGE}")

    latest = max(totals)
    return {"count": totals[latest], "reportDate": latest.isoformat()}


def update_snapshot(source: Path, output: Path) -> bool:
    snapshot = parse_report(source)

    if output.exists():
        try:
            published = json.loads(output.read_text(encoding="utf-8"))
            published_date_text = published["reportDate"]
            if not isinstance(published_date_text, str) or not DATE_PATTERN.fullmatch(published_date_text):
                raise ValueError
            published_date = date.fromisoformat(published_date_text)
        except (json.JSONDecodeError, KeyError, TypeError, ValueError) as error:
            raise ValueError("Published install snapshot is invalid; refusing to replace it") from error

        if date.fromisoformat(snapshot["reportDate"]) < published_date:
            raise ValueError("Export is older than the published snapshot")
        if published == snapshot:
            return False

    output.parent.mkdir(parents=True, exist_ok=True)
    temporary = output.with_name(f"{output.name}.tmp")
    try:
        temporary.write_text(json.dumps(snapshot) + "\n", encoding="utf-8")
        temporary.replace(output)
    finally:
        temporary.unlink(missing_ok=True)
    return True


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path, help="Authenticated Play Console CSV export")
    parser.add_argument(
        "--output",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "data" / "play-installs.json",
    )
    args = parser.parse_args()

    try:
        changed = update_snapshot(args.source, args.output)
    except (OSError, UnicodeError, csv.Error, ValueError) as error:
        print(f"Play install refresh rejected: {error}", file=sys.stderr)
        return 1

    print("Play install snapshot updated." if changed else "Play install snapshot unchanged.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())