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
import { CityData, CityMetrics } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Card } from "./ui/card";
import { Dropdown } from "./ui/dropdown";
import { useState } from "react";
import { ColorConfig, getColorConfig } from "@/lib/leaflet-map-color-configs";

const center: LatLngExpression = [32.88, -96.79];

type PolygonFeature =
  | {
      name: string;
      coordinates: LatLngTuple[][][];
      type: "MultiPolygon";
      colorConfig: ColorConfig;
      cityData: CityData;
    }
  | {
      name: string;
      coordinates: LatLngTuple[][];
      type: "Polygon";
      colorConfig: ColorConfig;
      cityData: CityData;
    };

function CityShape({
  feature,
  metric,
}: {
  feature: PolygonFeature;
  metric: string;
}) {
  const router = useRouter();
  const map = useMap();

  const lats =
    feature.type == "MultiPolygon"
      ? feature.coordinates.flatMap((c) =>
          c.flatMap((c2) => c2.flatMap((c3) => c3[0])),
        )
      : feature.coordinates.flatMap((c) => c.flatMap((c2) => c2[0]));

  const lons =
    feature.type == "MultiPolygon"
      ? feature.coordinates.flatMap((c) =>
          c.flatMap((c2) => c2.flatMap((c3) => c3[1])),
        )
      : feature.coordinates.flatMap((c) => c.flatMap((c2) => c2[1]));

  const config = feature.colorConfig;
  const value = config.getValue(feature.cityData!);
  const color = config.colorFunction(value);

  return (
    <Polygon
      pathOptions={{ color }}
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
              duration: 0.5,
              easeLinearity: 0.25,
            },
          );
          setTimeout(() => {
            router.push(
              `/city/${feature.name.replaceAll(" ", "-").toLowerCase()}`,
            );
            map.clearAllEventListeners();
          }, 600);
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
          {metric} {config.getFormattedValue(feature.cityData)}
        </div>
      </Tooltip>
    </Polygon>
  );
}

export default function LeafletMap({
  geoJSONFeatures,
  cities,
}: {
  geoJSONFeatures: GeoJSONFeature[];
  cities: CityData[];
}) {
  const [selectedMetric, setSelectedMetric] = useState("Net Debt to Revenue");
  const features = geoJSONFeatures
    .filter((f) => ["Polygon", "MultiPolygon"].includes(f.geometry.type))
    .map((f) => {
      const coordinates =
        f.geometry.type == "Polygon"
          ? ((f.geometry as GeoJSONPolygon).coordinates.map((c) =>
              c.map(([lat, lon]) => [lon, lat]),
            ) as LatLngTuple[][])
          : ((f.geometry as GeoJSONMultiPolygon).coordinates.map((c) =>
              c.map((co) => co.map(([lat, lon]) => [lon, lat])),
            ) as LatLngTuple[][][]);

      const cityData = cities.find((c) => c.info.name == f.properties.name);

      return {
        name: f.properties.name,
        coordinates,
        colorConfig: getColorConfig(selectedMetric),
        type: f.geometry.type,
        cityData,
      };
    });

  const { greenLabel, yellowLabel, redLabel } = getColorConfig(selectedMetric);

  return (
    <div>
      {/* Legend */}
      <Card className="absolute p-4 mb-4 w-fit z-1000 ml-[100px] md:ml-[500px] lg:ml-[700px] mt-[-20px] gap-2">
        <div className="text-sm font-semibold">
          <Dropdown
            options={[
              "Net Debt to Revenue",
              "Asset Life",
              "10-Year Change in Assets Life",
              "10-Year Change in Assets to Liabilities",
              "Total Revenue Per Acre",
            ]}
            onSelectionChange={setSelectedMetric}
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "oklch(0.696 0.17 162)" }}
            />
            <span className="text-xs">{greenLabel} (Excellent)</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "oklch(0.769 0.188 70)" }}
            />
            <span className="text-xs">{yellowLabel} (Okay)</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "oklch(0.577 0.245 27)" }}
            />
            <span className="text-xs">{redLabel} (Poor)</span>
          </div>
        </div>
      </Card>

      <MapContainer
        center={center}
        zoom={10}
        // scrollWheelZoom={false}
        // style={{ width: "100%" }}
        // zoomControl={false}
        doubleClickZoom={false}
        // dragging={false}
        className="h-[400px] md:h-[600px] lg:h-[650px] w-[300px] md:w-[700px] lg:w-[900px] rounded-md mx-auto"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {features
          .filter((f): f is PolygonFeature => f.type != "Point" && !!f.cityData)
          .map((f, i) => (
            <CityShape feature={f} key={f.name + i} metric={selectedMetric} />
          ))}
      </MapContainer>
    </div>
  );
}
