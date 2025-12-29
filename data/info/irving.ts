import { CityInfo } from "@/lib/types";

export const irvingInfo: CityInfo = {
  id: "irving",
  name: "Irving",
  population: 266162,
  populations: [
    { year: 1980, value: 109943 },
    { year: 1990, value: 155037 },
    { year: 2000, value: 191615 },
    { year: 2010, value: 216290 },
    { year: 2020, value: 256684 },
    { year: 2025, value: 266162 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.4518,
      isRate: 0.1423,
    },
    {
      fiscalYear: 2016,
      moRate: 0.465,
      isRate: 0.13,
    },
    {
      fiscalYear: 2017,
      moRate: 0.4641,
      isRate: 0.1291,
    },
    {
      fiscalYear: 2018,
      moRate: 0.465,
      isRate: 0.1291,
    },
    {
      fiscalYear: 2019,
      moRate: 0.4741,
      isRate: 0.12,
    },
    {
      fiscalYear: 2020,
      moRate: 0.4741,
      isRate: 0.12,
    },
    {
      fiscalYear: 2021,
      moRate: 0.4741,
      isRate: 0.12,
    },
    {
      fiscalYear: 2022,
      moRate: 0.4641,
      isRate: 0.13,
    },
    {
      fiscalYear: 2023,
      moRate: 0.4294,
      isRate: 0.1597,
    },
    {
      fiscalYear: 2024,
      moRate: 0.4294,
      isRate: 0.1597,
    },
    {
      fiscalYear: 2025,
      moRate: 0.4294,
      isRate: 0.1597,
    },
    {
      fiscalYear: 2026,
      moRate: 0.4294,
      isRate: 0.1597,
    },
  ],
  salesTaxBreakdown: [
    { category: "Public Safety", percentage: 42, amount: 147000000 },
    { category: "Transportation", percentage: 24, amount: 84000000 },
    { category: "Parks & Recreation", percentage: 16, amount: 56000000 },
    { category: "Community Services", percentage: 11, amount: 38500000 },
    { category: "Administration", percentage: 7, amount: 24500000 },
  ],
  latitude: 32.816667,
  longitude: -96.95,
  area: 66.98,
};
