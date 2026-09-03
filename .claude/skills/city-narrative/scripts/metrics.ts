// Compute the 8 charted ACFR metrics per fiscal year from data/acfr-json/{id}.ts.
//
// Mirrors lib/format-chart-data.ts calculateACFRMetrics EXACTLY (averageAssetLife=0.62).
// Prints a compact per-year table, year-over-year deltas, and the single largest YoY
// move per metric (the chart inflections a narrative should anchor to). Deterministic —
// keeps arithmetic out of the model's token budget and guarantees the numbers match the site.
//
// Usage: node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON \
//          .claude/skills/city-narrative/scripts/metrics.ts <city-id>    (run from repo root)
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import type { CityFinancialData } from "@/lib/types";

const AVG_ASSET_LIFE = 0.62; // lib/format-chart-data.ts: average of 40 DFW cities over 11 years

type Metrics = Record<string, number>;

function metrics(r: CityFinancialData): Metrics {
  const totalAssets = r.currentAndOtherAssets + r.capitalAssets;
  const totalLiab = r.liabilities + r.deferredInflows;
  const grossCap =
    r.governmentCapitalAssetsNotBeingDepreciated +
    r.governmentCapitalAssetsBeingDepreciated +
    r.businessCapitalAssetsNotBeingDepreciated +
    r.businessCapitalAssetsBeingDepreciated;
  const nfp = r.currentAndOtherAssets - totalLiab;
  const m: Metrics = {
    netFinancialPosition: nfp,
    financialAssetsToLiabilities: totalLiab
      ? r.currentAndOtherAssets / totalLiab
      : 0,
    assetsToLiabilities: totalLiab
      ? (totalAssets + r.deferredOutflows) / totalLiab
      : 0,
    netDebtToRevenue: nfp < 0 && r.totalRevenue ? -nfp / r.totalRevenue : 0,
    interestToRevenue: r.totalRevenue ? r.debtInterest / r.totalRevenue : 0,
    netBookValueToCostOfTCA: grossCap ? r.capitalAssets / grossCap : 0,
    externalTransfersToRevenue: r.totalRevenue
      ? (r.operatingGrantsAndContributions + r.capitalGrantsAndContributions) /
        r.totalRevenue
      : 0,
  };
  const surplusAssetLife =
    (m.netBookValueToCostOfTCA - AVG_ASSET_LIFE) * grossCap;
  m.yearsOfSurplusRevenue = r.totalRevenue
    ? (nfp + surplusAssetLife) / r.totalRevenue
    : 0;
  return m;
}

// metric -> ("up"|"down" is good)
const GOOD_DIR: Record<string, string> = {
  netFinancialPosition: "up",
  financialAssetsToLiabilities: "up",
  assetsToLiabilities: "up",
  netDebtToRevenue: "down",
  interestToRevenue: "down",
  netBookValueToCostOfTCA: "up",
  externalTransfersToRevenue: "down",
  yearsOfSurplusRevenue: "up",
};
const DOLLAR = new Set(["netFinancialPosition"]);
const LABEL: Record<string, string> = {
  netFinancialPosition: "Net Financial Position",
  financialAssetsToLiabilities: "Financial Assets/Liabilities",
  assetsToLiabilities: "Assets/Liabilities",
  netDebtToRevenue: "Net Debt/Revenue",
  interestToRevenue: "Interest/Revenue",
  netBookValueToCostOfTCA: "Asset Life",
  externalTransfersToRevenue: "External Transfers/Revenue",
  yearsOfSurplusRevenue: "Years of Surplus Revenue",
};

const signed = (s: string, v: number) => (v < 0 ? s : "+" + s);
// Values print signed for dollars, plain for ratios; deltas are always signed.
const val = (k: string, v: number) =>
  DOLLAR.has(k) ? signed((v / 1e6).toFixed(1), v) + "M" : v.toFixed(3);
const delta = (k: string, d: number) =>
  DOLLAR.has(k)
    ? signed((d / 1e6).toFixed(1), d) + "M"
    : signed(d.toFixed(3), d);

async function main() {
  const cityId = process.argv[2];
  if (!cityId) {
    console.error("usage: metrics.ts <city-id>");
    process.exit(2);
  }
  const path = `data/acfr-json/${cityId}.ts`;
  if (!existsSync(path)) {
    console.error(
      `ERROR: ${path} not found — city not added yet (see add-city)`,
    );
    process.exit(2);
  }
  const mod = await import(pathToFileURL(resolve(path)).href);
  const rows = (Object.values(mod)[0] as CityFinancialData[])
    .slice()
    .sort((a, b) => a.fiscalYear - b.fiscalYear);
  const series = rows.map((r) => ({ fy: r.fiscalYear, m: metrics(r), r }));

  const keys = Object.keys(LABEL);
  console.log(
    `=== ${path}  FY${series[0].fy}–FY${series[series.length - 1].fy} ===\n`,
  );
  // per-year table
  console.log(
    "FY   " + keys.map((k) => LABEL[k].slice(0, 14).padStart(14)).join("  "),
  );
  for (const { fy, m } of series) {
    console.log(
      `${fy}  ` + keys.map((k) => val(k, m[k]).padStart(14)).join("  "),
    );
  }

  // revenue + rate context
  console.log("\n=== revenue / size ===");
  for (const { fy, r } of series) {
    console.log(
      `${fy}  totalRev=${(r.totalRevenue / 1e6).toFixed(1).padStart(6)}M` +
        `  interest=${(r.debtInterest / 1e6).toFixed(2).padStart(5)}M`,
    );
  }

  // per-metric trajectory summary: endpoints, peak/trough, net move good/bad.
  // This is the spine of the history section — start->end direction and the
  // peak/trough years are the turning points to narrate.
  console.log(
    `\n=== per-metric trajectory (FY${series[0].fy}->FY${series[series.length - 1].fy}) ===`,
  );
  for (const k of keys) {
    const vals = series.map(({ fy, m }) => ({ fy, v: m[k] }));
    const f0 = vals[0].v;
    const fN = vals[vals.length - 1].v;
    const lo = vals.reduce((a, b) => (b.v < a.v ? b : a));
    const hi = vals.reduce((a, b) => (b.v > a.v ? b : a));
    const net = fN - f0;
    const dirWord = net > 0 ? "up" : "down";
    const verdict =
      dirWord === GOOD_DIR[k] ? "GOOD" : net !== 0 ? "BAD" : "flat";
    console.log(
      `${LABEL[k].padEnd(32)} ${val(k, f0)} -> ${val(k, fN)}  net ${delta(k, net)} (${verdict})` +
        `  | trough ${val(k, lo.v)}@FY${lo.fy}  peak ${val(k, hi.v)}@FY${hi.fy}`,
    );
  }

  // top-2 YoY moves per metric (chart inflections to anchor drivers to)
  console.log(
    "\n=== top-2 YoY moves per metric (inflections needing a driver) ===",
  );
  for (const k of keys) {
    const moves = series.slice(1).map((s, i) => {
      const d = s.m[k] - series[i].m[k];
      return { abs: Math.abs(d), prev: series[i].fy, fy: s.fy, d };
    });
    // Descending on every tuple element, matching Python's `moves.sort(reverse=True)`.
    moves.sort(
      (a, b) => b.abs - a.abs || b.prev - a.prev || b.fy - a.fy || b.d - a.d,
    );
    const parts = moves.slice(0, 2).map(({ prev, fy, d }) => {
      const verdict = (d > 0 ? "up" : "down") === GOOD_DIR[k] ? "GOOD" : "BAD";
      return `FY${prev}->FY${fy} ${delta(k, d).padStart(8)} (${verdict})`;
    });
    console.log(`${LABEL[k].padEnd(32)} ` + parts.join("   "));
  }
}

main();
