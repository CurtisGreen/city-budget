import { CityInfo } from "@/lib/types";

export const fateInfo: CityInfo = {
  id: "fate",
  name: "Fate",
  populations: [
    { year: 1980, value: 263 },
    { year: 1990, value: 475 },
    { year: 2000, value: 497 },
    { year: 2010, value: 6357 },
    { year: 2020, value: 17958 },
    { year: 2025, value: 29007 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.23,
      isRate: 0.0767,
    },
    {
      fiscalYear: 2016,
      moRate: 0.230443,
      isRate: 0.076257,
    },
    {
      fiscalYear: 2017,
      moRate: 0.227165,
      isRate: 0.063935,
    },
    {
      fiscalYear: 2018,
      moRate: 0.21687,
      isRate: 0.07423,
    },
    {
      fiscalYear: 2019,
      moRate: 0.233004,
      isRate: 0.058096,
    },
    {
      fiscalYear: 2020,
      moRate: 0.23805,
      isRate: 0.042606,
    },
    {
      fiscalYear: 2021,
      moRate: 0.230013,
      isRate: 0.043326,
    },
    {
      fiscalYear: 2022,
      moRate: 0.238927,
      isRate: 0.100945,
    },
    {
      fiscalYear: 2023,
      moRate: 0.217065,
      isRate: 0.076767,
    },
    {
      fiscalYear: 2024,
      moRate: 0.202334,
      isRate: 0.061876,
    },
    {
      fiscalYear: 2025,
      moRate: 0.198399,
      isRate: 0.060846,
    },
    {
      fiscalYear: 2026,
      moRate: 0.200765,
      isRate: 0.090104,
    },
  ],
  revenueBySource: {
    property: 7597634,
    sales: 4654781,
    hotel: 0,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1.5 },
    { usage: "Municipal Development District No. 1", percent: 0.5 },
  ],
  area: 11.85,
  notes: [
    `FY 2021 ACFR: "As of September 30, 2021, the City had total long-term debt outstanding of
      $33,601,031, an increase of $17,460,618, or 108.18 percent, from the prior year."
      [...] "During 2021, the City issued General Obligation Bonds, Series 2021 in the amount of
      $16,215,000."`,
  ],
};
