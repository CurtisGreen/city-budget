import { CityInfo } from "@/lib/types";

export const westlakeInfo: CityInfo = {
  id: "westlake",
  name: "Westlake",
  populations: [
    { year: 1980, value: 214 },
    { year: 1990, value: 185 },
    { year: 2000, value: 207 },
    { year: 2010, value: 992 },
    { year: 2020, value: 1623 },
    { year: 2025, value: 1670 }
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.1371,
      isRate: 0.01924,
    },
    {
      fiscalYear: 2016,
      moRate: 0.13947,
      isRate: 0.01687,
    },
    {
      fiscalYear: 2017,
      moRate: 0.12882,
      isRate: 0.00813,
    },
    {
      fiscalYear: 2018,
      moRate: 0.11133,
      isRate: 0.02482,
    },
    {
      fiscalYear: 2019,
      moRate: 0.13201,
      isRate: 0.02399,
    },
    {
      fiscalYear: 2020,
      moRate: 0.11453,
      isRate: 0.04565,
    },
    {
      fiscalYear: 2021,
      moRate: 0.1249,
      isRate: 0.04298,
    },
    {
      fiscalYear: 2022,
      moRate: 0.1249,
      isRate: 0.04298,
    },
    {
      fiscalYear: 2023,
      moRate: 0.10284,
      isRate: 0.06504,
    },
    {
      fiscalYear: 2024,
      moRate: 0.09117,
      isRate: 0.07671,
    },
    {
      fiscalYear: 2025,
      moRate: 0.11788,
      isRate: 0.05,
    },
    {
      fiscalYear: 2026,
      moRate: 0.13,
      isRate: 0.055,
    },
  ],
  revenueBySource: {
    property: 4008157,
    sales: 11985325,
    hotel: 748500,
  },
  revenues: [
    {
      fiscalYear: 2024,
      property: 4008157,
      sales: 11985325,
      hotel: 748500,
    },
    {
      fiscalYear: 2025,
      property: 4357604,
      sales: 16048173,
      hotel: 549850,
    },
  ],
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "Economic Development Corporation", percent: 0.5 },
    { usage: "Property Tax Rebate", percent: 0.5 },
  ],
  latitude: 32.99722,
  longitude: -97.20833,
  area: 6.74,
};
