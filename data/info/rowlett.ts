import { CityInfo } from "@/lib/types";

export const rowlettInfo: CityInfo = {
  id: "rowlett",
  name: "Rowlett",
  population: 67519,
  populations: [
    { year: 1980, value: 7522 },
    { year: 1990, value: 23260 },
    { year: 2000, value: 44503 },
    { year: 2010, value: 56199 },
    { year: 2020, value: 62535 },
    { year: 2025, value: 67519 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.54977,
      isRate: 0.2374,
    },
    {
      fiscalYear: 2016,
      moRate: 0.57792,
      isRate: 0.20925,
    },
    {
      fiscalYear: 2017,
      moRate: 0.55117,
      isRate: 0.236,
    },
    {
      fiscalYear: 2018,
      moRate: 0.55119,
      isRate: 0.22598,
    },
    {
      fiscalYear: 2019,
      moRate: 0.53113,
      isRate: 0.22604,
    },
    {
      fiscalYear: 2020,
      moRate: 0.53756,
      isRate: 0.21961,
    },
    {
      fiscalYear: 2021,
      moRate: 0.52469,
      isRate: 0.22031,
    },
    {
      fiscalYear: 2022,
      moRate: 0.53854,
      isRate: 0.20646,
    },
    {
      fiscalYear: 2023,
      moRate: 0.52579,
      isRate: 0.15522,
    },
    {
      fiscalYear: 2024,
      moRate: 0.53134,
      isRate: 0.17906,
    },
    {
      fiscalYear: 2025,
      moRate: 0.531341,
      isRate: 0.23835,
    },
    {
      fiscalYear: 2026,
      moRate: 0.538841,
      isRate: 0.26905,
    },
  ],
  revenueBySource: {
    property: 55175000,
    sales: 9809000,
    hotel: 69515,
  },
  latitude: 32.902778,
  longitude: -96.544444,
  area: 20.748,
  notes: [
    `FY 2020 ACFR: In Program Revenues, capital grants and contributions also realized an increase of $13.5 million primarily due to developer contributions 
    for construction related to TIRZ#2 North (Bayside), Magnolia Landing, Northhaven Phase 2 and various other projects.`,
  ],
};
