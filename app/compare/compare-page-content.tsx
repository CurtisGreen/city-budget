"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CitySelector } from "@/components/city-selector";
import { ComparisonChart } from "@/components/comparison-chart";
import { ComparisonTable } from "@/components/comparison-table";
import { chartConfigs } from "@/lib/chart-configs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, ArrowLeft } from "lucide-react";
import { ChartFormatType, CityData, CityMetrics } from "@/lib/types";
import { Footer } from "@/components/footer";
import { LogoButton } from "@/components/ui/logo-button";
import { PopulationChart } from "@/components/population-chart";

const metricConfigs: {
  key: keyof CityMetrics;
  formatType: ChartFormatType;
}[] = [
  { key: "financialAssetsToLiabilities", formatType: "percent" },
  { key: "assetsToLiabilities", formatType: "percent" },
  { key: "netDebtToRevenue", formatType: "percent" },
  { key: "interestToRevenue", formatType: "percent" },
  { key: "netBookValueToCostOfTCA", formatType: "percent" },
  { key: "externalTransfersToRevenue", formatType: "percent" },
];

export function ComparePageContent({ allCities }: { allCities: CityData[] }) {
  const getCityData = (cityId: string) =>
    allCities.find((city) => city.info.id === cityId);
  const searchParams = useSearchParams();

  const [selectedCityIds, setSelectedCityIds] = useState<string[]>([]);

  useEffect(() => {
    const citiesParam = searchParams.get("cities");
    if (citiesParam) {
      const cityIds = citiesParam.split(",").filter((id) => getCityData(id));
      setSelectedCityIds(cityIds);
    }
  }, [searchParams]);

  const selectedCities = selectedCityIds
    .map((id) => getCityData(id))
    .filter(Boolean) as CityData[];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <LogoButton />
            <nav className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" className="cursor-pointer">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Home
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-2">Compare Cities</h2>
          <p className="text-xl text-muted-foreground">
            Select up to 4 cities to compare their financial metrics side by
            side
          </p>
        </div>
      </section>

      {/* City Selection */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-xl">
            <label className="block text-sm font-medium mb-2">
              Select Cities to Compare
            </label>
            <CitySelector
              cities={allCities.toSorted((a, b) =>
                a.info.id.localeCompare(b.info.id)
              )}
              selectedCities={selectedCityIds}
              onSelectionChange={setSelectedCityIds}
              maxSelections={4}
            />
            <p className="text-sm text-muted-foreground mt-2">
              {selectedCities.length} of 4 cities selected
              {selectedCities.length < 2 && " (select at least 2 cities)"}
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Content */}
      {selectedCities.length >= 2 ? (
        <>
          {/* Comparison Table */}
          <section className="py-8">
            <div className="container mx-auto px-4">
              <ComparisonTable cities={selectedCities} />
            </div>
          </section>

          {/* Comparison Charts */}
          <section className="py-8 bg-muted/30">
            <div className="container mx-auto px-4">
              <h3 className="text-2xl font-bold mb-6">
                Financial Metrics Comparison
              </h3>

              {metricConfigs.map((metricConfig) => (
                <div
                  className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6"
                  key={metricConfig.key}
                >
                  <div className="lg:col-span-2">
                    <ComparisonChart
                      cities={selectedCities}
                      allCities={allCities}
                      metricKey={metricConfig.key}
                      title={chartConfigs[metricConfig.key].title}
                      description={chartConfigs[metricConfig.key].description}
                      formatType={metricConfig.formatType}
                    />
                  </div>

                  <Card className="bg-muted/30">
                    <CardHeader>
                      <CardTitle className="text-base">
                        What This Means
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-1">
                          Understanding the Metric
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {chartConfigs[metricConfig.key].whatItMeans}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">
                          What to Look For
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {chartConfigs[metricConfig.key].whatToLookFor}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </section>

          <section className="py-8 bg-muted/30">
            <div className="container mx-auto px-4">
              <h3 className="text-2xl font-bold mb-6">
                Other Metrics Comparison
              </h3>

              <PopulationChart cityInfos={selectedCities.map((c) => c.info)} />
            </div>
          </section>
        </>
      ) : (
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-lg text-muted-foreground">
              Select at least 2 cities to start comparing
            </p>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
