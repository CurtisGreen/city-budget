import { getAllCities } from "@/lib/city-data-source";
import { Footer } from "@/components/footer";
import { HomeNavbarMenu } from "@/components/home-navbar-menu";
import { LazyMap } from "./lazy-map";
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
import { GeoJSONFeature } from "@/lib/overpass-types";

export default async function HomePage() {
  const cities = getAllCities();
  const features: GeoJSONFeature[] = [
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
  ];

  return (
    <div className="min-h-screen">
      <HomeNavbarMenu />
      <div className="m-auto w-[700px]">
        <LazyMap geoJSONFeatures={features} cities={cities} />
      </div>
      <Footer />
    </div>
  );
}
