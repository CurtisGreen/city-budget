import { CityInfo } from "@/lib/types";

export const balchSpringsInfo: CityInfo = {
  id: "balch-springs",
  name: "Balch Springs",
  populations: [
    { year: 1980, value: 13746 },
    { year: 1990, value: 17406 },
    { year: 2000, value: 19375 },
    { year: 2010, value: 23728 },
    { year: 2020, value: 27685 },
    { year: 2025, value: 27258 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.714768,
      isRate: 0.088232,
    },
    {
      fiscalYear: 2016,
      moRate: 0.714768,
      isRate: 0.088232,
    },
    {
      fiscalYear: 2017,
      moRate: 0.714768,
      isRate: 0.088232,
    },
    {
      fiscalYear: 2018,
      moRate: 0.729905,
      isRate: 0.073095,
    },
    {
      fiscalYear: 2019,
      moRate: 0.735172,
      isRate: 0.067828,
    },
    {
      fiscalYear: 2020,
      moRate: 0.741755,
      isRate: 0.061245,
    },
    {
      fiscalYear: 2021,
      moRate: 0.74798,
      isRate: 0.05502,
    },
    {
      fiscalYear: 2022,
      moRate: 0.746882,
      isRate: 0.047747,
    },
    {
      fiscalYear: 2023,
      moRate: 0.752628,
      isRate: 0.042001,
    },
    {
      fiscalYear: 2024,
      moRate: 0.753593,
      isRate: 0.041036,
    },
    {
      fiscalYear: 2025,
      moRate: 0.763415,
      isRate: 0.031214,
    },
    {
      fiscalYear: 2026,
      moRate: 0.763429,
      isRate: 0.0312,
    },
  ],
  revenueBySource: {
    property: 14651191,
    sales: 8891822,
    hotel: 277495,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "Property Tax Rebate", percent: 0.25 },
    { usage: "Industrial and Economic Development Corporation", percent: 0.25 },
    { usage: "Community and Economic Development Corporation", percent: 0.25 },
    { usage: "Street Maintenance", percent: 0.25 },
  ],
  latitude: 32.72,
  longitude: -96.62361,
  area: 9.02,
  notes: [
    `ACFR 2025: "As of September 30, 2025, the City's total outstanding debt has increased by $12.4 million, or 97% from
      the prior fiscal year. The main reason for the increase in outstanding debt is attributed to the issuance of
      Combination Tax and Revenue Certificates of Obligation, Series 2025."`,
  ],
};
