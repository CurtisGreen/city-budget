import { CityInfo } from "@/lib/types";

export const arlingtonInfo: CityInfo = {
  id: "arlington",
  name: "Arlington",
  population: 413955,
  populations: [
    { year: 1980, value: 160113 },
    { year: 1990, value: 261721 },
    { year: 2000, value: 332969 },
    { year: 2010, value: 365438 },
    { year: 2020, value: 394266 },
    { year: 2025, value: 413955 },
  ],
  propertyTaxRate: 0.72,
  salesTaxBreakdown: [
    { category: "Public Safety", percentage: 42, amount: 147000000 },
    { category: "Transportation", percentage: 24, amount: 84000000 },
    { category: "Parks & Recreation", percentage: 16, amount: 56000000 },
    { category: "Community Services", percentage: 11, amount: 38500000 },
    { category: "Administration", percentage: 7, amount: 24500000 },
  ],
  latitude: 32.705,
  longitude: -97.122778,
  area: 95.84,
};
