import { CityInfo } from "@/lib/types";

export const houstonInfo: CityInfo = {
  id: "houston",
  name: "Houston",
  category: "Houston Metro",
  populations: [
    { year: 1980, value: 1595138 },
    { year: 1990, value: 1630553 },
    { year: 2000, value: 1953631 },
    { year: 2010, value: 2099451 },
    { year: 2020, value: 2304580 },
    { year: 2025, value: 2397315 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.474635,
      isRate: 0.156445,
    },
    {
      fiscalYear: 2016,
      moRate: 0.442194,
      isRate: 0.158926,
    },
    {
      fiscalYear: 2017,
      moRate: 0.454458,
      isRate: 0.131962,
    },
    {
      fiscalYear: 2018,
      moRate: 0.420227,
      isRate: 0.163983,
    },
    {
      fiscalYear: 2019,
      moRate: 0.419242,
      isRate: 0.169068,
    },
    {
      fiscalYear: 2020,
      moRate: 0.404129,
      isRate: 0.163791,
    },
    {
      fiscalYear: 2021,
      moRate: 0.423094,
      isRate: 0.138746,
    },
    {
      fiscalYear: 2022,
      moRate: 0.40247,
      isRate: 0.14836,
    },
    {
      fiscalYear: 2023,
      moRate: 0.385127,
      isRate: 0.148513,
    },
    {
      fiscalYear: 2024,
      moRate: 0.38888,
      isRate: 0.13031,
    },
    {
      fiscalYear: 2025,
      moRate: 0.3786,
      isRate: 0.14059,
    },
    {
      fiscalYear: 2026,
      moRate: 0.403259,
      isRate: 0.115931,
    },
  ],
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "METRO", percent: 1 },
  ],
  area: 640.44,
  notes: [
    `FY 2017 ACFR: "the current year impact of the Pension Reform resulted in a decrease in pension expense by $1.09 billion, part of the total decrease of governmental activities expenses of $1.962 billion."`,
    `FY 2021 ACFR: "The net position of governmental activities increased by $877 million. The increase is primarily attributed to reductions in the pension liability."`,
    `FY 2022 ACFR: "Governmental activities increased the City’s net position from FY2021 by approximately $1.1 billion."`,
  ],
};
