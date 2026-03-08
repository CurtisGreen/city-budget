"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { CityData, CityMetrics, ChartFormatType } from "@/lib/types";
import { Tooltip } from "./ui/tooltip";
import { chartConfigs } from "@/lib/chart-configs";

type MetricConfig = {
  key: keyof CityMetrics;
  formatType: ChartFormatType;
  maximumFractionDigits?: number;
};

const metricConfigs: MetricConfig[] = [
  {
    key: "netFinancialPosition",
    formatType: "currency",
  },
  {
    key: "financialAssetsToLiabilities",
    formatType: "percent",
    maximumFractionDigits: 0,
  },
  {
    key: "assetsToLiabilities",
    formatType: "percent",
    maximumFractionDigits: 0,
  },
  {
    key: "netDebtToRevenue",
    formatType: "percent",
    maximumFractionDigits: 0,
  },
  {
    key: "interestToRevenue",
    formatType: "percent",
  },
  {
    key: "netBookValueToCostOfTCA",
    formatType: "percent",
  },
  {
    key: "externalTransfersToRevenue",
    formatType: "percent",
  },
];

interface CityLeaderboardProps {
  cities: CityData[];
}

const formatValue = (
  value: number,
  format: ChartFormatType,
  maximumFractionDigits?: number,
) => {
  if (format === "percent") return (value * 100).toFixed(0) + "%";

  if (format === "currency") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: maximumFractionDigits ?? 1,
    }).format(value);
  }

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: maximumFractionDigits ?? 2,
  }).format(value);
};

const formatChange = (value: number) => (value * 100).toFixed(0) + "%";

const Trend = ({
  change,
  positiveDirection,
}: {
  change: number;
  positiveDirection: "up" | "down";
}) => {
  const isUp = change >= 0;

  const isPositive =
    (positiveDirection === "up" && isUp) ||
    (positiveDirection === "down" && !isUp);

  const Icon = isUp ? TrendingUp : TrendingDown;

  return (
    <div
      className={`flex items-center justify-center gap-1 ${
        isPositive ? "text-green-600" : "text-red-600"
      }`}
    >
      <Icon className="h-3 w-3" />
      {formatChange(change)}
    </div>
  );
};

export function CityLeaderboard({ cities }: CityLeaderboardProps) {
  const calculateLeaders = (
    metric: keyof CityMetrics,
    formatType: ChartFormatType,
  ) => {
    const getChange = (latest: number, old: number) => {
      if (formatType === "percent") return latest - old;
      if (old === 0) return 0;
      return (latest - old) / Math.abs(old);
    };

    const results = cities.map((city) => {
      const latest = city.metrics[city.metrics.length - 1];
      const fiveYearsAgo = city.metrics[city.metrics.length - 6];

      const latestValue = latest[metric];
      const oldValue = fiveYearsAgo[metric];

      return {
        city: city.info.name,
        latestValue,
        change: getChange(latestValue, oldValue),
      };
    });

    const direction = chartConfigs[metric].positiveDirection;
    const operation =
      direction === "up"
        ? (a: number, b: number) => a - b
        : (a: number, b: number) => b - a;

    return {
      best: [...results].sort((a, b) =>
        operation(b.latestValue, a.latestValue),
      )[0],
      worst: [...results].sort((a, b) =>
        operation(a.latestValue, b.latestValue),
      )[0],
      mostImproved: [...results].sort((a, b) =>
        operation(b.change, a.change),
      )[0],
      leastImproved: [...results].sort((a, b) =>
        operation(a.change, b.change),
      )[0],
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardDescription>
          Best, worst, and largest 5-year changes by metric
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Metric</TableHead>
                <TableHead className="text-center font-semibold">
                  Best
                </TableHead>
                <TableHead className="text-center font-semibold">
                  Worst
                </TableHead>
                <TableHead className="text-center font-semibold">
                  Most Improved (5yr)
                </TableHead>
                <TableHead className="text-center font-semibold">
                  Most Regressed (5yr)
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {metricConfigs.map(
                ({ key, formatType, maximumFractionDigits }) => {
                  const leaders = calculateLeaders(key, formatType);

                  return (
                    <TableRow key={key}>
                      <TableCell className="font-semibold">
                        <div className="flex items-center gap-1">
                          {chartConfigs[key].formula && (
                            <Tooltip message={chartConfigs[key].formula} />
                          )}
                          {chartConfigs[key].title}
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <div>{leaders.best.city}</div>
                        <div className="text-muted-foreground">
                          {formatValue(
                            leaders.best.latestValue,
                            formatType,
                            maximumFractionDigits,
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <div>{leaders.worst.city}</div>
                        <div className="text-muted-foreground">
                          {formatValue(
                            leaders.worst.latestValue,
                            formatType,
                            maximumFractionDigits,
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <div>{leaders.mostImproved.city}</div>
                        <Trend
                          change={leaders.mostImproved.change}
                          positiveDirection={
                            chartConfigs[key].positiveDirection
                          }
                        />
                      </TableCell>

                      <TableCell className="text-center">
                        <div>{leaders.leastImproved.city}</div>
                        <Trend
                          change={leaders.leastImproved.change}
                          positiveDirection={
                            chartConfigs[key].positiveDirection
                          }
                        />
                      </TableCell>
                    </TableRow>
                  );
                },
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
