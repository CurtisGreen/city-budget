// Automated data-integrity checks for one city's ACFR data + CityInfo file.
//
// Catches the mechanical errors a human misses: missing required fields, year gaps,
// net-capital > gross (impossible Asset Life), out-of-range metrics (the signature of a
// mis-keyed capital cell), salesTaxUsage not summing to ~2.0, too many notes. It does NOT
// verify figures against the source PDF (that's the SKILL's source-check step), does NOT
// judge note wording, and does NOT check tax-revenue completeness (that's the
// populate-pension-and-expenses skill's job) — only structure.
//
// Usage: node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON \
//          .claude/skills/validate-city/scripts/check.ts <city-id>    (run from repo root)
// Exit code 0 = no ERRORs (WARNs allowed), 1 = at least one ERROR.
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import type { CityFinancialData } from "@/lib/types";

// Present on every year. The optional capitalAssetsNetofDepreciation is absent on most cities,
// where `undefined` means "not populated", not 0.
const REQUIRED = [
  "fiscalYear",
  "currentAndOtherAssets",
  "capitalAssets",
  "deferredOutflows",
  "liabilities",
  "deferredInflows",
  "totalRevenue",
  "operatingGrantsAndContributions",
  "capitalGrantsAndContributions",
  "debtInterest",
  "governmentCapitalAssetsNotBeingDepreciated",
  "governmentCapitalAssetsBeingDepreciated",
  "businessCapitalAssetsNotBeingDepreciated",
  "businessCapitalAssetsBeingDepreciated",
] as const;

const AVG_ASSET_LIFE = 0.62;

const errs: string[] = [];
const warns: string[] = [];
const err = (m: string) => errs.push(m);
const warn = (m: string) => warns.push(m);

const n = (v: number) =>
  v.toLocaleString("en-US", { maximumFractionDigits: 0 });

function checkFields(rows: CityFinancialData[]) {
  let prevFy: number | null = null;
  for (const [i, r] of rows.entries()) {
    const fy = r.fiscalYear;
    if (!Number.isInteger(fy)) {
      err(`entry ${i + 1}: non-integer fiscalYear ${JSON.stringify(fy)}`);
      continue;
    }
    if (prevFy !== null && fy !== prevFy + 1) {
      warn(`FY gap: ${prevFy} -> ${fy} (years should be contiguous)`);
    }
    prevFy = fy;
    for (const f of REQUIRED) {
      const v = r[f];
      if (typeof v !== "number" || Number.isNaN(v)) {
        err(`FY${fy}: required field '${f}' missing or not a number`);
      } else if (v < 0) {
        err(
          `FY${fy} '${f}': negative value ${n(v)} (raw ACFR aggregates are >=0)`,
        );
      }
    }
    if (
      r.capitalAssetsNetofDepreciation !== undefined &&
      r.capitalAssetsNetofDepreciation < 0
    ) {
      err(
        `FY${fy} 'capitalAssetsNetofDepreciation': negative value ` +
          `${n(r.capitalAssetsNetofDepreciation)} (raw ACFR aggregates are >=0)`,
      );
    }
  }
}

function checkMetrics(rows: CityFinancialData[]) {
  for (const r of rows) {
    const fy = r.fiscalYear;
    const gross =
      r.governmentCapitalAssetsNotBeingDepreciated +
      r.governmentCapitalAssetsBeingDepreciated +
      r.businessCapitalAssetsNotBeingDepreciated +
      r.businessCapitalAssetsBeingDepreciated;
    // netCapitalAssets = capitalAssetsNetofDepreciation || capitalAssets (format-chart-data.ts)
    const net = r.capitalAssetsNetofDepreciation || r.capitalAssets;
    const bsCap = r.capitalAssets; // balance-sheet net capital (feeds totalAssets)
    if (gross <= 0) {
      err(`FY${fy}: gross capital (4 fields) is 0 -> Asset Life undefined`);
      continue;
    }
    if (net > gross + 1) {
      err(
        `FY${fy}: net capital ${n(net)} > gross ${n(gross)} ` +
          `(impossible; a capital field is likely mis-keyed)`,
      );
    }
    // 'capitalAssets' is net book value -> must also be <= gross (it feeds totalAssets)
    if (bsCap > gross + 1) {
      err(
        `FY${fy}: 'capitalAssets' ${n(bsCap)} > gross ${n(gross)} — net book value cannot ` +
          `exceed gross cost (often the MD&A condensed table mislabels total NONCURRENT ` +
          `assets, i.e. capital + restricted cash, as 'Capital assets, net')`,
      );
    }
    // Both net fields exist, and they come from different places on purpose: 'capitalAssets'
    // is the MD&A condensed table's PRINTED capital row (kept printed so a reader can audit it
    // against the PDF, and paired with the printed 'Current and other assets' row so the two
    // still sum to Total assets), while capitalAssetsNetofDepreciation is the capital NOTE's
    // ending balance — the Asset Life numerator, on the same basis as the 4 gross fields.
    // Either can be the larger one:
    //   bsCap > net-of-dep — the usual case, gap = GASB 87/96 right-to-use lease/SBITA assets
    //     (in balance-sheet capital, excluded from the 4 gross fields).
    //   net-of-dep > bsCap — the MD&A row itself drops something the note counts as capital
    //     (Trophy Club FY2025: business-type CIP 29,500 shown under current and other assets).
    // Neither is an error by itself, so both directions WARN and name the expected explanation.
    // The real bugs are a mis-sourced field or a non-capital line folded into the MD&A row
    // (the Celina restricted-cash mislabel), which show up as a LARGE gap either way.
    if (r.capitalAssetsNetofDepreciation) {
      const netOpt = r.capitalAssetsNetofDepreciation;
      if (netOpt - bsCap > 1) {
        const msg =
          `FY${fy}: capitalAssetsNetofDepreciation ${n(netOpt)} exceeds 'capitalAssets' ` +
          `${n(bsCap)} by ${n(netOpt - bsCap)} — OK if the MD&A condensed table's capital row ` +
          `drops a capital line the note includes (e.g. business-type CIP parked under ` +
          `'Current and other assets'); verify vs the audited Statement of Net Position`;
        // Those omissions are small. A big gap means a mis-sourced field, not a printing quirk.
        if (netOpt - bsCap > bsCap * 0.02) {
          err(
            `${msg} — gap is >2% of capital, too large for that; treating as mis-sourced`,
          );
        } else {
          warn(msg);
        }
      } else if (bsCap - netOpt > 1) {
        warn(
          `FY${fy}: 'capitalAssets' ${n(bsCap)} exceeds capitalAssetsNetofDepreciation ` +
            `${n(netOpt)} by ${n(bsCap - netOpt)} — OK if that equals right-to-use lease/SBITA ` +
            `assets (GASB 87/96: in balance-sheet capital, excluded from the 4 gross fields); ` +
            `verify vs the audited Statement of Net Position — a gap that is really restricted ` +
            `cash mislabeled as capital IS an error`,
        );
      }
    }
    const al = net / gross;
    if (!(al >= 0.4 && al <= 0.8)) {
      warn(
        `FY${fy}: Asset Life ${al.toFixed(3)} outside chart range [0.40,0.80] ` +
          `(often a mis-keyed 'being depreciated' field — verify Note 5)`,
      );
    }
    if (r.liabilities + r.deferredInflows <= 0) {
      err(`FY${fy}: total liabilities+deferred inflows <= 0`);
    }
    if (r.totalRevenue <= 0) {
      err(`FY${fy}: totalRevenue <= 0`);
    }
  }
  // smoothness: a lone spike/dip in a 'being depreciated' field = Buildings-omission bug signature
  for (const f of [
    "governmentCapitalAssetsBeingDepreciated",
    "businessCapitalAssetsBeingDepreciated",
  ] as const) {
    for (let i = 1; i < rows.length - 1; i++) {
      const [a, b, c] = [rows[i - 1][f], rows[i][f], rows[i + 1][f]];
      if (b > 0 && a > 0 && c > 0 && b < 0.6 * Math.min(a, c)) {
        warn(
          `FY${rows[i].fiscalYear} '${f}': ${n(b)} dips well below neighbors ` +
            `(${n(a)}/${n(c)}) — check for a dropped depreciable sub-row`,
        );
      }
    }
  }
}

function sliceSection(text: string, key: string) {
  const m = new RegExp(
    key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*:",
  ).exec(text);
  if (!m) return "";
  let i = m.index + m[0].length;
  while (i < text.length && text[i] !== "[" && text[i] !== "{") i++;
  if (i >= text.length) return "";
  const openC = text[i];
  const closeC = openC === "[" ? "]" : "}";
  let depth = 0;
  for (let j = i; j < text.length; j++) {
    if (text[j] === openC) depth++;
    else if (text[j] === closeC) {
      depth--;
      if (depth === 0) return text.slice(i, j + 1);
    }
  }
  return text.slice(i);
}

function checkInfo(path: string): number[] {
  if (!existsSync(path)) {
    err(`${path}: missing CityInfo file`);
    return [];
  }
  const text = readFileSync(path, "utf8");

  // salesTaxUsage percents ~ 2.0
  const stu = sliceSection(text, "salesTaxUsage");
  if (stu) {
    const pcts = [...stu.matchAll(/percent:\s*([\d.]+)/g)].map((x) =>
      Number(x[1]),
    );
    const sum = pcts.reduce((a, b) => a + b, 0);
    if (pcts.length && Math.abs(sum - 2.0) > 0.001) {
      warn(
        `salesTaxUsage percents sum to ${sum} (TX local cap is 2.0 — verify split)`,
      );
    }
  }

  // propertyValues: each entry has both rates; FY range through latest+1
  const pv = sliceSection(text, "propertyValues");
  const fys = [...pv.matchAll(/fiscalYear:\s*(\d+)/g)].map((x) => Number(x[1]));
  const mos = [...pv.matchAll(/moRate:\s*([\d.]+)/g)].map((x) => Number(x[1]));
  const iss = [...pv.matchAll(/isRate:\s*([\d.]+)/g)].map((x) => Number(x[1]));
  if (fys.length !== mos.length || fys.length !== iss.length) {
    err(
      `propertyValues: ${fys.length} fiscalYears but ${mos.length} moRate / ${iss.length} ` +
        `isRate (every year needs both rates)`,
    );
  }
  fys.forEach((fy, i) => {
    if (mos[i] >= 1 || iss[i] >= 1) {
      err(
        `propertyValues FY${fy}: rate >= 1.0 (rates are decimals per $100, e.g. 0.50899)`,
      );
    }
  });
  if (String(fys) !== String([...fys].sort((a, b) => a - b))) {
    err("propertyValues fiscalYears not ascending");
  }

  // notes cap
  const notes = sliceSection(text, "notes");
  const count = notes ? Math.floor((notes.match(/`/g) ?? []).length / 2) : 0;
  if (count > 3) {
    warn(
      `notes[] has ${count} entries (skill hard-caps at 3 — keep highest-signal only)`,
    );
  }

  return fys;
}

async function main() {
  const cid = process.argv[2];
  if (!cid) {
    console.log("usage: check.ts <city-id>");
    process.exit(2);
  }
  const acfrPath = `data/acfr-json/${cid}.ts`;
  if (!existsSync(acfrPath)) {
    console.log(`ERROR: ${acfrPath} not found — city not added yet`);
    process.exit(2);
  }
  const mod = await import(pathToFileURL(resolve(acfrPath)).href);
  const rows = (Object.values(mod)[0] as CityFinancialData[])
    .slice()
    .sort((a, b) => a.fiscalYear - b.fiscalYear);

  checkFields(rows);
  if (rows.length) checkMetrics(rows);
  const infoFys = checkInfo(`data/info/${cid}.ts`);

  // rate coverage should extend one year past the last ACFR year (FY{N+1} budget rate)
  if (rows.length && infoFys.length) {
    const lastAcfr = rows[rows.length - 1].fiscalYear;
    if (!infoFys.includes(lastAcfr + 1)) {
      warn(
        `propertyValues has no FY${lastAcfr + 1} entry (convention adds next-year budget rate ` +
          `beyond the last ACFR FY${lastAcfr})`,
      );
    }
  }

  console.log(`=== validate-city: ${cid} ===`);
  console.log(
    rows.length
      ? `ACFR years: FY${rows[0].fiscalYear}-FY${rows[rows.length - 1].fiscalYear} (${rows.length} entries)`
      : "ACFR: no entries",
  );
  if (errs.length) {
    console.log(`\n${errs.length} ERROR(S):`);
    for (const e of errs) console.log("  ✗ " + e);
  }
  if (warns.length) {
    console.log(`\n${warns.length} WARNING(S):`);
    for (const w of warns) console.log("  ! " + w);
  }
  if (!errs.length && !warns.length) {
    console.log("\nAll automated checks passed.");
  }
  process.exit(errs.length ? 1 : 0);
}

main();
