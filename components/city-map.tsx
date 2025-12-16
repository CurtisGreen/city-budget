"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { CityData } from "@/lib/types";

interface CityMapProps {
  cities: CityData[];
}

export function CityMap({ cities }: CityMapProps) {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  // Calculate bounds for the map
  const lats = cities.map((c) => c.info.latitude);
  const lngs = cities.map((c) => c.info.longitude);
  const minLat = Math.min(...lats) - 0.1;
  const maxLat = Math.max(...lats) + 0.1;
  const minLng = Math.min(...lngs) - 0.1;
  const maxLng = Math.max(...lngs) + 0.1;

  // Function to convert lat/lng to SVG coordinates
  const latLngToXY = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
    return { x, y };
  };

  // Get color based on net debt to revenue ratio
  const getColorForRatio = (ratio: number) => {
    if (ratio === 0) return "oklch(0.696 0.17 162.48)"; // green - excellent
    if (ratio < 1.0) return "oklch(0.769 0.188 70.08)"; // yellow - okay
    return "oklch(0.577 0.245 27.325)"; // red - poor
  };

  return (
    <div className="relative w-full h-[500px]">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Map background */}
        <image href="/map.png" width={100} height={100} />

        {/* City markers */}
        {cities.map((city) => {
          const { x, y } = latLngToXY(city.info.latitude, city.info.longitude);
          const latestMetrics = city.metrics[city.metrics.length - 1] || {};
          const ratio = latestMetrics.netDebtToRevenue;
          const color = getColorForRatio(ratio);
          const isHovered = hoveredCity === city.info.id;

          return (
            <g key={city.info.id}>
              <Link href={`/city/${city.info.id}`}>
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? "4" : "3"}
                  fill={color}
                  stroke="var(--color-background)"
                  strokeWidth="0.5"
                  onMouseEnter={() => setHoveredCity(city.info.id)}
                  onMouseLeave={() => setHoveredCity(null)}
                  className="cursor-pointer transition-all duration-200"
                  style={{ filter: isHovered ? "brightness(1.2)" : "none" }}
                />
              </Link>

              {/* City label */}
              {isHovered && (
                <>
                  <rect
                    id="second-layer"
                    x={x + 4}
                    y={y - 3}
                    width="20"
                    height="6"
                    fill="var(--color-card)"
                    stroke="var(--color-border)"
                    strokeWidth="0.2"
                    rx="0.5"
                  />
                  <text
                    id="first-layer"
                    x={x + 5}
                    y={y + 1}
                    fontSize="2.5"
                    fill="var(--color-foreground)"
                    className="font-medium pointer-events-none"
                  >
                    {city.info.name}
                  </text>
                </>
              )}
              <use xlinkHref="#second-layer" />
              <use xlinkHref="#first-layer" />
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <Card className="absolute bottom-4 right-4 p-4">
        <h4 className="text-sm font-semibold mb-2">Net Debt to Revenue</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "oklch(0.696 0.17 162.48)" }}
            />
            <span className="text-xs">{"= 0 (Excellent)"}</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "oklch(0.769 0.188 70.08)" }}
            />
            <span className="text-xs">{"0 - 1.0 (Okay)"}</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "oklch(0.577 0.245 27.325)" }}
            />
            <span className="text-xs">{"> 1 (Poor)"}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
