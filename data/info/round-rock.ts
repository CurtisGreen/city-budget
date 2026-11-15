import { CityInfo } from "@/lib/types";

export const roundRockInfo: CityInfo = {
  id: "round-rock",
  name: "Round Rock",
  category: "Austin Metro",
  populations: [
    { year: 1980, value: 12740 },
    { year: 1990, value: 30923 },
    { year: 2000, value: 61136 },
    { year: 2010, value: 99887 },
    { year: 2020, value: 119468 },
    { year: 2025, value: 141282 },
  ],
  propertyValues: [
    { fiscalYear: 2015, moRate: 0.2628, isRate: 0.1518 },
    { fiscalYear: 2016, moRate: 0.2545, isRate: 0.1602 },
    { fiscalYear: 2017, moRate: 0.2719, isRate: 0.1531 },
    { fiscalYear: 2018, moRate: 0.2879, isRate: 0.1421 },
    { fiscalYear: 2019, moRate: 0.2981, isRate: 0.1219 },
    { fiscalYear: 2020, moRate: 0.3135, isRate: 0.1255 },
    { fiscalYear: 2021, moRate: 0.2963, isRate: 0.1427 },
    { fiscalYear: 2022, moRate: 0.2649, isRate: 0.1321 },
    { fiscalYear: 2023, moRate: 0.2244, isRate: 0.1176 },
    { fiscalYear: 2024, moRate: 0.2385, isRate: 0.1035 },
    { fiscalYear: 2025, moRate: 0.2546, isRate: 0.1054 },
    { fiscalYear: 2026, moRate: 0.256757, isRate: 0.115243 },
  ],
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "Property Tax Reduction", percent: 0.5 },
    {
      usage: "Transportation & Economic Development Corporation",
      percent: 0.5,
    },
  ],
  area: 37.64,
  notes: [
    `FY 2025 ACFR (Net Financial Position): "During the current fiscal year, the City of Round Rock's total debt increased by $91,849,435." [...] "The City also issued $87,520,000 in general obligation bonds, series 2025; $19,620,000 in certificates of obligation bonds, series 2025; and $4,775,000 in limited tax notes, series 2025." [...] "In May 2023, the City of Round Rock's voters authorized the issuance of general obligation bonds to fund capital assets of the general government. Residents approved two bond propositions totaling $274 million for capital projects to improve public safety, parks, recreation, and sports."`,
    `FY 2025 ACFR (External Transfers): "Developers contributed $21.5 million for transportation infrastructure improvements." [...] "Developers contributed $34.2 million for water, wastewater, and stormwater system infrastructure improvements."`,
  ],
};
