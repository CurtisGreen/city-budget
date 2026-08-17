import { CityInfo } from "@/lib/types";

export const forestHillInfo: CityInfo = {
  id: "forest-hill",
  name: "Forest Hill",
  populations: [
    { year: 1980, value: 11684 },
    { year: 1990, value: 11482 },
    { year: 2000, value: 12949 },
    { year: 2010, value: 12355 },
    { year: 2020, value: 13955 },
    { year: 2025, value: 14056 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.864679,
      isRate: 0.195321,
    },
    {
      fiscalYear: 2016,
      moRate: 0.854814,
      isRate: 0.14124,
    },
    {
      fiscalYear: 2017,
      moRate: 0.858873,
      isRate: 0.131127,
    },
    {
      fiscalYear: 2018,
      moRate: 0.878788,
      isRate: 0.111212,
    },
    {
      fiscalYear: 2019,
      moRate: 0.861908,
      isRate: 0.130965,
    },
    {
      fiscalYear: 2020,
      moRate: 0.911303,
      isRate: 0.08157,
    },
    {
      fiscalYear: 2021,
      moRate: 0.921243,
      isRate: 0.076097,
    },
    {
      fiscalYear: 2022,
      moRate: 0.881741,
      isRate: 0.115601,
    },
    {
      fiscalYear: 2023,
      moRate: 0.781775,
      isRate: 0.101045,
    },
    {
      fiscalYear: 2024,
      moRate: 0.724094,
      isRate: 0,
    },
    {
      fiscalYear: 2025,
      moRate: 0.724094,
      isRate: 0,
    },
    {
      fiscalYear: 2026,
      moRate: 0.700466,
      isRate: 0,
    },
  ],
  revenueBySource: {
    property: 6847310,
    sales: 4289259,
    hotel: 625374,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "Community Development Corporation", percent: 0.5 },
    { usage: "Street Improvement", percent: 0.25 },
    { usage: "Library District", percent: 0.25 },
  ],
  area: 4.17,
};
