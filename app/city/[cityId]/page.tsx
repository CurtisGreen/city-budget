import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FinancialChart } from "@/components/financial-chart";
import { SalesTaxBreakdown } from "@/components/sales-tax-breakdown";
import { CityInfoCard } from "@/components/city-info-card";
import { getCityData, getAllCities } from "@/lib/mock-data";
import { chartExplanations } from "@/lib/chart-explanations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, ArrowLeft, GitCompare } from "lucide-react";
import { calculateAverageMetrics } from "@/lib/format-acfr-data";

interface CityPageProps {
  params: Promise<{
    cityId: string;
  }>;
}

export async function generateStaticParams() {
  const cities = getAllCities();
  return cities.map((city) => ({
    cityId: city.info.id,
  }));
}

export default async function CityPage({ params }: CityPageProps) {
  const { cityId } = await params;
  const allCities = getAllCities();
  const averageCityMetrics = calculateAverageMetrics(
    allCities.map((c) => c.financialData)
  );
  const cityData = getCityData(cityId);

  if (!cityData) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-8 w-8" />
              <h1 className="text-2xl font-bold">Budget.City</h1>
            </div>
            <nav className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Home
                </Button>
              </Link>
              <Link href={`/compare?cities=${cityId}`}>
                <Button variant="outline" className="bg-transparent">
                  <GitCompare className="mr-2 h-4 w-4" />
                  Compare
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* City Header */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-2">{cityData.info.name}</h2>
          <p className="text-xl text-muted-foreground">
            Financial Data & Analysis
          </p>
        </div>
      </section>

      {/* City Info */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <CityInfoCard cityData={cityData} />
        </div>
      </section>

      {/* Charts Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold mb-6">
            Financial Metrics Over Time
          </h3>

          <div className="space-y-12">
            {/* Net Financial Position */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <FinancialChart
                  cityData={cityData}
                  averageCityMetrics={[]}
                  metricKey="netFinancialPosition"
                  title={chartExplanations.netFinancialPosition.title}
                  description={
                    chartExplanations.netFinancialPosition.description
                  }
                />
              </div>
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-base">What This Means</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">
                      Understanding the Metric
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {chartExplanations.netFinancialPosition.whatItMeans}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">
                      What to Look For
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {chartExplanations.netFinancialPosition.whatToLookFor}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Financial Assets to Liabilities */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <FinancialChart
                  cityData={cityData}
                  averageCityMetrics={averageCityMetrics}
                  metricKey="financialAssetsToLiabilities"
                  title={chartExplanations.financialAssetsToLiabilities.title}
                  description={
                    chartExplanations.financialAssetsToLiabilities.description
                  }
                />
              </div>
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-base">What This Means</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">
                      Understanding the Metric
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {
                        chartExplanations.financialAssetsToLiabilities
                          .whatItMeans
                      }
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">
                      What to Look For
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {
                        chartExplanations.financialAssetsToLiabilities
                          .whatToLookFor
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Assets to Liabilities */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <FinancialChart
                  cityData={cityData}
                  averageCityMetrics={averageCityMetrics}
                  metricKey="assetsToLiabilities"
                  title={chartExplanations.assetsToLiabilities.title}
                  description={
                    chartExplanations.assetsToLiabilities.description
                  }
                />
              </div>
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-base">What This Means</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">
                      Understanding the Metric
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {chartExplanations.assetsToLiabilities.whatItMeans}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">
                      What to Look For
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {chartExplanations.assetsToLiabilities.whatToLookFor}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Net Debt to Revenue */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <FinancialChart
                  cityData={cityData}
                  averageCityMetrics={averageCityMetrics}
                  metricKey="netDebtToRevenue"
                  title={chartExplanations.netDebtToRevenue.title}
                  description={chartExplanations.netDebtToRevenue.description}
                />
              </div>
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-base">What This Means</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">
                      Understanding the Metric
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {chartExplanations.netDebtToRevenue.whatItMeans}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">
                      What to Look For
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {chartExplanations.netDebtToRevenue.whatToLookFor}
                    </p>
                  </div>
                  {chartExplanations.netDebtToRevenue.note && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Note</h4>
                      <p className="text-sm text-muted-foreground">
                        {chartExplanations.netDebtToRevenue.note}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Interest to Revenue */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <FinancialChart
                  cityData={cityData}
                  averageCityMetrics={averageCityMetrics}
                  metricKey="interestToRevenue"
                  title={chartExplanations.interestToRevenue.title}
                  description={chartExplanations.interestToRevenue.description}
                />
              </div>
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-base">What This Means</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">
                      Understanding the Metric
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {chartExplanations.interestToRevenue.whatItMeans}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">
                      What to Look For
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {chartExplanations.interestToRevenue.whatToLookFor}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Net Book Value to Cost */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <FinancialChart
                  cityData={cityData}
                  averageCityMetrics={averageCityMetrics}
                  metricKey="netBookValueToCostOfTCA"
                  title={chartExplanations.netBookValueToCostOfTCA.title}
                  description={
                    chartExplanations.netBookValueToCostOfTCA.description
                  }
                />
              </div>
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-base">What This Means</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">
                      Understanding the Metric
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {chartExplanations.netBookValueToCostOfTCA.whatItMeans}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">
                      What to Look For
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {chartExplanations.netBookValueToCostOfTCA.whatToLookFor}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Government Transfers to Revenue */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <FinancialChart
                  cityData={cityData}
                  averageCityMetrics={averageCityMetrics}
                  metricKey="externalTransfersToRevenue"
                  title={chartExplanations.externalTransfersToRevenue.title}
                  description={
                    chartExplanations.externalTransfersToRevenue.description
                  }
                />
              </div>
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-base">What This Means</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">
                      Understanding the Metric
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {chartExplanations.externalTransfersToRevenue.whatItMeans}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">
                      What to Look For
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {
                        chartExplanations.externalTransfersToRevenue
                          .whatToLookFor
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Sales Tax Breakdown */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold mb-6">Revenue Allocation</h3>
          <SalesTaxBreakdown cityInfo={cityData.info} />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Budget.City - Making municipal finances easy and accessible</p>
        </div>
      </footer>
    </div>
  );
}
