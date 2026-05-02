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
    <div className="p-4 lg:p-6 space-y-6">
      {/* Agent Cards - Horizontal row on desktop */}
      <section>
        <div className="flex flex-nowrap gap-4 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:overflow-visible">
          {sortedAgents.map((agent) => (
            <div key={agent.id} className="flex-shrink-0 w-[200px] lg:flex-1 lg:w-auto lg:min-w-[180px]">
              <AgentCard
                agent={agent}
                onOpenChat={onOpenChat}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Two column layout: Action Stream + Command Override */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Action Stream */}
        <section className="lg:col-span-2">
          <h2 className="section-header mb-4">ACTION STREAM</h2>
          <ThoughtFeed thoughts={thoughts} />
        </section>

        {/* Right: Command Override */}
        <section className="lg:col-span-1">
          <h2 className="section-header mb-4">COMMAND OVERRIDE</h2>
          <div className="space-y-4">
            <DirectiveInput onSend={onSendDirective} />
            
            {/* Help text */}
            <div className="text-[11px] text-foreground-dim space-y-1 leading-relaxed">
              <p className="flex items-start gap-2">
                <span className="text-foreground-muted">&gt;</span>
                Directives execute securely via ARES.
              </p>
              <p className="flex items-start gap-2">
                <span className="text-foreground-muted">&gt;</span>
                Ensure instructions are unambiguous.
              </p>
              <p className="flex items-start gap-2">
                <span className="text-foreground-muted">&gt;</span>
                Click on any Agent Card above to open direct secure comms.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
