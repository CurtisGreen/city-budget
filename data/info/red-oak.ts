import { CityInfo } from "@/lib/types";

export const redOakInfo: CityInfo = {
  id: "red-oak",
  name: "Red Oak",
  populations: [
    { year: 1980, value: 1882 },
    { year: 1990, value: 3124 },
    { year: 2000, value: 4301 },
    { year: 2010, value: 10769 },
    { year: 2020, value: 14222 },
    { year: 2025, value: 20394 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.5445,
      isRate: 0.1045,
    },
    {
      fiscalYear: 2016,
      moRate: 0.5443,
      isRate: 0.1047,
    },
    {
      fiscalYear: 2017,
      moRate: 0.5443,
      isRate: 0.1047,
    },
    {
      fiscalYear: 2018,
      moRate: 0.5418,
      isRate: 0.1072,
    },
    {
      fiscalYear: 2019,
      moRate: 0.5497,
      isRate: 0.15578,
    },
    {
      fiscalYear: 2020,
      moRate: 0.539203,
      isRate: 0.164442,
    },
    {
      fiscalYear: 2021,
      moRate: 0.549873,
      isRate: 0.153772,
    },
    {
      fiscalYear: 2022,
      moRate: 0.549874,
      isRate: 0.153771,
    },
    {
      fiscalYear: 2023,
      moRate: 0.481043,
      isRate: 0.216421,
    },
    {
      fiscalYear: 2024,
      moRate: 0.440465,
      isRate: 0.256421,
    },
    {
      fiscalYear: 2025,
      moRate: 0.458991,
      isRate: 0.237895,
    },
    {
      fiscalYear: 2026,
      moRate: 0.457028,
      isRate: 0.238278,
    },
  ],
  revenueBySource: {
    property: 16693539,
    sales: 8548167,
    hotel: 390824,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "Industrial Development Corporation", percent: 0.5 },
    { usage: "Economic Development Corporation", percent: 0.5 },
  ],
  area: 15.37,
  notes: [
    `FY 2020 ACFR: "On a government-wide basis, the City's total net position increased by $13,862,795. This increase is attributable largely to capital grants and contributions of $3.5 million and the sale of land held for sale in the Industrial Development Corporation in the amount of $7.5 million."`,
    `FY 2022 ACFR: "The net increase in fund balance during the current year in the Industrial Development Corporation fund was $28,163,284 and mostly attributable to the sale of land for economic development purposes and the issuance of revenue and refunding bonds."`,
  ],
};
