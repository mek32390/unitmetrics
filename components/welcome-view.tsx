"use client";

import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

interface WelcomeViewProps {
  children: ReactNode;
}

export function WelcomeView({ children }: WelcomeViewProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="max-w-2xl p-8">
        <div className="flex flex-col items-center gap-6">
          <div className="rounded-full bg-primary/10 p-4">
            <BarChart3 className="h-12 w-12 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Unit Economics Dashboard</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Upload your financial model CSV to analyze key metrics, track performance, and gain valuable insights into your business unit economics.
            </p>
          </div>
          <div className="flex justify-center">
            {children}
          </div>
        </div>
      </Card>
    </div>
  );
}