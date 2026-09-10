import type { CityData } from "./types";
import { acfrData } from "@/data/acfr-json";
import { calculateACFRMetrics } from "./format-chart-data";
import { dallasInfo } from "@/data/info/dallas";
import { dalworthingtonGardensInfo } from "@/data/info/dalworthington-gardens";
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
import { highlandParkInfo } from "@/data/info/highland-park";
import { coppellInfo } from "@/data/info/coppell";
import { corinthInfo } from "@/data/info/corinth";
import { hasletInfo } from "@/data/info/haslet";
import { trophyClubInfo } from "@/data/info/trophy-club";
import { benbrookInfo } from "@/data/info/benbrook";
import { burlesonInfo } from "@/data/info/burleson";
import { cockrellHillInfo } from "@/data/info/cockrell-hill";
import { colleyvilleInfo } from "@/data/info/colleyville";
import { sachseInfo } from "@/data/info/sachse";
import { saginawInfo } from "@/data/info/saginaw";
import { universityParkInfo } from "@/data/info/university-park";
import { grandPrairieInfo } from "@/data/info/grand-prairie";
import { mesquiteInfo } from "@/data/info/mesquite";
import { fortWorthInfo } from "@/data/info/fort-worth";
import { glennHeightsInfo } from "@/data/info/glenn-heights";
import { mckinneyInfo } from "@/data/info/mckinney";
import { duncanvilleInfo } from "@/data/info/duncanville";
import { allenInfo } from "@/data/info/allen";
import { lewisvilleInfo } from "@/data/info/lewisville";
import { mansfieldInfo } from "@/data/info/mansfield";
import { flowerMoundInfo } from "@/data/info/flower-mound";
import { dentonInfo } from "@/data/info/denton";
import { northRichlandHillsInfo } from "@/data/info/north-richland-hills";
import { wylieInfo } from "@/data/info/wylie";
import { celinaInfo } from "@/data/info/celina";
import { cedarHillInfo } from "@/data/info/cedar-hill";
import { desotoInfo } from "@/data/info/desoto";
import { murphyInfo } from "@/data/info/murphy";
import { prosperInfo } from "@/data/info/prosper";
import { lancasterInfo } from "@/data/info/lancaster";
import { eulessInfo } from "@/data/info/euless";
import { bedfordInfo } from "@/data/info/bedford";
import { theColonyInfo } from "@/data/info/the-colony";
import { kellerInfo } from "@/data/info/keller";
import { kennedaleInfo } from "@/data/info/kennedale";
import { hurstInfo } from "@/data/info/hurst";
import { hutchinsInfo } from "@/data/info/hutchins";
import { lucasInfo } from "@/data/info/lucas";
import { forneyInfo } from "@/data/info/forney";
import { forestHillInfo } from "@/data/info/forest-hill";
import { fateInfo } from "@/data/info/fate";
import { fairviewInfo } from "@/data/info/fairview";
import { redOakInfo } from "@/data/info/red-oak";
import { richlandHillsInfo } from "@/data/info/richland-hills";
import { roanokeInfo } from "@/data/info/roanoke";
import { rockwallInfo } from "@/data/info/rockwall";
import { haltomCityInfo } from "@/data/info/haltom-city";
import { highlandVillageInfo } from "@/data/info/highland-village";
import { westlakeInfo } from "@/data/info/westlake";
import { littleElmInfo } from "@/data/info/little-elm";
import { southlakeInfo } from "@/data/info/southlake";
import { sunnyvaleInfo } from "@/data/info/sunnyvale";
import { balchSpringsInfo } from "@/data/info/balch-springs";
import { wataugaInfo } from "@/data/info/watauga";
import { whiteSettlementInfo } from "@/data/info/white-settlement";
import { wilmerInfo } from "@/data/info/wilmer";
import { princetonInfo } from "@/data/info/princeton";
import { pantegoInfo } from "@/data/info/pantego";
import { parkerInfo } from "@/data/info/parker";
import { crowleyInfo } from "@/data/info/crowley";
import { northlakeInfo } from "@/data/info/northlake";

const basicCityInfo = [
  dallasInfo,
  dalworthingtonGardensInfo,
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
  corinthInfo,
  hasletInfo,
  trophyClubInfo,
  benbrookInfo,
  burlesonInfo,
  cockrellHillInfo,
  colleyvilleInfo,
  sachseInfo,
  saginawInfo,
  universityParkInfo,
  grandPrairieInfo,
  mesquiteInfo,
  fortWorthInfo,
  glennHeightsInfo,
  mckinneyInfo,
  duncanvilleInfo,
  allenInfo,
  lewisvilleInfo,
  mansfieldInfo,
  flowerMoundInfo,
  dentonInfo,
  northRichlandHillsInfo,
  wylieInfo,
  celinaInfo,
  cedarHillInfo,
  desotoInfo,
  murphyInfo,
  prosperInfo,
  lancasterInfo,
  eulessInfo,
  bedfordInfo,
  theColonyInfo,
  kellerInfo,
  kennedaleInfo,
  hurstInfo,
  hutchinsInfo,
  lucasInfo,
  forneyInfo,
  forestHillInfo,
  fateInfo,
  fairviewInfo,
  redOakInfo,
  richlandHillsInfo,
  roanokeInfo,
  rockwallInfo,
  haltomCityInfo,
  highlandVillageInfo,
  westlakeInfo,
  littleElmInfo,
  southlakeInfo,
  sunnyvaleInfo,
  balchSpringsInfo,
  wataugaInfo,
  whiteSettlementInfo,
  wilmerInfo,
  princetonInfo,
  pantegoInfo,
  parkerInfo,
  crowleyInfo,
  northlakeInfo,
];

// Calculate metrics for each city
const cityData: CityData[] = basicCityInfo.map((info) => {
  const financialData = acfrData[info.id] ?? [];
  const metrics = financialData.map(calculateACFRMetrics);
  return { info, financialData, metrics };
});

export function getCityData(cityId: string): CityData | undefined {
  return cityData.find((city) => city.info.id === cityId);
}

export function getAllCities(): CityData[] {
  return cityData;
}
