import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
}

export function formatRatio(value: number): string {
  return `${value.toFixed(2)}x`;
}

export function parseMetricValue(value: string): number {
  const cleanValue = value.replace(/[$,\s%x]/g, '');
  const parsedValue = parseFloat(cleanValue);
  return isFinite(parsedValue) ? parsedValue : 0;
}

export function calculateGrowthRate(values: number[]): number {
  if (values.length < 2) return 0;
  
  const oldValue = values[0];
  const newValue = values[values.length - 1];
  
  if (oldValue === 0) return 0;
  
  return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
}

export function getMetricFormatter(metricType: string | undefined): (value: number) => string {
  if (!metricType) return formatNumber;

  const metricTypeLower = metricType.toLowerCase();

  // Check for ratio/multiplier metrics first
  if (metricTypeLower.includes('ltv:cac') || 
      metricTypeLower.includes('ltgp/cac') || 
      metricTypeLower.includes('purchases per customer') ||
      metricTypeLower.includes('roas') ||
      metricTypeLower.includes('ratio')) {
    return formatRatio;
  }

  if (metricTypeLower.includes('revenue') || 
      metricTypeLower.includes('spend') || 
      metricTypeLower.includes('cac') || 
      metricTypeLower.includes('ltv') || 
      metricTypeLower.includes('aov') || 
      metricTypeLower.includes('arpu')) {
    return formatCurrency;
  }

  if (metricTypeLower.includes('margin') || 
      metricTypeLower.includes('rate') || 
      metricTypeLower.includes('%')) {
    return formatPercentage;
  }

  return formatNumber;
}