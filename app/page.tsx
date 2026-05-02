"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient, type Agent, type ThoughtLog, type ApprovalQueueItem, type AthenaReport, type EODReport, type RevenueEvent, AGENT_CONFIG } from "@/lib/supabase";
import { mockAgents, mockThoughts, mockApprovals, mockAthenaReports, mockEodReports, mockRevenueEvents } from "@/lib/mock-data";
import { LoginScreen } from "@/components/login-screen";
import { TopBar } from "@/components/top-bar";
import { Navigation } from "@/components/navigation";
import { DashboardPage } from "@/components/dashboard-page";
import { ApprovalsPage } from "@/components/approvals-page";
import { IntelligencePage } from "@/components/intelligence-page";
import { RevenuePage } from "@/components/revenue-page";
import { ReportsPage } from "@/components/reports-page";
import { SettingsPage } from "@/components/settings-page";
import { AgentChat } from "@/components/agent-chat";
import { GridBackground } from "@/components/grid-background";
import type { User } from "@supabase/supabase-js";

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};

export default function ArkDashboard() {
  const demoMode = !isSupabaseConfigured();
  const supabase = useMemo(() => {
    if (demoMode) return null;
    return createClient();
  }, [demoMode]);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatAgent, setChatAgent] = useState<Agent | null>(null);

  // Data states - initialize with mock data in demo mode
  const [agents, setAgents] = useState<Agent[]>(demoMode ? mockAgents : []);
  const [thoughts, setThoughts] = useState<ThoughtLog[]>(demoMode ? mockThoughts : []);
  const [approvals, setApprovals] = useState<ApprovalQueueItem[]>(demoMode ? mockApprovals : []);
  const [reports, setReports] = useState<AthenaReport[]>(demoMode ? mockAthenaReports : []);
  const [eodReports, setEodReports] = useState<EODReport[]>(demoMode ? mockEodReports : []);
  const [revenueEvents, setRevenueEvents] = useState<RevenueEvent[]>(demoMode ? mockRevenueEvents : []);
  const [settings, setSettings] = useState<{ niches: string[]; tone: string }>({
    niches: ["AI productivity tools", "no-code automation", "freelancer workflows"],
    tone: "informative, direct, slightly technical, no fluff",
  });
  const [systemStatus, setSystemStatus] = useState({ database: !demoMode, realtime: false });

  // Check auth session (skip in demo mode)
  useEffect(() => {
    if (demoMode) {
      setLoading(false);
      return;
    }

    if (!supabase) return;

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [supabase, demoMode]);

  // Load initial data when authenticated (skip in demo mode)
  useEffect(() => {
    if (demoMode || !user || !supabase) return;

    const loadData = async () => {
      const [
        { data: agentsData },
        { data: thoughtsData },
        { data: approvalsData },
        { data: reportsData },
        { data: eodData },
        { data: revenueData },
        { data: settingsData },
      ] = await Promise.all([
        supabase.from("agents").select("*"),
        supabase.from("thought_logs").select("*").order("created_at", { ascending: false }).limit(50),
        supabase.from("approval_queue").select("*").order("created_at", { ascending: false }),
        supabase.from("athena_reports").select("*").order("created_at", { ascending: false }).limit(50),
        supabase.from("eod_reports").select("*").order("report_date", { ascending: false }).limit(30),
        supabase.from("revenue_events").select("*"),
        supabase.from("operator_settings").select("key, value"),
      ]);

      if (agentsData) setAgents(agentsData);
      if (thoughtsData) setThoughts(thoughtsData);
      if (approvalsData) setApprovals(approvalsData);
      if (reportsData) setReports(reportsData);
      if (eodData) setEodReports(eodData);
      if (revenueData) setRevenueEvents(revenueData);
      if (settingsData) {
        const settingsMap = Object.fromEntries(settingsData.map((s: { key: string; value: unknown }) => [s.key, s.value]));
        setSettings({
          niches: (settingsMap.niches as string[]) || settings.niches,
          tone: typeof settingsMap.tone === "string" ? settingsMap.tone : settings.tone,
        });
      }

      setSystemStatus(prev => ({ ...prev, database: true }));
    };

    loadData();
  }, [user, supabase, demoMode]);

  // Setup realtime subscriptions (skip in demo mode)
  useEffect(() => {
    if (demoMode || !user || !supabase) return;

    const channel = supabase
      .channel("ark-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "thought_logs" }, (payload) => {
        setThoughts((prev) => [payload.new as ThoughtLog, ...prev.slice(0, 49)]);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "agents" }, () => {
        supabase.from("agents").select("*").then(({ data }) => {
          if (data) setAgents(data);
        });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "approval_queue" }, () => {
        supabase.from("approval_queue").select("*").order("created_at", { ascending: false }).then(({ data }) => {
          if (data) setApprovals(data);
        });
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "revenue_events" }, (payload) => {
        setRevenueEvents((prev) => [...prev, payload.new as RevenueEvent]);
      })
      .subscribe((status) => {
        setSystemStatus((prev) => ({ ...prev, realtime: status === "SUBSCRIBED" }));
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, supabase, demoMode]);

  // Auth handlers
  const handleLogin = useCallback(async (email: string, password: string) => {
    if (!supabase) throw new Error("Supabase not configured");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, [supabase]);

  const handleLogout = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
  }, [supabase]);

  // Action handlers
  const handleSendDirective = useCallback(async (content: string) => {
    if (!demoMode && supabase) {
      await supabase.from("operator_directives").insert({
        content,
        addressed_to: "ares",
        status: "pending",
      });
    }

    // Add to thought feed as user message
    const masterControlThought: ThoughtLog = {
      id: `mc-${Date.now()}`,
      agent_id: "master_control",
      thought: `Directive transmitted: "${content}"`,
      thought_type: "decision",
      created_at: new Date().toISOString(),
    };
    setThoughts((prev) => [masterControlThought, ...prev]);

    // In demo mode, simulate agent response
    if (demoMode) {
      setTimeout(() => {
        const aresResponse: ThoughtLog = {
          id: `ares-${Date.now()}`,
          agent_id: "ares",
          thought: `Acknowledged directive: "${content}". Routing to appropriate agent for execution.`,
          thought_type: "decision",
          created_at: new Date().toISOString(),
        };
        setThoughts((prev) => [aresResponse, ...prev]);
      }, 1500);
    }
  }, [supabase, demoMode]);

  const handleApprove = useCallback(async (id: string) => {
    if (!demoMode && supabase) {
      await supabase.from("approval_queue").update({
        status: "approved",
        resolved_at: new Date().toISOString(),
      }).eq("id", id);
    }
    setApprovals(prev => prev.map(a => 
      a.id === id ? { ...a, status: "approved" as const, resolved_at: new Date().toISOString() } : a
    ));
  }, [supabase, demoMode]);

  const handleDeny = useCallback(async (id: string) => {
    if (!demoMode && supabase) {
      await supabase.from("approval_queue").update({
        status: "denied",
        resolved_at: new Date().toISOString(),
      }).eq("id", id);
    }
    setApprovals(prev => prev.map(a => 
      a.id === id ? { ...a, status: "denied" as const, resolved_at: new Date().toISOString() } : a
    ));
  }, [supabase, demoMode]);

  const handleSaveSettings = useCallback(async (niches: string[], tone: string) => {
    if (!demoMode && supabase) {
      await Promise.all([
        supabase.from("operator_settings").upsert({ key: "niches", value: niches, updated_at: new Date().toISOString() }),
        supabase.from("operator_settings").upsert({ key: "tone", value: tone, updated_at: new Date().toISOString() }),
      ]);
    }
    setSettings({ niches, tone });
  }, [supabase, demoMode]);

  const handleOpenChat = useCallback((agentId: string) => {
    const agent = agents.find((a) => a.id === agentId);
    if (agent) setChatAgent(agent);
  }, [agents]);

  const handleSendChatMessage = useCallback(async (agentId: string, message: string): Promise<string> => {
    // Store the message as a directive
    if (!demoMode && supabase) {
      await supabase.from("agent_messages").insert({
        from_agent: "master_control",
        to_agent: agentId,
        message_type: "directive",
        payload: { content: message },
        priority: "normal",
        status: "pending",
      });
    }

    // Simulate agent response based on agent personality
    const responses: Record<string, string[]> = {
      ares: [
        "Acknowledged. Executing your directive immediately.",
        "Understood, Master Control. Coordinating with other agents now.",
        "Command received. I will oversee implementation personally.",
      ],
      athena: [
        "Analyzing your request. Initial intelligence scan underway.",
        "Interesting directive. Cross-referencing with current opportunity data.",
        "Processing. I will provide a detailed intelligence report shortly.",
      ],
      apollo: [
        "Creative brief received. Beginning content development.",
        "Understood. I will craft this with precision and quality.",
        "Excellent idea. Initiating production workflow now.",
      ],
      argus: [
        "Data request logged. Compiling analytics now.",
        "Tracking initiated. I will surface key insights shortly.",
        "Revenue implications noted. Running optimization analysis.",
      ],
      aegis: [
        "Security review initiated. Scanning for potential risks.",
        "Acknowledged. All actions will be monitored and logged.",
        "Protocol check complete. Proceeding within safety parameters.",
      ],
    };

    const agentResponses = responses[agentId] || ["Message received. Processing..."];
    const response = agentResponses[Math.floor(Math.random() * agentResponses.length)];

    return new Promise((resolve) => {
      setTimeout(() => resolve(response), 500 + Math.random() * 1000);
    });
  }, [supabase, demoMode]);

  // Calculate revenue stats
  const calculateRevenue = useCallback(() => {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const sum = (events: RevenueEvent[]) =>
      events.reduce((acc, e) => acc + parseFloat(String(e.amount || 0)), 0);

    const today = sum(revenueEvents.filter((e) => e.created_at >= todayStr));
    const week = sum(revenueEvents.filter((e) => e.created_at >= weekAgo));
    const month = sum(revenueEvents.filter((e) => e.created_at >= monthStart));
    const allTime = sum(revenueEvents);

    const getPipelineData = (pipeline: string) => {
      const events = revenueEvents.filter((e) => e.pipeline === pipeline);
      const revenue = sum(events);
      const health = revenue > 100 ? "green" as const : revenue > 0 ? "amber" as const : "amber" as const;
      return { revenue, health, events: events.length };
    };

    return {
      today,
      week,
      month,
      allTime,
      pipelines: {
        digital: getPipelineData("digital_products"),
        seo: getPipelineData("seo_blog"),
        newsletter: getPipelineData("newsletter"),
      },
    };
  }, [revenueEvents]);

  const revenueData = calculateRevenue();
  const pendingApprovals = approvals.filter((a) => a.status === "pending").length;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GridBackground />
        <div className="text-center relative z-10">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-display text-sm tracking-wider text-foreground-dim">
            INITIALIZING ARK...
          </p>
        </div>
      </div>
    );
  }

  // Login screen (skip in demo mode)
  if (!demoMode && !user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Main app
  return (
    <div className="min-h-screen relative">
      <GridBackground />
      <div className="relative z-10">
        {/* Demo mode banner */}
        {demoMode && (
          <div className="bg-warning/10 border-b border-warning/30 px-4 py-2 text-center">
            <p className="text-warning text-xs font-display tracking-wider">
              DEMO MODE - Configure Supabase environment variables for full functionality
            </p>
          </div>
        )}

        <TopBar
          revenue={{
            today: revenueData.today,
            week: revenueData.week,
            month: revenueData.month,
            allTime: revenueData.allTime,
          }}
          pendingApprovals={pendingApprovals}
          onNavigate={setActiveTab}
          onLogout={handleLogout}
          onMenuToggle={() => setMenuOpen(!menuOpen)}
          isMenuOpen={menuOpen}
        />

        <Navigation
          activeTab={activeTab}
          onNavigate={setActiveTab}
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
        />

        <main>
          {activeTab === "dashboard" && (
            <DashboardPage
              agents={agents}
              thoughts={thoughts}
              onOpenChat={handleOpenChat}
              onSendDirective={handleSendDirective}
            />
          )}
          {activeTab === "approvals" && (
            <ApprovalsPage
              approvals={approvals}
              onApprove={handleApprove}
              onDeny={handleDeny}
            />
          )}
          {activeTab === "intelligence" && (
            <IntelligencePage reports={reports} />
          )}
          {activeTab === "revenue" && (
            <RevenuePage
              revenue={{
                today: revenueData.today,
                week: revenueData.week,
                month: revenueData.month,
                allTime: revenueData.allTime,
              }}
              pipelines={revenueData.pipelines}
            />
          )}
          {activeTab === "reports" && (
            <ReportsPage reports={eodReports} />
          )}
          {activeTab === "settings" && (
            <SettingsPage
              initialNiches={settings.niches}
              initialTone={settings.tone}
              onSave={handleSaveSettings}
              systemStatus={systemStatus}
            />
          )}
        </main>

        {/* Agent Chat Modal */}
        {chatAgent && (
          <AgentChat
            agent={chatAgent}
            onClose={() => setChatAgent(null)}
            onSendMessage={handleSendChatMessage}
          />
        )}
      </div>
    </div>
  );
}
