import { CityInfo } from "@/lib/types";

export const desotoInfo: CityInfo = {
  id: "desoto",
  name: "DeSoto",
  populations: [
    { year: 1980, value: 15538 },
    { year: 1990, value: 30544 },
    { year: 2000, value: 37646 },
    { year: 2010, value: 49047 },
    { year: 2020, value: 56145 },
    { year: 2025, value: 56681 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.5303,
      isRate: 0.2271,
    },
    {
      fiscalYear: 2016,
      moRate: 0.5249,
      isRate: 0.225,
    },
    {
      fiscalYear: 2017,
      moRate: 0.5349,
      isRate: 0.21,
    },
    {
      fiscalYear: 2018,
      moRate: 0.54,
      isRate: 0.1999,
    },
    {
      fiscalYear: 2019,
      moRate: 0.55,
      isRate: 0.17139,
    },
    {
      fiscalYear: 2020,
      moRate: 0.55016,
      isRate: 0.15139,
    },
    {
      fiscalYear: 2021,
      moRate: 0.55016,
      isRate: 0.15139,
    },
    {
      fiscalYear: 2022,
      moRate: 0.55016,
      isRate: 0.15139,
    },
    {
      fiscalYear: 2023,
      moRate: 0.54425,
      isRate: 0.14731,
    },
    {
      fiscalYear: 2024,
      moRate: 0.50349,
      isRate: 0.18161,
    },
    {
      fiscalYear: 2025,
      moRate: 0.50393,
      isRate: 0.181,
    },
    {
      fiscalYear: 2026,
      moRate: 0.502392,
      isRate: 0.182542,
    },
  ],
  revenueBySource: {
    property: 48642710,
    sales: 11665423,
    hotel: 1346468,
  },
  revenues: [
    {
      fiscalYear: 2024,
      property: 48642710,
      sales: 11665423,
      hotel: 1346468,
    },
    {
      fiscalYear: 2025,
      property: 51451919,
      sales: 11723283,
      hotel: 1424966,
    },
  ],
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "Property Tax Abatement", percent: 0.5 },
    { usage: "Economic Development Corporation", percent: 0.375 },
    { usage: "Park Development Corporation", percent: 0.125 },
  ],
  area: 21.63,
};
