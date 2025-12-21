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
  propertyTaxRate: 0.72,
  salesTaxBreakdown: [
    { category: "Public Safety", percentage: 42, amount: 147000000 },
    { category: "Transportation", percentage: 24, amount: 84000000 },
    { category: "Parks & Recreation", percentage: 16, amount: 56000000 },
    { category: "Community Services", percentage: 11, amount: 38500000 },
    { category: "Administration", percentage: 7, amount: 24500000 },
  ],
  latitude: 32.902778,
  longitude: -96.544444,
};
