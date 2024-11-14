"use client";

import { METRICS_LOOKUP_COLUMN, type MetricsRow } from './constants';
import { findMetricMatch, validateMetricValue } from './metric-matcher';
import { metricCategories } from './metrics-categories';

interface AnalyzedMetrics {
  trends: Record<string, Array<{ date: string; value: number }>>;
}

export function processMetricsData(data: MetricsRow[]): AnalyzedMetrics {
  try {
    const timePeriods = Object.keys(data[0] || {})
      .filter(key => /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\d{2}$/i.test(key))
      .sort();

    if (!timePeriods.length) {
      throw new Error('No valid time periods found in data');
    }

    // Process all metrics from categories
    const trends: Record<string, Array<{ date: string; value: number }>> = {};
    
    // Process each metric from the categories
    Object.values(metricCategories).forEach(category => {
      category.metrics.forEach(metric => {
        const matchResult = findMetricMatch(metric.lookupValue, data);
        if (matchResult.found && matchResult.matchedValue) {
          const row = data.find(r => r[METRICS_LOOKUP_COLUMN] === matchResult.matchedValue);
          if (row) {
            const validation = validateMetricValue(row, matchResult.matchedValue);
            if (validation.found) {
              // Create time series for this metric
              trends[metric.label] = timePeriods.map(period => ({
                date: period,
                value: parseFloat(row[period]?.toString().replace(/[^0-9.-]/g, '') || '0') || 0
              }));
            }
          }
        }
      });
    });

    return { trends };
  } catch (error) {
    console.error('Error processing metrics:', error);
    throw error;
  }
}