import type {
  CityData,
  CityFinancialData,
  CityInfo,
  CityMetrics,
  Population,
  PropertyValues,
} from "./types";
import {
  expenseCategoryGroups,
  mapDFWExpenseGroups,
  mapDFWSalesTaxUsage,
} from "./expense-category-groups";

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
  };
}

export function calculateDFWData(allCities: CityData[]): CityData {
  const years = new Set(
    allCities.flatMap((c) => c.financialData.map((f) => f.fiscalYear)),
  );

  // Only include cities with all years of data
  const cities = allCities.filter(
    (c) => new Set(c.financialData.map((f) => f.fiscalYear)).size === years.size,
  );

  // Group by year
  const yearMap = new Map<number, (CityFinancialData & { id: string })[]>();

  cities.forEach((cityData) => {
    cityData.financialData.forEach((yearData) => {
      if (!yearMap.has(yearData.fiscalYear)) {
        yearMap.set(yearData.fiscalYear, []);
      }
      yearMap
        .get(yearData.fiscalYear)!
        .push({ ...yearData, id: cityData.info.id });
    });
  });

  // Calculate totals for each year
  const dfwFinancials: CityFinancialData[] = Array.from(yearMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([fiscalYear, dataPoints]) => {
      const totalPensionLiability = sum(
        dataPoints.flatMap((d) =>
          d.pensionPlans.map((p) => p.totalPensionLiability),
        ),
      );
      const fiduciaryNetPosition = sum(
        dataPoints.flatMap((d) =>
          d.pensionPlans.map((p) => p.fiduciaryNetPosition),
        ),
      );
      const actuariallyDeterminedContribution = sum(
        dataPoints.flatMap((d) =>
          d.pensionPlans.map((p) => p.actuariallyDeterminedContribution || 0),
        ),
      );
      const actualContribution = sum(
        dataPoints.flatMap((d) =>
          d.pensionPlans.map((p) => p.actualContribution),
        ),
      );

      const getModifiedAccrualGroups = (id: string) =>
        expenseCategoryGroups[id]?.modifiedAccrualGroups ?? {};
      const getFullAccrualGroups = (id: string) =>
        expenseCategoryGroups[id]?.modifiedAccrualGroups ?? {};

      const fullAccrualExpenses = dataPoints.flatMap((d) => {
        return d.fullAccrualExpenses.map((e) => ({
          name: mapDFWExpenseGroups(e.name, getFullAccrualGroups(d.id)),
          value: e.value,
        }));
      });

      const modifiedAccrualCities = dataPoints.filter(
        (d) => d.modifiedAccrualExpenditures,
      );
      const modifiedAccrual = modifiedAccrualCities.map(
        (d) => d.modifiedAccrualExpenditures!,
      );


      const modifiedAccrualExpenditures = {
        current: modifiedAccrualCities.flatMap((d) =>
          d.modifiedAccrualExpenditures!.current.map((e) => ({
            name: mapDFWExpenseGroups(e.name, getModifiedAccrualGroups(d.id)),
            value: e.value,
          })),
        ),
        debtService: {
          principal: sum(modifiedAccrual.map((m) => m.debtService.principal)),
          interest: sum(modifiedAccrual.map((m) => m.debtService.interest)),
          refundingEscrow: sum(
            modifiedAccrual.map((m) => m.debtService.refundingEscrow ?? 0),
          ),
          issuanceCosts: sum(
            modifiedAccrual.map((m) => m.debtService.issuanceCosts ?? 0),
          ),
        },
        capitalOutlay: sum(modifiedAccrual.map((m) => m.capitalOutlay)),
        total: sum(modifiedAccrual.map((m) => m.total)),
      };

      return {
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
        propertyTaxRevenue: sum(dataPoints.map((d) => d.propertyTaxRevenue)),
        salesTaxRevenue: sum(dataPoints.map((d) => d.salesTaxRevenue)),
        hotelTaxRevenue: sum(dataPoints.map((d) => d.hotelTaxRevenue || 0)),
        fullAccrualExpenses,
        modifiedAccrualExpenditures,
        pensionPlans:
          // Exclude 2015 & 2016, no actuariallyDeterminedContribution for Dallas and several other cities for those years
          fiscalYear > 2016
            ? [
              {
                totalPensionLiability,
                fiduciaryNetPosition,
                actuariallyDeterminedContribution,
                actualContribution,
                name: "DFW",
              },
            ]
            : [],
      };
    });
  const dfwMetrics: CityMetrics[] = dfwFinancials.map(calculateACFRMetrics);
  const dfwPropertyTaxRates = getDFWPropertyTaxRates(allCities);

  const dfwCityData: CityData = {
    info: {
      id: "dfw",
      name: "DFW",
      populations: calculateDFWPopulation(allCities),
      propertyValues: dfwPropertyTaxRates,
      revenueBySource: {
        property: sum(cities.map((c) => c.info.revenueBySource.property)),
        sales: sum(cities.map((c) => c.info.revenueBySource.sales)),
        hotel: sum(cities.map((c) => c.info.revenueBySource.hotel)),
      },
      salesTaxUsage: calculateDFWSalesTaxUsage(cities),
      area: sum(allCities.map((c) => c.info.area)),
      notes: [
        "This page shows data for DFW as if all cities were one large city",
        `Only cities with data for every year are included (${cities.length} of ${allCities.length}), so the mix of cities doesn't change over time`,
        `Public safety swings between 2016-2021 are mostly pension accounting.
         Dallas in 2016 had a $2.9B net pension liability increase, and in 2018 had a -$350M expense due to HB 3158.
         Fort Worth in 2020 similarly had a -$168M public safety pension expense`,
        `I calculated the property tax rates for DFW by dollar-weighting them by property tax revenue`,
        "2015-2016 are excluded for pensions because Dallas and several other cities don't have 'actuarial determined contributions' for those years"
      ],
    },
    financialData: dfwFinancials,
    metrics: dfwMetrics,
  };

  return dfwCityData;
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

// Average share of the city's 2% sales tax by use, weighted by each city's latest sales tax revenue
export function calculateDFWSalesTaxUsage(
  cities: CityData[],
): CityInfo["salesTaxUsage"] {
  const percentTimesWeight: Record<string, number> = {};
  let totalWeight = 0;
  for (const city of cities) {
    const weight = city.financialData.at(-1)?.salesTaxRevenue ?? 0;
    const totalPercent = sum(city.info.salesTaxUsage.map((u) => u.percent));
    if (!weight || !totalPercent) continue;
    totalWeight += weight;
    for (const u of city.info.salesTaxUsage) {
      const name = mapDFWSalesTaxUsage(u.usage);
      percentTimesWeight[name] =
        (percentTimesWeight[name] ?? 0) + (u.percent / totalPercent) * 2 * weight;
    }
  }
  return Object.entries(percentTimesWeight)
    .map(([usage, value]) => ({
      usage,
      percent: parseFloat((value / totalWeight).toFixed(4)),
    }))
    .sort((a, b) => b.percent - a.percent);
}

export function calculateDFWPopulation(
  allCitiesData: CityData[],
): Population[] {
  // Group by year
  const yearMap = new Map<number, Population[]>();

  allCitiesData.forEach((cityData) => {
    cityData.info.populations.forEach((pop) => {
      if (!yearMap.has(pop.year)) {
        yearMap.set(pop.year, []);
      }
      yearMap.get(pop.year)!.push(pop);
    });
  });

  const populationPerYear: Population[] = Array.from(yearMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([year, dataPoints]) => ({
      year,
      value: sum(dataPoints.map((d) => d.value)),
    }));

  return populationPerYear;
}

function sum(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0);
}

export interface ExpenseChartData {
  data: Record<string, number>[];
  categories: string[];
}

export function toFullAccrualExpenseChart(
  financialData: CityFinancialData[],
  cityId: string,
): ExpenseChartData {
  const groups = expenseCategoryGroups[cityId]?.fullAccrualGroups ?? {};
  const categories = new Set<string>();
  const data = financialData.map((fd) => {
    const row: Record<string, number> = { fiscalYear: fd.fiscalYear };
    for (const expense of fd.fullAccrualExpenses) {
      const name = groups[expense.name] ?? expense.name;
      const value = (row[name] ?? 0) + expense.value;
      row[name] = value;
      categories.add(name);
    }
    return row;
  });
  return { data, categories: [...categories] };
}

export function toModifiedAccrualExpenditureChart(
  financialData: CityFinancialData[],
  cityId: string,
): ExpenseChartData {
  const groups = expenseCategoryGroups[cityId]?.modifiedAccrualGroups ?? {};
  const categories = new Set<string>();
  const data = financialData
    .filter((fd) => fd.modifiedAccrualExpenditures)
    .map((fd) => {
      const expenditures = fd.modifiedAccrualExpenditures!;

      const row: Record<string, number> = { fiscalYear: fd.fiscalYear };
      for (const expenditure of expenditures.current) {
        const name = groups[expenditure.name] ?? expenditure.name;
        const value = (row[name] ?? 0) + expenditure.value;
        row[name] = value;
        categories.add(name);
      }

      row["Debt service"] =
        expenditures.debtService.principal +
        expenditures.debtService.interest +
        (expenditures.debtService.refundingEscrow ?? 0) +
        (expenditures.debtService.issuanceCosts ?? 0);
      categories.add("Debt service");

      row["Capital outlay"] = expenditures.capitalOutlay;
      categories.add("Capital outlay");
      return row;
    });
  return { data, categories: [...categories] };
}

export function getDFWPropertyTaxRates(cities: CityData[]): PropertyValues[] {
  const years = new Set(
    cities.flatMap((city) => city.financialData.map((fd) => fd.fiscalYear)),
  );

  const citiesWithRatesAndRevenues = cities.filter(
    (city) =>
      city.financialData.filter(
        (f) => years.has(f.fiscalYear) && !!f.propertyTaxRevenue,
      ).length === years.size &&
      city.info.propertyValues.filter(
        (v) => years.has(v.fiscalYear) && v.moRate > 0,
      ).length === years.size,
  );

  const taxableValuePerYear: Record<string, number> = {};
  const isWeightedPerYear: Record<string, number> = {};
  const moWeightedPerYear: Record<string, number> = {};
  for (const city of citiesWithRatesAndRevenues) {
    for (const year of years) {
      const propertyTaxRates = city.info.propertyValues.find(
        (p) => p.fiscalYear === year,
      );
      const propertyTaxRevenue =
        city.financialData.find((f) => f.fiscalYear === year)
          ?.propertyTaxRevenue || 0;

      const isRate = propertyTaxRates?.isRate || 0;
      const moRate = propertyTaxRates?.moRate || 0;
      if (!propertyTaxRevenue || isRate + moRate <= 0) continue;

      const taxableValue = propertyTaxRevenue / (isRate + moRate);
      taxableValuePerYear[year] =
        (taxableValuePerYear[year] || 0) + taxableValue;
      isWeightedPerYear[year] =
        (isWeightedPerYear[year] || 0) + isRate * taxableValue;
      moWeightedPerYear[year] =
        (moWeightedPerYear[year] || 0) + moRate * taxableValue;
    }
  }

  return [...years].map((year) => ({
    fiscalYear: year,
    isRate: parseFloat(
      (isWeightedPerYear[year] / taxableValuePerYear[year]).toFixed(4),
    ),
    moRate: parseFloat(
      (moWeightedPerYear[year] / taxableValuePerYear[year]).toFixed(4),
    ),
  }));
}
