"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { RevenueBySource } from "@/lib/types";
import { ChartTooltipContent } from "./ui/chart";

const CITY_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-4)",
  "var(--chart-5)",
];

interface RevenueInput {
  name: string;
  revenue: RevenueBySource;
}

export const RevenueChart = ({
  revenues,
  average,
}: {
  revenues: RevenueInput[];
  average: RevenueBySource;
}) => {
  const averageTotal = average.property + average.sales + average.hotel;
  const property = revenues.reduce(
    (acc, r) => {
      const { property, sales, hotel } = r.revenue;
      const total = property + sales + hotel;
      acc[r.name] = property / total;
      return acc;
    },
    { name: "Property Tax", Average: average.property / averageTotal } as any
  );
  const sales = revenues.reduce(
    (acc, r) => {
      const { property, sales, hotel } = r.revenue;
      const total = property + sales + hotel;
      acc[r.name] = sales / total;
      return acc;
    },
    { name: "Sales Tax", Average: average.sales / averageTotal } as any
  );
  const hotel = revenues.reduce(
    (acc, r) => {
      const { property, sales, hotel } = r.revenue;
      const total = property + sales + hotel;
      acc[r.name] = hotel / total;
      return acc;
    },
    { name: "Hotel Tax", Average: average.hotel / averageTotal } as any
  );
  const data = [property, sales, hotel];

  const formatter = (value: number) => Math.round(value * 100) + "%";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Revenue Mix (FY 2024)</CardTitle>
      </CardHeader>
      <CardContent>
        <BarChart
          style={{
            width: "100%",
            maxHeight: "485px",
            aspectRatio: "16 / 9",
            minHeight: "250px",
          }}
          responsive
          data={data}
          margin={{ top: 20, right: 10, left: 20, bottom: 20 }}
          className={`
            text-xs
            [&_.recharts-layer]:outline-hidden
            [&_.recharts-sector[stroke='#fff']]:stroke-transparent
            [&_.recharts-surface]:outline-hidden
          `}
        >
          <defs>
            <pattern
              id="stripe"
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <rect width="4" height="8" fill="black" />
            </pattern>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis width="auto" tickFormatter={formatter} />
          <Tooltip
            content={
              <ChartTooltipContent
                formatter={(value) => formatter(value as number)}
              />
            }
          />
          <Legend />
          {revenues.map((r, i) => (
            <Bar
              key={r.name}
              dataKey={r.name}
              fill={CITY_COLORS[i % CITY_COLORS.length]}
            />
          ))}
          <Bar dataKey="Average" fill="url(#stripe)" />
        </BarChart>
      </CardContent>
    </Card>
  );
};
