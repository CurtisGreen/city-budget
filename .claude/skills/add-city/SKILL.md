---
name: add-city
description: Add a new city to the city-budget project — fetch ACFR/Wikipedia/Census/Overpass data, create the ACFR financials (ALL fields: base, tax-by-source, expense breakdowns, pensionPlans), CityInfo, and GeoJSON files, and register the city in lib/city-data-source.ts + lib/geojson-features.ts. Use when asked to add a city, e.g. "add Little Elm".
---

# Add a city

Goal: from a city name, produce 3 new files + 3 registry edits (+ a lib/expense-category-groups.ts
entry if the city renames functions across years), then verify the build.
Attempt every step automatically. If a data source can't be fetched/parsed, STOP that
step and ask the user (AskUserQuestion or plain prompt) rather than guessing or fabricating.

**Scope — EVERY field, in one pass.** The acfr-json gets the REQUIRED `CityFinancialData` fields
AND all the optional ones: the tax-by-source trio (`propertyTaxRevenue` / `salesTaxRevenue` /
`hotelTaxRevenue`), the two breakdowns (`fullAccrualExpenses[]`, `modifiedAccrualExpenditures{}`),
`pensionPlans[]`, and `capitalAssetsNetofDepreciation` where it applies. Every one of these comes
out of ACFRs you're already opening, so grab them while the dumps exist — see steps 2d–2e. The
**populate-pension-and-expenses** skill covers the same optional fields, but is now only the
BACKFILL path (older cities, or years this run had to leave as gaps); its `SKILL.md §2`–`§4` hold
the extraction traps and this skill defers to them rather than restating them.

**Prerequisite — the ACFR manifest must already exist.** This skill reads source PDFs ONLY from
`manifests/{id}.json` (built by the **create-manifest** skill); it does NOT search for PDFs. If
that file is missing, stop and have create-manifest run first. Any year not in the manifest, or
whose PDF won't fetch/open, is logged as a "manifest gap" and skipped — never hunted.

## Core rule: NEVER GUESS
Every value written to a file must come from a verified source (an ACFR/budget PDF you
actually read, Wikipedia, Census, or Overpass). If you are not certain of a figure — the
PDF is missing, a table is ambiguous, a number didn't parse cleanly, the right Overpass
relation is unclear, or sources conflict without a clear rule — DO NOT estimate, interpolate,
round from memory, or infer. Stop and prompt the user for that specific value/source. A
prompt is always preferable to a guessed number. When in doubt, ask.

## 0. Set the id
`id` = kebab-case of the city name (e.g. "Little Elm" -> "little-elm"). Used for all
3 filenames and lookups. camelCase vars = `littleElmInfo` / `littleElmGeoJson` /
`littleElmAcfr`.

## 1. Templates — read first, never restate schema
Read these as the source of truth for shape (do NOT copy values):
- `lib/types.ts` (CityInfo AND CityFinancialData interfaces — the latter is the field list
  for the acfr-json file; required vs optional `?` fields matter, see step 2)
- `data/info/hurst.ts` (typical), `data/info/haltom-city.ts` (with notes)
- `data/acfr-json/forney.ts` (acfr-json file shape — the array the app reads) and
  `data/acfr-json/dallas.ts` (the fully-populated reference: field ORDER + the shapes of
  `pensionPlans`, `fullAccrualExpenses`, `modifiedAccrualExpenditures`)
- `data/geojson/hurst-geojson.ts` (wrapper shape)
See `references/conventions.md` for the non-obvious field rules.

## 2. ACFR financials (manifest-driven) -> data/acfr-json/{id}.ts
This is the app's only financial data source (`data/acfr-json/index.ts` -> `acfrData[id]`).

a. **Source PDFs come ONLY from `manifests/{id}.json`. Do NOT hunt for PDFs.** Finding source
   URLs is the **create-manifest** skill's job, not this one.
   - **Prerequisite:** if `manifests/{id}.json` doesn't exist, STOP and tell the user to run
     create-manifest first. Do not proceed with discovery.
   - For each manifest entry, get its PDF in this order: **`source:"manual"` file** at its `file`
     path (`inbox/...`) if present → else **`url`** (the original city source) → else **`archiveUrl`**
     (the permanent Internet Archive copy). Rationale: the manual/original file is the exact
     document; the IA copy is the fallback if neither local file nor live URL is available. Read a
     local `file` from disk; fetch a `url` with `curl_cffi impersonate="chrome"` (Akamai TLS); fetch
     an `archiveUrl` with plain `curl -sL`. The year range you work with = exactly the years present
     in the manifest (may be a subset of FY2015–2025).
   - **If a year is absent from the manifest, or its PDF can't be fetched/opened** (404,
     non-`%PDF`, unreadable, truncated): **LOG it and SKIP that year.** Do NOT search the city
     site, Wayback, Google, or anywhere for a replacement, and do NOT edit/repair the manifest —
     add-city reads it read-only. Collect every skipped year into a **"manifest gaps"** list for
     the final report (step 6). A wrong/incomplete manifest is a create-manifest fix, not this skill's.
   - You still don't need every year's file — see the read strategy in b; fetch only the manifest
     PDFs that strategy actually requires.

b. Read strategy (minimize PDFs actually parsed), applied over the years the manifest HAS:
   1. **The latest report covers FY-1 for FREE.** Its prior-year columns supply FY-1 balance-sheet
      + Note 4/5 capital; its 10-yr statistical tables supply FY-1 (and ~9 more) rates/revenue/grants.
   2. **Latest report's statistical section** — 10-year tables: property tax rates + Changes in
      Net Position (revenues, grants, interest, and the general-revenue property/sales tax rows
      that feed `propertyTaxRevenue` / `salesTaxRevenue`). Oldest available report supplies the
      earliest year.
   3. **Hotel tax is in NO 10-yr table.** `hotelTaxRevenue` comes from the city's hotel/motel
      special-revenue fund — its budget-vs-actual schedule (Actual + prior-year column = 2
      years/report), else the special-revenue **combining** statement's "Taxes" row — or the
      budget book's Hotel Occupancy Tax Fund summary. Big-city exception: a city running hotel tax
      through an enterprise activity prints it as a government-wide general revenue, so all three
      tax fields come from the SAME MD&A table. Both paths: conventions "Tax revenue fields".
      Omit the field for years before the city levied it.
   4. **Three more 10-year schedules in that same latest report** cover the optional fields:
      statistical **Changes in Net Position** (accrual) → `fullAccrualExpenses`; statistical
      **Changes in Fund Balances, Governmental Funds** (modified accrual) →
      `modifiedAccrualExpenditures`; and the RSI **Schedule of Changes in Net Pension Liability**
      + **Schedule of Contributions** → `pensionPlans[]`. So `pdftotext` each report ONCE and grep
      every table out of the same dump — the latest ACFR + the FY2024 ACFR (whose 10-yr windows
      reach one year further back) cover FY2015→latest for all of them.
   5. **Per-report-only fields** (balance-sheet aggregates from MD&A Table 1 / Statement of Net
      Position; the 4 capital fields from Note 4/5 — neither is in a 10-yr table): use
      **every-other** manifest PDF (each ACFR carries current + prior year).
   6. Read an **in-between report only if** a value is missing, was restated (see pitfalls), or
      fails a cross-check — and only if that year is in the manifest. If a report you need is a
      manifest gap, log it (a) and proceed with what's available.
c. Download the manifest PDFs you need (per b) to a temp dir, then extract with
   **`pdftotext -layout`** (NOT WebFetch — WebFetch's summarizer mangles financial tables and
   drops columns). `pdftotext` is at /opt/homebrew/bin. If a fetched file isn't `%PDF` or
   `pdftotext` fails on it, treat it as a manifest gap (step a) — log + skip, don't hunt.
   Workflow per report:
   - `pdftotext -layout file.pdf file.txt` then `awk '/\f/{p++}...'` or per-page
     `pdftotext -layout -f P -l P` to locate tables. Physical page (`-f/-l`) ≠ form-feed
     count; scan a range and grep for the table header to find the real page.
   - Pull the bulk of the data from MD&A + statistical tables (see conventions.md "Fast
     sources"); they give many years at once. Only fall back to the full government-wide
     statements for fields the condensed tables omit.
d. Write `data/acfr-json/{id}.ts`, one entry per fiscal year:
   ```
   import type { CityFinancialData } from "@/lib/types";

   export const {camelId}Acfr: CityFinancialData[] = [ { "fiscalYear": 2015, ... }, ... ];
   ```
   TWO format/convention rules that bite:
   - The 4 capital fields `government*/business*CapitalAssetsBeingDepreciated` = **GROSS cost**
     ("Total capital assets being depreciated" line in the capital-assets note, BEFORE "less
     accumulated depreciation") — NOT the net-of-depreciation value. `*NotBeingDepreciated` =
     land + CIP. So the 4 do NOT sum to `capitalAssets` (which is NET) — that's expected
     (matches forney.ts). Using net book value is a real past bug.
   - Write every number with **underscore digit grouping** (`149_742_154`) — matches all
     existing files (Python `format(n,'_')`).

   Each object = one `CityFinancialData` (field names + which are optional `?` come from
   `lib/types.ts`). Write the REQUIRED fields, every year: fiscalYear, currentAndOtherAssets,
   capitalAssets, deferredOutflows, liabilities, deferredInflows, totalRevenue,
   operatingGrantsAndContributions, capitalGrantsAndContributions, debtInterest, and the 4
   `government*/business*CapitalAssets(Not)BeingDepreciated`.
   PLUS the tax-by-source trio for every year: `propertyTaxRevenue`, `salesTaxRevenue`,
   `hotelTaxRevenue` (sources in b2/b3 and conventions "Tax revenue fields"). Exact dollars, not
   thousands-rounded like the base fields. Cross-check property + sales + franchise == the MD&A
   combined "Taxes" line for a couple of years; each report's prior-year column must match the
   neighbor report's current column, so a FY2015→latest chain is self-consistent. Omit a single
   year's key rather than guessing it — the charts skip a year that lacks the field.
   Also **`capitalAssetsNetofDepreciation`** — write it only when net capital sits on a different
   basis than the 4 gross fields (e.g. right-to-use lease/SBITA assets carved out of the note but
   inside the balance-sheet capital line); otherwise omit it and the Asset Life metric uses
   `capitalAssets`. See conventions "Fields <- ACFR location".
e. Same pass, same dumps: the remaining optional fields. Field order per
   `data/acfr-json/dallas.ts` (the canonical fully-populated file): `fiscalYear`, `pensionPlans`,
   tax×3, the base balance-sheet/flow fields, `fullAccrualExpenses`, `modifiedAccrualExpenditures`,
   the capital fields. These are exact dollars, NOT thousands-rounded like the base fields.
   - **`fullAccrualExpenses[]`** — one `{ name, value }` per governmental-activities function row
     of the Statement of Activities EXPENSES column, names verbatim, INCLUDING "Interest on
     Long-Term Debt" last. Self-check: they sum to the table's own "Total governmental activities"
     expenses line.
   - **`modifiedAccrualExpenditures{}`** — Total Governmental Funds column: `current[]` (each row
     under **Current:**, names verbatim), `debtService` = `{ principal, interest }` (+ the optional
     `refundingEscrow` / `issuanceCosts` ONLY when the refunded-bond escrow payment / bond issuance
     costs are printed among the Debt Service rows inside Total Expenditures, not under Other
     Financing Sources/(Uses)), `capitalOutlay` = SUM of the Capital Projects rows, `total` =
     "Total Expenditures". Self-check: `current + principal + interest + (refundingEscrow ?? 0) +
     (issuanceCosts ?? 0) + capitalOutlay == total`.
   - **`pensionPlans[]`** — one entry per plan per year from the RSI schedules: `(a)` →
     `totalPensionLiability`, `(b)` → `fiduciaryNetPosition`, and ADC/actual from the **Schedule
     of Contributions** (never the NPL schedule's `Contributions - City`). Omit
     `actuariallyDeterminedContribution` for a plan-year with no ADC. NEVER store funded ratio,
     net pension liability, or contribution deficiency — all are derived at render time. Keep
     `name` short (`"TMRS"`), the legend prints `{City} - {name}`.
   - **Read populate-pension-and-expenses `SKILL.md §2` (the five pension traps: measurement- vs
     fiscal-year headers, unlabeled continuation pages, missing ADC, >100% coverage, `(in 000's)`
     units), `§3` (expense table rules + the `lib/expense-category-groups.ts` entry when function
     names drift across years), and `§4` (PROVE the pension parse by reproducing every printed
     funded ratio) before extracting.** Those rules are not restated here.
   - A field you can't source cleanly for a year: OMIT that key and report it (the charts skip a
     year that lacks the field). Never estimate.
f. CROSS-CHECK before trusting (cheap, catches restatements/misreads):
   - program revenues + general revenues == MD&A "Total revenues" (TPG) for a couple years.
   - capital-asset ending balance of report N == beginning balance of report N+1.
   - a tax-rate table's overlapping year matches the next report's table.
   - **gov + business == total** in every MD&A "Totals" column you read. If it doesn't tie,
     the MD&A Totals are mis-keyed (Southlake FY2023 deferred rows were off by 314,383) — use
     the government-wide **Statement of Net Position** as the authoritative source for the 5
     balance-sheet aggregates (it's the conventions-prescribed source anyway).
   - **Current and Other Assets + Capital Assets == Total Assets** (PG total), and **net
     Capital Assets <= gross** (sum of the 4 capital fields). If net > gross, the MD&A
     condensed table likely mislabeled total noncurrent assets (capital + restricted cash) as
     "Capital assets, net" — re-source both from the audited Statement of Net Position (see
     conventions "MD&A Condensed Net Position mislabel" pitfall). Celina FY2025 hit exactly this.
g. If a manifest year's PDF is present but a specific FIGURE can't be located/parsed cleanly,
   note it and ask the user for that number. Do NOT invent values, and do NOT go hunt a
   different PDF — the manifest PDF is the source of record. (Missing/unfetchable PDFs are
   already handled in a: log as a manifest gap + skip.)
h. **Do NOT create or edit the manifest.** `manifests/{id}.json` is produced by the
   **create-manifest** skill and consumed here read-only. If it's missing or has gaps, that's a
   create-manifest run — not this skill.

## 3. CityInfo -> data/info/{id}.ts
- populations: 1980/1990/2000/2010/2020 from Wikipedia (WebFetch), 2025 from US Census
  QuickFacts (WebFetch); label it `year: 2025` to match the other cities. QuickFacts frequently
  403s WebFetch AND curl (Cloudflare) — fall back to Data USA / Census Reporter, but ONLY if they
  report a genuine 2025 figure. **If no actual 2025 population can be found, OMIT the 2025 entry
  entirely** (leave it blank — the populations array just ends at 2020). Do NOT relabel an older
  estimate (e.g. an ACS 5-year or a Vintage-2024 number) as `year: 2025` — a wrong-year value is
  worse than a missing one. **Verify the place geoid** (from Census Reporter / Data Commons) — a
  wrong FIPS silently returns a different city (Colleyville = 4815988, NOT 4816432 = Conroe).
- area: land area sq mi from Wikipedia.
- Do NOT set latitude/longitude — the fields are optional and unused by the app (only the
  dead `components/city-map.tsx` reads them). Omit both keys.
- propertyValues: M&O (moRate) + I&S (isRate) rates per fiscal year. FY2015–2025 from ACFR
  "overlapping rates"/"property tax rates" table; FY2026 from the city's 2026 budget
  (total rate − debt-service rate = M&O). Rates are decimals (per $100). See conventions.
  **If the budget's tax-rate ordinance + Form 50-856 worksheet are scanned images** (no text
  layer — the body only shows the total rate), get the M&O/I&S split from the appraisal
  district's annual rates PDF: Tarrant County = `https://www.tad.org/content/rates/{taxYear}TaxRates.pdf`
  (curl-able; tax year {N} = fiscal year {N+1}; M&O + I&S must sum to the adopted total — that's
  your cross-check). See conventions "Tax rates" for the non-Tarrant equivalent.
- revenueBySource (CityInfo): **FY2024** property/sales/hotel tax (NOT the latest year) — copy
  the FY2024 entry's three tax fields from the acfr-json you just wrote (step 2d) so the snapshot
  and the series can't drift. Same for the FY2024 row of `revenues[]`.
- salesTaxUsage: the 2% local split — easiest from the **budget book** (states it plainly,
  e.g. "0.5% parks, 0.375% economic development, 0.125% crime control" + 1% General Fund).
  See percent convention in conventions.md. Entries should sum to 2.0.
- notes: optional ACFR quote explanations of big swings. Pick which years to annotate by
  the **derived metrics that render as charts** (Net Financial Position, Net Debt to Total
  Revenues, Asset Life, Years of Financial Cushion, etc.) — NOT raw-field jumps. A raw spike
  often nets out in the metric the user actually sees (debt issuance is ~neutral in Net
  Financial Position; spent grant revenue leaves the balance sheet flat), so annotate the
  metric's visible move, then find the MD&A quote behind it. See conventions.md "notes".
  Backtick template literal, `FY YYYY ACFR: "<quote>"` — the prefix unquoted, then **every quoted
  passage wrapped in its own pair of double quotes** so the ACFR's words are visibly delimited from
  the prefix and from any elision. Quote verbatim — verify against the PDF text, never paraphrase.
  If two+ quotes are from the SAME ACFR year and explain the SAME jump, join them into one note
  with ` [...] ` BETWEEN the closing and opening quotes, each passage separately quoted:
  `FY 2025 ACFR: "quote part 1 here" [...] "quote part 2 here"`. See conventions.md "notes".
Write the file mirroring hurst.ts structure.

## 4. GeoJSON -> data/geojson/{id}-geojson.ts
Fetch from the Overpass API with curl (overpass-turbo UI not scriptable):
```
curl -s -A "city-budget-data/1.0" https://overpass-api.de/api/interpreter \
  --data-urlencode 'data=[out:json][timeout:60];rel["name"="{cityName}"]["boundary"="administrative"]["admin_level"="8"];out geom;'
```
- MUST send a `-A` User-Agent header — the API returns `406 Not Acceptable` without one.
- **Under load Overpass returns an HTML error page, not JSON** (small ~700-byte body starting
  `<?xml`/`<html>` = "too many requests"/"rate_limited"). Detect by size or non-JSON first byte
  and **retry once after a few seconds**; once you know the relation id, query `rel(<id>);out geom;`
  (faster, avoids the name lookup).
- The result is OSM JSON, NOT GeoJSON, and no converter (osmtogeojson / osm2geojson) is
  installed. Convert with a short Python script: collect `outer`/`inner` member ways (ignore
  `label`), stitch fragments into closed rings by matching endpoints, build a Polygon
  `[outer, ...inner holes]` (or MultiPolygon if >1 outer). Coords are `[lon, lat]`, rounded.
  Guard the stitch loop against an empty `inner` list (don't `pop` from `[]`).
- Wrap as `export const {camelId}GeoJson = { type:"FeatureCollection", ..., features:[{
  type:"Feature", properties:{ "@id":"relation/{id}", ...tags }, geometry }] };` to match
  existing files (json.dump then prepend the `export const`).
- If the name is ambiguous (multiple TX matches), confirm the relation id with the user.

## 5. Register in three files (6 edits)
**a. `lib/city-data-source.ts`** — grep `hurstInfo` for insertion points:
- `import { {camelId}Info } from "@/data/info/{id}";`
- `{camelId}Info,` in the `basicCityInfo` array

**a2. `lib/geojson-features.ts`** — grep `hurstGeoJson` for insertion points:
- `import { {camelId}GeoJson } from "@/data/geojson/{id}-geojson";`
- `...{camelId}GeoJson.features,` in the `geoJsonFeatures` array

**b. `data/acfr-json/index.ts`** — grep `forneyAcfr` for both insertion points (keep the
existing alphabetical order):
- `import { {camelId}Acfr } from "./{id}";`
- `"{id}": {camelId}Acfr,` in the `acfrData` record

Skipping (b) means the city renders with EMPTY financials (`acfrData[id] ?? []`) — no error,
just blank charts. Verify it's wired (step 6).

## 5b. Format with Prettier (do this before building)
The repo is Prettier-formatted (no config file → defaults). Generated files, especially the
GeoJSON, will NOT match until formatted:
- Run `npx prettier --write data/info/{id}.ts data/geojson/{id}-geojson.ts data/acfr-json/{id}.ts data/acfr-json/index.ts`
  (plus `lib/expense-category-groups.ts` if a function-name drift entry was added, step 2e) and
  confirm with `--check`.
- GeoJSON gotcha: writing via Python `json.dump` quotes every key and escapes non-ASCII
  (e.g. `®` -> `®`). Prettier unquotes valid-identifier keys but does NOT unescape
  string contents — replace `®` etc. with the literal char to match existing files.
- Match the existing expanded-object style: in `{id}.ts`, write each `propertyValues` /
  `revenues` entry as a multi-line object (like hurst.ts), not single-line. Prettier
  preserves whichever you write, so author them expanded.

## 6. Verify
- Run BOTH optional-field audits from repo root — they need no PDFs and catch a bad breakdown or
  pension series immediately:
  ```bash
  node .claude/skills/populate-pension-and-expenses/scripts/audit-expenses.mjs {id}; python3 .claude/skills/populate-pension-and-expenses/scripts/audit-pension.py {id}
  ```
  Expect full coverage (except years you reported as gaps), `reconciliation ✓`, plausible funded
  ratios, no anomalies. Exit 1 = a value you wrote is arithmetically wrong — fix it, don't ship it.
- `npm run build` (or `npx tsc --noEmit`) passes.
- `data/acfr-json/{id}.ts` is imported AND in the `acfrData` record of `data/acfr-json/index.ts`
  (grep `{camelId}Acfr` — must appear twice).
- Optionally run `npm run dev` and load the city to confirm it renders WITH populated charts
  (blank charts = acfr-json not wired, see step 5 part b) — including the two stacked-bar expense
  charts and, at the end of "Financial Metrics Over Time", one pension legend entry per plan.
- Report what was automated vs what needed user input, AND the **manifest gaps** (step 2a) —
  the years skipped because they were absent from `manifests/{id}.json` or their PDF wouldn't
  fetch/open. Those years have no financial data; fixing them = re-run create-manifest, then
  re-run this skill.
- Report every optional field/year left as a gap and why. Follow-ups: **validate-city** for the
  chart-inflection audit, and **populate-pension-and-expenses** only if optional-field gaps remain
  (it re-opens the same ACFRs to backfill them).
