"use client";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  LineChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { PropertyValues } from "@/lib/types";
import { ChartTooltipContent } from "./ui/chart";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
};

export const PropertyTaxesPaidChart = ({
  propertyValues,
}: {
  propertyValues: PropertyValues[];
}) => {
  const data = propertyValues.map((pv) => ({
    ...pv,
    "Average SFH city tax bill": pv.averageSFHCityTaxesPaid,
  }));
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Average Property Taxes Paid</CardTitle>
        <CardDescription>
          Average annual city property tax bill for a single family house
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LineChart
          style={{
            width: "100%",
            maxHeight: "485px",
            aspectRatio: "16 / 9",
          }}
          responsive
          data={data}
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
          <Legend />
          <Line
            type="monotone"
            dataKey="Average SFH city tax bill"
            stroke="var(--chart-1)"
            strokeWidth={3}
          />
        </LineChart>
      </CardContent>
    </Card>
  );
};
