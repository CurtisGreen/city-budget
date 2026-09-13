---
name: populate-pension-and-expenses
description: Backfill ALL the OPTIONAL CityFinancialData fields into an already-added city's data/acfr-json/{id}.ts in ONE pass over the ACFRs — pensionPlans[] (from the RSI schedules), tax-by-source, and the fullAccrualExpenses / modifiedAccrualExpenditures breakdowns (from the 10-year statistical tables). Use when asked to "populate pension and expenses", "populate expenses", "populate pension", "populate missing data", "add the optional/Dallas-style fields", "fill in the expense breakdowns", "get the funded ratio / ADC for {city}", or "backfill {city}".
---

# Populate a city's optional data (pension + expenses) in one pass

Goal: from a city name/id, fill every OPTIONAL `CityFinancialData` field the source ACFRs report —
`pensionPlans[]`, the tax-by-source fields, and the two expense/expenditure breakdowns — for every
fiscal year, then verify. Base/required fields are **add-city**'s job; this skill only ADDS optional
fields to a city that already exists. **add-city writes these same fields for any NEW city** (its
steps 2d–2e), so this skill is the BACKFILL path: cities added before that, or years an earlier
run left as gaps. Reuses **add-city** `SKILL.md §2` (source discovery) and
`references/conventions.md` (per-field source rules).

**Why merged:** both halves come out of the SAME reports — pension from the RSI schedules,
expenses/taxes from the statistical ten-year tables or, in a city without a statistical section,
from each year's own audited statements. Convert every report ONCE, run `extract-statements.py`
over all the dumps in ONE call, write one edit, run one build. Never fetch or convert a PDF twice.

## Core rules

- **NEVER GUESS.** Every value written comes from a PDF you actually read. A figure you can't source
  cleanly is left OUT (omit the key for that year) and reported — never estimated.
- **SPEND TURNS, NOT BYTES.** Every tool call re-reads the whole transcript, so turn COUNT is what
  this job costs. Measured on one AFR-style city: 83 API calls, 10.2M cache-read, starting from a
  ~49K base and ending near 197K — the growth, not the base, is the bill. So: one Bash call per
  STEP, `;`-joined, never one per command.
  The single biggest saving is NOT batching harder — it is not hunting anchors at all. You cannot
  batch a read whose anchor you only learn from the previous read's output, and anchors are not
  portable between years. Run `extract-statements.py` over every dump first (step 1) and go to the
  PDF only for what it flags.
- **NEVER OVERWRITE.** A field already present for a year stays exactly as is (even if you'd source
  it differently), unless an audit flags it as arithmetically wrong. Fill genuine gaps only.
- **STORE WHAT'S PRINTED, DERIVE NOTHING.** Funded ratio and ADC coverage are computed at render
  time in `components/pension-chart.tsx` — never store them, and never store `Net pension liability`
  or `Contribution deficiency (excess)` (both are differences of stored fields).

## The fields this skill fills

Full per-field source rules live in `add-city/references/conventions.md`:

- **`pensionPlans[]`** — per plan per year, from the RSI schedules (shape below).
- **Tax by source** — `propertyTaxRevenue`, `salesTaxRevenue`, `hotelTaxRevenue`
  (conventions "Tax revenue fields").
- **Expense/expenditure breakdowns** — `fullAccrualExpenses[]`, `modifiedAccrualExpenditures{}`
  (conventions "Expense/expenditure breakdown fields"). These drive the two stacked-bar charts and
  are the fields most cities lack.

`capitalAssetsNetofDepreciation` is also optional but is add-city/validate-city territory (only when
right-to-use leases carve net capital off the gross basis) — leave it to those skills.

`pensionPlans` shape:

```ts
pensionPlans?: {
  name: string;                                 // plan heading, shortened for the chart legend
  totalPensionLiability: number;                // "Total pension liability - ending (a)"
  fiduciaryNetPosition: number;                 // "Plan fiduciary net position - ending (b)"
  actuariallyDeterminedContribution?: number;   // omit when the schedule reports no ADC
  actualContribution: number;                   // "Contributions in relation to the ADC"
}[];
```

Legend renders as `{City} - {name}`, so keep `name` short: `"TMRS"`, `"Employees' Retirement Fund"`,
`"Police & Fire Combined Plan"`. Don't paste the full statutory plan title.

## 0. Resolve the city + audit BOTH halves FIRST (cheap, no PDFs)

`id` = kebab-case of the name. Require `data/acfr-json/{id}.ts`; if absent the city isn't added —
say so and point to **add-city** (don't populate a city that doesn't exist). Then, from repo root:

```bash
node .claude/skills/populate-pension-and-expenses/scripts/audit-expenses.mjs {id}; python3 .claude/skills/populate-pension-and-expenses/scripts/audit-pension.py {id}
```

- `audit-expenses.mjs` prints a per-year ✓/· coverage matrix for the 5 tax/expense fields, lists the
  GAPS, RECONCILES already-present breakdowns (current+debtService+capitalOutlay==total; the
  fullAccrualExpenses interest entry ≈ debtInterest), and flags fullAccrualExpenses label drift
  across years (→ may need a grouping entry, step 3c). Exit 1 = a stored value is wrong.
  Two WARNs deserve a PDF, not a shrug:
  - _modified/accrual ratio Nx that function's median_ → a year's statistical column was probably
    mis-keyed onto the wrong labels. It reconciles against the printed total, so this is the ONLY
    check that sees it. Re-source that year from the audited statements.
  - _fullAccrual interest vs debtInterest_ → the statistical table is diverging from the audited SoA
    for that year **generally**; other rows in the same year can be wrong silently. Re-source the
    year's whole row set, not just the interest line.
- `audit-pension.py` prints pension coverage and anomalies.

The union of both outputs is the worklist. Re-run both at the end (step 5). If neither shows gaps,
stop — nothing to do. If only one half has gaps, still do the single shared fetch (step 1) and just
skip the other half's extraction.

## 1. Fetch the shared PDFs — ONCE

Source PDFs come from `manifests/{id}.json`. Fetch per **validate-city §2a**: manifest `file` →
`url` (curl_cffi `impersonate="chrome"` for Akamai/Cloudflare) → `archiveUrl`. Discovery quirks per
**add-city `SKILL.md §2 a/a1/a2`** (verify right-city + FYE). Any city-specific access quirk is
worth a `reference` memory note (e.g. addison-acfr-sources).

**Two reports cover FY2015→latest for BOTH halves**, because GASB 68 RSI schedules and the
statistical-section schedules are both 10-year:

| Report                    | Covers                                             |
| ------------------------- | -------------------------------------------------- |
| latest ACFR (e.g. FY2025) | FY2016–2025, all fields                            |
| FY2024 ACFR               | FY2015 (its 10-yr window reaches back one further) |

**…for every field EXCEPT `hotelTaxRevenue` — settle that one BEFORE you fetch.** There is no
10-year hotel table. Which of three cases the city is in decides the whole fetch budget:

| Where hotel tax lives                                               | Reports needed                           |
| ------------------------------------------------------------------- | ---------------------------------------- |
| government-wide general revenue (big-city / convention-center case) | 0 extra — same table as property + sales |
| the fund's budget-vs-actual schedule (actual + prior-year columns)  | ~6 (2 years each)                        |
| the special-revenue **combining** statement (1 year/report)         | **every ACFR in the manifest**           |

Colleyville, McKinney, Grand Prairie, Balch Springs are combining-statement cities — 11 reports, not
two. Check the latest report for which case applies, then fetch once for the whole job.

Convert each report ONCE to a text dump you keep for the whole session, then run the EXTRACTOR over
every dump at once — one call for the whole city, however many reports it has:

```bash
S=.claude/skills/populate-pension-and-expenses/scripts
for y in $(seq 2015 2025); do pdftotext -layout {scratch}/{id}-fy$y.pdf {scratch}/{id}-fy$y.txt; done
python3 $S/extract-statements.py {scratch}/{id}-fy*.txt > {scratch}/extracted.json   # ALL dumps, one call
python3 $S/extract-statements.py {scratch}/{id}-fy2025.txt --summary                  # orient on ONE report
```

**Write the JSON to a file and query it; do not `--summary` the whole city.** `--summary` is for
orienting yourself on ONE report — what tables that city has, which flags fire. Across a whole
manifest it is the most expensive thing in the job: measured on Forney's 11 reports it printed
11,456 characters, 62% of every byte that run spent on tool results. Querying the JSON with a few
lines of Python costs a fraction and gives you the values themselves rather than a description of
them. Pass `--table soa` (or `funds`/`rsi`/`mda`/`stat`) to narrow further.

**Do this before reading any table by hand.** The find-then-read loop is what the job actually
spends: you cannot batch a read whose anchor you only learn from the previous read, anchors are not
portable between years (`^REVENUES` lands in the table of contents in one report, `Total
Expenditures` fails to match in the next because OCR ate the spacing), and each miss costs a whole
turn that re-reads the entire transcript. `extract-statements.py` does find-then-read inside one
process, for every report at once.

It emits the SoA function rows, the governmental-funds expenditure block and tax rows, both RSI
schedules (with each block's basis header VERBATIM, because measurement-year-vs-fiscal-year is
city-specific and it must not be guessed) and the MD&A condensed table. It decides nothing: every
figure is verbatim and every check it fails is reported rather than repaired. Treat its output as a
first draft to verify, not as an answer — then `show-table.py` the specific rows it flags.

Take its flags seriously; on the Forest Hill run each one was a real defect:

| Flag                                    | What it means                                                                                                                                                                                                                                                                                                                                             |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `health: scan` / `health: mojibake`     | OCR the PDF. Mojibake = plenty of text, none of it English (a broken ToUnicode map); it passes any naive "has text?" test. If a page comes back garbled after OCR, it is landscape — re-OCR that page with `sips -r 90`.                                                                                                                                  |
| `CHECK_FAIL` (soa)                      | rows do not sum to the report's own printed total. Cross-check the MD&A: Forest Hill FY2016 is off by $1 in the ACFR itself, and the MD&A rows foot exactly.                                                                                                                                                                                              |
| `TOTAL_UNREADABLE`                      | the total line is damaged. It is refused rather than returned, because a partly-parsed total is a plausible wrong number.                                                                                                                                                                                                                                 |
| `COLUMN_SUSPECT`                        | the statement is split across two pages, so the rightmost column is ONE FUND, not Total Governmental Funds. Such a column reconciles perfectly — this is the only check that sees it.                                                                                                                                                                     |
| `UNPARSED_ROWS`                         | a row carries digits but no parsable figure, almost always OCR writing the thousands separator as `.`. It names the line. Do NOT accept the obvious repair: FY2023's `71.869` was really 77,869.                                                                                                                                                          |
| `CHECK_FAIL` (funds)                    | current+debt+capital does not equal the printed total; the delta usually names the dropped row outright.                                                                                                                                                                                                                                                  |
| `generalRevenues.UNRESOLVED`            | the SoA prints its general-revenue LABELS on one page and the figures on the facing page, and the figure block could not be located by proof. Read those rows yourself; never count down the facing block from the top, because it BEGINS with one net-(expense) row per function. When it does resolve, `_proof` names the printed total that proves it. |
| `WRONG_TABLE_SUSPECT`                   | the chosen expenditures block totals wildly unlike the same report's Statement of Activities, so it is probably not the fund statement at all. Only comparing the two bases sees this -- each table checks out on its own terms.                                                                                                                          |
| `continuationPageMerged` (not an error) | the statement's columns spilled onto a second page and the Total Governmental Funds column was read from there, aligned positionally. Alignment is refused unless both pages hold the same number of rows.                                                                                                                                                |

A report holds several blocks that open `EXPENDITURES` and close `Total Expenditures`, and the wrong
ones are not obviously wrong: a **budgetary comparison schedule**'s variance column foots exactly as
the real statement's Total column does, and the statistical section's **General Governmental
Expenditures by Function, Last Ten Fiscal Years** foots per column too -- but its columns are YEARS,
not funds. Both are rejected as `funds` by header signature — the statistical table is instead
parsed properly under its own kind, `stat`.

**`stat` is the cheapest source in the job and the most dangerous.** One ten-year table carries every
year, so a city with a statistical section needs a handful of reads rather than one per year. The
danger is that its columns are YEARS and the year header is re-typeset on every page the table
spans, so a page headed with the wrong years still sums to its own totals and nothing inside that
page can see the error. The parser therefore reports **each page's year header separately and
verbatim** and flags when one table's pages disagree:

| `stat` flag                               | What it means                                                                                                                                                                                                                                                                                                               |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `year N appears in the header on BOTH...` | two pages of ONE table claim the same year — a page header is mis-keyed (this is the Duncanville case).                                                                                                                                                                                                                     |
| `not a contiguous run`                    | the same error wearing a different hat.                                                                                                                                                                                                                                                                                     |
| `NOT aligned` + `unalignedPages`          | `pdftotext` split a long row across lines or dropped an all-zero row, so the continuation page cannot be aligned positionally. Both pages' rows come back under `unalignedPages` — align them by section order yourself, in the SAME call. Never guess an offset here; it would shift every figure onto a neighbouring row. |

Two layouts come back. Years-as-COLUMNS (Changes in Net Position, Changes in Fund Balances) gives
`rows[].byYear`. Years-as-ROWS (Tax Revenues by Source) gives `byYear[year] = [cells in printed
order]` — the parser does NOT name those columns, so read `columnHeader` and map them yourself.

**Cross-check the stat tables against each other and against the audited statements.** They
disagree in real reports: Forney's Table 3 prints the MODIFIED-accrual property tax for FY2022
(14,954,167) while Table 2 and the audited SoA both say 15,063,814. Whenever two printed sources
differ, the audited statement wins.

Use `show-table.py` to eyeball anything the extractor flags, or a table it does not model —
statistical-section tables, hotel-fund schedules, the footnotes that drive
`lib/expense-category-groups.ts`. It costs roughly half the tokens of `sed`, because
`pdftotext -layout` spends most of its bytes on column padding:

```bash
S=.claude/skills/populate-pension-and-expenses/scripts
python3 $S/show-table.py {scratch}/{id}-fy{year}.txt --list
python3 $S/show-table.py {scratch}/{id}-fy{year}.txt --find 'Schedule of Changes in Net Pension' --occurrence 2 --lines 46 \
    --rows 'ending of year|net position - ending|% of TPL|Covered payroll'
python3 $S/show-table.py {scratch}/{id}-fy{year}.txt --from 'Functions/Program' --to 'TOTAL PRIMARY GOVERNMENT'
```

Every figure and label it prints is verbatim, so it cannot change what you extract. It prints
`orig-line: text`, drops content-free lines, and squeezes column padding only when it can prove
alignment carries no information (all figure-bearing rows the same width) — otherwise it says so and
prints aligned. `--occurrence` disambiguates an anchor that also appears in the table of contents,
and tells you when there is more than one match; getting it wrong wastes a turn, so pass it.

**`--rows` when you know the row names, full table when you don't.** The two RSI schedules yield 3–4
stored rows out of ~26, so filter them (−80% tokens; the title/basis/year-header block is never
filtered, and it reports how many rows it hid). Read the two statistical tables UNFILTERED — you need
to see every function row, the footnotes that flag renames, and whether a row you expected is absent.

| Table (one dump, one pass)                                                      | Fills                                                                  |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| RSI **Schedule of Changes in Net Pension Liability and Related Ratios**         | `(a)` → `totalPensionLiability`, `(b)` → `fiduciaryNetPosition`        |
| RSI **Schedule of (City/Town) Contributions**                                   | `actuariallyDeterminedContribution`, `actualContribution`              |
| Statistical **Changes in Net Position** (accrual)                               | `fullAccrualExpenses` + the tax rows                                   |
| Statistical **Changes in Fund Balances, Governmental Funds** (modified accrual) | `modifiedAccrualExpenditures`                                          |
| The hotel/motel special-revenue fund schedule (per conventions)                 | `hotelTaxRevenue`, when the city isn't a big-city general-revenue case |

**Per-year statements are the FALLBACK + cross-check** for the expense half (a year outside every
statistical window, or a table that collapses categories). Locate fast:
`grep -n "Functions/Programs"` → government-wide SoA; `grep -n "EXPENDITURES:"` → governmental-funds
statement (rightmost **Total Governmental Funds** column). If you are already pulling every report
for hotel tax, cross-check each year's rows against its audited statements while the dump is open —
it costs nothing extra and it is the only thing that catches a mis-keyed statistical column.

**Verifying statistical TOTALS is not enough.** A mis-keyed column sums to the right total (its
values are the right year's, just on the wrong labels), so it survives every arithmetic check.
Compare per-ROW against the audited statement, or lean on the ratio-stability WARN from step 0's
`audit-expenses.mjs`. Assume the statistical table is wrong and the audited statement is right when
they disagree; a stat table can also contradict its OWN report's audited statements (Colleyville
FY2020 does, in both directions).

**A statistical table's two PAGES can be headed with different years.** The `Changes in Net Position`
table spans several pages, and the year headers are re-typeset on each one. Duncanville's FY2024 ACFR
heads the expenses page 2015–2018 (right) and the general-revenues page 2014–2017 (wrong — it holds
the same four years), so its "2014" column IS FY2015 and the tax rows silently shift a year. Nothing
on that page can see it: the column sums to its own page totals. **Never read the tax rows off a
header you last checked on a different page** — re-read the header on the page the taxes are printed
on, and stage `_printedModAccrualTaxes` (step 5a) so `verify-extraction.py` proves the attribution.

**Read the statistical footnotes** — they flag function renames/combines across the 10 years, which
is what drives the `lib/expense-category-groups.ts` entry (step 3c).

## 2. Extract the pension half (the five traps)

**a. Year labeling differs by city.** TMRS cities and Fort Worth head the NPL schedule with
**Measurement Year** (Dec 31), so `MY = FY − 1` — MY2024 is FY2025. Dallas heads it with fiscal
year. Worse, the two schedules can disagree _within one report_: Addison's NPL schedule is
measurement-year while its contributions schedule is fiscal-year. Read the column header every
time; taking columns at face value misdates the whole series by a year.

**b. Continuation pages have no row labels.** Dallas and Haslet print the 4 most recent years with
labels, then the remaining 6 as bare numeric columns on the next page. Parse positionally by offset
from the labeled block, then prove it (step 4).

**c. `Contributions - City` in the NPL schedule is NOT what the city spent.** It's on the
measurement-date basis. Always take contributions from the **Schedule of Contributions**. Covered
payroll differing between the two schedules for the same year is the tell that they cover different
twelve-month windows.

**d. A plan can have no ADC at all.** Dallas Police & Fire FY2016 reports only a
`Statutorily required contribution`, met 100%, while the plan sat at 28% funded. Omit
`actuariallyDeterminedContribution` for that plan-year so the coverage line renders a gap — never
coerce it to the statutory figure, which would score the worst year as fully compliant.

**e. Coverage above 100% is real.** Carrollton over-contributes every year (108–119%). Don't cap,
don't treat >100% as an extraction error.

**Units.** Large cities print RSI `(in 000's)` — Dallas and Fort Worth do. The repo stores **whole
dollars** (the small TMRS cities print whole dollars already), so multiply by 1000. Check the
schedule header; getting this wrong is a silent 1000× error that still passes the step-4 ratio
check, since the ratio is unit-invariant. Sanity-check the magnitude against `totalRevenue` for the
same year.

**Multi-plan cities.** Most cities are a single TMRS plan. Dallas has an Employees' Retirement Fund
plus Police & Fire; Fort Worth has its own Employees' Retirement Fund. Store one array entry per
plan per year — the chart draws one line per plan and does not aggregate. Dallas's Police & Fire
**Supplemental Plan** was deliberately dropped (216 members, 0.8% of DPFP liability); don't re-add
it without being asked.

## 3. Extract the expense/tax half (see conventions for the exact table + line rules)

- **fullAccrualExpenses[]**: one `{ name, value }` per governmental-activities function row of the
  Statement of Activities EXPENSES column, INCLUDING the "Interest on Long-Term Debt" row as the
  last entry. Names verbatim (conventions "take the table as presented"). Self-check: the values sum
  to the table's own "Total governmental activities" expenses line — check it against the PDF as you
  transcribe; that total isn't stored, so `audit-expenses.mjs` can't re-check it for you.
- **modifiedAccrualExpenditures{}** (Total Governmental Funds column of the stat table / fund stmt):
  `current[]` = each row under **Current:** ({name,value}, names verbatim);
  `debtService` = `{ principal, interest }` from the **Debt Service:** rows, plus two optional keys
  that follow the same "which section is it printed in?" test — record only when the line sits among
  the Debt Service rows INSIDE Total Expenditures, omit when the city books it under Other Financing
  Sources/(Uses): `refundingEscrow` = "Payment to refunded bond escrow agent" (Dallas yes, Addison
  no) and `issuanceCosts` = "Bond issuance costs" (Princeton yes);
  `capitalOutlay` = the SUM of the rows under **Capital Projects / Capital Projects and Outlay:**
  (cities split it into Engineering/Contractual + Construction/Equipment — add them);
  `total` = the "Total Expenditures" line.
  Self-check: `current + principal + interest + (refundingEscrow ?? 0) + (issuanceCosts ?? 0) +
capitalOutlay == total`. **This check passes on a mis-keyed column** — the values are the right
  year's, merely on the wrong labels — so it proves arithmetic, not attribution. A row that looks
  implausible against the same year's accrual figure (a Municipal court costing more than Police)
  is the real tell; confirm against the audited statement.
- **tax fields**: per conventions "Tax revenue fields".
- **Match an existing city's own convention.** If tax fields already exist for the recent years,
  find where those exact values came from (SoA general revenues vs the statistical "Tax Revenues by
  Source" schedule — Addison uses the schedule's "1% Town Sales Tax", modified accrual) and source
  the missing years the SAME way, so the series is internally consistent. Report, don't "fix", a
  pre-existing inconsistency in the already-present years.

### 3c. Function-name drift → lib/expense-category-groups.ts

If a city renames/splits a function across years (audit-expenses.mjs WARN, or you see e.g. "Culture
and Recreation" one year and "Parks and Recreation" the next), the chart shows them as separate
categories. Add a `{id}` entry to `lib/expense-category-groups.ts` mapping each raw label → one
display bucket, as `dallas` does. If names are stable across all years (Addison), no entry is needed.

**`notes` are for merges a reader would otherwise misread** — one function's dollars moving into a
differently-named bucket (Leisure services folded into Community services; Housing services split out
in FY2015 and combined after), a bucket that swallows a member you would not expect in it (municipal
court or code enforcement landing under Public safety), or a bucketing that was a judgment call you
want on record. Write the note for those.

**Do not write a note for a mapping a reader can already guess.** Two standing cases:

- **The interest row.** "Interest on long-term debt" / "Interest and fiscal charges" / "Interest and
  fiscal agent fees" / "Interest expense" all name the same single statement line — map them and say
  nothing. `"Interest and fiscal charges": "Reported as 'Interest on long-term debt' through FY2019"`
  is noise.
- **Police / Fire / Emergency Services → Public safety.** Cities split and recombine these constantly
  and the grouping is self-evident from the mapping itself. Map them silently. Only note the bucket
  when it also absorbs something outside that set (e.g. Municipal court, Code enforcement).

Cosmetic relabels of one line need no note either ("Community develop." → "Community development",
"Public service" → "Public works"). Rule of thumb: if the mapping changes only the wording, or merges
labels any reader would expect together, it needs no note. An entry with only such mappings gets
`notes: {}`.

## 4. Prove the pension parse before writing

The printed funded ratio is an independent check on every TPL/FNP pair — it catches a misaligned
continuation page and an off-by-one year mapping. **Don't do that arithmetic yourself:** stage each
plan-year's printed percentage as `_printedFundedRatio` and let step 5b's `verify-extraction.py`
recompute all of them. A disagreement means the parse is wrong — fix the parse, never round to make
it agree. The ratio is unit-invariant, so it cannot see a thousands-scaled RSI; the same script
checks that separately against the year's revenue.

## 5. Stage → prove → write — one edit, one build

Do NOT hand-edit the `.ts` and do NOT write a throwaway generator. Stage everything as JSON, prove
it, then let the writer emit it — the writer enforces field order, numeric separators, NEVER
OVERWRITE and NEVER GUESS mechanically, so none of those depend on remembering them mid-run.

**a. Stage.** One JSON for the whole city (shape in `verify-extraction.py`'s docstring). Alongside
each year's real values, stage the PROOF INPUTS you read off the PDF — `_printedFundedRatio` per
plan-year, `_printedTotalGovActivities` per year, and `_printedModAccrualTaxes`
(`{property, sales, hotel}`, the tax rows of the modified-accrual table's revenue block, which sits
directly above the expenditure block you are already transcribing). Keys starting `_` are checked and then
discarded, never written. A field the city genuinely never levied is staged as `null` (a DELIBERATE
omission), which is reported separately from a gap.

**b. Prove, before anything is written:**

```bash
python3 .claude/skills/populate-pension-and-expenses/scripts/verify-extraction.py {scratch}/staged.json \
    --extracted {scratch}/extracted.json      # run from the REPO ROOT
```

Pass `--extracted` (extract-statements.py's JSON) whenever you have it — it adds the strongest tax
check there is: every staged tax field against that year's **audited Statement of Activities**
general revenues. Same basis, same year, same audited statement, so a mismatch is an error, not a
basis difference, and it FAILs. That check is what catches a statistical table disagreeing with the
audited statements — Forney's Table 3 prints FY2015 property tax as 7,698,456 where the SoA says
7,627,533, and nothing else in the script could see it.

Two mismatches are legitimate and must be DECLARED, not silenced:

- The SoA line bundles another tax. Many cities book hotel tax inside the government-wide
  "Sales Taxes" line, so `salesTaxRevenue` is stored net of it — the check spots this itself and
  says the gap is exactly that year's hotel tax.
- The city's stored convention is deliberately a different source (Addison stores the statistical
  schedule's modified-accrual "1% Town Sales Tax").

Declare either with a top-level `"_taxConvention": "<why, with the arithmetic>"` in the staging JSON,
which turns those mismatches into reported notes. An empty reason is refused.

It checks five things: each plan-year's printed funded ratio against your TPL/FNP (catches a misread
column or off-by-one year mapping); `fullAccrualExpenses` summed against the printed
governmental-activities total; the `modifiedAccrualExpenditures` reconciliation; pension magnitude
against the year's revenue (the silent 1000× thousands-scaled-RSI trap the ratio check cannot see);
and the cross-basis ratio check — the only thing that catches a mis-keyed statistical column — which
also proves each year's TAX row came from that year's column. Sales and hotel are near-identical on
both bases, so a row fitting a NEIGHBOURING modified-accrual column is a shifted page header, not a
basis difference: that signature FAILs, while a merely unexplained gap reports `UNPROVEN`.
`UNPROVEN` means you staged no proof input — go get it rather than proceeding blind.

**c. Write** (refuses unless (b) passes; `--dry-run` to preview):

```bash
python3 .claude/skills/populate-pension-and-expenses/scripts/write-city-fields.py {scratch}/staged.json
```

Then verify in **ONE** Bash call (format → both audits → typecheck → build), not five:

```bash
npx prettier --write data/acfr-json/{id}.ts && npx prettier --check data/acfr-json/{id}.ts
node .claude/skills/populate-pension-and-expenses/scripts/audit-expenses.mjs {id}; python3 .claude/skills/populate-pension-and-expenses/scripts/audit-pension.py {id}
npx tsc --noEmit 2>&1 | grep -iE "{id}|acfr-json"; npm run build 2>&1 | tail -5
```

Expect no GAPS (or only genuinely-unsourceable years, which you report), `reconciliation ✓`,
plausible funded ratios, no anomalies. Add `lib/expense-category-groups.ts` to the prettier line if
you edited it. The `tsc` grep should print nothing — pre-existing errors in `city-map.tsx` /
`ui/chart.tsx` are unrelated. Build ONCE, after both halves are written.

- Optionally `npm run dev` and load the city: the two stacked-bar expense charts should render
  fully, and the two pension charts at the end of "Financial Metrics Over Time" show one legend
  entry per plan. Pension charts appear only when `pensionPlans` exists, so no other city changes.

## 6. Report

One summary covering both halves: fields × years filled; plans found and the year-labeling
convention each report used (measurement vs fiscal); which ACFRs and which tables everything came
from (and whether a third PDF was needed, with why); the step-4 verification result; any year or
plan-year left as a gap (why, what the user must supply); any name-drift grouping added; and any
pre-existing value you flagged but did NOT change. Never report a guessed value as sourced.
