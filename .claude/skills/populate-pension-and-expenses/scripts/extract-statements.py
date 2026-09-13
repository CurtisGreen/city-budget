#!/usr/bin/env python3
"""Parse the statements a city's optional fields come from, out of a pdftotext/OCR dump.

WHY THIS EXISTS. The expensive part of populate-pension-and-expenses is not reading figures, it is
the find-then-read LOOP: you cannot batch a table read whose anchor you only learn from the previous
read's output. An AFR-style city (no statistical section) needs every year's own report, and the
anchors are not portable across years -- "^REVENUES" lands in the table of contents in one report,
"Total Expenditures" fails to match in the next because OCR ate the spacing. Each miss costs a whole
turn, and every turn re-reads the entire transcript. This script does find-then-read inside ONE
process, over every dump at once.

WHAT IT DOES NOT DO. It does not decide anything. It emits candidate rows VERBATIM plus the
arithmetic the ACFR itself asserts, and it says loudly when a check fails or a table could not be
located. A FAIL is a fact about the report (or about the OCR), not a value to paper over: the two
real defects in the Forest Hill run -- an SoA whose rows sum to $1 more than its own printed total,
and an OCR'd "71.869" that was really 77,869 -- are both found by checks here, and NEITHER is
auto-repaired, because in the second case the plausible repair (71,869) is the wrong number. You
still read what it prints. It just stops costing a turn per table.

  extract-statements.py DUMP...                  # everything it can find, JSON to stdout
  extract-statements.py DUMP... --health         # classify dumps only (scan / mojibake / ok)
  extract-statements.py DUMP... --table soa      # one table kind
  extract-statements.py DUMP... --summary        # human-readable instead of JSON

Table kinds: soa (government-wide Statement of Activities), funds (governmental funds Statement of
Revenues, Expenditures and Changes in Fund Balances), rsi (both pension RSI schedules), mda (the
MD&A condensed "Changes in Net Position" -- the fallback an AFR city needs, and the only place a
RESTATED prior year is printed at function granularity).

Health matters before anything else: a dump can be a scan (no text at all) or MOJIBAKE (plenty of
text, all of it from a broken ToUnicode map -- Forest Hill FY2019). Mojibake passes a naive
"does it have text?" test, so it is detected here by word shape, and both cases are told to go OCR.
"""

import argparse
import json
import os
import re
import sys

# ---------------------------------------------------------------- tokenising

# A figure that can START the numeric part of a row, and therefore END the label. Deliberately
# stricter than "any digits": a label may legitimately contain a small bare number ("Fund 53",
# "GASB 87", "PID No.1"), so a token only ends the label when it is money-shaped -- comma-grouped,
# $-prefixed, parenthesised, or four-plus digits (which also catches a bare year header).
HARD_FIG = re.compile(
    r"\(\s*\$?\s*\d[\d,]*(?:\.\d+)?\s*\)"   # (1,246,120)
    r"|\$\s*-?\d[\d,]*(?:\.\d+)?"            # $ 1,626,601
    r"|\d{1,3}(?:,\d{3})+(?:\.\d+)?"         # 1,626,601
    r"|\d+\.\d+\s*%"                         # 93.45%  -- the RSI funded ratio row has NO other figure
    r"|\b\d{4,}\b"                           # a bare year header / unseparated figure
)
# Any cell once we are past the label: the above, plus bare small numbers, percentages, and a lone
# dash. A dash is an EXPLICIT zero printed in the cell -- dropping it would shift every later column.
CELL = re.compile(
    r"\(\s*\$?\s*(?P<pneg>[\d,]+(?:\.\d+)?)\s*\)"      # (1,246,120)  negative
    r"|(?P<pct>\d[\d,]*\.\d+)\s*%"                      # 93.45%
    r"|(?:\$\s*)?(?P<num>\d[\d,]*(?:\.\d+)?)"           # $ 1,626,601 -- NO leading \s*,
    #                                          which would win at the space before a "%" cell
    r"|(?P<dash>[-:])"                                  # an empty/zero cell (OCR writes a dash as ":")
)


def _f(tok: str):
    return float(tok.replace(",", "").replace("$", "").strip())


DASH_CELL = re.compile(r"(?<=\s\s)-(?=\s\s|\s*$)")
LOOSE_FIG = re.compile(r"(?<=\s\s)\(?\$?\s*\d{1,3}\)?(?=\s|$)")


def split_row(line: str, loose: bool = False):
    """-> (label, [cells]) where a cell is float | {"pct": float} | None-for-dash-as-zero.

    Cells keep left-to-right ORDER including printed dashes, so a short row cannot silently shift
    its columns. Works on both `pdftotext -layout` (padded columns) and tesseract output (padding
    collapsed to single spaces), because it never relies on the padding.
    """
    m = HARD_FIG.search(line)
    if not m and loose:
        m = LOOSE_FIG.search(line)
    if not m:
        # An all-dashes row is a row of printed zeros, not an absent row.
        dashes = list(DASH_CELL.finditer(line))
        if len(dashes) >= 2:
            lab = re.sub(r"\s{2,}", " ", line[: dashes[0].start()].strip(" .$\t")).strip(" :.-")
            return lab, [0.0] * len(dashes)
        return line.strip(), []
    label = line[: m.start()].strip(" .$\t")
    label = re.sub(r"\s{2,}", " ", label).strip(" :.-")
    cells = []
    for c in CELL.finditer(line[m.start() :]):
        if c.group("pneg") is not None:
            cells.append(-_f(c.group("pneg")))
        elif c.group("pct") is not None:
            cells.append({"pct": _f(c.group("pct"))})
        elif c.group("num") is not None:
            cells.append(_f(c.group("num")))
        else:
            cells.append(0.0)
    return label, cells


def nums(cells):
    """Just the plain numeric cells, percentages dropped."""
    return [c for c in cells if isinstance(c, float)]


# ---------------------------------------------------------------- health

WORDS = re.compile(r"[A-Za-z]{3,}")
KNOWN = (
    "the of and city fund total revenue expenditures statement position assets net for year "
    "general government tax taxes activities financial balance"
).split()


def health(text: str):
    """ok | scan | mojibake, with the evidence. Mojibake = text present, but not English."""
    if len(text.strip()) < 2000:
        return "scan", f"{len(text.strip())} chars of text -- image-only PDF, OCR it"
    words = [w.lower() for w in WORDS.findall(text)]
    if not words:
        return "mojibake", "no alphabetic words at all"
    hits = sum(w in KNOWN for w in words)
    rate = hits / len(words)
    # A real ACFR is dense in these words; a broken ToUnicode map yields plausible-looking letter
    # soup that contains almost none of them.
    if rate < 0.01:
        return "mojibake", (
            f"only {hits} of {len(words)} words are common ACFR vocabulary ({rate:.3%}) -- broken "
            "text encoding, pdftotext output is unusable; OCR it"
        )
    return "ok", f"{len(words):,} words, {rate:.1%} common ACFR vocabulary"


# ---------------------------------------------------------------- locating

TOC_LEADER = re.compile(r"\.{3,}|…")


def is_toc(line: str) -> bool:
    """A contents entry: dot leaders, or a title trailed by nothing but a page number."""
    s = line.rstrip()
    if TOC_LEADER.search(s):
        return True
    return bool(re.search(r"[A-Za-z]{6,}[\s.]+\d{1,3}\s*$", s) and "," not in s)


def find_anchor(lines, patterns, start=0, need_after=None, within=60):
    """First non-TOC line matching any pattern (ranked). need_after = a pattern that must appear
    within `within` lines below, which is what separates a real "EXPENDITURES" from a heading."""
    for pat in patterns:
        rx = re.compile(pat, re.I)
        for i in range(start, len(lines)):
            if not rx.search(lines[i]) or is_toc(lines[i]):
                continue
            if need_after:
                nx = re.compile(need_after, re.I)
                if not any(nx.search(l) for l in lines[i + 1 : i + 1 + within]):
                    continue
            return i
    return None


# ---------------------------------------------------------------- statements

TOTAL_GOV_ACT = r"total\s+governmental\s+activities"
STOP_SOA = re.compile(r"business[- ]type|total\s+primary\s+government|general\s+revenue", re.I)


def parse_soa(lines):
    """Government-wide Statement of Activities: the governmental-activities EXPENSES column.

    The expenses column is the FIRST figure on each function row in every layout seen. The row set
    is proven against the report's own "Total Governmental Activities" line -- which is the check
    that caught Forest Hill FY2016 printing 9,840,987 against rows summing to 9,840,988.
    """
    i = find_anchor(lines, [r"functions?\s*/\s*programs?"], need_after=TOTAL_GOV_ACT, within=40)
    if i is None:
        return {"found": False, "why": "no 'Functions/Programs' line with a governmental-activities total below it"}
    end = next((j for j in range(i + 1, min(i + 60, len(lines))) if re.search(TOTAL_GOV_ACT, lines[j], re.I)), None)
    if end is None:
        return {"found": False, "why": "found Functions/Programs but no 'Total Governmental Activities'"}

    rows = []
    for j in range(i + 1, end):
        label, cells = split_row(lines[j])
        n = nums(cells)
        if not n or not label or len(label) < 3:
            continue
        if STOP_SOA.search(label) or re.search(r"^(primary|governmental activities)", label, re.I):
            continue
        rows.append({"name": label, "value": int(n[0]), "line": j + 1})
    printed = nums(split_row(lines[end])[1])
    total = int(printed[0]) if printed else None
    if total is None:
        return {"found": True, "line": i + 1,
                "rows": [{"name": r["name"], "value": r["value"]} for r in rows],
                "printedTotalGovActivities": None,
                "rowSum": sum(r["value"] for r in rows),
                "TOTAL_UNREADABLE": (
                    "no figure could be parsed from the 'Total Governmental Activities' line, so "
                    f"the row set is UNPROVEN. Raw line {end + 1}: {lines[end].strip()[:120]!r}"),
                "generalRevenues": parse_general_revenues(lines, end)}
    s = sum(r["value"] for r in rows)
    if total is not None and s and not (0.5 <= total / s <= 2):
        return {
            "found": True, "line": i + 1,
            "rows": [{"name": r["name"], "value": r["value"]} for r in rows],
            "printedTotalGovActivities": None, "rowSum": s,
            "TOTAL_UNREADABLE": (
                f"the 'Total Governmental Activities' line parses to {total:,} against rows summing "
                f"to {s:,} -- the line is damaged (OCR spaces or '.' separators). Raw line "
                f"{end + 1}: {lines[end].strip()[:120]!r}"),
            "generalRevenues": parse_general_revenues(lines, end),
        }
    out = {
        "found": True,
        "line": i + 1,
        "rows": [{"name": r["name"], "value": r["value"]} for r in rows],
        "printedTotalGovActivities": total,
        "rowSum": s,
    }
    if total is not None and s != total:
        out["CHECK_FAIL"] = (
            f"rows sum to {s:,} but the report prints {total:,} (off by {s - total:+,}) -- "
            "a row is misread, or the report itself does not foot; cross-check the MD&A"
        )
    out["generalRevenues"] = parse_general_revenues(lines, end)
    return out


GENREV = [
    ("property", r"property\s+tax"),
    ("sales", r"sales(\s+and\s+use)?\s+tax"),
    ("franchise", r"franchise\s+tax"),
    ("hotel", r"hotel|motel|occupancy\s+tax"),
]
# A label-only line that is a SECTION HEADING rather than a data row. Headings end in a colon
# ("General Revenues:", "Governmental Activities:"); data rows do not ("Property Taxes").
HEADING = re.compile(r":\s*$")
PROSE = re.compile(r"notes to the financial|integral part|this statement|continued|see notes", re.I)


def parse_general_revenues(lines, after):
    """The general-revenues block under the Statement of Activities.

    The easy layout prints label and figure on one line. The hard one -- and the common one -- puts
    the LABELS at the foot of the left page with no figures at all and the FIGURES on the facing
    page, under the net-(expense) column. Zipping the two from the top is wrong: the facing page's
    numeric block BEGINS with one net-expense row per function, so the first label lands on a
    function's net expense instead of on property tax.

    So the block is located by proof rather than by position. The general revenues are the unique
    run of consecutive numeric rows whose governmental column sums to the row immediately after it
    -- that next row being the printed "Total General Revenues and Transfers". If no run satisfies
    that, or more than one does, this reports UNRESOLVED rather than guessing an offset.
    """
    win = lines[after : after + 160]
    # Anchor on the "General Revenues" heading and read only the block BELOW it. Scanning the whole
    # window matches a tax name anywhere on the page -- Forest Hill's fund-balance section carries a
    # "Hotel-Motel Tax" line whose figure is a FUND BALANCE, which silently became its hotel tax.
    gr = next((k for k, l in enumerate(win) if re.search(r"general\s+revenue", l, re.I)), None)
    if gr is None:
        return {"UNRESOLVED": "no 'General Revenues' heading under the Statement of Activities"}
    win = win[gr:]
    direct, labels = {}, []
    for l in win[:40]:
        label, cells = split_row(l)
        n = nums(cells)
        if re.match(r"total\s+general\s+revenue|change\s+in\s+net\s+position", label or "", re.I):
            break
        for key, pat in GENREV:
            if re.search(pat, l, re.I) and key not in direct and n:
                direct[key] = int(n[0])
    for l in win:
        label, cells = split_row(l)
        n = nums(cells)
        if not n and label and not HEADING.search(l) and not PROSE.search(l):
            if re.match(r"total\s+general\s+revenue", label, re.I):
                labels.append("__TOTAL__")
                break
            labels.append(label)
    if direct:
        return direct
    labels = [x for x in labels if not re.search(r"general\s+revenue", x, re.I)]
    if not labels or labels[-1] != "__TOTAL__":
        return {"UNRESOLVED": "could not read an ordered general-revenue label list off the page"}
    labels = labels[:-1]

    vals = [int(nums(split_row(l, loose=True)[1])[0])
            for l in win
            if nums(split_row(l, loose=True)[1])
            and not re.search(r"[A-Za-z]{3,}", split_row(l, loose=True)[0] or "")
            and not re.match(r"^\s*-?\s*\d{1,3}\s*-?\s*$", l)]
    # A label can print with no row at all in the facing block (an all-zero "Gain on disposal of
    # capital assets"), so the run is allowed to be slightly SHORTER than the label list. Try the
    # longest first and require the winning run to be unique across every length tried.
    # The run must be EXACTLY as long as the label list. Allowing a shorter one to absorb a label
    # that prints no row looked helpful and was not: the net-(expense) block above also sums to its
    # own total, so a shorter run matched there and mapped property tax to a negative net expense.
    # The shape of the block rejects that: general revenues START with property tax, which is always
    # positive, and are mostly positive thereafter (investment income goes negative in a bad year,
    # as Forney's FY2019 and FY2022 both do), whereas a net-(expense) block starts negative and is
    # mostly negative.
    k = len(labels)
    hits = [(k, i) for i in range(0, len(vals) - k)
            if vals[i + k] and sum(vals[i : i + k]) == vals[i + k]
            and vals[i] > 0 and sum(1 for v in vals[i : i + k] if v > 0) * 2 > k]
    if len(hits) != 1:
        return {"UNRESOLVED": (
            f"{len(labels)} general-revenue labels print with no figures; "
            f"{'no' if not hits else len(hits)} run(s) in the facing numeric block sum to the row "
            "after them, so the block could not be located by proof")}
    _, i = hits[0]
    out = {"_proof": (f"located by sum: the {k} values at offsets {i}..{i + k - 1} of the facing "
                      f"numeric block total {vals[i + k]:,}, the printed "
                      f"'Total General Revenues and Transfers'")}
    # Map from the START of the proven run: the tax lines are the first general revenues in every
    # layout seen, so a row missing further down cannot displace them.
    for label, v in zip(labels, vals[i : i + k]):
        for key, pat in GENREV:
            if key not in out and re.search(pat, label, re.I):
                out[key] = v
    return out


FUND_TAXES = [("property", r"^propert"), ("sales", r"^sales"), ("hotel", r"hotel|motel")]
SECTION = re.compile(r"^(current|capital\s+(outlay|projects)|debt\s+service|expenditures)\b", re.I)


def continuation_for(lines, j, e):
    """The continuation map for the statement whose EXPENDITURES line is j and total line is e."""
    start = next((k for k in range(j, max(0, j - 45), -1)
                  if re.match(r"\s*REVENUES?\b", lines[k], re.I)), None)
    if start is None:
        return {}
    stop = next((k for k in range(e, min(e + 45, len(lines)))
                 if re.search(r"fund balance.{0,3}s?\s*[-–]\s*ending|fund balances?,? end", lines[k], re.I)), None)
    if stop is None:
        return {}
    return continuation_totals(lines, start, stop)


def continuation_totals(lines, stmt_start, stmt_end):
    """Total Governmental Funds column for a statement whose columns spill onto a second page.

    `pdftotext` emits the facing page as a block of figures with no row labels at all, in the SAME
    ROW ORDER as page 1. So page 1 gives every label and the continuation gives the columns that did
    not fit -- the rightmost of which is Total Governmental Funds. Alignment is positional, which is
    only safe if the two row counts agree exactly; when they do not, this returns nothing rather
    than guessing an offset (an off-by-one here would silently shift every figure onto a neighbour).

    -> {page1_line_number: total} or {}
    """
    page1 = [j for j in range(stmt_start, stmt_end + 1) if nums(split_row(lines[j], loose=True)[1])]
    cont, started = [], False
    for j in range(stmt_end + 1, min(stmt_end + 3 + len(page1) * 3, len(lines))):
        label, cells = split_row(lines[j], loose=True)
        n = nums(cells)
        has_label = bool(re.search(r"[A-Za-z]{3,}", label or ""))
        if n and not has_label and not re.match(r"^\s*-?\s*\d{1,3}\s*-?\s*$", lines[j]):
            cont.append((j, n))
            started = True
        elif started and has_label and n:
            break
    if len(cont) != len(page1) or not cont:
        return {}
    return {p: (int(c[-1]), [int(x) for x in c]) for p, (_, c) in zip(page1, cont)}


def parse_funds(lines):
    """Governmental funds Statement of Revenues, Expenditures and Changes in Fund Balances.

    Takes the Total Governmental Funds column = the LAST cell on each row, and proves that choice
    per row: the last cell must equal the sum of the cells before it. That per-row cross-check is
    what catches an OCR'd separator -- Forest Hill FY2023 printed interest as "71.869" where the
    two fund columns were 13,074 and 64,795, i.e. 77,869. It is reported, never auto-corrected:
    the obvious repair (71,869) is not the right number.
    """
    # There are several "EXPENDITURES" lines in a report (MD&A prose, budget schedules, the real
    # statement). Score every candidate by what it actually yields and keep the best, instead of
    # trusting the first match -- Forest Hill FY2024's first match is MD&A prose at line 207 and
    # produces an empty, silently useless block.
    cands = []
    for j, l in enumerate(lines):
        if is_toc(l) or not re.match(r"\s*EXPENDITURES\b|\s*Expenditures\s*$", l):
            continue
        e = next((k for k in range(j + 1, min(j + 60, len(lines)))
                  if re.search(r"total\s+expenditures", lines[k], re.I)), None)
        if e is None:
            continue
        # A BUDGETARY COMPARISON schedule also starts "EXPENDITURES" and also ends "Total
        # Expenditures", and its VARIANCE column foots just as the real statement's Total column
        # does -- so reconciliation alone cannot tell them apart (Forney picks the budget schedule
        # in 10 of 11 years without this). Its column headers give it away.
        # The giveaway sits ABOVE the schedule's own revenue block, so look back far enough to
        # clear it (Forney's "Budgeted Amounts / Original / Final / Variance with Final Budget"
        # header is ~18 lines up). Match the budget-schedule SIGNATURE rather than the bare word
        # "budget", which appears harmlessly in plenty of statement headings.
        head = " ".join(lines[max(0, j - 35):j]).lower()
        if re.search(r"budgeted amounts|variance with|budget and actual"
                     r"|\boriginal\b[\s\S]{0,80}\bfinal\b", head):
            continue
        # The STATISTICAL section's "General Governmental Expenditures by Function, Last Ten Fiscal
        # Years" also opens EXPENDITURES and also foots per column -- but its columns are YEARS, not
        # funds, so its rightmost cell is one fiscal year rather than a Total Governmental Funds
        # column. It is a legitimate and often better source, but it is a different table with
        # different semantics, so it must never be returned AS the fund statement.
        if re.search(r"last ten (fiscal|calendar) years|last ten years", head):
            continue
        cands.append((j, e))
    if not cands:
        return {"found": False, "why": "no EXPENDITURES block with a 'Total Expenditures' below it"}
    scored = []
    for j, e in cands:
        cand_merged = continuation_for(lines, j, e)
        if cand_merged:
            rows = [[cand_merged[k][0]] for k in range(j + 1, e) if k in cand_merged]
            tot = [cand_merged[e][0]] if e in cand_merged else []
        else:
            rows = [n for n in (nums(split_row(lines[k], loose=True)[1]) for k in range(j + 1, e)) if n]
            tot = nums(split_row(lines[e])[1])
        # A budgetary schedule's columns are budget/actual/variance, so its rows do NOT foot to the
        # rightmost total; the real statement's do. That difference is the whole discriminator.
        foots = bool(tot) and tot[-1] > 0 and abs(sum(n[-1] for n in rows) - tot[-1]) < max(2.0, tot[-1] * 0.02)
        scored.append((foots, len(rows), len(tot), j, e))
    scored.sort(reverse=True)
    _, _, _, i, end = scored[0]

    merged = continuation_for(lines, i, end)
    cur, capital, debt, crosscheck = [], {}, {}, []
    section = "current"
    for j in range(i + 1, end):
        raw = lines[j]
        label, cells = split_row(raw, loose=True)
        n = nums(cells)
        head = raw.strip()
        if SECTION.match(head) and not n:
            section = "capital" if re.match(r"capital", head, re.I) else (
                "debt" if re.match(r"debt", head, re.I) else "current")
            continue
        if not n or not label:
            continue
        if re.match(r"capital\s+(outlay|projects)", label, re.I):
            section = "capital"
        if re.match(r"debt\s+service", label, re.I):
            section = "debt"
        val = merged[j][0] if j in merged else int(n[-1])
        if j in merged:
            # columns span two pages: page 1's cells plus the continuation's, minus its Total
            cont = merged[j][1]
            parts = sum(n) + sum(cont[:-1])
            if len(cont) >= 2 and abs(parts - cont[-1]) > 0.5:
                crosscheck.append({
                    "line": j + 1, "name": label,
                    "cells": [int(x) for x in n] + cont,
                    "problem": f"columns across both pages sum to {int(parts):,} but the Total "
                               f"Governmental Funds cell is {cont[-1]:,}",
                })
        elif len(n) >= 3 and abs(sum(n[:-1]) - n[-1]) > 0.5:
            crosscheck.append({
                "line": j + 1, "name": label, "cells": [int(x) for x in n],
                "problem": f"columns sum to {int(sum(n[:-1])):,} but the row's last cell is {val:,}",
            })
        if section == "capital":
            capital[label] = capital.get(label, 0) + val
        elif section == "debt":
            debt[label] = val
        else:
            cur.append({"name": label, "value": val})

    unparsed = []
    for j in range(i + 1, end):
        raw = lines[j]
        if nums(split_row(raw)[1]) or not re.search(r"\d", raw):
            continue
        if re.search(r"\d+\.\d{3}\b", raw):
            unparsed.append({"line": j + 1, "text": raw.strip()[:120],
                             "why": "digit groups separated by '.' where the table uses ',' -- "
                                    "OCR misread the separator; re-read this row in the PDF"})
    printed = nums(split_row(lines[end])[1]) if end else []
    total = merged[end][0] if end in merged else (int(printed[-1]) if printed else None)
    # A statement split across two pages puts the Total Governmental Funds column on the CONTINUATION
    # page, so page 1's rightmost column is some individual fund -- and it reconciles perfectly,
    # which is what makes it dangerous. The Total column is the largest on essentially every row;
    # if the rightmost usually is not, say so rather than returning a tidy wrong answer.
    widths = [len(nums(split_row(lines[j])[1])) for j in range(i + 1, end)]
    notmax = sum(1 for j in range(i + 1, end)
                 for n in [nums(split_row(lines[j])[1])]
                 if len(n) >= 2 and n[-1] < max(n))
    rowsn = sum(1 for w in widths if w >= 2)
    ds = {}
    for k, v in debt.items():
        key = ("principal" if re.search(r"principal", k, re.I) else
               "interest" if re.search(r"interest", k, re.I) else
               "issuanceCosts" if re.search(r"issuance", k, re.I) else
               "refundingEscrow" if re.search(r"escrow|refund", k, re.I) else k)
        ds[key] = v
    cap = sum(capital.values())
    parts = sum(c["value"] for c in cur) + sum(v for v in ds.values()) + cap
    out = {
        "found": True, "line": i + 1,
        "taxes": parse_fund_taxes(lines, i, merged),
        "current": cur, "capitalOutlay": cap, "capitalOutlayParts": capital,
        "debtService": ds, "printedTotal": total, "partsSum": parts,
    }
    if total is not None and parts != total:
        out["CHECK_FAIL"] = (f"current+debt+capital = {parts:,} but 'Total Expenditures' prints "
                             f"{total:,} (off by {parts - total:+,})")
    if crosscheck:
        out["ROW_CROSSCHECK_FAIL"] = crosscheck
    out["columnsPerRow"] = sorted({w for w in widths if w})
    if unparsed:
        out["UNPARSED_ROWS"] = unparsed
    if not cap and not ds:
        out["INCOMPLETE_BLOCK"] = (
            "no capital outlay and no debt service rows were found -- a governmental funds "
            "statement has both, so this is probably a fragment of one column rather than the "
            "whole statement. Its parts still sum to its own total, so no other check sees it.")
    if merged:
        out["continuationPageMerged"] = (
            f"the Total Governmental Funds column was read from the continuation page "
            f"({len(merged)} rows aligned positionally against page 1)")
    if not merged and rowsn and notmax / rowsn > 0.3:
        out["COLUMN_SUSPECT"] = (
            f"{notmax} of {rowsn} rows have a rightmost cell that is NOT the row's largest -- the "
            "Total Governmental Funds column is probably on a CONTINUATION page and these figures "
            "are one individual fund. Such a column still reconciles; check the page break."
        )
    return out


def parse_fund_taxes(lines, expend_line, merged=None):
    """The tax rows of the revenue block directly above the expenditures block."""
    start = max(0, expend_line - 40)
    out = {}
    for j in range(start, expend_line):
        label, cells = split_row(lines[j])
        n = nums(cells)
        if not n or not label:
            continue
        for key, pat in FUND_TAXES:
            if key not in out and re.search(pat, label, re.I):
                out[key] = (merged or {}).get(j, (int(n[-1]),))[0]
    return out


# ---------------------------------------------------------------- pension RSI

RSI_ROWS = [
    ("totalPensionLiability", r"total pension liabilit(y|ies)\s*[-–]\s*ending"),
    ("fiduciaryNetPosition", r"(plan )?fiduciary net position\s*[-–]\s*ending"),
    ("printedFundedRatio", r"percentage\s+of\s+total pension liabilit|as a percentage of the total pension"),
    ("actuariallyDeterminedContribution", r"actuarially determined contribution"),
    ("actualContribution", r"contributions?\s+in\s+relation"),
]
YEAR_HDR = re.compile(r"(measurement|plan)\s+year|fiscal\s+year\s+end|year\s+ended\s+(december|september)", re.I)


def parse_rsi(lines):
    """Both RSI schedules, as COLUMN GROUPS.

    Year labelling is the single most expensive pension mistake and it is city-specific: a TMRS
    schedule headed "Plan Year Ended December 31" means FY = year + 1, while a schedule headed
    "Fiscal Year Ended September 30" does not -- and the two schedules in ONE report can disagree.
    So this never converts anything: it reports each block's header text verbatim alongside its
    years, and you decide. Continuation pages (a bare row of years, no row labels) come back as
    their own group in order.
    """
    groups = []
    for i, l in enumerate(lines):
        if is_toc(l):
            continue
        if not re.search(r"schedule of (changes in net pension|contributions)", l, re.I):
            continue
        kind = "npl" if re.search(r"changes in net pension", l, re.I) else "contrib"
        win = lines[i : i + 70]
        # "Last Ten Measured Years" also matches YEAR_HDR but says nothing about the BASIS;
        # the "... Year Ended <Month> <day>," line is the one that decides MY-vs-FY, so rank it first.
        basis = re.compile(r"year\s+ended\s+(december|september|june|august)\s+\d{1,2}\s*,?\s*$", re.I)
        loose = re.compile(r"year\s+ended\s+(december|september|june|august)", re.I)
        hdr = (next((w.strip() for w in win if basis.search(w.strip())), None)
               or next((w.strip() for w in win if loose.search(w)), None)
               or next((w.strip() for w in win if YEAR_HDR.search(w)), None))
        years = []
        for w in win[:14]:
            ys = [int(m.group(0)) for m in re.finditer(r"\b(?:19|20)\d{2}\b", w)]
            if len(ys) >= 2:
                years = ys
                break
        rows = {}
        for wi, w in enumerate(win):
            label, cells = split_row(w)
            # NB the funded-ratio row is percentages only -- test `cells`, never `nums(cells)`.
            # An RSI row label routinely wraps; the figures sit on the SECOND line, so match the
            # previous figure-less line joined onto this one.
            if wi and not HARD_FIG.search(win[wi - 1]):
                prev = re.sub(r"\s{2,}", " ", win[wi - 1].strip())
                if 3 <= len(prev) <= 60:
                    label = (prev + " " + label).strip()
            n = nums(cells)
            if not cells:
                continue
            for key, pat in RSI_ROWS:
                if re.search(pat, label, re.I) and key not in rows:
                    pcts = [c["pct"] for c in cells if isinstance(c, dict)]
                    rows[key] = {"values": [int(abs(x)) for x in n]} if key != "printedFundedRatio" \
                        else {"values": pcts or [abs(x) for x in n]}
        if rows:
            groups.append({"kind": kind, "line": i + 1, "header": hdr, "years": years, "rows": rows})
    # An RSI schedule routinely continues onto a further page whose rows carry NO labels at all
    # (Forney prints 3 measurement years, then 7 more). Those pages are NOT parsed. Say so, rather
    # than returning a short series that looks complete: taking 3 of 10 years as the whole history
    # is the expensive mistake here.
    # Do not key this off the title -- Forney's schedule never says "Last Ten". The reliable signal
    # is a SECOND year header inside the schedule's own window: that is the continuation page.
    for g in groups:
        extra = []
        for w in lines[g["line"] : g["line"] + 70]:
            ys = _year_header(w)
            if ys and set(ys) - set(g["years"]):
                extra = ys
                break
        if extra:
            g["INCOMPLETE"] = (
                f"only years {g['years']} are on this page; a continuation page at the same "
                f"schedule carries {extra}, and its rows have NO labels, so this parser does not "
                "read them. Get them with show-table.py and align them positionally against the "
                "labelled block above. Do not treat the years above as the whole series.")
    return groups


# ---------------------------------------------------------------- statistical section

STAT_ANCHOR = re.compile(r"last ten (fiscal|calendar) years|last ten years", re.I)
YEAR = re.compile(r"\b(?:19|20)\d{2}\b")
STAT_SECTION_STOP = re.compile(r"^\s*(schedule of|notes to)", re.I)


def _year_header(line):
    """Years on a header line: >=2 four-digit years and no money-shaped figure."""
    ys = [int(m.group(0)) for m in YEAR.finditer(line)]
    if len(ys) < 2:
        return []
    if re.search(r"[\d,]+,\d{3}|\$", line):
        return []
    return ys


def parse_stat(lines):
    """The statistical section's ten-year tables.

    These are the cheapest source in the whole job -- one table carries every year -- and they are
    the most dangerous, because their columns are YEARS and the year header is re-typeset on every
    page the table spans. A page whose header is mis-keyed still sums to its own totals, so nothing
    inside that page can detect it (Duncanville's FY2024 ACFR heads the expenses page 2015-2018 and
    the general-revenues page 2014-2017 while both hold the same four years). This parser therefore
    reports every page's year header SEPARATELY and verbatim, and flags when one table's pages
    disagree -- overlapping or non-contiguous year runs are the signature of exactly that error.

    Two layouts appear. Years-as-COLUMNS (Changes in Net Position, Changes in Fund Balances): row
    labels down the left, one column per year, continuation pages carrying figures with no labels
    at all. Years-as-ROWS (Tax Revenues by Source): one line per year, columns are the tax types.
    """
    anchors = []
    for i, l in enumerate(lines):
        if not STAT_ANCHOR.search(l) or is_toc(l):
            continue
        near = " ".join(lines[max(0, i - 6):i + 3])
        if re.search(r"schedule of (changes in|contributions|employer)|pension|opeb", near, re.I):
            continue
        anchors.append(i)
    out = []
    for k, i in enumerate(anchors):
        stop = anchors[k + 1] if k + 1 < len(anchors) else min(i + 260, len(lines))
        for j in range(i + 1, stop):
            if STAT_SECTION_STOP.match(lines[j]):
                stop = j
                break
        title = next((lines[j].strip() for j in range(i - 1, max(0, i - 6), -1)
                      if lines[j].strip() and not YEAR.search(lines[j])
                      and not re.search(r"city of", lines[j], re.I)), "?")
        basis = next((lines[j].strip(" ()") for j in range(i, min(i + 4, len(lines)))
                      if re.search(r"basis of accounting", lines[j], re.I)), None)
        tbl = {"title": title, "basis": basis, "line": i + 1}
        rows_as_years = _parse_years_as_rows(lines, i, stop)
        if rows_as_years:
            tbl.update(orientation="years-as-rows", **rows_as_years)
        else:
            tbl.update(orientation="years-as-columns", **_parse_years_as_cols(lines, i, stop))
        out.append(tbl)
    return out


def _parse_years_as_rows(lines, start, stop):
    """Tax Revenues by Source style: each line begins with the fiscal year."""
    byyear, head = {}, []
    for j in range(start, stop):
        label, cells = split_row(lines[j])
        n = nums(cells)
        m = re.match(r"\s*((?:19|20)\d{2})\b", lines[j])
        if not m or len(n) < 3:
            if label and not n:
                head.append(label)
            continue
        yr = int(m.group(1))
        # the year itself is the row's first parsed figure; the money follows it
        vals = [int(x) for x in n if abs(x) != yr] if n and int(n[0]) == yr else [int(x) for x in n]
        byyear[yr] = vals
    if len(byyear) < 4:
        return None
    return {"columnHeader": " | ".join(head[-3:]), "byYear": byyear,
            "note": "columns are the table's own column headings, in printed order -- match them "
                    "to the header text yourself; this parser does not name them"}


def _parse_years_as_cols(lines, start, stop):
    """Changes in Net Position / Changes in Fund Balances style: one column per year, spanning
    pages, with continuation pages carrying no row labels."""
    groups, cur = [], None
    for j in range(start, stop):
        ys = _year_header(lines[j])
        if ys:
            cur = {"line": j + 1, "years": ys, "headerText": lines[j].strip()[:120], "rows": []}
            groups.append(cur)
            continue
        if cur is None:
            continue
        if re.match(r"^\s*-?\s*\d{1,3}\s*-?\s*$", lines[j]) or re.match(r"\s*TABLE\s+\d", lines[j]):
            continue
        label, cells = split_row(lines[j], loose=True)
        n = nums(cells)
        if not n:
            continue
        cur["rows"].append({"line": j + 1, "name": label, "values": [int(x) for x in n]})
    if not groups:
        return {"pages": [], "rows": [], "STAT_UNPARSED": "no year header found under the anchor"}

    fails, base = [], groups[0]
    # a table's pages must hold DIFFERENT, CONTIGUOUS years; overlap is the mis-keyed-header signature
    seen = {}
    for g in groups:
        for y in g["years"]:
            if y in seen and seen[y] != g["line"]:
                fails.append(
                    f"year {y} appears in the header on BOTH line {seen[y]} and line {g['line']} "
                    f"({g['headerText']!r}) -- one of these pages is headed with the WRONG YEARS; "
                    "each page sums to its own totals, so only this comparison sees it")
            seen[y] = g["line"]
    allyears = sorted(seen)
    if allyears and len(allyears) != (allyears[-1] - allyears[0] + 1):
        fails.append(f"the pages' headers cover {allyears} -- not a contiguous run, so a page header "
                     "is probably mis-keyed")

    rows, unaligned = [], []
    for r in base["rows"]:
        if len(r["values"]) != len(base["years"]):
            continue
        rows.append({"name": r["name"], "line": r["line"],
                     "byYear": dict(zip(base["years"], r["values"]))})
    # continuation pages carry no labels; align positionally, and only when the counts agree
    for g in groups[1:]:
        if g is base:
            continue
        unlabelled = [r for r in g["rows"] if not re.search(r"[A-Za-z]{3,}", r["name"] or "")]
        labelled = [r for r in g["rows"] if re.search(r"[A-Za-z]{3,}", r["name"] or "")]
        src = unlabelled if len(unlabelled) > len(labelled) else labelled
        if len(src) != len(base["rows"]):
            fails.append(
                f"continuation page at line {g['line']} has {len(src)} figure rows against page 1's "
                f"{len(base['rows'])} -- NOT aligned, so its years {g['years']} are attached to no "
                "row. Both pages' rows are returned under 'unalignedPages'; align them by section "
                "order yourself. (pdftotext splits a long row across lines and drops an all-zero "
                "row, which is usually the whole discrepancy.)")
            unaligned.append({"line": g["line"], "years": g["years"], "rows": g["rows"]})
            continue
        for br, cr in zip(base["rows"], src):
            if len(cr["values"]) != len(g["years"]):
                continue
            tgt = next((x for x in rows if x["line"] == br["line"]), None)
            if tgt:
                tgt["byYear"].update(dict(zip(g["years"], cr["values"])))
    res = {"pages": [{"line": g["line"], "years": g["years"], "headerText": g["headerText"]}
                     for g in groups],
           "rows": rows}
    if unaligned:
        res["unalignedPages"] = [{"line": base["line"], "years": base["years"],
                                  "rows": base["rows"]}] + unaligned
    if fails:
        res["STAT_CHECK_FAIL"] = fails
    return res


# ---------------------------------------------------------------- MD&A

def parse_mda(lines):
    """The MD&A condensed "Changes in Net Position" table.

    Two columns (this year, prior year) at coarse function granularity. It is the fallback for an
    AFR-style city with no statistical section, the only printed source for a RESTATED prior year's
    expenses, and an independent check on the SoA -- Forest Hill FY2016's $1 discrepancy is visible
    only by comparing the two.
    """
    i = find_anchor(lines, [r"changes? in net position\s*$", r"changes? in net position"],
                    need_after=r"total (expenses|revenues)", within=60)
    if i is None:
        return {"found": False, "why": "no MD&A 'Changes in Net Position' table"}
    out, section = {"found": True, "line": i + 1, "revenues": [], "expenses": []}, None
    for j in range(i, min(i + 70, len(lines))):
        label, cells = split_row(lines[j])
        head = lines[j].strip()
        if re.match(r"revenues?\s*:?\s*$", head, re.I):
            section = "revenues"
            continue
        if re.match(r"expenses?\s*:?\s*$", head, re.I):
            section = "expenses"
            continue
        n = nums(cells)
        if not section or not n or not label:
            continue
        if re.match(r"total\s+(expenses|revenues)", label, re.I):
            out[f"printedTotal_{section}"] = [int(x) for x in n[:2]]
            if section == "expenses":
                break
            continue
        out[section].append({"name": label, "values": [int(x) for x in n[:2]]})
    for sec in ("revenues", "expenses"):
        printed = out.get(f"printedTotal_{sec}")
        rows = out.get(sec) or []
        if not printed or not rows:
            continue
        for col in range(min(2, len(printed))):
            got = sum(r["values"][col] for r in rows if len(r["values"]) > col)
            if got == printed[col]:
                continue
            gap = got - printed[col]
            # The MD&A table lists governmental AND business-type functions but totals them in
            # separate columns, so the gap is usually exactly the business-type row (Water & Sewer /
            # Utilities Fund). Naming it turns a scary delta into "drop this row and it foots".
            culprit = next((r["name"] for r in rows
                            if len(r["values"]) > col and r["values"][col] == gap), None)
            msg = (f"{sec} column {col + 1}: rows sum to {got:,} but the table prints "
                   f"{printed[col]:,} (off by {gap:+,})")
            if culprit:
                out.setdefault("NOTE", []).append(
                    msg + f" -- exactly the {culprit!r} row, which is the business-type column; "
                          "excluding it, the column foots")
            else:
                out.setdefault("CHECK_FAIL", []).append(msg)
    return out


# ---------------------------------------------------------------- driver

def year_of(path):
    m = re.search(r"(?:19|20)\d{2}", os.path.basename(path))
    return int(m.group(0)) if m else None


def main():
    ap = argparse.ArgumentParser(add_help=False)
    ap.add_argument("dumps", nargs="+")
    ap.add_argument("--table", choices=["soa", "funds", "rsi", "mda", "stat"], action="append")
    ap.add_argument("--health", action="store_true")
    ap.add_argument("--summary", action="store_true")
    ap.add_argument("-h", "--help", action="store_true")
    a = ap.parse_args()
    if a.help:
        print(__doc__)
        return 0

    want = a.table or ["soa", "funds", "rsi", "mda", "stat"]
    results = []
    for path in a.dumps:
        text = open(path, encoding="utf-8", errors="replace").read()
        st, why = health(text)
        rec = {"file": os.path.basename(path), "year": year_of(path), "health": st, "healthWhy": why}
        if st == "ok" and not a.health:
            lines = text.split("\n")
            if "soa" in want:
                rec["soa"] = parse_soa(lines)
            if "funds" in want:
                rec["funds"] = parse_funds(lines)
            if rec.get("soa", {}).get("found") and rec.get("funds", {}).get("found"):
                acc = rec["soa"].get("printedTotalGovActivities") or rec["soa"].get("rowSum")
                mod = rec["funds"].get("printedTotal")
                if acc and mod and not (0.3 <= mod / acc <= 5):
                    rec["funds"]["WRONG_TABLE_SUSPECT"] = (
                        f"total expenditures {mod:,} is {mod / acc:.3g}x the Statement of "
                        f"Activities' governmental expenses {acc:,}. The two bases differ by "
                        "capital outlay and depreciation, never by this much -- the EXPENDITURES "
                        "block chosen is probably not the fund statement.")
            if "rsi" in want:
                rec["rsi"] = parse_rsi(lines)
            if "mda" in want:
                rec["mda"] = parse_mda(lines)
            if "stat" in want:
                rec["stat"] = parse_stat(lines)
        results.append(rec)

    if a.summary or a.health:
        for r in results:
            print(f"\n=== {r['file']}  (FY{r['year']})  health={r['health']}: {r['healthWhy']}")
            if a.health:
                continue
            for k in ("soa", "funds", "mda"):
                v = r.get(k)
                if not v:
                    continue
                if not v.get("found"):
                    print(f"  {k}: NOT FOUND -- {v['why']}")
                    continue
                bits = []
                if k == "soa":
                    t = v.get("printedTotalGovActivities")
                    bits.append(f"{len(v['rows'])} function rows, rowSum {v['rowSum']:,}, "
                                + (f"printed total {t:,}" if t is not None else "printed total UNREADABLE"))
                if k == "funds":
                    bits.append(f"{len(v['current'])} current rows, total {v['printedTotal']:,}"
                                if v.get("printedTotal") is not None else
                                f"{len(v['current'])} current rows, NO printed total")
                    if v.get("columnsPerRow"):
                        bits.append(f"columns/row {v['columnsPerRow']}")
                if k == "mda":
                    bits.append(f"{len(v['expenses'])} expense rows x2yr, "
                                f"totals {v.get('printedTotal_expenses')}")
                print(f"  {k}: " + "; ".join(bits))
                for key in ("CHECK_FAIL", "COLUMN_SUSPECT", "TOTAL_UNREADABLE",
                            "WRONG_TABLE_SUSPECT", "INCOMPLETE_BLOCK", "NOTE"):
                    if v.get(key):
                        for msg in (v[key] if isinstance(v[key], list) else [v[key]]):
                            print(f"    !! {key}: {msg}")
                for u in v.get("UNPARSED_ROWS", []):
                    print(f"    !! UNPARSED line {u['line']}: {u['text']}")
                    print(f"       {u['why']}")
                if v.get("ROW_CROSSCHECK_FAIL"):
                    for c in v["ROW_CROSSCHECK_FAIL"]:
                        print(f"    !! ROW line {c['line']} {c['name']!r}: {c['problem']} (cells {c['cells']})")
            for t in r.get("stat") or []:
                if t["orientation"] == "years-as-rows":
                    print(f"  stat L{t['line']} {t['title'][:46]!r}: years-as-rows "
                          f"{sorted(t['byYear'])[:1]}..{sorted(t['byYear'])[-1:]}")
                else:
                    pg = ", ".join(f"L{p['line']}:{p['years'][0]}-{p['years'][-1]}" for p in t["pages"])
                    print(f"  stat L{t['line']} {t['title'][:46]!r}: {len(t['rows'])} rows aligned; "
                          f"pages {pg}")
                for f in t.get("STAT_CHECK_FAIL", []):
                    print(f"    !! STAT: {f}")
            if r.get("rsi"):
                for g in r["rsi"]:
                    print(f"  rsi/{g['kind']}: years {g['years']} header={g['header']!r} rows={list(g['rows'])}")
                    if g.get("INCOMPLETE"):
                        print(f"    !! INCOMPLETE: {g['INCOMPLETE']}")
    else:
        json.dump(results, sys.stdout, indent=1)
        print()
    return 0


if __name__ == "__main__":
    sys.exit(main())
