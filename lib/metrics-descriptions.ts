"use client";

// Define all possible metric types as a union type
export type MetricType = keyof typeof metricDescriptions;

export const metricDescriptions = {
  // Customer Acquisition
  "Ad Spend": "Total spending on advertising campaigns",
  "Cumulative Ad Spend": "Total advertising expenditure over time",
  "Marketing Spend": "Total marketing-related expenses",
  "Cumulative Marketing Spend": "Accumulated marketing expenses over time",
  "CAC": "Average cost to acquire each new customer",
  "Cumulative CAC": "Historical average cost of customer acquisition",
  "Facebook Ad Spend": "Advertising spend specifically on Facebook platform",
  "Facebook Revenue": "Revenue generated from Facebook advertising",
  "Facebook ROAS": "Return on Ad Spend for Facebook campaigns",

  // Customer Metrics
  "Orders from First Time Customers": "Number of orders from new customers",
  "Cumulative First Time Customers": "Total number of first-time customers over time",
  "Orders": "Total number of orders placed",
  "Cumulative Orders": "Total number of orders over time",
  "Purchases Per Customer": "Average number of orders per customer",
  "Cumulative Purchases Per Customer": "Average orders per customer over time",

  // Financial Metrics
  "Net Revenue": "Total revenue after deductions",
  "Cumulative Net Revenue": "Total accumulated revenue over time",
  "Net AOV": "Average order value after returns and discounts",
  "Cumulative Net AOV": "Average order value over time",
  "Gross Profit": "Revenue minus cost of goods sold",
  "Cumulative Gross Profit": "Total gross profit over time",
  "Gross Margin": "Gross profit as a percentage of revenue",
  "Cumulative Gross Margin": "Average gross margin over time",

  // Profitability Metrics
  "LTGP": "Lifetime Gross Profit per customer",
  "Cumulative LTGP": "Average lifetime gross profit over time",
  "LTGP/CAC": "Ratio of lifetime gross profit to customer acquisition cost",
  "Cumulative LTGP/CAC": "Average LTGP/CAC ratio over time",
  "Contribution": "Revenue minus variable costs",
  "Cumulative Contribution": "Total contribution over time",
  "NET INCOME": "Total profit after all expenses",
  "Contribution Margin %": "Contribution profit as a percentage of revenue",
  "Cumulative Contribution Margin": "Average contribution margin over time",
  "Net Margin": "Net income as a percentage of revenue",
  "Operating Margin": "Operating income as a percentage of revenue",
  "Total Operating Expenses": "Sum of all operating costs"
} as const;

export function getMetricDescription(metricType: string): string {
  return metricDescriptions[metricType as keyof typeof metricDescriptions] || "";
}