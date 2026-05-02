"use client";

import { cn } from "@/lib/utils";
import { AGENT_CONFIG, type ThoughtLog } from "@/lib/supabase";
import { useEffect, useRef } from "react";

// Agent colors matching the cards
const AGENT_COLORS: Record<string, string> = {
  ares: "#ffffff",
  athena: "#ff3366",
  apollo: "#ffaa00",
  argus: "#ffffff",
  aegis: "#ff4444",
  master_control: "#dc2626",
};

interface ThoughtFeedProps {
  thoughts: ThoughtLog[];
  className?: string;
  autoScroll?: boolean;
}

export function ThoughtFeed({ thoughts, className, autoScroll = true }: ThoughtFeedProps) {
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [thoughts, autoScroll]);

  return (
    <div className={cn("bg-background-secondary border border-border rounded-sm", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
        <span className="text-[11px] tracking-[0.15em] text-foreground-muted">LIVE THOUGHT FEED</span>
        <span className="flex items-center gap-2 text-[10px] text-foreground-dim">
          <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse-dot" />
          REC
        </span>
      </div>
      
      {/* Feed content */}
      <div
        ref={feedRef}
        className="h-[280px] lg:h-[320px] overflow-y-auto"
      >
        {thoughts.length === 0 ? (
          <div className="flex items-center justify-center h-full text-foreground-dim text-xs">
            <div className="text-center">
              <p className="tracking-wider">AWAITING TRANSMISSION</p>
              <p className="text-[10px] mt-1 opacity-60">Agent activity will appear here</p>
            </div>
          </div>
        ) : (
          <div className="p-3 space-y-1">
            {thoughts.map((thought) => (
              <ThoughtEntry key={thought.id} thought={thought} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ThoughtEntry({ thought }: { thought: ThoughtLog }) {
  const color = AGENT_COLORS[thought.agent_id] || "#ff4444";
  const config = AGENT_CONFIG[thought.agent_id];
  const time = new Date(thought.created_at).toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Check if thought contains a URL
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = thought.thought.split(urlRegex);

  return (
    <div className="py-2 group hover:bg-background-tertiary/30 px-2 -mx-2 rounded-sm transition-colors">
      <div className="flex items-start gap-3">
        {/* Timestamp */}
        <span className="text-[10px] text-foreground-dim font-mono flex-shrink-0 pt-0.5">
          [{time}]
        </span>
        
        {/* Agent name */}
        <span 
          className="text-[11px] tracking-wider font-semibold flex-shrink-0 pt-0.5"
          style={{ color }}
        >
          {config?.name || thought.agent_id.toUpperCase()}
        </span>
        
        {/* Thought content */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-foreground leading-relaxed">
            <span className="text-foreground-muted mr-1">&gt;</span>
            {parts.map((part, i) => 
              urlRegex.test(part) ? (
                <a 
                  key={i}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-info underline hover:text-info/80 break-all"
                >
                  {part}
                </a>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
