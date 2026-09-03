#!/usr/bin/env node
// Audit a city's acfr-json optional fields: report which fields are present/missing
// per year, and RECONCILE the arithmetic of the two breakdown fields. No PDF access.
// Usage: node .claude/skills/populate-pension-and-expenses/scripts/audit-expenses.mjs <cityId>
// Exit 1 if any hard reconciliation check fails (a wrong number is already in the file).
import { readFileSync } from "node:fs";

const id = process.argv[2];
if (!id) {
  console.error("usage: audit.mjs <cityId>");
  process.exit(2);
}
const path = `data/acfr-json/${id}.ts`;
let src;
try {
  src = readFileSync(path, "utf8");
} catch {
  console.error(`ERROR: ${path} not found — is the city added? (see add-city)`);
  process.exit(2);
}

// Extract the array literal: everything from the `[` after `=` to the final `]`.
const eq = src.indexOf("= [");
if (eq < 0) {
  console.error(`ERROR: could not find the acfr array in ${path}`);
  process.exit(2);
}
const arrText = src.slice(eq + 2, src.lastIndexOf("]") + 1);
let data;
try {
  data = eval("(" + arrText + ")"); // trusted local source file
} catch (e) {
  console.error(`ERROR: could not parse ${path}: ${e.message}`);
  process.exit(2);
}

// Optional fields this skill populates (base/required fields are add-city's job).
const OPTIONAL = [
  "propertyTaxRevenue",
  "salesTaxRevenue",
  "hotelTaxRevenue",
  "fullAccrualExpenses",
  "modifiedAccrualExpenditures",
];

const sum = (a) => a.reduce((s, x) => s + x, 0);
const errors = [];
const warns = [];

// ---- coverage matrix ----
console.log(
  `\n${id}: ${data.length} fiscal years (${data[0]?.fiscalYear}–${data.at(-1)?.fiscalYear})\n`,
);
const pad = (s, n) => String(s).padEnd(n);
const abbr = {
  propertyTaxRevenue: "prop",
  salesTaxRevenue: "sales",
  hotelTaxRevenue: "hotel",
  fullAccrualExpenses: "fullAcc",
  modifiedAccrualExpenditures: "modAcc",
};
console.log(pad("FY", 6) + OPTIONAL.map((f) => pad(abbr[f], 8)).join(""));
for (const y of data) {
  const cells = OPTIONAL.map((f) => pad(y[f] === undefined ? "·" : "✓", 8));
  console.log(pad(y.fiscalYear, 6) + cells.join(""));
}

// ---- reconciliation ----
const near = (a, b, tol) => Math.abs(a - b) <= tol;
for (const y of data) {
  const fy = y.fiscalYear;

  // 1. interest entry ~ debtInterest (debtInterest may be rounded to thousands).
  // NOTE: sum(fullAccrualExpenses) can only be checked against the SoA's own "Total governmental
  // activities" line in the PDF — that total is not stored, so it can't be re-checked here.
  if (y.fullAccrualExpenses && y.debtInterest !== undefined) {
    const intEntry = y.fullAccrualExpenses.find((e) =>
      /interest/i.test(e.name),
    );
    if (
      intEntry &&
      !near(
        intEntry.value,
        y.debtInterest,
        Math.max(1000, y.debtInterest * 0.02),
      )
    )
      warns.push(
        `FY${fy}: fullAccrual interest ${intEntry.value} vs debtInterest ${y.debtInterest} (>2%/1k apart)`,
      );
  }

  // 2. modifiedAccrualExpenditures: current + debtService + capitalOutlay == total.
  // This is the last automated reconciliation — everything else needs the PDF.
  const m = y.modifiedAccrualExpenditures;
  if (m) {
    const parts =
      sum(m.current.map((c) => c.value)) +
      m.debtService.principal +
      m.debtService.interest +
      (m.debtService.refundingEscrow ?? 0) +
      (m.debtService.issuanceCosts ?? 0) +
      m.capitalOutlay;
    if (parts !== m.total)
      errors.push(
        `FY${fy}: modifiedAccrual current+debt+escrow+issuance+capital=${parts} != total=${m.total}`,
      );
  }
}

// ---- name-drift check (do function labels stay consistent across years?) ----
const labelYears = {};
for (const y of data)
  for (const e of y.fullAccrualExpenses ?? [])
    (labelYears[e.name] ??= new Set()).add(y.fiscalYear);
const faYears = data.filter((y) => y.fullAccrualExpenses).length;
if (faYears > 1) {
  // A drifting label is already handled if it appears as a key in this city's
  // lib/expense-category-groups.ts entry — only warn about UNMAPPED drifters.
  let groupsSrc = "";
  try {
    groupsSrc = readFileSync("lib/expense-category-groups.ts", "utf8");
  } catch {}
  // A grouping key is written quoted ("Parks and recreation") or bare (Library) — Prettier drops
  // the quotes from any key that is a valid identifier, so match both forms.
  const mapped = (name) =>
    new RegExp(`(^|[{,\\s])"?${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"?\\s*:`, "m").test(
      groupsSrc,
    );
  const inconsistent = Object.entries(labelYears).filter(
    ([n, yrs]) => yrs.size < faYears && !mapped(n),
  );
  if (inconsistent.length)
    warns.push(
      `fullAccrualExpenses labels not in every year and NOT mapped in lib/expense-category-groups.ts (rename drift → add a grouping entry): ${inconsistent.map(([n, yrs]) => `"${n}"(${yrs.size}/${faYears}y)`).join(", ")}`,
    );
}

// ---- summary ----
console.log("");
const missing = OPTIONAL.filter((f) => data.some((y) => y[f] === undefined));
if (missing.length)
  console.log(`GAPS: fields missing in ≥1 year → ${missing.join(", ")}`);
else console.log("GAPS: none — every optional field present every year.");
for (const w of warns) console.log(`WARN  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);
console.log(
  errors.length
    ? `\n${errors.length} ERROR(s) — a stored value is wrong; fix before trusting.`
    : "\nreconciliation ✓",
);
process.exit(errors.length ? 1 : 0);
