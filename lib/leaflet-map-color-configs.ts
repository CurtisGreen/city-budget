import { CityData, CityInfo, CityMetrics } from "@/lib/types";

export type ColorConfig = {
  greenLabel: string;
  yellowLabel: string;
  redLabel: string;
  colorFunction: (ratio: number) => string;
  getValue: (cityData: CityData) => number;
  getFormattedValue: (cityData: CityData) => string;
};

const netDebtConfig: ColorConfig = {
  greenLabel: "= 0",
  yellowLabel: "0 - 1.0",
  redLabel: "> 1",
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

const changeInAssetsToLiabilitiesConfig: ColorConfig = {
  greenLabel: ">= 30%",
  yellowLabel: ">= -20%",
  redLabel: "< -20%",
  colorFunction: (ratio: number) => {
    if (ratio >= 0.2) return "oklch(0.696 0.17 162)"; // green - excellent
    if (ratio >= -0.2) return "oklch(0.769 0.188 70)"; // yellow - okay
    return "oklch(0.577 0.245 27)"; // red - poor
  },
  getValue: (cityData: CityData) =>
    cityData.metrics[cityData.metrics.length - 1].assetsToLiabilities -
    cityData.metrics[0].assetsToLiabilities,
  getFormattedValue: (cityData: CityData) =>
    Math.round(
      (cityData.metrics[cityData.metrics.length - 1].assetsToLiabilities -
        cityData.metrics[0].assetsToLiabilities) *
        100,
    ) + "%",
};

const changeInAssetsLifeConfig: ColorConfig = {
  greenLabel: ">= 0%",
  yellowLabel: ">= -5%",
  redLabel: "< -5%",
  colorFunction: (ratio: number) => {
    if (ratio >= 0.0) return "oklch(0.696 0.17 162)"; // green - excellent
    if (ratio >= -0.05) return "oklch(0.769 0.188 70)"; // yellow - okay
    return "oklch(0.577 0.245 27)"; // red - poor
  },
  getValue: (cityData: CityData) =>
    cityData.metrics[cityData.metrics.length - 1].netBookValueToCostOfTCA -
    cityData.metrics[0].netBookValueToCostOfTCA,
  getFormattedValue: (cityData: CityData) =>
    Math.round(
      (cityData.metrics[cityData.metrics.length - 1].netBookValueToCostOfTCA -
        cityData.metrics[0].netBookValueToCostOfTCA) *
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

export const getColorConfig = (metric: string): ColorConfig => {
  if (metric == "Net Debt to Revenue") return netDebtConfig;
  if (metric == "Asset Life") return assetLifeConfig;
  if (metric == "10-Year Change in Assets Life")
    return changeInAssetsLifeConfig;
  if (metric == "Total Revenue Per Acre") return revenuePerAcreConfig;
  return changeInAssetsToLiabilitiesConfig;
};
