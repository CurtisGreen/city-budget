"use client";

import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartFormatType, CityInfo } from "@/lib/types";
import { chartFormatters } from "@/lib/chart-utils";

interface ComparisonChartProps {
  cityInfos: CityInfo[];
  formatType?: ChartFormatType;
}

const CITY_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function PopulationChart({ cityInfos }: ComparisonChartProps) {
  const formatter = chartFormatters["number"];

  // Get all unique years
  const years = new Set<number>();
  cityInfos.forEach((c) => {
    c.populations.forEach(({ year }) => years.add(year));
  });
  const sortedYears = Array.from(years).sort();

  // Prepare chart data
  const chartData = sortedYears.map((year) => {
    const dataPoint: any = { year };

    cityInfos.forEach((c) => {
      const yearIndex = c.populations.findIndex((p) => p.year === year);
      if (yearIndex !== -1) {
        dataPoint[c.id] = c.populations[yearIndex].value;
      }
    });

    return dataPoint;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Population</CardTitle>
      </CardHeader>
      <CardContent className="flex">
        <ChartContainer className="w-full min-h-[250px]">
          <ResponsiveContainer>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="year"
                className="text-xs"
                type="number"
                tickCount={10}
                domain={["dataMin", "dataMax"]}
                interval={0}
              />
              <YAxis tickFormatter={formatter} className="text-xs" />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => formatter(value as number)}
                  />
                }
              />
              <Legend />

              {cityInfos.map((city, index) => (
                <Line
                  key={city.id}
                  type="monotone"
                  dataKey={city.id}
                  stroke={CITY_COLORS[index % CITY_COLORS.length]}
                  strokeWidth={2}
                  name={city.name}
                  dot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
