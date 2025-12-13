import { format } from "path";
import type { CityFinancialData, CityMetrics } from "./types";
import fs from "fs";

export function readACFR(filePath: string): CityFinancialData[] {
  try {
    const stringContent = fs.readFileSync(filePath, "utf-8");
    const arrayContent = parseCSV(stringContent);
    return arrayContent.map(formatData);
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
  deferredOutflows: row["Deferred Outflows"],
  liabilities: row["Liabilities"],
  deferredInflows: row["Deferred Inflows"],
  totalRevenue: row["Total Revenue"],
  operatingGrantsAndContributions: row["Operating Grants & Contributions"],
  capitalGrantsAndContributions: row["Capital Grants & Contributions"],
  debInterest: row["Debt service / interest"],
  capitalAssetsNetofDepreciation:
    row["Capital assets (net of depreciation/amortization)"],
  governmentCapitalAssetsNotBeingDepreciated:
    row["Government capital assets not being depreciated"],
  governmentCapitalAssetsBeingDepreciated:
    row["Government capital assets being depreciated"],
  businessCapitalAssetsNotBeingDepreciated:
    row["Business capital assets not being depreciated"],
  businessCapitalAssetsBeingDepreciated:
    row["Business capital assets being depreciated"],
});

export function calculateMetrics(data: CityFinancialData): CityMetrics {
  const totalAssets = data.currentAndOtherAssets + data.capitalAssets;
  const totalLiabilities = data.liabilities + data.deferredInflows;
  const totalExternalTransfers =
    data.operatingGrantsAndContributions + data.capitalGrantsAndContributions;
  const totalCapitalAssets =
    data.governmentCapitalAssetsBeingDepreciated +
    data.governmentCapitalAssetsNotBeingDepreciated +
    data.businessCapitalAssetsBeingDepreciated +
    data.businessCapitalAssetsNotBeingDepreciated;
  const netFinancialPosition = data.currentAndOtherAssets - totalLiabilities;
  const financialAssetsToLiabilities =
    data.currentAndOtherAssets / totalLiabilities;
  const assetsToLiabilities =
    (totalAssets + data.deferredOutflows) / totalLiabilities;
  const netDebtToRevenue =
    netFinancialPosition > 0 ? netFinancialPosition / data.totalRevenue : 0;
  const interestToRevenue = data.debInterest / data.totalRevenue;
  const netBookValueToCostOfTCA =
    data.capitalAssetsNetofDepreciation / totalCapitalAssets;
  const externalTransfersToRevenue = totalExternalTransfers / data.totalRevenue;

  return {
    fiscalYear: data.fiscalYear,
    netFinancialPosition,
    financialAssetsToLiabilities,
    assetsToLiabilities,
    netDebtToRevenue,
    interestToRevenue,
    netBookValueToCostOfTCA,
    externalTransfersToRevenue,
  };
}

export function calculateAverageMetrics(
  allCitiesData: CityFinancialData[][]
): CityMetrics[] {
  // Group by year
  const yearMap = new Map<number, CityFinancialData[]>();

  allCitiesData.forEach((cityData) => {
    cityData.forEach((yearData) => {
      if (!yearMap.has(yearData.fiscalYear)) {
        yearMap.set(yearData.fiscalYear, []);
      }
      yearMap.get(yearData.fiscalYear)!.push(yearData);
    });
  });

  // Calculate average for each year
  const averagePerYear = Array.from(yearMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([fiscalYear, dataPoints]) => {
      const sumOfCities: CityFinancialData = {
        fiscalYear,
        currentAndOtherAssets: sum(
          dataPoints.map((d) => d.currentAndOtherAssets)
        ),
        capitalAssets: sum(dataPoints.map((d) => d.capitalAssets)),
        deferredOutflows: sum(dataPoints.map((d) => d.deferredOutflows)),
        liabilities: sum(dataPoints.map((d) => d.liabilities)),
        deferredInflows: sum(dataPoints.map((d) => d.deferredInflows)),
        totalRevenue: sum(dataPoints.map((d) => d.totalRevenue)),
        operatingGrantsAndContributions: sum(
          dataPoints.map((d) => d.operatingGrantsAndContributions)
        ),
        capitalGrantsAndContributions: sum(
          dataPoints.map((d) => d.capitalGrantsAndContributions)
        ),
        debInterest: sum(dataPoints.map((d) => d.debInterest)),
        capitalAssetsNetofDepreciation: sum(
          dataPoints.map((d) => d.capitalAssetsNetofDepreciation)
        ),
        governmentCapitalAssetsNotBeingDepreciated: sum(
          dataPoints.map((d) => d.governmentCapitalAssetsNotBeingDepreciated)
        ),
        governmentCapitalAssetsBeingDepreciated: sum(
          dataPoints.map((d) => d.governmentCapitalAssetsBeingDepreciated)
        ),
        businessCapitalAssetsNotBeingDepreciated: sum(
          dataPoints.map((d) => d.businessCapitalAssetsNotBeingDepreciated)
        ),
        businessCapitalAssetsBeingDepreciated: sum(
          dataPoints.map((d) => d.businessCapitalAssetsBeingDepreciated)
        ),
      };

      return calculateMetrics(sumOfCities);
    });

  return averagePerYear;
}

function sum(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0);
}
