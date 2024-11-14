"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";

interface InsightMessage {
  type: "default" | "destructive";
  message: string;
}

interface MetricsInsightsProps {
  insights: InsightMessage[];
}

export function MetricsInsights({ insights }: MetricsInsightsProps) {
  if (!insights?.length) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Key Insights</h2>
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <Alert key={index} variant={insight.type}>
            <AlertDescription>{insight.message}</AlertDescription>
          </Alert>
        ))}
      </div>
    </div>
  );
}