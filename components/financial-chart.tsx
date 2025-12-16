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
import { chartExplanations } from "@/lib/chart-explanations";

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
      <CardContent className="flex">
        <ChartContainer className="w-full">
          {/* <ResponsiveContainer width="100%" height="100%"> */}
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
          {/* </ResponsiveContainer> */}
        </ChartContainer>
        <div className="mb-10">
          {chartExplanations[metricKey].positiveDirection == "up" ? (
            <div className="h-full w-[15px] bg-gradient-to-b from-blue-300 to-orange-300 rounded-sm" />
          ) : (
            <div className="h-full w-[15px] bg-gradient-to-b from-orange-300 to-blue-300 rounded-sm" />
          )}
        </div>
        <div className="mb-10">
          <div className="h-full py-2 px-1 flex flex-col justify-between text-center text-[11px]">
            <div>{chartExplanations[metricKey].upwardDescription}</div>
            <div>{chartExplanations[metricKey].downwardDescription}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
