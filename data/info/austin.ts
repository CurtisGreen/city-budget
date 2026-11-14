import { CityInfo } from "@/lib/types";

export const austinInfo: CityInfo = {
  id: "austin",
  name: "Austin",
  category: "Austin Metro",
  populations: [
    { year: 1980, value: 345890 },
    { year: 1990, value: 465622 },
    { year: 2000, value: 656562 },
    { year: 2010, value: 790390 },
    { year: 2020, value: 961855 },
    { year: 2025, value: 1002632 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.3691,
      isRate: 0.1118,
    },
    {
      fiscalYear: 2016,
      moRate: 0.3527,
      isRate: 0.1062,
    },
    {
      fiscalYear: 2017,
      moRate: 0.3399,
      isRate: 0.1019,
    },
    {
      fiscalYear: 2018,
      moRate: 0.3393,
      isRate: 0.1055,
    },
    {
      fiscalYear: 2019,
      moRate: 0.3308,
      isRate: 0.1095,
    },
    {
      fiscalYear: 2020,
      moRate: 0.3337,
      isRate: 0.1094,
    },
    {
      fiscalYear: 2021,
      moRate: 0.4209,
      isRate: 0.1126,
    },
    {
      fiscalYear: 2022,
      moRate: 0.428,
      isRate: 0.113,
    },
    {
      fiscalYear: 2023,
      moRate: 0.3669,
      isRate: 0.0958,
    },
    {
      fiscalYear: 2024,
      moRate: 0.3577,
      isRate: 0.0881,
    },
    {
      fiscalYear: 2025,
      moRate: 0.3815,
      isRate: 0.0961,
    },
    {
      fiscalYear: 2026,
      moRate: 0.410282,
      isRate: 0.113735,
    },
  ],
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "Capital Metro", percent: 1 },
  ],
  area: 319.94,
};
