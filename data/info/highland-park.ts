import { CityInfo } from "@/lib/types";

export const highlandParkInfo: CityInfo = {
  id: "highland-park",
  name: "Highland Park",
  population: 8793,
  populations: [
    { year: 1980, value: 8909 },
    { year: 1990, value: 8739 },
    { year: 2000, value: 8842 },
    { year: 2010, value: 8564 },
    { year: 2020, value: 8864 },
    { year: 2025, value: 8793 },
  ],
  salesTaxBreakdown: [
    { category: "Public Safety", percentage: 42, amount: 147000000 },
    { category: "Transportation", percentage: 24, amount: 84000000 },
    { category: "Parks & Recreation", percentage: 16, amount: 56000000 },
    { category: "Community Services", percentage: 11, amount: 38500000 },
    { category: "Administration", percentage: 7, amount: 24500000 },
  ],
  latitude: 32.830278,
  longitude: -96.801111,
  area: 2.24,
};
