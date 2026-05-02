"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { AGENT_CONFIG, type Agent } from "@/lib/supabase";
import { getVoiceService, getSpeechRecognition, AGENT_VOICE_PROFILES } from "@/lib/voice-service";
import { AgentAvatar } from "./agent-avatar";
import { 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Loader2,
  Minimize2,
  Maximize2,
  Radio,
  Waveform
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: Date;
  isVoice?: boolean;
}

interface AgentChatProps {
  agent: Agent;
  onClose: () => void;
  onSendMessage: (agentId: string, message: string) => Promise<string>;
  className?: string;
}

export function AgentChat({ agent, onClose, onSendMessage, className }: AgentChatProps) {
  const config = AGENT_CONFIG[agent.id];
  const color = config?.color || "#ff2d4a";
  const voiceProfile = AGENT_VOICE_PROFILES[agent.id];
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "agent",
      content: `${config?.name} online. Standing by for your orders, Master Control.`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [sending, setSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Speak welcome message on mount
  useEffect(() => {
    if (voiceEnabled && typeof window !== "undefined") {
      const timer = setTimeout(() => {
        const voiceService = getVoiceService();
        voiceService.speak(
          `${config?.name} online. Standing by for your orders, Master Control.`,
          agent.id,
          () => setIsSpeaking(true),
          () => setIsSpeaking(false)
        );
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [agent.id, config?.name, voiceEnabled]);

  const speakMessage = useCallback((text: string) => {
    if (!voiceEnabled) return;
    
    const voiceService = getVoiceService();
    voiceService.speak(
      text,
      agent.id,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  }, [agent.id, voiceEnabled]);

  const handleSendMessage = useCallback(async (content: string, isVoice = false) => {
    const trimmed = content.trim();
    if (!trimmed || sending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date(),
      isVoice,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setInterimTranscript("");
    setSending(true);

    try {
      const response = await onSendMessage(agent.id, trimmed);
      
      const agentMessage: ChatMessage = {
        id: `agent-${Date.now()}`,
        role: "agent",
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, agentMessage]);
      
      // Speak the response if voice is enabled
      if (voiceEnabled) {
        speakMessage(response);
      }
    } catch {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "agent",
        content: "Communication error. Attempting to re-establish connection...",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setSending(false);
    }
  }, [sending, agent.id, onSendMessage, voiceEnabled, speakMessage]);

  const toggleListening = useCallback(() => {
    const recognition = getSpeechRecognition();
    
    if (!recognition.isSupported()) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      setInterimTranscript("");
    } else {
      const started = recognition.start(
        (transcript, isFinal) => {
          if (isFinal) {
            setInput(transcript);
            setInterimTranscript("");
            setIsListening(false);
            // Auto-send voice messages
            handleSendMessage(transcript, true);
          } else {
            setInterimTranscript(transcript);
          }
        },
        () => {
          setIsListening(false);
          setInterimTranscript("");
        },
        () => {
          setIsListening(false);
          setInterimTranscript("");
        }
      );
      if (started) {
        setIsListening(true);
      }
    }
  }, [isListening, handleSendMessage]);

  const toggleVoice = useCallback(() => {
    if (isSpeaking) {
      getVoiceService().stop();
      setIsSpeaking(false);
    }
    setVoiceEnabled(prev => !prev);
  }, [isSpeaking]);

  if (isMinimized) {
    return (
      <div
        className={cn(
          "fixed bottom-4 right-4 z-50",
          "bg-background-secondary border rounded-lg overflow-hidden",
          "cursor-pointer hover:border-opacity-80 transition-all",
          className
        )}
        style={{ borderColor: color }}
        onClick={() => setIsMinimized(false)}
        role="button"
        tabIndex={0}
        aria-label={`Expand chat with ${config?.name}`}
        onKeyDown={(e) => e.key === "Enter" && setIsMinimized(false)}
      >
        <div className="flex items-center gap-3 p-3">
          <AgentAvatar agentId={agent.id} status={agent.status} size="sm" />
          <span className="font-display text-sm tracking-wider" style={{ color }}>
            {config?.name}
          </span>
          <Maximize2 className="w-4 h-4 text-foreground-muted" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 w-[90vw] max-w-md",
        "bg-background-secondary border rounded-lg overflow-hidden shadow-2xl",
        "flex flex-col max-h-[70vh]",
        className
      )}
      style={{ 
        borderColor: color,
        boxShadow: `0 0 40px ${color}22`
      }}
      role="dialog"
      aria-label={`Chat with ${config?.name}`}
    >
      {/* Header */}
      <div 
        className="flex items-center gap-3 p-3 border-b"
        style={{ borderColor: `${color}33`, background: `${color}11` }}
      >
        <div className="relative">
          <AgentAvatar agentId={agent.id} status={agent.status} size="sm" />
          {isSpeaking && (
            <div 
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center animate-pulse"
              style={{ background: color }}
            >
              <Radio className="w-2.5 h-2.5 text-background" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-display text-sm tracking-wider flex items-center gap-2" style={{ color }}>
            {config?.name}
            {isSpeaking && (
              <span className="flex items-center gap-1 text-[10px] text-foreground-dim font-mono">
                <Waveform className="w-3 h-3 animate-pulse" />
                TRANSMITTING
              </span>
            )}
          </h3>
          <p className="text-[10px] text-foreground-dim">
            {config?.role} | Voice: {voiceProfile ? `P${voiceProfile.pitch} R${voiceProfile.rate}` : "Default"}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={toggleVoice}
            className={cn(
              "p-1.5 rounded transition-colors",
              voiceEnabled ? "text-foreground-muted hover:text-foreground" : "text-foreground-dim"
            )}
            aria-label={voiceEnabled ? "Disable voice" : "Enable voice"}
            aria-pressed={voiceEnabled}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 rounded text-foreground-muted hover:text-foreground transition-colors"
            aria-label="Minimize chat"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-foreground-muted hover:text-danger transition-colors"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div 
        className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[200px]"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] p-3 rounded-lg text-sm",
                message.role === "user"
                  ? "bg-primary/20 border border-primary/30"
                  : "bg-background-tertiary border border-border"
              )}
            >
              {message.isVoice && (
                <span className="text-[10px] text-foreground-dim flex items-center gap-1 mb-1">
                  <Mic className="w-3 h-3" /> Voice Command
                </span>
              )}
              <p className="text-foreground leading-relaxed">{message.content}</p>
              <span className="text-[10px] text-foreground-dim mt-1 block">
                {message.timestamp.toLocaleTimeString("en-US", { hour12: false })}
              </span>
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="bg-background-tertiary border border-border p-3 rounded-lg flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" style={{ color }} />
              <span className="text-xs text-foreground-dim">Processing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Voice Status Bar */}
      {isListening && (
        <div 
          className="px-3 py-2 border-t flex items-center gap-2"
          style={{ borderColor: `${color}33`, background: `${color}11` }}
        >
          <div className="w-2 h-2 rounded-full bg-danger animate-pulse" />
          <span className="text-xs text-foreground-muted flex-1">
            {interimTranscript || "Listening for voice command..."}
          </span>
          <button
            onClick={toggleListening}
            className="text-xs text-danger hover:underline"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-border">
        <div className="flex gap-2">
          <button
            onClick={toggleListening}
            disabled={sending}
            className={cn(
              "p-3 rounded-lg transition-all flex-shrink-0",
              isListening
                ? "bg-danger text-white"
                : "bg-background-tertiary text-foreground-muted hover:text-foreground hover:bg-background-tertiary/80"
            )}
            style={isListening ? {} : { borderColor: `${color}33` }}
            aria-label={isListening ? "Stop listening" : "Start voice input"}
            aria-pressed={isListening}
          >
            {isListening ? (
              <MicOff className="w-5 h-5 animate-pulse" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(input);
              }
            }}
            placeholder={isListening ? "Listening..." : "Enter command..."}
            disabled={sending || isListening}
            className="flex-1 bg-background-tertiary border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 transition-all"
            style={{ 
              // @ts-expect-error CSS custom property
              "--tw-ring-color": color 
            }}
            aria-label="Message input"
          />
          <button
            onClick={() => handleSendMessage(input)}
            disabled={sending || !input.trim()}
            className={cn(
              "p-3 rounded-lg transition-all flex-shrink-0",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            style={{ 
              background: color,
              color: "#050508"
            }}
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
