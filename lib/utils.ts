import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(timestamp: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(timestamp).getTime()) / 1000
  );

  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-SG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function getStatusColor(
  status: string
): { bg: string; text: string; border: string } {
  switch (status) {
    case "active":
      return {
        bg: "bg-primary/10",
        text: "text-primary",
        border: "border-primary",
      };
    case "idle":
      return {
        bg: "bg-foreground-dim/10",
        text: "text-foreground-muted",
        border: "border-foreground-dim",
      };
    case "pending_approval":
      return {
        bg: "bg-warning/10",
        text: "text-warning",
        border: "border-warning",
      };
    case "paused":
    case "error":
      return {
        bg: "bg-danger/10",
        text: "text-danger",
        border: "border-danger",
      };
    default:
      return {
        bg: "bg-foreground-dim/10",
        text: "text-foreground-muted",
        border: "border-foreground-dim",
      };
  }
}

export function getPriorityColor(
  priority: string
): { bg: string; text: string; border: string } {
  switch (priority) {
    case "high":
      return {
        bg: "bg-success/10",
        text: "text-success",
        border: "border-success",
      };
    case "medium":
      return {
        bg: "bg-warning/10",
        text: "text-warning",
        border: "border-warning",
      };
    case "low":
    default:
      return {
        bg: "bg-foreground-dim/10",
        text: "text-foreground-muted",
        border: "border-foreground-dim",
      };
  }
}
