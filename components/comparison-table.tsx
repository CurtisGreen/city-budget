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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CityData } from "@/lib/types";

interface ComparisonTableProps {
  cities: CityData[];
}

export function ComparisonTable({ cities }: ComparisonTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return (value * 100).toFixed(2) + "%";
  };

  const formatRatio = (value: number) => {
    return value.toFixed(2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Comparison</CardTitle>
        <CardDescription>Latest year financial metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Metric</TableHead>
                {cities.map((city) => (
                  <TableHead
                    key={city.info.id}
                    className="text-center font-semibold"
                  >
                    {city.info.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Population</TableCell>
                {cities.map((city) => (
                  <TableCell key={city.info.id} className="text-center">
                    {city.info.population.toLocaleString()}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Property Tax Rate</TableCell>
                {cities.map((city) => (
                  <TableCell key={city.info.id} className="text-center">
                    {formatPercent(city.info.propertyTaxRate / 100)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Total Revenue</TableCell>
                {cities.map((city) => {
                  const latest =
                    city.financialData[city.financialData.length - 1];
                  return (
                    <TableCell key={city.info.id} className="text-center">
                      {formatCurrency(latest.totalRevenue)}
                    </TableCell>
                  );
                })}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Asset Life</TableCell>
                {cities.map((city) => {
                  const latest = city.metrics[city.metrics.length - 1];
                  return (
                    <TableCell key={city.info.id} className="text-center">
                      {formatPercent(latest.netBookValueToCostOfTCA)}
                    </TableCell>
                  );
                })}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Financial Assets / Liabilities
                </TableCell>
                {cities.map((city) => {
                  const latest = city.metrics[city.metrics.length - 1];
                  return (
                    <TableCell key={city.info.id} className="text-center">
                      {formatRatio(latest.financialAssetsToLiabilities)}
                    </TableCell>
                  );
                })}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Net Financial Position
                </TableCell>
                {cities.map((city) => {
                  const latest = city.metrics[city.metrics.length - 1];
                  return (
                    <TableCell key={city.info.id} className="text-center">
                      {formatCurrency(latest.netFinancialPosition)}
                    </TableCell>
                  );
                })}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  External Transfers / Revenue
                </TableCell>
                {cities.map((city) => {
                  const latest = city.metrics[city.metrics.length - 1];
                  return (
                    <TableCell key={city.info.id} className="text-center">
                      {formatPercent(latest.externalTransfersToRevenue)}
                    </TableCell>
                  );
                })}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Net Debt / Revenue
                </TableCell>
                {cities.map((city) => {
                  const latest = city.metrics[city.metrics.length - 1];
                  return (
                    <TableCell key={city.info.id} className="text-center">
                      {formatRatio(latest.netDebtToRevenue)}
                    </TableCell>
                  );
                })}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Interest/Revenue</TableCell>
                {cities.map((city) => {
                  const latest = city.metrics[city.metrics.length - 1];
                  return (
                    <TableCell key={city.info.id} className="text-center">
                      {formatPercent(latest.interestToRevenue)}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
