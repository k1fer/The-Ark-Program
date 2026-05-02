"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CheckCircle,
  Lightbulb,
  DollarSign,
  FileText,
  Settings,
  X,
} from "lucide-react";

interface NavigationProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const NAV_ITEMS = [
  { id: "dashboard", label: "DASHBOARD", icon: LayoutDashboard },
  { id: "approvals", label: "APPROVALS", icon: CheckCircle },
  { id: "intelligence", label: "INTELLIGENCE", icon: Lightbulb },
  { id: "revenue", label: "REVENUE", icon: DollarSign },
  { id: "reports", label: "REPORTS", icon: FileText },
  { id: "settings", label: "SETTINGS", icon: Settings },
];

export function Navigation({
  activeTab,
  onNavigate,
  isOpen,
  onClose,
}: NavigationProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Navigation */}
      <nav
        className={cn(
          "fixed md:relative top-0 left-0 h-full z-50 md:z-auto",
          "w-64 md:w-auto bg-background-secondary md:bg-transparent",
          "border-r border-border md:border-r-0 md:border-b",
          "transition-transform duration-300 ease-in-out",
          "md:transform-none md:h-auto md:flex",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between p-4 border-b border-border md:hidden">
          <span className="font-display text-sm tracking-wider text-primary">
            NAVIGATION
          </span>
          <button
            onClick={onClose}
            className="p-1 text-foreground-dim hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav items */}
        <div className="flex flex-col md:flex-row gap-1 md:gap-0 p-4 md:p-0 md:px-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose?.();
                }}
                className={cn(
                  "flex items-center gap-3 md:gap-2 px-4 py-3 md:py-3",
                  "font-display text-xs tracking-wider transition-all",
                  "border-l-2 md:border-l-0 md:border-b-2",
                  isActive
                    ? "text-primary border-primary bg-primary/5 md:bg-transparent"
                    : "text-foreground-muted border-transparent hover:text-foreground hover:bg-background-tertiary md:hover:bg-transparent"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
