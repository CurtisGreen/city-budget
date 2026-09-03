---
name: validate-city
description: Validate an already-added city's data in the city-budget project — run the mechanical checker, then audit the chart inflections (big YoY jumps) against the source ACFR, fixing mis-keyed values and adding a verbatim note where the jump is real. Use when asked to validate, audit, QA, or check a city's data, e.g. "validate Roanoke" or "check Hurst's numbers".
---

# Validate a city

Goal: from a city name/id, confirm `data/acfr-json/{id}.ts` + `data/info/{id}.ts` are correct.
Two passes: (1) the mechanical checker for typos / convention violations, (2) the **jump audit** —
every conspicuous YoY move in the charts is either a real event (→ add a verbatim ACFR quote note)
or a mis-keyed value (→ fix it). Reuses **add-city** field conventions and **city-narrative**
inflection detection. Source PDFs come ONLY from `manifests/{id}.json` — NEVER hunt the internet.

**Out of scope:** do NOT add missing tax-revenue / expense-breakdown fields — that's the
**populate-pension-and-expenses** skill. Validate what's there; don't backfill what isn't.

## Core rule: NEVER GUESS a fix
A finding is a SUSPECT until confirmed against a source you actually read (an ACFR/budget PDF from
the manifest). Fix a value only after the correct number is verified from the PDF. If a suspect
can't be resolved from a source, REPORT it — never "correct" a value to whatever makes a check pass,
and never invent a note. A wrong fix is worse than a flag.

## 0. Resolve the city
`id` = kebab-case of the name. Require `data/acfr-json/{id}.ts`; if absent the city isn't added —
say so and offer **add-city** (don't validate a city that doesn't exist).

## 1. Run the mechanical checker (cheap, first)
`node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON .claude/skills/validate-city/scripts/check.ts {id}`
(from repo root). With no PDF access it flags: a missing required `CityFinancialData` field (the
optional `capitalAssetsNetofDepreciation` is absent on most cities, so an omitted optional key is
NOT flagged: `undefined` means "not populated", not 0), FY gaps, negative aggregates,
**net capital > gross**,
**`capitalAssets` > gross** (Celina-FY2025 signature: the MD&A condensed table mislabeled total
noncurrent assets — capital + restricted cash — as "Capital assets, net"),
**either net-capital field exceeding the other** (WARN both ways — the two come from different
places on purpose: `capitalAssets` is the MD&A condensed table's PRINTED capital row, kept printed
so a reader can audit it against the PDF, while `capitalAssetsNetofDepreciation` is the capital
NOTE's ending balance. `capitalAssets` higher = it INCLUDES GASB 87/96 right-to-use lease/SBITA
assets the net-of-dep field excludes; `capitalAssetsNetofDepreciation` higher = the MD&A row drops
a capital line the note counts, e.g. Trophy-Club-FY2025 business-type CIP 29,500 parked under
"Current and other assets". Verify the gap is one of those and not restricted cash mislabeled as
capital or a mis-sourced field; a net-of-dep excess over 2% of `capitalAssets` is too big for a
printing quirk and ERRORs), **Asset
Life outside [0.40,0.80]** (a mis-keyed capital value), a lone dip in a "being depreciated" field
(dropped depreciable sub-row), salesTaxUsage not summing to ~2.0, >3 notes, and missing FY{last+1}
rate row. ERROR = almost certainly wrong; WARN = verify. Exit 1 if any ERROR.
The checker CANNOT see `currentAndOtherAssets + capitalAssets == Total Assets` (it lacks Total
Assets) — verify that identity by hand whenever a capital finding appears.

## 2. Jump audit — the main pass
Run `node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON .claude/skills/city-narrative/scripts/metrics.ts {id}`
for the per-metric top YoY moves
(the chart inflections). Add every checker ERROR/WARN to this list. For each conspicuous jump, get
the source PDF and decide: **real event → quote it; mis-keyed → fix it.**

### 2a. Get the source PDF (manifest only)
From `manifests/{id}.json`, per entry prefer `source:"manual"` `file` (`inbox/...`) → else `url`
(fetch with `curl_cffi impersonate="chrome"`, Akamai TLS) → else `archiveUrl` (fetch with plain
`curl -sL`). Extract with `pdftotext -layout` (NOT WebFetch — it mangles financial tables). If the
year you need is absent from the manifest or its PDF won't fetch/open, that suspect is
UNCONFIRMABLE — log it for the report; do NOT search the city site, Wayback, or Google, and do NOT
edit the manifest (a manifest gap is a create-manifest fix).

### 2b. Localize a mis-keyed value (conventions.md §2e cross-checks)
Confirm the truth from the PDF before touching anything. Which identity fails points at the bad value:
- program revenues + general revenues == MD&A "Total revenues"; gov + business == each MD&A "Totals"
  column; capital ending(N) == beginning(N+1); a rate table's overlap matches the next report.
- Mis-keyed capital field: re-read Note 5 gross "being/not being depreciated" (NOT the MD&A net
  table), watching the two documented bugs (net-captured-as-gross; dropped Buildings row).
- net/`capitalAssets` > gross, or the two net-capital fields disagree: the MD&A condensed table
  likely mislabeled total NONCURRENT assets (capital + restricted cash) as "Capital assets, net".
  Re-source from the audited **Statement of Net Position**: `capitalAssets` = capital line(s) only;
  the difference (restricted cash/investments) belongs in **`currentAndOtherAssets`** (= `Total
  Assets − net capital`). Fixing this shifts BOTH values (Celina FY2025: moved $164.2M Capital → CA).
- **MD&A condensed tables are the dataset's source of truth — don't "fix" a value to the audited
  figure over a mere presentation difference.** Balance-sheet values come from the MD&A "Condensed
  Net Position" table, flows from "Changes in Net Position", with their rounding. Before changing
  one, run the identities: `Cur&Other + Capital == Total Assets`; `TA + Def.out − Liab − Def.in == Net
  Position`; `Total revenues == expenses + change in net position`; `net capital <= gross`. If the
  MD&A value SATISFIES the identities it's a valid grouping — LEAVE IT (Carrollton FY2019: MD&A
  deferreds 38,404/11,327 differ from audited 28,086/1,009 but both tie → keep MD&A). Only re-source
  from the audited statement when the MD&A value is genuinely IMPOSSIBLE / identity-violating
  (net>gross = Celina restricted-cash mislabel; mis-keyed Totals = Southlake FY2023).
- Grant op/cap split: the 10-yr STATISTICAL table can misclassify it (business capital grant on the
  operating row) even when the MD&A Changes table / audited SoA agree — take the split from the MD&A
  Changes table / audited SoA, not the statistical table (Carrollton FY2016).

Fix confirmed values in `data/acfr-json/{id}.ts` / `data/info/{id}.ts`. Leave unconfirmable
suspects for the report.

### 2c. Real jump → add a verbatim note
If the jump is confirmed CORRECT and it's a genuine outlier (≈≥2× the next-largest YoY move in that
metric, ≥~25% of revenue for dollar metrics) with no covering note, add one. Classify first
(noteworthy / data-error / self-explanatory / start-of-series / steady-trend); open that year's MD&A
(its manifest PDF) and quote the driver VERBATIM (elide with ` [...] `, no paraphrase); match the
file's existing prefix style; respect the hard cap of 3 notes total. If no faithful quote exists,
add NO note. Also sanity-check existing notes: the quoted text must appear verbatim in that year's
ACFR, and its FY tag must match the metric move it explains.

## 3. Apply + verify
After edits: `npx prettier --write data/acfr-json/{id}.ts data/info/{id}.ts` and confirm
`--check`; run `check.ts {id}` again (clean or only expected WARNs); then `npm run build`.
If nothing needed fixing, make NO edits.

## 4. Report
Summarize: files audited; jumps/ERRORs/WARNs found; for each — confirmed-correct (note added, or why
none), fixed (source figure + where it came from), or left open (why, what the user must supply).
Never report a guessed value as fixed.
