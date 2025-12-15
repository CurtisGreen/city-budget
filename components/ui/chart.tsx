"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

function ChartContainer({
  id,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <div
      data-slot="chart"
      data-chart={chartId}
      className={cn(
        "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
        className
      )}
      {...props}
    >
      <RechartsPrimitive.ResponsiveContainer>
        {children}
      </RechartsPrimitive.ResponsiveContainer>
    </div>
  );
}

const ChartTooltip = RechartsPrimitive.Tooltip;

function ChartTooltipContent({
  payload,
  className,
  formatter,
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<"div">) {
  if (!payload?.length) return null;

  return (
    <div
      className={cn(
        "border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl",
        className
      )}
    >
      {payload.map((item, index) => {
        const indicatorColor = item.payload.fill || item.color;

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
            {item.value && item.name && formatter && (
              <span className="text-foreground font-mono font-medium tabular-nums">
                {formatter(item.value, item.name, item, index, item.payload)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

const ChartLegend = RechartsPrimitive.Legend;

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend };
