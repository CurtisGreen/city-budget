---
name: create-manifest
description: Build the ACFR PDF-link manifest for one city — manifests/{id}.json mapping each fiscal year (FY2015–2025) to a verified source PDF URL. This is add-city's PDF-gathering step ONLY (no financial-data parsing, no CityInfo/GeoJSON). Use when asked to "create a manifest", "get the PDF links", or "gather ACFRs" for a city, e.g. "create-manifest for keller".
---

# create-manifest

Goal: from a city name, produce/complete `manifests/{id}.json` — one entry per fiscal year with a
verified direct PDF URL. NO financial parsing. The upload step (`scripts/upload_to_ia.py`) is separate.

`id` = kebab-case city name (e.g. "Little Elm" → `little-elm`). Target FY2015–2025.

Manifest shape (see `manifests/README.md`):
```json
{ "id": "keller", "city": "Keller", "pdfs": [
  { "year": 2015, "source": "url", "url": "https://…direct.pdf", "archiveUrl": null }, … ] }
```
`source:"manual"` + `"file":"inbox/{id}-FY{year}.pdf"` for a PDF the user supplies (city request /
IA-reject repair). `archiveUrl` stays null — the uploader fills it.

## Core rule: NEVER GUESS a URL
Only include a year whose PDF you actually downloaded and verified (bytes start `%PDF`, and the cover
is the RIGHT city + RIGHT fiscal year). A wrong-city/wrong-year entry is worse than a gap. Small towns
genuinely lack some years — a documented gap is fine; a fabricated URL is not.

## Python env — ALWAYS use the `city-budget` conda env
Define: `environment.yml` (repo root). Create once: `conda env create -f environment.yml`;
update after requirements change: `conda env update -f environment.yml --prune`.
Interactive shell: `conda activate city-budget`. From Claude/non-interactive: prefix every script
with `conda run -n city-budget python …` (never bare `python`/`python3`).

**When handing a script to the user to run themselves** (e.g. `scripts/upload_to_ia.py`, which
publishes to Internet Archive, so the user runs it): say in the same message that they must first
`conda activate city-budget`, and give the command in that order:
```bash
conda activate city-budget
python scripts/upload_to_ia.py manifests/{id}.json
```
**When the user directs you to run a script**, run it yourself with
`conda run -n city-budget python …` — activate/use the env, never fall back to bare `python`.

Why: the `(base)` env can have a broken `curl_cffi` (macOS 27.2: `ImportError: symbol not found
'_CFArrayAppendValue'`), and an env without `cryptography` makes pypdf fail on encrypted PDFs
("cryptography>=3.1 is required for AES algorithm"), so every PDF is silently rejected as a GAP.
Preflight (2s): `conda run -n city-budget python -c "import curl_cffi, pypdf, cryptography"`.
**A year rejected with no obvious reason = suspect the env first** (run pypdf on the file by hand
and read the exception) before concluding the PDF is bad.

## Method — follow the discovery ladder, then run the harvester
1. **READ the playbook first:** `~/.claude/projects/-Users-curtis-Documents-other-city-budget/memory/acfr-source-discovery-playbook.md`
   — the tier-ordered method (structured API → WebSearch dedicated page → curl+grep → browser+expand
   → probe IDs → Wayback → manual) and per-CMS recipes. Also read `memory/{id}-acfr-sources.md` if it
   exists (city-specific quirks/URLs). Fetch everything with **curl_cffi impersonate="chrome"** — plain
   `requests` gets 403'd by Akamai ([[akamai-needs-curl-cffi]]).

2. **Find the entry point** (cheapest that works):
   - `WebSearch "{City} Texas annual comprehensive financial report"` → the dedicated ACFR page. Fastest.
   - or `curl {domain}/sitemap.xml` and grep for `acfr|annual-comprehensive|financial-report`.

3. **Run the harvester** — it downloads each candidate, VERIFIES (%PDF + city + year read from the PDF,
   not the label), maps year→url, and MERGES into `manifests/{id}.json` without clobbering uploaded
   entries. Pick the mode that fits the CMS:
   - Dedicated ACFR / finance page (CivicPlus DocumentCenter, showpublisheddocument, static links):
     `conda run -n city-budget python scripts/harvest_manifest.py --id {id} --city "{City}" --page {URL}`
   - CivicPlus **ArchiveCenter** category (holds all years): `--amid {…/Archive.aspx?AMID=n}`
   - Static filename pattern: `--pattern "…/report-{year}.pdf" --years 2015-2025`
   - **JS-rendered list** (raw HTML has no doc links — DocBox/`docbox.js`, SharePoint `.aspx`,
     finalsite, some CivicPlus): open the page in the **browser pane**, expand any collapsed
     accordions/dropdowns FIRST (click `[aria-expanded="false"]` toggles — NOT nav links), read the
     rendered anchors, then pass them: `--urls URL1 URL2 …`

   - **Static HTML list** (raw HTML has direct `.pdf` hrefs, e.g. Houston): plain `curl -sL` the page,
     `grep -o 'href="[^"]*pdf"'`, then pass the URLs with `--urls`. Big cities publish 5–30 MB PDFs
     (a run of ~10 takes minutes, a single year ~2s each); when a city offers a "printer friendly"
     and a full-graphics PDF of the same year, prefer whichever the harvester verifies (Houston
     FY2015–17: only `…printerfriendly.pdf` works).

4. **Fill gaps** the harvester reports (`GAPS [...]`), cheapest first:
   - older years often live in the ArchiveCenter (`--amid`) even when the page shows only recent ones;
   - a removed/dead year: Wayback the reports page or the specific doc ([[wayback-recover-missing-acfr]]);
   - unlisted archive items: probe nearby `Archive/ViewFile/Item/{id±}` numbers;
   - genuinely-gone or JPEG-instead-of-PDF or scanned-corrupt: ask the user for a manual PDF → they drop
     it in `inbox/`, add a `source:"manual"` entry.

5. **Verify + report.** Confirm the manifest is valid JSON and list which years you got, which are gaps,
   and WHY each gap (nonexistent / removed / manual-needed) — don't silently drop years.

## Register the discovery for next time
If the city had non-obvious quirks (blocked host, Wayback-only, ArchiveCenter AMID, odd filenames),
add/append a one-file memory `memory/{id}-acfr-sources.md` so a re-run is instant. Update the playbook
if you hit a NEW CMS/failure mode.

## Do NOT
- upload to IA (that's `scripts/upload_to_ia.py`), parse financial data, or touch CityInfo/GeoJSON —
  create-manifest is links-only.
- trust the anchor label for the year — read it from the PDF (newest is often "final"/"latest").
