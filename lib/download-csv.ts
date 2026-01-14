import { CityData } from "./types";

export const downloadACFR = (cityData: CityData) => {
  // Format
  const headers = Object.keys(cityData.financialData[0]);
  const data = cityData.financialData.map((cm) =>
    Object.values(cm).map((v: number) => v.toString())
  );
  const csvString = [headers, ...data].map((row) => row.join(",")).join("\n");
  const blob = new Blob([csvString], { type: "text/csv" });

  // Download
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = cityData.info.id + "-acfr-metrics.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
