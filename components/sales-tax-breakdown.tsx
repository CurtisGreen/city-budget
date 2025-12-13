"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts"
import type { CityInfo } from "@/lib/types"

interface SalesTaxBreakdownProps {
  cityInfo: CityInfo
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

export function SalesTaxBreakdown({ cityInfo }: SalesTaxBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Sales Tax Spending Breakdown</CardTitle>
        <CardDescription>How {cityInfo.name} allocates sales tax revenue</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            amount: {
              label: "Amount",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cityInfo.salesTaxBreakdown} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
              <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} className="text-xs" />
              <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`} className="text-xs" />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name, entry) => {
                      const amount = new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        notation: "compact",
                        maximumFractionDigits: 1,
                      }).format(value as number)
                      return [`${amount} (${entry.payload.percentage}%)`, entry.payload.category]
                    }}
                  />
                }
              />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                {cityInfo.salesTaxBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {cityInfo.salesTaxBreakdown.map((item, index) => (
            <div key={item.category} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span className="text-sm">
                {item.category}: {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
