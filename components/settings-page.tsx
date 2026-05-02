"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Save, Check, AlertCircle } from "lucide-react";

interface SettingsPageProps {
  initialNiches: string[];
  initialTone: string;
  onSave: (niches: string[], tone: string) => Promise<void>;
  systemStatus: {
    database: boolean;
    realtime: boolean;
  };
}

export function SettingsPage({
  initialNiches,
  initialTone,
  onSave,
  systemStatus,
}: SettingsPageProps) {
  const [niches, setNiches] = useState(JSON.stringify(initialNiches, null, 2));
  const [tone, setTone] = useState(initialTone);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setNiches(JSON.stringify(initialNiches, null, 2));
    setTone(initialTone);
  }, [initialNiches, initialTone]);

  const handleSave = async () => {
    setError("");
    setSaving(true);

    try {
      const parsedNiches = JSON.parse(niches);
      if (!Array.isArray(parsedNiches)) {
        throw new Error("Niches must be a JSON array");
      }
      await onSave(parsedNiches, tone);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON in niches field");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Niche Preferences */}
      <section className="bg-background-secondary border border-border rounded-lg p-4 md:p-5">
        <h3 className="font-display text-xs tracking-[0.2em] text-primary mb-4">
          NICHE PREFERENCES
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] text-foreground-dim tracking-wider mb-2">
              NICHES (JSON array - Athena uses these)
            </label>
            <textarea
              value={niches}
              onChange={(e) => setNiches(e.target.value)}
              placeholder='["AI productivity tools", "no-code automation"]'
              className={cn(
                "w-full h-24 bg-background-tertiary border border-border rounded",
                "px-4 py-3 text-sm text-foreground placeholder:text-foreground-dim",
                "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
                "resize-none font-mono"
              )}
            />
          </div>
          <div>
            <label className="block text-[10px] text-foreground-dim tracking-wider mb-2">
              CONTENT TONE
            </label>
            <input
              type="text"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              placeholder="informative, direct, slightly technical, no fluff"
              className={cn(
                "w-full bg-background-tertiary border border-border rounded",
                "px-4 py-3 text-sm text-foreground placeholder:text-foreground-dim",
                "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              )}
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 mt-4 p-3 bg-danger/10 border border-danger/30 rounded text-danger text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded font-display text-xs tracking-wider",
              "bg-primary text-background hover:bg-primary/90 transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                SAVING
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                SAVE SETTINGS
              </>
            )}
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-success text-sm">
              <Check className="w-4 h-4" />
              Saved
            </span>
          )}
        </div>
      </section>

      {/* System Status */}
      <section className="bg-background-secondary border border-border rounded-lg p-4 md:p-5">
        <h3 className="font-display text-xs tracking-[0.2em] text-primary mb-4">
          SYSTEM STATUS
        </h3>
        <div className="space-y-2 text-sm">
          <StatusRow label="Dashboard" status="ONLINE" ok />
          <StatusRow
            label="Database"
            status={systemStatus.database ? "CONNECTED" : "DISCONNECTED"}
            ok={systemStatus.database}
          />
          <StatusRow
            label="Realtime"
            status={systemStatus.realtime ? "ACTIVE" : "INACTIVE"}
            ok={systemStatus.realtime}
          />
        </div>
        <p className="text-[10px] text-foreground-dim mt-4">
          Agent schedules run via GitHub Actions - check Actions tab in your repo for logs.
        </p>
      </section>
    </div>
  );
}

function StatusRow({
  label,
  status,
  ok,
}: {
  label: string;
  status: string;
  ok: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-foreground-muted">{label}:</span>
      <span className={ok ? "text-success" : "text-danger"}>{status}</span>
    </div>
  );
}
