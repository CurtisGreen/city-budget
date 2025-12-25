import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CityInfoCard } from "@/components/city-info-card";
import { getCityData, getAllCities } from "@/lib/city-data-source";
import { chartConfigs } from "@/lib/chart-configs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, GitCompare } from "lucide-react";
import { ChartFormatType, CityMetrics } from "@/lib/types";
import { Footer } from "@/components/footer";
import { ComparisonChart } from "@/components/comparison-chart";
import { LogoButton } from "@/components/ui/logo-button";
import { PopulationChart } from "@/components/population-chart";
import { PropertyTaxRateChart } from "@/components/property-tax-rate-chart";
import { ChartExplanationCard } from "@/components/chart-explanation-card";
import { PropertyTaxesPaidChart } from "@/components/property-tax-spent-chart";

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
            <LogoButton />
            <nav className="flex items-center gap-4">
              <Link href="/" className="hidden sm:block">
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
                </div>
                <ChartExplanationCard
                  understandingTheMetric={chartConfigs[config.key].whatItMeans}
                  whatToLookFor={chartConfigs[config.key].whatToLookFor}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Population chart */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold mb-6">Other Metrics</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PopulationChart
              title="Population"
              cities={[{ ...cityData.info, data: cityData.info.populations }]}
            />
            {cityData.info.area && (
              <PopulationChart
                title="Population Density"
                subtitle="Population per square mile"
                cities={[
                  {
                    ...cityData.info,
                    data: cityData.info.populations.map((p) => ({
                      value: p.value / cityData.info.area,
                      year: p.year,
                    })),
                  },
                ]}
              />
            )}
          </div>
          {cityData.info.propertyValues && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2">
                  <PropertyTaxRateChart
                    propertyValues={cityData.info.propertyValues}
                  />
                </div>
                <ChartExplanationCard
                  understandingTheMetric="M&O stands for Maintenance and Operations, I&S stands for
                      Interest and Sinking The I&S portion is dedicated to
                      paying off bonds or other long-term debt."
                  whatToLookFor="A rising I&S rate means more money has been borrowed,
                      resulting in less flexibility on the tax rate. If the cost
                      of providing services rises faster than property values
                      then an increased tax rate could be necessary to provide
                      the same level of service. The same is true of the
                      inverse."
                />
              </div>
              {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2">
                  <PropertyTaxesPaidChart
                    propertyValues={cityData.info.propertyValues}
                  />
                </div>
                <ChartExplanationCard
                  understandingTheMetric="Annual city tax bill for the property of the average single family house. 
                  This does not take into account senior/disabled homestead exemptions."
                  whatToLookFor="Property taxes are paid to the city, county, and ISD to fund services. 
                  This chart shows the city's portion. The rate, value, market value, and prevailing incomes
                   are all important variables to understand."
                />
              </div> */}
            </>
          )}
        </div>
      </section>

      {/* Sales Tax Breakdown */}
      {/* <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold mb-6">Revenue Allocation</h3>
          <SalesTaxBreakdown cityInfo={cityData.info} />
        </div>
      </section> */}

      <Footer />
    </div>
  );
}
