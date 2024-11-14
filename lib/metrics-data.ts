// Map metric categories to their respective metrics
export const metricGroups = {
  "Customer Acquisition": [
    "Ad Spend",
    "Marketing Spend",
    "CAC",
    "Facebook Ad Spend",
    "Facebook Revenue",
    "Facebook ROAS"
  ],
  "Customer Metrics": [
    "Orders from First Time Customers",
    "Orders",
    "Purchases Per Customer"
  ],
  "Financial Metrics": [
    "Net Revenue",
    "Net AOV",
    "Gross Profit",
    "Gross Margin"
  ],
  "Profitability Metrics": [
    "LTGP",
    "LTGP/CAC",
    "Contribution",
    "Net Income",
    "Contribution Margin %",
    "Net Margin",
    "Operating Margin",
    "Total Operating Expenses"
  ]
} as const;