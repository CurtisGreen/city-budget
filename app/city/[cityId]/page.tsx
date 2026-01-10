import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CityInfoCard } from "@/components/city-info-card";
import { getCityData, getAllCities } from "@/lib/city-data-source";
import { chartConfigs } from "@/lib/chart-configs";
import { ArrowLeft, GitCompare } from "lucide-react";
import { ChartFormatType, CityMetrics } from "@/lib/types";
import { Footer } from "@/components/footer";
import { ComparisonChart } from "@/components/comparison-chart";
import { LogoButton } from "@/components/ui/logo-button";
import { PopulationChart } from "@/components/population-chart";
import { PropertyTaxRateChart } from "@/components/property-tax-rate-chart";
import { ChartExplanationCard } from "@/components/chart-explanation-card";
import { calculateAveragePopulationDensity } from "@/lib/format-chart-data";
import { PieChart } from "@/components/ui/pie-chart";
import { RevenueChart } from "@/components/revenue-chart";

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
  maximumFractionDigits?: number;
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
    maximumFractionDigits: 0,
  },
  {
    key: "assetsToLiabilities",
    formatType: "percent",
    showAverage: true,
    maximumFractionDigits: 0,
  },
  {
    key: "netDebtToRevenue",
    formatType: "percent",
    showAverage: true,
    maximumFractionDigits: 0,
  },
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

  const populationDensity = {
    ...cityData.info,
    data: cityData.info.populations.map((p) => ({
      value: p.value / cityData.info.area,
      year: p.year,
    })),
  };

  const averagePopulationDensity = calculateAveragePopulationDensity(
    allCities.map((c) => c.info)
  );

  const revenues = allCities.map((c) => c.info.revenueBySource);
  const property = revenues.reduce((acc, cur) => acc + cur.property, 0);
  const sales = revenues.reduce((acc, cur) => acc + cur.sales, 0);
  const hotel = revenues.reduce((acc, cur) => acc + cur.hotel, 0);

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
                    maximumFractionDigits={config.maximumFractionDigits}
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

      {/* Other metrics */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold mb-6">Other Metrics</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PopulationChart
              title="Population"
              subtitle="From US Census and latest NCTCOG estimates"
              cities={[{ ...cityData.info, data: cityData.info.populations }]}
            />
            <PopulationChart
              title="Population Density"
              subtitle="Population per square mile of land"
              cities={[populationDensity]}
              averageMetrics={averagePopulationDensity}
            />
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
                  understandingTheMetric="The debt service portion is dedicated to paying off 
                      bonds or other long-term debt.
                      The operations portion of the property tax rate 
                      is flexible and can be used as needed."
                  whatToLookFor="A rising debt service rate means more money has been borrowed,
                      resulting in less flexibility on the tax rate. If the cost
                      of providing services rises faster than property values,
                      then an increased tax rate could be necessary to provide
                      the same level of service. Similarly, property values rising 
                      faster than the cost of services can allow for a rate reduction."
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <PieChart
              title={"Revenue Mix (FY 2024)"}
              property={cityData.info.revenueBySource.property}
              sales={cityData.info.revenueBySource.sales}
              hotel={cityData.info.revenueBySource.hotel}
            />
            <RevenueChart
              revenues={[
                {
                  name: cityData.info.name,
                  revenue: cityData.info.revenueBySource,
                },
              ]}
              average={{ property, sales, hotel }}
            />
          </div>
        </div>
      </section>

      {/* Notes */}
      {cityData.info.notes && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl font-bold mb-6">Notes</h3>
            <ul className="ml-4">
              {cityData.info.notes.map((note) => (
                <li key={note} className="list-disc mb-2">
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
