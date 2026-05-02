import type { Agent, ThoughtLog, ApprovalQueueItem, AthenaReport, EODReport, RevenueEvent } from "./supabase";

export const mockAgents: Agent[] = [
  {
    id: "ares",
    name: "ARES",
    role: "Commander & Distribution",
    status: "active",
    current_task: "Coordinating morning distribution cycle",
    last_active: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    config: null,
  },
  {
    id: "athena",
    name: "ATHENA",
    role: "Intelligence",
    status: "idle",
    current_task: "Next scan scheduled in 2 hours",
    last_active: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    config: null,
  },
  {
    id: "apollo",
    name: "APOLLO",
    role: "Creation",
    status: "pending_approval",
    current_task: "Blog post draft awaiting review",
    last_active: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    config: null,
  },
  {
    id: "argus",
    name: "ARGUS",
    role: "Analytics",
    status: "idle",
    current_task: "EOD report scheduled for 23:00",
    last_active: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    config: null,
  },
  {
    id: "aegis",
    name: "AEGIS",
    role: "Security",
    status: "active",
    current_task: "Monitoring all agent operations",
    last_active: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    config: null,
  },
];

export const mockThoughts: ThoughtLog[] = [
  {
    id: "1",
    agent_id: "athena",
    thought: "Morning scan complete. Identified 3 high-potential opportunities in AI productivity tools niche.",
    thought_type: "milestone",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    agent_id: "ares",
    thought: "Assigning top opportunity to Apollo for content creation. Priority: HIGH.",
    thought_type: "decision",
    created_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    agent_id: "apollo",
    thought: "Beginning work on prompt pack for email productivity. Target: 15 optimized prompts.",
    thought_type: "reasoning",
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    agent_id: "aegis",
    thought: "Security scan complete. All agent actions within defined scope. No anomalies detected.",
    thought_type: "reasoning",
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    agent_id: "apollo",
    thought: "Draft complete. Quality score: 87/100. Submitting for approval.",
    thought_type: "milestone",
    created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  },
  {
    id: "6",
    agent_id: "ares",
    thought: "Received Apollo output. Routing to approval queue for Master Control review.",
    thought_type: "decision",
    created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
  {
    id: "7",
    agent_id: "argus",
    thought: "Revenue tracking: 2 new sales detected on Gumroad. Total: $27.00",
    thought_type: "milestone",
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: "8",
    agent_id: "ares",
    thought: "Distribution cycle initiated. Publishing approved content to WordPress.",
    thought_type: "reasoning",
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
];

export const mockApprovals: ApprovalQueueItem[] = [
  {
    id: "1",
    requesting_agent: "apollo",
    action_type: "product_listing",
    action_detail: {
      title: "Email Productivity Prompt Pack",
      description: "15 optimized prompts for faster email writing",
      price: 9.99,
      platform: "Gumroad",
    },
    risk_tier: 2,
    aegis_assessment: "Product content verified. No policy violations detected. Recommended for approval.",
    status: "pending",
    operator_note: null,
    created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 47 * 60 * 60 * 1000).toISOString(),
    resolved_at: null,
  },
];

export const mockAthenaReports: AthenaReport[] = [
  {
    id: "1",
    report_type: "opportunity",
    title: "Email Productivity Prompts - High Demand",
    detail: {
      detail: "Reddit analysis shows 847 upvotes on thread requesting email productivity AI tools. Keyword 'email productivity prompts' has KD 14 with 480 monthly searches.",
      recommended_action: "Create prompt pack targeting email workflows",
    },
    confidence_score: 0.92,
    priority: "high",
    actioned: true,
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    report_type: "keyword",
    title: "AI Meeting Notes Templates",
    detail: {
      detail: "Emerging keyword opportunity. Search volume increasing 23% month-over-month. Low competition in template space.",
      recommended_action: "Consider Notion template for meeting notes automation",
    },
    confidence_score: 0.78,
    priority: "medium",
    actioned: false,
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    report_type: "product_concept",
    title: "Freelancer Invoice Automation Guide",
    detail: {
      detail: "Multiple Reddit threads expressing frustration with invoicing. No comprehensive AI-assisted guide exists in market.",
      recommended_action: "Draft mini-ebook on automating freelancer invoicing with AI",
    },
    confidence_score: 0.65,
    priority: "low",
    actioned: false,
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockEodReports: EODReport[] = [
  {
    id: "1",
    report_date: new Date().toISOString().split("T")[0],
    content: `# ARK - END-OF-DAY REPORT
Date: ${new Date().toISOString().split("T")[0]} | Report ID: EOD-001

## EXECUTIVE SUMMARY (ARES)
- Digital Products pipeline: ACTIVE - 2 sales today
- SEO Blog: 1 article published, awaiting indexing
- Newsletter: 23 new subscribers
- Overall Ark health: GREEN

## INTELLIGENCE (ATHENA)
Opportunities filed today: 3
Top opportunity: Email Productivity Prompts - HIGH confidence
Recommended action: Continue prompt pack development

## PRODUCTION (APOLLO)
Assets created: 1 | Quality score avg: 87/100
Pending your approval: Email Productivity Prompt Pack
Distributed today: Blog article on AI writing tools

## REVENUE (ARGUS)
Today: $27.00 | This week: $127.00 | This month: $342.00
Pipeline health: Digital Products GREEN, SEO AMBER, Newsletter AMBER

## SECURITY (AEGIS)
Actions audited: 47 | Anomalies: 0 | Approvals resolved: 3

---
Generated autonomously. Estimated review time: 3 minutes.`,
    revenue_today: 27.0,
    revenue_week: 127.0,
    revenue_month: 342.0,
    created_at: new Date().toISOString(),
  },
];

export const mockRevenueEvents: RevenueEvent[] = [
  {
    id: "1",
    platform: "gumroad",
    event_type: "sale",
    amount: 9.99,
    currency: "USD",
    pipeline: "digital_products",
    raw_data: null,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    platform: "gumroad",
    event_type: "sale",
    amount: 17.0,
    currency: "USD",
    pipeline: "digital_products",
    raw_data: null,
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    platform: "amazon_associates",
    event_type: "commission",
    amount: 4.23,
    currency: "USD",
    pipeline: "seo_blog",
    raw_data: null,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];
