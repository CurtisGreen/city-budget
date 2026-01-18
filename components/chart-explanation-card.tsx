import { InfoIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

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
        {formula && (
          <div title={formula} className="mt-1 ml-1">
            <InfoIcon className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
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
