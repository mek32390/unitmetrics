"use client";

// Shared styles for all charts
export const chartStyles = {
  tooltip: {
    container: {
      backgroundColor: 'var(--background)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      background: 'color-mix(in srgb, var(--background) 85%, transparent)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '8px 12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      opacity: 0.97,
      zIndex: 1000,
      outline: 'none',
      minWidth: '150px'
    },
    label: {
      color: 'var(--foreground)',
      fontWeight: 500,
      fontSize: '0.875rem',
      marginBottom: '4px',
      borderBottom: '1px solid var(--border)',
      paddingBottom: '4px'
    },
    item: {
      color: 'var(--foreground)',
      fontSize: '0.75rem',
      padding: '2px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '8px'
    },
    value: {
      fontWeight: 500
    }
  },
  chart: {
    container: "w-full h-[300px]",
    margins: { 
      top: 20, 
      right: 30, 
      left: 30, 
      bottom: 20 
    },
    axis: {
      fontSize: 12,
      width: 80
    }
  },
  header: {
    spacing: "space-y-4"
  },
  periodToggle: {
    button: "text-xs px-3 py-1.5 h-8 bg-secondary/50 hover:bg-secondary transition-colors",
    activeButton: "text-xs px-3 py-1.5 h-8 bg-secondary"
  }
};

// Specific styles for dual metric charts
export const dualMetricStyles = {
  toggleGroup: {
    wrapper: "flex justify-center mt-4 mb-4",
    base: "bg-muted p-0.5 rounded-md text-xs",
    item: "px-2 py-0.5 h-6 data-[state=on]:bg-background"
  }
};