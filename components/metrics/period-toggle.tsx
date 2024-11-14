"use client";

import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { chartStyles } from "@/lib/chart-styles";

interface PeriodToggleProps {
  value: "monthly" | "quarterly";
  onValueChange: (value: "monthly" | "quarterly") => void;
}

export function PeriodToggle({ value, onValueChange }: PeriodToggleProps) {
  const togglePeriod = () => {
    onValueChange(value === "monthly" ? "quarterly" : "monthly");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={togglePeriod}
      className={cn(
        value === "monthly" ? chartStyles.periodToggle.button : chartStyles.periodToggle.activeButton,
        "gap-1.5"
      )}
    >
      <Eye className="h-4 w-4" />
      {value === "monthly" ? "Monthly" : "Quarterly"}
    </Button>
  );
}