import { CityInfo } from "@/lib/types";

export const richlandHillsInfo: CityInfo = {
  id: "richland-hills",
  name: "Richland Hills",
  populations: [
    { year: 1980, value: 7977 },
    { year: 1990, value: 7978 },
    { year: 2000, value: 8132 },
    { year: 2010, value: 7801 },
    { year: 2020, value: 8621 },
    { year: 2025, value: 8529 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.469092,
      isRate: 0.059002,
    },
    {
      fiscalYear: 2016,
      moRate: 0.47068,
      isRate: 0.058125,
    },
    {
      fiscalYear: 2017,
      moRate: 0.471433,
      isRate: 0.1242,
    },
    {
      fiscalYear: 2018,
      moRate: 0.460847,
      isRate: 0.102891,
    },
    {
      fiscalYear: 2019,
      moRate: 0.450755,
      isRate: 0.091125,
    },
    {
      fiscalYear: 2020,
      moRate: 0.418051,
      isRate: 0.1405,
    },
    {
      fiscalYear: 2021,
      moRate: 0.418051,
      isRate: 0.1405,
    },
    {
      fiscalYear: 2022,
      moRate: 0.418051,
      isRate: 0.1405,
    },
    {
      fiscalYear: 2023,
      moRate: 0.413628,
      isRate: 0.125257,
    },
    {
      fiscalYear: 2024,
      moRate: 0.3617,
      isRate: 0.160989,
    },
    {
      fiscalYear: 2025,
      moRate: 0.361643,
      isRate: 0.157236,
    },
    {
      fiscalYear: 2026,
      moRate: 0.370482,
      isRate: 0.134314,
    },
  ],
  revenueBySource: {
    property: 4913654,
    sales: 10476231,
    hotel: 250237,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "Crime Control and Prevention District", percent: 0.375 },
    { usage: "Road and Street Capital Projects Fund", percent: 0.375 },
    { usage: "Development Corporation", percent: 0.25 },
  ],
  area: 3.14,
  notes: [
    `FY 2016 ACFR: "During 2016 the City entered into a $10,993,247 contract to construct the new Link Activity Center.
      Construction costs incurred as of September 30, 2016, were $2,959,857. This project is funded with the General
      Obligation Bonds, Series 2016 and Combination Tax and Revenue Certificates of Obligation, Series 2016."`,
    `FY 2017 ACFR: "Major capital asset events during the current fiscal year included the following:" [...] "Completed
      the Link Activity Center and Plaza 10,744,438" [...] "The Link Activity Center funds was created to account for
      bond proceeds and the construction of a new activity center. Fund balance at year-end is $601,871."`,
    `FY 2024 ACFR: "The business-type activities total revenues increased $2,387,772 (27%) to $8,812,098 primarily
      because grants for water backup power and developer contributions of public infrastructure improvements in
      Richland Crossing."`,
  ],
};
