import { CityInfo } from "@/lib/types";

export const southlakeInfo: CityInfo = {
  id: "southlake",
  name: "Southlake",
  populations: [
    { year: 1980, value: 2808 },
    { year: 1990, value: 7065 },
    { year: 2000, value: 21519 },
    { year: 2010, value: 26575 },
    { year: 2020, value: 31265 },
    { year: 2025, value: 31175 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.342,
      isRate: 0.12,
    },
    {
      fiscalYear: 2016,
      moRate: 0.362,
      isRate: 0.1,
    },
    {
      fiscalYear: 2017,
      moRate: 0.362,
      isRate: 0.1,
    },
    {
      fiscalYear: 2018,
      moRate: 0.362,
      isRate: 0.1,
    },
    {
      fiscalYear: 2019,
      moRate: 0.357,
      isRate: 0.09,
    },
    {
      fiscalYear: 2020,
      moRate: 0.33,
      isRate: 0.08,
    },
    {
      fiscalYear: 2021,
      moRate: 0.33,
      isRate: 0.075,
    },
    {
      fiscalYear: 2022,
      moRate: 0.325,
      isRate: 0.065,
    },
    {
      fiscalYear: 2023,
      moRate: 0.295,
      isRate: 0.065,
    },
    {
      fiscalYear: 2024,
      moRate: 0.264,
      isRate: 0.055,
    },
    {
      fiscalYear: 2025,
      moRate: 0.25,
      isRate: 0.055,
    },
    {
      fiscalYear: 2026,
      moRate: 0.24,
      isRate: 0.055,
    },
  ],
  revenueBySource: {
    property: 43315203,
    sales: 44830166,
    hotel: 2403888,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "Parks Development Corporation", percent: 0.5 },
    {
      usage: "Community Enhancement and Development Corporation",
      percent: 0.375,
    },
    { usage: "Crime Control and Prevention District", percent: 0.125 },
  ],
  latitude: 32.94667,
  longitude: -97.14528,
  area: 21.83,
};
