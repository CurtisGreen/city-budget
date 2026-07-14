import { CityInfo } from "@/lib/types";

export const bedfordInfo: CityInfo = {
  id: "bedford",
  name: "Bedford",
  populations: [
    { year: 1980, value: 20821 },
    { year: 1990, value: 43762 },
    { year: 2000, value: 47152 },
    { year: 2010, value: 46979 },
    { year: 2020, value: 49928 },
    { year: 2025, value: 47958 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.289907,
      isRate: 0.204923,
    },
    {
      fiscalYear: 2016,
      moRate: 0.299332,
      isRate: 0.195498,
    },
    {
      fiscalYear: 2017,
      moRate: 0.303747,
      isRate: 0.172762,
    },
    {
      fiscalYear: 2018,
      moRate: 0.34056,
      isRate: 0.17944,
    },
    {
      fiscalYear: 2019,
      moRate: 0.344135,
      isRate: 0.217727,
    },
    {
      fiscalYear: 2020,
      moRate: 0.384633,
      isRate: 0.184367,
    },
    {
      fiscalYear: 2021,
      moRate: 0.38699,
      isRate: 0.16501,
    },
    {
      fiscalYear: 2022,
      moRate: 0.386990,
      isRate: 0.165010,
    },
    {
      fiscalYear: 2023,
      moRate: 0.367497,
      isRate: 0.128229,
    },
    {
      fiscalYear: 2024,
      moRate: 0.351831,
      isRate: 0.143895,
    },
    {
      fiscalYear: 2025,
      moRate: 0.357859,
      isRate: 0.137867,
    },
    {
      fiscalYear: 2026,
      moRate: 0.380946,
      isRate: 0.145266,
    },
  ],
  revenueBySource: {
    property: 27798175,
    sales: 16511500,
    hotel: 1435955,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "Street Improvement Economic Development Corporation", percent: 0.5 },
    { usage: "Property Tax Reduction", percent: 0.25 },
  ],
  area: 10.03,
  notes: [
    `FY 2021 ACFR: The net position of the City's governmental activities decreased by $10,736,853
    or 27.08%, from $39,646,917 last fiscal year, to $28,910,064 as of September 30, 2021, primarily
    due to an increase in Public Safety expenditures.`,
    `FY 2018 ACFR: the City issued a refunding of $63,920,000 in 2018 General Obligation Bonds and
    issued new debt of $20,000,000 in 2017 Certificates of Obligation Bonds. The total debt
    obligations increased by 51% from $66,390,811 to $141,792,004.`,
  ],
};
