"use client";

import { downloadACFR } from "@/lib/download-csv";
import { CityData } from "@/lib/types";
import { Download } from "lucide-react";

export const ACFRDownloadButton = ({ cityData }: { cityData: CityData }) => (
  <div
    className="hover:bg-accent hover:text-accent-foreground rounded-md py-1 px-2 transition-all cursor-pointer w-fit"
    onClick={() => downloadACFR(cityData)}
    title="Download ACFR data as CSV"
  >
    <Download className="h-5 w-5 text-muted-foreground" />
  </div>
);
