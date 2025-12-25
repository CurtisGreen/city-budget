import { CityInfo } from "@/lib/types";

export const planoInfo: CityInfo = {
  id: "plano",
  name: "Plano",
  population: 299262,
  populations: [
    { year: 1980, value: 72331 },
    { year: 1990, value: 128713 },
    { year: 2000, value: 222030 },
    { year: 2010, value: 259841 },
    { year: 2020, value: 285494 },
    { year: 2025, value: 299262 },
  ],
  propertyTaxRate: 0.5,
  salesTaxBreakdown: [
    { category: "Public Safety", percentage: 38, amount: 95000000 },
    { category: "Transportation", percentage: 28, amount: 70000000 },
    { category: "Parks & Recreation", percentage: 20, amount: 50000000 },
    { category: "Community Services", percentage: 9, amount: 22500000 },
    { category: "Administration", percentage: 5, amount: 12500000 },
  ],
  latitude: 33.050278,
  longitude: -96.698889,
  area: 71.69,
};
