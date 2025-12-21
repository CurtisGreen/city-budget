import { CityInfo } from "@/lib/types";

export const dallasInfo: CityInfo = {
  id: "dallas",
  name: "Dallas",
  population: 1385989,
  populations: [
    { year: 1980, value: 904078 },
    { year: 1990, value: 1006977 },
    { year: 2000, value: 1188580 },
    { year: 2010, value: 1197816 },
    { year: 2020, value: 1304379 },
    { year: 2025, value: 1385989 },
  ],
  propertyTaxRate: 0.79,
  salesTaxBreakdown: [
    { category: "Public Safety", percentage: 35, amount: 450000000 },
    { category: "Transportation", percentage: 25, amount: 320000000 },
    { category: "Parks & Recreation", percentage: 15, amount: 192000000 },
    { category: "Community Services", percentage: 15, amount: 192000000 },
    { category: "Administration", percentage: 10, amount: 128000000 },
  ],
  latitude: 32.779167,
  longitude: -96.808889,
};
