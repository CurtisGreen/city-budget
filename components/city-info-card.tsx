import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CityData } from "@/lib/types";
import { Users, DollarSign, TrendingUp, Building } from "lucide-react";

interface CityInfoCardProps {
  cityData: CityData;
}

export function CityInfoCard({ cityData }: CityInfoCardProps) {
  const latestYear = cityData.financialData[cityData.financialData.length - 1];
  const fiveYearsAgoMetrics = cityData.metrics[cityData.metrics.length - 6];
  const latestMetrics = cityData.metrics[cityData.metrics.length - 1];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return (value * 100).toFixed(2) + "%";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>City Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Population</p>
              <p className="text-lg font-semibold">
                {cityData.info.population.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-lg font-semibold">
                {formatCurrency(latestYear.totalRevenue)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">
                Net Financial Position change over 5 years
              </p>
              <p className="text-lg font-semibold">
                {formatPercent(
                  (latestMetrics.netFinancialPosition -
                    fiveYearsAgoMetrics.netFinancialPosition) /
                    Math.abs(fiveYearsAgoMetrics.netFinancialPosition)
                )}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Total Assets</p>
              <p className="text-lg font-semibold">
                {formatCurrency(latestYear.capitalAssets)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
