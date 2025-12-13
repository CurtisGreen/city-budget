export interface CityFinancialData {
  year: number
  totalRevenue: number
  totalAssets: number
  totalLiabilities: number
  financialAssets: number
  netDebt: number
  interest: number
  governmentTransfers: number
  netBookValue: number
  costOfTangibleCapitalAssets: number
}

export interface CityMetrics {
  netFinancialPosition: number // Total Assets - Total Liabilities
  financialAssetsToLiabilities: number // Financial Assets / Total Liabilities
  totalAssetsToLiabilities: number // Total Assets / Total Liabilities
  netDebtToRevenue: number // Net Debt / Total Revenue
  interestToRevenue: number // Interest / Total Revenue
  netBookValueToCost: number // Net Book Value / Cost of Tangible Capital Assets
  governmentTransfersToRevenue: number // Government Transfers / Total Revenue
}

export interface CityInfo {
  id: string
  name: string
  population: number
  propertyTaxRate: number // percentage
  salesTaxBreakdown: {
    category: string
    percentage: number
    amount: number
  }[]
  latitude: number
  longitude: number
}

export interface CityData {
  info: CityInfo
  financialData: CityFinancialData[]
  metrics: CityMetrics[]
}

export interface ChartExplanation {
  title: string
  description: string
  whatItMeans: string
  whatToLookFor: string
}
