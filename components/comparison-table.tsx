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
import Link from "next/link";

interface ComparisonTableProps {
  cities: CityData[];
}

export function ComparisonTable({ cities }: ComparisonTableProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);

  const formatPercent = (value: number, decimals: number = 1) =>
    (value * 100).toFixed(decimals) + "%";

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
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
                <TableHead className="font-semibold"></TableHead>
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
                <TableCell className="font-medium">
                  Population Density
                </TableCell>
                {cities.map((city) => (
                  <TableCell key={city.info.id} className="text-center">
                    {formatNumber(city.info.population / city.info.area)}
                  </TableCell>
                ))}
              </TableRow>
              {/* <TableRow>
                <TableCell className="font-medium">Property Tax Rate</TableCell>
                {cities.map((city) => (
                  <TableCell key={city.info.id} className="text-center">
                    {formatPercent(city.info.propertyTaxRate / 100)}
                  </TableCell>
                ))}
              </TableRow> */}
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
              {/* <TableRow>
                <TableCell className="font-medium">
                  Financial Assets / Liabilities
                </TableCell>
                {cities.map((city) => {
                  const latest = city.metrics[city.metrics.length - 1];
                  return (
                    <TableCell key={city.info.id} className="text-center">
                      {formatPercent(latest.financialAssetsToLiabilities, 0)}
                    </TableCell>
                  );
                })}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Assets / Liabilities
                </TableCell>
                {cities.map((city) => {
                  const latest = city.metrics[city.metrics.length - 1];
                  return (
                    <TableCell key={city.info.id} className="text-center">
                      {formatPercent(latest.assetsToLiabilities, 0)}
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
                      {formatPercent(latest.netDebtToRevenue, 0)}
                    </TableCell>
                  );
                })}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Interest / Revenue
                </TableCell>
                {cities.map((city) => {
                  const latest = city.metrics[city.metrics.length - 1];
                  return (
                    <TableCell key={city.info.id} className="text-center">
                      {formatPercent(latest.interestToRevenue)}
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
              </TableRow> */}
            </TableBody>
          </Table>
        </div>
        <div className="text-sm text-muted-foreground mt-4">
          Population from{" "}
          <Link
            href="https://rdc.dfwmaps.com/pdfs/2025%20NCTCOG%20Population%20Estimates%20Publication.pdf"
            className="underline"
          >
            NCTCOG 2025 estimate
          </Link>
          , all other stats from the city's Annual Comprehensive Financial
          Report (ACFR) and budget
        </div>
      </CardContent>
    </Card>
  );
}
