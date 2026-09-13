#!/usr/bin/env python3
"""Tests for extract-statements.py.

Each check has a POSITIVE case (clean input parses exactly) and a NEGATIVE case (damaged input
makes the check fire). A checker that never fails is worth nothing, so every failure mode below is
one that actually occurred in a real ACFR: the $1 that does not foot, the statement split across two
pages, the OCR'd '.' thousands separator, the budgetary schedule that impersonates the real
statement, and a total line so damaged it parses to a plausible-looking wrong number.
"""
import importlib.util
import pathlib
import sys

spec = importlib.util.spec_from_file_location(
    "es", pathlib.Path(__file__).with_name("extract-statements.py"))
es = importlib.util.module_from_spec(spec)
spec.loader.exec_module(es)

FAILS = []


def check(name, cond, detail=""):
    print(f"  {'ok  ' if cond else 'FAIL'}  {name}" + (f"  -- {detail}" if not cond and detail else ""))
    if not cond:
        FAILS.append(name)


SOA = """\
Functions/Programs                       Expenses      Services
Primary Government:
Governmental Activities:
   General Government                 $  1,626,601       380,481
   Public Safety                         5,286,702       844,045
   Interest and Fiscal Charges             197,217             -
          Total Governmental Activities  7,110,520     1,224,526
"""

FUNDS = """\
REVENUES                                  General      Motel        Total
Taxes:
   Property                            $ 3,079,778          -    $ 3,079,778
   Sales                                 1,413,339          -      1,413,339
   Hotel-Motel                                   -    460,959        460,959
EXPENDITURES
Current:
  General Government                     1,434,478          -      1,434,478
  Public Safety                          4,635,804          -      4,635,804
Capital Outlay                             387,886          -        387,886
Debt Service:
  Principal                                923,532          -        923,532
  Interest and Fiscal Charges              210,700          -        210,700
          Total Expenditures             7,592,400          -      7,592,400
"""

print("statement of activities")
soa = es.parse_soa(SOA.split("\n"))
check("clean SoA finds every function row",
      [r["name"] for r in soa["rows"]] == ["General Government", "Public Safety", "Interest and Fiscal Charges"],
      str(soa.get("rows")))
check("clean SoA reads the printed total", soa["printedTotalGovActivities"] == 7110520)
check("clean SoA raises no failure", "CHECK_FAIL" not in soa and "TOTAL_UNREADABLE" not in soa)
# NEGATIVE: one digit changed, so the rows no longer foot to the report's own total.
bad = es.parse_soa(SOA.replace("5,286,702       844,045", "5,286,703       844,045").split("\n"))
check("NEGATIVE a row that does not foot raises CHECK_FAIL", "CHECK_FAIL" in bad, str(bad.get("CHECK_FAIL")))
# NEGATIVE: OCR eats the total line's separators so it parses to a small plausible number.
bad = es.parse_soa(SOA.replace("7,110,520     1,224,526", "7 110 520     (1.224.526)").split("\n"))
check("NEGATIVE a damaged total line is refused, not returned",
      bad.get("printedTotalGovActivities") is None and "TOTAL_UNREADABLE" in bad)

print("governmental funds")
f = es.parse_funds(FUNDS.split("\n"))
check("clean funds takes the Total Governmental Funds column", f["printedTotal"] == 7592400)
check("clean funds splits current/capital/debt",
      [c["value"] for c in f["current"]] == [1434478, 4635804]
      and f["capitalOutlay"] == 387886
      and f["debtService"] == {"principal": 923532, "interest": 210700}, str(f.get("debtService")))
check("clean funds reads the tax rows",
      f["taxes"] == {"property": 3079778, "sales": 1413339, "hotel": 460959}, str(f.get("taxes")))
check("clean funds raises no failure",
      not any(k in f for k in ("CHECK_FAIL", "COLUMN_SUSPECT", "UNPARSED_ROWS")))
# NEGATIVE: the statement is split across pages, so the rightmost column is one individual fund.
# It reconciles perfectly -- only the "is the last column the largest?" test can see it.
SPLIT_PAGE1 = """\
REVENUES                                  General      Debt Service
EXPENDITURES
Current:
  General Government                     1,433,651             827
  Public Safety                          4,574,522               -
Capital Outlay                              59,923               -
Debt Service:
  Principal                                144,582         778,950
  Interest and Fiscal Charges               14,143         196,557
          Total Expenditures             6,226,821         976,334
"""
sp = es.parse_funds(SPLIT_PAGE1.split("\n"))
check("NEGATIVE a page-split statement raises COLUMN_SUSPECT", "COLUMN_SUSPECT" in sp, str(list(sp)))
# NEGATIVE: OCR wrote the thousands separator as '.', so the row carries no parsable figure at all.
ocr = FUNDS.replace("  Interest and Fiscal Charges              210,700          -        210,700",
                    "  Interest and Fiscal Charges              13.074       64.795       71.869")
oc = es.parse_funds(ocr.split("\n"))
check("NEGATIVE an OCR '.' separator row is named, not silently dropped",
      any("Interest" in u["text"] for u in oc.get("UNPARSED_ROWS", [])), str(oc.get("UNPARSED_ROWS")))
check("NEGATIVE and the same row also breaks reconciliation", "CHECK_FAIL" in oc)
# NEGATIVE: a budgetary comparison schedule appears FIRST and also has a "Total Expenditures".
budget = """\
EXPENDITURES
Current:
  General Government      1,500,000    1,500,000    1,434,478      65,522
          Total Expenditures  7,700,000  7,700,000  7,592,400     107,600
""" + FUNDS
bg = es.parse_funds(budget.split("\n"))
check("NEGATIVE the real statement wins over a budgetary schedule",
      bg["printedTotal"] == 7592400 and len(bg["current"]) == 2,
      f"total={bg['printedTotal']} rows={len(bg['current'])}")

print("pension RSI")
RSI = """\
                          Schedule of Changes in Net Pension Liability and Related Ratios
                                          Plan Year Ended December 31,
                                    2024            2023
Total Pension Liability - Ending (a)   $ 33,399,767   $ 32,059,678
Plan Fiduciary Net Position - Ending (b)  $ 31,212,901  $ 28,508,486
Plan Fiduciary Net Position as Percentage
     of Total Pension Liability              93.45%         88.92%
"""
g = es.parse_rsi(RSI.split("\n"))[0]
check("RSI reports the basis header verbatim", g["header"] == "Plan Year Ended December 31,", str(g["header"]))
check("RSI reads TPL and FNP", g["rows"]["totalPensionLiability"]["values"][:2] == [33399767, 32059678])
check("RSI reads a funded-ratio row whose LABEL WRAPS onto two lines",
      g["rows"].get("printedFundedRatio", {}).get("values", [])[:2] == [93.45, 88.92],
      str(g["rows"].get("printedFundedRatio")))

print("dump health")
check("real text is ok", es.health(("the city of forest hill total fund revenue expenditures "
                                    "statement of net position general government tax " * 80))[0] == "ok")
check("NEGATIVE an image-only scan is caught", es.health("  \n 78 chars only \n")[0] == "scan")
check("NEGATIVE mojibake is caught even though it is full of text",
      es.health("&LW\\RI)RUHVW+LOO7H[DV $QQXDO)LQDQFLDO5HSRUW " * 200)[0] == "mojibake")

print("table of contents suppression")
check("a contents line is not an anchor", es.is_toc("   Statement of Activities .......... 10"))
check("a contents line without leaders is still caught", es.is_toc("   Schedule of Contributions      44"))
check("a real statement line is not mistaken for contents",
      not es.is_toc("   General Government                 $  1,626,601       380,481"))

print("statistical section")
STAT_COLS = """\
                                   CHANGES IN NET POSITION
                                    LAST TEN FISCAL YEARS
                                (ACCRUAL BASIS OF ACCOUNTING)
                                            Fiscal Year
                                       2016            2017
 Property taxes                   $ 8,209,164    $ 8,762,216
 Sales taxes                        4,709,696      4,988,763
  Total governmental activities    12,918,860     13,750,979
                                        TABLE 2
                                            Fiscal Year
      2018            2019
$ 9,707,103    $ 10,470,757
   5,749,249        6,351,122
  15,456,352       16,821,879
"""
t = es.parse_stat(STAT_COLS.split("\n"))[0]
check("stat table is found and oriented", t["orientation"] == "years-as-columns", t["orientation"])
check("stat reports each PAGE's year header separately",
      [p["years"] for p in t["pages"]] == [[2016, 2017], [2018, 2019]], str(t["pages"]))
prop = next((r for r in t["rows"] if "Property" in r["name"]), None)
check("stat merges a continuation page onto page 1's row labels",
      prop and prop["byYear"] == {2016: 8209164, 2017: 8762216, 2018: 9707103, 2019: 10470757},
      str(prop))
check("clean stat table raises no failure", "STAT_CHECK_FAIL" not in t, str(t.get("STAT_CHECK_FAIL")))

# NEGATIVE: the Duncanville trap -- the second page of ONE table is headed with the WRONG years,
# overlapping page 1. Each page sums to its own totals, so only comparing the pages sees it.
dunc = es.parse_stat(STAT_COLS.replace("      2018            2019", "      2017            2018").split("\n"))[0]
check("NEGATIVE overlapping year headers across one table's pages are caught",
      any("appears in the header on BOTH" in f for f in dunc.get("STAT_CHECK_FAIL", [])),
      str(dunc.get("STAT_CHECK_FAIL")))
# NEGATIVE: a gap in the year run is the same error wearing a different hat
gap = es.parse_stat(STAT_COLS.replace("      2018            2019", "      2020            2021").split("\n"))[0]
check("NEGATIVE a non-contiguous year run is caught",
      any("not a contiguous run" in f for f in gap.get("STAT_CHECK_FAIL", [])),
      str(gap.get("STAT_CHECK_FAIL")))
# NEGATIVE: pdftotext drops/splits a row, so the pages cannot be aligned -- refuse, and hand back
# BOTH pages rather than a guessed alignment or nothing at all.
short = es.parse_stat(STAT_COLS.replace("   5,749,249        6,351,122\n", "").split("\n"))[0]
check("NEGATIVE a page that cannot be aligned is refused",
      any("NOT aligned" in f for f in short.get("STAT_CHECK_FAIL", [])), str(short.get("STAT_CHECK_FAIL")))
check("NEGATIVE and both pages' rows come back for manual alignment",
      len(short.get("unalignedPages", [])) == 2, str(len(short.get("unalignedPages", []))))

STAT_ROWS = """\
                      GOVERNMENTAL ACTIVITIES TAX REVENUES BY SOURCE
                                 LAST TEN FISCAL YEARS
                             (ACCRUAL BASIS OF ACCOUNTING)
Fiscal     Property           Sales         Hotel
Year         Tax               Tax           Tax          Total
2016     $ 8,209,164     $ 4,709,696   $   126,752   $ 13,045,612
2017       8,762,216       4,988,763       138,834     13,889,813
2018       9,707,103       5,749,249       140,150     15,596,502
2019      10,470,757       6,351,122       128,979     16,950,858
"""
tr = es.parse_stat(STAT_ROWS.split("\n"))[0]
check("a years-as-ROWS table is detected", tr["orientation"] == "years-as-rows", tr["orientation"])
check("years-as-rows keeps each year's columns in printed order",
      tr["byYear"][2016][:3] == [8209164, 4709696, 126752], str(tr["byYear"].get(2016)))
check("years-as-rows covers every printed year", sorted(tr["byYear"]) == [2016, 2017, 2018, 2019])

print("general revenues")
FACING = """\
Functions/Programs                       Expenses      Services
   General Government                 $  1,626,601       380,481
   Public Safety                         5,286,702       844,045
          Total Governmental Activities  6,913,303     1,224,526
                                    General Revenues:
                                      Property Taxes
                                      Sales Taxes
                                      Franchise Taxes
                                      Investment Earnings
                                    Transfers
                                      Total General Revenues and Transfers
                                      Change in Net Position
        Governmental    Business-Type
         Activities       Activities        Total
$ (1,246,120)   $          -       $ (1,246,120)
  (4,442,657)              -         (4,442,657)
  (5,688,777)              -         (5,688,777)
   3,562,485               -          3,562,485
   2,934,300               -          2,934,300
     738,975               -            738,975
      22,839           1,186             24,025
     372,270        (372,270)               -
   7,630,869        (371,084)         7,259,785
   1,942,092               -          1,942,092
"""
gr = es.parse_soa(FACING.split("\n"))["generalRevenues"]
check("labels on one page and figures on the facing page are matched",
      (gr.get("property"), gr.get("sales"), gr.get("franchise")) == (3562485, 2934300, 738975), str(gr))
check("the match is PROVEN by the printed total, not by position", "_proof" in gr)
# NEGATIVE: the facing block BEGINS with one net-(expense) row per function, and that block also
# sums to its own total -- the exact coincidence that mapped property tax to a negative net expense.
check("NEGATIVE the net-(expense) block above is not mistaken for the revenues",
      gr.get("property", 0) > 0, str(gr))
# NEGATIVE: a tax name elsewhere on the page (a fund balance) must not be harvested
FUNDBAL = FACING + """
 Fund Balances:
   Hotel-Motel Tax                             6,512,339
"""
gr2 = es.parse_soa(FUNDBAL.split("\n"))["generalRevenues"]
check("NEGATIVE a 'Hotel-Motel Tax' FUND BALANCE below the statement is not read as hotel tax",
      "hotel" not in gr2, str(gr2))
# NEGATIVE: no run sums to the row after it -> refuse rather than guess an offset
broken = FACING.replace("   2,934,300               -          2,934,300",
                        "   2,934,999               -          2,934,999")
check("NEGATIVE an unprovable block is refused",
      "UNRESOLVED" in es.parse_soa(broken.split("\n"))["generalRevenues"])

SAMELINE = """\
Functions/Programs                       Expenses      Services
   General Government                 $  1,626,601       380,481
          Total Governmental Activities  1,626,601       380,481
                     General revenues:
                       Property taxes                    3,562,485
                       Sales taxes                       2,934,300
                       Total general revenues            6,496,785
"""
gr3 = es.parse_soa(SAMELINE.split("\n"))["generalRevenues"]
check("the simple same-line layout still works",
      (gr3.get("property"), gr3.get("sales")) == (3562485, 2934300), str(gr3))

print("verify-extraction: audited-SoA tax check")
import importlib.util as _il
_vs = _il.spec_from_file_location("ve", pathlib.Path(__file__).with_name("verify-extraction.py"))
ve = _il.module_from_spec(_vs)
_vs.loader.exec_module(ve)

STAGED = {"id": "x", "years": {"2015": {"propertyTaxRevenue": 7627533, "salesTaxRevenue": 4212896}}}
SOA = {2015: {"property": 7627533, "sales": 4212896}}
f, n, pr = ve.soa_tax_match(STAGED["years"], SOA, None)
check("a year matching the audited SoA is proven and silent", not f and not n and pr == {2015}, str((f, n, pr)))

# NEGATIVE: this is the Forney FY2015 case -- a statistical table disagreeing with the audited
# statement. Same basis and same year, so there is no basis difference to hide behind.
bad = {"2015": {"propertyTaxRevenue": 7698456, "salesTaxRevenue": 4144445}}
f, n, pr = ve.soa_tax_match(bad, SOA, None)
check("NEGATIVE a figure differing from the audited SoA FAILS", len(f) == 2 and not pr, str(f)[:90])

# A city may deliberately store another source (Addison stores a modified-accrual schedule).
f, n, pr = ve.soa_tax_match(bad, SOA, "Addison stores the statistical schedule's 1% Town Sales Tax")
check("a DECLARED convention downgrades the mismatch to a note", not f and len(n) == 2, str((f, n)))
f, n, pr = ve.soa_tax_match(bad, SOA, "   ")
check("NEGATIVE an empty _taxConvention is refused", any("empty" in x for x in f), str(f))

# a year the SoA could not resolve is simply skipped, never guessed at
f, n, pr = ve.soa_tax_match(STAGED["years"], {}, None)
check("an unresolved SoA year is skipped, not failed", not f and not n and not pr, str((f, n, pr)))

print(f"\n{len(FAILS)} failure(s)" if FAILS else "\nall checks passed")
sys.exit(1 if FAILS else 0)
