import { ImageResponse } from "next/og";

const width = 300;
const height = 200;
const padding = 40;

export const alt = "Budget.City";
export const size = { width, height };

export const contentType = "image/png";

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
import { CityData } from "@/lib/types";
import { readACFR } from "@/lib/acfr-csv-processor";
import { calculateACFRMetrics } from "@/lib/format-acfr-data";

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
];

export default async function GET({
  params,
}: {
  params: Promise<{ cityId: string }>;
}) {
  const { cityId } = await params;
  // const cities = getAllCities();
  const cities: CityData[] = basicCityInfo.map((info) => {
    const financialData = readACFR("data/acfr/" + info.id + ".csv");
    const metrics = financialData.map(calculateACFRMetrics);
    return { info, financialData, metrics };
  });
  const city = cities.find((c) => c.info.id == cityId) || cities[0];
  const data = city.metrics.map((m) => ({
    year: m.fiscalYear,
    value: m.netFinancialPosition,
  }));
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
        }}
      >
        <div tw="text-slate-600 mt-4" style={{ display: "flex" }}>
          {city.info.name} - Net Financial Position
        </div>
        <LineGraph data={data} />
      </div>
    ),
    { width, height }
  );
}

type LineGraphProps = {
  data: {
    year: number;
    value: number;
  }[];
};

const LineGraph = ({ data }: LineGraphProps) => {
  const years = data.map((d) => d.year);
  const values = data.map((d) => d.value);

  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const xScale = (year: number): number =>
    padding +
    ((year - minYear) / (maxYear - minYear || 1)) * (width - padding * 2);

  const yScale = (value: number): number =>
    height -
    padding -
    ((value - minValue) / (maxValue - minValue || 1)) * (height - padding * 2);

  const pathD: string = data
    .map((d, i) => {
      const x = xScale(d.year);
      const y = yScale(d.value);
      return `${i === 0 ? "M" : "L"} ${Math.round(x)} ${Math.round(y)}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* X Axis */}
      <line
        x1={padding}
        y1={height - padding}
        x2={width - padding}
        y2={height - padding}
        stroke="grey"
      />

      {/* Y Axis */}
      <line
        x1={padding}
        y1={padding}
        x2={padding}
        y2={height - padding}
        stroke="grey"
      />

      {/* Line */}
      <path
        d={pathD}
        fill="none"
        stroke="#1449e69d"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
