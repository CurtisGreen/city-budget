import { CityInfo } from "@/lib/types";

export const fairviewInfo: CityInfo = {
  id: "fairview",
  name: "Fairview",
  populations: [
    { year: 1980, value: 893 },
    { year: 1990, value: 1554 },
    { year: 2000, value: 2644 },
    { year: 2010, value: 7248 },
    { year: 2020, value: 10372 },
    { year: 2025, value: 10913 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.221733,
      isRate: 0.138266,
    },
    {
      fiscalYear: 2016,
      moRate: 0.225858,
      isRate: 0.134141,
    },
    {
      fiscalYear: 2017,
      moRate: 0.227856,
      isRate: 0.132143,
    },
    {
      fiscalYear: 2018,
      moRate: 0.231409,
      isRate: 0.12859,
    },
    {
      fiscalYear: 2019,
      moRate: 0.227424,
      isRate: 0.122285,
    },
    {
      fiscalYear: 2020,
      moRate: 0.23018,
      isRate: 0.116976,
    },
    {
      fiscalYear: 2021,
      moRate: 0.240342,
      isRate: 0.106814,
    },
    {
      fiscalYear: 2022,
      moRate: 0.245536,
      isRate: 0.100044,
    },
    {
      fiscalYear: 2023,
      moRate: 0.238407,
      isRate: 0.08317,
    },
    {
      fiscalYear: 2024,
      moRate: 0.2342,
      isRate: 0.077483,
    },
    {
      fiscalYear: 2025,
      moRate: 0.232798,
      isRate: 0.077483,
    },
    {
      fiscalYear: 2026,
      moRate: 0.239175,
      isRate: 0.077483,
    },
  ],
  revenueBySource: {
    property: 9447921,
    sales: 2138552,
    hotel: 250076,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "Economic Development Corporation", percent: 0.5 },
    { usage: "Community Development Corporation", percent: 0.5 },
  ],
  area: 8.87,
  notes: [
    `FY 2025 ACFR: "The government’s total net position increased by $12,941,587.
      This was due to a net increase in revenues over expenses in 2025, mostly from capital related
      grants and contributions received in fiscal year 2025." [...] "Capital grants and contributions
      increased $8,239,470 due to intergovernmental revenue received for capital projects in fiscal
      year 2025."`,
  ],
};
