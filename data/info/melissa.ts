import { CityInfo } from "@/lib/types";

export const melissaInfo: CityInfo = {
  id: "melissa",
  name: "Melissa",
  populations: [
    { year: 1980, value: 604 },
    { year: 1990, value: 557 },
    { year: 2000, value: 1350 },
    { year: 2010, value: 4695 },
    { year: 2020, value: 13901 },
    { year: 2025, value: 29969 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.463642,
      isRate: 0.146358,
    },
    {
      fiscalYear: 2016,
      moRate: 0.47891,
      isRate: 0.13109,
    },
    {
      fiscalYear: 2017,
      moRate: 0.462173,
      isRate: 0.147827,
    },
    {
      fiscalYear: 2018,
      moRate: 0.457305,
      isRate: 0.152695,
    },
    {
      fiscalYear: 2019,
      moRate: 0.441232,
      isRate: 0.168309,
    },
    {
      fiscalYear: 2020,
      moRate: 0.460931,
      isRate: 0.14861,
    },
    {
      fiscalYear: 2021,
      moRate: 0.456352,
      isRate: 0.152886,
    },
    {
      fiscalYear: 2022,
      moRate: 0.431031,
      isRate: 0.137126,
    },
    {
      fiscalYear: 2023,
      moRate: 0.357805,
      isRate: 0.098363,
    },
    {
      fiscalYear: 2024,
      moRate: 0.327056,
      isRate: 0.127672,
    },
    {
      fiscalYear: 2025,
      moRate: 0.3183,
      isRate: 0.135816,
    },
    {
      fiscalYear: 2026,
      moRate: 0.318088,
      isRate: 0.136028,
    },
  ],
  revenueBySource: {
    property: 14_680_643,
    sales: 4_553_482,
    hotel: 0,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "Community & Economic Development Corporation", percent: 0.5 },
    { usage: "Crime Control & Prevention District", percent: 0.25 },
    {
      usage:
        "Fire Control, Prevention, and Emergency Medical Services District",
      percent: 0.25,
    },
  ],
  area: 11.45,
  notes: [
    `FY 2022 ACFR (Asset Life): "Total capital assets increased by $95,795,968 due to the investment in several major ongoing capital projects and developer donated infrastructure" [...] "the City determined that infrastructure was understated at the beginning of the year due to capital assets developers contributed to the City not being reported in the statement of net position"`,
  ],
};
