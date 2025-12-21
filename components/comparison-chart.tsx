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
import type { ChartFormatType, CityData, CityMetrics } from "@/lib/types";
import { calculateAverageMetrics } from "@/lib/format-acfr-data";
import { chartFormatters } from "@/lib/chart-utils";
import { chartConfigs } from "@/lib/chart-configs";

interface ComparisonChartProps {
  cities: CityData[];
  allCities: CityData[];
  metricKey: keyof CityMetrics;
  title: string;
  description: string;
  formatType?: ChartFormatType;
  showAverage?: boolean;
}

const CITY_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function ComparisonChart({
  cities,
  allCities,
  metricKey,
  title,
  description,
  formatType = "percent",
}: ComparisonChartProps) {
  const formatter = chartFormatters[formatType];
  const averageMetrics = calculateAverageMetrics(
    allCities.map((c) => c.financialData)
  );
  const chartConfig = chartConfigs[metricKey];

  // Get all unique years
  const years = new Set<number>();
  cities.forEach((city) => {
    city.financialData.forEach((data) => years.add(data.fiscalYear));
  });
  const sortedYears = Array.from(years).sort();

  // Prepare chart data
  const chartData = sortedYears.map((year) => {
    const dataPoint: any = { year };

    cities.forEach((city) => {
      const yearIndex = city.financialData.findIndex(
        (d) => d.fiscalYear === year
      );
      if (yearIndex !== -1) {
        dataPoint[city.info.id] = city.metrics[yearIndex][metricKey] as number;
      }
    });

    // Add average
    const avgIndex = averageMetrics.findIndex((_, i) => {
      const allYears = cities[0].financialData.map((d) => d.fiscalYear);
      return allYears[i] === year;
    });

    if (avgIndex !== -1) {
      dataPoint.average = averageMetrics[avgIndex][metricKey] as number;
    }

    return dataPoint;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex">
        <ChartContainer className="w-full min-h-[250px]">
          <ResponsiveContainer>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="year" className="text-xs" />
              <YAxis
                tickFormatter={formatter}
                className="text-xs"
                domain={chartConfig.range}
              />
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
                  key={city.info.id}
                  type="monotone"
                  dataKey={city.info.id}
                  stroke={CITY_COLORS[index % CITY_COLORS.length]}
                  strokeWidth={2}
                  name={city.info.name}
                  dot={{ r: 4 }}
                />
              ))}

              {averageMetrics.length && (
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
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mb-10">
          {chartConfig.positiveDirection == "up" ? (
            <div className="h-full w-[15px] bg-gradient-to-b from-blue-300 to-orange-300 rounded-sm" />
          ) : (
            <div className="h-full w-[15px] bg-gradient-to-b from-orange-300 to-blue-300 rounded-sm" />
          )}
        </div>
        <div className="mb-10 hidden md:block">
          <div className="h-full py-2 px-1 flex flex-col justify-between text-center text-[11px]">
            <div>{chartConfig.upwardDescription}</div>
            <div>{chartConfig.downwardDescription}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
