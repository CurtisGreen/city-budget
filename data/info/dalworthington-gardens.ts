import { CityInfo } from "@/lib/types";

export const dalworthingtonGardensInfo: CityInfo = {
  id: "dalworthington-gardens",
  name: "Dalworthington Gardens",
  populations: [
    { year: 1980, value: 1100 },
    { year: 1990, value: 1758 },
    { year: 2000, value: 2186 },
    { year: 2010, value: 2259 },
    { year: 2020, value: 2293 },
    { year: 2025, value: 2276 },
  ],
  propertyValues: [
    {
      fiscalYear: 2020,
      moRate: 0.487983,
      isRate: 0.092017,
    },
    {
      fiscalYear: 2021,
      moRate: 0.544576,
      isRate: 0.092017,
    },
    {
      fiscalYear: 2022,
      moRate: 0.566536,
      isRate: 0.092017,
    },
    {
      fiscalYear: 2023,
      moRate: 0.567716,
      isRate: 0.097417,
    },
    {
      fiscalYear: 2024,
      moRate: 0.528423,
      isRate: 0.083431,
    },
    {
      fiscalYear: 2025,
      moRate: 0.532609,
      isRate: 0.083431,
    },
    {
      fiscalYear: 2026,
      moRate: 0.542333,
      isRate: 0.083009,
    },
  ],
  revenueBySource: {
    property: 2635467,
    sales: 1026140,
    hotel: 0,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "Street Improvement Fund", percent: 0.25 },
    {
      usage: "Park and Recreation Facilities Development Corporation",
      percent: 0.25,
    },
    { usage: "Crime Control and Prevention District", percent: 0.5 },
  ],
  area: 1.79,
};
