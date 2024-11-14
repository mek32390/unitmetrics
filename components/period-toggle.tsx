"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface PeriodToggleProps {
  value: "monthly" | "quarterly";
  onValueChange: (value: "monthly" | "quarterly") => void;
}

export function PeriodToggle({ value, onValueChange }: PeriodToggleProps) {
  return (
    <ToggleGroup type="single" value={value} onValueChange={onValueChange}>
      <ToggleGroupItem value="monthly" size="sm">Monthly</ToggleGroupItem>
      <ToggleGroupItem value="quarterly" size="sm">Quarterly</ToggleGroupItem>
    </ToggleGroup>
  );
}