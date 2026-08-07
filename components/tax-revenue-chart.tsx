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
import type { CityFinancialData } from "@/lib/types";
import { chartFormatters } from "@/lib/chart-utils";

interface TaxRevenueChartProps {
  financialData: CityFinancialData[];
}

export function TaxRevenueChart({ financialData }: TaxRevenueChartProps) {
  const series = [
    { key: "propertyTaxRevenue", name: "Property", color: "var(--chart-1)" },
    { key: "salesTaxRevenue", name: "Sales", color: "var(--chart-2)" },
    { key: "hotelTaxRevenue", name: "Hotel", color: "var(--chart-4)" },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Tax Revenue Over Time</CardTitle>
        <CardDescription>
          Property, sales, and hotel occupancy tax collected each year (not
          inflation adjusted)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`
            w-full
            aspect-video
            text-xs
            min-h-[250px]
            [&_.recharts-layer]:outline-hidden
            [&_.recharts-sector[stroke='#fff']]:stroke-transparent
            [&_.recharts-surface]:outline-hidden
            ml-[-10px]
          `}
        >
          <LineChart
            data={financialData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            responsive
            className="h-full"
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="fiscalYear" className="text-xs" />
            <YAxis
              tickFormatter={(value) => chartFormatters.currency(value)}
              className="text-xs"
            />
            <Tooltip
              content={
                <ChartTooltipContent
                  formatter={(value) =>
                    chartFormatters.currency(value as number, 2)
                  }
                />
              }
            />
            <Legend />

            {series.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                stroke={s.color}
                strokeWidth={2}
                name={s.name}
                dot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </div>
      </CardContent>
    </Card>
  );
}
