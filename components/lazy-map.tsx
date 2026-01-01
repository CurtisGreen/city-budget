"use client";

import dynamic from "next/dynamic";

export const LazyMap = dynamic(() => import("@/components/leaflet-map"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});
