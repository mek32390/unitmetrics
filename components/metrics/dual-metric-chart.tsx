"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PeriodToggle } from "@/components/metrics/period-toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { getMetricFormatter } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { getMetricDescription } from "@/lib/metrics-descriptions";
import { filterDataByTimeRange, aggregateQuarterlyDualData } from "@/lib/chart-utils";
import { chartStyles, dualMetricStyles } from "@/lib/chart-styles";

interface DualMetricChartProps {
  standardMetric: {
    label: string;
    data: Array<{ date: string; value: number }>;
  };
  cumulativeMetric: {
    label: string;
    data: Array<{ date: string; value: number }>;
  };
  timeRange: string;
}

export function DualMetricChart({ standardMetric, cumulativeMetric, timeRange }: DualMetricChartProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [periodType, setPeriodType] = useState<"monthly" | "quarterly">("monthly");
  const [displayMode, setDisplayMode] = useState<"standard" | "cumulative" | "both">("standard");
  const formatter = getMetricFormatter(standardMetric.label);
  const description = getMetricDescription(standardMetric.label);

  useEffect(() => {
    setIsUpdating(true);
    const timer = setTimeout(() => setIsUpdating(false), 600);
    return () => clearTimeout(timer);
  }, [timeRange, periodType, displayMode]);

  const processedData = standardMetric.data.map((item, index) => ({
    date: item.date,
    [standardMetric.label]: item.value,
    [cumulativeMetric.label]: cumulativeMetric.data[index]?.value || 0
  }));

  const quarterlyData = periodType === "quarterly"
    ? aggregateQuarterlyDualData(processedData)
    : processedData;

  const filteredData = filterDataByTimeRange(quarterlyData, timeRange);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div style={chartStyles.tooltip.container}>
        <p style={chartStyles.tooltip.label}>{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={chartStyles.tooltip.item}>
            <span style={{ color: entry.color }}>{entry.name}:</span>
            <span style={chartStyles.tooltip.value}>{formatter(entry.value)}</span>
          </p>
        ))}
      </div>
    );
  };

  return (
    <Card className={cn("w-full", "transition-opacity duration-300", {
      "opacity-50": isUpdating
    })}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-medium">
            {standardMetric.label}
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
        <div className={dualMetricStyles.toggleGroup.wrapper}>
          <ToggleGroup 
            type="single" 
            value={displayMode} 
            onValueChange={(value) => value && setDisplayMode(value as typeof displayMode)} 
            className={dualMetricStyles.toggleGroup.base}
          >
            <ToggleGroupItem value="standard" className={dualMetricStyles.toggleGroup.item}>Standard</ToggleGroupItem>
            <ToggleGroupItem value="both" className={dualMetricStyles.toggleGroup.item}>Both</ToggleGroupItem>
            <ToggleGroupItem value="cumulative" className={dualMetricStyles.toggleGroup.item}>Cumulative</ToggleGroupItem>
          </ToggleGroup>
        </div>
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
                yAxisId="left"
                tickFormatter={formatter}
                width={chartStyles.chart.axis.width}
                tick={{ fontSize: chartStyles.chart.axis.fontSize }}
              />
              {displayMode === "both" && (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={formatter}
                  width={chartStyles.chart.axis.width}
                  tick={{ fontSize: chartStyles.chart.axis.fontSize }}
                />
              )}
              <Tooltip 
                content={<CustomTooltip />}
                wrapperStyle={{ outline: 'none' }}
              />
              {(displayMode === "standard" || displayMode === "both") && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey={standardMetric.label}
                  name={standardMetric.label}
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                />
              )}
              {(displayMode === "cumulative" || displayMode === "both") && (
                <Line
                  yAxisId={displayMode === "both" ? "right" : "left"}
                  type="monotone"
                  dataKey={cumulativeMetric.label}
                  name={cumulativeMetric.label}
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                />
              )}
              {displayMode === "both" && (
                <Legend 
                  wrapperStyle={{ 
                    paddingTop: "20px",
                    marginBottom: "-10px"
                  }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}