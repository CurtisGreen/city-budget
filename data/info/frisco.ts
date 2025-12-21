import { CityInfo } from "@/lib/types";

export const friscoInfo: CityInfo = {
  id: "frisco",
  name: "Frisco",
  population: 235615,
  populations: [
    { year: 1980, value: 3420 },
    { year: 1990, value: 6138 },
    { year: 2000, value: 33714 },
    { year: 2010, value: 116989 },
    { year: 2020, value: 200509 },
    { year: 2025, value: 235615 },
  ],
  propertyTaxRate: 0.72,
  salesTaxBreakdown: [
    { category: "Public Safety", percentage: 42, amount: 147000000 },
    { category: "Transportation", percentage: 24, amount: 84000000 },
    { category: "Parks & Recreation", percentage: 16, amount: 56000000 },
    { category: "Community Services", percentage: 11, amount: 38500000 },
    { category: "Administration", percentage: 7, amount: 24500000 },
  ],
  latitude: 33.141667,
  longitude: -96.821667,
};
