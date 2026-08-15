#!/usr/bin/env python3
"""
- Ghostscript re-distill of ACFR PDFs that IA rejected ("Syntax error detected in pdf data")
- IA rejects PDFs with v1.5+ features, so we set Ghostscript compatibility to v1.3
- Output goes to inbox/parsed/{id}-FY{year}.pdf, text layer intact
- Unstaged targets are downloaded from the manifest url, then repointed to source:"manual"
- Ghostscript must already be on PATH, `conda install -c conda-forge ghostscript` works

Usage:
  python scripts/repair_pdfs.py richland-hills:2025
  python scripts/repair_pdfs.py richland-hills:2025 keller:2019
  python scripts/repair_pdfs.py --no-repoint richland-hills:2025
"""

import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path

from curl_cffi import requests

ROOT = Path(__file__).resolve().parent.parent
INBOX = ROOT / "inbox"
PARSED = INBOX / "parsed"


def parse_target(s):
    """'richland-hills:2025' -> ('richland-hills', 2025)."""
    city_id, _, year = s.rpartition(":")
    if not city_id or not year.isdigit():
        raise argparse.ArgumentTypeError(f"{s!r}: expected {{city-id}}:{{year}}, e.g. richland-hills:2025")
    if not (ROOT / "manifests" / f"{city_id}.json").exists():
        raise argparse.ArgumentTypeError(f"no manifests/{city_id}.json")
    return city_id, int(year)


def find_gs():
    for name in ("gs", "gswin64c", "gswin32c"):
        if shutil.which(name):
            return shutil.which(name)
    for p in ("/opt/homebrew/bin/gs", "/usr/local/bin/gs", "/usr/bin/gs", "/opt/miniconda3/bin/gs"):
        if Path(p).exists():
            return p
    return None


def manifest_entry(city_id, year):
    manifest = json.loads((ROOT / "manifests" / f"{city_id}.json").read_text())
    for entry in manifest["pdfs"]:
        if entry["year"] == year:
            return entry
    return None


def stage(city_id, year, src):
    """Ensure src exists in inbox/, downloading from the manifest url if not.

    Returns None once present, else an error string. A source:"manual" entry never dropped in
    inbox/ can't be fetched, that one needs the file by hand.
    """
    if src.exists():
        return None
    entry = manifest_entry(city_id, year)
    if entry is None:
        return f"no FY{year} entry in manifests/{city_id}.json"
    url = entry.get("url") if entry.get("source") == "url" else None
    if not url:
        return f"input not found: {src} (entry is source:{entry.get('source')!r}, nothing to download)"
    print(f"  FETCH {city_id} FY{year}: {url}")
    try:
        r = requests.get(url, impersonate="chrome", timeout=120, allow_redirects=True)
    except requests.errors.RequestsError as e:
        # Broken cert chain, retry once unverified rather than for every host
        if "certificate" not in str(e).lower():
            return f"download failed: {e}"
        r = requests.get(url, impersonate="chrome", timeout=120, allow_redirects=True, verify=False)
    if r.status_code != 200:
        return f"download failed: HTTP {r.status_code}"
    if r.content[:4] != b"%PDF":
        return f"download failed: not a PDF ({len(r.content)} bytes)"
    src.write_bytes(r.content)
    return None


def redistill(gs, src, out):
    """gs re-distill src -> out. None on success, else an error string."""
    if not src.exists():
        return f"input not found: {src}"
    if src.read_bytes()[:4] != b"%PDF":
        return "input is not a PDF"
    
    r = subprocess.run(
        [gs, "-sDEVICE=pdfwrite", "-dCompatibilityLevel=1.3", "-dPDFSETTINGS=/prepress",
         "-dNOPAUSE", "-dBATCH", "-dQUIET", "-dAutoRotatePages=/None",
         f"-sOutputFile={out}", str(src)],
        capture_output=True, text=True, timeout=600,
    )
    if r.returncode != 0:
        return f"gs exit {r.returncode}: {(r.stderr or r.stdout)[:200]}"
    if not out.exists() or out.read_bytes()[:4] != b"%PDF":
        return "gs produced no valid PDF"
    return None


def repoint(city_id, year, parsed_rel):
    """Point the manifest entry at the repaired file."""
    mpath = ROOT / "manifests" / f"{city_id}.json"
    manifest = json.loads(mpath.read_text())
    for entry in manifest["pdfs"]:
        if entry["year"] == year:
            entry["source"] = "manual"
            entry["file"] = parsed_rel
            entry.pop("url", None)
    mpath.write_text(json.dumps(manifest, indent=2) + "\n")


def main():
    ap = argparse.ArgumentParser(description="Ghostscript re-distill IA-rejected ACFR PDFs.")
    ap.add_argument("targets", nargs="+", type=parse_target, metavar="CITY:YEAR",
                    help="e.g. richland-hills:2025")
    ap.add_argument("--no-repoint", action="store_true", help="write parsed files only; don't edit manifests")
    args = ap.parse_args()

    gs = find_gs()
    if not gs:
        sys.exit("ghostscript not found. Put `gs` on PATH (no brew: a static binary from "
                 "ghostscript.com/releases, or `conda install -c conda-forge ghostscript`).")
    print(f"using {gs}")
    PARSED.mkdir(parents=True, exist_ok=True)  # also creates INBOX

    ok, failed = [], []
    for city_id, year in args.targets:
        tag = f"{city_id} FY{year}"
        src = INBOX / f"{city_id}-FY{year}.pdf"
        out = PARSED / f"{city_id}-FY{year}.pdf"
        err = stage(city_id, year, src) or redistill(gs, src, out)
        if err:
            print(f"  FAIL  {tag}: {err}")
            failed.append(tag)
            continue
        print(f"  OK    {tag}: {src.stat().st_size // 1024}KB -> {out.stat().st_size // 1024}KB  {out.relative_to(ROOT)}")
        ok.append(tag)
        if not args.no_repoint:
            repoint(city_id, year, str(out.relative_to(ROOT)))

    print(f"\nrepaired {len(ok)}/{len(args.targets)}" + (f", failed: {', '.join(failed)}" if failed else ""))
    if ok and not args.no_repoint:
        print("manifests repointed to inbox/parsed/*. Re-upload with:")
        print("  python scripts/fetch_to_ia.py " +
              " ".join(f"manifests/{c}.json" for c in sorted({c for c, _ in args.targets})))
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
