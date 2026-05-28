"use client";

import {
  Pie,
  PieChart as RechartsPieChart,
  Tooltip,
  Legend,
  PieLabelRenderProps,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

const CITY_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-5)",
  "var(--chart-4)",
];

export function SimplePieChart({
  title,
  data,
}: {
  title: string;
  data: { name: string; value: number; fill?: string }[];
}) {
  // Assign colors
  const formattedData = data.map((item, index) => ({
    ...item,
    fill: CITY_COLORS[index % CITY_COLORS.length],
  }));

  return (
    <Card
      className={`
        [&_.recharts-layer]:outline-hidden
        [&_.recharts-sector[stroke='#fff']]:stroke-transparent
        [&_.recharts-surface]:outline-hidden
      `}
    >
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <RechartsPieChart
          style={{
            height: "100%",
            width: "100%",
            maxHeight: "380px",
            minHeight: "350px",
          }}
          responsive
          className="text-sm select-none"
        >
          <Pie
            data={formattedData}
            dataKey="value"
            isAnimationActive
            className="focus:outline-none"
            label={renderCustomizedLabel}
            labelLine={false}
          />
          <Legend />
          <Tooltip />
        </RechartsPieChart>
      </CardContent>
    </Card>
  );
}

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: PieLabelRenderProps) => {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
    return null;
  }
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const ncx = Number(cx);
  const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const ncy = Number(cy);
  const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > ncx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};
