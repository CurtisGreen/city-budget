"use client";

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { chartFormatters } from "@/lib/chart-utils";

interface Data {
  year: number;
  value: number;
}

interface ComparisonChartProps {
  cities: {
    data: Data[];
    id: string;
    name: string;
  }[];
  title: string;
  subtitle?: string;
}

const CITY_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function PopulationChart({
  cities,
  title,
  subtitle,
}: ComparisonChartProps) {
  const formatter = chartFormatters["number"];

  // Get all unique years
  const years = new Set<number>();
  cities.forEach((c) => {
    c.data.forEach(({ year }) => years.add(year));
  });
  const sortedYears = Array.from(years).sort();

  // Prepare chart data
  const chartData = sortedYears.map((year) => {
    const dataPoint: any = { year };

    cities.forEach((c) => {
      const yearIndex = c.data.findIndex((p) => p.year === year);
      if (yearIndex !== -1) {
        dataPoint[c.id] = c.data[yearIndex].value;
      }
    });

    return dataPoint;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
      </CardHeader>
      <CardContent className="flex">
        <ChartContainer className="w-full min-h-[250px] max-h-[485px]">
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

            {cities.map((city, index) => (
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
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
