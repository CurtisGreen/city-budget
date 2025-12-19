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
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  console.log(pathD);

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

      {/* Rounded Line */}
      <path
        // d={pathD}
        d={`M 40 143.82174953255998 L 64.44444444444444 160 L 88.88888888888889 157.92155049357646 L 113.33333333333333 144.65107863045097 L 137.77777777777777 153.9932447375299 L 162.22222222222223 
112.18420153199702 L 186.66666666666666 85.68366875087959 L 211.11111111111111 56.927963971933494 L 235.55555555555554 59.037777196968165 L 260 40`}
        fill="none"
        stroke="#1449e69d"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
