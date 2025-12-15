import { ChartFormatType } from "./types";

const formatPercent = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};

export const chartFormatters: Record<
  ChartFormatType,
  (value: number) => string
> = {
  percent: formatPercent,
  number: formatNumber,
  currency: formatCurrency,
};
