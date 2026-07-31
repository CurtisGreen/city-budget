import { CityInfo } from "@/lib/types";

export const whiteSettlementInfo: CityInfo = {
  id: "white-settlement",
  name: "White Settlement",
  populations: [
    { year: 1980, value: 13508 },
    { year: 1990, value: 15472 },
    { year: 2000, value: 14831 },
    { year: 2010, value: 16116 },
    { year: 2020, value: 18269 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.535754,
      isRate: 0.134899,
    },
    {
      fiscalYear: 2016,
      moRate: 0.579116,
      isRate: 0.153987,
    },
    {
      fiscalYear: 2017,
      moRate: 0.602893,
      isRate: 0.1528,
    },
    {
      fiscalYear: 2018,
      moRate: 0.611219,
      isRate: 0.150908,
    },
    {
      fiscalYear: 2019,
      moRate: 0.612374,
      isRate: 0.149812,
    },
    {
      fiscalYear: 2020,
      moRate: 0.57748,
      isRate: 0.154765,
    },
    {
      fiscalYear: 2021,
      moRate: 0.611145,
      isRate: 0.135055,
    },
    {
      fiscalYear: 2022,
      moRate: 0.616469,
      isRate: 0.125326,
    },
    {
      fiscalYear: 2023,
      moRate: 0.589803,
      isRate: 0.122312,
    },
    {
      fiscalYear: 2024,
      moRate: 0.547855,
      isRate: 0.119378,
    },
    {
      fiscalYear: 2025,
      moRate: 0.551925,
      isRate: 0.127891,
    },
    {
      fiscalYear: 2026,
      moRate: 0.589586,
      isRate: 0.125192,
    },
  ],
  revenueBySource: {
    property: 8413455,
    sales: 6438074,
    hotel: 386338,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "Economic Development Corporation", percent: 0.5 },
    { usage: "Crime Control and Prevention District", percent: 0.5 },
  ],
  area: 5.04,
  notes: [
    `ACFR 2017: "TMRS pension expense increased $3,773,497 due to a change in employee required contributions of 5% to 7% of gross earnings."`,
    `ACFR 2025: "Total expenditures increased $5,165,107 primarily due to the purchase of land."
      [...] "At year-end the City had $33,602,630 in debt outstanding, an increase of $4,884,337 from the prior
      year due to the issuance of Series 2025 Certificates of Obligation as well as annual regular debt service
      payments on outstanding issuances."`,
  ],
};
