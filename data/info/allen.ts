import { CityInfo } from "@/lib/types";

export const allenInfo: CityInfo = {
  id: "allen",
  name: "Allen",
  population: 107328,
  populations: [
    { year: 1980, value: 8314 },
    { year: 1990, value: 18309 },
    { year: 2000, value: 43554 },
    { year: 2010, value: 84246 },
    { year: 2020, value: 104627 },
    { year: 2025, value: 107328 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.39836,
      isRate: 0.14164,
    },
    {
      fiscalYear: 2016,
      moRate: 0.40627,
      isRate: 0.12373,
    },
    {
      fiscalYear: 2017,
      moRate: 0.39627,
      isRate: 0.12373,
    },
    {
      fiscalYear: 2018,
      moRate: 0.39274,
      isRate: 0.11726,
    },
    {
      fiscalYear: 2019,
      moRate: 0.39346,
      isRate: 0.10454,
    },
    {
      fiscalYear: 2020,
      moRate: 0.38704,
      isRate: 0.10196,
    },
    {
      fiscalYear: 2021,
      moRate: 0.39052,
      isRate: 0.09448,
    },
    {
      fiscalYear: 2022,
      moRate: 0.36876,
      isRate: 0.10124,
    },
    {
      fiscalYear: 2023,
      moRate: 0.3307,
      isRate: 0.0905,
    },
    {
      fiscalYear: 2024,
      moRate: 0.32315,
      isRate: 0.09735,
    },
    {
      fiscalYear: 2025,
      moRate: 0.320531,
      isRate: 0.096969,
    },
    {
      fiscalYear: 2026,
      moRate: 0.317804,
      isRate: 0.097596,
    },
  ],
  revenueBySource: {
    property: 83821874,
    sales: 31547688,
    hotel: 2481874,
  },
  area: 26.4,
  notes: [
    `FY 2023 ACFR: Capital grants and contributions decreased by $9,486,145 (85%) with lower construction activities.`,
  ],
};
