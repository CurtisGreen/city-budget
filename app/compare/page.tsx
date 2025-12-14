import { Suspense } from "react";
import { getAllCities } from "@/lib/mock-data";
import { ComparePageContent } from "./compare-page-content";

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
