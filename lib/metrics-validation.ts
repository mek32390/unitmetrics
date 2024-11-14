"use client";

import { MetricConfig, DATA_TYPES } from './metrics-config';

interface ValidationError {
  metricId: string;
  message: string;
}

export function validateMetricValue(
  value: number,
  config: MetricConfig
): ValidationError | null {
  // Check if required
  if (config.validation.required && (value === null || value === undefined)) {
    return {
      metricId: config.id,
      message: `${config.label} is required`
    };
  }

  // Check minimum value
  if (typeof config.validation.min === 'number' && value < config.validation.min) {
    return {
      metricId: config.id,
      message: `${config.label} must be at least ${config.validation.min}`
    };
  }

  // Check maximum value
  if (typeof config.validation.max === 'number' && value > config.validation.max) {
    return {
      metricId: config.id,
      message: `${config.label} must be no more than ${config.validation.max}`
    };
  }

  // Check integer requirement
  if (config.validation.integer && !Number.isInteger(value)) {
    return {
      metricId: config.id,
      message: `${config.label} must be a whole number`
    };
  }

  return null;
}

export function validateMetricDependencies(
  metrics: Record<string, number>,
  config: MetricConfig
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!config.dependencies) {
    return errors;
  }

  for (const dependencyId of config.dependencies) {
    if (!(dependencyId in metrics)) {
      errors.push({
        metricId: config.id,
        message: `${config.label} requires ${dependencyId} to be present`
      });
    }
  }

  return errors;
}

export function formatMetricValue(value: number, dataType: string): string {
  switch (dataType) {
    case DATA_TYPES.CURRENCY:
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);

    case DATA_TYPES.PERCENTAGE:
      return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      }).format(value / 100);

    case DATA_TYPES.RATIO:
      return `${value.toFixed(2)}x`;

    case DATA_TYPES.INTEGER:
      return Math.round(value).toLocaleString();

    case DATA_TYPES.DECIMAL:
      return value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

    default:
      return value.toString();
  }
}