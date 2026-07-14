import { CityInfo } from "@/lib/types";

export const hurstInfo: CityInfo = {
  id: "hurst",
  name: "Hurst",
  populations: [
    { year: 1980, value: 31420 },
    { year: 1990, value: 33574 },
    { year: 2000, value: 36273 },
    { year: 2010, value: 37337 },
    { year: 2020, value: 40413 },
    { year: 2025, value: 38974 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.460829,
      isRate: 0.145171,
    },
    {
      fiscalYear: 2016,
      moRate: 0.474277,
      isRate: 0.136284,
    },
    {
      fiscalYear: 2017,
      moRate: 0.461648,
      isRate: 0.126252,
    },
    {
      fiscalYear: 2018,
      moRate: 0.465042,
      isRate: 0.115898,
    },
    {
      fiscalYear: 2019,
      moRate: 0.471551,
      isRate: 0.108449,
    },
    {
      fiscalYear: 2020,
      moRate: 0.478236,
      isRate: 0.119063,
    },
    {
      fiscalYear: 2021,
      moRate: 0.504186,
      isRate: 0.120973,
    },
    {
      fiscalYear: 2022,
      moRate: 0.516794,
      isRate: 0.108365,
    },
    {
      fiscalYear: 2023,
      moRate: 0.513753,
      isRate: 0.10029,
    },
    {
      fiscalYear: 2024,
      moRate: 0.495572,
      isRate: 0.085578,
    },
    {
      fiscalYear: 2025,
      moRate: 0.50899,
      isRate: 0.082334,
    },
    {
      fiscalYear: 2026,
      moRate: 0.528626,
      isRate: 0.083256,
    },
  ],
  revenueBySource: {
    property: 23090993,
    sales: 24289712,
    hotel: 858190,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "Community Services Development Corporation", percent: 0.5 },
    { usage: "Crime Control District", percent: 0.5 },
  ],
  area: 9.97,
};
