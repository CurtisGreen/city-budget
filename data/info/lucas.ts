import { CityInfo } from "@/lib/types";

export const lucasInfo: CityInfo = {
  id: "lucas",
  name: "Lucas",
  populations: [
    { year: 1980, value: 1371 },
    { year: 1990, value: 2205 },
    { year: 2000, value: 2890 },
    { year: 2010, value: 5166 },
    { year: 2020, value: 7612 },
    { year: 2025, value: 8896 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.233068,
      isRate: 0.087593,
    },
    {
      fiscalYear: 2016,
      moRate: 0.215514,
      isRate: 0.105147,
    },
    {
      fiscalYear: 2017,
      moRate: 0.230371,
      isRate: 0.087577,
    },
    {
      fiscalYear: 2018,
      moRate: 0.198695,
      isRate: 0.119253,
    },
    {
      fiscalYear: 2019,
      moRate: 0.202346,
      isRate: 0.10087,
    },
    {
      fiscalYear: 2020,
      moRate: 0.184515,
      isRate: 0.118701,
    },
    {
      fiscalYear: 2021,
      moRate: 0.190846,
      isRate: 0.108949,
    },
    {
      fiscalYear: 2022,
      moRate: 0.185743,
      isRate: 0.102654,
    },
    {
      fiscalYear: 2023,
      moRate: 0.195821,
      isRate: 0.072195,
    },
    {
      fiscalYear: 2024,
      moRate: 0.185402,
      isRate: 0.071356,
    },
    {
      fiscalYear: 2025,
      moRate: 0.184805,
      isRate: 0.054246,
    },
    {
      fiscalYear: 2026,
      moRate: 0.20267,
      isRate: 0.052793,
    },
  ],
  revenueBySource: {
    property: 5539197,
    sales: 2657921,
    hotel: 0,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "Street Maintenance", percent: 0.5 },
    { usage: "Fire District", percent: 0.5 },
  ],
  area: 15.6,
};
