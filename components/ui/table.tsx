"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

export function TableHeader({
  className,
  ...props
}: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  );
}

export function TableBody({
  className,
  ...props
}: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

export function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className,
      )}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
}

export type ColumnDef<T> = {
  key: string;
  header: string;
  getValue: (row: T) => number | string;
  render?: (row: T) => React.ReactNode;
  align?: "left" | "center" | "right";
};

export type SortDirection = "asc" | "desc";

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  defaultSortKey?: string;
}

export function DataTable<T>({
  data,
  columns,
  defaultSortKey,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(defaultSortKey ?? null);
  const [direction, setDirection] = useState<SortDirection>("asc");

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setDirection("asc");
    }
  };

  const activeColumn = columns.find((col) => col.key === sortKey);

  const sortedData = useMemo(() => {
    if (!activeColumn) return data;

    return [...data].sort((a, b) => {
      const aVal = activeColumn.getValue(a);
      const bVal = activeColumn.getValue(b);

      if (typeof aVal === "string") {
        return direction === "asc"
          ? aVal.localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal);
      }

      return direction === "asc"
        ? Number(aVal) - Number(bVal)
        : Number(bVal) - Number(aVal);
    });
  }, [data, activeColumn, direction]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead
              key={col.key}
              className={"cursor-pointer select-none text-left"}
              onClick={() => toggleSort(col.key)}
            >
              <span className="inline-flex items-center">
                {col.header}
                {sortKey != col.key && (
                  <div className="ml-1 text-muted-foreground w-[14px]" />
                )}
                {sortKey === col.key && (
                  <span className="ml-1 text-muted-foreground">
                    {direction === "asc" ? "▲" : "▼"}
                  </span>
                )}
              </span>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {sortedData.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {columns.map((col) => (
              <TableCell key={col.key} className={"text-left"}>
                {col.render ? col.render(row) : col.getValue(row)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
