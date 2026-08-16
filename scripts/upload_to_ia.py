#!/usr/bin/env python3
"""
- Upload each manifest's ACFR PDFs to the Internet Archive
- source "url" is downloaded, "manual" is read from disk, both checked to be a real PDF
- Uploads to item "city-budget-acfr-{id}", writes the public archiveUrl back to the manifest
- Skips years that already have an archiveUrl unless --force

Setup (once):
  pip install -r scripts/requirements.txt
  cp scripts/.env.example scripts/.env    # paste keys from archive.org/account/s3.php

Usage:
  python scripts/upload_to_ia.py manifests/little-elm.json
  python scripts/upload_to_ia.py manifests/little-elm.json --force
  python scripts/upload_to_ia.py manifests/*.json
"""

import argparse
import io
import json
import os
import sys
import time
from pathlib import Path

from curl_cffi import requests
from dotenv import load_dotenv
from internetarchive import upload
from pypdf import PdfReader

# Akamai city sites fingerprint the TLS handshake, not just headers, so plain `requests` 403s
# curl_cffi replays Chrome's real ClientHello
IMPERSONATE = "chrome"


def item_id(city_id):
    return f"city-budget-acfr-{city_id}"


def file_name(city_id, year):
    return f"{city_id}-acfr-FY{year}.pdf"


def download(url):
    try:
        r = requests.get(url, impersonate=IMPERSONATE, timeout=120)
    except requests.errors.RequestsError as e:
        # Broken cert chain (dallascityhall.com), retry once unverified rather than for every host
        if "certificate" not in str(e).lower():
            raise
        r = requests.get(url, impersonate=IMPERSONATE, timeout=120, verify=False)
    r.raise_for_status()
    return r.content


def verify(pdf_bytes):
    """Reject HTML error pages and unreadable files. Returns a reason, or None if ok.

    Wrong-city detection lives in harvest_manifest.py, before a URL reaches a manifest;
    re-checking here only false-negatived on scanned reports. pypdf keeps this pip-only.
    """
    if pdf_bytes[:4] != b"%PDF":
        return f"not a PDF (starts with {pdf_bytes[:16]!r}), likely an HTML error page"
    try:
        PdfReader(io.BytesIO(pdf_bytes))
    except Exception as e:
        return f"unreadable PDF ({e})"
    return None


# IA rejects these permanently, fail fast
FATAL_UPLOAD = ("unacceptable", "syntax error", "access denied", "forbidden", "no such bucket")


def push(city_id, year, pdf_bytes, city_name, source_url):
    """Upload one PDF to the city's IA item; return its public download URL.

    Serial by necessity: IA locks an item's bucket per upload and rate-limits hard, so going
    wide just trades throughput for retries. Transient failures get backoff.
    """
    name = file_name(city_id, year)
    for attempt in range(6):
        try:
            upload(
                item_id(city_id),
                files={name: io.BytesIO(pdf_bytes)},
                access_key=os.environ["IA_ACCESS_KEY"],
                secret_key=os.environ["IA_SECRET_KEY"],
                retries=3,
                retries_sleep=10,
                metadata={
                    "title": f"{city_name} ACFR FY{year}",
                    "mediatype": "texts",
                    "collection": "opensource",
                    "subject": ["ACFR", "Annual Comprehensive Financial Report", "Municipal Finance", "Texas", city_name],
                    "year": str(year),
                    "source": source_url or "manually obtained from city",
                },
            )
            return f"https://archive.org/download/{item_id(city_id)}/{name}"
        except Exception as e:
            msg = str(e).lower()
            if any(f in msg for f in FATAL_UPLOAD) or attempt == 5:
                raise
            time.sleep(min(60, 8 * 2 ** attempt))  # 8,16,32,60,60s backoff


def process(manifest_path, force):
    """Upload every entry in one manifest. Returns the number that failed."""
    manifest = json.loads(Path(manifest_path).read_text())
    city_id, city_name = manifest["id"], manifest["city"]
    base = Path(manifest_path).parent

    def save():  # after every upload, so a Ctrl-C keeps completed years
        Path(manifest_path).write_text(json.dumps(manifest, indent=2) + "\n")

    def handle(pdf):  # True if the entry failed
        tag = f"{city_id} FY{pdf['year']}"
        try:
            if pdf["source"] == "url":
                pdf_bytes, origin = download(pdf["url"]), pdf["url"]
            elif pdf["source"] == "manual":
                path = base.parent / pdf["file"] if not Path(pdf["file"]).is_absolute() else Path(pdf["file"])
                if not path.exists():
                    print(f"  MISS  {tag}: manual file not found at {path}")
                    return True
                pdf_bytes, origin = path.read_bytes(), None
            else:
                print(f"  ERR   {tag}: unknown source {pdf['source']!r} (want 'url'/'manual')")
                return True

            problem = verify(pdf_bytes)
            if problem:
                print(f"  FAIL  {tag}: {problem}")
                return True

            pdf["archiveUrl"] = push(city_id, pdf["year"], pdf_bytes, city_name, origin)
            save()
            print(f"  OK    {tag} -> {pdf['archiveUrl']} ({len(pdf_bytes)//1024} KB)")
            return False
        except Exception as e:  # one bad year shouldn't kill the run
            print(f"  ERR   {tag}: {e}")
            return True

    failures = 0
    for pdf in manifest["pdfs"]:
        if pdf.get("archiveUrl") and not force:
            print(f"  skip  {city_id} FY{pdf['year']} (already uploaded)")
        else:
            failures += handle(pdf)  # serial, one item can't take concurrent uploads

    save()
    print(f"  wrote {manifest_path}")
    return failures


def main():
    ap = argparse.ArgumentParser(description="Fetch ACFR PDFs and upload to Internet Archive.")
    ap.add_argument("manifests", nargs="+", help="path(s) to manifests/{id}.json")
    ap.add_argument("--force", action="store_true", help="re-upload even if archiveUrl is set")
    args = ap.parse_args()

    # scripts/.env first, then the process CWD
    load_dotenv(Path(__file__).parent / ".env")
    load_dotenv()
    missing = [k for k in ("IA_ACCESS_KEY", "IA_SECRET_KEY") if not os.environ.get(k)]
    if missing:
        sys.exit(
            f"Missing {', '.join(missing)}. Copy scripts/.env.example to scripts/.env and "
            f"paste your archive.org S3 keys (archive.org/account/s3.php)."
        )

    # Serial across cities too (see push()), one bad manifest can't kill the others
    failures = 0
    for m in args.manifests:
        print(f"{m}:")
        try:
            failures += process(m, args.force)
        except Exception as e:
            print(f"  ERR   {m}: {e}")
            failures += 1
    if failures:
        print(f"\n{failures} entr{'y' if failures == 1 else 'ies'} failed")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
