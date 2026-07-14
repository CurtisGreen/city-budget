"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tooltip } from "./ui/tooltip";

export const ChartExplanationCard = ({
  understandingTheMetric,
  whatToLookFor,
  formula,
  source,
}: {
  understandingTheMetric: string;
  whatToLookFor: string;
  formula?: string;
  source?: { label: string; url: string };
}) => (
  <Card className="bg-muted/30">
    <CardHeader>
      <CardTitle className="text-base flex">
        <div>What This Means</div>
        {formula && <Tooltip message={formula} />}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <h4 className="font-semibold text-sm mb-1">Understanding the Metric</h4>
        <p className="text-sm text-muted-foreground">
          {understandingTheMetric}
        </p>
      </div>
      <div>
        <h4 className="font-semibold text-sm mb-1">What to Look For</h4>
        <p className="text-sm text-muted-foreground">{whatToLookFor}</p>
      </div>
      {source && (
        <div>
          <h4 className="font-semibold text-sm mb-1">Source</h4>
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary underline underline-offset-2"
          >
            {source.label}
          </a>
        </div>
      )}
    </CardContent>
  </Card>
);
