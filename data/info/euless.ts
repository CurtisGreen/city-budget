import { CityInfo } from "@/lib/types";

export const eulessInfo: CityInfo = {
  id: "euless",
  name: "Euless",
  populations: [
    { year: 1980, value: 24002 },
    { year: 1990, value: 38149 },
    { year: 2000, value: 46005 },
    { year: 2010, value: 51277 },
    { year: 2020, value: 61032 },
    { year: 2025, value: 60008 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.364505,
      isRate: 0.102995,
    },
    {
      fiscalYear: 2016,
      moRate: 0.366571,
      isRate: 0.100929,
    },
    {
      fiscalYear: 2017,
      moRate: 0.363053,
      isRate: 0.099447,
    },
    {
      fiscalYear: 2018,
      moRate: 0.361056,
      isRate: 0.101444,
    },
    {
      fiscalYear: 2019,
      moRate: 0.37171,
      isRate: 0.09079,
    },
    {
      fiscalYear: 2020,
      moRate: 0.377974,
      isRate: 0.084526,
    },
    {
      fiscalYear: 2021,
      moRate: 0.381954,
      isRate: 0.080546,
    },
    {
      fiscalYear: 2022,
      moRate: 0.402888,
      isRate: 0.072112,
    },
    {
      fiscalYear: 2023,
      moRate: 0.370847,
      isRate: 0.089153,
    },
    {
      fiscalYear: 2024,
      moRate: 0.362697,
      isRate: 0.094803,
    },
    {
      fiscalYear: 2025,
      moRate: 0.365289,
      isRate: 0.081411,
    },
    {
      fiscalYear: 2026,
      moRate: 0.38943,
      isRate: 0.087036,
    },
  ],
  revenueBySource: {
    property: 30133000,
    sales: 29310000,
    hotel: 1656000,
  },
  revenues: [
    {
      fiscalYear: 2024,
      property: 30133000,
      sales: 29310000,
      hotel: 1656000,
    },
    {
      fiscalYear: 2025,
      property: 31877000,
      sales: 32032000,
      hotel: 1698000,
    },
  ],
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "Economic Development Corporation", percent: 0.5 },
    { usage: "Crime Control and Prevention District", percent: 0.25 },
    { usage: "Property Tax Reduction", percent: 0.25 },
  ],
  area: 16.12,
};
