import { Suspense } from "react";
import { getAllCities } from "@/lib/city-data-source";
import { ComparePageContent } from "./compare-page-content";

export const dynamic = "force-static";

export default function ComparePage() {
  const allCities = getAllCities();
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading comparison...</p>
        </div>
      }
    >
      <ComparePageContent allCities={allCities} />
    </Suspense>
  );
}
