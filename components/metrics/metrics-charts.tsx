"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MetricsChart } from "@/components/metrics-chart";
import { DualMetricChart } from "@/components/metrics/dual-metric-chart";
import { metricCategories } from "@/lib/metrics-categories";
import { findMetricPair, isCumulativePair, type ChartDataPoint } from "@/lib/chart-utils";

interface MetricsChartsProps {
  trends: Record<string, Array<ChartDataPoint>>;
  timeRange: string;
  categories: typeof metricCategories;
}

export function MetricsCharts({ trends, timeRange, categories }: MetricsChartsProps) {
  const shownCumulativeMetrics = new Set<string>();

  return (
    <Accordion type="multiple" defaultValue={Object.keys(metricCategories)} className="space-y-6">
      {Object.entries(categories).map(([categoryKey, category]) => {
        const metricsToShow = category.metrics.filter(metric => {
          const hasData = trends[metric.label] && trends[metric.label].length > 0;
          if (!hasData) return false;

          const pairResult = findMetricPair(metric, trends);

          if (isCumulativePair(metric.label)) {
            if (shownCumulativeMetrics.has(metric.label)) {
              return false;
            }
          }

          if (pairResult.hasPair && pairResult.cumulativeMetric?.label) {
            shownCumulativeMetrics.add(pairResult.cumulativeMetric.label);
            return true;
          }

          return !isCumulativePair(metric.label);
        });

        if (metricsToShow.length === 0) return null;

        return (
          <AccordionItem key={categoryKey} value={categoryKey}>
            <AccordionTrigger className="text-xl font-semibold hover:no-underline">
              {category.label}
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-6 md:grid-cols-2 mt-4">
                {metricsToShow.map(metric => {
                  const pairResult = findMetricPair(metric, trends);

                  if (pairResult.hasPair && pairResult.standardMetric && pairResult.cumulativeMetric) {
                    return (
                      <DualMetricChart
                        key={metric.label}
                        standardMetric={pairResult.standardMetric}
                        cumulativeMetric={pairResult.cumulativeMetric}
                        timeRange={timeRange}
                      />
                    );
                  }

                  return (
                    <MetricsChart
                      key={metric.label}
                      title={metric.label}
                      data={trends[metric.label] || []}
                      metricType={metric.label}
                      timeRange={timeRange}
                    />
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}