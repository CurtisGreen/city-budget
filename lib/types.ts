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
  // Tax revenue by source (Statement of Activities general revenues); recent years only.
  propertyTaxRevenue?: number;
  salesTaxRevenue?: number;
  hotelTaxRevenue?: number;
  // Optional Statement of Activities figures, governmental vs business-type.
  // Forney FY2023+ only; report order after debInterest.
  governmentalExpenses?: number;
  // Governmental capital grants (one-time); subset of TPG capitalGrantsAndContributions.
  governmentalCapitalGrants?: number;
  // Governmental revenues, all-in (program + general, excludes transfers).
  governmentalRevenues?: number;
  businessTypeExpenses?: number;
  capitalAssetsNetofDepreciation?: number;
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
  yearsOfSurplusRevenue: number;
  // Not rendered yet (see lib/format-chart-data.ts).
  // structuralOperatingRatio: number;
  // utilitySelfSupport: number;
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
  populations: Population[];
  propertyValues?: PropertyValues[];
  revenueBySource: RevenueBySource;
  salesTaxUsage?: {
    usage: string;
    percent: number;
  }[];
  latitude?: number;
  longitude?: number;
  area: number; // Land area in square miles
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
  // Optional source citation for the explanation card.
  source?: { label: string; url: string };
}

export type ChartFormatType = "percent" | "currency" | "number";
