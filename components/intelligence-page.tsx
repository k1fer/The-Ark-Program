"use client";

import { cn } from "@/lib/utils";
import { type AthenaReport } from "@/lib/supabase";
import { getPriorityColor, formatDate } from "@/lib/utils";
import { Lightbulb, CheckCircle } from "lucide-react";

interface IntelligencePageProps {
  reports: AthenaReport[];
}

export function IntelligencePage({ reports }: IntelligencePageProps) {
  return (
    <div className="p-4 md:p-6">
      <h2 className="font-display text-xs tracking-[0.3em] text-foreground-dim mb-4 pb-2 border-b border-border">
        ATHENA INTELLIGENCE REPORTS
      </h2>

      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-foreground-dim">
          <Lightbulb className="w-12 h-12 mb-4 opacity-30" />
          <p className="font-display tracking-wider">NO REPORTS YET</p>
          <p className="text-sm mt-2 opacity-60">Athena will file on next scan</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <ReportItem key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}

function ReportItem({ report }: { report: AthenaReport }) {
  const priorityStyles = getPriorityColor(report.priority);
  const confidence = Math.round((report.confidence_score || 0.5) * 100);
  const detail = report.detail || {};

  return (
    <div
      className={cn(
        "bg-background-secondary border border-border rounded-lg p-4",
        report.actioned && "opacity-50"
      )}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <h3 className="font-display text-sm text-foreground">{report.title}</h3>
          <p className="text-[10px] text-athena tracking-wider mt-1">
            {report.report_type.replace(/_/g, " ").toUpperCase()}
            {report.actioned && (
              <span className="ml-2 inline-flex items-center gap-1 text-success">
                <CheckCircle className="w-3 h-3" /> ACTIONED
              </span>
            )}
          </p>
        </div>
        <span
          className={cn(
            "px-2 py-1 text-[10px] font-display tracking-wider rounded border",
            priorityStyles.bg,
            priorityStyles.text,
            priorityStyles.border
          )}
        >
          {report.priority.toUpperCase()}
        </span>
      </div>

      <p className="text-sm text-foreground-muted leading-relaxed mb-3">
        {(detail.detail as string) ||
          (detail.recommended_action as string) ||
          JSON.stringify(detail).slice(0, 200)}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-[200px]">
          <p className="text-[10px] text-foreground-dim mb-1">
            Confidence: {confidence}%
          </p>
          <div className="h-1 bg-background-tertiary rounded-full overflow-hidden">
            <div
              className="h-full bg-athena transition-all duration-500"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>
        <p className="text-[10px] text-foreground-dim">
          {formatDate(report.created_at)}
        </p>
      </div>
    </div>
  );
}
