import { CityInfo } from "@/lib/types";

export const northlakeInfo: CityInfo = {
  id: "northlake",
  name: "Northlake",
  populations: [
    { year: 1980, value: 143 },
    { year: 1990, value: 250 },
    { year: 2000, value: 921 },
    { year: 2010, value: 1724 },
    { year: 2020, value: 5201 },
    { year: 2025, value: 12036 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.2058,
      isRate: 0.0892,
    },
    {
      fiscalYear: 2016,
      moRate: 0.2177,
      isRate: 0.0773,
    },
    {
      fiscalYear: 2017,
      moRate: 0.2177,
      isRate: 0.0773,
    },
    {
      fiscalYear: 2018,
      moRate: 0.1705,
      isRate: 0.1245,
    },
    {
      fiscalYear: 2019,
      moRate: 0.1705,
      isRate: 0.1245,
    },
    {
      fiscalYear: 2020,
      moRate: 0.155563,
      isRate: 0.139437,
    },
    {
      fiscalYear: 2021,
      moRate: 0.146828,
      isRate: 0.148172,
    },
    {
      fiscalYear: 2022,
      moRate: 0.166687,
      isRate: 0.128313,
    },
    {
      fiscalYear: 2023,
      moRate: 0.142985,
      isRate: 0.152015,
    },
    {
      fiscalYear: 2024,
      moRate: 0.177648,
      isRate: 0.117352,
    },
    {
      fiscalYear: 2025,
      moRate: 0.166677,
      isRate: 0.128323,
    },
    {
      fiscalYear: 2026,
      moRate: 0.161839,
      isRate: 0.133161,
    },
  ],
  revenueBySource: {
    property: 7954237,
    sales: 2280421,
    hotel: 868313,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "Economic Development Corporation", percent: 0.5 },
    { usage: "Community Development Corporation", percent: 0.5 },
  ],
  area: 17.66,
  notes: [
    `FY 2020 ACFR: "The Town has restated beginning net position/fund balance within governmental
      activities, debt service, and PID funds due to various accounting and report presentation errors
      occurring in the prior year." [...] "the Town restated beginning net position/fund balance within
      business-type activities, the water and sewer fund, and the nonmajor proprietary funds due to a
      correction relating to capital assets and report presentations in the prior year."`,
    `FY 2025 ACFR: "Current assets for the primary government increased primarily due to greater cash on
      hand, resulting from the issuance of new debt proceeds that remain unspent as of yearend." [...]
      "Long-term liabilities for the primary government due to new bond issuances outweighing principal
      repayments in the current year."`,
  ],
};
