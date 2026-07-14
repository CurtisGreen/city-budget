import { CityInfo } from "@/lib/types";

export const theColonyInfo: CityInfo = {
  id: "the-colony",
  name: "The Colony",
  populations: [
    { year: 1980, value: 11586 },
    { year: 1990, value: 22113 },
    { year: 2000, value: 26531 },
    { year: 2010, value: 36328 },
    { year: 2020, value: 44534 },
    { year: 2025, value: 46196 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.4763,
      isRate: 0.1962,
    },
    {
      fiscalYear: 2016,
      moRate: 0.5104,
      isRate: 0.1596,
    },
    {
      fiscalYear: 2017,
      moRate: 0.5642,
      isRate: 0.1033,
    },
    {
      fiscalYear: 2018,
      moRate: 0.515,
      isRate: 0.15,
    },
    {
      fiscalYear: 2019,
      moRate: 0.5025,
      isRate: 0.16,
    },
    {
      fiscalYear: 2020,
      moRate: 0.4955,
      isRate: 0.1645,
    },
    {
      fiscalYear: 2021,
      moRate: 0.495,
      isRate: 0.16,
    },
    {
      fiscalYear: 2022,
      moRate: 0.49,
      isRate: 0.16,
    },
    {
      fiscalYear: 2023,
      moRate: 0.54,
      isRate: 0.105,
    },
    {
      fiscalYear: 2024,
      moRate: 0.4812,
      isRate: 0.1538,
    },
    {
      fiscalYear: 2025,
      moRate: 0.481191,
      isRate: 0.153809,
    },
    {
      fiscalYear: 2026,
      moRate: 0.48134,
      isRate: 0.14866,
    },
  ],
  revenueBySource: {
    property: 30133000,
    sales: 29310000,
    hotel: 1656000,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "Economic Development Corporation", percent: 0.5 },
    { usage: "Community Development Corporation", percent: 0.5 },
  ],
  area: 14.01,
  notes: [
    `FY 2025 ACFR: The capital projects fund had an increase in fund balance of $51.16 million due
    primarily to the receipt of debt proceeds. [...] At the end of the current fiscal year, the City
    had total bonded debt outstanding of $174,825,000.`,
  ],
};
