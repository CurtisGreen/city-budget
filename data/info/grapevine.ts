import { CityInfo } from "@/lib/types";

export const grapevineInfo: CityInfo = {
  id: "grapevine",
  name: "Grapevine",
  population: 52346,
  populations: [
    { year: 1980, value: 11801 },
    { year: 1990, value: 29202 },
    { year: 2000, value: 42059 },
    { year: 2010, value: 46334 },
    { year: 2020, value: 50631 },
    { year: 2025, value: 52346 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.1274,
      isRate: 0.205,
    },
    {
      fiscalYear: 2016,
      moRate: 0.1421,
      isRate: 0.1863,
    },
    {
      fiscalYear: 2017,
      moRate: 0.1265,
      isRate: 0.1628,
    },
    {
      fiscalYear: 2018,
      moRate: 0.1347,
      isRate: 0.1545,
    },
    {
      fiscalYear: 2019,
      moRate: 0.1306,
      isRate: 0.1587,
    },
    {
      fiscalYear: 2020,
      moRate: 0.1416,
      isRate: 0.1427,
    },
    {
      fiscalYear: 2021,
      moRate: 0.1435,
      isRate: 0.1391,
    },
    {
      fiscalYear: 2022,
      moRate: 0.1404,
      isRate: 0.1314,
    },
    {
      fiscalYear: 2023,
      moRate: 0.1437,
      isRate: 0.1281,
    },
    {
      fiscalYear: 2024,
      moRate: 0.1363,
      isRate: 0.1142,
    },
    {
      fiscalYear: 2025,
      moRate: 0.131812,
      isRate: 0.109353,
    },
    {
      fiscalYear: 2026,
      moRate: 0.134431,
      isRate: 0.102797,
    },
  ],
  salesTaxBreakdown: [
    { category: "Public Safety", percentage: 42, amount: 147000000 },
    { category: "Transportation", percentage: 24, amount: 84000000 },
    { category: "Parks & Recreation", percentage: 16, amount: 56000000 },
    { category: "Community Services", percentage: 11, amount: 38500000 },
    { category: "Administration", percentage: 7, amount: 24500000 },
  ],
  latitude: 32.935,
  longitude: -97.085833,
  area: 32.14,
};
