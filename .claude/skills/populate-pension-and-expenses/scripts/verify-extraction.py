#!/usr/bin/env python3
"""Prove a staged extraction BEFORE it is written into data/acfr-json/{id}.ts.

Runs the arithmetic the skill otherwise asks the model to do in its head — which is the
highest-variance step in the whole job — against figures printed in the PDF. Every check compares
what you transcribed to a number the ACFR states independently, so passing means the transcription
is right, not merely self-consistent.

Input: a staging JSON (see write-city-fields.py for the shape). Keys beginning "_" are PROOF
INPUTS: figures you read off the PDF purely so this script can check you. They are never written
to the .ts.

  {"id": "colleyville",
   "years": {
     "2015": {
       "pensionPlans": [{"name": "TMRS", "totalPensionLiability": 44992613,
                         "fiduciaryNetPosition": 48865090,
                         "actuariallyDeterminedContribution": 868363,
                         "actualContribution": 868363,
                         "_printedFundedRatio": 108.61}],
       "propertyTaxRevenue": 13493621,
       "salesTaxRevenue": 6705914,
       "hotelTaxRevenue": null,              <- null = DELIBERATELY omitted (city didn't levy it)
       "_printedModAccrualTaxes": {"property": 13486702, "sales": 6705914, "hotel": None},
       "fullAccrualExpenses": [{"name": "...", "value": 123}, ...],
       "_printedTotalGovActivities": 27394207,
       "modifiedAccrualExpenditures": {"current": [...], "debtService": {...},
                                       "capitalOutlay": 1, "total": 2}}}}

Usage: verify-extraction.py staged.json [--extracted extracted.json] [--quiet]\n\n--extracted takes extract-statements.py's JSON and checks every staged tax field against\nthat year's AUDITED Statement of Activities general revenues -- same basis, same year, so\na mismatch is an error rather than a basis difference. Pass it whenever you have it.
Exit 0 = every check passed and it is safe to write; 1 = something is wrong; 2 = bad input.
"""
import json
import sys

# The repo's own optional-field names, for the "did you stage anything unknown?" check.
KNOWN = {
    "pensionPlans",
    "propertyTaxRevenue",
    "salesTaxRevenue",
    "hotelTaxRevenue",
    "fullAccrualExpenses",
    "modifiedAccrualExpenditures",
}


def load_existing(city_id):
    """Pull {fy: {debtInterest, totalRevenue}} out of the existing .ts for the sanity checks."""
    import re

    try:
        src = open(f"data/acfr-json/{city_id}.ts", encoding="utf-8").read()
    except OSError:
        return {}
    out = {}
    # Split on TOP-LEVEL year blocks only: `^  {`. A literal "  {\n" split would also cut inside
    # `pensionPlans: [` (its entries are indented 6 spaces), orphaning debtInterest/totalRevenue.
    for blk in re.split(r"^  \{$", src, flags=re.M):
        m = re.search(r"fiscalYear: (\d+),", blk)
        if not m:
            continue
        rec = {}
        for f in ("debtInterest", "totalRevenue"):
            mm = re.search(rf"{f}: ([\d_]+),", blk)
            if mm:
                rec[f] = int(mm.group(1).replace("_", ""))
        out[int(m.group(1))] = rec
    return out


def check(staged, extracted=None):
    city = staged.get("id")
    years = staged.get("years") or {}
    existing = load_existing(city) if city else {}
    fails, notes, counts = (
        [],
        [],
        {"pension": 0, "accrual": 0, "modacc": 0, "taxyear": 0, "soatax": 0, "omitted": 0},
    )

    for fy_s, y in sorted(years.items(), key=lambda kv: int(kv[0])):
        fy = int(fy_s)
        unknown = {k for k in y if not k.startswith("_")} - KNOWN
        if unknown:
            fails.append(f"FY{fy}: unknown staged field(s) {sorted(unknown)} — typo?")

        # 1. Pension: recompute the funded ratio and reproduce the one the RSI PRINTS.
        for p in y.get("pensionPlans") or []:
            tpl, fnp = p.get("totalPensionLiability"), p.get("fiduciaryNetPosition")
            printed = p.get("_printedFundedRatio")
            nm = p.get("name", "?")
            if not tpl or fnp is None:
                fails.append(f"FY{fy} {nm}: missing TPL/FNP")
                continue
            counts["pension"] += 1
            if printed is None:
                notes.append(f"FY{fy} {nm}: no _printedFundedRatio staged — ratio NOT proven")
            else:
                got = 100.0 * fnp / tpl
                # Tolerance follows how many decimals the RSI actually printed: TMRS schedules
                # print a whole percent ("90%"), so a fixed 0.015 would reject a faithful parse.
                dec = len(f"{printed}".partition(".")[2].rstrip("0"))
                tol = max(0.5 * 10**-dec, 0.015)
                if abs(got - printed) > tol:
                    fails.append(
                        f"FY{fy} {nm}: funded ratio {got:.2f}% != printed {printed:.2f}% "
                        f"— TPL/FNP misread, or the column is the wrong YEAR"
                    )
            if "actuariallyDeterminedContribution" in p and "actualContribution" not in p:
                fails.append(f"FY{fy} {nm}: ADC staged without actualContribution")
            # Units: RSI printed "(in 000's)" silently 1000x-es everything, and the funded ratio is
            # unit-invariant so check 1 cannot see it. Compare against the year's own revenue.
            rev = existing.get(fy, {}).get("totalRevenue")
            if rev and tpl and not (0.05 <= tpl / rev <= 60):
                fails.append(
                    f"FY{fy} {nm}: TPL {tpl:,} is {tpl / rev:.3g}x totalRevenue {rev:,} — "
                    f"check for a thousands-scaled RSI (multiply by 1000) or a units slip"
                )

        # 2. fullAccrualExpenses must sum to the SoA's own printed total.
        fa = y.get("fullAccrualExpenses")
        if fa:
            counts["accrual"] += 1
            tot = y.get("_printedTotalGovActivities")
            s = sum(e["value"] for e in fa)
            if tot is None:
                notes.append(f"FY{fy}: no _printedTotalGovActivities staged — sum NOT proven")
            elif abs(s - tot) == 1:
                # A $1 gap is the ACFR rounding its own total line, not a misread row: it is far
                # smaller than any row-level transcription error and shows up in real reports
                # (Forest Hill FY2016, Grapevine FY2022, where the MD&A prints the same total).
                notes.append(
                    f"FY{fy}: fullAccrualExpenses sum {s:,} vs printed total governmental "
                    f"activities {tot:,} (off by {s - tot:+,}) — $1 rounding in the ACFR itself"
                )
            elif s != tot:
                fails.append(
                    f"FY{fy}: fullAccrualExpenses sum {s:,} != printed total governmental "
                    f"activities {tot:,} (off by {s - tot:+,})"
                )
            di = existing.get(fy, {}).get("debtInterest")
            ie = next((e["value"] for e in fa if "interest" in e["name"].lower()), None)
            if di is not None and ie is not None and abs(ie - di) > max(1000, di * 0.02):
                fails.append(
                    f"FY{fy}: interest entry {ie:,} vs stored debtInterest {di:,} — the statistical "
                    f"table is diverging from the audited SoA; re-source this year's WHOLE row set"
                )

        # 3. modifiedAccrualExpenditures internal reconciliation.
        m = y.get("modifiedAccrualExpenditures")
        if m:
            counts["modacc"] += 1
            d = m.get("debtService", {})
            parts = (
                sum(c["value"] for c in m["current"])
                + d.get("principal", 0)
                + d.get("interest", 0)
                + d.get("refundingEscrow", 0)
                + d.get("issuanceCosts", 0)
                + m.get("capitalOutlay", 0)
            )
            if parts != m.get("total"):
                fails.append(
                    f"FY{fy}: modifiedAccrual parts {parts:,} != total {m.get('total'):,} "
                    f"(off by {parts - m.get('total', 0):+,})"
                )

        counts["omitted"] += sum(1 for k in KNOWN if k in y and y[k] is None)

    # 4. Cross-basis ratio stability — the ONLY check that sees a mis-keyed statistical column,
    # because such a column holds the right year's values on the wrong labels and therefore
    # reconciles perfectly against every printed total. Same test audit-expenses.mjs runs after the
    # write; running it here stops the bad values landing in the first place.
    ratio_fails, ratio_notes = ratio_outliers(years, city)
    fails.extend(ratio_fails)
    notes.extend(ratio_notes)

    # 5. Same-basis comparison against the audited SoA, when extract-statements.py output is
    # supplied. Strictly stronger than check 6, so a year proven here silences 6's weaker note.
    soa_fails, soa_notes, soa_proven = soa_tax_match(
        years, extracted or {}, staged.get("_taxConvention"))
    fails.extend(soa_fails)
    notes.extend(soa_notes)
    counts["soatax"] = len(soa_proven)

    # 6. Tax-row YEAR attribution against the modified-accrual table (see tax_year_alignment).
    tax_fails, tax_notes, counts["taxyear"] = tax_year_alignment(years)
    fails.extend(tax_fails)
    notes.extend([n for n in tax_notes
                  if not any(n.startswith(f"FY{fy}:") for fy in soa_proven)])
    return fails, notes, counts


def _norm(s):
    import re as _re

    return _re.sub(r"andengineering|services|service$", "", _re.sub(r"[^a-z]", "", s.lower()))


def load_groups(city_id):
    """(fullAccrualGroups, modifiedAccrualGroups) for a city from lib/expense-category-groups.ts.

    A city that splits one function across two differently-named lines (DeSoto's 'Non-departmental'
    sitting beside 'General government' through FY2018) declares that here. The ratio check must
    compare GROUPED buckets, or the split reads as a mis-key in exactly the years of the split.
    """
    import re as _re

    try:
        src = open("lib/expense-category-groups.ts", encoding="utf-8").read()
    except OSError:
        print("WARNING: lib/expense-category-groups.ts not found — run from the REPO ROOT, or this "
              "city's declared groupings are ignored and its splits read as mis-keys",
              file=sys.stderr)
        return {}, {}
    m = _re.search(rf'^  "?{_re.escape(city_id)}"?: \{{(.*?)^  \}},$', src, _re.S | _re.M)
    if not m:
        return {}, {}
    body = m.group(1)

    def block(field):
        b = _re.search(rf"{field}: \{{(.*?)\}},", body, _re.S)
        if not b:
            return {}
        # keys are quoted ("Non-departmental") or bare (Library) — Prettier drops quotes when legal
        return {
            k.strip().strip('"'): v
            for k, v in _re.findall(r'\n\s*("?[^"\n:]+"?):\s*"([^"]+)"', b.group(1))
        }

    return block("fullAccrualGroups"), block("modifiedAccrualGroups")


def ratio_outliers(years, city_id=None):
    """A function's modified/accrual ratio is stable across a city's years; a one-year lurch is the
    signature of values landing on the wrong labels. Capital-heavy functions legitimately sit near
    0.2 in EVERY year, so compare each year to that function's own median, never to a fixed bound.
    Labels are grouped first (lib/expense-category-groups.ts), so a declared split is not a flag.

    A lurch that the ACFR really prints — the same figures in two report editions, with the year's
    printed total independently proven — is declared per year as
    "_ratioExceptions": {"<function>": "<why, and what proves the total>"}. That downgrades the one
    function-year to a reported note; every other year and function stays strict, and an exception
    with no reason text is refused."""
    fg, mg = load_groups(city_id) if city_id else ({}, {})
    waived = {}
    for fy_s, y in years.items():
        for fn, why in (y.get("_ratioExceptions") or {}).items():
            waived[(int(fy_s), _norm(fn))] = why
    series = {}
    for fy_s, y in years.items():
        fa, m = y.get("fullAccrualExpenses"), y.get("modifiedAccrualExpenditures")
        if not fa or not m:
            continue
        acc = {}
        for e in fa:
            if "interest" in e["name"].lower():
                continue
            k = _norm(fg.get(e["name"], e["name"]))
            acc[k] = acc.get(k, 0) + e["value"]
        mod = {}
        for c in m["current"]:
            nm = mg.get(c["name"], c["name"])
            mod[nm] = mod.get(nm, 0) + c["value"]
        for nm, v in mod.items():
            a = acc.get(_norm(nm))
            # A negative accrual expense is real (a big NPL drop) and makes the ratio meaningless.
            if a is None or a <= 0 or v <= 0:
                continue
            series.setdefault(nm, []).append((int(fy_s), v / a))
    out, waived_notes = [], []
    for fn, rows in series.items():
        if len(rows) < 5:
            continue
        med = sorted(r for _, r in rows)[len(rows) // 2]
        if med == 0:
            continue
        for fy, r in sorted(rows):
            if r / med > 3 or r / med < 1 / 3:
                why = waived.get((fy, _norm(fn)))
                msg = (
                    f'FY{fy} "{fn}": modified/accrual ratio {r:.2f} vs this function\'s median '
                    f"{med:.2f} ({r / med:.1f}x)"
                )
                if why:
                    waived_notes.append(f"{msg} — DECLARED EXCEPTION: {why}")
                else:
                    out.append(
                        msg + " — a statistical column mis-keyed onto the wrong labels still sums "
                        "correctly; check this year against the AUDITED statements"
                    )
    for (fy, fn), why in waived.items():
        if not str(why).strip():
            out.append(f"FY{fy} _ratioExceptions[{fn}]: empty reason — state what proves the year")
    return out, waived_notes


TAX_FIELDS = (
    ("propertyTaxRevenue", "property"),
    ("salesTaxRevenue", "sales"),
    ("hotelTaxRevenue", "hotel"),
)


def _tax_err(acc_year, mod_year):
    """Median relative gap between one year's staged accrual taxes and a printed modified-accrual
    column. Median over the tax types, so a property-tax line that genuinely differs by basis
    (60-day availability) cannot by itself drive the result; sales and hotel are all but identical
    across the two bases in every city seen so far."""
    errs = [
        abs(acc_year[k] - mod_year[k]) / mod_year[k]
        for k in acc_year
        if k in mod_year and mod_year[k]
    ]
    if len(errs) < 2:
        return None
    errs.sort()
    # Lower median on an even count: with only property + sales comparable, the property line's
    # genuine basis difference must not be the number this check runs on.
    return errs[(len(errs) - 1) // 2]


def tax_year_alignment(years):
    """Prove each year's TAX row came from the right YEAR's column.

    A statistical table's general-revenues PAGE can be headed with the wrong fiscal years while the
    expenses page of the same table is right: Duncanville's FY2024 ACFR heads that page 2014-2017
    when it holds 2015-2018, so its "2014" column IS FY2015. Such a column is internally perfect —
    it sums to its own page totals — so checks 1-4 all pass and the error lands silently in
    propertyTaxRevenue / salesTaxRevenue / hotelTaxRevenue.

    The modified-accrual table prints the SAME three taxes for the same years on a different page.
    Sales and hotel tax are all but identical across the two bases, so a year whose staged row fits
    a NEIGHBOURING modified-accrual column far better than its own is a year-label shift, not a
    basis difference. Stage `_printedModAccrualTaxes: {property, sales, hotel}` per year (it sits
    directly above the expenditure block already being transcribed) to turn this on.

    FAILs only on that unambiguous signature. A year that merely disagrees with no better-fitting
    neighbour is reported as UNPROVEN, since a real basis difference looks like that.
    """
    acc, mod = {}, {}
    for fy_s, y in years.items():
        fy = int(fy_s)
        printed = y.get("_printedModAccrualTaxes")
        a = {key: y[f] for f, key in TAX_FIELDS if y.get(f)}
        if a:
            acc[fy] = a
        if isinstance(printed, dict):
            m = {k: v for k, v in printed.items() if v}
            if m:
                mod[fy] = m
    fails, notes, proven = [], [], 0
    for fy in sorted(acc):
        if fy not in mod:
            notes.append(f"FY{fy}: no _printedModAccrualTaxes staged — tax YEAR not proven")
            continue
        here = _tax_err(acc[fy], mod[fy])
        if here is None:
            notes.append(f"FY{fy}: <2 comparable tax lines — tax YEAR not proven")
            continue
        proven += 1
        if here <= 0.02:
            continue
        near = [
            (lag, _tax_err(acc[fy], mod[fy + lag]))
            for lag in (-1, 1)
            if fy + lag in mod
        ]
        best = min(((e, lag) for lag, e in near if e is not None), default=None)
        if best and best[0] < 0.01 and best[0] * 3 < here:
            fails.append(
                f"FY{fy}: staged taxes are off the FY{fy} modified-accrual column by "
                f"{here:.1%} but match FY{fy + best[1]}'s to {best[0]:.1%} — this row is the "
                f"FY{fy + best[1]} column; the statistical page's year headers are shifted"
            )
        else:
            notes.append(
                f"FY{fy}: taxes differ from the modified-accrual column by {here:.1%} with no "
                f"better-fitting neighbour — basis difference or a misread, YEAR not proven"
            )
    return fails, notes, proven


def soa_tax_match(years, extracted, convention):
    """Compare each year's staged taxes against that year's AUDITED Statement of Activities.

    This is the strongest tax check available and the only one that is same-basis: the stored tax
    fields and the SoA general revenues are both accrual, both for the same fiscal year, both from
    the audited statements. There is no 60-day availability difference to excuse a gap, so any
    mismatch is an error -- either the staged figure is wrong, or this city deliberately stores a
    DIFFERENT convention (Addison stores the statistical schedule's modified-accrual "1% Town Sales
    Tax"). Declare the latter with a top-level "_taxConvention": "<why>" and mismatches become notes.

    The figures come from extract-statements.py's `soa.generalRevenues`, which locates the block by
    proving it against the printed "Total General Revenues and Transfers" -- so a value only arrives
    here if the ACFR's own arithmetic already vouched for it. Forney FY2015 is why this exists: its
    statistical Table 3 prints 7,698,456 where the audited SoA says 7,627,533, and nothing else in
    this script could see the difference.
    """
    fails, notes, proven = [], [], set()
    if convention is not None and not str(convention).strip():
        fails.append('_taxConvention is present but empty — state which source the city stores')
    for fy_s, y in sorted(years.items(), key=lambda kv: int(kv[0])):
        fy = int(fy_s)
        gr = extracted.get(fy)
        if not gr:
            continue
        for field, key in TAX_FIELDS:
            got, want = y.get(field), gr.get(key)
            if got is None or want is None:
                continue
            if got == want:
                proven.add(fy)
                continue
            msg = (f"FY{fy} {field}: staged {got:,} but the AUDITED Statement of Activities prints "
                   f"{want:,} (off by {got - want:+,})")
            # The gap very often IS another staged tax: a city whose SoA folds hotel tax into the
            # "Sales Taxes" line stores sales NET of hotel, so the delta is exactly hotel tax.
            for other, okey in TAX_FIELDS:
                ov = y.get(other)
                if other != field and ov and want - got == ov:
                    msg += (f" — that gap is EXACTLY this year's {other} ({ov:,}), so the SoA line "
                            f"evidently bundles {okey} into {key}; if storing {key} net of "
                            f"{okey} is the city's convention, declare it as \"_taxConvention\"")
                    break
            if convention:
                notes.append(msg + f" — DECLARED CONVENTION: {convention}")
            else:
                fails.append(
                    msg + " — same basis, same year, same audited statement, so this is not a basis "
                    "difference. Either the figure is wrong (a statistical table that disagrees with "
                    "the audited statement is WRONG), or this city deliberately stores another "
                    'source, which must be declared as "_taxConvention".')
    return fails, notes, proven


def main():
    argv = sys.argv[1:]
    args = [a for a in argv if not a.startswith("-")]
    quiet = "--quiet" in argv
    extracted = {}
    if "--extracted" in argv:
        path = argv[argv.index("--extracted") + 1]
        try:
            for rec in json.load(open(path, encoding="utf-8")):
                gr = ((rec.get("soa") or {}).get("generalRevenues")) or {}
                gr = {k: v for k, v in gr.items() if not k.startswith("_") and k != "UNRESOLVED"}
                if gr and rec.get("year"):
                    extracted[int(rec["year"])] = gr
        except Exception as e:
            print(f"ERROR: cannot read --extracted JSON: {e}", file=sys.stderr)
            return 2
    if not args:
        print(__doc__)
        return 2
    try:
        staged = json.load(open(args[0], encoding="utf-8"))
    except Exception as e:
        print(f"ERROR: cannot read staging JSON: {e}", file=sys.stderr)
        return 2

    fails, notes, counts = check(staged, extracted)
    if not quiet:
        print(
            f"proved: {counts['pension']} plan-year funded ratios, {counts['accrual']} accrual "
            f"sums, {counts['modacc']} modified-accrual reconciliations, "
            f"{counts['taxyear']} tax-row years, {counts['soatax']} tax years against the "
            f"audited SoA, {counts['omitted']} deliberate omission(s)"
        )
    for n in notes:
        print(f"UNPROVEN  {n}")
    for f in fails:
        print(f"FAIL  {f}")
    print("\nverification ✓ — safe to write" if not fails else f"\n{len(fails)} FAILURE(S) — do NOT write")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
