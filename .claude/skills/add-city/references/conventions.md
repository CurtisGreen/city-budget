# Field conventions (not derivable from code)

## Source discovery
PDF enumeration, wrong-city + FYE verification, Wayback/CDX + Cloudflare recovery, the
budget-book-up-front rule, and the read strategy (latest-covers-FY-1, every-other-report,
oldest-for-earliest-year) live in **SKILL.md §2 (a/a1/a2/b)** — not repeated here. The sections
below are the per-FIELD source rules.

## Fast sources (which table gives which field)
Prefer these condensed/statistical tables over reading full statements year-by-year — each gives
many years, or both current + prior, at once:
- **MD&A "Condensed Schedule of Net Position" (Table 1)** — gives the 5 balance-sheet
  aggregates (Current & Other Assets, Capital Assets, Deferred outflows, Total Liabilities,
  Deferred inflows) as **Total Primary Government, current + prior year**. One table = 2 years.
- **Statistical "Changes in Net Position" (10-year)** — gives, for ~10 years in one table:
  total program revenues, Operating grants, Capital grants (sum gov + business for TPG),
  expenses, and General Revenues (property tax, sales tax). `Total revenues = TPG program
  revenues + TPG general revenues`. **CAVEAT: use it for TOTALS, not for the operating-vs-capital
  grant SPLIT** — take the split from the MD&A "Changes in Net Position" table or the audited
  Statement of Activities (see the Pitfalls entry for why, and the Carrollton case).
- **Statistical "Direct and Overlapping Property Tax Rates" (10-year)** — M&O (Operating)
  and I&S (Debt Service) rates for ~10 years at once, already as decimals per $100.
- **Statistical "Changes in Fund Balances" / sales-tax history note** — pure Sales tax per
  year; the sales-tax note's "Town" column (e.g. 1.25%) is the town's sales-tax revenue and
  matches the government-wide Sales taxes line.
- **Note 5 (Capital Assets)** — the 4 capital fields; see pitfall below.

## Smaller cities publish an AFR (no statistical section) — different workflow
Many small cities file a basic **"Annual Financial Report" (AFR)**, not a full ACFR. Detect it
FIRST (saves the most time): the PDFs are small (~0.3–0.9 MB, ~90 pages) and have **no
statistical section** — `grep -ci "direct and overlapping|last ten fiscal years|assessed.*actual
value"` returns 0. There are then NO 10-year tables for rates / changes-in-net-position. Don't
hunt for them. Instead, every AFR carries TWO condensed 2-year tables in the MD&A — these replace
the statistical section:
- **Condensed Statement of Net Position** — 5 balance-sheet aggregates (TPG, current + prior).
- **Condensed Changes in Net Position** — total revenues, Operating grants, Capital grants,
  governmental interest (labeled "Interest and fiscal charges"), and "Taxes and fees"
  (= property + sales + franchise combined) — all TPG, current + prior. This is the flows
  source the missing statistical "Changes in Net Position" would have been.
So the every-other-report cadence still works, now covering BOTH balance sheet AND flows. Capital
note (4 gross fields) is still the roll-forward (beginning = prior, ending = current). The per-year
property/sales SPLIT (for revenues[]) is NOT in the condensed "Taxes and fees" line — read the
General Revenues rows (property tax, sales tax separately) of that year's government-wide
Statement of Activities.
- **A missing middle-year report is recoverable for FREE** from the NEXT report's MD&A 2-year
  condensed tables (prior-year column) + capital-note beginning balances — both balance sheet and
  flows. Don't leave a gap or chase a report that doesn't exist; confirm it's truly absent (CDX
  both domains), then pull it from the neighbor.
- **Cities often have two domains** (e.g. `cityofbalchsprings.com` = old, `balchspringstx.gov` =
  new). The live new site drops old reports, but a CDX enumeration of the OLD domain's
  `DocumentCenter/View/*` lists every removed AFR id cleanly — grep the CDX for `AFR`.

## Pitfalls (cost real time / cause silent errors)
- **Capital fields are GROSS, from Note 5 — not Table 4.** Note 5 "Total ... not being
  depreciated" (land + CIP) and "Total ... being depreciated" (the line BEFORE "Less
  accumulated depreciation") are gross cost. The MD&A "Capital Assets at Year-end" (Table 4)
  is NET — wrong source. Sanity: gov(not-being)+gov(being) should far exceed the net
  `capitalAssets` aggregate. Note 5 gives beginning(prior)+ending(current) per report.
- **Two recurring `being depreciated` extraction bugs (both silently corrupt Asset Life).**
  (1) *Net captured instead of gross* — the "being depreciated, net" subtotal (after "Less
  accumulated depreciation") gets grabbed instead of the gross "Total capital assets being
  depreciated" line above it (Addison FY2025 biz col: recorded the 93.9M net, should be the
  183.1M gross). (2) *Buildings sub-line dropped* — Note 5 lists the governmental depreciable
  assets as separate rows (Buildings + Infrastructure + Improvements + Machinery/equipment);
  capturing only the Infrastructure/improvements/equipment total and omitting the Buildings row
  understates the column (Lancaster FY2015 **and** FY2016 each omitted the same $24,487,196
  Buildings line). Sanity per year: the "being depreciated" gross must equal the SUM of every
  depreciable sub-row, and the year-over-year progression should be smooth — a lone low year is
  the tell. **A wrong cell here masquerades as a derived-metric "jump."**
- **High Asset Life is often GENUINE, not a mis-key — classify before "fixing".** A ratio
  above the 0.40–0.80 chart range across ALL years, smoothly rising, is the signature of a
  hyper-growth city with a very young asset base (large developer-contributed new infrastructure,
  heavy CIP), not an error — Celina runs 0.81→0.92 every year, legitimately ($172.9M developer-
  contributed infrastructure in FY2025 alone). What IS a bug: a LONE spike/dip that breaks the
  smooth progression, or net capital exceeding gross. Verify a suspect against Note 5/6 before
  touching it; a smooth all-years-high series is real.
- **The MD&A condensed tables are the dataset's SOURCE OF TRUTH — do NOT override them with audited
  figures over mere presentation differences.** The dataset's balance-sheet aggregates come from
  the MD&A **"Condensed Schedule of Net Position"** table and flows from the MD&A **"Changes in Net
  Position"** table, WITH THEIR ROUNDING (usually thousands). Keep the data consistent with those
  across all cities — do not swap in audited government-wide figures just because they differ.
  Reason: MD&A and audited often present the SAME totals with different internal grouping (e.g.
  Carrollton FY2019 — the MD&A condensed shows deferred outflows 38,404 / inflows 11,327 while the
  audited SNP groups them 28,086 / 1,009; BOTH tie to the identical net position, so it's a grouping
  difference, not an error → keep the MD&A condensed value). Only re-source from the audited
  statement when the MD&A value is **actually impossible / fails an identity** — net capital > gross,
  `Current&Other + Capital ≠ Total Assets`, `TA + Def.out − Liab − Def.in ≠ Net Position`, or
  `Total revenues ≠ expenses + change in net position` (that's the Celina restricted-cash mislabel
  and the Southlake mis-keyed-Totals case). Self-consistent grouping differences: keep MD&A.
  Identity-violating values: fix from audited. Run the identities to tell which case you're in.
- **The 10-year STATISTICAL "Changes in Net Position" table can misclassify the grant op/cap
  SPLIT** even when the MD&A "Changes in Net Position" table and audited SoA agree — so it is NOT a
  safe tiebreaker for the split. Carrollton FY2016: the statistical table put a $557,072 Golf
  *capital* grant on the *operating* row; the MD&A Changes table AND the audited SoA both had it as
  capital (biz operating grants = 0). For the operating-vs-capital split, trust the MD&A "Changes
  in Net Position" table / audited SoA, never the statistical 10-yr table.
- **Interest: take it from each year's Statement of Activities expenses section, never the
  statistical table.** The statistical "Interest on long-term debt" row can be restated/negative
  and disagree (e.g. Colleyville FY2020 SoA 234,986 vs statistical 240,231). Sum the interest
  line(s) the SoA breaks out — governmental + any separately-stated business-type interest (see
  the `debtInterest` field rule). The MD&A "Summary of Changes in Net Position" condensed table is a fine,
  faster source only if it keeps those same interest line(s); if it folds interest into totals,
  use the full Statement of Activities.
  - **That disagreement is rarely confined to the interest row — treat it as a WHOLE-YEAR flag.**
    When `audit-expenses.mjs` WARNs that a year's `fullAccrualExpenses` interest entry differs from
    its stored `debtInterest`, the statistical table is diverging from the audited SoA for that
    year generally, and the other function rows can be off without anything surfacing it. Re-source
    that year's ENTIRE row set from the audited SoA, not just the interest line. Colleyville FY2020:
    the WARN fired on interest (240,231 vs 234,986) but General government was ALSO off by 2,518
    (stat gov-activities total 31,808,718 vs audited 31,805,991), and only the interest half showed.
- **A tiny interest figure is often CORRECT, not a data error.** If a city's bonded debt
  sits in **business-type/enterprise (water-sewer) funds**, that interest is buried inside the
  enterprise function expenses and the SoA may show only a small governmental "Interest and
  fiscal charges" line (~$30–40K) — take that small line as-is; do NOT reconstruct the buried
  business interest from the notes. It stays small until the city issues its first governmental
  GO/CO debt — then it jumps (Duncanville: ~$28–42K/yr through FY2018, then $794K in FY2019 after
  a $20.7M GO issuance). Don't "correct" the low years or annotate the jump as a mystery.
- **GASB 87 leases (adopted ~FY2022) restate the prior year's capital "being depreciated"
  gross** to add right-to-use lease assets — so report N+1's beginning balance won't tie to
  report N's ending (the prior-year gross is restated upward by the new lease assets). Apply
  latest-wins. Not an error; don't chase it.
- **MD&A "Totals" columns can be mis-keyed — verify `gov + business == total`.** Southlake's
  FY2023 MD&A deferred-outflows/inflows Totals were off by 314,383 (the per-activity columns
  were correct). When it doesn't tie, fall back to the government-wide **Statement of Net
  Position** for that year's 5 balance-sheet aggregates — the same exception route as the
  mislabel case below, not a change of default.
- **The MD&A "Condensed Net Position" table can mislabel total NONCURRENT assets as
  "Capital assets, net"** — folding restricted cash/investments into the capital row. The tell:
  net "Capital Assets" ends up **> gross** capital (impossible), and/or `Current and Other Assets`
  no longer equals `Total Assets − net capital`. It can be inconsistent BETWEEN activities in the
  same table (Celina FY2025: governmental row lumped $164,222,050 restricted cash into capital
  while the business row didn't). **This is an EXCEPTION to the MD&A-is-source-of-truth rule above,
  not a competing default** — when the tell fires for a city-year, re-source THAT year's 5
  aggregates from the **audited government-wide Statement of Net Position**; when it doesn't, keep
  the MD&A condensed values with their rounding. The audited statement lists restricted cash on its
  own line under Noncurrent, separate from "Capital assets, net", so `Capital Assets` = the capital
  line(s) only and `Current and Other Assets` = Total Assets − that. Verify: net capital
  `<= gross`, and it equals the capital-note ending balance and (where the optional
  `capitalAssetsNetofDepreciation` field is populated) that field.
- **The capital-assets note number varies (Note 4 vs Note 5) and MD&A layout varies by year.**
  Recent reports give MD&A condensed tables with current+prior **Totals** columns; older ones
  split into separate single-year gov/business/total tables — read each by position, don't
  assume a fixed layout.
- **Deferred inflows may be absent in early years = 0.** Some early government-wide
  Statements of Net Position have no Deferred Inflows section at all → record 0 (sourced).
  Do NOT confuse with the fund-level balance sheet's deferred inflows (unavailable revenue),
  which is eliminated at the government-wide level.
- **Exclude component units.** EDC/CDC/TIRZ columns sit beside Primary Government on every
  statement and inside Note 5; never include them in TPG figures.
- **pdftotext layout artifacts.** Words get stray spaces (`Gov ernment`, `serv ice`,
  `I nterest`); grep loosely. Statistical tables often split row labels and year-columns
  across facing pages (labels on left page, numbers-only on right) — read by row position.

## Fields <- ACFR location
Field names and which are optional `?` come from `lib/types.ts`. Sources per field:
- `currentAndOtherAssets`, `capitalAssets`, `deferredOutflows`, `liabilities`,
  `deferredInflows` -> the MD&A **"Condensed Schedule of Net Position"**, with its rounding
  (usually thousands) — the default, per the Pitfalls entry. Fall back to the audited
  government-wide **Statement of Net Position** (search "Current and other") only for a year where
  the MD&A table fails a tell: Totals don't equal gov + business, net capital > gross, or
  `Current and Other Assets ≠ Total Assets − net capital`.
  - **`currentAndOtherAssets` = ALL non-capital assets = Total Assets − net capital
    assets.** This is a two-bucket split (capital vs everything-else), NOT current-vs-noncurrent:
    it INCLUDES noncurrent restricted cash & investments, long-term/notes receivable, net
    pension asset, etc. Do NOT enter just the "Total current assets" subtotal. Cross-check:
    `currentAndOtherAssets + capitalAssets == Total Assets` (PG total column) every year.
    (Frisco FY2025 is the clean reference: 11 non-capital lines summed to CA; $816.5M of it was
    noncurrent restricted cash/investments.)
  - **`capitalAssets` = net book value (net of accumulated depreciation)**, `<= gross` (the sum of
    the 4 gov/business being+not-being-depreciated fields). See the MD&A-mislabel pitfall.
  - **The two net-capital fields feed DIFFERENT formulas and may legitimately differ.**
    `format-chart-data.ts`: `totalAssets = currentAndOtherAssets + capitalAssets`, but
    Asset Life numerator = `capitalAssetsNetofDepreciation || capitalAssets`
    ÷ gross (the 4 capital fields). So:
    - **`capitalAssets`** = the WHOLE balance-sheet "capital assets, net" from the
      Statement of Net Position, INCLUDING GASB 87 right-to-use lease assets and GASB 96 SBITA
      (subscription IT) assets. This keeps `currentAndOtherAssets + capitalAssets == Total Assets`.
    - **`capitalAssetsNetofDepreciation`** is the Asset Life numerator and must sit on the SAME
      basis as the 4 gross fields. Those are the owned land/buildings/equipment/infrastructure
      from the capital note and EXCLUDE right-to-use lease/SBITA assets — so this field must
      exclude them too, keeping the right-to-use amount out of BOTH numerator and denominator
      (a clean ratio, comparable across pre-/post-GASB-87 years).
    - Therefore in lease years **`capitalAssets` exceeds `capitalAssetsNetofDepreciation` by
      exactly the net lease + SBITA assets** — this is CORRECT, not a mis-key. Do NOT "reconcile"
      them by forcing equality (that pushes right-to-use into the Asset Life numerator while gross
      omits it, or misfiles leases into `currentAndOtherAssets`). Carrollton FY2023: 648,211,000
      incl. $9.27M lease+SBITA vs 638,944,000 excl. — both right. Contrast the Celina pitfall
      below, where the gap exists because restricted CASH (a non-capital asset) was wrongly folded
      into capital — that IS an error. Distinguish by reading the audited SNP: is the gap
      right-to-use lease/SBITA (fine) or restricted cash (bug)?
- `totalRevenue`, `operatingGrantsAndContributions`, `capitalGrantsAndContributions`
  -> Statement of Activities (usually 1–2 pages after Net Position).
  - **`totalRevenue` = TPG program revenues + TPG general revenues** (transfers net to 0 at
    the total-PG level, so the "general revenues and transfers" total is fine as-is). CROSS-CHECK
    with the definitional identity **`Total revenues == total expenses + change in net position`**
    (both audited bottom-line figures). This ties for every year; when it DOESN'T, the statistical
    "Changes in Net Position" program/general rows were mis-extracted or internally inconsistent
    (Forney FY2019: a repeated `886,190` "Public services" charge-for-services line inflated
    program revenue but not the change figure). In that case trust `expenses + change` (record
    that value) rather than program+general — the change-in-net-position line is authoritative.
- `debtInterest` -> the interest expense in the **Statement of Activities expenses section** (never
  the statistical table — see the Pitfalls entry). Take the primary-government interest total
  exactly as presented; do NOT reconstruct interest buried inside a functional/enterprise expense
  row from the notes (buried interest is not counted). Nearly always a single "Interest on
  long-term debt" line; on the rare report that splits it (University Park FY2025 = 54,562), take
  the total as presented. Only deviate if the report itself has an error — then use the corrected
  figure and add a note explaining it.
- `government*`/`business*CapitalAssets(Not)BeingDepreciated` -> capital assets
  note; search "not being depreciated" / "depreciable".
- If current-year and prior-year ACFRs conflict, use the LATEST year's number.

### Tax revenue fields (propertyTaxRevenue / salesTaxRevenue / hotelTaxRevenue, ALL years)
> Scope: **add-city** (step 2d) writes these for a new city, every year the acfr-json covers;
> **populate-pension-and-expenses** backfills them into a city added earlier. The FY2024 entry
> doubles as the required `CityInfo.revenueBySource`, so copy it from there rather than
> sourcing it twice.
- `propertyTaxRevenue` = ad valorem; `salesTaxRevenue` = sales — both from the gov general-
  revenues rows of the condensed Changes-in-Net-Position table,
  every year. Cross-check property + sales + franchise == MD&A combined "Taxes".
- `hotelTaxRevenue` = hotel/motel occupancy tax. NOT in the 10-yr statistical revenue table; it
  sits in its own special-revenue fund (often a General "Escrow"/Hotel-Motel fund whose only
  "Taxes" line IS the hotel tax — confirm from the fund's note). Best source: that fund's
  **budget-vs-actual schedule** ("Actual GAAP" column + prior-year column = 2 years/report). If a
  report lacks a standalone schedule (older/smaller years), read the special-revenue **combining**
  statement's "Taxes" row and take the escrow/hotel fund's column (verify the row sums across
  fund columns to the total). Omit years before the city levied it (genuinely 0/none).
  - **This field, not the 10-yr tables, sets your fetch budget — so locate it FIRST.** Pension and
    the two expense breakdowns come from 10-year schedules, so two reports cover the whole series.
    Hotel tax does not: a budget-vs-actual schedule yields 2 years/report (~6 reports), and a
    combining statement yields **1 year/report — i.e. every ACFR in the manifest**. Determine which
    of the three cases a city is (general revenue / budget schedule / combining statement) before
    planning step-1 fetches, rather than discovering it after the "two reports cover everything"
    pass. Colleyville, McKinney, Grand Prairie and Balch Springs are all combining-statement cities.
  - **Big-city exception — hotel tax is a government-wide general revenue.** Cities that run hotel
    tax through an enterprise/business-type activity (a convention center) print "Hotel occupancy
    tax" as its OWN line in the government-wide **general-revenues** section (business-type column)
    — so all three tax fields (property/sales/hotel) come from the SAME MD&A "Changes in Net
    Position" condensed table, current + prior year per report, no special-revenue fund hunt needed.
    Dallas: MD&A table rows `Ad valorem tax` (property), `Sales tax`, `Hotel occupancy tax` — take
    the Total (last) column, ×1000 (table is in thousands). Each report's prior-year column
    cross-checks the neighbor's current column; chaining FY2015→2024 must be self-consistent.

### Expense/expenditure breakdown fields (fullAccrualExpenses, modifiedAccrualExpenditures)
> Scope: **add-city** (step 2e) for a new city; **populate-pension-and-expenses** to backfill a
> city added earlier. Same rules either way.

The two per-year, json-only breakdowns that drive the stacked-bar expense charts (see the
**populate-pension-and-expenses** skill, which backfills these into existing cities). `dallas.ts` is the
reference shape. Both take function/line names **verbatim** ("take the table as presented").

**The two bases are not two views of one number — they include different things.** Never expect
them to TIE, never "reconcile" one to the other, and never source a year's `fullAccrualExpenses`
from a governmental-funds statement (or vice versa):
- `fullAccrualExpenses` = government-wide Statement of Activities, **full accrual**: INCLUDES
  depreciation and actuarial (accrued) pension cost; EXCLUDES capital outlay and debt principal.
- `modifiedAccrualExpenditures` = governmental funds statement, **modified accrual**: INCLUDES
  capital outlay and debt principal; EXCLUDES depreciation; pension = cash contributions only.
- **But DO compare them per function as a mis-key tripwire.** The ratio between the two bases for
  one function is stable across a city's years (capital-heavy functions like Streets/Public works
  legitimately sit near 0.2 in EVERY year — that is depreciation, not an error, so an absolute
  threshold is useless). A function whose ratio lurches in ONE year is the signature of a
  statistical column whose values landed on the wrong labels — which sums to the printed total and
  therefore passes every arithmetic check. `audit-expenses.mjs` runs this automatically (>3x from
  that function's own median); when it WARNs, re-source that year from the AUDITED statements.
  Colleyville FY2017: Table 4's labels took the values in the audited statement's row order, putting
  Municipal court at 9.1x its median while the column still totalled correctly.
- **PRIMARY SOURCE — the 10-year STATISTICAL tables (one recent ACFR ≈ 10 years of BOTH fields).**
  These are NOT single-year-only (an earlier version of this note wrongly said "read every ACFR" —
  that wastes ~10× the reports). The statistical section carries both breakdowns by function for the
  last ten fiscal years:
  - **`Changes in Net Position`** (accrual basis) → `fullAccrualExpenses`: the "Expenses /
    Governmental Activities" block (one row per function incl. "Interest on Long-Term Debt"); the
    "Total Governmental Activities" line below it is the sum-check, not a stored field. This SAME
    table also carries the tax rows — capture them here in ONE pass.
  - **`Changes in Fund Balances, Governmental Funds`** (modified accrual basis) →
    `modifiedAccrualExpenditures`: the EXPENDITURES block (current by function; Debt Service; Capital
    Projects sub-lines; Total Expenditures).
  So one recent ACFR covers ~FY(N−9..N); pull the earliest years (e.g. FY2015) from ONE older ACFR
  whose 10-yr window reaches them (FY2024's tables cover 2015–2024). Two reports' statistical
  sections typically cover FY2015→latest for BOTH fields — do NOT open all 11.
- **Per-year statements are the FALLBACK + cross-check**, not the primary source. Use the
  government-wide Statement of Activities / Governmental Funds Statement of Revenues, Expenditures
  only for a year outside every available statistical window, or when a statistical table collapses
  categories. Locate fast: `grep -n "Functions/Programs"` → SoA; `grep -n "EXPENDITURES:"` →
  governmental-funds statement (rightmost **Total Governmental Funds** column). Cross-check a couple
  years' statistical totals against these.
- **Watch the statistical footnotes for reclassifications.** The stat table flags function
  renames/combines across the 10 years (Dallas Table 4: "in FY2017 streets, public works, and
  transportation were combined; code enforcement reported separately"). These footnotes are exactly
  what drives the `lib/expense-category-groups.ts` entry (below).
- **`fullAccrualExpenses`** = `[{ name, value }]`, one per governmental-activities function row of
  the SoA **Expenses** column, INCLUDING the "Interest on Long-Term Debt" row as the last entry.
  Self-check (strong, no cross-report tie needed): the values must SUM to the table's own
  "Total governmental activities" expenses line — verify against the PDF as you transcribe, since
  nothing in the repo stores that total to check it for you. The interest entry ≈ the `debtInterest` field
  (may differ by rounding, since debtInterest is often thousands-rounded).
- **`modifiedAccrualExpenditures`** = `{ current[], debtService{principal,interest}, capitalOutlay,
  total }` from the **Total Governmental Funds** column of the fund Statement of Revenues,
  Expenditures, and Changes in Fund Balances:
  - `current` = `[{name,value}]` for each row under **Current:** (e.g. General Government, Public
    Safety, …, plus fund-only functions like Municipal Court / Economic Development).
  - `debtService` = `{principal, interest}` from the **Debt Service:** "Principal Retirement" and
    "Interest and Fiscal Charges" rows — plus optional **`refundingEscrow`** (see below) when the
    city books a "Payment to refunded bond escrow agent" as a debt-service expenditure.
  - `capitalOutlay` = the SUM of the rows under **Capital Projects / Capital Projects and Outlay:**
    (statements split it into "Engineering and Contractual Services" + "Construction and Equipment" —
    add them into one number).
  - `total` = the "Total Expenditures" line.
  - `debtService.issuanceCosts` = optional, see below.
  - Self-check (strong): `sum(current) + principal + interest + (refundingEscrow ?? 0) +
    (issuanceCosts ?? 0) + capitalOutlay == total`.
- **`refundingEscrow` — "Payment to refunded bond escrow agent"** (cash to defease old bonds in a
  refunding). Placement VARIES by preparer and both are GAAP-valid: some cities list it under
  **Debt service:** within EXPENDITURES (so it's inside "Total Expenditures") → record it as
  `debtService.refundingEscrow` (Dallas: FY2016 2,880,000, FY2018 30,675,000). Others list it under
  **Other Financing Sources/(Uses)** → it's NOT an expenditure, so OMIT the field (Addison). Check
  which section the line sits in. Appears only in refunding years. If it's a debt-service expenditure
  and you drop it, the self-check fails by exactly that line (this was the original Dallas bug).
- **`issuanceCosts` — "Bond issuance costs"** (underwriting/legal cost of a new issue). Same
  placement question as `refundingEscrow`: record it as `debtService.issuanceCosts` ONLY when the
  city prints it among the **Debt Service:** rows inside EXPENDITURES (Princeton — 7 of 11 years,
  and the self-check fails by exactly that line if you drop it). When the city nets it against bond
  proceeds under Other Financing Sources instead, it isn't an expenditure — OMIT the field. Appears
  only in issuance years.
- **Values are EXACT dollars** (as printed), not thousands-rounded — contrast the base balance-sheet
  fields which are usually recorded in rounded thousands. `dallas.ts` reports in thousands so its
  values end in 000; a whole-dollar city (Addison) does not.
- **Function-name drift across years → `lib/expense-category-groups.ts`.** If the ACFR renames or
  re-splits a function over the series (Dallas: "Code enforcement" / "Streets, … and code
  enforcement" / "Public works and transportation" all → one "Public Works" bucket), add a `{id}`
  entry mapping each raw label → a display bucket. Members sharing a bucket are summed per year.
  Stable names across all years (Addison) need no entry.
  - **`notes` defaults to `{}` — most entries get NO note.** Note only a merge a reader would
    otherwise misread: one function's dollars moving into a differently-named bucket, or a bucket
    swallowing an unexpected member (Municipal court / Code enforcement under Public safety).
    **Never** note the interest row ("Interest on long-term debt" ↔ "Interest and fiscal charges" ↔
    "Interest expense" are one statement line), Police/Fire/EMS → Public safety, or a cosmetic
    relabel ("Cultural and recreational" ↔ "Cultural and recreation"). If the mapping only changes
    wording, or merges labels any reader would expect together, it speaks for itself. Worked
    examples: populate-pension-and-expenses `SKILL.md §3c`.
- Charts skip a year that lacks the field (`flatMap`→`[]`), so partial population renders without
  error — but populate every sourceable year for a complete chart.
- The audit script `.claude/skills/populate-pension-and-expenses/scripts/audit-expenses.mjs {id}` reports coverage
  and runs both self-checks — use it before (find gaps) and after (verify) editing.

### pensionPlans[] (RSI pension schedules)
> Scope: **add-city** (step 2e) for a new city; **populate-pension-and-expenses** to backfill a
> city added earlier. The extraction traps live in that skill's `SKILL.md §2`/`§4` — read them
> before parsing; only the field rules are here.

One array entry **per plan per year** (the chart draws one line per plan and never aggregates), from
the two GASB 68 RSI schedules — each covers ten years, so one recent ACFR ≈ the whole series.
- `totalPensionLiability` = "Total pension liability - ending **(a)**";
  `fiduciaryNetPosition` = "Plan fiduciary net position - ending **(b)**" — both from the
  **Schedule of Changes in Net Pension Liability and Related Ratios**.
- `actuariallyDeterminedContribution` / `actualContribution` = the ADC and "Contributions in
  relation to the ADC" from the separate **Schedule of Contributions**. NOT the NPL schedule's
  `Contributions - City` row, which is on the measurement-date basis.
- **Store what's printed, derive nothing.** Funded ratio and ADC coverage are computed at render
  time (`components/pension-chart.tsx`); never store them, and never store "Net pension liability"
  or "Contribution deficiency (excess)" — both are differences of stored fields.
- **Omit `actuariallyDeterminedContribution` when the schedule reports no ADC** (Dallas Police &
  Fire FY2016 prints only a statutorily required contribution, pre-HB 3158). The coverage line then
  renders a gap, which is the honest reading — coercing the statutory figure in would score the
  city's worst-funded year as 100% compliant.
- `name` = the plan heading, shortened for the legend (`"TMRS"`, `"Employees' Retirement Fund"`) —
  the chart renders `{City} - {name}`, so don't paste the full statutory title.
- Whole dollars. Big-city RSI printed `(in 000's)` (Dallas, Fort Worth) must be ×1000 — the funded
  ratio is unit-invariant, so this error survives every ratio check; compare magnitude to
  `totalRevenue`.
- Audit with `.claude/skills/populate-pension-and-expenses/scripts/audit-pension.py {id}`.

## Tax rates (propertyValues)
- moRate = Maintenance & Operations rate; isRate = Interest & Sinking (debt service) rate.
- Decimals per $100 valuation (e.g. 0.50899).
- FY2015–2025: ACFR "overlapping rates" / "property tax rates" table.
- FY2026: city 2026 budget; if only total + debt-service shown, M&O = total − debt service.
- **No statistical rate table (AFR city)?** Each report's **MD&A states both numbers**: the
  combined total ("the City had a combined tax rate ... of $0.803") and the I&S ("the FY{N}
  interest and sinking fund tax rate ... was $0.0XXXXX"). moRate = total − I&S. One report = its
  own fiscal year. Grep `combined tax rate` and `interest and sinking`. For a year with no report
  (a missing middle year, and FY2026), the **budget book** prints both rates in a 2-column
  current-vs-prior table — disambiguate which column is which by matching the ONE year you already
  know from an ACFR (e.g. FY2025 I&S from the latest ACFR identifies the FY2025 column, so the
  other is FY2026; the FY2021 budget's prior column must equal FY2020's known I&S). This beats the
  appraisal-district route for non-Tarrant cities (Dallas CAD has no clean per-entity rates PDF).
- **Budget tax-rate ordinance + Form 50-856 worksheet are frequently SCANNED IMAGES** (no
  text layer; `pdftotext` yields ~nothing, the budget body only states the total rate). Don't
  guess the split. Authoritative curl-able source per appraisal district:
  Tarrant = `https://www.tad.org/content/rates/{taxYear}TaxRates.pdf` (one row per entity, M&O
  + I&S columns; tax year {N} = fiscal year {N+1}). Dallas/Collin/Denton CADs publish the same;
  the Texas Comptroller "Tax Rates and Levies" report is the statewide fallback. Cross-check:
  M&O + I&S must equal the budget's adopted total. Last resort only — render the scanned
  worksheet page (`pdftoppm -png -r 300`) and Read the image (the Read tool reads PNGs).

## salesTaxUsage
- TX cities levy up to 2% local sales tax on top of state. `percent` = percentage POINTS
  of that local tax allocated to each use; entries typically sum to 2.0.
- **Name each `usage` with the OFFICIAL fund / entity name from the budget book or the ACFR
  component-unit section — not a generic label.** Use the corporation's actual name and let it
  carry the Type-A/Type-B distinction implicitly (the budget/ACFR names them, e.g. "Industrial
  and Economic Development Corporation" = Type A, "Community and Economic Development Corporation"
  = Type B); write "Property Tax Rebate"/"Property Tax Reduction" as the budget phrases it. Don't
  collapse them to "Economic Development (Type A)" or invent a label.
- **STRIP the city-name prefix from the `usage` label.** The city is already the page context, so
  drop the leading city name the budget/ACFR prepends: "Roanoke Crime Control & Prevention District"
  → "Crime Control & Prevention District"; "Roanoke Economic & Industrial Development Corporation"
  → "Economic & Industrial Development Corporation". Keep the rest of the official name verbatim.
- Example (Hurst): General Fund 1, Community Services Dev Corp 0.5, Crime Control 0.5. Splits
  AND names vary by city — read each city's budget; existing `data/info/*.ts` files show the range.

## notes (explaining big jumps)
**Pick the years to annotate from the DERIVED METRICS, not raw fields.** The site only
charts the metrics in `lib/format-chart-data.ts` (`calculateACFRMetrics`); those are what a
user sees move. A big raw-field jump frequently does NOT move the metric — and a metric can
move with no single obvious field spike — so anchoring notes to raw fields annotates the
wrong years. Workflow:
- Compute the metric series across years and find the standout **year-over-year change(s)**
  in each. Prioritize these charts: **Net Financial Position** (`currentAndOtherAssets −
  liabilities − deferredInflows`), **Net Debt to Total Revenues** (only nonzero when Net
  Financial Position is negative), **Asset Life** = `netBookValueToCostOfTCA` (net capital ÷
  gross capital — moves on big capital additions, disposals, or depreciation), and **Years of
  Financial Cushion** (`(netFinancialPosition + surplusAssetLife) / totalRevenue`). Also
  Financial/Assets-to-Liabilities, Interest-to-Revenue, External-Transfers-to-Revenue.
- **HIGH threshold — annotate only a true OUTLIER, not merely a "big" year.** A note is for a
  visible KINK in a chart: a single YoY move that clearly dwarfs the others in that same series —
  rule of thumb **≥2× the next-largest YoY change** in that metric (and roughly ≥25% of total
  revenue for the dollar-based stock metrics). A **steady multi-year climb/decline is NOT a note**
  even when each step is sizable or the cumulative move is large — if the year sits mid-pack among
  the series' other YoY moves, skip it. (Balch Springs Net Financial Position rose ~+4.6M, +6.4M,
  ..., +9.8M, +11.4M across consecutive years — a steady ramp, so no single mid-ramp year like
  FY2022 earns a note; only an outlier driven by a discrete event does.)
- Aim for **~1–3 notes per city** (hard cap 3, existing + new), the most conspicuous inflections
  only. When unsure whether a move stands out, leave it out — fewer, higher-signal notes beat
  annotating every up-year.
- **A flagged jump is not automatically a note — classify it first.** Five outcomes: (1)
  *noteworthy* → add note; (2) *data error* → a bad value faking a jump (see the capital
  extraction bugs above) — fix it, the jump vanishes, no note; (3) *self-explanatory* →
  routine debt issuance already visible as debt, no note needed; (4) *start-of-series artifact* →
  the FIRST data year is abnormally high (e.g. big developer contributions), so year 2 looks like
  a "drop" — nothing happened in year 2, don't annotate it (would misattribute a return-to-normal
  to the wrong year, and the first year has no prior to compare); (5) *steady trend* → skip.
  **After fixing any data-error cell, RE-RUN the jump detection** — a fix can shift the flagged
  outlier onto an adjacent year that has the same bug (fixing Lancaster FY2016 surfaced the
  identical Buildings omission in FY2015).
- Then open the MD&A for THAT year and quote the driver behind the metric move.
- Watch for self-canceling raw spikes that leave a metric flat (don't annotate these on that
  metric): **debt issuance** is ~neutral in Net Financial Position (cash proceeds raise
  current assets while the new debt raises liabilities — they offset); **grant/ARPA revenue
  that is spent the same year** leaves balance-sheet stocks flat (it shows on the
  revenue/grants flow, not on a stock metric). Such an event still belongs on its *own*
  metric if one moves (e.g. issuance shows on gross-liability-based metrics), or may warrant
  no note at all.
- Format as a backtick template literal, **`FY YYYY ACFR: "<quote>"`** — prefix unquoted, then the
  ACFR's words inside double quotes. **Every quoted passage carries its own pair of quotes**, so a
  two-part note reads `FY 2025 ACFR: "quote part 1 here" [...] "quote part 2 here"` (the ` [...] `
  sits OUTSIDE the quotes — it's your elision, not the ACFR's text). Use this for new cities
  regardless of what a sibling file does; older cities predate the convention and carry two legacy
  shapes (`FY YYYY ACFR: <quote>` unquoted in ~21 cities like cedar-hill/dallas/arlington, and
  `ACFR YYYY: "<quote>"` in little-elm/balch-springs/colleyville/haltom-city). Don't mass-migrate
  them, but when you ADD a note to an existing file, match this quoted form. Quote exactly — verify
  against the PDF. **Verbatim discipline:** a paraphrase is NOT a quote. To shorten, elide with ` [...] `
  and keep every retained word exact; mark any editorial insertion in brackets (e.g. a
  thousands-scale figure printed as `$30,490` becomes `$30,490[,000]`). If a year's own report has
  no sentence explaining its jump, the quote may live in a DIFFERENT year's report — tag the note
  to the report the quote actually came from (Bedford's FY2019 interest jump is explained only by
  the FY2018 issuance quote → tag it `FY 2018 ACFR:`; an adjacent-year note still "covers" the
  jump). **If no faithful quote exists anywhere, add no note** (NEVER GUESS) — a real jump with no
  sourceable driver is left un-annotated rather than described from inference.
- Find drivers in the MD&A: "Changes in Net Position" narrative, "Financial Highlights",
  and the governmental-funds fund-balance discussion (big current-asset/cash jumps usually =
  debt issuance and/or PID/CIP expansion; big revenue/grant jumps = developer/PID capital
  contributions).
- Multiple quotes from the SAME ACFR year explaining the SAME metric move → join into one
  note with ` [...] ` between the quoted passages, each passage in its own quotes (don't make
  separate notes for one event).
- If one year moves DISTINCT metrics for different reasons, make a separate note per metric
  and tag it, e.g. `FY 2021 ACFR (Net Financial Position): "..."`.
- When a quote names a specific development / PID / project behind the change (e.g. "Valencia
  on the Lake"), prefer it — it's more informative than a generic "PID growth" line.
- For a long note, make the template literal multiline: insert line breaks at sentence
  periods (and long comma clauses). Indent the continuation lines to match the surrounding
  code for readability (the leading whitespace collapses when the note is rendered). Prettier
  leaves template-literal contents untouched.

## revenue fields
- revenueBySource = the **FY2024** property/sales/hotel totals (drives the map/summary).
  Use FY2024, not the latest available year — copy the FY2024 acfr-json entry's three tax fields.
- revenues[] = per-year rows (FY2024, FY2025). The FY2024 row duplicates revenueBySource.
- **Property + sales tax**: ACFR statistical "Changes in Net Position" general-revenues rows
  (per year), or — in an AFR with no statistical section — the General Revenues rows of that
  year's government-wide Statement of Activities. Verify property + sales + franchise == MD&A
  combined "Taxes" for the year.
- **Don't panic if city sales tax ≠ a clean 1%.** The primary-government general-revenue "Sales
  taxes" line can BUNDLE several local components (General Fund 1% + street maintenance + crime
  control), so it may run 1.5–3× any single EDC's line. It equals (2% local rate − the share
  booked inside discretely-presented EDC component units). Reconcile by quarter-cent units, not by
  assuming GF = 1% (Balch Springs: gov sales = 1.5% = GF 1.25% + street 0.25%; EDC A+B = 0.5%
  sit in component units — a 3× gap vs one EDC is expected, not a misread). Use the gov line
  as-is for revenues[] (component units are excluded by convention).
- **Hotel-occupancy tax** — sourcing rules are under "Tax revenue fields" above (three cases; it
  sets the fetch budget). Two extras for `revenues[]`: it is frequently mislabeled (Southlake books
  it under "Municipal sales tax"), and multi-year actuals also sit in the **budget book**'s Hotel
  Occupancy Tax Fund summary (FY-2 Actual / FY-1 columns) — sanity-check against the ACFR fund's
  beginning-fund-balance roll-forward. No hotel fund → hotel = 0 (sourced).

## NEVER GUESS
Reminder: if any figure here can't be sourced with confidence, prompt the user. Do not
estimate, interpolate, or fill from memory.
