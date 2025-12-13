"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CitySelector } from "@/components/city-selector";
import { ComparisonChart } from "@/components/comparison-chart";
import { ComparisonTable } from "@/components/comparison-table";
import { getAllCities, getCityData } from "@/lib/mock-data";
import { chartExplanations } from "@/lib/chart-explanations";
import { BarChart3, ArrowLeft } from "lucide-react";

function ComparePageContent() {
  const searchParams = useSearchParams();
  const allCities = getAllCities();

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
    .filter(Boolean) as any[];

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
              cities={allCities}
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

              <div className="space-y-8">
                <ComparisonChart
                  cities={selectedCities}
                  metricKey="netFinancialPosition"
                  title={chartExplanations.netFinancialPosition.title}
                  description={
                    chartExplanations.netFinancialPosition.description
                  }
                />

                <ComparisonChart
                  cities={selectedCities}
                  metricKey="financialAssetsToLiabilities"
                  title={chartExplanations.financialAssetsToLiabilities.title}
                  description={
                    chartExplanations.financialAssetsToLiabilities.description
                  }
                />

                <ComparisonChart
                  cities={selectedCities}
                  metricKey="assetsToLiabilities"
                  title={chartExplanations.totalAssetsToLiabilities.title}
                  description={
                    chartExplanations.totalAssetsToLiabilities.description
                  }
                />

                <ComparisonChart
                  cities={selectedCities}
                  metricKey="netDebtToRevenue"
                  title={chartExplanations.netDebtToRevenue.title}
                  description={chartExplanations.netDebtToRevenue.description}
                />

                <ComparisonChart
                  cities={selectedCities}
                  metricKey="interestToRevenue"
                  title={chartExplanations.interestToRevenue.title}
                  description={chartExplanations.interestToRevenue.description}
                />

                <ComparisonChart
                  cities={selectedCities}
                  metricKey="netBookValueToCostOfTCA"
                  title={chartExplanations.netBookValueToCost.title}
                  description={chartExplanations.netBookValueToCost.description}
                />

                <ComparisonChart
                  cities={selectedCities}
                  metricKey="externalTransfersToRevenue"
                  title={chartExplanations.governmentTransfersToRevenue.title}
                  description={
                    chartExplanations.governmentTransfersToRevenue.description
                  }
                />
              </div>
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

      {/* Footer */}
      <footer className="border-t py-8 bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Budget.City - Making municipal finances transparent and accessible
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading comparison...</p>
        </div>
      }
    >
      <ComparePageContent />
    </Suspense>
  );
}
