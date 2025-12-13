import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import type { CityData } from "@/lib/types"

interface CityCardProps {
  city: CityData
}

export function CityCard({ city }: CityCardProps) {
  const latestYear = city.financialData[city.financialData.length - 1]
  const latestMetrics = city.metrics[city.metrics.length - 1]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return (value * 100).toFixed(1) + "%"
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle>{city.info.name}</CardTitle>
        <CardDescription>Population: {city.info.population.toLocaleString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-lg font-semibold">{formatCurrency(latestYear.totalRevenue)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Net Debt/Revenue</p>
              <p className="text-lg font-semibold">{formatPercent(latestMetrics.netDebtToRevenue)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Property Tax Rate</p>
              <p className="text-lg font-semibold">{formatPercent(city.info.propertyTaxRate / 100)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Assets/Liabilities</p>
              <p className="text-lg font-semibold">{latestMetrics.totalAssetsToLiabilities.toFixed(2)}</p>
            </div>
          </div>

          <Link href={`/city/${city.info.id}`} className="block">
            <Button className="w-full mt-4 bg-transparent" variant="outline">
              View Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
