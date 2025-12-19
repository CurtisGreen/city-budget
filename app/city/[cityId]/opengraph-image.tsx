import { getAllCities } from "@/lib/city-data-source";
import { ImageResponse } from "next/og";

const width = 300;
const height = 200;
const padding = 40;

export default async function GET({
  params,
}: {
  params: Promise<{ cityId: string }>;
}) {
  const { cityId } = await params;
  const cities = getAllCities();
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
  console.log(pathD);
  console.error(pathD);

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

      {/* Test */}
      <line
        x1={xScale(data[0].year)}
        y1={yScale(data[0].value)}
        x2={xScale(data[data.length - 1].year)}
        y2={yScale(data[data.length - 1].value)}
        stroke="red"
      />

      {/* Line */}
      <path
        d={pathD}
        // d={`M 40 129 L 64 160 L 89 52 L 113 40 L 138 55 L 162 60 L 187 45 L 211 69 L 236 118 L 260 114`}
        fill="none"
        stroke="#1449e69d"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
