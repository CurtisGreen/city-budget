import { CityMap } from "@/components/city-map";
import { CityCard } from "@/components/city-card";
import { Button } from "@/components/ui/button";
import { getAllCities } from "@/lib/mock-data";
import Link from "next/link";
import { BarChart3, Map, TrendingUp } from "lucide-react";

export default function HomePage() {
  const cities = getAllCities();

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
                <Button variant="ghost">Home</Button>
              </Link>
              <Link href="/compare">
                <Button variant="ghost">Compare Cities</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
              City Financial Data Visualized
            </h2>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              Compare budgets, debt levels, and spending patterns across
              Dallas-area cities.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="#map">
                <Button size="lg" className="gap-2">
                  <Map className="h-5 w-5" />
                  Explore Map
                </Button>
              </Link>
              <Link href="#cities">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 bg-transparent"
                >
                  <TrendingUp className="h-5 w-5" />
                  View Cities
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics Overview */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {cities.length}
              </div>
              <div className="text-muted-foreground">Cities Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">7</div>
              <div className="text-muted-foreground">Financial Metrics</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">10</div>
              <div className="text-muted-foreground">Years of Data</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map */}
      <section id="map" className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold mb-2 text-center">
              Dallas Area Financial Map
            </h3>
            <p className="text-muted-foreground text-center mb-8">
              Cities colored by net debt to revenue ratio. Click on a city to
              view detailed financial information.
            </p>
            <CityMap cities={cities} />
          </div>
        </div>
      </section>

      {/* City Cards */}
      <section id="cities" className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-8 text-center">
            City Financial Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => (
              <CityCard key={city.info.id} city={city} />
            ))}
          </div>
        </div>
      </section>

      {/* What We Track */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-8 text-center">
              Financial Metrics We Track
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-lg border">
                <h4 className="font-semibold mb-2">Net Financial Position</h4>
                <p className="text-sm text-muted-foreground">
                  Overall financial health showing total assets minus total
                  liabilities.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <h4 className="font-semibold mb-2">Asset Ratios</h4>
                <p className="text-sm text-muted-foreground">
                  How financial and total assets compare to liabilities for
                  solvency analysis.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <h4 className="font-semibold mb-2">Debt Metrics</h4>
                <p className="text-sm text-muted-foreground">
                  Net debt to revenue and interest expense ratios show debt
                  sustainability.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <h4 className="font-semibold mb-2">Infrastructure Health</h4>
                <p className="text-sm text-muted-foreground">
                  Net book value shows the condition and age of city
                  infrastructure.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <h4 className="font-semibold mb-2">Revenue Sources</h4>
                <p className="text-sm text-muted-foreground">
                  Government transfers show dependency on external funding
                  sources.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <h4 className="font-semibold mb-2">Spending Breakdown</h4>
                <p className="text-sm text-muted-foreground">
                  Where sales tax revenue goes - public safety, transportation,
                  parks, and more.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Budget.City - Making municipal finances transparent and accessible
          </p>
          <p className="mt-2">
            Data sourced from municipal financial reports and audited statements
          </p>
        </div>
      </footer>
    </div>
  );
}
