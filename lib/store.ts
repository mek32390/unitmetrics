import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { processMetricsData } from './analyze-metrics';
import { metricCategories } from './metrics-categories';
import { findMetricMatch, validateMetricValue } from './metric-matcher';
import { METRICS_LOOKUP_COLUMN, type MetricsRow } from './constants';

interface MissingMetricInfo {
  label: string;
  reason: string;
}

interface DashboardState {
  data: MetricsRow[] | null;
  timeRange: string;
  metrics: ReturnType<typeof processMetricsData> | null;
  missingMetrics: MissingMetricInfo[];
  companyName: string;
  setData: (data: MetricsRow[], companyName: string) => void;
  setTimeRange: (range: string) => void;
  getMissingMetrics: () => MissingMetricInfo[];
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      data: null,
      timeRange: 'ytd',
      metrics: null,
      missingMetrics: [],
      companyName: '',
      setData: (data, companyName) => {
        try {
          const metrics = processMetricsData(data);
          const missingMetrics: MissingMetricInfo[] = Object.values(metricCategories)
            .flatMap(category => 
              category.metrics
                .map(metric => {
                  const matchResult = findMetricMatch(metric.lookupValue, data);
                  
                  if (!matchResult.found || !matchResult.matchedValue) {
                    return {
                      label: metric.label,
                      reason: matchResult.reason || `Metric "${metric.lookupValue}" not found`
                    };
                  }

                  const row = data.find(r => r[METRICS_LOOKUP_COLUMN] === matchResult.matchedValue);
                  if (row) {
                    const valueValidation = validateMetricValue(row, matchResult.matchedValue);
                    if (!valueValidation.found) {
                      return {
                        label: metric.label,
                        reason: valueValidation.reason || 'Invalid or missing values'
                      };
                    }
                  }

                  return null;
                })
                .filter((info): info is MissingMetricInfo => info !== null)
            );

          set({ data, metrics, missingMetrics, companyName });
        } catch (error) {
          console.error('Error processing metrics:', error);
          set({ 
            data: null, 
            metrics: null, 
            missingMetrics: [],
            companyName: ''
          });
        }
      },
      setTimeRange: (timeRange) => set({ timeRange }),
      getMissingMetrics: () => get().missingMetrics,
    }),
    {
      name: 'dashboard-storage',
      partialize: (state) => ({
        data: state.data,
        timeRange: state.timeRange,
        metrics: state.metrics,
        missingMetrics: state.missingMetrics,
        companyName: state.companyName,
      }),
    }
  )
);