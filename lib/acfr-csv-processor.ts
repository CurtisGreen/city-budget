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
      row[header] = Number(value);
    });

    return row;
  });
}

const formatData = (row: Record<string, number>): CityFinancialData => ({
  fiscalYear: row["Fiscal Year"],
  currentAndOtherAssets: row["Current and Other Assets"],
  capitalAssets: row["Capital Assets"],
  deferredOutflows: row["Deferred outflows"],
  liabilities: row["Total Liabilities"],
  deferredInflows: row["Deferred inflows"],
  totalRevenue: row["Total revenues"],
  operatingGrantsAndContributions: row["Operating Grants & Contributions"],
  capitalGrantsAndContributions: row["Capital Grants & Contributions"],
  debInterest: row["Debt service / interest"],
  // capitalAssetsNetofDepreciation:
  //   row["Capital assets (net of depreciation/amortization)"],
  governmentCapitalAssetsNotBeingDepreciated:
    row["Government capital assets not being depreciated"],
  governmentCapitalAssetsBeingDepreciated:
    row["Government capital assets being depreciated"],
  businessCapitalAssetsNotBeingDepreciated:
    row["Business capital assets not being depreciated"],
  businessCapitalAssetsBeingDepreciated:
    row["Business capital assets being depreciated"],
});
