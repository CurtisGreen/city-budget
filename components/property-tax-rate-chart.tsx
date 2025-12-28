"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { PropertyValues } from "@/lib/types";

export const PropertyTaxRateChart = ({
  propertyValues,
}: {
  propertyValues: PropertyValues[];
}) => {
  const data = propertyValues.map((pv) => ({
    ...pv,
    Operations: pv.moRate,
    "Debt Service": pv.isRate,
    "Total rate": Number((pv.moRate + pv.isRate).toFixed(4)),
  }));
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Property Tax Rate</CardTitle>
        <CardDescription>
          The city's portion of the property tax rate
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BarChart
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
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fiscalYear" />
          <YAxis width="auto" />
          <Tooltip />
          <Legend />
          <Bar dataKey="Operations" stackId="a" fill="var(--chart-1)" />
          <Bar dataKey="Debt Service" stackId="a" fill="var(--chart-2)" />
          <Line
            type="monotone"
            dataKey="Total rate"
            stroke="var(--chart-3)"
            strokeWidth={3}
          />
        </BarChart>
      </CardContent>
    </Card>
  );
};
