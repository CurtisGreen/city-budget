import { CityInfo } from "@/lib/types";

export const friscoInfo: CityInfo = {
  id: "frisco",
  name: "Frisco",
  population: 235615,
  populations: [
    { year: 1980, value: 3420 },
    { year: 1990, value: 6138 },
    { year: 2000, value: 33714 },
    { year: 2010, value: 116989 },
    { year: 2020, value: 200509 },
    { year: 2025, value: 235615 },
  ],
  propertyTaxRate: 0.72,
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.286791,
      isRate: 0.173209,
    },
    {
      fiscalYear: 2016,
      moRate: 0.297064,
      isRate: 0.162936,
    },
    {
      fiscalYear: 2017,
      moRate: 0.294052,
      isRate: 0.155948,
    },
    {
      fiscalYear: 2018,
      moRate: 0.290435,
      isRate: 0.156165,
    },
    {
      fiscalYear: 2019,
      moRate: 0.293367,
      isRate: 0.153233,
    },
    {
      fiscalYear: 2020,
      moRate: 0.29152,
      isRate: 0.15508,
    },
    {
      fiscalYear: 2021,
      moRate: 0.298973,
      isRate: 0.147627,
    },
    {
      fiscalYear: 2022,
      moRate: 0.295215,
      isRate: 0.151385,
    },
    {
      fiscalYear: 2023,
      moRate: 0.290928,
      isRate: 0.155672,
    },
    {
      fiscalYear: 2024,
      moRate: 0.289263,
      isRate: 0.142942,
    },
    {
      fiscalYear: 2025,
      moRate: 0.283406,
      isRate: 0.142111,
    },
    {
      fiscalYear: 2026,
      moRate: 0.292775,
      isRate: 0.132742,
    },
  ],
  salesTaxBreakdown: [
    { category: "Public Safety", percentage: 42, amount: 147000000 },
    { category: "Transportation", percentage: 24, amount: 84000000 },
    { category: "Parks & Recreation", percentage: 16, amount: 56000000 },
    { category: "Community Services", percentage: 11, amount: 38500000 },
    { category: "Administration", percentage: 7, amount: 24500000 },
  ],
  latitude: 33.141667,
  longitude: -96.821667,
  area: 68.64,
};
