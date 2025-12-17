import { CityInfo } from "@/lib/types";

export const grapevineInfo: CityInfo = {
  id: "grapevine",
  name: "Grapevine",
  population: 52346,
  propertyTaxRate: 0.72,
  salesTaxBreakdown: [
    { category: "Public Safety", percentage: 42, amount: 147000000 },
    { category: "Transportation", percentage: 24, amount: 84000000 },
    { category: "Parks & Recreation", percentage: 16, amount: 56000000 },
    { category: "Community Services", percentage: 11, amount: 38500000 },
    { category: "Administration", percentage: 7, amount: 24500000 },
  ],
  latitude: 32.935,
  longitude: -97.085833,
};
