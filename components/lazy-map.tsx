"use client";

import dynamic from "next/dynamic";

export const LazyMap = dynamic(() => import("@/components/leaflet-map"), {
  ssr: false,
  loading: () => (
    <p className="h-[400px] md:h-[600px] lg:h-[650px] w-[300px] md:w-[700px] lg:w-[900px] rounded-md bg-muted flex items-center justify-center text-muted-foreground">
      Loading...
    </p>
  ),
});
