import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export const ChartExplanationCard = ({
  understandingTheMetric,
  whatToLookFor,
}: {
  understandingTheMetric: string;
  whatToLookFor: string;
}) => (
  <Card className="bg-muted/30">
    <CardHeader>
      <CardTitle className="text-base">What This Means</CardTitle>
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
