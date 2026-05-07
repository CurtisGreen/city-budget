import { CityInfo } from "@/lib/types";

export const cedarHillInfo: CityInfo = {
  id: "cedar-hill",
  name: "Cedar Hill",
  population: 51784,
  populations: [
    { year: 1980, value: 6849 },
    { year: 1990, value: 19976 },
    { year: 2000, value: 32093 },
    { year: 2010, value: 45028 },
    { year: 2020, value: 49148 },
    { year: 2025, value: 51784 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.5127,
      isRate: 0.18606,
    },
    {
      fiscalYear: 2016,
      moRate: 0.5127,
      isRate: 0.18606,
    },
    {
      fiscalYear: 2017,
      moRate: 0.5127,
      isRate: 0.18606,
    },
    {
      fiscalYear: 2018,
      moRate: 0.5127,
      isRate: 0.18606,
    },
    {
      fiscalYear: 2019,
      moRate: 0.512935,
      isRate: 0.184093,
    },
    {
      fiscalYear: 2020,
      moRate: 0.512935,
      isRate: 0.184093,
    },
    {
      fiscalYear: 2021,
      moRate: 0.518071,
      isRate: 0.170031,
    },
    {
      fiscalYear: 2022,
      moRate: 0.518152,
      isRate: 0.178877,
    },
    {
      fiscalYear: 2023,
      moRate: 0.480563,
      isRate: 0.176437,
    },
    {
      fiscalYear: 2024,
      moRate: 0.462656,
      isRate: 0.183869,
    },
    {
      fiscalYear: 2025,
      moRate: 0.452711,
      isRate: 0.183744,
    },
    {
      fiscalYear: 2026,
      moRate: 0.451879,
      isRate: 0.18457,
    },
  ],
  revenueBySource: {
    property: 40413522,
    sales: 12808093,
    hotel: 459215,
  },
  revenues: [
    {
      fiscalYear: 2024,
      property: 40413522,
      sales: 12808093,
      hotel: 459215,
    },
    {
      fiscalYear: 2025,
      property: 44172965,
      sales: 12978718,
      hotel: 493006,
    },
  ],
  area: 35.79,
  notes: [
    `FY 2023 ACFR: The City's non-current liabilities increased by $32,499,336 or 26% 
    which is attributed to the increase in the issuance of certificates of obligations 
    and a significant increase in the Net Pension Liability.`,
  ],
};
