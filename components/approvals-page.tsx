"use client";

import { cn } from "@/lib/utils";
import { AGENT_CONFIG, type ApprovalQueueItem } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import { AgentAvatarMini } from "./agent-avatar";
import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";

interface ApprovalsPageProps {
  approvals: ApprovalQueueItem[];
  onApprove: (id: string) => Promise<void>;
  onDeny: (id: string) => Promise<void>;
}

export function ApprovalsPage({ approvals, onApprove, onDeny }: ApprovalsPageProps) {
  const pendingApprovals = approvals.filter((a) => a.status === "pending");

  return (
    <div className="p-4 md:p-6">
      <h2 className="font-display text-xs tracking-[0.3em] text-foreground-dim mb-4 pb-2 border-b border-border">
        APPROVAL QUEUE
      </h2>

      {pendingApprovals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-foreground-dim">
          <CheckCircle className="w-12 h-12 mb-4 opacity-30" />
          <p className="font-display tracking-wider">NO PENDING APPROVALS</p>
          <p className="text-sm mt-2 opacity-60">All clear, Master Control</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingApprovals.map((approval) => (
            <ApprovalItem
              key={approval.id}
              approval={approval}
              onApprove={onApprove}
              onDeny={onDeny}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ApprovalItem({
  approval,
  onApprove,
  onDeny,
}: {
  approval: ApprovalQueueItem;
  onApprove: (id: string) => Promise<void>;
  onDeny: (id: string) => Promise<void>;
}) {
  const config = AGENT_CONFIG[approval.requesting_agent];
  const color = config?.color || "#ffb800";

  const getTierLabel = (tier: number) => {
    switch (tier) {
      case 0: return "AUTO";
      case 1: return "LOW";
      case 2: return "MEDIUM";
      case 3: return "HIGH";
      default: return "UNKNOWN";
    }
  };

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 0: return "text-success border-success/50 bg-success/10";
      case 1: return "text-info border-info/50 bg-info/10";
      case 2: return "text-warning border-warning/50 bg-warning/10";
      case 3: return "text-danger border-danger/50 bg-danger/10";
      default: return "text-foreground-muted border-border bg-background-tertiary";
    }
  };

  return (
    <div className="bg-background-secondary border border-border rounded-lg overflow-hidden">
      {/* Top accent */}
      <div className="h-0.5" style={{ background: color }} />
      
      <div className="p-4 md:p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <AgentAvatarMini agentId={approval.requesting_agent} />
            <div>
              <p className="font-display text-xs tracking-wider" style={{ color }}>
                REQUEST FROM {config?.name || approval.requesting_agent.toUpperCase()}
              </p>
              <p className="font-display text-sm text-foreground mt-0.5">
                {approval.action_type.replace(/_/g, " ").toUpperCase()}
              </p>
            </div>
          </div>
          <span className={cn(
            "px-2 py-1 text-[10px] font-display tracking-wider rounded border",
            getTierColor(approval.risk_tier)
          )}>
            TIER {approval.risk_tier} - {getTierLabel(approval.risk_tier)}
          </span>
        </div>

        {/* Action Detail */}
        <div className="bg-background-tertiary border border-border rounded p-3 mb-4 max-h-48 overflow-y-auto">
          <pre className="text-xs text-foreground-muted whitespace-pre-wrap font-mono">
            {JSON.stringify(approval.action_detail, null, 2)}
          </pre>
        </div>

        {/* Aegis Assessment */}
        {approval.aegis_assessment && (
          <div className="flex items-start gap-2 p-3 bg-warning/5 border-l-2 border-warning mb-4">
            <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">{approval.aegis_assessment}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onApprove(approval.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded font-display text-xs tracking-wider",
              "bg-success text-background hover:bg-success/90 transition-colors"
            )}
          >
            <CheckCircle className="w-4 h-4" />
            APPROVE
          </button>
          <button
            onClick={() => onDeny(approval.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded font-display text-xs tracking-wider",
              "bg-transparent border border-danger text-danger hover:bg-danger hover:text-white transition-colors"
            )}
          >
            <XCircle className="w-4 h-4" />
            DENY
          </button>
        </div>

        {/* Timestamps */}
        <div className="flex items-center gap-4 mt-4 text-[10px] text-foreground-dim">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Submitted: {formatDate(approval.created_at)}
          </span>
          <span>
            Expires: {formatDate(approval.expires_at)}
          </span>
        </div>
      </div>
    </div>
  );
}
