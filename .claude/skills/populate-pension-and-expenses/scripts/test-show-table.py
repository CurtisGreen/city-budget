#!/usr/bin/env python3
"""Tests for show-table.py --rows. Run: python3 test-show-table.py [DUMP.txt]

Positive tests prove the filter shows what it should; the NEGATIVE tests are the point — they
prove it cannot silently drop the year header, cannot flip the squeeze decision by hiding the one
short row, and cannot pass off an empty match as a table.
"""
import re
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).parent
SHOW = HERE / "show-table.py"

# A miniature RSI schedule: header block, three uniform-width rows, and one SHORT row whose blank
# cell is locatable only by column position — the thing that must block squeezing.
FIXTURE = """\
                    SCHEDULE OF CHANGES IN NET PENSION LIABILITY
                    FOR THE MEASUREMENT YEAR ENDED DECEMBER 31

                              2024           2023           2022
Total pension liability, ending of year   292,762,847    275,530,673    265,151,312
Plan fiduciary net position - ending      277,254,873    253,803,990    230,632,476
Plan fiduciary net position as a % of TPL      94.70%         92.11%         86.98%
Change in assumptions                              -     (1,543,563)
Source:  Annual Comprehensive Financial Reports
"""


def run(dump, *args):
    r = subprocess.run(
        [sys.executable, str(SHOW), str(dump), *args], capture_output=True, text=True
    )
    return r.stdout, r.stderr, r.returncode


def main():
    fails = []

    def check(name, cond, detail=""):
        print(f"{'ok  ' if cond else 'FAIL'} {name}{'' if cond else '  -> ' + detail}")
        if not cond:
            fails.append(name)

    with tempfile.TemporaryDirectory() as td:
        dump = Path(td) / "fixture.txt"
        dump.write_text(FIXTURE)
        anchor = "SCHEDULE OF CHANGES IN NET PENSION"

        full, full_err, rc = run(dump, "--find", anchor)
        check("unfiltered run succeeds", rc == 0, full_err)

        # --- positive: a matching filter keeps the named rows
        out, err, rc = run(dump, "--find", anchor, "--rows", "ending of year|% of TPL")
        check("filtered run succeeds", rc == 0, err)
        check("keeps a named row", "292,762,847" in out, out)
        check("keeps the other named row", "94.70%" in out, out)
        check("drops an unnamed row", "277,254,873" not in out, out)

        # --- NEGATIVE: the header block must survive a filter that matches none of it
        check("keeps the year header", re.search(r"\b2024\b.*\b2023\b.*\b2022\b", out) is not None, out)
        check("keeps the basis line", "MEASUREMENT YEAR" in out, out)
        check("announces it is filtered", "FILTERED VIEW" in err, err)
        check("reports suppressed count", "suppressed" in err, err)

        # --- NEGATIVE: a filter matching nothing still shows the header, and says 0 matched
        out0, err0, rc0 = run(dump, "--find", anchor, "--rows", "zzz-no-such-row")
        check("empty match still exits 0", rc0 == 0, err0)
        check("empty match keeps year header", "2024" in out0, out0)
        check("empty match reports 0 rows", "0 matching row(s)" in err0, err0)

        # --- NEGATIVE: filtering must not change the squeeze decision. The fixture's short
        # "Change in assumptions" row (2 figures vs 3) makes the table UNsqueezable; a filter that
        # hides that row must not make the output squeezed.
        def squeezed(err_text):
            return "column padding" in err_text

        check("fixture is unsqueezable when whole", not squeezed(full_err), full_err)
        _, err_hide, _ = run(dump, "--find", anchor, "--rows", "ending of year")
        check("filter hiding the short row does NOT flip to squeezed", not squeezed(err_hide), err_hide)

        # --- round trip: a filter matching every body row equals the unfiltered output
        out_all, _, _ = run(dump, "--find", anchor, "--rows", ".")
        check("--rows '.' reproduces unfiltered output byte-for-byte", out_all == full,
              f"{len(out_all)} vs {len(full)} chars")

    # Optional: run against a real dump if one is passed, to confirm it survives real input.
    if len(sys.argv) > 1:
        real = sys.argv[1]
        out, err, rc = run(real, "--find", "SCHEDULE OF CHANGES IN NET PENSION", "--occurrence", "2",
                           "--rows", "ending of year|net position - ending|% of TPL")
        check(f"real dump {real} filters cleanly", rc == 0 and out.count("\n") >= 4, err)
        print(err.strip())

    print(f"\n{'ALL PASS' if not fails else str(len(fails)) + ' FAILED: ' + ', '.join(fails)}")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
