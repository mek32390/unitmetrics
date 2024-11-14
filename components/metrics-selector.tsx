"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { metricCategories } from "@/lib/metrics-categories";

interface MetricsSelectorProps {
  selectedMetric: string | null;
  onSelect: (metric: string) => void;
}

export function MetricsSelector({ selectedMetric, onSelect }: MetricsSelectorProps) {
  const [open, setOpen] = React.useState(false);

  // Transform metricCategories into the format needed for the selector
  const metricGroups = Object.entries(metricCategories).reduce((acc, [group, category]) => {
    acc[category.label] = category.metrics.map(metric => metric.label);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedMetric || "Select metric..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search metrics..." />
          <CommandEmpty>No metric found.</CommandEmpty>
          {Object.entries(metricGroups).map(([group, metrics]) => (
            <CommandGroup key={group} heading={group}>
              {metrics.map((metric) => (
                <CommandItem
                  key={metric}
                  value={metric}
                  onSelect={() => {
                    onSelect(metric);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedMetric === metric ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {metric}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </Command>
      </PopoverContent>
    </Popover>
  );
}