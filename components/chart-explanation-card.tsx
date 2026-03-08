"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tooltip } from "./ui/tooltip";

export const ChartExplanationCard = ({
  understandingTheMetric,
  whatToLookFor,
  formula,
}: {
  understandingTheMetric: string;
  whatToLookFor: string;
  formula?: string;
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
    </CardContent>
  </Card>
);
