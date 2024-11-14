// Company name from cell A1 is used as the metrics lookup column
export const METRICS_LOOKUP_COLUMN = "Look Up Value" as const;

// Type for row data with metrics lookup column
export interface MetricsRow extends Record<string, string | number> {
  [METRICS_LOOKUP_COLUMN]: string;
}