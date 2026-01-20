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

import { dallasGeoJson } from "@/data/geojson/dallas-geojson";
import { addisonGeoJson } from "@/data/geojson/addison-geojson";
import { irvingGeoJson } from "@/data/geojson/irving-geojson";
import { carrolltonGeoJson } from "@/data/geojson/carrollton-geojson";
import { farmersBranchGeoJson } from "@/data/geojson/farmers-branch-geojson";
import { richardsonGeoJson } from "@/data/geojson/richardson-geojson";
import { garlandGeoJson } from "@/data/geojson/garland-geojson";
import { rowlettGeoJson } from "@/data/geojson/rowlett-geojson";
import { highlandParkGeoJson } from "@/data/geojson/highland-park-geojson";
import { planoGeoJson } from "@/data/geojson/plano-geojson";
import { coppellGeoJson } from "@/data/geojson/coppell-geojson";
import { friscoGeoJson } from "@/data/geojson/frisco-geojson";
import { grapevineGeoJson } from "@/data/geojson/grapevine-geojson";
import { arlingtonGeoJson } from "@/data/geojson/arlington-geojson";
import { sachseGeoJson } from "@/data/geojson/sachse-geojson";
import { universityParkGeoJson } from "@/data/geojson/university-park-geojson";
import { grandPrairieGeoJson } from "@/data/geojson/grand-prairie-geojson";
import { mesquiteGeoJson } from "@/data/geojson/mesquite-geojson";
import { fortWorthGeoJson } from "@/data/geojson/fort-worth-geojson";

import { join } from "node:path";
import { highlandParkInfo } from "@/data/info/highland-park";
import { coppellInfo } from "@/data/info/coppell";
import { sachseInfo } from "@/data/info/sachse";
import { universityParkInfo } from "@/data/info/university-park";
import { grandPrairieInfo } from "@/data/info/grand-prairie";
import { mesquiteInfo } from "@/data/info/mesquite";
import { fortWorthInfo } from "@/data/info/fort-worth";
import { GeoJSONFeature } from "./overpass-types";

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
  mesquiteInfo,
  fortWorthInfo,
];

// Calculate metrics for each city
const cityData: CityData[] = basicCityInfo.map((info) => {
  const financialData = readACFR(
    join(process.cwd(), "data/acfr", info.id + ".csv"),
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

export const geoJsonFeatures: GeoJSONFeature[] = [
  ...dallasGeoJson.features,
  ...addisonGeoJson.features,
  ...irvingGeoJson.features,
  ...carrolltonGeoJson.features,
  ...farmersBranchGeoJson.features,
  ...richardsonGeoJson.features,
  ...garlandGeoJson.features,
  ...rowlettGeoJson.features,
  ...highlandParkGeoJson.features,
  ...planoGeoJson.features,
  ...coppellGeoJson.features,
  ...friscoGeoJson.features,
  ...grapevineGeoJson.features,
  ...arlingtonGeoJson.features,
  ...sachseGeoJson.features,
  ...universityParkGeoJson.features,
  ...grandPrairieGeoJson.features,
  ...mesquiteGeoJson.features,
  ...fortWorthGeoJson.features,
] as GeoJSONFeature[];
