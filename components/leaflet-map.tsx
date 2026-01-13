"use client";

import { LatLngExpression, LatLngTuple } from "leaflet";
import {
  MapContainer,
  Polygon,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import {
  GeoJSONFeature,
  GeoJSONMultiPolygon,
  GeoJSONPolygon,
} from "@/lib/overpass-types";
import { CityData } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Card } from "./ui/card";

const center: LatLngExpression = [32.9, -96.79];

type PolygonFeature =
  | {
      name: string;
      coordinates: LatLngTuple[][][];
      color: string;
      netDebtToRevenue: number;
      type: "MultiPolygon";
    }
  | {
      name: string;
      coordinates: LatLngTuple[][];
      color: string;
      netDebtToRevenue: number;
      type: "Polygon";
    };

function CityShape({ feature }: { feature: PolygonFeature }) {
  const router = useRouter();
  const map = useMap();

  const lats =
    feature.type == "MultiPolygon"
      ? feature.coordinates.flatMap((c) =>
          c.flatMap((c2) => c2.flatMap((c3) => c3[0]))
        )
      : feature.coordinates.flatMap((c) => c.flatMap((c2) => c2[0]));

  const lons =
    feature.type == "MultiPolygon"
      ? feature.coordinates.flatMap((c) =>
          c.flatMap((c2) => c2.flatMap((c3) => c3[1]))
        )
      : feature.coordinates.flatMap((c) => c.flatMap((c2) => c2[1]));

  return (
    <Polygon
      pathOptions={{ color: feature.color }}
      positions={feature.coordinates}
      opacity={0.5}
      fillOpacity={0.2}
      className="duration-200"
      eventHandlers={{
        click() {
          map.fitBounds(
            [
              [Math.min(...lats), Math.min(...lons)],
              [Math.max(...lats), Math.max(...lons)],
            ],
            {
              animate: true,
              duration: 0.8,
              easeLinearity: 0.25,
            }
          );
          setTimeout(() => {
            router.push(
              `/city/${feature.name.replaceAll(" ", "-").toLowerCase()}`
            );
            map.clearAllEventListeners();
          }, 1000);
        },
        mouseover(e) {
          e.target.setStyle({ opacity: 1, fillOpacity: 0.5 });
        },
        mouseout(e) {
          e.target.setStyle({ opacity: 0.5, fillOpacity: 0.2 });
        },
      }}
    >
      <Tooltip sticky>
        <b>{feature.name}</b>
        <div>
          Net Debt / Revenue {Math.round(feature.netDebtToRevenue * 100)}%
        </div>
      </Tooltip>
    </Polygon>
  );
}

const getColorForRatio = (ratio: number) => {
  if (ratio === 0) return "oklch(0.696 0.17 162)"; // green - excellent
  if (ratio < 1.0) return "oklch(0.769 0.188 70)"; // yellow - okay
  return "oklch(0.577 0.245 27)"; // red - poor
};

export default function LeafletMap({
  geoJSONFeatures,
  cities,
}: {
  geoJSONFeatures: GeoJSONFeature[];
  cities: CityData[];
}) {
  const features = geoJSONFeatures
    .filter((f) => ["Polygon", "MultiPolygon"].includes(f.geometry.type))
    .map((f) => {
      const coordinates =
        f.geometry.type == "Polygon"
          ? ((f.geometry as GeoJSONPolygon).coordinates.map((c) =>
              c.map(([lat, lon]) => [lon, lat])
            ) as LatLngTuple[][])
          : ((f.geometry as GeoJSONMultiPolygon).coordinates.map((c) =>
              c.map((co) => co.map(([lat, lon]) => [lon, lat]))
            ) as LatLngTuple[][][]);

      const city = cities.find((c) => c.info.name == f.properties.name);

      const netDebtToRevenue =
        city?.metrics[city.metrics.length - 1].netDebtToRevenue;
      const color =
        netDebtToRevenue != null ? getColorForRatio(netDebtToRevenue) : "white";

      return {
        name: f.properties.name,
        coordinates,
        color,
        netDebtToRevenue,
        type: f.geometry.type,
      };
    });

  return (
    <div>
      {/* Legend */}
      <Card className="absolute p-4 mb-4 w-fit z-1000 ml-[160px] md:ml-[520px] mt-[-20px] gap-2">
        <div className="text-sm font-semibold">Net Debt to Revenue</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "oklch(0.696 0.17 162)" }}
            />
            <span className="text-xs">{"= 0 (Excellent)"}</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "oklch(0.769 0.188 70)" }}
            />
            <span className="text-xs">{"0 - 1.0 (Okay)"}</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "oklch(0.577 0.245 27)" }}
            />
            <span className="text-xs">{"> 1 (Poor)"}</span>
          </div>
        </div>
      </Card>

      <MapContainer
        center={center}
        zoom={10}
        // scrollWheelZoom={false}
        //   style={{ height: "400px", width: "100%" }}
        // zoomControl={false}
        doubleClickZoom={false}
        // dragging={false}
        className="h-[400px] md:h-[600px] w-[300px] md:w-[700px]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {features
          .filter((f): f is PolygonFeature => f.netDebtToRevenue != null)
          .map((f, i) => (
            <CityShape feature={f} key={f.name + i} />
          ))}
      </MapContainer>
    </div>
  );
}
