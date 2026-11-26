import csv
import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from scripts.update_play_installs import update_snapshot


FIELDS = [
    "Date",
    "Package Name",
    "Total User Installs",
    "Daily User Installs",
    "Country",
]


class UpdatePlayInstallsTests(unittest.TestCase):
    def setUp(self):
        self.temporary_directory = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary_directory.name)
        self.source = self.root / "play-installs.csv"
        self.output = self.root / "data" / "play-installs.json"

    def tearDown(self):
        self.temporary_directory.cleanup()

    def write_report(self, rows, encoding="utf-8"):
        with self.source.open("w", encoding=encoding, newline="") as file:
            writer = csv.DictWriter(file, fieldnames=FIELDS)
            writer.writeheader()
            writer.writerows(rows)

    def read_snapshot(self):
        return json.loads(self.output.read_text(encoding="utf-8"))

    def test_uses_latest_cumulative_total_not_daily_installs(self):
        self.write_report(
            [
                {
                    "Date": "2026-11-20",
                    "Package Name": "com.flashtech.flash",
                    "Total User Installs": "1200",
                    "Daily User Installs": "5000",
                    "Country": "",
                },
                {
                    "Date": "2026-11-21",
                    "Package Name": "com.flashtech.flash",
                    "Total User Installs": "1,234",
                    "Daily User Installs": "9000",
                    "Country": "",
                },
            ]
        )

        self.assertTrue(update_snapshot(self.source, self.output))
        self.assertEqual(self.read_snapshot(), {"count": 1234, "reportDate": "2026-11-21"})

    def test_rejects_country_breakdown_without_replacing_snapshot(self):
        original = {"count": 1234, "reportDate": "2026-11-20"}
        self.output.parent.mkdir(parents=True)
        self.output.write_text(json.dumps(original), encoding="utf-8")
        self.write_report(
            [
                {
                    "Date": "2026-11-21",
                    "Package Name": "com.flashtech.flash",
                    "Total User Installs": "1235",
                    "Daily User Installs": "1",
                    "Country": "US",
                }
            ]
        )

        with self.assertRaisesRegex(ValueError, "app-wide"):
            update_snapshot(self.source, self.output)

        self.assertEqual(self.read_snapshot(), original)

    def test_rejects_duplicate_dates(self):
        row = {
            "Date": "2026-11-21",
            "Package Name": "com.flashtech.flash",
            "Total User Installs": "1235",
            "Daily User Installs": "1",
            "Country": "",
        }
        self.write_report([row, row])

        with self.assertRaisesRegex(ValueError, "duplicate totals"):
            update_snapshot(self.source, self.output)

        self.assertFalse(self.output.exists())

    def test_older_export_preserves_published_count_and_date(self):
        original = {"count": 1300, "reportDate": "2026-11-22"}
        self.output.parent.mkdir(parents=True)
        self.output.write_text(json.dumps(original), encoding="utf-8")
        self.write_report(
            [
                {
                    "Date": "2026-11-21",
                    "Package Name": "com.flashtech.flash",
                    "Total User Installs": "1235",
                    "Daily User Installs": "1",
                    "Country": "",
                }
            ]
        )

        with self.assertRaisesRegex(ValueError, "older than the published"):
            update_snapshot(self.source, self.output)

        self.assertEqual(self.read_snapshot(), original)

    def test_utf16_export_is_supported(self):
        self.write_report(
            [
                {
                    "Date": "2026-11-21",
                    "Package Name": "com.flashtech.flash",
                    "Total User Installs": "1235",
                    "Daily User Installs": "1",
                    "Country": "",
                }
            ],
            encoding="utf-16",
        )

        self.assertTrue(update_snapshot(self.source, self.output))
        self.assertEqual(self.read_snapshot(), {"count": 1235, "reportDate": "2026-11-21"})

    def test_identical_snapshot_does_not_change_file(self):
        original = {"count": 1235, "reportDate": "2026-11-21"}
        self.output.parent.mkdir(parents=True)
        self.output.write_text(json.dumps(original) + "\n", encoding="utf-8")
        self.write_report(
            [
                {
                    "Date": "2026-11-21",
                    "Package Name": "com.flashtech.flash",
                    "Total User Installs": "1235",
                    "Daily User Installs": "1",
                    "Country": "",
                }
            ]
        )

        self.assertFalse(update_snapshot(self.source, self.output))
        self.assertEqual(self.read_snapshot(), original)


if __name__ == "__main__":
    unittest.main()