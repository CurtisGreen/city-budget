import type { CityData } from "./types";
import { readACFR } from "./csv-processor";
import { calculateACFRMetrics } from "./format-acfr-data";

// Mock data for Dallas area cities
export const mockCitiesData: CityData[] = [
  {
    info: {
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
      latitude: 32.7767,
      longitude: -96.797,
    },
    financialData: [],
    metrics: [],
  },
  {
    info: {
      id: "plano",
      name: "Plano",
      population: 299262,
      propertyTaxRate: 0.5,
      salesTaxBreakdown: [
        { category: "Public Safety", percentage: 38, amount: 95000000 },
        { category: "Transportation", percentage: 28, amount: 70000000 },
        { category: "Parks & Recreation", percentage: 20, amount: 50000000 },
        { category: "Community Services", percentage: 9, amount: 22500000 },
        { category: "Administration", percentage: 5, amount: 12500000 },
      ],
      latitude: 33.0198,
      longitude: -96.6989,
    },
    financialData: [],
    metrics: [],
  },
  {
    info: {
      id: "arlington",
      name: "Arlington",
      population: 394266,
      propertyTaxRate: 0.72,
      salesTaxBreakdown: [
        { category: "Public Safety", percentage: 42, amount: 147000000 },
        { category: "Transportation", percentage: 24, amount: 84000000 },
        { category: "Parks & Recreation", percentage: 16, amount: 56000000 },
        { category: "Community Services", percentage: 11, amount: 38500000 },
        { category: "Administration", percentage: 7, amount: 24500000 },
      ],
      latitude: 32.7357,
      longitude: -97.1081,
    },
    financialData: [],
    metrics: [],
  },
];

// // Calculate metrics for each city
mockCitiesData.forEach((city) => {
  const financialData = readACFR("data/acfr/" + city.info.id + ".csv");
  city.financialData = financialData;
  city.metrics = financialData.map(calculateACFRMetrics);
});

export function getCityData(cityId: string): CityData | undefined {
  return mockCitiesData.find((city) => city.info.id === cityId);
}

export function getAllCities(): CityData[] {
  return mockCitiesData;
}
