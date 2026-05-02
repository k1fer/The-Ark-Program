"use client";

import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { 
  AlertTriangle, 
  LogOut, 
  Menu, 
  X,
  Shield
} from "lucide-react";

interface TopBarProps {
  revenue: {
    today: number;
    week: number;
    month: number;
    allTime: number;
  };
  pendingApprovals: number;
  onNavigate: (tab: string) => void;
  onLogout: () => void;
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

export function TopBar({
  revenue,
  pendingApprovals,
  onNavigate,
  onLogout,
  onMenuToggle,
  isMenuOpen,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-50 bg-background-secondary/95 backdrop-blur border-b border-border">
      {/* Accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
      
      <div className="flex items-center justify-between h-14 px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="p-2 -ml-2 md:hidden text-foreground-muted hover:text-foreground transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <div>
              <h1 className="font-display text-lg tracking-[0.3em] text-primary text-glow-red">
                ARK
              </h1>
              <p className="text-[8px] tracking-[0.2em] text-foreground-dim -mt-1 hidden sm:block">
                MASTER CONTROL
              </p>
            </div>
          </div>
        </div>

        {/* Revenue Ticker - Hidden on small screens */}
        <div className="hidden md:flex items-center gap-6">
          <RevenueItem label="TODAY" amount={revenue.today} />
          <RevenueItem label="WEEK" amount={revenue.week} />
          <RevenueItem label="MONTH" amount={revenue.month} />
          <RevenueItem label="ALL TIME" amount={revenue.allTime} highlight />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Pending Approvals Badge */}
          {pendingApprovals > 0 && (
            <button
              onClick={() => onNavigate("approvals")}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded",
                "bg-danger/10 border border-danger/50 text-danger",
                "hover:bg-danger/20 transition-colors",
                "animate-pulse-glow"
              )}
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="font-display text-xs tracking-wider">
                {pendingApprovals} PENDING
              </span>
            </button>
          )}

          {/* Logout */}
          <button
            onClick={onLogout}
            className="p-2 text-foreground-dim hover:text-danger border border-border hover:border-danger rounded transition-colors"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Revenue Display */}
      <div className="md:hidden flex items-center justify-around py-2 px-4 border-t border-border bg-background-tertiary/50">
        <RevenueItem label="TODAY" amount={revenue.today} compact />
        <RevenueItem label="WEEK" amount={revenue.week} compact />
        <RevenueItem label="MONTH" amount={revenue.month} compact />
        <RevenueItem label="ALL" amount={revenue.allTime} highlight compact />
      </div>
    </header>
  );
}

function RevenueItem({
  label,
  amount,
  highlight,
  compact,
}: {
  label: string;
  amount: number;
  highlight?: boolean;
  compact?: boolean;
}) {
  return (
    <div className={cn("text-center", compact && "px-1")}>
      <p className={cn(
        "text-foreground-dim tracking-wider",
        compact ? "text-[8px]" : "text-[9px]"
      )}>
        {label}
      </p>
      <p
        className={cn(
          "font-display tracking-wide",
          compact ? "text-xs" : "text-sm",
          highlight ? "text-success" : "text-success/80"
        )}
      >
        {formatCurrency(amount)}
      </p>
    </div>
  );
}
