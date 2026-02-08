import type { CityData } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Link from "next/link";
import { ColumnDef, DataTable } from "./ui/table";

const columns: ColumnDef<CityData>[] = [
  {
    key: "city",
    header: "City",
    getValue: (c) => c.info.name,
    render: (c) => c.info.name,
  },
  {
    key: "population",
    header: "Population",
    getValue: (c) => c.info.population,
    render: (c) => c.info.population.toLocaleString(),
    align: "right",
  },
  {
    key: "density",
    header: "Population Density",
    getValue: (c) => c.info.population / c.info.area,
    align: "right",
  },
  {
    key: "revenue",
    header: "Total Revenue",
    getValue: (c) => c.financialData.at(-1)!.totalRevenue,
    render: (c) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
      }).format(c.financialData.at(-1)!.totalRevenue),
    align: "right",
  },
];

export function ComparisonTable2({ cities }: { cities: CityData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Comparison</CardTitle>
        <CardDescription>Latest year financial metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <DataTable
            data={cities}
            columns={columns}
            defaultSortKey="population"
          />
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
