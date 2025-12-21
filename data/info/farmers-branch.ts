import { CityInfo } from "@/lib/types";

export const farmersBranchInfo: CityInfo = {
  id: "farmers-branch",
  name: "Farmers Branch",
  population: 40246,
  populations: [
    { year: 1980, value: 24863 },
    { year: 1990, value: 24250 },
    { year: 2000, value: 27508 },
    { year: 2010, value: 28616 },
    { year: 2020, value: 35991 },
    { year: 2025, value: 40246 },
  ],
  propertyTaxRate: 0.72,
  salesTaxBreakdown: [
    { category: "Public Safety", percentage: 42, amount: 147000000 },
    { category: "Transportation", percentage: 24, amount: 84000000 },
    { category: "Parks & Recreation", percentage: 16, amount: 56000000 },
    { category: "Community Services", percentage: 11, amount: 38500000 },
    { category: "Administration", percentage: 7, amount: 24500000 },
  ],
  latitude: 32.927222,
  longitude: -96.863889,
};
