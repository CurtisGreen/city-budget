import { CityInfo } from "@/lib/types";

export const burlesonInfo: CityInfo = {
  id: "burleson",
  name: "Burleson",
  populations: [
    { year: 1980, value: 11734 },
    { year: 1990, value: 16113 },
    { year: 2000, value: 20976 },
    { year: 2010, value: 36690 },
    { year: 2020, value: 47641 },
    { year: 2020, value: 56907 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.5278,
      isRate: 0.2122,
    },
    {
      fiscalYear: 2016,
      moRate: 0.5278,
      isRate: 0.2122,
    },
    {
      fiscalYear: 2017,
      moRate: 0.5228,
      isRate: 0.2122,
    },
    {
      fiscalYear: 2018,
      moRate: 0.5228,
      isRate: 0.2122,
    },
    {
      fiscalYear: 2019,
      moRate: 0.5228,
      isRate: 0.2122,
    },
    {
      fiscalYear: 2020,
      moRate: 0.5106,
      isRate: 0.2094,
    },
    {
      fiscalYear: 2021,
      moRate: 0.5187,
      isRate: 0.1924,
    },
    {
      fiscalYear: 2022,
      moRate: 0.4974,
      isRate: 0.1885,
    },
    {
      fiscalYear: 2023,
      moRate: 0.4649,
      isRate: 0.1923,
    },
    {
      fiscalYear: 2024,
      moRate: 0.4402,
      isRate: 0.1923,
    },
    {
      fiscalYear: 2025,
      moRate: 0.4704,
      isRate: 0.1923,
    },
    {
      fiscalYear: 2026,
      moRate: 0.4933,
      isRate: 0.2285,
    },
  ],
  revenueBySource: {
    property: 37912361,
    sales: 30091181,
    hotel: 610872,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "Community Services Development Corporation", percent: 0.5 },
    { usage: "4A Economic Development Corporation", percent: 0.5 },
  ],
  area: 28.25,
  notes: [
    `FY 2023 ACFR: "The City's total debt increased by $27,565,000 during the current fiscal year.
     The increase represents the net effect of scheduled debt retirement and issuance of Series 2023
     Combination Tax and Revenue Certificates of Obligation and Series 2023 General Obligation Bonds
     in the current year." [...] "The Bond Funded Capital Projects fund increased by $9,360,228
     finishing the year at $25,598,738. This is due to the issuance of $31,770,000 of bonds offset
     with capital expenditures."`,
  ],
};
