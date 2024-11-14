"use client";

export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface DualChartDataPoint {
  date: string;
  [key: string]: string | number;
}

export interface MetricPairResult {
  hasPair: boolean;
  standardMetric?: {
    label: string;
    data: ChartDataPoint[];
  };
  cumulativeMetric?: {
    label: string;
    data: ChartDataPoint[];
  };
}

export const metricPairs = {
  "Ad Spend": "Cumulative Ad Spend",
  "Marketing Spend": "Cumulative Marketing Spend",
  "Orders from First Time Customers": "Cumulative First Time Customers",
  "Orders": "Cumulative Orders",
  "Net Revenue": "Cumulative Net Revenue",
  "Gross Profit": "Cumulative Gross Profit",
  "Purchases Per Customer": "Cumulative Purchases Per Customer",
  "Net AOV": "Cumulative Net AOV",
  "Gross Margin": "Cumulative Gross Margin",
  "CAC": "Cumulative CAC",
  "LTGP": "Cumulative LTGP",
  "LTGP/CAC": "Cumulative LTGP/CAC",
  "Contribution": "Cumulative Contribution",
  "Contribution Margin %": "Cumulative Contribution Margin"
} as const;

export const tooltipStyles = {
  contentStyle: { 
    backgroundColor: 'var(--background)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '8px 12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    opacity: 0.95,
    zIndex: 1000
  },
  itemStyle: { 
    color: 'var(--foreground)',
    fontSize: '12px',
    padding: '2px 0'
  },
  labelStyle: { 
    color: 'var(--foreground)',
    fontWeight: 'bold',
    marginBottom: '4px'
  }
};

export function parseDate(dateStr: string): Date {
  if (dateStr.startsWith('Q')) {
    const [quarter, year] = dateStr.substring(1).split('-');
    const month = (parseInt(quarter) - 1) * 3;
    return new Date(2000 + parseInt(year), month);
  }
  const [month, year] = dateStr.split('-');
  const monthIndex = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    .indexOf(month);
  return new Date(2000 + parseInt(year), monthIndex);
}

export function filterDataByTimeRange<T extends { date: string }>(data: T[], timeRange: string): T[] {
  const today = new Date();
  const sortedData = [...data].sort((a, b) => 
    parseDate(a.date).getTime() - parseDate(b.date).getTime()
  );

  switch (timeRange) {
    case 'last-month': {
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);
      return sortedData.filter(item => {
        const itemDate = parseDate(item.date);
        return itemDate.getFullYear() === lastMonth.getFullYear() &&
               itemDate.getMonth() === lastMonth.getMonth();
      });
    }
    case '3m': {
      const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3);
      return sortedData.filter(item => 
        parseDate(item.date) >= threeMonthsAgo && 
        parseDate(item.date) < new Date(today.getFullYear(), today.getMonth())
      );
    }
    case '6m': {
      const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6);
      return sortedData.filter(item => 
        parseDate(item.date) >= sixMonthsAgo && 
        parseDate(item.date) < new Date(today.getFullYear(), today.getMonth())
      );
    }
    case '1y': {
      const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth());
      return sortedData.filter(item => 
        parseDate(item.date) >= oneYearAgo && 
        parseDate(item.date) < new Date(today.getFullYear(), today.getMonth())
      );
    }
    case 'ytd': {
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      return sortedData.filter(item => parseDate(item.date) >= startOfYear);
    }
    case 'all':
    default:
      return sortedData;
  }
}

export function aggregateQuarterlyData(data: ChartDataPoint[]): ChartDataPoint[] {
  const quarterlyData: { [key: string]: ChartDataPoint } = {};

  data.forEach(item => {
    const date = parseDate(item.date);
    const quarter = Math.floor(date.getMonth() / 3) + 1;
    const year = date.getFullYear().toString().slice(-2);
    const quarterKey = `Q${quarter}-${year}`;

    if (!quarterlyData[quarterKey]) {
      quarterlyData[quarterKey] = {
        date: quarterKey,
        value: 0
      };
    }
    quarterlyData[quarterKey].value += item.value;
  });

  return Object.values(quarterlyData).sort((a, b) => 
    parseDate(a.date).getTime() - parseDate(b.date).getTime()
  );
}

export function aggregateQuarterlyDualData(data: DualChartDataPoint[]): DualChartDataPoint[] {
  const quarterlyData: { [key: string]: DualChartDataPoint } = {};

  data.forEach(item => {
    const date = parseDate(item.date);
    const quarter = Math.floor(date.getMonth() / 3) + 1;
    const year = date.getFullYear().toString().slice(-2);
    const quarterKey = `Q${quarter}-${year}`;

    if (!quarterlyData[quarterKey]) {
      quarterlyData[quarterKey] = {
        date: quarterKey,
        ...Object.fromEntries(
          Object.keys(item)
            .filter(key => key !== 'date')
            .map(key => [key, 0])
        )
      };
    }

    Object.entries(item).forEach(([key, value]) => {
      if (key !== 'date' && typeof value === 'number') {
        const current = quarterlyData[quarterKey][key];
        if (typeof current === 'number') {
          quarterlyData[quarterKey][key] = current + value;
        }
      }
    });
  });

  return Object.values(quarterlyData).sort((a, b) => 
    parseDate(a.date).getTime() - parseDate(b.date).getTime()
  );
}

export function isCumulativePair(metricLabel: string): boolean {
  return Object.values(metricPairs).includes(metricLabel as any);
}

export function findMetricPair(metric: { label: string }, trends: Record<string, ChartDataPoint[]>): MetricPairResult {
  const cumulativeLabel = metricPairs[metric.label as keyof typeof metricPairs];
  
  if (cumulativeLabel && trends[cumulativeLabel]) {
    return {
      hasPair: true,
      standardMetric: {
        label: metric.label,
        data: trends[metric.label]
      },
      cumulativeMetric: {
        label: cumulativeLabel,
        data: trends[cumulativeLabel]
      }
    };
  }
  return { hasPair: false };
}