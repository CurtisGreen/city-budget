import type { CityFinancialData } from "@/lib/types";
import { addisonAcfr } from "./addison";
import { allenAcfr } from "./allen";
import { arlingtonAcfr } from "./arlington";
import { balchSpringsAcfr } from "./balch-springs";
import { bedfordAcfr } from "./bedford";
import { carrolltonAcfr } from "./carrollton";
import { cedarHillAcfr } from "./cedar-hill";
import { celinaAcfr } from "./celina";
import { colleyvilleAcfr } from "./colleyville";
import { coppellAcfr } from "./coppell";
import { dallasAcfr } from "./dallas";
import { dentonAcfr } from "./denton";
import { desotoAcfr } from "./desoto";
import { duncanvilleAcfr } from "./duncanville";
import { eulessAcfr } from "./euless";
import { farmersBranchAcfr } from "./farmers-branch";
import { flowerMoundAcfr } from "./flower-mound";
import { forneyAcfr } from "./forney";
import { fortWorthAcfr } from "./fort-worth";
import { friscoAcfr } from "./frisco";
import { garlandAcfr } from "./garland";
import { glennHeightsAcfr } from "./glenn-heights";
import { grandPrairieAcfr } from "./grand-prairie";
import { grapevineAcfr } from "./grapevine";
import { haltomCityAcfr } from "./haltom-city";
import { highlandParkAcfr } from "./highland-park";
import { highlandVillageAcfr } from "./highland-village";
import { hurstAcfr } from "./hurst";
import { irvingAcfr } from "./irving";
import { kellerAcfr } from "./keller";
import { lancasterAcfr } from "./lancaster";
import { lewisvilleAcfr } from "./lewisville";
import { littleElmAcfr } from "./little-elm";
import { mansfieldAcfr } from "./mansfield";
import { mckinneyAcfr } from "./mckinney";
import { mesquiteAcfr } from "./mesquite";
import { murphyAcfr } from "./murphy";
import { northRichlandHillsAcfr } from "./north-richland-hills";
import { planoAcfr } from "./plano";
import { prosperAcfr } from "./prosper";
import { richardsonAcfr } from "./richardson";
import { roanokeAcfr } from "./roanoke";
import { rockwallAcfr } from "./rockwall";
import { rowlettAcfr } from "./rowlett";
import { sachseAcfr } from "./sachse";
import { saginawAcfr } from "./saginaw";
import { southlakeAcfr } from "./southlake";
import { theColonyAcfr } from "./the-colony";
import { universityParkAcfr } from "./university-park";
import { wataugaAcfr } from "./watauga";
import { westlakeAcfr } from "./westlake";
import { wylieAcfr } from "./wylie";

export const acfrData: Record<string, CityFinancialData[]> = {
  addison: addisonAcfr,
  allen: allenAcfr,
  arlington: arlingtonAcfr,
  "balch-springs": balchSpringsAcfr,
  bedford: bedfordAcfr,
  carrollton: carrolltonAcfr,
  "cedar-hill": cedarHillAcfr,
  celina: celinaAcfr,
  colleyville: colleyvilleAcfr,
  coppell: coppellAcfr,
  dallas: dallasAcfr,
  denton: dentonAcfr,
  desoto: desotoAcfr,
  duncanville: duncanvilleAcfr,
  euless: eulessAcfr,
  "farmers-branch": farmersBranchAcfr,
  "flower-mound": flowerMoundAcfr,
  forney: forneyAcfr,
  "fort-worth": fortWorthAcfr,
  frisco: friscoAcfr,
  garland: garlandAcfr,
  "glenn-heights": glennHeightsAcfr,
  "grand-prairie": grandPrairieAcfr,
  grapevine: grapevineAcfr,
  "haltom-city": haltomCityAcfr,
  "highland-park": highlandParkAcfr,
  "highland-village": highlandVillageAcfr,
  hurst: hurstAcfr,
  irving: irvingAcfr,
  keller: kellerAcfr,
  lancaster: lancasterAcfr,
  lewisville: lewisvilleAcfr,
  "little-elm": littleElmAcfr,
  mansfield: mansfieldAcfr,
  mckinney: mckinneyAcfr,
  mesquite: mesquiteAcfr,
  murphy: murphyAcfr,
  "north-richland-hills": northRichlandHillsAcfr,
  plano: planoAcfr,
  prosper: prosperAcfr,
  richardson: richardsonAcfr,
  roanoke: roanokeAcfr,
  rockwall: rockwallAcfr,
  rowlett: rowlettAcfr,
  sachse: sachseAcfr,
  saginaw: saginawAcfr,
  southlake: southlakeAcfr,
  "the-colony": theColonyAcfr,
  "university-park": universityParkAcfr,
  watauga: wataugaAcfr,
  westlake: westlakeAcfr,
  wylie: wylieAcfr,
};
