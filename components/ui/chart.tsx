"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type TooltipItem = {
  name?: string;
  value: number;
  color?: string;
  dataKey?: string | number;
  payload?: unknown;
};

type ChartTooltipContentProps = React.ComponentProps<"div"> & {
  payload?: TooltipItem[];
  formatter?: (
    value: number,
    name: string,
    item: TooltipItem,
    index: number,
    payload: unknown,
  ) => React.ReactNode;
};

export function ChartTooltipContent({
  payload,
  className,
  formatter,
}: ChartTooltipContentProps) {
  if (!payload?.length) return null;

  return (
    <div
      className={cn(
        "border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-sm border px-2.5 py-1.5 text-xs shadow-xl",
        className,
      )}
    >
      {payload
        .sort((a, b) => b?.value - a?.value)
        .map((item, index) => {
          // Handle striped pattern in bar chart for average
          const indicatorColor = item.color?.includes("url")
            ? "black"
            : item.color;

          return (
            <div
              className="grid grid-cols-[auto_1fr_auto] items-center gap-2"
              key={item.dataKey}
            >
              {/* Color indicator */}
              <div
                className={
                  "rounded-[2px] border-(--color-border) bg-(--color-bg) h-2.5 w-2.5"
                }
                style={
                  {
                    "--color-bg": indicatorColor,
                    "--color-border": indicatorColor,
                  } as React.CSSProperties
                }
              />
              {item.name}
              {item.name && formatter && (
                <span className="text-foreground font-mono font-medium tabular-nums">
                  {formatter(
                    item.value || 0,
                    item.name,
                    item,
                    index,
                    item.payload,
                  )}
                </span>
              )}
            </div>
          );
        })}
    </div>
  );
}
