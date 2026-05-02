"use client";

import { cn } from "@/lib/utils";
import { AGENT_CONFIG, type ThoughtLog } from "@/lib/supabase";
import { AgentAvatarMini } from "./agent-avatar";
import { useEffect, useRef } from "react";

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
    <div
      ref={feedRef}
      className={cn(
        "bg-background-secondary border border-border rounded overflow-y-auto",
        "h-[300px] md:h-[350px]",
        className
      )}
    >
      {thoughts.length === 0 ? (
        <div className="flex items-center justify-center h-full text-foreground-dim text-sm">
          <div className="text-center">
            <p className="font-display tracking-wider">AWAITING TRANSMISSION</p>
            <p className="text-xs mt-1 opacity-60">Agent activity will appear here</p>
          </div>
        </div>
      ) : (
        <div className="p-3 space-y-2">
          {thoughts.map((thought) => (
            <ThoughtEntry key={thought.id} thought={thought} />
          ))}
        </div>
      )}
    </div>
  );
}

function ThoughtEntry({ thought }: { thought: ThoughtLog }) {
  const config = AGENT_CONFIG[thought.agent_id];
  const color = config?.color || "#ff2d4a";
  const time = new Date(thought.created_at).toLocaleTimeString("en-SG", {
    hour12: false,
  });

  const getBorderStyle = () => {
    switch (thought.thought_type) {
      case "error":
        return { borderColor: "#ff2d4a", backgroundColor: "rgba(255, 45, 74, 0.05)" };
      case "milestone":
        return { borderColor: "#ffb800", backgroundColor: "rgba(255, 184, 0, 0.05)" };
      case "decision":
        return { borderColor: "#00c8ff", backgroundColor: "rgba(0, 200, 255, 0.05)" };
      default:
        return { borderColor: color, backgroundColor: "transparent" };
    }
  };

  const styles = getBorderStyle();

  return (
    <div
      className={cn(
        "p-3 rounded border-l-2 transition-colors",
        "hover:bg-background-tertiary/50"
      )}
      style={styles}
    >
      <div className="flex items-center gap-2 mb-1">
        <AgentAvatarMini agentId={thought.agent_id} />
        <span
          className="font-display text-[10px] tracking-wider"
          style={{ color }}
        >
          {config?.name || thought.agent_id.toUpperCase()}
        </span>
        <span className="text-foreground-dim text-[10px] ml-auto">{time}</span>
        {thought.thought_type !== "reasoning" && (
          <span
            className={cn(
              "text-[8px] px-1.5 py-0.5 rounded font-display tracking-wider",
              thought.thought_type === "error" && "bg-danger/20 text-danger",
              thought.thought_type === "milestone" && "bg-warning/20 text-warning",
              thought.thought_type === "decision" && "bg-info/20 text-info"
            )}
          >
            {thought.thought_type.toUpperCase()}
          </span>
        )}
      </div>
      <p className="text-foreground text-xs leading-relaxed pl-8">
        {thought.thought}
      </p>
    </div>
  );
}
