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
  debtInterest: number;
  propertyTaxRevenue?: number;
  salesTaxRevenue?: number;
  hotelTaxRevenue?: number;
  governmentalExpenses?: number;
  // Gov-wide Statement of Activities, full accrual: includes depreciation & actuarial pension; excludes capital outlay & debt principal.
  fullAccrualExpenses?: { name: string; value: number }[];
  // Governmental funds statement, modified accrual: includes capital outlay & debt principal; excludes depreciation; pension = cash contributions.
  modifiedAccrualExpenditures?: {
    current: { name: string; value: number }[];
    // refundingEscrow = "Payment to refunded bond escrow agent" when a city books it as a
    // debt-service EXPENDITURE (in Total Expenditures), e.g. Dallas. Omit when the city books it
    // under Other Financing Uses instead (excluded from expenditures), e.g. Addison.
    debtService: {
      principal: number;
      interest: number;
      refundingEscrow?: number;
    };
    capitalOutlay: number;
    total: number;
  };
  governmentalCapitalGrants?: number;
  governmentalOperatingGrants?: number;
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
  yearsOfFinancialCushion: number;
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
