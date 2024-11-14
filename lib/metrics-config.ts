export const DATA_TYPES = {
  CURRENCY: 'currency',
  PERCENTAGE: 'percentage',
  RATIO: 'ratio',
  INTEGER: 'integer',
  DECIMAL: 'decimal'
} as const;

export interface MetricConfig {
  id: string;
  label: string;
  category: string;
  dataType: keyof typeof DATA_TYPES;
  validation: {
    required?: boolean;
    min?: number;
    max?: number;
    integer?: boolean;
  };
  dependencies?: string[];
  description?: string;
}