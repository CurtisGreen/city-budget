---
name: city-narrative
description: Write a financial-history narrative for a city in the city-budget project — its trajectory from FY2015 to now, a 10-year outlook, and keep/stop/start policy recommendations. Grounds every claim in the city's ACFR data + CityInfo metrics (and, only for the forward view, its budget/ACFR). Use when asked to narrate, summarize, or assess a city's finances, e.g. "give me the story of Roanoke's finances" or "how is Hurst trending".
---

# City financial narrative

Goal: from a city name/id, produce a written narrative in four parts —
(1) **History FY2015→latest**, (2) **10-year trajectory**, (3) **Keep / Stop / Start**
policy recommendations for financial success & stability. Fast and cheap: the repo's own
acfr-json + CityInfo already hold the sourced data, so the DEFAULT path touches NO PDFs. Fetch a
PDF only for the forward-looking section, and only the pages you need.

## Core rule: NEVER GUESS a number
Every figure and every driver you cite must come from a verified source already in the repo
(the ACFR data, the CityInfo file, the `notes[]` quotes) or from a PDF you actually read
(ACFR MD&A / budget forecast). Metric values come from `scripts/metrics.ts` — do NOT eyeball
or recompute them by hand. If a trend has no sourced driver, describe the move and say the
driver is unstated rather than inventing one. Recommendations must follow from the metrics
you show; label any forward-looking claim as a projection, not a fact.

## 0. Resolve the city
`id` = kebab-case of the name (e.g. "Roanoke" → `roanoke`). Confirm the data exists:
`data/acfr-json/{id}.ts` and `data/info/{id}.ts`. If the acfr-json file is missing, the city
hasn't been added yet — offer to run the **add-city** skill first; do not fabricate history.

## 1. Load the metrics (deterministic, cheap) — do this FIRST
Run (from repo root):
`node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON .claude/skills/city-narrative/scripts/metrics.ts {id}`
It reads `data/acfr-json/{id}.ts` and prints, using the EXACT formulas in `lib/format-chart-data.ts`:
- the 8 charted metrics per fiscal year (the numbers the site actually shows a user),
- total revenue + interest per year,
- **per-metric trajectory**: FY-start→FY-end value, net move (GOOD/BAD by `positiveDirection`),
  and the peak/trough value + year,
- **top-2 YoY moves per metric**, each tagged GOOD/BAD.
The trajectory line + peak/trough years ARE the history spine — the turning points to narrate
(e.g. a metric's trough year and its later peak year are the two ends of the "climb"); the
top-2 moves are the inflections that each need a sourced driver. Read these, don't re-scan the
per-year table by eye. The 8 metrics and how to read each
(what a rise/fall means, good direction) are defined in `lib/chart-configs.ts` — that file is
the source of truth for interpretation; read it once if you need the plain-English meaning.

## 2. Load the context (one cheap read)
Read `data/info/{id}.ts` for: `notes[]` (already-sourced ACFR quotes explaining the big
jumps — these ARE your drivers, reuse them verbatim, don't re-derive), `propertyValues`
(M&O + I&S tax-rate history — a policy lever), `revenueBySource`/`revenues` (property vs
sales vs hotel mix — concentration/volatility), `populations` (growth context). Cross-map the
`metrics.ts` inflection years to `notes[]`: most standout years already have a quote.

## 3. Fill gaps + build the forward view (PDF only if needed)
Only now, and only if required, open a PDF — reuse **add-city**'s source-discovery machinery
(`.claude/skills/add-city/SKILL.md` §2a and `references/conventions.md`: DocumentCenter/View
ids, Wayback/CDX, `pdftotext -layout`, MD&A + statistical-table locations, wrong-city check):
- **History gap:** if a `metrics.ts` inflection has no `notes[]` quote and it matters to the
  story, pull the driver from that year's ACFR MD&A ("Financial Highlights" / "Changes in Net
  Position" narrative). One page, quoted verbatim. NOTE: add-city caps `notes[]` at ~3 and often
  does NOT annotate the latest year — so the most-recent inflection (frequently the biggest move
  in `metrics.ts`) usually has no repo quote and you must open the latest ACFR MD&A for it.
- **10-year trajectory:** two named forward sources, both cheap to target —
  1. **Latest ACFR** — grep the LATEST report for the exact committed-debt facts (don't read the
     whole thing): `grep -inE 'Subsequent Events'` → Note ~13 lists post-year-end bond/CO
     issuances (new principal + coupon + maturity = a known future interest ramp); `grep -inE
     'requirements to maturity|debt service requirements'` → the debt note's principal+interest-
     to-maturity schedule (the committed interest path, the single best input for the
     Interest-to-Revenue projection); `grep -inE 'total debt outstanding'` → the MD&A debt total.
  2. **Current budget book** (fetch via add-city §2a — its DocumentCenter id is the newest
     "Adopted/Final FY{N+1} Budget"; do NOT assume PDFs from a prior add-city run are still in
     scratchpad, re-fetch) — multi-year revenue/fund-balance forecast tables + the CIP.
  Combine: (a) extrapolate each metric's established trend, (b) layer in the KNOWN committed
  changes from source 1 (authorized debt → rising liabilities/interest) and forecast revenue
  from source 2, (c) note the tax-rate path from `propertyValues`. Keep it to those tables —
  don't read the whole book.
  **Scope trap (verify, don't conflate):** the budget book's "Total Revenues" is General-Fund /
  operating scope and will NOT equal the ACFR government-wide "Total revenues" the metrics use
  (Roanoke FY2025: budget ~$54.8M GF vs ACFR $66.5M government-wide). Use the budget forecast
  DIRECTIONALLY (growth rate, mix) — never as a level to splice onto the ACFR series — and say so.
Skip this whole step when `notes[]` + the metric trends already tell a complete story.

## 4. Write the narrative
Four sections. **Be terse — ~250–350 words total, hard cap 400.** Every sentence carries a
metric, year, or sourced driver; cut anything that doesn't. No preamble, no recap, no
municipal-finance boilerplate. Fragments fine. Cite metric names + years; quote `notes[]`/MD&A
for drivers (trim quotes to the load-bearing clause).

**A. History (FY2015→FY{latest}).** 2–3 tight paragraphs, metrics as spine — lead with **Net
Financial Position** + **Net Debt to Revenue**, touch **Asset Life** / **Interest to Revenue** /
**External Transfers to Revenue** only where the trend warrants. Anchor each turning point to its
driver; separate one-time from sustained; name the revenue mix shift. Not a metric-by-metric roll call.

**B. 10-year trajectory.** 3–4 sentences: where key metrics head if trends + committed decisions
hold, stated assumptions, top 2 risks + 1 tailwind. Explicitly a projection.

**C/D. Keep / Stop / Start — 2 items each, one terse line apiece**, each tied to a metric or
sourced fact (Keep = metric trending good; Stop = one trending bad; Start = a data-implied gap,
e.g. below the DFW Asset-Life benchmark 0.62). Concrete and city-specific.

## 5. Output
Default: render the narrative directly in chat as markdown (headings per section). If the user
asks for a shareable page, offer an **Artifact**. Close with a one-line note on what was
sourced from the repo vs. any PDF you opened, and any gap you couldn't source (never papered
over with a guess).

## Token discipline
`metrics.ts` + one read of `data/info/{id}.ts` answers most of the request with zero PDF fetches.
Reach for a PDF only for an unexplained inflection that matters or for the forward view, and
fetch just the relevant pages. Prefer reusing `notes[]` over re-reading an ACFR you already
mined when the city was added.
