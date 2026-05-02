"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Send, Loader2 } from "lucide-react";

interface DirectiveInputProps {
  onSend: (content: string) => Promise<void>;
  disabled?: boolean;
  className?: string;
}

export function DirectiveInput({ onSend, disabled, className }: DirectiveInputProps) {
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = useCallback(async () => {
    const content = value.trim();
    if (!content || sending || disabled) return;

    setSending(true);
    try {
      await onSend(content);
      setValue("");
    } finally {
      setSending(false);
    }
  }, [value, sending, disabled, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cn("flex gap-0", className)}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Issue directive to ARES..."
        maxLength={500}
        disabled={disabled || sending}
        className={cn(
          "flex-1 bg-background-tertiary border border-border border-r-0 rounded-l",
          "px-4 py-3 text-sm text-foreground placeholder:text-foreground-dim",
          "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      />
      <button
        onClick={handleSend}
        disabled={disabled || sending || !value.trim()}
        className={cn(
          "px-6 bg-primary text-background font-display text-xs tracking-wider",
          "rounded-r border border-primary transition-all",
          "hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed",
          "flex items-center gap-2"
        )}
      >
        {sending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        <span className="hidden sm:inline">TRANSMIT</span>
      </button>
    </div>
  );
}
