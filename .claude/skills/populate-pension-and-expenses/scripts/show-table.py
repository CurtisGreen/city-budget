#!/usr/bin/env python3
"""Print one table out of a `pdftotext -layout` dump with the page furniture stripped.

The point is TOKEN VOLUME, not parsing: every figure and every label survives verbatim, so you
still read the numbers yourself. Only content-free lines are dropped (blanks, bare page numbers,
"This Page Intentionally Left Blank", the notes-to-statements footer). Footnotes and "Source:"
lines are KEPT — the statistical footnotes flag function renames, which is what drives the
lib/expense-category-groups.ts entry.

Usage:
  show-table.py DUMP.txt --find REGEX [--lines N] [--occurrence K] [--rows REGEX]
  show-table.py DUMP.txt --from REGEX --to REGEX [--occurrence K] [--rows REGEX]
  show-table.py DUMP.txt --list          # what tables look like they're in here

Examples:
  show-table.py cv-2025.txt --find 'Changes in Net Position, Last Ten' --lines 240
  show-table.py cv-2025.txt --from 'Functions/Program' --to 'TOTAL PRIMARY GOVERNMENT'
  show-table.py cv-2020.txt --find 'Schedule of Changes in Net Pension' --lines 90
  show-table.py cv-2025.txt --find 'Schedule of Changes in Net Pension' --occurrence 2 \
      --rows 'ending of year|net position - ending|% of TPL'

--rows prints a FILTERED VIEW: only rows matching the regex, plus the whole header block (title,
basis line, year header) which is never filtered out — the column-year mapping is the one thing you
can never afford to lose. It says how many rows it suppressed, so a filtered view can't be mistaken
for the whole table. Use it when you know exactly which rows you need (the 3 RSI lines that become
stored fields); use the unfiltered form when you still need to SEE the table (statistical footnotes,
function-name drift, checking that a row you expected isn't there).

Prints `orig-line: text` so you can go back to the raw dump for anything that looks off.
"""
import argparse
import re
import sys

# Lines that carry no information a reader needs. Deliberately conservative — when in doubt, keep.
BOILERPLATE = re.compile(
    r"^\s*(this page (was )?intentionally left blank"
    r"|the accompanying notes( are| is)?.*integral"
    r"|part of these financial statements\.?"
    r"|\(?\s*(unaudited|continued)\s*\)?"
    r"|city of [a-z .'-]+,? texas)\s*$",
    re.I,
)
PAGE_NO = re.compile(r"^\s*-?\s*\d{1,3}\s*-?\s*$")  # a bare page number on its own line
# A "cell" for width purposes: a figure, OR a lone dash. A dash is an EXPLICIT zero/none printed in
# the cell, so its left-to-right position survives collapsing; only a truly EMPTY cell (nothing
# printed at all) needs alignment to locate, and that is what makes a table unsqueezable.
# A dash only counts as a cell when it is column-padded on BOTH sides; a label's own hyphen
# ("Total pension liability - ending (a)") sits between single spaces and must not inflate the width.
# Decimals/percentages first, so "105.19%" counts as ONE cell rather than the bare "105" inside it
# (RSI funded-ratio and tax-rate rows are otherwise miscounted and block an otherwise safe squeeze).
FIG = re.compile(
    r"\(?\s*-?[\d,]+\.\d+\s*%?\)?|\(\s*[\d,]{3,}\s*\)|[\d,]{3,}|(?<=\s\s)-(?=\s\s|\s*$)"
)


def keep(line: str) -> bool:
    s = line.strip()
    if not s:
        return False
    if PAGE_NO.match(s):
        return False
    if BOILERPLATE.match(s):
        return False
    return True


def find_all(lines, rx):
    r = re.compile(rx, re.I)
    return [i for i, l in enumerate(lines) if r.search(l)]


def main():
    p = argparse.ArgumentParser(add_help=False)
    p.add_argument("dump")
    p.add_argument("--find")
    p.add_argument("--from", dest="start")
    p.add_argument("--to", dest="end")
    p.add_argument("--lines", type=int, default=120)
    p.add_argument("--occurrence", type=int, default=1, help="1-based, when the anchor repeats")
    p.add_argument("--rows", help="keep only rows matching this regex (header block always kept)")
    p.add_argument("--list", action="store_true")
    p.add_argument(
        "--squeeze",
        action=argparse.BooleanOptionalAction,
        default=None,
        help="collapse column padding (default: auto, only when provably safe)",
    )
    p.add_argument("-h", "--help", action="store_true")
    a = p.parse_args()
    if a.help:
        print(__doc__)
        return 0

    lines = open(a.dump, encoding="utf-8", errors="replace").read().split("\n")

    if a.list:
        rx = re.compile(
            r"last ten (fiscal|measurement) years|schedule of (changes in net pension|contributions)"
            r"|statement of (activities|revenues|net position)|combining statement|functions/program",
            re.I,
        )
        for i, l in enumerate(lines):
            if rx.search(l) and l.strip():
                print(f"{i + 1}: {l.strip()[:100]}")
        return 0

    if not (a.find or a.start):
        print("need --find or --from/--to (or --list); -h for help", file=sys.stderr)
        return 2

    anchor = a.find or a.start
    hits = find_all(lines, anchor)
    if not hits:
        print(f"ERROR: no line matches {anchor!r} in {a.dump}", file=sys.stderr)
        return 1
    if a.occurrence > len(hits):
        print(
            f"ERROR: --occurrence {a.occurrence} but {anchor!r} matches {len(hits)} time(s): "
            f"lines {[h + 1 for h in hits]}",
            file=sys.stderr,
        )
        return 1
    i = hits[a.occurrence - 1]
    if len(hits) > 1 and a.find:
        print(
            f"# note: {anchor!r} matches {len(hits)} times (lines {[h + 1 for h in hits]}); "
            f"showing #{a.occurrence}",
            file=sys.stderr,
        )

    if a.end:
        ends = [j for j in find_all(lines, a.end) if j > i]
        if not ends:
            print(f"ERROR: --to {a.end!r} never matches after line {i + 1}", file=sys.stderr)
            return 1
        j = ends[0] + 1
    else:
        j = min(i + a.lines, len(lines))

    raw = lines[i:j]
    kept = [(n, l) for n, l in enumerate(raw, start=i + 1) if keep(l)]

    # `pdftotext -layout` pads columns with runs of spaces; that padding is most of the bytes.
    # Collapsing it is safe ONLY when column alignment carries no information beyond left-to-right
    # order — i.e. when every figure-bearing row holds the same count of figures. If some row is
    # short, a cell is blank and only its position says WHICH column is empty, so we must not
    # squeeze. Detect rather than assume.
    counts = [len(FIG.findall(l)) for _, l in kept]
    datacounts = [c for c in counts if c >= 2]
    squeezable = len(set(datacounts)) == 1 and len(datacounts) >= 3
    squeeze = a.squeeze if a.squeeze is not None else squeezable
    if squeeze and not squeezable:
        print(
            "# refusing --squeeze: figure-bearing rows differ in width "
            f"({sorted(set(datacounts))} figures per row), so a blank cell's POSITION is the only "
            "thing identifying its column. Printing aligned.",
            file=sys.stderr,
        )
        squeeze = False

    # --rows filters AFTER the squeeze decision above, deliberately: squeezability is a property of
    # the whole table (do any rows differ in width?), and deciding it on a filtered subset could
    # declare a table squeezable because the only short row got filtered away.
    shown, suppressed = kept, 0
    if a.rows:
        rx = re.compile(a.rows, re.I)
        # The header block is every line before the first figure-bearing row — title, "FOR THE
        # MEASUREMENT YEAR ENDED DECEMBER 31", the year header itself. Never filterable: without it
        # you cannot map a column to a year, which is the extraction's most expensive mistake.
        first_data = next((k for k, c in enumerate(counts) if c >= 2), len(kept))
        head = kept[: first_data + 1]
        body = [(n, l) for n, l in kept[first_data + 1 :] if rx.search(l)]
        shown = head + body
        suppressed = len(kept) - len(shown)
        print(
            f"# --rows {a.rows!r}: FILTERED VIEW — {len(body)} matching row(s) plus the "
            f"{len(head)}-line header block; {suppressed} row(s) suppressed. Re-run without --rows "
            "to see the whole table.",
            file=sys.stderr,
        )

    for n, l in shown:
        out = re.sub(r"[ \t]{2,}", "  ", l.strip()) if squeeze else l.rstrip()
        print(f"{n}: {out}")

    rawc = sum(len(l) + 1 for l in raw)
    outc = sum(
        len((re.sub(r"[ \t]{2,}", "  ", l.strip()) if squeeze else l.rstrip())) + 1 for _, l in shown
    )
    pct = 100 * (rawc - outc) / rawc if rawc else 0
    how = "furniture + column padding" if squeeze else "furniture"
    if suppressed:
        how += f" + {suppressed} row(s) not matching --rows"
    print(
        f"\n# {len(shown)}/{len(raw)} lines, {outc}/{rawc} chars ({pct:.0f}% dropped as {how})"
        f" — every figure and label SHOWN is verbatim; raw dump is {a.dump}",
        file=sys.stderr,
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
