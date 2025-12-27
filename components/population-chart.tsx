"use client";

import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartTooltipContent } from "@/components/ui/chart";
import { useId } from "react";

interface Data {
  year: number;
  value: number;
}

interface ComparisonChartProps {
  cities: {
    data: Data[];
    name: string;
  }[];
  averageMetrics?: Data[];
  title: string;
  subtitle?: string;
}

const CITY_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const formatNumber = (value: number) =>
  Intl.NumberFormat("en-US", {
    style: "decimal",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);

export function PopulationChart({
  cities,
  averageMetrics,
  title,
  subtitle,
}: ComparisonChartProps) {
  const uniqueId = useId();
  const chartId = `chart-${uniqueId.replace(/:/g, "")}`;

  // Get all unique years
  const years = new Set<number>();
  cities.forEach((c) => {
    c.data.forEach(({ year }) => years.add(year));
  });
  const sortedYears = Array.from(years).sort();

  // Prepare chart data
  const chartData = sortedYears.map((year) => {
    const dataPoint: any = { year };

    // City population data
    cities.forEach((c) => {
      const yearIndex = c.data.findIndex((p) => p.year === year);
      if (yearIndex !== -1) {
        dataPoint[c.name] = c.data[yearIndex].value;
      }
    });

    // Add average
    if (averageMetrics) {
      const avgIndex = averageMetrics.findIndex((_, i) => {
        const allYears = cities[0].data.map((d) => d.year);
        return allYears[i] === year;
      });

      if (avgIndex !== -1) {
        dataPoint.average = averageMetrics[avgIndex].value as number;
      }
    }

    return dataPoint;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
      </CardHeader>
      <CardContent className="flex">
        <div
          data-slot="chart"
          data-chart={chartId}
          className={"w-full aspect-video text-xs"}
        >
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            responsive
            className="h-full"
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="year"
              type="number"
              tickCount={10}
              domain={["dataMin", "dataMax"]}
            />
            <YAxis tickFormatter={formatNumber} className="text-xs" />
            <Tooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => formatNumber(value as number)}
                />
              }
            />
            <Legend />

            {cities.map((city, index) => (
              <Line
                key={city.name}
                type="monotone"
                dataKey={city.name}
                stroke={CITY_COLORS[index % CITY_COLORS.length]}
                strokeWidth={2}
                name={city.name}
                dot={{ r: 4 }}
              />
            ))}
            {averageMetrics?.length && (
              <Line
                type="monotone"
                dataKey="average"
                stroke="black"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Average"
                dot={{ r: 3 }}
              />
            )}
          </LineChart>
        </div>
      </CardContent>
    </Card>
  );
}
