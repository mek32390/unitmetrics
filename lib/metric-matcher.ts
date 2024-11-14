"use client";

import Fuse from 'fuse.js';
import { MetricsRow, METRICS_LOOKUP_COLUMN } from './constants';

interface MatchResult {
  found: boolean;
  matchedValue?: string;
  reason?: string;
}

const metricAliases: Record<string, string[]> = {
  "New Customers": ["new customers (payments)", "new users", "new accounts", "first time customers"],
  "Repeat Customers": ["returning customers", "repeat users", "returning users"],
  "Total Customers": ["total payments from all customers", "all customers", "customer total", "active customers", "orders", "total active customers"],
  "% Repeat Customers (Prior Month)": ["% repeat (prior month)", "repeat rate", "return rate", "retention rate"],
  "Customer Life": ["customer life (months)", "customer lifetime", "avg customer life", "customer duration"],
  "AOV": ["average order value", "avg order value", "average basket size", "aov net"],
  "Ad Spend": ["advertising spend", "marketing spend", "ad costs", "advertising costs"],
  "Cumulative Ad Spend": ["total ad spend", "total advertising spend", "cumulative marketing spend"],
  "Cumulative CAC": ["customer acquisition cost", "cac", "acquisition cost", "cost per customer"],
  "LTGP (Cumulative)": ["lifetime gross profit", "ltv", "customer lifetime value", "clv", "ltv gross profit"],
  "LTGP / CAC (Cumulative)": ["ltv/cac ratio", "ltv:cac", "ltv to cac", "lifetime value to acquisition cost", "ltv-cac ratio"],
  "Cumulative Orders": ["cumulative orders (000s)", "total orders", "all orders", "order count"],
  "Purchases per customer": ["orders per customer", "customer purchase frequency", "purchase rate"],
  "Cumulative Gross Margin": ["total gross margin", "gross profit", "total margin"],
  "Cumulative AOV": ["lifetime aov", "total average order value", "overall aov"],
  "% Repeat (Prior Month)": ["repeat rate", "monthly repeat rate", "repeat customer percentage", "% repeat customers (prior month)"],
  "Churn %": ["churn rate", "attrition rate", "customer churn", "monthly churn"],
  "Gross Margin %": ["gross margin", "gm%", "gross margin percent", "gross margin percentage"]
};

const fuseOptions = {
  includeScore: true,
  threshold: 0.4,
  keys: ['value']
};

function parseNumericValue(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null;
  
  if (typeof value === 'number') return value;
  
  const cleanValue = value.toString()
    .replace(/[$,\s%]+/g, '')
    .trim();
  
  const parsed = parseFloat(cleanValue);
  
  return isNaN(parsed) ? null : parsed;
}

export function findMetricMatch(lookupValue: string, data: MetricsRow[]): MatchResult {
  const availableMetrics = data.map(row => ({
    value: row[METRICS_LOOKUP_COLUMN]
  }));

  const exactMatch = availableMetrics.find(m => 
    m.value.toLowerCase() === lookupValue.toLowerCase()
  );
  if (exactMatch) {
    return { found: true, matchedValue: exactMatch.value };
  }

  const aliasMatch = Object.entries(metricAliases).find(([key, aliases]) => {
    return aliases.some(alias => 
      alias.toLowerCase() === lookupValue.toLowerCase()
    );
  });
  if (aliasMatch) {
    const [canonicalName] = aliasMatch;
    const matchInData = availableMetrics.find(m => 
      m.value.toLowerCase() === canonicalName.toLowerCase()
    );
    if (matchInData) {
      return { found: true, matchedValue: matchInData.value };
    }
  }

  const fuse = new Fuse(availableMetrics, fuseOptions);
  const fuzzyMatches = fuse.search(lookupValue);
  
  if (fuzzyMatches.length > 0 && fuzzyMatches[0].score && fuzzyMatches[0].score < 0.4) {
    return { 
      found: true, 
      matchedValue: fuzzyMatches[0].item.value 
    };
  }

  return { 
    found: false, 
    reason: `No match found for "${lookupValue}" in the data` 
  };
}

export function validateMetricValue(row: MetricsRow, matchedValue: string): MatchResult {
  const dateColumns = Object.keys(row).filter(key => 
    typeof key === 'string' && /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\d{2}$/i.test(key)
  ).sort();

  if (dateColumns.length === 0) {
    return {
      found: false,
      reason: 'No valid date columns found in the data'
    };
  }

  const columnValues = dateColumns.map(column => ({
    column,
    value: parseNumericValue(row[column])
  }));

  const validValues = columnValues.filter(cv => cv.value !== null && cv.value !== 0);
  const emptyOrZeroCells = columnValues.filter(cv => cv.value === null || cv.value === 0)
    .map(cv => cv.column);

  if (validValues.length === 0) {
    return {
      found: false,
      reason: `Found "${matchedValue}" but no valid numeric values found in columns: ${emptyOrZeroCells.join(', ')}`
    };
  }

  if (emptyOrZeroCells.length > 0) {
    const validColumns = columnValues
      .filter(cv => cv.value !== null && cv.value !== 0)
      .map(cv => cv.column);
      
    return {
      found: true,
      matchedValue,
      reason: validColumns.length < dateColumns.length ? 
        `Some columns contain empty or invalid values: ${emptyOrZeroCells.join(', ')}. Valid data found in: ${validColumns.join(', ')}` :
        undefined
    };
  }

  return {
    found: true,
    matchedValue
  };
}