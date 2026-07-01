import { CityInfo } from "@/lib/types";

export const highlandVillageInfo: CityInfo = {
  id: "highland-village",
  name: "Highland Village",
  populations: [
    { year: 1980, value: 3246 },
    { year: 1990, value: 7027 },
    { year: 2000, value: 12173 },
    { year: 2010, value: 15056 },
    { year: 2020, value: 15899 },
    { year: 2025, value: 16029 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.47,
      isRate: 0.0996,
    },
    {
      fiscalYear: 2016,
      moRate: 0.47817,
      isRate: 0.09146,
    },
    {
      fiscalYear: 2017,
      moRate: 0.48279,
      isRate: 0.08684,
    },
    {
      fiscalYear: 2018,
      moRate: 0.49706,
      isRate: 0.07096,
    },
    {
      fiscalYear: 2019,
      moRate: 0.47979,
      isRate: 0.08323,
    },
    {
      fiscalYear: 2020,
      moRate: 0.47649,
      isRate: 0.08653,
    },
    {
      fiscalYear: 2021,
      moRate: 0.47813,
      isRate: 0.08489,
    },
    {
      fiscalYear: 2022,
      moRate: 0.48264,
      isRate: 0.08039,
    },
    {
      fiscalYear: 2023,
      moRate: 0.47179,
      isRate: 0.07503,
    },
    {
      fiscalYear: 2024,
      moRate: 0.43368,
      isRate: 0.06771,
    },
    {
      fiscalYear: 2025,
      moRate: 0.42473,
      isRate: 0.07554,
    },
    {
      fiscalYear: 2026,
      moRate: 0.422397,
      isRate: 0.078587,
    },
  ],
  revenueBySource: {
    property: 15869314,
    sales: 5622168,
    hotel: 0,
  },
  revenues: [
    {
      fiscalYear: 2024,
      property: 15869314,
      sales: 5622168,
      hotel: 0,
    },
    {
      fiscalYear: 2025,
      property: 16730729,
      sales: 5629296,
      hotel: 0,
    },
  ],
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "Community Development Corporation", percent: 0.5 },
    { usage: "DCTA", percent: 0.5 },
  ],
  latitude: 33.0897,
  longitude: -97.06139,
  area: 5.53,
};
