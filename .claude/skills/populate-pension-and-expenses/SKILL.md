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

**Why merged:** both halves live in the SAME two ACFRs (latest + FY2024) — pension in the RSI
10-year schedules, expenses/taxes in the statistical-section 10-year tables. Fetch and
`pdftotext` each report ONCE, grep all five tables out of the same text dump, write one edit, run
one build. Never fetch or convert a PDF twice.

## Core rules
- **NEVER GUESS.** Every value written comes from a PDF you actually read. A figure you can't source
  cleanly is left OUT (omit the key for that year) and reported — never estimated.
- **BATCH EVERY CALL.** Each tool call re-reads the whole context, so a turn costs ~75K tokens
  whatever it does — turn COUNT, not output size, is what this job spends. A measured run cost 5.6M
  cache-read tokens across 55 turns; the same work in 12 turns costs 1.2M. So: one Bash call per
  STEP, not per command (`;`-join them), all five table reads in ONE call, and `--rows` (below) on
  any table where you already know which rows you need. Getting an argument wrong costs a whole
  turn — check `--occurrence` and anchors before sending.
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
  - *modified/accrual ratio Nx that function's median* → a year's statistical column was probably
    mis-keyed onto the wrong labels. It reconciles against the printed total, so this is the ONLY
    check that sees it. Re-source that year from the audited statements.
  - *fullAccrual interest vs debtInterest* → the statistical table is diverging from the audited SoA
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

| Report | Covers |
| --- | --- |
| latest ACFR (e.g. FY2025) | FY2016–2025, all fields |
| FY2024 ACFR | FY2015 (its 10-yr window reaches back one further) |

**…for every field EXCEPT `hotelTaxRevenue` — settle that one BEFORE you fetch.** There is no
10-year hotel table. Which of three cases the city is in decides the whole fetch budget:

| Where hotel tax lives | Reports needed |
| --- | --- |
| government-wide general revenue (big-city / convention-center case) | 0 extra — same table as property + sales |
| the fund's budget-vs-actual schedule (actual + prior-year columns) | ~6 (2 years each) |
| the special-revenue **combining** statement (1 year/report) | **every ACFR in the manifest** |

Colleyville, McKinney, Grand Prairie, Balch Springs are combining-statement cities — 11 reports, not
two. Check the latest report for which case applies, then fetch once for the whole job.

Convert each report ONCE to a text dump you keep for the whole session:

```bash
pdftotext -layout {report}.pdf {scratch}/{id}-fy{year}.txt
```

Then read all five tables out of that SAME dump **in one Bash call** — `show-table.py` costs roughly
half the tokens of `sed`, because `pdftotext -layout` spends most of its bytes on column padding:

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

| Table (one dump, one pass) | Fills |
| --- | --- |
| RSI **Schedule of Changes in Net Pension Liability and Related Ratios** | `(a)` → `totalPensionLiability`, `(b)` → `fiduciaryNetPosition` |
| RSI **Schedule of (City/Town) Contributions** | `actuariallyDeterminedContribution`, `actualContribution` |
| Statistical **Changes in Net Position** (accrual) | `fullAccrualExpenses` + the tax rows |
| Statistical **Changes in Fund Balances, Governmental Funds** (modified accrual) | `modifiedAccrualExpenditures` |
| The hotel/motel special-revenue fund schedule (per conventions) | `hotelTaxRevenue`, when the city isn't a big-city general-revenue case |

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
year. Worse, the two schedules can disagree *within one report*: Addison's NPL schedule is
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
python3 .claude/skills/populate-pension-and-expenses/scripts/verify-extraction.py {scratch}/staged.json
```

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
