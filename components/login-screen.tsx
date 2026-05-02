"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Shield, Loader2, AlertTriangle } from "lucide-react";

interface LoginScreenProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Radial glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(255, 45, 74, 0.3) 0%, transparent 70%)"
          }}
        />
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-primary/20" />
        <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-primary/20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-primary/20" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-primary/20" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Login box */}
        <div className="bg-background-secondary border border-border rounded-lg overflow-hidden">
          {/* Top accent */}
          <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
          
          <div className="p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30 mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-display text-3xl tracking-[0.4em] text-primary text-glow-red">
                ARK
              </h1>
              <p className="text-foreground-dim text-xs tracking-[0.3em] mt-2">
                MASTER CONTROL ACCESS
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@email.com"
                  required
                  autoComplete="email"
                  className={cn(
                    "w-full bg-background-tertiary border border-border rounded",
                    "px-4 py-3 text-sm text-foreground placeholder:text-foreground-dim",
                    "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  )}
                />
              </div>
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  autoComplete="current-password"
                  className={cn(
                    "w-full bg-background-tertiary border border-border rounded",
                    "px-4 py-3 text-sm text-foreground placeholder:text-foreground-dim",
                    "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  )}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-danger/10 border border-danger/30 rounded text-danger text-sm">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={cn(
                  "w-full bg-primary text-background font-display text-sm tracking-wider",
                  "py-3 rounded transition-all",
                  "hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed",
                  "flex items-center justify-center gap-2"
                )}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    AUTHENTICATING
                  </>
                ) : (
                  "INITIALIZE SESSION"
                )}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-foreground-dim text-[10px] tracking-wider mt-6">
              AUTHORIZED PERSONNEL ONLY
            </p>
          </div>
        </div>

        {/* System status */}
        <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-foreground-dim">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            SYSTEM ONLINE
          </span>
          <span>|</span>
          <span>v2.0.0</span>
        </div>
      </div>
    </div>
  );
}
