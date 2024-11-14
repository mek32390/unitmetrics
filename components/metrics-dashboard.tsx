"use client";

import { MetricsHeader } from "./metrics/metrics-header";
import { MetricsCharts } from "./metrics/metrics-charts";
import { useDashboardStore } from "@/lib/store";
import { metricCategories } from "@/lib/metrics-categories";
import { useEffect } from "react";
import { MetricsRow } from "@/lib/constants";

interface MetricsDashboardProps {
  data: MetricsRow[];
}

export function MetricsDashboard({ data }: MetricsDashboardProps) {
  const { 
    timeRange, 
    setTimeRange,
    setData,
    metrics,
    missingMetrics,
    companyName
  } = useDashboardStore();

  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      setData(data, companyName);
    }
  }, [data, setData, companyName]);

  if (!metrics || !data || data.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No data available to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <MetricsHeader 
        companyName={companyName}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        missingMetrics={missingMetrics}
      />

      <MetricsCharts 
        trends={metrics.trends}
        timeRange={timeRange}
        categories={metricCategories}
      />
    </div>
  );
}