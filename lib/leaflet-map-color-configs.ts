import { CityData } from "@/lib/types";

export type ColorConfig = {
  greenLabel: string;
  yellowLabel: string;
  redLabel: string;
  colorFunction: (ratio: number) => string;
  getValue: (cityData: CityData) => number;
  getFormattedValue: (cityData: CityData) => string;
};

const yearsOfSurplusRevenueConfig: ColorConfig = {
  greenLabel: ">= 0",
  yellowLabel: "> -0.5",
  redLabel: "< -0.5",
  colorFunction: (value: number) => {
    if (value >= 0) return "oklch(0.696 0.17 162)"; // green - excellent
    if (value >= -0.5) return "oklch(0.769 0.188 70)"; // yellow - okay
    return "oklch(0.577 0.245 27)"; // red - poor
  },
  getValue: (cityData: CityData) => {
    return cityData.metrics.at(-1)?.yearsOfSurplusRevenue || 0;
  },
  getFormattedValue: (cityData: CityData) => {
    const yearsOfSurplusRevenue =
      cityData.metrics.at(-1)?.yearsOfSurplusRevenue || 0;
    const formattedValue = new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(yearsOfSurplusRevenue);
    return formattedValue === "-0" ? "0" : formattedValue;
  },
};

// Not rendered yet (see types.ts).
// const structuralOperatingRatioConfig: ColorConfig = {
//   greenLabel: "< 95%",
//   yellowLabel: "< 100%",
//   redLabel: ">= 100%",
//   colorFunction: (ratio: number) => {
//     if (ratio < 0.95) return "oklch(0.696 0.17 162)"; // green - self-funding
//     if (ratio < 1.0) return "oklch(0.769 0.188 70)"; // yellow - break-even
//     return "oklch(0.577 0.245 27)"; // red - structural deficit
//   },
//   getValue: (cityData: CityData) =>
//     cityData.metrics.at(-1)?.structuralOperatingRatio || 0,
//   getFormattedValue: (cityData: CityData) => {
//     const value = cityData.metrics.at(-1)?.structuralOperatingRatio;
//     if (value === undefined || Number.isNaN(value)) return "N/A";
//     return Math.round(value * 100) + "%";
//   },
// };

// const utilitySelfSupportConfig: ColorConfig = {
//   greenLabel: ">= 100%",
//   yellowLabel: ">= 90%",
//   redLabel: "< 90%",
//   colorFunction: (ratio: number) => {
//     if (ratio >= 1.0) return "oklch(0.696 0.17 162)"; // green - self-supporting
//     if (ratio >= 0.9) return "oklch(0.769 0.188 70)"; // yellow - marginal
//     return "oklch(0.577 0.245 27)"; // red - subsidized by general fund
//   },
//   getValue: (cityData: CityData) =>
//     cityData.metrics.at(-1)?.utilitySelfSupport || 0,
//   getFormattedValue: (cityData: CityData) => {
//     const value = cityData.metrics.at(-1)?.utilitySelfSupport;
//     if (value === undefined || Number.isNaN(value)) return "N/A";
//     return Math.round(value * 100) + "%";
//   },
// };

const netDebtConfig: ColorConfig = {
  greenLabel: "= 0%",
  yellowLabel: "0% - 100%",
  redLabel: "> 100%",
  colorFunction: (ratio: number) => {
    if (ratio === 0) return "oklch(0.696 0.17 162)"; // green - excellent
    if (ratio < 1.0) return "oklch(0.769 0.188 70)"; // yellow - okay
    return "oklch(0.577 0.245 27)"; // red - poor
  },
  getValue: (cityData: CityData) =>
    cityData.metrics[cityData.metrics.length - 1].netDebtToRevenue,
  getFormattedValue: (cityData: CityData) =>
    Math.round(
      cityData.metrics[cityData.metrics.length - 1].netDebtToRevenue * 100,
    ) + "%",
};

const assetLifeConfig: ColorConfig = {
  greenLabel: ">= 60%",
  yellowLabel: ">= 50%",
  redLabel: "< 50%",
  colorFunction: (ratio: number) => {
    if (ratio >= 0.6) return "oklch(0.696 0.17 162)"; // green - excellent
    if (ratio >= 0.5) return "oklch(0.769 0.188 70)"; // yellow - okay
    return "oklch(0.577 0.245 27)"; // red - poor
  },
  getValue: (cityData: CityData) =>
    cityData.metrics[cityData.metrics.length - 1].netBookValueToCostOfTCA,
  getFormattedValue: (cityData: CityData) =>
    Math.round(
      cityData.metrics[cityData.metrics.length - 1].netBookValueToCostOfTCA *
      100,
    ) + "%",
};

const changeInAssetLifeConfig: ColorConfig = {
  greenLabel: ">= +5%",
  yellowLabel: ">= -5%",
  redLabel: "< -5%",
  colorFunction: (ratio: number) => {
    if (ratio >= 0.05) return "oklch(0.696 0.17 162)"; // green - excellent
    if (ratio >= -0.05) return "oklch(0.769 0.188 70)"; // yellow - okay
    return "oklch(0.577 0.245 27)"; // red - poor
  },
  getValue: (cityData: CityData) =>
    cityData.metrics[cityData.metrics.length - 1].netBookValueToCostOfTCA -
    cityData.metrics[cityData.metrics.length - 6].netBookValueToCostOfTCA,
  getFormattedValue: (cityData: CityData) => {
    const metrics = cityData.metrics;
    const current = metrics[metrics.length - 1].netBookValueToCostOfTCA;
    const fiveYearsAgo = metrics[metrics.length - 6].netBookValueToCostOfTCA;
    const value = (current - fiveYearsAgo) * 100;
    if (value > -1 && value < 1) return value.toFixed(1) + "%";
    return Math.round(value) + "%";
  },
};

const changeInAssetsToLiabilitiesConfig: ColorConfig = {
  greenLabel: ">= +20%",
  yellowLabel: ">= -20%",
  redLabel: "< -20%",
  colorFunction: (ratio: number) => {
    if (ratio >= 0.2) return "oklch(0.696 0.17 162)"; // green - excellent
    if (ratio >= -0.2) return "oklch(0.769 0.188 70)"; // yellow - okay
    return "oklch(0.577 0.245 27)"; // red - poor
  },
  getValue: (cityData: CityData) =>
    cityData.metrics[cityData.metrics.length - 1].assetsToLiabilities -
    cityData.metrics[cityData.metrics.length - 6].assetsToLiabilities,
  getFormattedValue: (cityData: CityData) =>
    Math.round(
      (cityData.metrics[cityData.metrics.length - 1].assetsToLiabilities -
        cityData.metrics[cityData.metrics.length - 6].assetsToLiabilities) *
      100,
    ) + "%",
};

const revenuePerAcreConfig: ColorConfig = {
  greenLabel: ">= $30,000",
  yellowLabel: ">= $15,000",
  redLabel: "< $15,000",
  colorFunction: (value: number) => {
    if (value >= 30000) return "oklch(0.696 0.17 162)"; // green - excellent
    if (value >= 15000) return "oklch(0.769 0.188 70)"; // yellow - okay
    return "oklch(0.577 0.245 27)"; // red - poor
  },
  getValue: (cityData: CityData) =>
    cityData.financialData[cityData.financialData.length - 1].totalRevenue /
    (cityData.info.area * 640),
  getFormattedValue: (cityData: CityData) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(
      cityData.financialData[cityData.financialData.length - 1].totalRevenue /
      (cityData.info.area * 640),
    ),
};

const changeInPopulation: ColorConfig = {
  greenLabel: ">= 5k",
  yellowLabel: ">= 0",
  redLabel: "< 0",
  colorFunction: (value: number) => {
    if (value >= 5000) return "oklch(0.696 0.17 162)"; // green - excellent
    if (value >= 0) return "oklch(0.769 0.188 70)"; // yellow - okay
    return "oklch(0.577 0.245 27)"; // red - poor
  },
  getValue: (cityData: CityData) => {
    const populations = cityData.info.populations;
    const current = populations[populations.length - 1].value;
    const fiveYearsAgo = populations[populations.length - 2].value;
    return current - fiveYearsAgo;
  },
  getFormattedValue: (cityData: CityData) => {
    const populations = cityData.info.populations;
    const current = populations[populations.length - 1].value;
    const fiveYearsAgo = populations[populations.length - 2].value;
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
    }).format(current - fiveYearsAgo);
  },
};

const changeInPopulationPercent: ColorConfig = {
  greenLabel: ">= +5%",
  yellowLabel: ">= 0%",
  redLabel: "< 0%",
  colorFunction: (ratio: number) => {
    if (ratio >= 0.05) return "oklch(0.696 0.17 162)"; // green - excellent
    if (ratio >= 0) return "oklch(0.769 0.188 70)"; // yellow - okay
    return "oklch(0.577 0.245 27)"; // red - poor
  },
  getValue: (cityData: CityData) => {
    const populations = cityData.info.populations;
    const current = populations[populations.length - 1].value;
    const fiveYearsAgo = populations[populations.length - 2].value;
    return (current - fiveYearsAgo) / fiveYearsAgo;
  },
  getFormattedValue: (cityData: CityData) => {
    const populations = cityData.info.populations;
    const current = populations[populations.length - 1].value;
    const fiveYearsAgo = populations[populations.length - 2].value;
    const value = ((current - fiveYearsAgo) / fiveYearsAgo) * 100;
    if (value > -1 && value < 1) return value.toFixed(1) + "%";
    return Math.round(value) + "%";
  },
};

export const getColorConfig = (metric: string): ColorConfig => {
  if (metric == "Years of Surplus Revenue") return yearsOfSurplusRevenueConfig;
  // Not rendered yet (see above).
  // if (metric == "Structural Operating Ratio")
  //   return structuralOperatingRatioConfig;
  // if (metric == "Utility Self-Support") return utilitySelfSupportConfig;
  if (metric == "Net Debt to Revenue") return netDebtConfig;
  if (metric == "Asset Life") return assetLifeConfig;
  if (metric == "5-Year Change in Asset Life") return changeInAssetLifeConfig;
  if (metric == "Total Revenue Per Acre") return revenuePerAcreConfig;
  if (metric == "5-Year Change in Population") return changeInPopulation;
  if (metric == "5-Year Change in Population %")
    return changeInPopulationPercent;
  return changeInAssetsToLiabilitiesConfig;
};
