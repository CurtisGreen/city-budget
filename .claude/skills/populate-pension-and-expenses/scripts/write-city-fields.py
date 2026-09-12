#!/usr/bin/env python3
"""Write a verified staging JSON into data/acfr-json/{id}.ts in the canonical field order.

Replaces hand-rolling a throwaway generator each run. Enforces the skill's two standing rules
mechanically rather than by remembering them:

  NEVER OVERWRITE  a field already present for a year is left exactly as-is and reported as kept.
  NEVER GUESS      a field staged as null is a DELIBERATE omission (the city didn't levy it);
                   the key is not written, and it is reported separately from a plain gap.

Field order follows data/acfr-json/dallas.ts, the canonical fully-populated file:
  fiscalYear, pensionPlans, propertyTax, salesTax, hotelTax, <base fields>,
  fullAccrualExpenses, modifiedAccrualExpenditures, <capital fields>

Refuses to write unless verify-extraction.py passes on the same JSON (override only with --force,
which exists for debugging and should not be used to push through a real failure).

Usage:
  write-city-fields.py staged.json [--dry-run] [--force]

Then: npx prettier --write data/acfr-json/{id}.ts
"""
import json
import re
import sys
from pathlib import Path


def _load_verify():
    """verify-extraction.py isn't a legal module name, so load it by path."""
    import importlib.util

    p = Path(__file__).parent / "verify-extraction.py"
    spec = importlib.util.spec_from_file_location("verify_extraction", p)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod.check


verify = _load_verify()

ORDER_AFTER_FY = ["pensionPlans", "propertyTaxRevenue", "salesTaxRevenue", "hotelTaxRevenue"]
ORDER_AFTER_DEBT = ["fullAccrualExpenses", "modifiedAccrualExpenditures"]


def num(n):
    """1234567 -> 1_234_567 (the repo's numeric-separator style); negatives and 0 pass through."""
    neg = n < 0
    s = f"{abs(n):,}".replace(",", "_")
    return ("-" if neg else "") + s


def js(v, ind):
    """Render a staged value as the repo writes it. Ints get numeric separators."""
    pad = "  " * ind
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, int):
        return num(v)
    if isinstance(v, float):
        return repr(v)
    if isinstance(v, str):
        return json.dumps(v)
    if isinstance(v, list):
        if not v:
            return "[]"
        items = ",\n".join(f"{pad}  {js(x, ind + 1)}" for x in v)
        return "[\n" + items + f",\n{pad}]"
    if isinstance(v, dict):
        # "_" keys are PROOF INPUTS for verify-extraction.py — never write them to the .ts.
        pairs = [(k, x) for k, x in v.items() if x is not None and not k.startswith("_")]
        # All-scalar objects go on one line so Prettier can keep them inline ({ name, value });
        # forcing a newline here makes Prettier preserve the expansion and the diff churns.
        if all(not isinstance(x, (list, dict)) for _, x in pairs):
            return "{ " + ", ".join(f"{k}: {js(x, ind)}" for k, x in pairs) + " }"
        items = ",\n".join(f"{pad}  {k}: {js(x, ind + 1)}" for k, x in pairs)
        return "{\n" + items + f",\n{pad}}}"
    raise TypeError(f"cannot render {type(v)}")


def main():
    argv = [a for a in sys.argv[1:] if not a.startswith("-")]
    dry = "--dry-run" in sys.argv
    force = "--force" in sys.argv
    if not argv:
        print(__doc__)
        return 2
    staged = json.load(open(argv[0], encoding="utf-8"))
    city = staged["id"]
    path = Path(f"data/acfr-json/{city}.ts")
    if not path.exists():
        print(f"ERROR: {path} not found — is the city added? (see add-city)", file=sys.stderr)
        return 2

    fails, _, _ = verify(staged)
    if fails:
        print(f"REFUSING TO WRITE — verify-extraction.py reports {len(fails)} failure(s):")
        for f in fails:
            print(f"  FAIL  {f}")
        if not force:
            print("\nFix the extraction, not the check. (--force overrides, for debugging only.)")
            return 1
        print("\n--force given; writing anyway.")

    src = path.read_text(encoding="utf-8")
    # Top-level year blocks only — see the note in verify-extraction.load_existing().
    blocks = re.split(r"^  \{$", src, flags=re.M)
    wrote, kept, omitted = [], [], []

    for bi, blk in enumerate(blocks):
        m = re.search(r"fiscalYear: (\d+),", blk)
        if not m:
            continue
        fy = m.group(1)
        y = staged["years"].get(fy)
        if not y:
            continue

        def emit(fields, anchor_rx):
            nonlocal blk
            chunk = ""
            for f in fields:
                if f not in y:
                    continue
                if y[f] is None:
                    omitted.append(f"FY{fy}.{f}")
                    continue
                if re.search(rf"^\s*{f}:", blk, re.M):
                    kept.append(f"FY{fy}.{f}")
                    continue
                chunk += f"    {f}: {js(y[f], 2)},\n"
                wrote.append(f"FY{fy}.{f}")
            if not chunk:
                return
            am = re.search(anchor_rx, blk, re.M)
            if not am:
                print(f"ERROR: FY{fy}: no anchor {anchor_rx!r} in block", file=sys.stderr)
                sys.exit(2)
            blk = blk[: am.end()] + chunk + blk[am.end() :]

        emit(ORDER_AFTER_FY, rf"^    fiscalYear: {fy},\n")
        emit(ORDER_AFTER_DEBT, r"^    debtInterest: [\d_-]+,\n")
        blocks[bi] = blk

    out = "  {".join(blocks)
    print(f"write  {len(wrote)} field-years: {', '.join(wrote) if len(wrote) < 12 else str(len(wrote)) + ' fields'}")
    if kept:
        print(f"kept   {len(kept)} already-present field-years (never overwritten): {', '.join(kept[:8])}{' …' if len(kept) > 8 else ''}")
    if omitted:
        print(f"omit   {len(omitted)} deliberate omission(s) (staged null): {', '.join(omitted)}")
    if dry:
        print("\n--dry-run: nothing written")
        return 0
    path.write_text(out, encoding="utf-8")
    print(f"\nwrote {path} — now run: npx prettier --write {path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
