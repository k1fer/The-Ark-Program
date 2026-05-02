"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { AGENT_CONFIG, type Agent, type AgentMessage } from "@/lib/supabase";
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
  Maximize2 
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
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "agent",
      content: `${config?.name} online. Standing by for your orders, Master Control.`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
          // Auto-send voice messages
          handleSendMessage(transcript, true);
        };

        recognitionRef.current.onerror = () => {
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }

      synthRef.current = window.speechSynthesis;
    }

    return () => {
      recognitionRef.current?.abort();
      synthRef.current?.cancel();
    };
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speakMessage = useCallback((text: string) => {
    if (!synthRef.current || !voiceEnabled) return;
    
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Get a robotic/synthetic voice if available
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes("Google") || v.name.includes("Neural")
    ) || voices[0];
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    // Customize voice based on agent
    switch (agent.id) {
      case "ares":
        utterance.pitch = 0.8;
        utterance.rate = 1.1;
        break;
      case "athena":
        utterance.pitch = 1.2;
        utterance.rate = 1.0;
        break;
      case "apollo":
        utterance.pitch = 1.0;
        utterance.rate = 0.95;
        break;
      case "argus":
        utterance.pitch = 0.9;
        utterance.rate = 1.2;
        break;
      case "aegis":
        utterance.pitch = 0.7;
        utterance.rate = 0.9;
        break;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
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
    } catch (error) {
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
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  const toggleVoice = useCallback(() => {
    if (isSpeaking) {
      synthRef.current?.cancel();
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
    >
      {/* Header */}
      <div 
        className="flex items-center gap-3 p-3 border-b"
        style={{ borderColor: `${color}33`, background: `${color}11` }}
      >
        <AgentAvatar agentId={agent.id} status={agent.status} size="sm" />
        <div className="flex-1">
          <h3 className="font-display text-sm tracking-wider" style={{ color }}>
            {config?.name}
          </h3>
          <p className="text-[10px] text-foreground-dim">
            {config?.role} {isSpeaking && "- Speaking..."}
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
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 rounded text-foreground-muted hover:text-foreground transition-colors"
            aria-label="Minimize"
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
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[200px]">
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
                  <Mic className="w-3 h-3" /> Voice
                </span>
              )}
              <p className="text-foreground leading-relaxed">{message.content}</p>
              <span className="text-[10px] text-foreground-dim mt-1 block">
                {message.timestamp.toLocaleTimeString("en-SG", { hour12: false })}
              </span>
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="bg-background-tertiary border border-border p-3 rounded-lg">
              <Loader2 className="w-4 h-4 animate-spin" style={{ color }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border">
        <div className="flex gap-2">
          <button
            onClick={toggleListening}
            disabled={sending}
            className={cn(
              "p-3 rounded-lg transition-all",
              isListening
                ? "bg-danger text-white animate-pulse"
                : "bg-background-tertiary text-foreground-muted hover:text-foreground"
            )}
            aria-label={isListening ? "Stop listening" : "Start voice input"}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(input);
              }
            }}
            placeholder={isListening ? "Listening..." : "Message..."}
            disabled={sending || isListening}
            className="flex-1 bg-background-tertiary border border-border rounded-lg px-4 py-2 text-sm"
          />
          <button
            onClick={() => handleSendMessage(input)}
            disabled={sending || !input.trim()}
            className={cn(
              "p-3 rounded-lg transition-all",
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

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
