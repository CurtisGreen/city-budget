import { CityInfo } from "@/lib/types";

export const dallasInfo: CityInfo = {
  id: "dallas",
  name: "Dallas",
  population: 1385989,
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
