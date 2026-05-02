import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

// Types based on the ARK database schema
export interface Agent {
  id: string;
  name: string;
  role: string;
  status: "idle" | "active" | "pending_approval" | "paused" | "error";
  current_task: string | null;
  last_active: string | null;
  config: Record<string, unknown> | null;
}

export interface ThoughtLog {
  id: string;
  agent_id: string;
  thought: string;
  thought_type: "reasoning" | "decision" | "error" | "milestone";
  created_at: string;
}

export interface ApprovalQueueItem {
  id: string;
  requesting_agent: string;
  action_type: string;
  action_detail: Record<string, unknown>;
  risk_tier: number;
  aegis_assessment: string | null;
  status: "pending" | "approved" | "denied" | "expired";
  operator_note: string | null;
  created_at: string;
  expires_at: string;
  resolved_at: string | null;
}

export interface AthenaReport {
  id: string;
  report_type: string;
  title: string;
  detail: Record<string, unknown>;
  confidence_score: number | null;
  priority: "low" | "medium" | "high";
  actioned: boolean;
  created_at: string;
}

export interface RevenueEvent {
  id: string;
  platform: string;
  event_type: string;
  amount: number;
  currency: string;
  pipeline: string | null;
  raw_data: Record<string, unknown> | null;
  created_at: string;
}

export interface EODReport {
  id: string;
  report_date: string;
  content: string;
  revenue_today: number;
  revenue_week: number;
  revenue_month: number;
  created_at: string;
}

export interface OperatorDirective {
  id: string;
  content: string;
  addressed_to: string;
  status: "pending" | "received" | "actioned";
  ares_response: string | null;
  created_at: string;
}

export interface AgentMessage {
  id: string;
  from_agent: string;
  to_agent: string;
  message_type: string;
  payload: Record<string, unknown>;
  priority: "low" | "normal" | "high" | "critical";
  status: "pending" | "read" | "acted";
  created_at: string;
}

// Agent metadata with colors and roles
export const AGENT_CONFIG: Record<
  string,
  {
    name: string;
    role: string;
    color: string;
    colorClass: string;
    description: string;
    voice: string;
  }
> = {
  ares: {
    name: "ARES",
    role: "Commander",
    color: "#ff2d4a",
    colorClass: "text-ares",
    description: "Lead agent. Supervises all operations and executes distribution.",
    voice: "en-US-Neural2-D",
  },
  athena: {
    name: "ATHENA",
    role: "Intelligence",
    color: "#00c8ff",
    colorClass: "text-athena",
    description: "Scans for opportunities, keywords, trends, and pain points.",
    voice: "en-US-Neural2-F",
  },
  apollo: {
    name: "APOLLO",
    role: "Creation",
    color: "#c084fc",
    colorClass: "text-apollo",
    description: "Transforms intelligence into content and digital products.",
    voice: "en-US-Neural2-A",
  },
  argus: {
    name: "ARGUS",
    role: "Analytics",
    color: "#00ff88",
    colorClass: "text-argus",
    description: "Tracks revenue, performance, and optimization signals.",
    voice: "en-US-Neural2-I",
  },
  aegis: {
    name: "AEGIS",
    role: "Security",
    color: "#ffb800",
    colorClass: "text-aegis",
    description: "Monitors actions, enforces rules, manages approvals.",
    voice: "en-US-Neural2-J",
  },
};
