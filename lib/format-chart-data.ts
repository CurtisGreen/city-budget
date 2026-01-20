import type {
  CityFinancialData,
  CityInfo,
  CityMetrics,
  Population,
} from "./types";

export function calculateACFRMetrics(data: CityFinancialData): CityMetrics {
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
    netFinancialPosition < 0
      ? (-1 * netFinancialPosition) / data.totalRevenue
      : 0;
  const interestToRevenue = data.debInterest / data.totalRevenue;
  const netBookValueToCostOfTCA = data.capitalAssets / totalCapitalAssets;
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
        debInterest: sum(dataPoints.map((d) => d.debInterest)),
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
