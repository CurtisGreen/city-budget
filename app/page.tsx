import { CityCard } from "@/components/city-card";
import { getAllCities } from "@/lib/city-data-source";
import { Footer } from "@/components/footer";
import { HomeNavbarMenu } from "@/components/home-navbar-menu";
import { LazyMap } from "@/components/lazy-map";
import { CityLeaderboard } from "@/components/city-leaderboard";
import { calculateDFWData } from "@/lib/format-chart-data";

export const dynamic = "force-static";

export default function HomePage() {
  const cities = getAllCities();
  const dfwData = calculateDFWData(cities);

  return (
    <div className="min-h-screen">
      <HomeNavbarMenu />

      <section id="map" className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-2 text-center">
              Texas Financial Map
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              Change the dropdown to see different stats, or click on a city to
              visit their page
            </p>
            <div className="m-auto">
              <LazyMap cities={cities} />
            </div>
          </div>
        </div>
      </section>

      <section id="leaderboard" className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Financial Leaders
          </h2>
          <CityLeaderboard cities={cities} />
        </div>
      </section>

      <section id="cities" className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">DFW Cities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            <CityCard city={dfwData} highlight />
            {cities
              .filter((city) => city.info.category === "DFW")
              .toSorted(
                (a, b) =>
                  (b.info.populations.at(-1)?.value ?? 0) -
                  (a.info.populations.at(-1)?.value ?? 0),
              )
              .map((city) => (
                <CityCard key={city.info.id} city={city} />
              ))}
          </div>
        </div>
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Houston Metro Cities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {cities
              .filter((city) => city.info.category === "Houston Metro")
              .toSorted(
                (a, b) =>
                  (b.info.populations.at(-1)?.value ?? 0) -
                  (a.info.populations.at(-1)?.value ?? 0),
              )
              .map((city) => (
                <CityCard key={city.info.id} city={city} />
              ))}
          </div>
        </div>
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Austin Metro Cities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {cities
              .filter((city) => city.info.category === "Austin Metro")
              .toSorted(
                (a, b) =>
                  (b.info.populations.at(-1)?.value ?? 0) -
                  (a.info.populations.at(-1)?.value ?? 0),
              )
              .map((city) => (
                <CityCard key={city.info.id} city={city} />
              ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
