import type { CityData } from "./types";
import { readACFR } from "./acfr-csv-processor";
import { calculateACFRMetrics } from "./format-chart-data";
import { dallasInfo } from "@/data/info/dallas";
import { arlingtonInfo } from "@/data/info/arlington";
import { planoInfo } from "@/data/info/plano";
import { irvingInfo } from "@/data/info/irving";
import { garlandInfo } from "@/data/info/garland";
import { addisonInfo } from "@/data/info/addison";
import { carrolltonInfo } from "@/data/info/carrollton";
import { farmersBranchInfo } from "@/data/info/farmers-branch";
import { richardsonInfo } from "@/data/info/richardson";
import { rowlettInfo } from "@/data/info/rowlett";
import { friscoInfo } from "@/data/info/frisco";
import { grapevineInfo } from "@/data/info/grapevine";

import { join } from "node:path";
import { highlandParkInfo } from "@/data/info/highland-park";
import { coppellInfo } from "@/data/info/coppell";
import { sachseInfo } from "@/data/info/sachse";
import { universityParkInfo } from "@/data/info/university-park";
import { grandPrairieInfo } from "@/data/info/grand-prairie";

const basicCityInfo = [
  dallasInfo,
  planoInfo,
  arlingtonInfo,
  irvingInfo,
  garlandInfo,
  addisonInfo,
  carrolltonInfo,
  farmersBranchInfo,
  richardsonInfo,
  rowlettInfo,
  friscoInfo,
  grapevineInfo,
  highlandParkInfo,
  coppellInfo,
  sachseInfo,
  universityParkInfo,
  grandPrairieInfo,
];

// Calculate metrics for each city
const cityData: CityData[] = basicCityInfo.map((info) => {
  const financialData = readACFR(
    join(process.cwd(), "data/acfr", info.id + ".csv")
  );
  const metrics = financialData.map(calculateACFRMetrics);
  return { info, financialData, metrics };
});

export function getCityData(cityId: string): CityData | undefined {
  return cityData.find((city) => city.info.id === cityId);
}

export function getAllCities(): CityData[] {
  return cityData;
}
