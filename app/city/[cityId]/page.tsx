import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SalesTaxBreakdown } from "@/components/sales-tax-breakdown";
import { CityInfoCard } from "@/components/city-info-card";
import { getCityData, getAllCities } from "@/lib/city-data-source";
import { chartConfigs } from "@/lib/chart-configs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, ArrowLeft, GitCompare } from "lucide-react";
import { calculateAverageMetrics } from "@/lib/format-acfr-data";
import { ChartFormatType, CityMetrics } from "@/lib/types";
import { Footer } from "@/components/footer";
import { ComparisonChart } from "@/components/comparison-chart";

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

const metricConfigs: {
  key: keyof CityMetrics;
  formatType: ChartFormatType;
  showAverage: boolean;
}[] = [
  {
    key: "netFinancialPosition",
    formatType: "currency",
    showAverage: false,
  },
  {
    key: "financialAssetsToLiabilities",
    formatType: "percent",
    showAverage: true,
  },
  {
    key: "assetsToLiabilities",
    formatType: "percent",
    showAverage: true,
  },
  { key: "netDebtToRevenue", formatType: "number", showAverage: true },
  {
    key: "interestToRevenue",
    formatType: "percent",
    showAverage: true,
  },
  {
    key: "netBookValueToCostOfTCA",
    formatType: "percent",
    showAverage: true,
  },
  {
    key: "externalTransfersToRevenue",
    formatType: "percent",
    showAverage: true,
  },
];

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
                <Button variant="ghost" className="cursor-pointer">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Home
                </Button>
              </Link>
              <Link href={`/compare?cities=${cityId}`}>
                <Button
                  variant="outline"
                  className="bg-transparent cursor-pointer"
                >
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
            {metricConfigs.map((config) => (
              <div
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                key={config.key}
              >
                <div className="lg:col-span-2">
                  <ComparisonChart
                    cities={[cityData]}
                    allCities={config.showAverage ? allCities : []}
                    metricKey={config.key}
                    title={chartConfigs[config.key].title}
                    description={chartConfigs[config.key].description}
                    formatType={config.formatType}
                  />
                  {/* <FinancialChart
                    cityData={cityData}
                    averageCityMetrics={
                      config.showAverage ? averageCityMetrics : []
                    }
                    metricKey={config.key}
                    title={chartConfigs[config.key].title}
                    description={chartConfigs[config.key].description}
                    formatType={config.formatType}
                  /> */}
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
                        {chartConfigs[config.key].whatItMeans}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">
                        What to Look For
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {chartConfigs[config.key].whatToLookFor}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
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

      <Footer />
    </div>
  );
}
