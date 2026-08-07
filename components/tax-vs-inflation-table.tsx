import { Fragment } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { chartFormatters } from "@/lib/chart-utils";
import { cn } from "@/lib/utils";
import type { ExpenseChartData } from "@/lib/format-chart-data";
import type { CityFinancialData } from "@/lib/types";

const currency = (v?: number) => {
  if (v === undefined) return "-";
  // Show decimal if single digit: $1.3M -> $1.3M, $62.3M -> $62M
  const digits = chartFormatters.currency(v, 0).toString().length - 2;
  return chartFormatters.currency(v, digits === 1 ? 1 : 0);
};

const change = (first?: number, last?: number) => {
  if (first === undefined || last === undefined) return { text: "-" };
  const pct = ((last - first) / first) * 100;
  return { text: `${pct >= 0 ? "+" : ""}${Math.round(pct)}%`, pct };
};

interface TaxVsInflationTableProps {
  financialData: CityFinancialData[];
  expenditures: ExpenseChartData;
}

export function TaxVsInflationTable({
  financialData,
  expenditures,
}: TaxVsInflationTableProps) {
  const years = expenditures.data.map((r) => r.fiscalYear);
  const firstYear = Math.min(...years);
  const lastYear = Math.max(...years);

  const firstExpenditures = expenditures.data.find(
    (r) => r.fiscalYear === firstYear,
  )!;
  const lastExpenditures = expenditures.data.find(
    (r) => r.fiscalYear === lastYear,
  )!;
  const firstFinancials = financialData.find(
    (f) => f.fiscalYear === firstYear,
  )!;
  const lastFinancials = financialData.find((f) => f.fiscalYear === lastYear)!;

  // Category casing varies by city: "Public Safety"/"Public safety", "General government and administration"
  const publicSafety = expenditures.categories.find(
    (c) => c.toLowerCase() === "public safety",
  )!;
  const generalGovernment = expenditures.categories.find((c) =>
    c.toLowerCase().startsWith("general government"),
  )!;

  const sections = [
    {
      title: "Revenues",
      highlight: "text-green-600",
      rows: [
        {
          label: "Property tax",
          first: currency(firstFinancials.propertyTaxRevenue),
          last: currency(lastFinancials.propertyTaxRevenue),
          change: change(
            firstFinancials.propertyTaxRevenue,
            lastFinancials.propertyTaxRevenue,
          ),
        },
        {
          label: "Sales tax",
          first: currency(firstFinancials.salesTaxRevenue),
          last: currency(lastFinancials.salesTaxRevenue),
          change: change(
            firstFinancials.salesTaxRevenue,
            lastFinancials.salesTaxRevenue,
          ),
        },
        {
          label: "Hotel occupancy tax",
          first: currency(firstFinancials.hotelTaxRevenue),
          last: currency(lastFinancials.hotelTaxRevenue),
          change: change(
            firstFinancials.hotelTaxRevenue,
            lastFinancials.hotelTaxRevenue,
          ),
        },
      ],
    },
    {
      title: "Expenditures",
      highlight: "text-red-600",
      rows: [
        {
          label: publicSafety,
          first: currency(firstExpenditures[publicSafety]),
          last: currency(lastExpenditures[publicSafety]),
          change: change(
            firstExpenditures[publicSafety],
            lastExpenditures[publicSafety],
          ),
        },
        {
          label: generalGovernment,
          first: currency(firstExpenditures[generalGovernment]),
          last: currency(lastExpenditures[generalGovernment]),
          change: change(
            firstExpenditures[generalGovernment],
            lastExpenditures[generalGovernment],
          ),
        },
      ],
    },
  ];

  const highestChange = Math.max(
    ...sections.flatMap((s) => s.rows.map((r) => r.change.pct ?? -Infinity)),
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">
          Core Revenue and Expenditure Growth
        </CardTitle>
        <CardDescription>
          Change from FY{firstYear} to FY{lastYear}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead className="text-right">FY{firstYear}</TableHead>
              <TableHead className="text-right">FY{lastYear}</TableHead>
              <TableHead className="text-right">% Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sections.map((section) => (
              <Fragment key={section.title}>
                <TableRow>
                  <TableCell colSpan={4} className="bg-muted/50 font-medium">
                    {section.title}
                  </TableCell>
                </TableRow>
                {section.rows.map((row) => (
                  <TableRow key={row.label}>
                    <TableCell className="pl-6">{row.label}</TableCell>
                    <TableCell className="text-right">{row.first}</TableCell>
                    <TableCell className="text-right">{row.last}</TableCell>
                    <TableCell
                      className={cn(
                        "text-right",
                        row.change.pct === highestChange &&
                          `font-bold ${section.highlight}`,
                      )}
                    >
                      {row.change.text}
                    </TableCell>
                  </TableRow>
                ))}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
