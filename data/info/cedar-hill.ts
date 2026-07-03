import { CityInfo } from "@/lib/types";

export const cedarHillInfo: CityInfo = {
  id: "cedar-hill",
  name: "Cedar Hill",
  populations: [
    { year: 1980, value: 6849 },
    { year: 1990, value: 19976 },
    { year: 2000, value: 32093 },
    { year: 2010, value: 45028 },
    { year: 2020, value: 49148 },
    { year: 2025, value: 49801 },
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
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "Community Development Corporation", percent: 0.5 },
    { usage: "Economic Development Corporation", percent: 0.375 },
    { usage: "Crime Control Prevention District", percent: 0.125 },
  ],
  area: 35.79,
  notes: [
    `FY 2023 ACFR: The City's non-current liabilities increased by $32,499,336 or 26%
    which is attributed to the increase in the issuance of certificates of obligations
    and a significant increase in the Net Pension Liability.`,
    `FY 2017 ACFR: The City's total long-term liabilities of $99,809,596 decreased by $90,981,405
    or 48% during the fiscal year. The City did not issue any new bonded debt during the fiscal
    year 2017. Total bonded debt decreased by $7,595,000 and the Joe Pool Contract liability of
    $82,683,592 was 100% eliminated. On December 16, 2016, the City wired funds to TRA in the
    amount $40,543,911 in full satisfaction of its contractual obligation relating to Joe Pool Lake.`,
  ],
};
