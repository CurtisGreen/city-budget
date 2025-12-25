import { CityInfo } from "@/lib/types";

export const richardsonInfo: CityInfo = {
  id: "richardson",
  name: "Richardson",
  population: 122745,
  populations: [
    { year: 1980, value: 72496 },
    { year: 1990, value: 74840 },
    { year: 2000, value: 91802 },
    { year: 2010, value: 99223 },
    { year: 2020, value: 119469 },
    { year: 2025, value: 122745 },
  ],
  propertyTaxRate: 0.72,
  salesTaxBreakdown: [
    { category: "Public Safety", percentage: 42, amount: 147000000 },
    { category: "Transportation", percentage: 24, amount: 84000000 },
    { category: "Parks & Recreation", percentage: 16, amount: 56000000 },
    { category: "Community Services", percentage: 11, amount: 38500000 },
    { category: "Administration", percentage: 7, amount: 24500000 },
  ],
  latitude: 32.991667,
  longitude: -96.703889,
  area: 28.57,
};
