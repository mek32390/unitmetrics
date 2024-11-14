import { formatCurrency } from "@/lib/utils";
import { MetricsRow } from "@/lib/constants";

interface TimeSeriesData {
  date: string;
  value: number;
}

interface FinancialMetrics {
  cac: {
    current: number;
    trend: TimeSeriesData[];
    growthRate: number;
  };
  ltv: {
    current: number;
    trend: TimeSeriesData[];
    growthRate: number;
  };
  ltvCacRatio: {
    current: number;
    trend: TimeSeriesData[];
    benchmark: number;
  };
  customerMetrics: {
    activeCustomers: TimeSeriesData[];
    newCustomers: TimeSeriesData[];
    repeatCustomers: TimeSeriesData[];
    churnRate: TimeSeriesData[];
  };
  revenue: {
    total: number;
    trend: TimeSeriesData[];
    grossMargin: TimeSeriesData[];
  };
}

function calculateGrowthRate(values: number[]): number {
  if (values.length < 2) return 0;
  const oldValue = values[0];
  const newValue = values[values.length - 1];
  return oldValue === 0 ? 0 : ((newValue - oldValue) / Math.abs(oldValue)) * 100;
}

export function analyzeFinancialData(data: MetricsRow[]): FinancialMetrics {
  const timePeriods = Object.keys(data[0] || {}).filter(key => 
    typeof key === 'string' && key.match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\d{2}$/)
  );

  const newCustomersRow = data.find(row => row["Look Up Value"] === "New Customers") || {};
  const adSpendRow = data.find(row => row["Look Up Value"] === "Ad Spend") || {};
  const activeCustomersRow = data.find(row => row["Look Up Value"] === "Active Customers") || {};
  const revenueRow = data.find(row => row["Look Up Value"] === "NET REVENUE") || {};
  const grossMarginRow = data.find(row => row["Look Up Value"] === "Gross Margin %") || {};

  const transformToTimeSeries = (row: MetricsRow): TimeSeriesData[] => {
    return timePeriods.map(period => ({
      date: period,
      value: parseFloat(String(row[period] || "0"))
    })).filter(item => !isNaN(item.value));
  };

  const newCustomers = transformToTimeSeries(newCustomersRow as MetricsRow);
  const adSpend = transformToTimeSeries(adSpendRow as MetricsRow);
  const activeCustomers = transformToTimeSeries(activeCustomersRow as MetricsRow);
  const revenue = transformToTimeSeries(revenueRow as MetricsRow);
  const grossMargin = transformToTimeSeries(grossMarginRow as MetricsRow);

  const cacTrend = timePeriods.map(period => ({
    date: period,
    value: parseFloat(String((adSpendRow as MetricsRow)[period] || "0")) / 
           (parseFloat(String((newCustomersRow as MetricsRow)[period] || "1")))
  })).filter(item => !isNaN(item.value) && isFinite(item.value));

  const ltvTrend = timePeriods.map(period => ({
    date: period,
    value: (parseFloat(String((revenueRow as MetricsRow)[period] || "0")) * 
            parseFloat(String((grossMarginRow as MetricsRow)[period] || "0")) / 100) /
           parseFloat(String((activeCustomersRow as MetricsRow)[period] || "1"))
  })).filter(item => !isNaN(item.value) && isFinite(item.value));

  const ltvCacTrend = timePeriods.map(period => ({
    date: period,
    value: (parseFloat(String((revenueRow as MetricsRow)[period] || "0")) * 
            parseFloat(String((grossMarginRow as MetricsRow)[period] || "0")) / 100) /
           (parseFloat(String((adSpendRow as MetricsRow)[period] || "1")))
  })).filter(item => !isNaN(item.value) && isFinite(item.value));

  return {
    cac: {
      current: cacTrend[cacTrend.length - 1]?.value || 0,
      trend: cacTrend,
      growthRate: calculateGrowthRate(cacTrend.map(d => d.value)),
    },
    ltv: {
      current: ltvTrend[ltvTrend.length - 1]?.value || 0,
      trend: ltvTrend,
      growthRate: calculateGrowthRate(ltvTrend.map(d => d.value)),
    },
    ltvCacRatio: {
      current: ltvCacTrend[ltvCacTrend.length - 1]?.value || 0,
      trend: ltvCacTrend,
      benchmark: 3,
    },
    customerMetrics: {
      activeCustomers,
      newCustomers,
      repeatCustomers: transformToTimeSeries(data.find(row => row["Look Up Value"] === "Repeat Customers") || {} as MetricsRow),
      churnRate: transformToTimeSeries(data.find(row => row["Look Up Value"] === "Churn %") || {} as MetricsRow),
    },
    revenue: {
      total: revenue.reduce((sum, item) => sum + item.value, 0),
      trend: revenue,
      grossMargin,
    },
  };
}