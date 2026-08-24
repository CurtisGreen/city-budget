import { CityInfo } from "@/lib/types";

export const princetonInfo: CityInfo = {
  id: "princeton",
  name: "Princeton",
  populations: [
    { year: 1980, value: 3408 },
    { year: 1990, value: 2321 },
    { year: 2000, value: 3477 },
    { year: 2010, value: 6807 },
    { year: 2020, value: 17027 },
    { year: 2025, value: 43524 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.49283,
      isRate: 0.22897,
    },
    {
      fiscalYear: 2016,
      moRate: 0.503901,
      isRate: 0.217899,
    },
    {
      fiscalYear: 2017,
      moRate: 0.461505,
      isRate: 0.230381,
    },
    {
      fiscalYear: 2018,
      moRate: 0.426465,
      isRate: 0.263425,
    },
    {
      fiscalYear: 2019,
      moRate: 0.402494,
      isRate: 0.286326,
    },
    {
      fiscalYear: 2020,
      moRate: 0.394077,
      isRate: 0.282222,
    },
    {
      fiscalYear: 2021,
      moRate: 0.399118,
      isRate: 0.252097,
    },
    {
      fiscalYear: 2022,
      moRate: 0.377315,
      isRate: 0.225234,
    },
    {
      fiscalYear: 2023,
      moRate: 0.31363,
      isRate: 0.220942,
    },
    {
      fiscalYear: 2024,
      moRate: 0.260863,
      isRate: 0.179363,
    },
    {
      fiscalYear: 2025,
      moRate: 0.256657,
      isRate: 0.183569,
    },
    {
      fiscalYear: 2026,
      moRate: 0.254309,
      isRate: 0.185917,
    },
  ],
  revenueBySource: {
    property: 14_521_870,
    sales: 4_037_443,
    hotel: 0,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "Economic Development Corporation", percent: 0.5 },
    { usage: "Community Development Corporation", percent: 0.5 },
  ],
  area: 14.118,
  notes: [
    `FY 2017 ACFR: "Governmental activities increased net position by $7,526,948" [...] "This is due in large part of the capital contribution of infrastructure from developers in the amount of $3,877,269, or 52% of total increase,
    charge for services increased $2,181,850, or 29% of total increase and this is the first year to collect roadway impact fees of $1,430,930 which accounts for 19% of the total increase." [...]
    "Business-type activities increased net position by $8,007,53" [...] "This is due in large part of the capital contribution of infrastructure from developers in the amount of $4,449,124, or 56% of total increase,
    charge for services increased $1,677,285, or 21% of total increase, and utility impact fees increased $1,447,597, or 18% of total increase in net position."`,
  ],
};
