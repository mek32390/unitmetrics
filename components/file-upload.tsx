"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { METRICS_LOOKUP_COLUMN, type MetricsRow } from '@/lib/constants';

interface FileUploadProps {
  onDataLoaded: (data: MetricsRow[], companyName: string) => void;
}

export function FileUpload({ onDataLoaded }: FileUploadProps) {
  const { toast } = useToast();

  const validateHeaders = (headers: string[]): boolean => {
    const datePattern = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\d{2}$/i;
    const dateColumns = headers.filter(header => datePattern.test(header));
    return dateColumns.length > 0;
  };

  const processFile = (file: File) => {
    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const rows = results.data as string[][];
          
          if (!Array.isArray(rows) || rows.length < 2) {
            throw new Error("The CSV file must contain at least two rows");
          }

          // Get the company name from cell B1 (second cell of first row)
          const companyName = rows[0][1]?.trim();
          if (!companyName) {
            throw new Error("Company name not found in cell B1");
          }

          // Get headers from the first row (excluding A1 and B1)
          const headers = rows[0].slice(2).map(h => h?.trim()).filter(Boolean);
          if (!validateHeaders(headers)) {
            throw new Error("CSV must contain monthly data columns (e.g., Jan-23, Feb-23)");
          }

          // Process data rows starting from row 2
          const processedRows = rows.slice(1)
            .filter(row => row.length >= 3) // Ensure row has at least 3 columns
            .map(row => {
              const metricName = row[1]?.trim(); // Use column B for metric names
              if (!metricName) return null;

              const rowData: MetricsRow = {
                [METRICS_LOOKUP_COLUMN]: metricName
              };

              // Add date values starting from the third column
              headers.forEach((header, index) => {
                if (header) {
                  rowData[header] = row[index + 2]?.trim() || "0";
                }
              });

              return rowData;
            })
            .filter((row): row is MetricsRow => row !== null);

          if (processedRows.length === 0) {
            throw new Error("No valid metric rows found in the CSV file");
          }

          onDataLoaded(processedRows, companyName);
          toast({
            title: "Success",
            description: `Loaded ${processedRows.length} metrics successfully`,
          });
        } catch (error) {
          console.error("Data processing error:", error);
          toast({
            title: "Error processing CSV",
            description: error instanceof Error ? error.message : "Invalid CSV format",
            variant: "destructive",
          });
        }
      },
      error: (error) => {
        console.error("CSV parsing error:", error);
        toast({
          title: "Error reading file",
          description: "Please make sure this is a valid CSV file",
          variant: "destructive",
        });
      }
    });
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv'],
    },
    multiple: false,
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Card className={`p-8 cursor-pointer transition-colors ${
        isDragActive ? 'bg-primary/10' : 'hover:bg-primary/5'
      }`}>
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-primary/10">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-lg font-medium">
              {isDragActive ? 'Drop your CSV file here' : 'Drag & drop your CSV file here'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to select a file
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}