import type {
  CityData,
  CityFinancialData,
  CityInfo,
  CityMetrics,
  Population,
  PropertyValues,
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
  // Group by year
  const yearMap = new Map<number, CityFinancialData[]>();

  allCities.forEach((cityData) => {
    cityData.financialData.forEach((yearData) => {
      if (!yearMap.has(yearData.fiscalYear)) {
        yearMap.set(yearData.fiscalYear, []);
      }
      yearMap.get(yearData.fiscalYear)!.push(yearData);
    });
  });

  // Calculate totals for each year
  const dfwFinancials: CityFinancialData[] = Array.from(yearMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([fiscalYear, dataPoints]) => {
      // const a = dataPoints.map(d => d.pensionPlans[0].)
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
        fullAccrualExpenses: [],
        pensionPlans: [
          {
            totalPensionLiability,
            fiduciaryNetPosition,
            actuariallyDeterminedContribution,
            actualContribution,
            name: "DFW",
          },
        ],
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
        property: sum(allCities.map((c) => c.info.revenueBySource.property)),
        sales: sum(allCities.map((c) => c.info.revenueBySource.sales)),
        hotel: sum(allCities.map((c) => c.info.revenueBySource.hotel)),
      },
      salesTaxUsage: [],
      area: sum(allCities.map((c) => c.info.area)),
      notes: [
        "This page shows data for DFW as if all cities were one large city",
        `I calculated the property tax rates for DFW by dollar-weighting them with property tax revenue. 
         5 out of the ${allCities.length} cities don't have full revenue data so they are excluded from this calculation. 
         The result is neglibly changed.`,
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

const testCities = [
  "Addison",
  "Allen",
  "Arlington",
  "Balch Springs",
  "Bedford",
  "Benbrook",
  "Burleson",
  "Carrollton",
  "Cedar Hill",
  "Celina",
  "Colleyville",
  "Coppell",
  "Corinth",
  "Crowley",
  "Dallas",
  "Dalworthington Gardens",
  "Denton",
  "DeSoto",
  "Duncanville",
  "Euless",
  "Fairview",
  "Farmers Branch",
  "Fate",
  "Flower Mound",
  "Forest Hill",
  "Forney",
  "Fort Worth",
  "Frisco",
  "Garland",
  "Glenn Heights",
  "Grand Prairie",
  "Grapevine",
  "Haltom City",
  "Haslet",
  "Highland Park",
  "Highland Village",
  "Hurst",
  "Hutchins",
  "Irving",
  "Keller",
  "Kennedale",
  "Lancaster",
  "Lewisville",
  "Little Elm",
  "Lucas",
  "McKinney",
  "Mesquite",
  "Northlake",
  "Pantego",
  "Parker",
  "Plano",
  "Princeton",
  "Red Oak",
  "Richardson",
  "Saginaw",
  "Seagoville",
  "Watauga",
  "White Settlement",
];

export function getDFWPropertyTaxRates(cities: CityData[]): PropertyValues[] {
  const years = new Set(
    cities.flatMap((city) => city.financialData.map((fd) => fd.fiscalYear)),
  );

  const citiesWithRatesAndRevenues = cities
    // .filter(
    //   (city) =>
    //     city.financialData.filter(
    //       (f) => years.has(f.fiscalYear) && !!f.propertyTaxRevenue,
    //     ).length === years.size,
    // )
    .filter((city) => testCities.includes(city.info.name));

  const isTaxableValuePerYear: Record<string, number> = {};
  const moTaxableValuePerYear: Record<string, number> = {};
  const totalRevenuesPerYear: Record<string, number> = {};
  for (const city of citiesWithRatesAndRevenues) {
    for (const year of years) {
      if (!isTaxableValuePerYear[year]) {
        isTaxableValuePerYear[year] = 0;
      }
      if (!moTaxableValuePerYear[year]) {
        moTaxableValuePerYear[year] = 0;
      }
      if (!totalRevenuesPerYear[year]) {
        totalRevenuesPerYear[year] = 0;
      }

      const propertyTaxRates = city.info.propertyValues.find(
        (p) => p.fiscalYear === year,
      );
      const financialData = city.financialData.find(
        (f) => f.fiscalYear === year,
      );

      const isRate = propertyTaxRates?.isRate || 0;
      const moRate = propertyTaxRates?.moRate || 0;
      const propertyTaxRevenue = financialData?.propertyTaxRevenue || 0;

      totalRevenuesPerYear[year] += propertyTaxRevenue;
      isTaxableValuePerYear[year] +=
        isRate > 0 ? propertyTaxRevenue / isRate : 0;
      moTaxableValuePerYear[year] += propertyTaxRevenue / moRate;
    }
  }

  return [...years].map((year) => {
    const totalRevenue = totalRevenuesPerYear[year];
    const isTaxableValue = isTaxableValuePerYear[year];
    const moTaxableValue = moTaxableValuePerYear[year];
    const isRate = totalRevenue / isTaxableValue;
    const moRate = totalRevenue / moTaxableValue;

    return {
      fiscalYear: year,
      isRate: parseFloat(isRate.toFixed(4)),
      moRate: parseFloat(moRate.toFixed(4)),
    };
  });
}
