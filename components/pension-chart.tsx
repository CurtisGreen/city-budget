"use client";

import {
  Line,
  LineChart,
  ReferenceDot,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartTooltipContent } from "@/components/ui/chart";
import type { CityFinancialData } from "@/lib/types";
import { chartFormatters } from "@/lib/chart-utils";
import { chartConfigs } from "@/lib/chart-configs";

interface PensionChartProps {
  cityName: string;
  financialData: CityFinancialData[];
  metricKey: "pensionFundedRatio" | "adcCoverage";
}

const PLAN_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function PensionChart({
  cityName,
  financialData,
  metricKey,
}: PensionChartProps) {
  const formatter = chartFormatters.percent;
  const chartConfig = chartConfigs[metricKey];

  const planNames = [
    ...new Set(
      financialData.flatMap((d) => d.pensionPlans?.map((p) => p.name) ?? []),
    ),
  ];

  const chartData = financialData
    .filter((d) => d.pensionPlans?.length)
    .map((d) => {
      const row: Record<string, number> = { year: d.fiscalYear };
      for (const plan of d.pensionPlans!) {
        const value =
          metricKey === "pensionFundedRatio"
            ? plan.fiduciaryNetPosition / plan.totalPensionLiability
            : plan.actuariallyDeterminedContribution
              ? plan.actualContribution / plan.actuariallyDeterminedContribution
              : undefined;
        if (value !== undefined) row[plan.name] = value;
      }
      return row;
    });

  // Years above the capped axis (a pension obligation bond year) get pinned to the top edge with
  // their real value as a label, so clipping the axis never hides one.
  const yMax = chartConfig.range?.[1];
  const overflow =
    typeof yMax === "number"
      ? chartData.flatMap((row) =>
          planNames
            .filter((plan) => row[plan] > yMax)
            .map((plan) => ({ year: row.year, plan, value: row[plan] })),
        )
      : [];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">{chartConfig.title}</CardTitle>
        <CardDescription>{chartConfig.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex">
        <div
          className={`
            w-full
            aspect-video
            text-xs
            min-h-[250px]
            [&_.recharts-layer]:outline-hidden
            [&_.recharts-sector[stroke='#fff']]:stroke-transparent
            [&_.recharts-surface]:outline-hidden
            ml-[-10px]
          `}
        >
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            responsive
            className="h-full"
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="year" className="text-xs" />
            <YAxis
              tickFormatter={(value) => formatter(value, 0)}
              className="text-xs"
              domain={chartConfig.range}
              allowDataOverflow={chartConfig.range !== undefined}
            />
            <Tooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => formatter(value as number, 0)}
                />
              }
            />
            <Legend />

            {planNames.map((plan, index) => (
              <Line
                key={plan}
                type="monotone"
                dataKey={plan}
                stroke={PLAN_COLORS[index % PLAN_COLORS.length]}
                strokeWidth={2}
                name={`${cityName} - ${plan}`}
                dot={{ r: 4 }}
              />
            ))}

            {overflow.map(({ year, plan, value }, index, all) => (
              <ReferenceDot
                key={`${year}-${plan}`}
                x={year}
                y={yMax}
                r={4}
                fill={PLAN_COLORS[planNames.indexOf(plan) % PLAN_COLORS.length]}
                stroke="none"
                label={{
                  value: formatter(value, 0),
                  position: "top",
                  // stack labels when several plans overflow in the same year
                  dy:
                    all.slice(0, index).filter((o) => o.year === year).length *
                    -13,
                  fontSize: 10,
                  className: "fill-muted-foreground",
                }}
              />
            ))}
          </LineChart>
        </div>
        <div className="mb-10">
          <div className="h-full w-[15px] bg-gradient-to-b from-blue-300 to-orange-300 rounded-sm" />
        </div>
        <div className="mb-10 hidden md:block">
          <div className="h-full py-2 px-1 flex flex-col justify-between text-center text-[11px]">
            <div>{chartConfig.upwardDescription}</div>
            <div>{chartConfig.downwardDescription}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
