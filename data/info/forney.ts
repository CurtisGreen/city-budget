import { CityInfo } from "@/lib/types";

export const forneyInfo: CityInfo = {
  id: "forney",
  name: "Forney",
  populations: [
    { year: 1980, value: 2483 },
    { year: 1990, value: 4070 },
    { year: 2000, value: 5588 },
    { year: 2010, value: 14661 },
    { year: 2020, value: 23455 },
    { year: 2025, value: 41658 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.333638,
      isRate: 0.389848,
    },
    {
      fiscalYear: 2016,
      moRate: 0.350398,
      isRate: 0.348085,
    },
    {
      fiscalYear: 2017,
      moRate: 0.338445,
      isRate: 0.312666,
    },
    {
      fiscalYear: 2018,
      moRate: 0.35833,
      isRate: 0.262781,
    },
    {
      fiscalYear: 2019,
      moRate: 0.393237,
      isRate: 0.227874,
    },
    {
      fiscalYear: 2020,
      moRate: 0.380567,
      isRate: 0.199433,
    },
    {
      fiscalYear: 2021,
      moRate: 0.378201,
      isRate: 0.160509,
    },
    {
      fiscalYear: 2022,
      moRate: 0.356015,
      isRate: 0.145054,
    },
    {
      fiscalYear: 2023,
      moRate: 0.311235,
      isRate: 0.123316,
    },
    {
      fiscalYear: 2024,
      moRate: 0.281958,
      isRate: 0.084575,
    },
    {
      fiscalYear: 2025,
      moRate: 0.328509,
      isRate: 0.076731,
    },
    {
      fiscalYear: 2026,
      moRate: 0.350937,
      isRate: 0.070494,
    },
  ],
  revenueBySource: {
    property: 19210348,
    sales: 12356036,
    hotel: 179341,
  },
  revenues: [
    {
      fiscalYear: 2024,
      property: 19210348,
      sales: 12356036,
      hotel: 179341,
    },
    {
      fiscalYear: 2025,
      property: 24464190,
      sales: 12715492,
      hotel: 250765,
    },
  ],
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "Property Tax Reduction", percent: 0.5 },
    { usage: "Economic Development Corporation", percent: 0.25 },
    { usage: "Crime Control and Prevention District", percent: 0.25 },
  ],
  latitude: 32.75194,
  longitude: -96.45583,
  area: 15.8,
  notes: [
    `ACFR 2024: "the City received $25,455,316 of infrastructure donated by developers [...] the City received $18,989,006 in developer contributions in 2024" — developer-donated infrastructure (also $16,863,752 governmental in FY2023) drove the FY2022–2024 surge in external capital contributions and, as newly built low-depreciation assets entered the books, lifted asset life.`,
  ],
};
