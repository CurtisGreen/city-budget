import { CityInfo } from "@/lib/types";

export const prosperInfo: CityInfo = {
  id: "prosper",
  name: "Prosper",
  populations: [
    { year: 1980, value: 675 },
    { year: 1990, value: 1018 },
    { year: 2000, value: 2097 },
    { year: 2010, value: 9423 },
    { year: 2020, value: 30174 },
    { year: 2025, value: 45605 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.356301,
      isRate: 0.163699,
    },
    {
      fiscalYear: 2016,
      moRate: 0.361074,
      isRate: 0.1525,
    },
    {
      fiscalYear: 2017,
      moRate: 0.3675,
      isRate: 0.1525,
    },
    {
      fiscalYear: 2018,
      moRate: 0.3675,
      isRate: 0.1525,
    },
    {
      fiscalYear: 2019,
      moRate: 0.3675,
      isRate: 0.1525,
    },
    {
      fiscalYear: 2020,
      moRate: 0.3675,
      isRate: 0.1525,
    },
    {
      fiscalYear: 2021,
      moRate: 0.3675,
      isRate: 0.1525,
    },
    {
      fiscalYear: 2022,
      moRate: 0.328,
      isRate: 0.182,
    },
    {
      fiscalYear: 2023,
      moRate: 0.32983,
      isRate: 0.18017,
    },
    {
      fiscalYear: 2024,
      moRate: 0.332742,
      isRate: 0.177258,
    },
    {
      fiscalYear: 2025,
      moRate: 0.324608,
      isRate: 0.180392,
    },
    {
      fiscalYear: 2026,
      moRate: 0.322054,
      isRate: 0.182946,
    },
  ],
  revenueBySource: {
    property: 45951000,
    sales: 19540000,
    hotel: 0,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "Economic Development Corporation", percent: 0.5 },
    { usage: "Crime Control and Prevention District", percent: 0.25 },
    { usage: "Fire and Emergency Medical Services District", percent: 0.25 },
  ],
  area: 25.23,
  notes: [
    `FY 2018 ACFR: Major capital asset events during the current fiscal year included the following:
    Capital asset acquisitions in governmental activities totaled $30,490[,000]. The majority of this
    activity was funded from bond proceeds and was for streets, parks, and related infrastructure.
    [...] Prior period adjustments in both activities for donated assets of $95.7 million from developers.`,
  ],
};
