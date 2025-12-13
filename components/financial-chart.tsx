"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { CityData } from "@/lib/types"
import { calculateAverageMetrics } from "@/lib/csv-processor"
import { getAllCities } from "@/lib/mock-data"

interface FinancialChartProps {
  cityData: CityData
  metricKey: keyof CityData["metrics"][0]
  title: string
  description: string
  formatValue?: (value: number) => string
}

export function FinancialChart({ cityData, metricKey, title, description, formatValue }: FinancialChartProps) {
  const allCities = getAllCities()
  const averageMetrics = calculateAverageMetrics(allCities.map((c) => c.financialData))

  // Prepare chart data
  const chartData = cityData.metrics.map((metric, index) => ({
    year: cityData.financialData[index].year,
    cityValue: metric[metricKey] as number,
    average: averageMetrics[index]?.[metricKey] as number,
  }))

  const defaultFormatter = (value: number) => {
    if (Math.abs(value) >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`
    } else if (Math.abs(value) >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1 || value <= -1) {
      return value.toFixed(2)
    } else {
      return (value * 100).toFixed(1) + "%"
    }
  }

  const formatter = formatValue || defaultFormatter

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            cityValue: {
              label: cityData.info.name,
              color: "hsl(var(--chart-1))",
            },
            average: {
              label: "Average",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="year" className="text-xs" />
              <YAxis tickFormatter={formatter} className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatter(value as number)} />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="cityValue"
                stroke="var(--color-cityValue)"
                strokeWidth={2}
                name={cityData.info.name}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="average"
                stroke="var(--color-average)"
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
  )
}
