import { CityInfo } from "@/lib/types";

export const rockwallInfo: CityInfo = {
  id: "rockwall",
  name: "Rockwall",
  populations: [
    { year: 1980, value: 5939 },
    { year: 1990, value: 10486 },
    { year: 2000, value: 17976 },
    { year: 2010, value: 37490 },
    { year: 2020, value: 47251 },
    { year: 2025, value: 53980 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.2207,
      isRate: 0.2748,
    },
    {
      fiscalYear: 2016,
      moRate: 0.2342,
      isRate: 0.2511,
    },
    {
      fiscalYear: 2017,
      moRate: 0.2386,
      isRate: 0.2157,
    },
    {
      fiscalYear: 2018,
      moRate: 0.2454,
      isRate: 0.1782,
    },
    {
      fiscalYear: 2019,
      moRate: 0.2229,
      isRate: 0.1792,
    },
    {
      fiscalYear: 2020,
      moRate: 0.21959,
      isRate: 0.1684,
    },
    {
      fiscalYear: 2021,
      moRate: 0.2154,
      isRate: 0.1546,
    },
    {
      fiscalYear: 2022,
      moRate: 0.20542,
      isRate: 0.14458,
    },
    {
      fiscalYear: 2023,
      moRate: 0.172,
      isRate: 0.1205,
    },
    {
      fiscalYear: 2024,
      moRate: 0.167945,
      isRate: 0.1023,
    },
    {
      fiscalYear: 2025,
      moRate: 0.162053,
      isRate: 0.0854,
    },
    {
      fiscalYear: 2026,
      moRate: 0.158156,
      isRate: 0.099344,
    },
  ],
  revenueBySource: {
    property: 24590290,
    sales: 27410743,
    hotel: 1996313,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1.5 },
    { usage: "Economic Development Corporation", percent: 0.5 },
  ],
  latitude: 32.91694,
  longitude: -96.4375,
  area: 22.3,
};
