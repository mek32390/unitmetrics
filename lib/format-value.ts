export function formatValue(value: number, metricType: string): string {
  if (typeof value !== 'number') return '0';

  const metricTypeLower = metricType.toLowerCase();

  // Handle ratio/multiplier values
  if (metricTypeLower.includes('ltv:cac') || 
      metricTypeLower.includes('ltgp/cac') || 
      metricTypeLower.includes('purchases per customer') ||
      metricTypeLower.includes('roas') ||
      metricTypeLower.includes('ratio')) {
    return `${value.toFixed(2)}x`;
  }

  // Handle currency values
  if (metricTypeLower.includes('revenue') || 
      metricTypeLower.includes('spend') || 
      metricTypeLower.includes('expenses') ||
      metricTypeLower.includes('cac')) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  // Handle percentage values
  if (metricTypeLower.includes('rate') || 
      metricTypeLower.includes('percentage') ||
      metricTypeLower.includes('%')) {
    return `${value.toFixed(1)}%`;
  }

  // Default number formatting for other metrics
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}