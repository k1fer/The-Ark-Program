"use client";

import { cn } from "@/lib/utils";
import { AGENT_CONFIG } from "@/lib/supabase";

interface AgentAvatarProps {
  agentId: string;
  status?: "idle" | "active" | "pending_approval" | "paused" | "error";
  size?: "sm" | "md" | "lg" | "xl";
  showGlow?: boolean;
  className?: string;
}

export function AgentAvatar({
  agentId,
  status = "idle",
  size = "md",
  showGlow = true,
  className,
}: AgentAvatarProps) {
  const config = AGENT_CONFIG[agentId];
  const color = config?.color || "#ff2d4a";

  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32",
  };

  const innerSizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-20 h-20",
    xl: "w-28 h-28",
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        sizeClasses[size],
        className
      )}
    >
      {/* Outer hexagon glow ring */}
      {showGlow && status === "active" && (
        <div
          className="absolute inset-0 animate-pulse-glow"
          style={{
            background: `radial-gradient(circle, ${color}33 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Hexagonal frame */}
      <svg
        viewBox="0 0 100 100"
        className={cn("absolute inset-0", sizeClasses[size])}
      >
        {/* Background hexagon */}
        <polygon
          points="50,2 95,27 95,73 50,98 5,73 5,27"
          fill="rgba(10, 10, 16, 0.9)"
          stroke={status === "active" ? color : "rgba(31, 31, 42, 0.8)"}
          strokeWidth="2"
          className={status === "active" ? "animate-glow-pulse" : ""}
          style={{ filter: status === "active" ? `drop-shadow(0 0 4px ${color})` : "none" }}
        />
        
        {/* Inner hexagon accent */}
        <polygon
          points="50,8 89,30 89,70 50,92 11,70 11,30"
          fill="none"
          stroke={color}
          strokeWidth="0.5"
          opacity="0.3"
        />

        {/* Circuit patterns */}
        <line x1="50" y1="8" x2="50" y2="2" stroke={color} strokeWidth="1" opacity="0.5" />
        <line x1="89" y1="30" x2="95" y2="27" stroke={color} strokeWidth="1" opacity="0.5" />
        <line x1="89" y1="70" x2="95" y2="73" stroke={color} strokeWidth="1" opacity="0.5" />
        <line x1="50" y1="92" x2="50" y2="98" stroke={color} strokeWidth="1" opacity="0.5" />
        <line x1="11" y1="70" x2="5" y2="73" stroke={color} strokeWidth="1" opacity="0.5" />
        <line x1="11" y1="30" x2="5" y2="27" stroke={color} strokeWidth="1" opacity="0.5" />

        {/* Corner accents */}
        <circle cx="50" cy="2" r="2" fill={color} opacity={status === "active" ? "1" : "0.3"} />
        <circle cx="95" cy="27" r="2" fill={color} opacity={status === "active" ? "1" : "0.3"} />
        <circle cx="95" cy="73" r="2" fill={color} opacity={status === "active" ? "1" : "0.3"} />
        <circle cx="50" cy="98" r="2" fill={color} opacity={status === "active" ? "1" : "0.3"} />
        <circle cx="5" cy="73" r="2" fill={color} opacity={status === "active" ? "1" : "0.3"} />
        <circle cx="5" cy="27" r="2" fill={color} opacity={status === "active" ? "1" : "0.3"} />
      </svg>

      {/* Inner avatar content - soldier silhouette */}
      <div className={cn("relative z-10 flex items-center justify-center", innerSizes[size])}>
        <AgentSoldierIcon agentId={agentId} color={color} size={size} status={status} />
      </div>

      {/* Status indicator */}
      <div
        className={cn(
          "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background z-20",
          status === "active" && "bg-success animate-pulse",
          status === "idle" && "bg-foreground-dim",
          status === "pending_approval" && "bg-warning animate-pulse",
          status === "paused" && "bg-danger",
          status === "error" && "bg-danger animate-flicker"
        )}
        style={{
          boxShadow: status === "active" ? "0 0 6px #00ff88" : 
                     status === "error" ? "0 0 6px #ff2d4a" : "none"
        }}
      />
    </div>
  );
}

function AgentSoldierIcon({ 
  agentId, 
  color, 
  size,
  status 
}: { 
  agentId: string; 
  color: string; 
  size: "sm" | "md" | "lg" | "xl";
  status: string;
}) {
  const iconSizes = {
    sm: 20,
    md: 32,
    lg: 52,
    xl: 72,
  };

  const iconSize = iconSizes[size];
  const isActive = status === "active";

  // Each agent has a unique soldier/tactical icon design
  switch (agentId) {
    case "ares":
      // Commander helmet with visor
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 48 48" fill="none">
          <defs>
            <linearGradient id={`ares-grad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={color} stopOpacity="0.4" />
            </linearGradient>
          </defs>
          {/* Helmet base */}
          <path 
            d="M24 6C14 6 8 14 8 24C8 34 14 42 24 42C34 42 40 34 40 24C40 14 34 6 24 6Z" 
            fill={`url(#ares-grad-${size})`}
            stroke={color}
            strokeWidth="1.5"
            style={{ filter: isActive ? `drop-shadow(0 0 3px ${color})` : "none" }}
          />
          {/* Visor */}
          <path 
            d="M12 22H36V28C36 32 32 36 24 36C16 36 12 32 12 28V22Z" 
            fill="#050508"
            stroke={color}
            strokeWidth="1"
          />
          {/* Visor glow line */}
          <line x1="14" y1="25" x2="34" y2="25" stroke={color} strokeWidth="2" opacity={isActive ? "1" : "0.5"}>
            {isActive && <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />}
          </line>
          {/* Top crest */}
          <path d="M20 6L24 2L28 6" stroke={color} strokeWidth="2" fill="none" />
          {/* Side vents */}
          <line x1="8" y1="20" x2="12" y2="20" stroke={color} strokeWidth="1" />
          <line x1="36" y1="20" x2="40" y2="20" stroke={color} strokeWidth="1" />
        </svg>
      );

    case "athena":
      // Owl-like tactical helmet with sensors
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 48 48" fill="none">
          <defs>
            <linearGradient id={`athena-grad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={color} stopOpacity="0.4" />
            </linearGradient>
          </defs>
          {/* Head shape */}
          <ellipse cx="24" cy="24" rx="16" ry="18" fill={`url(#athena-grad-${size})`} stroke={color} strokeWidth="1.5"
            style={{ filter: isActive ? `drop-shadow(0 0 3px ${color})` : "none" }} />
          {/* Owl eyes */}
          <circle cx="17" cy="22" r="6" fill="#050508" stroke={color} strokeWidth="1" />
          <circle cx="31" cy="22" r="6" fill="#050508" stroke={color} strokeWidth="1" />
          {/* Eye glow */}
          <circle cx="17" cy="22" r="3" fill={color} opacity={isActive ? "0.8" : "0.3"}>
            {isActive && <animate attributeName="r" values="3;2;3" dur="2s" repeatCount="indefinite" />}
          </circle>
          <circle cx="31" cy="22" r="3" fill={color} opacity={isActive ? "0.8" : "0.3"}>
            {isActive && <animate attributeName="r" values="3;2;3" dur="2s" repeatCount="indefinite" />}
          </circle>
          {/* Sensor array on top */}
          <path d="M18 8L24 4L30 8" stroke={color} strokeWidth="1.5" fill="none" />
          <circle cx="24" cy="4" r="2" fill={color} opacity={isActive ? "1" : "0.5"} />
          {/* Beak/sensor */}
          <path d="M20 30L24 36L28 30" fill={color} opacity="0.6" />
        </svg>
      );

    case "apollo":
      // Creative/artistic helmet with flame motif
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 48 48" fill="none">
          <defs>
            <linearGradient id={`apollo-grad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={color} stopOpacity="0.4" />
            </linearGradient>
          </defs>
          {/* Head base */}
          <circle cx="24" cy="26" r="16" fill={`url(#apollo-grad-${size})`} stroke={color} strokeWidth="1.5"
            style={{ filter: isActive ? `drop-shadow(0 0 3px ${color})` : "none" }} />
          {/* Flame crest */}
          <path d="M24 10C20 14 18 8 16 12C14 16 20 14 24 6C28 14 34 16 32 12C30 8 28 14 24 10Z" 
            fill={color} opacity={isActive ? "0.9" : "0.5"}>
            {isActive && <animate attributeName="d" 
              values="M24 10C20 14 18 8 16 12C14 16 20 14 24 6C28 14 34 16 32 12C30 8 28 14 24 10Z;M24 8C20 12 18 6 16 10C14 14 20 12 24 4C28 12 34 14 32 10C30 6 28 12 24 8Z;M24 10C20 14 18 8 16 12C14 16 20 14 24 6C28 14 34 16 32 12C30 8 28 14 24 10Z" 
              dur="1s" repeatCount="indefinite" />}
          </path>
          {/* Face plate */}
          <rect x="16" y="22" width="16" height="12" rx="2" fill="#050508" stroke={color} strokeWidth="1" />
          {/* Display lines */}
          <line x1="18" y1="26" x2="30" y2="26" stroke={color} strokeWidth="1" opacity="0.6" />
          <line x1="18" y1="30" x2="26" y2="30" stroke={color} strokeWidth="1" opacity="0.4" />
        </svg>
      );

    case "argus":
      // All-seeing eye tactical visor
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 48 48" fill="none">
          <defs>
            <linearGradient id={`argus-grad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={color} stopOpacity="0.4" />
            </linearGradient>
          </defs>
          {/* Head shape */}
          <ellipse cx="24" cy="24" rx="16" ry="16" fill={`url(#argus-grad-${size})`} stroke={color} strokeWidth="1.5"
            style={{ filter: isActive ? `drop-shadow(0 0 3px ${color})` : "none" }} />
          {/* Large central eye */}
          <ellipse cx="24" cy="24" rx="10" ry="8" fill="#050508" stroke={color} strokeWidth="1.5" />
          {/* Eye interior */}
          <circle cx="24" cy="24" r="5" fill={color} opacity={isActive ? "0.6" : "0.3"}>
            {isActive && <animate attributeName="opacity" values="0.6;0.3;0.6" dur="1.5s" repeatCount="indefinite" />}
          </circle>
          <circle cx="24" cy="24" r="2" fill={color} />
          {/* Scan lines */}
          <line x1="14" y1="24" x2="8" y2="24" stroke={color} strokeWidth="1" opacity="0.5" />
          <line x1="34" y1="24" x2="40" y2="24" stroke={color} strokeWidth="1" opacity="0.5" />
          {/* Data stream indicators */}
          <circle cx="10" cy="20" r="2" fill={color} opacity={isActive ? "0.8" : "0.3"} />
          <circle cx="38" cy="20" r="2" fill={color} opacity={isActive ? "0.8" : "0.3"} />
          <circle cx="10" cy="28" r="2" fill={color} opacity={isActive ? "0.8" : "0.3"} />
          <circle cx="38" cy="28" r="2" fill={color} opacity={isActive ? "0.8" : "0.3"} />
        </svg>
      );

    case "aegis":
      // Shield/guardian helmet
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 48 48" fill="none">
          <defs>
            <linearGradient id={`aegis-grad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={color} stopOpacity="0.4" />
            </linearGradient>
          </defs>
          {/* Shield shape head */}
          <path d="M24 4L8 12V28C8 36 16 44 24 44C32 44 40 36 40 28V12L24 4Z" 
            fill={`url(#aegis-grad-${size})`} stroke={color} strokeWidth="1.5"
            style={{ filter: isActive ? `drop-shadow(0 0 3px ${color})` : "none" }} />
          {/* Inner shield pattern */}
          <path d="M24 10L14 16V26C14 32 19 38 24 38C29 38 34 32 34 26V16L24 10Z" 
            fill="#050508" stroke={color} strokeWidth="1" />
          {/* Lock symbol */}
          <rect x="20" y="22" width="8" height="8" rx="1" fill={color} opacity={isActive ? "0.8" : "0.4"} />
          <path d="M22 22V19C22 17 23 16 24 16C25 16 26 17 26 19V22" 
            stroke={color} strokeWidth="2" fill="none" />
          {/* Top accent */}
          <circle cx="24" cy="6" r="2" fill={color} />
        </svg>
      );

    default:
      return (
        <div 
          className="w-full h-full rounded-full flex items-center justify-center text-2xl font-bold"
          style={{ color }}
        >
          ?
        </div>
      );
  }
}

export function AgentAvatarMini({ 
  agentId, 
  className 
}: { 
  agentId: string; 
  className?: string;
}) {
  const config = AGENT_CONFIG[agentId];
  const color = config?.color || "#ff2d4a";

  return (
    <div 
      className={cn(
        "w-6 h-6 rounded-full flex items-center justify-center",
        className
      )}
      style={{ 
        background: `linear-gradient(135deg, ${color}33 0%, ${color}11 100%)`,
        border: `1px solid ${color}66`
      }}
    >
      <span style={{ color, fontSize: "10px", fontWeight: "bold" }}>
        {agentId.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}
