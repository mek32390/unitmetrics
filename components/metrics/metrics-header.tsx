"use client";

import { Info } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MetricsHeaderProps {
  companyName: string;
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
  missingMetrics: Array<{ label: string; reason: string }>;
}

export function MetricsHeader({ 
  companyName, 
  timeRange, 
  onTimeRangeChange,
  missingMetrics
}: MetricsHeaderProps) {
  const missingCount = missingMetrics.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{companyName}</h1>
        <p className="text-sm text-muted-foreground">Unit Economics Dashboard</p>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          {missingCount > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-sm text-muted-foreground cursor-help flex items-center gap-1">
                    <Info className="w-4 h-4" />
                    {missingCount} metric{missingCount === 1 ? '' : 's'} not found
                  </p>
                </TooltipTrigger>
                <TooltipContent className="max-w-[400px]">
                  <p className="font-medium mb-2">Missing or Invalid Metrics:</p>
                  <ul className="space-y-3">
                    {missingMetrics.map((metric) => (
                      <li key={metric.label} className="text-sm">
                        <span className="font-medium text-primary">{metric.label}</span>
                        <br />
                        <span className="text-muted-foreground whitespace-pre-line">
                          {metric.reason}
                        </span>
                      </li>
                    ))}
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <Select value={timeRange} onValueChange={onTimeRangeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last-month">Last Month</SelectItem>
            <SelectItem value="3m">Last 3 Months</SelectItem>
            <SelectItem value="6m">Last 6 Months</SelectItem>
            <SelectItem value="1y">Last 12 Months</SelectItem>
            <SelectItem value="ytd">Year to Date</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}