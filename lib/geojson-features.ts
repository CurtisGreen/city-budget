import { GeoJSONFeature } from "./overpass-types";

import { dallasGeoJson } from "@/data/geojson/dallas-geojson";
import { dalworthingtonGardensGeoJson } from "@/data/geojson/dalworthington-gardens-geojson";
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
import { corinthGeoJson } from "@/data/geojson/corinth-geojson";
import { hasletGeoJson } from "@/data/geojson/haslet-geojson";
import { trophyClubGeoJson } from "@/data/geojson/trophy-club-geojson";
import { benbrookGeoJson } from "@/data/geojson/benbrook-geojson";
import { burlesonGeoJson } from "@/data/geojson/burleson-geojson";
import { cockrellHillGeoJson } from "@/data/geojson/cockrell-hill-geojson";
import { colleyvilleGeoJson } from "@/data/geojson/colleyville-geojson";
import { friscoGeoJson } from "@/data/geojson/frisco-geojson";
import { grapevineGeoJson } from "@/data/geojson/grapevine-geojson";
import { arlingtonGeoJson } from "@/data/geojson/arlington-geojson";
import { sachseGeoJson } from "@/data/geojson/sachse-geojson";
import { saginawGeoJson } from "@/data/geojson/saginaw-geojson";
import { universityParkGeoJson } from "@/data/geojson/university-park-geojson";
import { grandPrairieGeoJson } from "@/data/geojson/grand-prairie-geojson";
import { mesquiteGeoJson } from "@/data/geojson/mesquite-geojson";
import { fortWorthGeoJson } from "@/data/geojson/fort-worth-geojson";
import { glennHeightsGeoJson } from "@/data/geojson/glenn-heights-geojson";
import { mckinneyGeojson } from "@/data/geojson/mckinney-geojson";
import { duncanvilleGeoJSON } from "@/data/geojson/duncanville-geojson";
import { allenGeoJson } from "@/data/geojson/allen-geojson";
import { lewisvilleGoeJson } from "@/data/geojson/lewisville-geojson";
import { mansfieldGeoJson } from "@/data/geojson/mansfield-geojson";
import { flowerMoundGeoJson } from "@/data/geojson/flower-mound-geojson";
import { dentonGeoJson } from "@/data/geojson/denton-geojson";
import { northRichlandHillsGeoJson } from "@/data/geojson/north-richland-hills";
import { wylieGeoJson } from "@/data/geojson/wylie-geojson";
import { celinaGeoJson } from "@/data/geojson/celina-geojson";
import { cedarHillGeoJson } from "@/data/geojson/cedar-hill-geojson";
import { desotoGeoJson } from "@/data/geojson/desoto-geojson";
import { murphyGeoJson } from "@/data/geojson/murphy-geojson";
import { prosperGeoJson } from "@/data/geojson/prosper-geojson";
import { lancasterGeoJson } from "@/data/geojson/lancaster-geojson";
import { eulessGeoJson } from "@/data/geojson/euless-geojson";
import { bedfordGeoJson } from "@/data/geojson/bedford-geojson";
import { theColonyGeoJson } from "@/data/geojson/the-colony-geojson";
import { kellerGeoJson } from "@/data/geojson/keller-geojson";
import { kennedaleGeoJson } from "@/data/geojson/kennedale-geojson";
import { hurstGeoJson } from "@/data/geojson/hurst-geojson";
import { lucasGeoJson } from "@/data/geojson/lucas-geojson";
import { forneyGeoJson } from "@/data/geojson/forney-geojson";
import { forestHillGeoJson } from "@/data/geojson/forest-hill-geojson";
import { fateGeoJson } from "@/data/geojson/fate-geojson";
import { redOakGeoJson } from "@/data/geojson/red-oak-geojson";
import { richlandHillsGeoJson } from "@/data/geojson/richland-hills-geojson";
import { roanokeGeoJson } from "@/data/geojson/roanoke-geojson";
import { rockwallGeoJson } from "@/data/geojson/rockwall-geojson";
import { haltomCityGeoJson } from "@/data/geojson/haltom-city-geojson";
import { highlandVillageGeoJson } from "@/data/geojson/highland-village-geojson";
import { westlakeGeoJson } from "@/data/geojson/westlake-geojson";
import { littleElmGeoJson } from "@/data/geojson/little-elm-geojson";
import { southlakeGeoJson } from "@/data/geojson/southlake-geojson";
import { sunnyvaleGeoJson } from "@/data/geojson/sunnyvale-geojson";
import { balchSpringsGeoJson } from "@/data/geojson/balch-springs-geojson";
import { wataugaGeoJson } from "@/data/geojson/watauga-geojson";
import { whiteSettlementGeoJson } from "@/data/geojson/white-settlement-geojson";
import { princetonGeoJson } from "@/data/geojson/princeton-geojson";
import { pantegoGeoJson } from "@/data/geojson/pantego-geojson";
import { parkerGeoJson } from "@/data/geojson/parker-geojson";
import { crowleyGeoJson } from "@/data/geojson/crowley-geojson";

export const geoJsonFeatures: GeoJSONFeature[] = [
  ...dallasGeoJson.features,
  ...dalworthingtonGardensGeoJson.features,
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
  ...corinthGeoJson.features,
  ...hasletGeoJson.features,
  ...trophyClubGeoJson.features,
  ...benbrookGeoJson.features,
  ...burlesonGeoJson.features,
  ...cockrellHillGeoJson.features,
  ...colleyvilleGeoJson.features,
  ...friscoGeoJson.features,
  ...grapevineGeoJson.features,
  ...arlingtonGeoJson.features,
  ...sachseGeoJson.features,
  ...saginawGeoJson.features,
  ...universityParkGeoJson.features,
  ...grandPrairieGeoJson.features,
  ...mesquiteGeoJson.features,
  ...fortWorthGeoJson.features,
  ...glennHeightsGeoJson.features,
  ...mckinneyGeojson.features,
  ...duncanvilleGeoJSON.features,
  ...allenGeoJson.features,
  ...lewisvilleGoeJson.features,
  ...mansfieldGeoJson.features,
  ...flowerMoundGeoJson.features,
  ...dentonGeoJson.features,
  ...northRichlandHillsGeoJson.features,
  ...wylieGeoJson.features,
  ...celinaGeoJson.features,
  ...cedarHillGeoJson.features,
  ...desotoGeoJson.features,
  ...murphyGeoJson.features,
  ...prosperGeoJson.features,
  ...lancasterGeoJson.features,
  ...eulessGeoJson.features,
  ...bedfordGeoJson.features,
  ...theColonyGeoJson.features,
  ...kellerGeoJson.features,
  ...kennedaleGeoJson.features,
  ...hurstGeoJson.features,
  ...lucasGeoJson.features,
  ...forneyGeoJson.features,
  ...forestHillGeoJson.features,
  ...fateGeoJson.features,
  ...redOakGeoJson.features,
  ...richlandHillsGeoJson.features,
  ...roanokeGeoJson.features,
  ...rockwallGeoJson.features,
  ...haltomCityGeoJson.features,
  ...highlandVillageGeoJson.features,
  ...westlakeGeoJson.features,
  ...littleElmGeoJson.features,
  ...southlakeGeoJson.features,
  ...sunnyvaleGeoJson.features,
  ...balchSpringsGeoJson.features,
  ...wataugaGeoJson.features,
  ...whiteSettlementGeoJson.features,
  ...princetonGeoJson.features,
  ...pantegoGeoJson.features,
  ...parkerGeoJson.features,
  ...crowleyGeoJson.features,
] as GeoJSONFeature[];
