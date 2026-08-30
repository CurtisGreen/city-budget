import { CityInfo } from "@/lib/types";

export const pantegoInfo: CityInfo = {
  id: "pantego",
  name: "Pantego",
  populations: [
    { year: 1980, value: 2431 },
    { year: 1990, value: 2371 },
    { year: 2000, value: 2318 },
    { year: 2010, value: 2394 },
    { year: 2020, value: 2568 },
    { year: 2025, value: 2440 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.38532,
      isRate: 0.03468,
    },
    {
      fiscalYear: 2016,
      moRate: 0.42,
      isRate: 0,
    },
    {
      fiscalYear: 2017,
      moRate: 0.42,
      isRate: 0,
    },
    {
      fiscalYear: 2018,
      moRate: 0.42,
      isRate: 0,
    },
    {
      fiscalYear: 2019,
      moRate: 0.42,
      isRate: 0,
    },
    {
      fiscalYear: 2020,
      moRate: 0.370094,
      isRate: 0.049906,
    },
    {
      fiscalYear: 2021,
      moRate: 0.370516,
      isRate: 0.049484,
    },
    {
      fiscalYear: 2022,
      moRate: 0.371329,
      isRate: 0.048671,
    },
    {
      fiscalYear: 2023,
      moRate: 0.431809,
      isRate: 0.044122,
    },
    {
      fiscalYear: 2024,
      moRate: 0.417934,
      isRate: 0.152066,
    },
    {
      fiscalYear: 2025,
      moRate: 0.425377,
      isRate: 0.144623,
    },
    {
      fiscalYear: 2026,
      moRate: 0.459769,
      isRate: 0.170231,
    },
  ],
  revenueBySource: {
    property: 2499166,
    sales: 2314948,
    hotel: 0,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "Property Tax Relief", percent: 0.25 },
    { usage: "Street Improvement", percent: 0.25 },
    { usage: "Economic Development Corporation", percent: 0.5 },
  ],
  area: 1.04,
  notes: [
    `FY 2023 ACFR: "At the end of the current fiscal year, the Town had a total of $15,542,941 in outstanding bonded debt. This debt is secured by a combination of property taxes and a pledge of water and sewer revenues. This debt was issued for major infrastructure improvements." [...] "The Town's property tax rate was increased to $0.57 per $100 taxable value for fiscal year 2024 from $0.476 per $100 in fiscal year 2023 to fund a portion of the debt service of the 2023 Certificates of Obligation issuance."`,
  ],
};
