"use client";

import { formatCurrency } from "@/lib/utils";
import { Bell, Menu, X } from "lucide-react";
import Image from "next/image";

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
  onMenuToggle,
  isMenuOpen,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="flex items-center justify-between h-12 px-4 lg:px-6">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="p-1.5 lg:hidden text-foreground-muted hover:text-foreground"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center gap-2">
            {/* Hexagon logo */}
            <div className="w-7 h-7 relative">
              <svg viewBox="0 0 28 28" className="w-full h-full">
                <polygon 
                  points="14,1 26,7.5 26,20.5 14,27 2,20.5 2,7.5" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                  className="text-primary"
                />
                <circle cx="14" cy="14" r="4" fill="currentColor" className="text-primary" />
              </svg>
            </div>
            <div className="leading-none">
              <span className="font-display text-base tracking-widest text-primary">ARK</span>
              <span className="text-foreground-dim">/</span>
              <span className="font-display text-base tracking-widest text-primary">OS</span>
              <p className="text-[8px] tracking-wider text-primary/60 uppercase">Master Control Center</p>
            </div>
          </div>
        </div>

        {/* Center: Revenue */}
        <div className="hidden md:flex items-center gap-1 bg-background-secondary rounded px-3 py-1.5">
          <svg className="w-4 h-4 text-foreground-dim" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
          <span className="text-foreground-dim text-xs tracking-wider mx-2">TODAY</span>
          <span className="text-success font-mono text-sm">{formatCurrency(revenue.today)}</span>
          <span className="text-foreground-dim text-xs tracking-wider mx-3">30D</span>
          <span className="text-success font-mono text-sm">{formatCurrency(revenue.month)}</span>
        </div>

        {/* Right: Approvals */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("approvals")}
            className="flex items-center gap-2 px-3 py-1.5 border border-border hover:border-primary/50 rounded text-xs tracking-wider transition-colors"
          >
            <span className="text-foreground-muted">APPROVALS</span>
            {pendingApprovals > 0 && (
              <span className="w-2 h-2 rounded-full bg-danger animate-pulse-dot" />
            )}
          </button>
          <button
            onClick={() => onNavigate("approvals")}
            className="p-1.5 text-foreground-muted hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
