export interface CityFinancialData {
  fiscalYear: number;
  currentAndOtherAssets: number;
  capitalAssets: number;
  deferredOutflows: number;
  liabilities: number;
  deferredInflows: number;
  totalRevenue: number;
  operatingGrantsAndContributions: number;
  capitalGrantsAndContributions: number;
  debInterest: number;
  capitalAssetsNetofDepreciation: number;
  governmentCapitalAssetsNotBeingDepreciated: number;
  governmentCapitalAssetsBeingDepreciated: number;
  businessCapitalAssetsNotBeingDepreciated: number;
  businessCapitalAssetsBeingDepreciated: number;
}

export interface CityMetrics {
  fiscalYear: number;
  netFinancialPosition: number;
  financialAssetsToLiabilities: number;
  assetsToLiabilities: number;
  netDebtToRevenue: number;
  interestToRevenue: number;
  netBookValueToCostOfTCA: number;
  externalTransfersToRevenue: number;
}

export interface Population {
  year: number;
  value: number;
}

export interface CityInfo {
  id: string;
  name: string;
  population: number;
  populations: Population[];
  propertyTaxRate: number; // percentage
  salesTaxBreakdown: {
    category: string;
    percentage: number;
    amount: number;
  }[];
  latitude: number;
  longitude: number;
}

export interface CityData {
  info: CityInfo;
  financialData: CityFinancialData[];
  metrics: CityMetrics[];
}

export interface ChartConfig {
  title: string;
  description: string;
  whatItMeans: string;
  whatToLookFor: string;
  note?: string;
  positiveDirection: "up" | "down";
  upwardDescription: string;
  downwardDescription: string;
  range?: [number | string, number | string];
}

export type ChartFormatType = "percent" | "currency" | "number";
