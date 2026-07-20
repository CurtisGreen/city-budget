import type { CityFinancialData } from "./types";
import fs from "fs";

export function readACFR(filePath: string): CityFinancialData[] {
  try {
    const stringContent = fs.readFileSync(filePath, "utf-8");
    const arrayContent = parseCSV(stringContent);
    const financialData = arrayContent.map(formatData);
    return financialData;
  } catch {
    // File not found
    return [];
  }
}

export function parseCSV(csvContent: string): Record<string, number>[] {
  const lines = csvContent.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim());

  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    const row: Record<string, number> = {};

    headers.forEach((header, index) => {
      const value = values[index];
      // Empty cell -> NaN so optionalNumber() can tell it from a real 0.
      row[header] = value === undefined || value === "" ? NaN : Number(value);
    });

    return row;
  });
}

// Required columns: blank (NaN) -> 0, preserving the original Number("") behavior.
const num = (value: number): number => (Number.isNaN(value) ? 0 : value);

// Optional columns: absent or blank -> undefined so metrics can skip them.
const optionalNumber = (value: number | undefined): number | undefined =>
  value === undefined || Number.isNaN(value) ? undefined : value;

const formatData = (row: Record<string, number>): CityFinancialData => ({
  fiscalYear: num(row["Fiscal Year"]),
  currentAndOtherAssets: num(row["Current and Other Assets"]),
  capitalAssets: num(row["Capital Assets"]),
  deferredOutflows: num(row["Deferred outflows"]),
  liabilities: num(row["Total Liabilities"]),
  deferredInflows: num(row["Deferred inflows"]),
  totalRevenue: num(row["Total revenues"]),
  operatingGrantsAndContributions: num(row["Operating Grants & Contributions"]),
  capitalGrantsAndContributions: num(row["Capital Grants & Contributions"]),
  debtInterest: num(row["Debt service / interest"]),
  governmentalExpenses: optionalNumber(row["Governmental expenses"]),
  governmentalCapitalGrants: optionalNumber(row["Governmental capital grants"]),
  governmentalRevenues: optionalNumber(row["Governmental revenues"]),
  businessTypeExpenses: optionalNumber(row["Business-type expenses"]),
  capitalAssetsNetofDepreciation: optionalNumber(
    row["Capital assets (net of depreciation/amortization)"],
  ),
  governmentCapitalAssetsNotBeingDepreciated: num(
    row["Government capital assets not being depreciated"],
  ),
  governmentCapitalAssetsBeingDepreciated: num(
    row["Government capital assets being depreciated"],
  ),
  businessCapitalAssetsNotBeingDepreciated: num(
    row["Business capital assets not being depreciated"],
  ),
  businessCapitalAssetsBeingDepreciated: num(
    row["Business capital assets being depreciated"],
  ),
});
