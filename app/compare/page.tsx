import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllCities } from "@/lib/city-data-source";
import { ComparePageContent } from "./compare-page-content";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Budget.City - Compare",
};

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
