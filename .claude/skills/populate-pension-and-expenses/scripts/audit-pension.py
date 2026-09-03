#!/usr/bin/env python3
"""Audit stored pensionPlans data for one city. Exit 1 on any ERROR."""
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[4]


def parse(city):
    """-> {fiscalYear: [ {name, tpl, fnp, adc|None, act}, ... ]}"""
    path = REPO / "data" / "acfr-json" / f"{city}.ts"
    if not path.exists():
        print(f"✗ {path} not found — city not added (see add-city)")
        sys.exit(1)
    src = path.read_text()
    years = {}
    for block in re.split(r"\n  \{", src):
        m = re.search(r"fiscalYear:\s*([\d_]+)", block)
        if not m:
            continue
        fy = int(m.group(1).replace("_", ""))
        pm = re.search(r"pensionPlans:\s*\[(.*?)\n    \],", block, re.S)
        if not pm:
            years[fy] = []
            continue
        plans = []
        for entry in re.findall(r"\{(.*?)\}", pm.group(1), re.S):
            def num(field):
                g = re.search(field + r":\s*(-?[\d_]+)", entry)
                return int(g.group(1).replace("_", "")) if g else None
            name = re.search(r'name:\s*"([^"]*)"', entry)
            plans.append({
                "name": name.group(1) if name else "?",
                "tpl": num("totalPensionLiability"),
                "fnp": num("fiduciaryNetPosition"),
                "adc": num("actuariallyDeterminedContribution"),
                "act": num("actualContribution"),
            })
        years[fy] = plans
    return years


def main():
    if len(sys.argv) < 2:
        print("usage: audit.py {city-id}")
        sys.exit(2)
    city = sys.argv[1]
    years = parse(city)
    errors, warnings = [], []

    populated = {y: p for y, p in years.items() if p}
    print(f"=== pension audit: {city} ===")
    if not populated:
        print("No pensionPlans stored for any fiscal year.")
        print("Nothing to audit — run the skill to populate.")
        return 0

    all_plans = sorted({p["name"] for ps in populated.values() for p in ps})
    print(f"Years with data: FY{min(populated)}-FY{max(populated)} "
          f"({len(populated)} of {len(years)} fiscal years)")
    print(f"Plans: {', '.join(all_plans)}\n")

    hdr = f"{'FY':<7}{'plan':<34}{'funded':>9}{'ADC cov':>10}"
    print(hdr)
    print("-" * len(hdr))
    for fy in sorted(populated):
        for p in populated[fy]:
            for field in ("tpl", "fnp", "act"):
                if p[field] is None:
                    errors.append(f"FY{fy} {p['name']}: missing {field}")
            if p["tpl"] is None or p["fnp"] is None:
                continue
            if p["tpl"] <= 0:
                errors.append(f"FY{fy} {p['name']}: totalPensionLiability <= 0")
                continue
            funded = p["fnp"] / p["tpl"]
            cov = (p["act"] / p["adc"]) if p["adc"] else None
            if not 0.15 <= funded <= 1.5:
                warnings.append(
                    f"FY{fy} {p['name']}: funded ratio {funded:.0%} outside 15-150% — check units/parse")
            if cov is not None and not 0.3 <= cov <= 2.0:
                warnings.append(
                    f"FY{fy} {p['name']}: ADC coverage {cov:.0%} outside 30-200% — check parse")
            if p["adc"] is None:
                warnings.append(
                    f"FY{fy} {p['name']}: no ADC (fine if the schedule reports none — coverage renders a gap)")
            print(f"FY{fy:<5}{p['name']:<34}{funded:>8.1%}"
                  + (f"{cov:>10.1%}" if cov is not None else f"{'—':>10}"))

    # plan set should be stable year to year
    for fy in sorted(populated):
        names = {p["name"] for p in populated[fy]}
        missing = set(all_plans) - names
        if missing:
            warnings.append(f"FY{fy}: missing plan(s) {', '.join(sorted(missing))}")

    # contiguous years
    ys = sorted(populated)
    gaps = [y for y in range(ys[0], ys[-1] + 1) if y not in populated]
    if gaps:
        warnings.append(f"gap years with no pension data: {', '.join(map(str, gaps))}")

    print()
    for w in warnings:
        print(f"  ! {w}")
    for e in errors:
        print(f"  ✗ {e}")
    if not warnings and not errors:
        print("All checks passed.")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
