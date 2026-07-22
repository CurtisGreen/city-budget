import type {
  CityFinancialData,
  CityInfo,
  CityMetrics,
  Population,
} from "./types";
import { expenseCategoryGroups } from "./expense-category-groups";

export function calculateACFRMetrics(data: CityFinancialData): CityMetrics {
  const totalAssets = data.currentAndOtherAssets + data.capitalAssets;
  const totalLiabilities = data.liabilities + data.deferredInflows;
  const totalExternalTransfers =
    data.operatingGrantsAndContributions + data.capitalGrantsAndContributions;
  const grossCapitalAssets =
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
    netFinancialPosition < 0
      ? (-1 * netFinancialPosition) / data.totalRevenue
      : 0;
  const interestToRevenue = data.debtInterest / data.totalRevenue;
  const netCapitalAssets =
    data.capitalAssetsNetofDepreciation || data.capitalAssets;
  const netBookValueToCostOfTCA = netCapitalAssets / grossCapitalAssets;
  const externalTransfersToRevenue = totalExternalTransfers / data.totalRevenue;

  const averageAssetLife = 0.62; // Asset life of all cities in the data set if they were 1 large city, FY 2015 - FY 2025
  const surplusAssetLife =
    (netBookValueToCostOfTCA - averageAssetLife) * grossCapitalAssets;
  const totalSurplus = netFinancialPosition + surplusAssetLife;
  const yearsOfFinancialCushion = totalSurplus / data.totalRevenue;

  // Not rendered yet.
  // const govRecurringRevenue =
  //   (data.governmentalRevenues ?? NaN) -
  //   (data.governmentalCapitalGrants ?? 0) -
  //   (data.governmentalOperatingGrants ?? 0);
  // const structuralOperatingRatio =
  //   (data.governmentalExpenses ?? NaN) / govRecurringRevenue;
  //
  // const businessCapitalGrants =
  //   data.capitalGrantsAndContributions - (data.governmentalCapitalGrants ?? 0);
  // const businessRecurringRevenue =
  //   data.totalRevenue - (data.governmentalRevenues ?? NaN) - businessCapitalGrants;
  // const utilitySelfSupport =
  //   businessRecurringRevenue / (data.businessTypeExpenses ?? NaN);

  return {
    fiscalYear: data.fiscalYear,
    netFinancialPosition,
    financialAssetsToLiabilities,
    assetsToLiabilities,
    netDebtToRevenue,
    interestToRevenue,
    netBookValueToCostOfTCA,
    externalTransfersToRevenue,
    yearsOfFinancialCushion,
    // structuralOperatingRatio,
    // utilitySelfSupport,
  };
}

export function calculateAverageMetrics(
  allCitiesData: CityFinancialData[][],
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
          dataPoints.map((d) => d.currentAndOtherAssets),
        ),
        capitalAssets: sum(dataPoints.map((d) => d.capitalAssets)),
        deferredOutflows: sum(dataPoints.map((d) => d.deferredOutflows)),
        liabilities: sum(dataPoints.map((d) => d.liabilities)),
        deferredInflows: sum(dataPoints.map((d) => d.deferredInflows)),
        totalRevenue: sum(dataPoints.map((d) => d.totalRevenue)),
        operatingGrantsAndContributions: sum(
          dataPoints.map((d) => d.operatingGrantsAndContributions),
        ),
        capitalGrantsAndContributions: sum(
          dataPoints.map((d) => d.capitalGrantsAndContributions),
        ),
        debtInterest: sum(dataPoints.map((d) => d.debtInterest)),
        governmentCapitalAssetsNotBeingDepreciated: sum(
          dataPoints.map((d) => d.governmentCapitalAssetsNotBeingDepreciated),
        ),
        governmentCapitalAssetsBeingDepreciated: sum(
          dataPoints.map((d) => d.governmentCapitalAssetsBeingDepreciated),
        ),
        businessCapitalAssetsNotBeingDepreciated: sum(
          dataPoints.map((d) => d.businessCapitalAssetsNotBeingDepreciated),
        ),
        businessCapitalAssetsBeingDepreciated: sum(
          dataPoints.map((d) => d.businessCapitalAssetsBeingDepreciated),
        ),
      };

      return calculateACFRMetrics(sumOfCities);
    });

  return averagePerYear;
}

export function calculateAveragePopulationDensity(
  allCitiesData: CityInfo[],
): Population[] {
  // Group by year
  const yearMap = new Map<number, Population[]>();

  allCitiesData.forEach((cityData) => {
    cityData.populations.forEach((pop) => {
      if (!yearMap.has(pop.year)) {
        yearMap.set(pop.year, []);
      }
      yearMap.get(pop.year)!.push(pop);
    });
  });

  // Calculate average for each year
  const populationDensityPerYear: Population[] = Array.from(yearMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([year, dataPoints]) => ({
      year,
      value:
        sum(dataPoints.map((d) => d.value)) /
        sum(allCitiesData.map((c) => c.area)),
    }));

  return populationDensityPerYear;
}

function sum(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0);
}

// function calculateFinancialRanking(
//   allCitiesData: CityData[],
// ): { cityData: CityData; rank: number; percentile: number }[] {
//   // Rank each category
//   const byFinancialAssetsToLiabilities = allCitiesData.toSorted(
//     (a, b) =>
//       (b.metrics.at(-1)?.financialAssetsToLiabilities || 0) -
//       (a.metrics.at(-1)?.financialAssetsToLiabilities || 0),
//   );
//   const byAssetsToLiabilities = allCitiesData.toSorted(
//     (a, b) =>
//       (b.metrics.at(-1)?.assetsToLiabilities || 0) -
//       (a.metrics.at(-1)?.assetsToLiabilities || 0),
//   );
//   const byNetDebtToRevenue = allCitiesData.toSorted((a, b) => {
//     const netDebtToRevenueA = a.metrics.at(-1)?.netDebtToRevenue || 0;
//     const netDebtToRevenueB = b.metrics.at(-1)?.netDebtToRevenue || 0;
//     const netFinancialPositionA = a.metrics.at(-1)?.netFinancialPosition || 0;
//     const netFinancialPositionB = b.metrics.at(-1)?.netFinancialPosition || 0;
//     return (
//       netDebtToRevenueA - netDebtToRevenueB ||
//       netFinancialPositionB - netFinancialPositionA
//     );
//   });
//   const byInterestToRevenue = allCitiesData.toSorted(
//     (a, b) =>
//       (a.metrics.at(-1)?.interestToRevenue || 0) -
//       (b.metrics.at(-1)?.interestToRevenue || 0),
//   );

//   // Include 2 change over time metrics
//   const byAssetLife = allCitiesData.toSorted(
//     (a, b) =>
//       (b.metrics.at(-1)?.netBookValueToCostOfTCA || 0) -
//       (a.metrics.at(-1)?.netBookValueToCostOfTCA || 0),
//   );
//   const byExternalTransfersToRevenue = allCitiesData.toSorted(
//     (a, b) =>
//       (a.metrics.at(-1)?.externalTransfersToRevenue || 0) -
//       (b.metrics.at(-1)?.externalTransfersToRevenue || 0),
//   );

//   const byChangeInFinancialAssetsToLiabilities = allCitiesData.toSorted(
//     (a, b) => {
//       const aStartMetric = a.metrics.at(-1)?.financialAssetsToLiabilities || 0;
//       const aEndMetric = a.metrics.at(-6)?.financialAssetsToLiabilities || 0;
//       const bStartMetric = b.metrics.at(-1)?.financialAssetsToLiabilities || 0;
//       const bEndMetric = b.metrics.at(-6)?.financialAssetsToLiabilities || 0;
//       return bEndMetric - bStartMetric - (aEndMetric - aStartMetric);
//     },
//   );

//   const byChangeInAssetLife = allCitiesData.toSorted((a, b) => {
//     const aStartMetric = a.metrics.at(-1)?.netBookValueToCostOfTCA || 0;
//     const aEndMetric = a.metrics.at(-6)?.netBookValueToCostOfTCA || 0;
//     const bStartMetric = b.metrics.at(-1)?.netBookValueToCostOfTCA || 0;
//     const bEndMetric = b.metrics.at(-6)?.netBookValueToCostOfTCA || 0;
//     return bEndMetric - bStartMetric - (aEndMetric - aStartMetric);
//   });

//   const citiesWithScores: [CityData, number][] = allCitiesData.map(
//     (cityData) => {
//       const fatl = byFinancialAssetsToLiabilities.findIndex(
//         (c) => c.info.id === cityData.info.id,
//       );
//       const atl = byAssetsToLiabilities.findIndex(
//         (c) => c.info.id === cityData.info.id,
//       );
//       const ndtr = byNetDebtToRevenue.findIndex(
//         (c) => c.info.id === cityData.info.id,
//       );
//       const itr = byInterestToRevenue.findIndex(
//         (c) => c.info.id === cityData.info.id,
//       );
//       const alt = byAssetLife.findIndex((c) => c.info.id === cityData.info.id);
//       const ettr = byExternalTransfersToRevenue.findIndex(
//         (c) => c.info.id === cityData.info.id,
//       );
//       const cifatl = byChangeInFinancialAssetsToLiabilities.findIndex(
//         (c) => c.info.id === cityData.info.id,
//       );
//       const cial = byChangeInAssetLife.findIndex(
//         (c) => c.info.id === cityData.info.id,
//       );
//       const totalScore = sum([fatl, atl, ndtr, itr, alt, ettr, cifatl, cial]);
//       return [cityData, totalScore];
//     },
//   );
//   ``;
//   return citiesWithScores
//     .toSorted(([_, a], [__, b]) => a - b)
//     .map(([cityData], i) => ({
//       cityData,
//       rank: i + 1,
//       percentile: (i / (citiesWithScores.length - 1)) * 100,
//     }));
// }

export interface ExpenseChartData {
  data: Record<string, number>[];
  categories: string[];
}

export function toFullAccrualExpenseChart(
  financialData: CityFinancialData[],
  cityId: string,
): ExpenseChartData {
  const groups = expenseCategoryGroups[cityId]?.groups ?? {};
  const categories = new Set<string>();
  const data = financialData.flatMap((fd) => {
    if (!fd.fullAccrualExpenses) return [];
    const row: Record<string, number> = { fiscalYear: fd.fiscalYear };
    for (const expense of fd.fullAccrualExpenses) {
      const name = groups[expense.name] ?? expense.name;
      row[name] = (row[name] ?? 0) + expense.value;
      categories.add(name);
    }
    return [row];
  });
  return { data, categories: [...categories] };
}

export function toModifiedAccrualExpenditureChart(
  financialData: CityFinancialData[],
  cityId: string,
): ExpenseChartData {
  const groups = expenseCategoryGroups[cityId]?.groups ?? {};
  const categories = new Set<string>();
  const data = financialData.flatMap((fd) => {
    const expenditures = fd.modifiedAccrualExpenditures;
    if (!expenditures) return [];

    const row: Record<string, number> = { fiscalYear: fd.fiscalYear };
    for (const expenditure of expenditures.current) {
      const name = groups[expenditure.name] ?? expenditure.name;
      row[name] = (row[name] ?? 0) + expenditure.value;
      categories.add(name);
    }
    row["Debt service"] =
      expenditures.debtService.principal +
      expenditures.debtService.interest +
      (expenditures.debtService.refundingEscrow ?? 0);
    categories.add("Debt service");
    row["Capital outlay"] = expenditures.capitalOutlay;
    categories.add("Capital outlay");
    return [row];
  });
  return { data, categories: [...categories] };
}
