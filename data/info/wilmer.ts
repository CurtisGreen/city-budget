import { CityInfo } from "@/lib/types";

export const wilmerInfo: CityInfo = {
  id: "wilmer",
  name: "Wilmer",
  populations: [
    { year: 1980, value: 2367 },
    { year: 1990, value: 2479 },
    { year: 2000, value: 3393 },
    { year: 2010, value: 3682 },
    { year: 2020, value: 4974 },
    { year: 2025, value: 6768 },
  ],
  propertyValues: [
    {
      fiscalYear: 2017,
      moRate: 0.341009,
      isRate: 0.161891,
    },
    {
      fiscalYear: 2018,
      moRate: 0.341009,
      isRate: 0.161891,
    },
    {
      fiscalYear: 2019,
      moRate: 0.3453,
      isRate: 0.1676,
    },
    {
      fiscalYear: 2020,
      moRate: 0.3953,
      isRate: 0.1676,
    },
    {
      fiscalYear: 2021,
      moRate: 0.3953,
      isRate: 0.1676,
    },
    {
      fiscalYear: 2022,
      moRate: 0.3999,
      isRate: 0.162,
    },
    {
      fiscalYear: 2023,
      moRate: 0.337157,
      isRate: 0.161702,
    },
    {
      fiscalYear: 2024,
      moRate: 0.279131,
      isRate: 0.159999,
    },
    {
      fiscalYear: 2025,
      moRate: 0.306455,
      isRate: 0.125688,
    },
    {
      fiscalYear: 2026,
      moRate: 0.325954,
      isRate: 0.141974,
    },
  ],
  revenueBySource: {
    property: 7873395,
    sales: 6114390,
    hotel: 0,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "Community Development Corporation", percent: 0.5 },
    { usage: "Economic Development Corporation", percent: 0.5 },
  ],
  area: 6.34,
  notes: [
    `FY 2018 ACFR: "Capital grants and contributions for governmental and business-type activities increased by
      $16,983,535 and $8,323,477, respectively, during the year." [...] "The total increase in capital assets
      for the current fiscal year was approximately 760.96%."`,
    `FY 2025 ACFR: "The Capital Projects fund has a total fund balance of $8,148,792.
      The net decrease in fund balance during the current year in the capital projects fund was ($21,187,190)."
      [...] "The total increase in capital assets for the current fiscal year was approximately 47.77%."`,
  ],
};
