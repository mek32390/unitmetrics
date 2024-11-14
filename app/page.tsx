"use client";

import { useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { MetricsDashboard } from "@/components/metrics-dashboard";
import { WelcomeView } from "@/components/welcome-view";
import { useToast } from "@/components/ui/use-toast";
import { useDashboardStore } from "@/lib/store";
import { MetricsRow } from "@/lib/constants";

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false);
  const { setData } = useDashboardStore();
  const { toast } = useToast();

  const handleDataLoaded = (data: MetricsRow[], companyName: string) => {
    try {
      setData(data, companyName);
      setShowDashboard(true);
      
      toast({
        title: "Data loaded successfully",
        description: `Loaded ${data.length} rows of metrics data`,
      });
    } catch (error) {
      console.error('Data processing error:', error);
      
      toast({
        title: "Error processing data",
        description: error instanceof Error ? error.message : "Invalid data format",
        variant: "destructive",
      });
      
      setShowDashboard(false);
    }
  };

  if (showDashboard) {
    return (
      <main className="container mx-auto p-4">
        <MetricsDashboard data={useDashboardStore.getState().data || []} />
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4">
      <WelcomeView>
        <FileUpload onDataLoaded={handleDataLoaded} />
      </WelcomeView>
    </main>
  );
}