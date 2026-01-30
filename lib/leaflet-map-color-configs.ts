import { CityMetrics } from "@/lib/types";

export type ColorConfig = {
  greenLabel: string;
  yellowLabel: string;
  redLabel: string;
  colorFunction: (ratio: number) => string;
  calculateValue: (cityMetrics: CityMetrics[]) => number;
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
  calculateValue: (cityMetrics: CityMetrics[]) =>
    cityMetrics[cityMetrics.length - 1].netDebtToRevenue,
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
  calculateValue: (cityMetrics: CityMetrics[]) =>
    cityMetrics[cityMetrics.length - 1].netBookValueToCostOfTCA,
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
  calculateValue: (cityMetrics: CityMetrics[]) =>
    cityMetrics[cityMetrics.length - 1].assetsToLiabilities -
    cityMetrics[0].assetsToLiabilities,
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
  calculateValue: (cityMetrics: CityMetrics[]) =>
    cityMetrics[cityMetrics.length - 1].netBookValueToCostOfTCA -
    cityMetrics[0].netBookValueToCostOfTCA,
};

export const getColorConfig = (metric: string): ColorConfig => {
  if (metric == "Net Debt to Revenue") return netDebtConfig;
  if (metric == "Asset Life") return assetLifeConfig;
  if (metric == "10-Year Change in Assets Life")
    return changeInAssetsLifeConfig;
  return changeInAssetsToLiabilitiesConfig;
};
