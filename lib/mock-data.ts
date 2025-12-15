import type { CityData } from "./types";
import { readACFR } from "./acfr-csv-processor";
import { calculateACFRMetrics } from "./format-acfr-data";
import { dallasInfo } from "@/data/info/dallas";
import { arlingtonInfo } from "@/data/info/arlington";
import { planoInfo } from "@/data/info/plano";

const basicCityInfo = [dallasInfo, planoInfo, arlingtonInfo];

// Calculate metrics for each city
export const cityData: CityData[] = basicCityInfo.map((info) => {
  const financialData = readACFR("data/acfr/" + info.id + ".csv");
  const metrics = financialData.map(calculateACFRMetrics);
  return { info, financialData, metrics };
});

export function getCityData(cityId: string): CityData | undefined {
  return cityData.find((city) => city.info.id === cityId);
}

export function getAllCities(): CityData[] {
  return cityData;
}
