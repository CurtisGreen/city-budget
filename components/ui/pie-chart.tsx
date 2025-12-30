"use client";

import {
  Pie,
  PieChart as RechartsPieChart,
  Sector,
  PieSectorDataItem,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};

const renderActiveShape = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  payload,
  percent,
  value,
}: PieSectorDataItem) => {
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * (midAngle ?? 1));
  const cos = Math.cos(-RADIAN * (midAngle ?? 1));
  const sx = (cx ?? 0) + ((outerRadius ?? 0) + 10) * cos;
  const sy = (cy ?? 0) + ((outerRadius ?? 0) + 10) * sin;
  const mx = (cx ?? 0) + ((outerRadius ?? 0) + 30) * cos;
  const my = (cy ?? 0) + ((outerRadius ?? 0) + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 15;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={(outerRadius ?? 0) + 6}
        outerRadius={(outerRadius ?? 0) + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
        className="font-bold text-lg"
      >
        {`${Math.round((percent ?? 1) * 100)}%`}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#666666"
      >
        {formatCurrency(value)}
      </text>
    </g>
  );
};

export function PieChart({
  title,
  property,
  sales,
  hotel,
}: {
  title: string;
  property: number;
  sales: number;
  hotel: number;
}) {
  const data = [
    { name: "Property tax", value: property, fill: "var(--chart-1)" },
    { name: "Sales tax", value: sales, fill: "var(--chart-2)" },
    { name: "Hotel tax", value: hotel, fill: "var(--chart-5)" },
  ];

  return (
    <Card
      className={`
        [&_.recharts-layer]:outline-hidden
        [&_.recharts-sector[stroke='#fff']]:stroke-transparent
        [&_.recharts-surface]:outline-hidden
      `}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <RechartsPieChart
          style={{ height: "100%", width: "100%" }}
          responsive
          margin={{
            top: 0,
            right: 80,
            bottom: 0,
            left: 80,
          }}
          className="text-sm select-none"
        >
          <Pie
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="50%"
            outerRadius="80%"
            dataKey="value"
            isAnimationActive
            className="focus:outline-none"
          >
            <Legend />
          </Pie>
          <Tooltip content={() => null} defaultIndex={0} />
        </RechartsPieChart>
      </CardContent>
    </Card>
  );
}
