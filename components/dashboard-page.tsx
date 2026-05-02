"use client";

import { type Agent, type ThoughtLog } from "@/lib/supabase";
import { AgentCard } from "./agent-card";
import { ThoughtFeed } from "./thought-feed";
import { DirectiveInput } from "./directive-input";

interface DashboardPageProps {
  agents: Agent[];
  thoughts: ThoughtLog[];
  onOpenChat: (agentId: string) => void;
  onSendDirective: (content: string) => Promise<void>;
}

export function DashboardPage({
  agents,
  thoughts,
  onOpenChat,
  onSendDirective,
}: DashboardPageProps) {
  const agentOrder = ["ares", "athena", "apollo", "argus", "aegis"];
  const sortedAgents = agentOrder
    .map((id) => agents.find((a) => a.id === id))
    .filter((a): a is Agent => a !== undefined);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Agent Grid */}
      <section>
        <h2 className="font-display text-xs tracking-[0.3em] text-foreground-dim mb-4 pb-2 border-b border-border">
          AGENT STATUS
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {sortedAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onOpenChat={onOpenChat}
            />
          ))}
        </div>
      </section>

      {/* Thought Feed */}
      <section>
        <h2 className="font-display text-xs tracking-[0.3em] text-foreground-dim mb-4 pb-2 border-b border-border">
          LIVE THOUGHT FEED
        </h2>
        <ThoughtFeed thoughts={thoughts} />
      </section>

      {/* Directive Input */}
      <section>
        <DirectiveInput onSend={onSendDirective} />
      </section>
    </div>
  );
}
