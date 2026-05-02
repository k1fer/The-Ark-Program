"use client";

import { cn } from "@/lib/utils";
import { AGENT_CONFIG, type Agent } from "@/lib/supabase";
import { timeAgo } from "@/lib/utils";
import Image from "next/image";

// Avatar image paths for agents
const AGENT_AVATARS: Record<string, string | null> = {
  ares: "/avatars/ares.png",
  athena: "/avatars/athena.png",
  apollo: null,
  argus: null,
  aegis: null,
};

// Agent accent colors matching reference
const AGENT_COLORS: Record<string, string> = {
  ares: "#ffffff",
  athena: "#ff3366",
  apollo: "#ffaa00",
  argus: "#ffffff",
  aegis: "#ff4444",
};

// Agent role subtitles
const AGENT_ROLES: Record<string, string> = {
  ares: "COMMANDER",
  athena: "INTELLIGENCE",
  apollo: "CREATION",
  argus: "ANALYTICS",
  aegis: "SECURITY",
};

interface AgentCardProps {
  agent: Agent;
  onOpenChat?: (agentId: string) => void;
  className?: string;
}

export function AgentCard({ agent, onOpenChat, className }: AgentCardProps) {
  const color = AGENT_COLORS[agent.id] || "#ff4444";
  const role = AGENT_ROLES[agent.id] || agent.role;
  const avatarSrc = AGENT_AVATARS[agent.id];
  const isActive = agent.status === "active";
  const config = AGENT_CONFIG[agent.id];

  return (
    <div
      className={cn(
        "relative bg-background-card border border-border rounded-sm overflow-hidden group",
        "hover:border-border-active/30 transition-colors",
        className
      )}
      style={{
        borderColor: isActive ? `${color}33` : undefined,
      }}
    >
      {/* Top border accent */}
      <div 
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, transparent, ${color}66, transparent)` }}
      />

      <div className="p-4">
        {/* Header row: Avatar + Name */}
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div 
            className="w-14 h-14 rounded-sm overflow-hidden flex-shrink-0 relative"
            style={{
              background: avatarSrc ? '#0d090b' : `linear-gradient(135deg, ${color}22, ${color}11)`,
              border: `1px solid ${color}44`,
            }}
          >
            {avatarSrc ? (
              <Image
                src={avatarSrc}
                alt={`${agent.id} avatar`}
                fill
                className="object-cover"
                sizes="56px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div 
                  className="w-6 h-6 rounded-full opacity-30"
                  style={{ background: color }}
                />
              </div>
            )}
            {/* Glow effect for active */}
            {isActive && (
              <div 
                className="absolute inset-0 animate-pulse-dot"
                style={{ boxShadow: `inset 0 0 20px ${color}22` }}
              />
            )}
          </div>

          {/* Name and role */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 
                className="font-display text-base tracking-widest"
                style={{ color }}
              >
                {config?.name || agent.name.toUpperCase()}
              </h3>
              {/* Small icon for specific agents */}
              {agent.id === "argus" && (
                <svg className="w-4 h-4 text-foreground-dim" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              )}
              {agent.id === "aegis" && (
                <svg className="w-4 h-4 text-foreground-dim" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              )}
            </div>
            <p 
              className="text-[10px] tracking-[0.2em] mt-0.5"
              style={{ color: `${color}88` }}
            >
              {role}
            </p>
          </div>
        </div>

        {/* Status row */}
        <div className="flex items-center justify-between mt-3 text-[10px] tracking-wider">
          <span className="text-foreground-dim">STATUS</span>
          <span className={cn(
            "flex items-center gap-1.5",
            isActive ? "text-active" : "text-foreground-dim"
          )}>
            {isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-active status-active animate-pulse-dot" />
            )}
            {isActive ? "ACTIVE" : "IDLE"}
          </span>
        </div>

        {/* Current task */}
        <div className="mt-3">
          <p className="text-[10px] tracking-wider text-foreground-dim mb-1">CURRENT TASK</p>
          <p className="text-xs text-foreground-muted leading-relaxed line-clamp-2 min-h-[32px]">
            {agent.current_task || "Standing by..."}
          </p>
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <button
            onClick={() => onOpenChat?.(agent.id)}
            className="text-[10px] tracking-wider text-foreground-muted hover:text-foreground transition-colors"
          >
            _ INTERACT
          </button>
          <span className="text-[10px] tracking-wider text-foreground-dim">
            UPLINK: {agent.last_active ? timeAgo(agent.last_active) : "Never"}
          </span>
        </div>
      </div>
    </div>
  );
}
