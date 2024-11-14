"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PeriodToggle } from "@/components/metrics/period-toggle";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { getMetricFormatter } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { getMetricDescription } from "@/lib/metrics-descriptions";
import { filterDataByTimeRange, aggregateQuarterlyData } from "@/lib/chart-utils";
import { chartStyles } from "@/lib/chart-styles";

interface MetricsChartProps {
  title: string;
  data: Array<{ date: string; value: number }>;
  metricType: string;
  timeRange: string;
  className?: string;
}

export function MetricsChart({ title, data, metricType, timeRange, className }: MetricsChartProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [periodType, setPeriodType] = useState<"monthly" | "quarterly">("monthly");
  const formatter = getMetricFormatter(metricType);
  const description = getMetricDescription(metricType);

  useEffect(() => {
    setIsUpdating(true);
    const timer = setTimeout(() => setIsUpdating(false), 600);
    return () => clearTimeout(timer);
  }, [timeRange, periodType]);

  const quarterlyData = periodType === "quarterly"
    ? aggregateQuarterlyData(data)
    : data;

  const filteredData = filterDataByTimeRange(quarterlyData, timeRange);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div style={chartStyles.tooltip.container}>
        <p style={chartStyles.tooltip.label}>{label}</p>
        <p style={chartStyles.tooltip.item}>
          <span style={{ color: payload[0].color }}>{title}:</span>
          <span style={chartStyles.tooltip.value}>{formatter(payload[0].value)}</span>
        </p>
      </div>
    );
  };

  return (
    <Card className={cn("w-full", className, "transition-opacity duration-300", {
      "opacity-50": isUpdating
    })}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-medium">
            {title}
          </CardTitle>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
        <PeriodToggle
          value={periodType}
          onValueChange={setPeriodType}
        />
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: '300px' }}>
          <ResponsiveContainer>
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fontSize: chartStyles.chart.axis.fontSize }}
              />
              <YAxis
                tickFormatter={formatter}
                width={chartStyles.chart.axis.width}
                tick={{ fontSize: chartStyles.chart.axis.fontSize }}
              />
              <Tooltip 
                content={<CustomTooltip />}
                wrapperStyle={{ outline: 'none' }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
                isAnimationActive={true}
                animationDuration={300}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}