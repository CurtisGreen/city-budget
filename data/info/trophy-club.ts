import { CityInfo } from "@/lib/types";

export const trophyClubInfo: CityInfo = {
  id: "trophy-club",
  name: "Trophy Club",
  populations: [
    { year: 1990, value: 3922 },
    { year: 2000, value: 6350 },
    { year: 2010, value: 8024 },
    { year: 2020, value: 13688 },
    { year: 2025, value: 13695 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.38,
      isRate: 0.11,
    },
    {
      fiscalYear: 2016,
      moRate: 0.374,
      isRate: 0.11,
    },
    {
      fiscalYear: 2017,
      moRate: 0.363,
      isRate: 0.11,
    },
    {
      fiscalYear: 2018,
      moRate: 0.341442,
      isRate: 0.11,
    },
    {
      fiscalYear: 2019,
      moRate: 0.336442,
      isRate: 0.11,
    },
    {
      fiscalYear: 2020,
      moRate: 0.336442,
      isRate: 0.11,
    },
    {
      fiscalYear: 2021,
      moRate: 0.336442,
      isRate: 0.11,
    },
    {
      fiscalYear: 2022,
      moRate: 0.335,
      isRate: 0.099799,
    },
    {
      fiscalYear: 2023,
      moRate: 0.31567,
      isRate: 0.099799,
    },
    {
      fiscalYear: 2024,
      moRate: 0.31567,
      isRate: 0.099799,
    },
    {
      fiscalYear: 2025,
      moRate: 0.316042,
      isRate: 0.099427,
    },
    {
      fiscalYear: 2026,
      moRate: 0.309764,
      isRate: 0.1031,
    },
  ],
  revenueBySource: {
    property: 11858764,
    sales: 2630932,
    hotel: 885378,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "Economic Development Corporation 4B", percent: 0.5 },
    { usage: "Street Maintenance", percent: 0.25 },
    { usage: "Crime Control and Prevention District", percent: 0.25 },
  ],
  notes: [
    `ACFR 2019: "The Town restated beginning net position/fund balance within governmental
     activities and discretely present component unit activities to correct accounting errors
     related to accrued receivables and capital assets. In addition, the Crime Control and
     Prevention fund was reclassified from a nonmajor governmental fund to a discretely
     presented component unit." [...] "Correct reporting of assessment receivables 25,285,577"`,
  ],
  area: 3.98,
};
