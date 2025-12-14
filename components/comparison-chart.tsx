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
import type { CityData } from "@/lib/types";
import { calculateAverageMetrics } from "@/lib/format-acfr-data";

interface ComparisonChartProps {
  cities: CityData[];
  metricKey: keyof CityData["metrics"][0];
  title: string;
  description: string;
  formatValue?: (value: number) => string;
}

const CITY_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function ComparisonChart({
  cities,
  metricKey,
  title,
  description,
  formatValue,
}: ComparisonChartProps) {
  console.log(cities);
  const averageMetrics = calculateAverageMetrics(
    cities.map((c) => c.financialData)
  );

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

  const defaultFormatter = (value: number) => {
    if (Math.abs(value) >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    } else if (Math.abs(value) >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1 || value <= -1) {
      return value.toFixed(2);
    } else {
      return (value * 100).toFixed(1) + "%";
    }
  };

  const formatter = formatValue || defaultFormatter;

  const config: any = {};
  cities.forEach((city, index) => {
    config[city.info.id] = {
      label: city.info.name,
      color: CITY_COLORS[index % CITY_COLORS.length],
    };
  });
  config.average = {
    label: "Average",
    color: "var(--chart-3)",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="year" className="text-xs" />
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
                  key={city.info.id}
                  type="monotone"
                  dataKey={city.info.id}
                  stroke={CITY_COLORS[index % CITY_COLORS.length]}
                  strokeWidth={2}
                  name={city.info.name}
                  dot={{ r: 4 }}
                />
              ))}

              <Line
                type="monotone"
                dataKey="average"
                // stroke="var(--color-average)"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Average"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
