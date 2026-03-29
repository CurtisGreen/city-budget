import { CityInfo } from "@/lib/types";

export const garlandInfo: CityInfo = {
  id: "garland",
  name: "Garland",
  population: 251932,
  populations: [
    { year: 1980, value: 138857 },
    { year: 1990, value: 180650 },
    { year: 2000, value: 215768 },
    { year: 2010, value: 226876 },
    { year: 2020, value: 246018 },
    { year: 2025, value: 251932 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.394,
      isRate: 0.3106,
    },
    {
      fiscalYear: 2016,
      moRate: 0.394,
      isRate: 0.3106,
    },
    {
      fiscalYear: 2017,
      moRate: 0.394,
      isRate: 0.3106,
    },
    {
      fiscalYear: 2018,
      moRate: 0.394,
      isRate: 0.3106,
    },
    {
      fiscalYear: 2019,
      moRate: 0.394,
      isRate: 0.3106,
    },
    {
      fiscalYear: 2020,
      moRate: 0.394,
      isRate: 0.3756,
    },
    {
      fiscalYear: 2021,
      moRate: 0.394,
      isRate: 0.3756,
    },
    {
      fiscalYear: 2022,
      moRate: 0.3814,
      isRate: 0.3756,
    },
    {
      fiscalYear: 2023,
      moRate: 0.3411,
      isRate: 0.3756,
    },
    {
      fiscalYear: 2024,
      moRate: 0.3141,
      isRate: 0.3756,
    },
    {
      fiscalYear: 2025,
      moRate: 0.290448,
      isRate: 0.399298,
    },
    {
      fiscalYear: 2026,
      moRate: 0.288657,
      isRate: 0.401089,
    },
  ],
  revenueBySource: {
    property: 163692333,
    sales: 46641936,
    hotel: 1764356,
  },
  revenues: [
    {
      fiscalYear: 2024,
      property: 163692333,
      sales: 46641936,
      hotel: 1764356,
    },
    {
      fiscalYear: 2025,
      property: 182673314,
      sales: 54910882,
      hotel: 1595434,
    },
  ],
  area: 57.13,
  notes: [
    `FY 2025 ACFR: Total Expenses for Governmental Activities increased by $131,143,332 or 38.4%. This increase is mostly attributable to
    pension liability expenses, totaling $107,521,966, associated with the re-instatement of non-retroactive 50% Cost of Living
    Adjustment (COLA) at the City's pension plan in January 2025. This is a non-cash adjusting entry that is anticipated to
    significantly reduce overtime as TMRS actuarial analysis takes into account a $130 million pension bond issued in August,
    2025, to prepay the long-term liability associated with this new benefit.`
  ]
};
