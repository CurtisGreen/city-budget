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
  "var(--muted-foreground)",
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

const partitionCategories = (
  data: Record<string, number>[],
  categories: string[],
) => {
  const getTotal = (c: string) => data.reduce((s, r) => s + (r[c] ?? 0), 0);
  const sortedCategories = [...categories].sort(
    (a, b) => getTotal(b) - getTotal(a),
  );

  if (sortedCategories.length <= 6)
    return {
      topCategories: sortedCategories,
      otherCategories: [],
    };
  return {
    topCategories: sortedCategories.slice(0, 5),
    otherCategories: sortedCategories.slice(5),
  };
};

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

  const { topCategories, otherCategories } = partitionCategories(
    data,
    categories,
  );
  const colorFor = new Map(
    topCategories.map((c, i) => [c, COLORS[i % COLORS.length]]),
  );

  const chartData = data.map((row) => {
    const mappedRow: Record<string, number> = { fiscalYear: row.fiscalYear };
    for (const category of topCategories) {
      mappedRow[category] = row[category] ?? 0;
    }

    if (otherCategories.length)
      mappedRow["Other"] = otherCategories.reduce(
        (s, c) => s + (row[c] ?? 0),
        0,
      );
    return mappedRow;
  });

  const displayedCategories = otherCategories.length
    ? [...topCategories, "Other"]
    : topCategories;

  // Put the largest bars on the bottom of the stack
  const orderedData = [...displayedCategories].sort(
    (a, b) =>
      (chartData[chartData.length - 1][b] ?? 0) -
      (chartData[chartData.length - 1][a] ?? 0),
  );
  const fillFor = (c: string) =>
    c === "Other" ? "var(--muted-foreground)" : colorFor.get(c);

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
          stackOffset="sign"
          margin={{ top: 20, right: 20, left: 30, bottom: 20 }}
          className={`
            text-xs
            [&_.recharts-layer]:outline-hidden
            [&_.recharts-sector[stroke='#fff']]:stroke-transparent
            [&_.recharts-surface]:outline-hidden
          `}
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
          {/* Sort by the value of the last column in descending order */}
          <Legend
            itemSorter={(prop) => {
              const value = chartData[chartData.length - 1][prop.value || ""];
              return -1 * (value || 0);
            }}
          />
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
          {otherCategories.length > 0 && (
            <span className="flex items-center">
              Other
              <InfoTooltip
                message={`Includes ${otherCategories.join(", ")}`}
                size={4}
              />
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
