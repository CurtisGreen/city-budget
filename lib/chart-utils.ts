import { ChartFormatType } from "./types";

const formatPercent = (value: number, maximumFractionDigits: number = 1) => {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    notation: "compact",
    maximumFractionDigits,
  }).format(value);
};

const formatCurrency = (value: number, maximumFractionDigits: number = 1) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits,
  }).format(value);
};

const formatNumber = (value: number, maximumFractionDigits: number = 1) => {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    notation: "compact",
    maximumFractionDigits,
  }).format(value);
};

export const chartFormatters: Record<
  ChartFormatType,
  (value: number, maximumFractionDigits?: number) => string
> = {
  percent: formatPercent,
  number: formatNumber,
  currency: formatCurrency,
};
