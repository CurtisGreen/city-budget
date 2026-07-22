import { CityData } from "./types";

export const downloadACFR = (cityData: CityData) => {
  const fileName = cityData.info.id + "-acfr-metrics.json";
  const jsonString = JSON.stringify(cityData.financialData, null, 2);
  const blob = new Blob([jsonString], { type: "text/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
