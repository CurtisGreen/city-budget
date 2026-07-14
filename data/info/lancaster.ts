import { CityInfo } from "@/lib/types";

export const lancasterInfo: CityInfo = {
  id: "lancaster",
  name: "Lancaster",
  populations: [
    { year: 1980, value: 14807 },
    { year: 1990, value: 22117 },
    { year: 2000, value: 25894 },
    { year: 2010, value: 36361 },
    { year: 2020, value: 41275 },
    { year: 2025, value: 40526 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.6012,
      isRate: 0.2663,
    },
    {
      fiscalYear: 2016,
      moRate: 0.6012,
      isRate: 0.2663,
    },
    {
      fiscalYear: 2017,
      moRate: 0.6012,
      isRate: 0.2663,
    },
    {
      fiscalYear: 2018,
      moRate: 0.6012,
      isRate: 0.2663,
    },
    {
      fiscalYear: 2019,
      moRate: 0.5952,
      isRate: 0.245725,
    },
    {
      fiscalYear: 2020,
      moRate: 0.605167,
      isRate: 0.214569,
    },
    {
      fiscalYear: 2021,
      moRate: 0.605167,
      isRate: 0.214569,
    },
    {
      fiscalYear: 2022,
      moRate: 0.531384,
      isRate: 0.160438,
    },
    {
      fiscalYear: 2023,
      moRate: 0.484072,
      isRate: 0.154932,
    },
    {
      fiscalYear: 2024,
      moRate: 0.449674,
      isRate: 0.154932,
    },
    {
      fiscalYear: 2025,
      moRate: 0.449674,
      isRate: 0.154932,
    },
    {
      fiscalYear: 2026,
      moRate: 0.420855,
      isRate: 0.178635,
    },
  ],
  revenueBySource: {
    property: 34020989,
    sales: 14491661,
    hotel: 370823,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1.25 },
    { usage: "Recreational Development Corporation", percent: 0.5 },
    { usage: "Economic Development Corporation", percent: 0.25 },
  ],
  area: 33.06,
};
