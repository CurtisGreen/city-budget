"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ChartTooltipContent } from "./ui/chart";
import { Tooltip as InfoTooltip } from "./ui/tooltip";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const OTHER = "Other";
const TOP_N = 5;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export const ExpenseBreakdownChart = ({
  title,
  description,
  data,
  categories,
  note,
}: {
  title: string;
  description: string;
  data: Record<string, number>[];
  categories: string[];
  note?: { label: string; detail: string };
}) => {
  if (data.length === 0) return null;

  // Keep the TOP_N categories by total across all years; fold the rest into "Other".
  const total = (c: string) => data.reduce((s, r) => s + (r[c] ?? 0), 0);
  const ranked = [...categories].sort((a, b) => total(b) - total(a));
  const kept = ranked.slice(0, TOP_N);
  const otherCats = ranked.slice(TOP_N);

  // Distinct color per shown category (kept ≤ TOP_N ≤ COLORS.length), stable by rank.
  const colorFor = new Map(kept.map((c, i) => [c, COLORS[i % COLORS.length]]));

  const chartData = data.map((row) => {
    const r: Record<string, number> = { fiscalYear: row.fiscalYear };
    for (const c of kept) r[c] = row[c] ?? 0;
    if (otherCats.length)
      r[OTHER] = otherCats.reduce((s, c) => s + (row[c] ?? 0), 0);
    return r;
  });
  const shown = otherCats.length ? [...kept, OTHER] : kept;

  // Stack largest first year value on the bottom, smallest on top
  const orderedData = [...shown].sort(
    (a, b) => (chartData[0][b] ?? 0) - (chartData[0][a] ?? 0),
  );
  const fillFor = (c: string) =>
    c === OTHER ? "var(--muted-foreground)" : colorFor.get(c);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <BarChart
          style={{
            width: "100%",
            maxHeight: "485px",
            aspectRatio: "16 / 9",
            minHeight: "250px",
          }}
          responsive
          data={chartData}
          stackOffset={"sign"}
          margin={{ top: 20, right: 20, left: 30, bottom: 20 }}
          className={"text-xs"}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="fiscalYear" />
          <YAxis width="auto" tickFormatter={formatCurrency} />
          <Tooltip
            content={
              <ChartTooltipContent
                formatter={(value) => formatCurrency(value as number)}
              />
            }
          />
          {/* Sort by the value of the first column in descending order */}
          <Legend itemSorter={(prop) => -1 * chartData[0][prop.value || ""]} />
          {orderedData.map((c) => (
            <Bar key={c} dataKey={c} stackId="a" fill={fillFor(c)} />
          ))}
        </BarChart>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
          {note && (
            <span className="flex items-center">
              {note.label}
              <InfoTooltip message={note.detail} size={4} />
            </span>
          )}
          {otherCats.length > 0 && (
            <span className="flex items-center">
              {OTHER}
              <InfoTooltip message={`Includes ${otherCats.join(", ")}`} size={4} />
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
