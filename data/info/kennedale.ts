import { CityInfo } from "@/lib/types";

export const kennedaleInfo: CityInfo = {
  id: "kennedale",
  name: "Kennedale",
  populations: [
    { year: 1980, value: 2594 },
    { year: 1990, value: 4096 },
    { year: 2000, value: 5850 },
    { year: 2010, value: 6763 },
    { year: 2020, value: 8517 },
    { year: 2025, value: 10626 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.551216,
      isRate: 0.196284,
    },
    {
      fiscalYear: 2016,
      moRate: 0.575204,
      isRate: 0.192296,
    },
    {
      fiscalYear: 2017,
      moRate: 0.581711,
      isRate: 0.185789,
    },
    {
      fiscalYear: 2018,
      moRate: 0.57875,
      isRate: 0.19875,
    },
    {
      fiscalYear: 2019,
      moRate: 0.535219,
      isRate: 0.190495,
    },
    {
      fiscalYear: 2020,
      moRate: 0.544429,
      isRate: 0.190541,
    },
    {
      fiscalYear: 2021,
      moRate: 0.582686,
      isRate: 0.191399,
    },
    {
      fiscalYear: 2022,
      moRate: 0.572949,
      isRate: 0.191136,
    },
    {
      fiscalYear: 2023,
      moRate: 0.569154,
      isRate: 0.137036,
    },
    {
      fiscalYear: 2024,
      moRate: 0.509273,
      isRate: 0.196917,
    },
    {
      fiscalYear: 2025,
      moRate: 0.510974,
      isRate: 0.195216,
    },
    {
      fiscalYear: 2026,
      moRate: 0.483073,
      isRate: 0.213117,
    },
  ],
  revenueBySource: {
    property: 8811356,
    sales: 2285133,
    hotel: 26133,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1.5 },
    { usage: "Economic Development Corporation", percent: 0.5 },
  ],
  area: 6.61,
  notes: [
    `FY 2016 ACFR: "Governmental activities net position increased by $2,950,956.
     The increase is more than the prior year increase of $1,027,630 due primarily to an increase in
     capital grants and contributions, property taxes and other taxes." [...] "Charges for water and
     sewer services were $4,782,055 and capital contributions were $1,479,937 for the fiscal year
     2016, which is $2,578,690 more than the 2014-2015 fiscal year revenue, $3,683,823. This increase
     is a result of a change in donation of capital assets from developers and water and sewer rates
     were increased mid-year."`,
    `FY 2024 ACFR: "Both current and other assets and long-term liabilities primarily increased due to
     the issuance of over $13 million in debt towards the end of the year that will be used for future
     capital projects."`,
  ],
};
