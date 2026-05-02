"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { type EODReport } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import { FileText, ArrowLeft, Calendar } from "lucide-react";
import { marked } from "marked";

interface ReportsPageProps {
  reports: EODReport[];
}

export function ReportsPage({ reports }: ReportsPageProps) {
  const [selectedReport, setSelectedReport] = useState<EODReport | null>(null);

  if (selectedReport) {
    return (
      <div className="p-4 md:p-6">
        <button
          onClick={() => setSelectedReport(null)}
          className="flex items-center gap-2 px-3 py-2 text-sm text-foreground-muted hover:text-foreground border border-border rounded mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          BACK TO REPORTS
        </button>

        <div className="bg-background-secondary border border-border rounded-lg p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-primary tracking-wider">
              {selectedReport.report_date}
            </h2>
            <div className="text-sm text-foreground-muted">
              Revenue: {formatCurrency(selectedReport.revenue_today)} today
            </div>
          </div>

          <div
            className="prose prose-invert prose-sm max-w-none"
            dangerouslySetInnerHTML={{
              __html: marked.parse(selectedReport.content || "") as string,
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <h2 className="font-display text-xs tracking-[0.3em] text-foreground-dim mb-4 pb-2 border-b border-border">
        END-OF-DAY REPORTS
      </h2>

      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-foreground-dim">
          <FileText className="w-12 h-12 mb-4 opacity-30" />
          <p className="font-display tracking-wider">NO REPORTS YET</p>
          <p className="text-sm mt-2 opacity-60">
            Argus files nightly at 23:00 SGT
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report)}
              className={cn(
                "w-full flex items-center justify-between p-4",
                "bg-background-secondary border border-border rounded-lg",
                "hover:border-primary/50 transition-colors text-left"
              )}
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="font-display text-sm text-primary tracking-wider">
                  {report.report_date}
                </span>
              </div>
              <div className="text-sm text-foreground-muted">
                {formatCurrency(report.revenue_today)} today /{" "}
                {formatCurrency(report.revenue_month)} month
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
