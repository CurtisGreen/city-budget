import { CityInfo } from "@/lib/types";

export const colleyvilleInfo: CityInfo = {
  id: "colleyville",
  name: "Colleyville",
  populations: [
    { year: 1980, value: 6700 },
    { year: 1990, value: 12724 },
    { year: 2000, value: 19636 },
    { year: 2010, value: 22807 },
    { year: 2020, value: 26057 },
    { year: 2025, value: 25727 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.33461,
      isRate: 0.02129,
    },
    {
      fiscalYear: 2016,
      moRate: 0.33624,
      isRate: 0.01966,
    },
    {
      fiscalYear: 2017,
      moRate: 0.32191,
      isRate: 0.01722,
    },
    {
      fiscalYear: 2018,
      moRate: 0.316,
      isRate: 0.01783,
    },
    {
      fiscalYear: 2019,
      moRate: 0.30376,
      isRate: 0.01704,
    },
    {
      fiscalYear: 2020,
      moRate: 0.29043,
      isRate: 0.01638,
    },
    {
      fiscalYear: 2021,
      moRate: 0.28944,
      isRate: 0.01493,
    },
    {
      fiscalYear: 2022,
      moRate: 0.28069,
      isRate: 0.01109,
    },
    {
      fiscalYear: 2023,
      moRate: 0.25603,
      isRate: 0.00959,
    },
    {
      fiscalYear: 2024,
      moRate: 0.2514,
      isRate: 0.00959,
    },
    {
      fiscalYear: 2025,
      moRate: 0.26017,
      isRate: 0.01603,
    },
    {
      fiscalYear: 2026,
      moRate: 0.294232,
      isRate: 0.017699,
    },
  ],
  revenueBySource: {
    property: 17904226,
    sales: 10654186,
    hotel: 219059,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "Economic Development Corporation", percent: 0.5 },
    { usage: "Crime Control and Prevention District", percent: 0.5 },
  ],
  latitude: 32.88056,
  longitude: -97.14722,
  area: 13.12,
  notes: [
    `ACFR 2022: "Fiscal year 2022 governmental activities resulted in a $7,839,211 increase in net position. That increase was due to higher revenue intake, including approximately $3.356 million in Federal Coronavirus State and Local Fiscal Recovery funds, and continued investment in the City's capital assets."`,
    `ACFR 2023: "On November, 14, 2022, the City issued $10,030,000 of Combination Tax and Revenue Certificates of Obligation, Series 2022 for the purpose of paying contractual obligations to be incurred for constructing, improving, renovating, and equipping park and recreation facilities."`,
  ],
};
