"use client";

import { cn } from "@/lib/utils";
import { AGENT_CONFIG, type Agent } from "@/lib/supabase";
import { AgentAvatar } from "./agent-avatar";
import { timeAgo } from "@/lib/utils";
import { MessageSquare, Mic } from "lucide-react";

interface AgentCardProps {
  agent: Agent;
  onOpenChat?: (agentId: string) => void;
  className?: string;
}

export function AgentCard({ agent, onOpenChat, className }: AgentCardProps) {
  const config = AGENT_CONFIG[agent.id];
  const color = config?.color || "#ff2d4a";
  const statusLabel = agent.status.replace("_", " ").toUpperCase();

  return (
    <div
      className={cn(
        "relative bg-background-card border border-border rounded overflow-hidden transition-all duration-300 group cursor-pointer",
        "hover:border-opacity-80",
        className
      )}
      style={{
        borderColor: agent.status === "active" ? color : undefined,
        boxShadow: agent.status === "active" ? `0 0 20px ${color}22` : undefined,
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: color }}
      />

      {/* Scan line effect when active */}
      {agent.status === "active" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute left-0 right-0 h-8 opacity-10"
            style={{
              background: `linear-gradient(to bottom, transparent, ${color}, transparent)`,
              animation: "scan-line 3s linear infinite",
            }}
          />
        </div>
      )}

      <div className="p-4 md:p-5 relative z-10">
        {/* Header with avatar and status */}
        <div className="flex items-start gap-4">
          <AgentAvatar
            agentId={agent.id}
            status={agent.status}
            size="md"
            showGlow={true}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3
                className="font-display text-sm md:text-base tracking-widest truncate"
                style={{ color }}
              >
                {config?.name || agent.name}
              </h3>
              <StatusBadge status={agent.status} color={color} />
            </div>
            <p className="text-foreground-dim text-xs tracking-wider mt-1">
              {config?.role || agent.role}
            </p>
          </div>
        </div>

        {/* Current task */}
        <div className="mt-4 min-h-[40px]">
          <p className="text-foreground-muted text-xs leading-relaxed line-clamp-2">
            {agent.current_task || "Standing by for orders..."}
          </p>
        </div>

        {/* Footer with timestamp and actions */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-foreground-dim text-[10px] tracking-wider">
            {agent.last_active ? timeAgo(agent.last_active) : "Never active"}
          </span>
          
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenChat?.(agent.id);
              }}
              className="p-1.5 rounded bg-background-tertiary hover:bg-primary/20 transition-colors"
              style={{ color }}
              aria-label={`Chat with ${config?.name}`}
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Voice interaction will be handled in chat
                onOpenChat?.(agent.id);
              }}
              className="p-1.5 rounded bg-background-tertiary hover:bg-primary/20 transition-colors"
              style={{ color }}
              aria-label={`Voice chat with ${config?.name}`}
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status, color }: { status: string; color: string }) {
  const label = status.replace("_", " ").toUpperCase();
  
  const getStyles = () => {
    switch (status) {
      case "active":
        return {
          bg: `${color}22`,
          border: color,
          text: color,
          animate: true,
        };
      case "idle":
        return {
          bg: "rgba(107, 114, 128, 0.1)",
          border: "rgba(107, 114, 128, 0.5)",
          text: "rgb(107, 114, 128)",
          animate: false,
        };
      case "pending_approval":
        return {
          bg: "rgba(255, 184, 0, 0.1)",
          border: "rgba(255, 184, 0, 0.7)",
          text: "#ffb800",
          animate: true,
        };
      case "paused":
      case "error":
        return {
          bg: "rgba(255, 45, 74, 0.1)",
          border: "rgba(255, 45, 74, 0.7)",
          text: "#ff2d4a",
          animate: status === "error",
        };
      default:
        return {
          bg: "rgba(107, 114, 128, 0.1)",
          border: "rgba(107, 114, 128, 0.5)",
          text: "rgb(107, 114, 128)",
          animate: false,
        };
    }
  };

  const styles = getStyles();

  return (
    <span
      className={cn(
        "px-2 py-0.5 text-[9px] font-display tracking-wider rounded whitespace-nowrap",
        styles.animate && "animate-pulse-glow"
      )}
      style={{
        background: styles.bg,
        border: `1px solid ${styles.border}`,
        color: styles.text,
      }}
    >
      {label}
    </span>
  );
}
