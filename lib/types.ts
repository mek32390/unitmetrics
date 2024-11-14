export interface MetricData {
  id: string;
  label: string;
  value: number;
  previousValue?: number;
  change?: number;
  changePercentage?: number;
  trend?: Array<{
    date: string;
    value: number;
  }>;
}

export interface MetricGroup {
  id: string;
  label: string;
  metrics: MetricData[];
}

export interface ChartData {
  date: string;
  value: number;
}

export interface DualChartData {
  date: string;
  standard: number;
  cumulative: number;
}

export interface MetricInsight {
  type: "default" | "destructive";
  message: string;
  priority: number;
}