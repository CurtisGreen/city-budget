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
import { chartFormatters } from "@/lib/chart-utils";

interface FinancialChartProps {
  cityData: CityData;
  averageCityMetrics: CityMetrics[];
  metricKey: keyof CityData["metrics"][0];
  title: string;
  description: string;
  formatType?: ChartFormatType;
}

export function FinancialChart({
  cityData,
  metricKey,
  averageCityMetrics,
  title,
  description,
  formatType = "percent",
}: FinancialChartProps) {
  // Prepare chart data
  const chartData = cityData.metrics.map((metric, index) => ({
    year: cityData.financialData[index].fiscalYear,
    cityValue: metric[metricKey] as number,
    average: averageCityMetrics[index]?.[metricKey] as number,
  }));

  const formatter = chartFormatters[formatType];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer>
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
              <Line
                type="monotone"
                dataKey="cityValue"
                strokeWidth={2}
                name={cityData.info.name}
                dot={{ r: 4 }}
              />
              {averageCityMetrics.length && (
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
      </CardContent>
    </Card>
  );
}
