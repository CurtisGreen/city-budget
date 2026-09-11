import { CityInfo } from "@/lib/types";

export const seagovilleInfo: CityInfo = {
  id: "seagoville",
  name: "Seagoville",
  populations: [
    { year: 1980, value: 7304 },
    { year: 1990, value: 8969 },
    { year: 2000, value: 10823 },
    { year: 2010, value: 14835 },
    { year: 2020, value: 18446 },
    { year: 2025, value: 21077 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.693095,
      isRate: 0.020705,
    },
    {
      fiscalYear: 2016,
      moRate: 0.6758,
      isRate: 0.038,
    },
    {
      fiscalYear: 2017,
      moRate: 0.707498,
      isRate: 0.036302,
    },
    {
      fiscalYear: 2018,
      moRate: 0.707498,
      isRate: 0.036302,
    },
    {
      fiscalYear: 2019,
      moRate: 0.707498,
      isRate: 0.036302,
    },
    {
      fiscalYear: 2020,
      moRate: 0.7205,
      isRate: 0.0683,
    },
    {
      fiscalYear: 2021,
      moRate: 0.7205,
      isRate: 0.0683,
    },
    {
      fiscalYear: 2022,
      moRate: 0.70005,
      isRate: 0.08875,
    },
    {
      fiscalYear: 2023,
      moRate: 0.678272,
      isRate: 0.074415,
    },
    {
      fiscalYear: 2024,
      moRate: 0.632875,
      isRate: 0.095129,
    },
    {
      fiscalYear: 2025,
      moRate: 0.625213,
      isRate: 0.085719,
    },
    {
      fiscalYear: 2026,
      moRate: 0.645543,
      isRate: 0.0752,
    },
  ],
  revenueBySource: {
    property: 9486581,
    sales: 4492351,
    hotel: 39453,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1.5 },
    { usage: "Economic Development Corporation", percent: 0.5 },
  ],
  area: 18.7,
  notes: [
    `FY 2024 ACFR: "Capital grants increased by $20,642,459 or 100% due to developer infrastructure
     contributions from the Santorini and Stonehaven Public Improvement Districts."`,
    `FY 2025 ACFR: "Current and other assets in governmental activities decreased by $10,435,092,
     or 45%, primarily due to a decline in cash due to new capital improvements purchased during
     the year and prior year vendor payables paid in the current year."`,
  ],
};
