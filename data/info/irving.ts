import { CityInfo } from "@/lib/types";

export const irvingInfo: CityInfo = {
  id: "irving",
  name: "Irving",
  population: 266162,
  populations: [
    { year: 1980, value: 109943 },
    { year: 1990, value: 155037 },
    { year: 2000, value: 191615 },
    { year: 2010, value: 216290 },
    { year: 2020, value: 256684 },
    { year: 2025, value: 266162 },
  ],
  propertyTaxRate: 0.72,
  salesTaxBreakdown: [
    { category: "Public Safety", percentage: 42, amount: 147000000 },
    { category: "Transportation", percentage: 24, amount: 84000000 },
    { category: "Parks & Recreation", percentage: 16, amount: 56000000 },
    { category: "Community Services", percentage: 11, amount: 38500000 },
    { category: "Administration", percentage: 7, amount: 24500000 },
  ],
  latitude: 32.816667,
  longitude: -96.95,
  area: 66.98,
};
