import { CityInfo } from "@/lib/types";

export const bellaireInfo: CityInfo = {
  id: "bellaire",
  name: "Bellaire",
  category: "Houston Metro",
  populations: [
    { year: 1980, value: 14950 },
    { year: 1990, value: 13842 },
    { year: 2000, value: 15642 },
    { year: 2010, value: 16855 },
    { year: 2020, value: 17202 },
    { year: 2025, value: 17434 },
  ],
  propertyValues: [
    { fiscalYear: 2015, moRate: 0.2532, isRate: 0.1404 },
    { fiscalYear: 2016, moRate: 0.2501, isRate: 0.1304 },
    { fiscalYear: 2017, moRate: 0.2551, isRate: 0.1323 },
    { fiscalYear: 2018, moRate: 0.2678, isRate: 0.1481 },
    { fiscalYear: 2019, moRate: 0.2781, isRate: 0.1532 },
    { fiscalYear: 2020, moRate: 0.2905, isRate: 0.1568 },
    { fiscalYear: 2021, moRate: 0.2915, isRate: 0.1558 },
    { fiscalYear: 2022, moRate: 0.2959, isRate: 0.1514 },
    { fiscalYear: 2023, moRate: 0.3036, isRate: 0.1437 },
    { fiscalYear: 2024, moRate: 0.301, isRate: 0.136 },
    { fiscalYear: 2025, moRate: 0.3034, isRate: 0.1299 },
    { fiscalYear: 2026, moRate: 0.3036, isRate: 0.1138 },
  ],
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "METRO", percent: 1 },
  ],
  area: 3.6,
  notes: [
    `FY 2022 ACFR: "The increase in operating grants and contributions was the result of the non-recurring $4.7 million of ARPA grant revenues recognized in fiscal year 2022."`,
  ],
};
