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
  // capitalAssetsNetofDepreciation: number;
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

export interface RevenueBySource {
  property: number;
  sales: number;
  hotel: number;
}

export interface PropertyValues {
  fiscalYear: number;
  // Maintenance & operations tax rate
  // Used for regular expenses
  moRate: number;
  // Interest & sinking tax rate
  // Used to pay off principal and interest on bonds or other long-term debt
  isRate: number;
  averageSFHTaxableValue?: number;
  averageSFHMarketValue?: number;
  averageSFHCityTaxesPaid?: number;
}

export interface CityInfo {
  id: string;
  name: string;
  population: number;
  populations: Population[];
  propertyValues?: PropertyValues[];
  revenueBySource: RevenueBySource;
  latitude: number;
  longitude: number;
  area: number; // Land area
  notes?: string[];
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
  formula: string;
}

export type ChartFormatType = "percent" | "currency" | "number";
