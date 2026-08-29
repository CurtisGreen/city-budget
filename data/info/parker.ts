import { CityInfo } from "@/lib/types";

export const parkerInfo: CityInfo = {
  id: "parker",
  name: "Parker",
  populations: [
    { year: 1980, value: 1098 },
    { year: 1990, value: 1235 },
    { year: 2000, value: 1379 },
    { year: 2010, value: 3811 },
    { year: 2020, value: 5462 },
    { year: 2025, value: 6462 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.290294,
      isRate: 0.06069,
    },
    {
      fiscalYear: 2016,
      moRate: 0.272372,
      isRate: 0.078612,
    },
    {
      fiscalYear: 2017,
      moRate: 0.299719,
      isRate: 0.066265,
    },
    {
      fiscalYear: 2018,
      moRate: 0.305602,
      isRate: 0.060382,
    },
    {
      fiscalYear: 2019,
      moRate: 0.31225,
      isRate: 0.053734,
    },
    {
      fiscalYear: 2020,
      moRate: 0.317791,
      isRate: 0.048193,
    },
    {
      fiscalYear: 2021,
      moRate: 0.32956,
      isRate: 0.036424,
    },
    {
      fiscalYear: 2022,
      moRate: 0.33187,
      isRate: 0.034114,
    },
    {
      fiscalYear: 2023,
      moRate: 0.301137,
      isRate: 0.028152,
    },
    {
      fiscalYear: 2024,
      moRate: 0.302978,
      isRate: 0.019702,
    },
    {
      fiscalYear: 2025,
      moRate: 0.302744,
      isRate: 0.007695,
    },
    {
      fiscalYear: 2026,
      moRate: 0.305526,
      isRate: 0.004913,
    },
  ],
  revenueBySource: {
    property: 5_511_696,
    sales: 799_745,
    hotel: 0,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "Street Maintenance", percent: 1 },
  ],
  area: 8.52,
  notes: [
    `FY 2018 ACFR: "At the end of the current year, the City had total bonds outstanding of $10,610,081.
    The City issued $6,075,000 of combination tax and revenue bonds in the current year.
    During the year, principal payments totaling $699,919 were made."`,
  ],
};
