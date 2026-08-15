#!/usr/bin/env python3
"""
- Harvest a city's ACFR/AFR PDF URLs into manifests/{id}.json
- Verifies each pdf candidate for years that don't already have an archiveUrl
- curl_cffi impersonate=chrome beats Akamai TLS fingerprinting, retries unverified on a bad cert
- JS-rendered lists have no links in raw HTML, read them in a browser, pass via --urls

Usage (pick one source mode):
  --page    https://city.gov/finance    scrape DocumentCenter/showpublisheddocument/Archive links
  --amid    .../Archive.aspx?AMID=40    CivicPlus ArchiveCenter category (all years)
  --urls    URL1 URL2 ...               explicit URLs, e.g. read off a JS-rendered page
  --pattern ".../report-{year}.pdf"     static template (+ --years 2015-2025)

  python scripts/harvest_manifest.py --id keller --city Keller --page https://...
"""

import argparse
import io
import json
import re
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.parse import unquote, urlsplit

from curl_cffi import requests
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent.parent
IMPERSONATE = "chrome"
YEAR_MIN, YEAR_MAX = 2015, 2025
MIN_PAGES = 20  # reports are usually 90-150 pages

ACFR_TITLE = r"comprehensive annual financial|annual comprehensive financial|\bacfr\b|\bcafr\b"
AFR_TITLE = r"annual financial report|\bafr\b"
# Name + cover only: a real ACFR's contents page lists its own Single Audit and PAFR sections
NOT_THE_REPORT = r"single audit|popular annual|\bpafr\b"
# Name only: these appear in legitimate ACFR body text ("budgetary comparison schedule")
JUNK_NAME = r"single audit|popular|\bpafr\b|budget|quarterly|monthly|interim|debt schedule"


def get(url):
    try:
        r = requests.get(url, impersonate=IMPERSONATE, timeout=120, allow_redirects=True)
    except requests.errors.RequestsError as e:
        if "certificate" not in str(e).lower():
            return None
        r = requests.get(url, impersonate=IMPERSONATE, timeout=120, allow_redirects=True, verify=False)
    return r


def parse_year(filename, text):
    """Fiscal-year-ending from a Content-Disposition filename or cover text. None if unclear."""
    fn = unquote(filename or "")
    if re.search(JUNK_NAME, fn, re.I):
        return None
    m = re.search(r"(20\d\d)\s*(?:[-/]|to)\s*(\d{2,4})\b", fn, re.I)  # "2018-19" -> ENDING year
    if m:
        e = m.group(2)
        return 2000 + int(e) if len(e) == 2 else int(e)
    # "FY 21-22" -> ENDING year, must precede single-FY below which would take the START year
    m = re.search(r"FY\s?(\d\d)\s*(?:[-/]|to)\s*(\d\d)\b", fn, re.I)
    if m:
        return 2000 + int(m.group(2))
    m = re.search(r"9-30-(\d\d)\b", fn, re.I) or re.search(r"FY\s?(20)?(\d\d)\b", fn, re.I)
    if m:
        return 2000 + int(m.groups()[-1])
    m = re.search(r"September 30,?\s*(20\d\d)", text)  # cover text is authoritative
    if m:
        return int(m.group(1))
    return int(m.group(1)) if (m := re.search(r"\b(20[12]\d)\b", fn)) else None


def cover_year(url, city):
    """Return (year, url, scanned, afr_only) if url is an annual financial report for `city`.

    scanned  = no text layer, so the city rides on filename evidence alone.
    afr_only = matched the loose AFR phrasing, never ACFR/CAFR.
    The caller flags both for spot-checking.
    """
    r = get(url)
    if not r or r.content[:4] != b"%PDF":
        return None
    cd = r.headers.get("content-disposition", "")
    fn = (re.search(r'filename\*?=(?:UTF-8\'\')?"?([^"\r\n;]+)', cd) or [None, ""])[1] if cd else ""
    urlname = unquote(urlsplit(url).path.rsplit("/", 1)[-1])  # year is often only in the URL path
    raw_names = unquote(fn) + " " + urlname                   # keep _/- for range parsing
    names = re.sub(r"[_\-]+", " ", raw_names).lower()
    pages, cover = 0, ""
    try:
        reader = PdfReader(io.BytesIO(r.content))
        pages = len(reader.pages)
        # collapse runs, cover titles break across lines ("ANNUAL\nCOMPREHENSIVE\n...")
        page_text = [re.sub(r"\s+", " ", p.extract_text() or "") for p in reader.pages[:6]]
        cover, text = (page_text[0].lower() if page_text else ""), " ".join(page_text)
    except Exception:
        text = ""
    if pages and pages < MIN_PAGES:
        return None
    blob = names + " " + text.lower()
    if re.search(NOT_THE_REPORT, names + " " + cover) or re.search(JUNK_NAME, names):
        return None
    acfr = re.search(ACFR_TITLE, blob)
    if not acfr and not re.search(AFR_TITLE, blob):
        return None
    scanned = len(text.strip()) < 200
    if not scanned and city.lower() not in blob:  # wrong-city guard, text PDFs only
        return None
    y = parse_year(raw_names, text)
    return (y, url, scanned, not acfr) if y and YEAR_MIN <= y <= YEAR_MAX else None


def candidates_from_html(html, base):
    """All ACFR-ish doc URLs in raw HTML: DocumentCenter, showpublisheddocument, Archive."""
    urls = []
    urls += [f"{base}/DocumentCenter/View/{i}" for i in re.findall(r"DocumentCenter/View/(\d+)", html)]
    urls += re.findall(r'https?://[^"\']*?/home/showpublisheddocument/\d+/\d+', html)
    urls += [f"{base}/home/showpublisheddocument/{i}/{t}"
             for i, t in re.findall(r'/home/showpublisheddocument/(\d+)/(\d+)', html)]
    urls += [f"{base}/Archive.aspx?ADID={i}" for i in re.findall(r"Archive\.aspx\?ADID=(\d+)", html)]
    urls += [f"{base}/Archive/ViewFile/Item/{i}" for i in re.findall(r"Archive/ViewFile/Item/(\d+)", html)]
    urls += re.findall(r'https?://[^"\']+?\.pdf\b', html)
    return list(dict.fromkeys(urls))


def gather(args):
    base = None
    for src in (args.page, args.amid):
        if src:
            base = f"{urlsplit(src).scheme}://{urlsplit(src).netloc}"
    cands = []
    if args.urls:
        cands = args.urls
    elif args.pattern:
        lo, hi = (int(x) for x in args.years.split("-"))
        cands = [args.pattern.format(year=y) for y in range(lo, hi + 1)]
    elif args.page or args.amid:
        r = get(args.page or args.amid)
        if r:
            cands = candidates_from_html(r.text, base)
            # a finance page may only LINK the ArchiveCenter
            for amid in re.findall(r"Archive\.aspx\?AMID=\d+", r.text):
                rr = get(f"{base}/{amid}")
                if rr:
                    cands += candidates_from_html(rr.text, base)
            cands = list(dict.fromkeys(cands))
    return cands


def main():
    ap = argparse.ArgumentParser(description="Harvest ACFR PDF URLs into manifests/{id}.json.")
    ap.add_argument("--id", required=True)
    ap.add_argument("--city", required=True)
    src = ap.add_mutually_exclusive_group(required=True)
    src.add_argument("--page", help="ACFR/finance page URL to scrape")
    src.add_argument("--amid", help="CivicPlus ArchiveCenter category URL (Archive.aspx?AMID=n)")
    src.add_argument("--urls", nargs="+", help="explicit candidate PDF URLs")
    src.add_argument("--pattern", help="static URL template containing {year}")
    ap.add_argument("--years", default=f"{YEAR_MIN}-{YEAR_MAX}", help="range for --pattern")
    args = ap.parse_args()

    def probe(url):  # one bad candidate must not kill the pool
        try:
            return cover_year(url, args.city)
        except Exception:
            return None

    cands = gather(args)
    print(f"{args.id}: {len(cands)} candidate URLs")
    found, scanned_years, afr_years = {}, [], []
    with ThreadPoolExecutor(max_workers=8) as ex:
        for res in ex.map(probe, cands):
            if res and res[0] not in found:
                found[res[0]] = res[1]
                if res[2]:
                    scanned_years.append(res[0])
                if res[3]:
                    afr_years.append(res[0])

    mpath = ROOT / "manifests" / f"{args.id}.json"
    manifest = json.loads(mpath.read_text()) if mpath.exists() else {"id": args.id, "city": args.city, "pdfs": []}
    by_year = {p["year"]: p for p in manifest["pdfs"]}
    added = []
    for y in sorted(found):
        if y in by_year and by_year[y].get("archiveUrl"):
            continue  # already uploaded
        by_year[y] = {"year": y, "source": "url", "url": found[y], "archiveUrl": by_year.get(y, {}).get("archiveUrl")}
        added.append(y)
    manifest["pdfs"] = [by_year[y] for y in sorted(by_year)]
    mpath.write_text(json.dumps(manifest, indent=2) + "\n")

    wanted = range(YEAR_MIN, YEAR_MAX + 1)
    have = sorted(by_year)
    gaps = sorted(set(wanted) - set(have))
    print(f"  verified+added {sorted(added)}")
    if scanned_years:
        print(f"  ⚠ scanned, city unverified, spot-check: {sorted(scanned_years)}")
    if afr_years:
        print(f'  ⚠ AFR-titled, no "comprehensive"/ACFR/CAFR, spot-check: {sorted(afr_years)}')
    print(f"  manifest now {len(have)}/{len(wanted)}: {have}" + (f"  GAPS {gaps}" if gaps else "  COMPLETE"))
    if gaps:
        print("  gaps -> try the ArchiveCenter/Wayback, the browser for JS lists, or a manual PDF")
    if not found:
        print("  nothing verified, check the source URL or read a JS list in the browser")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
