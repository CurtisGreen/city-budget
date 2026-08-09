import { CityInfo } from "@/lib/types";

export const sunnyvaleInfo: CityInfo = {
  id: "sunnyvale",
  name: "Sunnyvale",
  populations: [
    { year: 1980, value: 1404 },
    { year: 1990, value: 2228 },
    { year: 2000, value: 2693 },
    { year: 2010, value: 5130 },
    { year: 2020, value: 7893 },
    { year: 2025, value: 9008 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.3368,
      isRate: 0.0712,
    },
    {
      fiscalYear: 2016,
      moRate: 0.3392,
      isRate: 0.0688,
    },
    {
      fiscalYear: 2017,
      moRate: 0.3392,
      isRate: 0.0688,
    },
    {
      fiscalYear: 2018,
      moRate: 0.3485,
      isRate: 0.0646,
    },
    {
      fiscalYear: 2019,
      moRate: 0.3391,
      isRate: 0.0738,
    },
    {
      fiscalYear: 2020,
      moRate: 0.357,
      isRate: 0.0997,
    },
    {
      fiscalYear: 2021,
      moRate: 0.3105,
      isRate: 0.1462,
    },
    {
      fiscalYear: 2022,
      moRate: 0.3212,
      isRate: 0.1318,
    },
    {
      fiscalYear: 2023,
      moRate: 0.3069,
      isRate: 0.1461,
    },
    {
      fiscalYear: 2024,
      moRate: 0.3069,
      isRate: 0.1461,
    },
    {
      fiscalYear: 2025,
      moRate: 0.3069,
      isRate: 0.1461,
    },
    {
      fiscalYear: 2026,
      moRate: 0.31382,
      isRate: 0.14918,
    },
  ],
  revenueBySource: {
    property: 8298368,
    sales: 4742175,
    hotel: 0,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1.5 },
    { usage: "4B Development Corporation", percent: 0.5 },
  ],
  area: 16.52,
  notes: [
    `ACFR 2024: "As of the close of the current fiscal year, the Town's governmental funds reported combined ending fund balances of $18,199,612,
      a decrease of $7,544,188 in comparison with the prior year."
      [...] "Capital projects fund balance decreased $3,740,652 or 36.13%.
      The Fund reported significant capital expenditures ($14.4 million) for multiple projects,
      which were largely funded by transfers from other funds as well as the issuance of a new tax note."`,
  ],
};
