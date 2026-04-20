import { CityInfo } from "@/lib/types";

export const universityParkInfo: CityInfo = {
  id: "university-park",
  name: "University Park",
  population: 25574,
  populations: [
    { year: 1980, value: 22254 },
    { year: 1990, value: 22259 },
    { year: 2000, value: 23324 },
    { year: 2010, value: 23068 },
    { year: 2020, value: 25278 },
    { year: 2025, value: 25574 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.2698,
      isRate: 0.0,
    },
    {
      fiscalYear: 2016,
      moRate: 0.2589,
      isRate: 0.0,
    },
    {
      fiscalYear: 2017,
      moRate: 0.2488,
      isRate: 0.0,
    },
    {
      fiscalYear: 2018,
      moRate: 0.2488,
      isRate: 0.0,
    },
    {
      fiscalYear: 2019,
      moRate: 0.2454,
      isRate: 0.0,
    },
    {
      fiscalYear: 2020,
      moRate: 0.2585,
      isRate: 0.0,
    },
    {
      fiscalYear: 2021,
      moRate: 0.2648,
      isRate: 0.0,
    },
    {
      fiscalYear: 2022,
      moRate: 0.2644,
      isRate: 0.0,
    },
    {
      fiscalYear: 2023,
      moRate: 0.246,
      isRate: 0.0,
    },
    {
      fiscalYear: 2024,
      moRate: 0.2362,
      isRate: 0.0,
    },
    {
      fiscalYear: 2025,
      moRate: 0.229964,
      isRate: 0.0,
    },
    {
      fiscalYear: 2026,
      moRate: 0.218565,
      isRate: 0.0,
    },
  ],
  revenueBySource: {
    property: 24925555,
    sales: 7533753,
    hotel: 0,
  },
  revenues: [
    {
      fiscalYear: 2024,
      property: 24925555,
      sales: 7533753,
      hotel: 0,
    },
    {
      fiscalYear: 2025,
      property: 26791661,
      sales: 7751865,
      hotel: 0,
    },
  ],
  area: 3.69,
  notes: [
    `2025 ACFR: Current resources decilned as the City advanced capital projects.
    Total current and other assets decreased from $88.0 million to $71.4 million, 
    while net capital, lease, and subscription assets increased from $170.4 million to $205.4 million.
    This change reflects the conversion of cash and other current resources into construction in progress
    and completed infrastructure and facility improvements.`,
  ],
};
