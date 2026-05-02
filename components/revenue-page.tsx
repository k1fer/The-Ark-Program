"use client";

import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, DollarSign, ShoppingBag, FileText, Mail } from "lucide-react";

interface RevenuePageProps {
  revenue: {
    today: number;
    week: number;
    month: number;
    allTime: number;
  };
  pipelines: {
    digital: { revenue: number; health: "green" | "amber" | "red"; events: number };
    seo: { revenue: number; health: "green" | "amber" | "red"; events: number };
    newsletter: { revenue: number; health: "green" | "amber" | "red"; events: number };
  };
}

export function RevenuePage({ revenue, pipelines }: RevenuePageProps) {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Revenue Overview */}
      <section>
        <h2 className="font-display text-xs tracking-[0.3em] text-foreground-dim mb-4 pb-2 border-b border-border">
          REVENUE OVERVIEW
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <RevenueCard label="TODAY" amount={revenue.today} />
          <RevenueCard label="THIS WEEK" amount={revenue.week} />
          <RevenueCard label="THIS MONTH" amount={revenue.month} />
          <RevenueCard label="ALL TIME" amount={revenue.allTime} highlight />
        </div>
      </section>

      {/* Pipeline Health */}
      <section>
        <h2 className="font-display text-xs tracking-[0.3em] text-foreground-dim mb-4 pb-2 border-b border-border">
          PIPELINE HEALTH
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PipelineCard
            name="DIGITAL PRODUCTS"
            icon={ShoppingBag}
            revenue={pipelines.digital.revenue}
            health={pipelines.digital.health}
            events={pipelines.digital.events}
            source="Gumroad"
          />
          <PipelineCard
            name="SEO BLOG"
            icon={FileText}
            revenue={pipelines.seo.revenue}
            health={pipelines.seo.health}
            events={pipelines.seo.events}
            source="Affiliate"
          />
          <PipelineCard
            name="NEWSLETTER"
            icon={Mail}
            revenue={pipelines.newsletter.revenue}
            health={pipelines.newsletter.health}
            events={pipelines.newsletter.events}
            source="Beehiiv"
          />
        </div>
      </section>
    </div>
  );
}

function RevenueCard({
  label,
  amount,
  highlight,
}: {
  label: string;
  amount: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "bg-background-secondary border border-border rounded-lg p-4",
        highlight && "border-success/30"
      )}
    >
      <p className="font-display text-[10px] tracking-wider text-foreground-dim mb-2">
        {label}
      </p>
      <p
        className={cn(
          "font-display text-2xl md:text-3xl",
          highlight ? "text-success" : "text-success/80"
        )}
      >
        {formatCurrency(amount)}
      </p>
    </div>
  );
}

function PipelineCard({
  name,
  icon: Icon,
  revenue,
  health,
  events,
  source,
}: {
  name: string;
  icon: React.ElementType;
  revenue: number;
  health: "green" | "amber" | "red";
  events: number;
  source: string;
}) {
  const healthConfig = {
    green: {
      label: "GROWING",
      icon: TrendingUp,
      bg: "bg-success/10",
      border: "border-success/30",
      text: "text-success",
    },
    amber: {
      label: "BUILDING",
      icon: Minus,
      bg: "bg-warning/10",
      border: "border-warning/30",
      text: "text-warning",
    },
    red: {
      label: "DECLINING",
      icon: TrendingDown,
      bg: "bg-danger/10",
      border: "border-danger/30",
      text: "text-danger",
    },
  };

  const config = healthConfig[health];
  const HealthIcon = config.icon;

  return (
    <div className="bg-background-secondary border border-border rounded-lg p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-primary/10 rounded">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-display text-xs tracking-wider text-foreground">
            {name}
          </p>
          <p className="text-[10px] text-foreground-dim">{source}</p>
        </div>
      </div>

      <div
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-display tracking-wider mb-3",
          config.bg,
          config.border,
          config.text,
          "border"
        )}
      >
        <HealthIcon className="w-3 h-3" />
        {config.label}
      </div>

      <p className="font-display text-xl text-success">{formatCurrency(revenue)}</p>
      <p className="text-[10px] text-foreground-dim mt-1">
        {events} event{events !== 1 ? "s" : ""} this month
      </p>
    </div>
  );
}
