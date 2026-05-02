"use client";

export interface VoiceConfig {
  pitch: number;
  rate: number;
  volume: number;
  voiceIndex?: number;
  preferredVoiceName?: string;
}

// Unique voice profiles for each agent
export const AGENT_VOICE_PROFILES: Record<string, VoiceConfig> = {
  ares: {
    pitch: 0.7,
    rate: 1.15,
    volume: 1.0,
    preferredVoiceName: "Google UK English Male",
  },
  athena: {
    pitch: 1.3,
    rate: 0.95,
    volume: 0.95,
    preferredVoiceName: "Google UK English Female",
  },
  apollo: {
    pitch: 1.0,
    rate: 0.9,
    volume: 1.0,
    preferredVoiceName: "Google US English",
  },
  argus: {
    pitch: 0.85,
    rate: 1.25,
    volume: 0.9,
    preferredVoiceName: "Microsoft David",
  },
  aegis: {
    pitch: 0.6,
    rate: 0.85,
    volume: 1.0,
    preferredVoiceName: "Google UK English Male",
  },
};

class VoiceService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isInitialized = false;
  private voicesLoaded = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.synth = window.speechSynthesis;
      this.loadVoices();
    }
  }

  private loadVoices(): void {
    if (!this.synth) return;

    // Load voices
    const loadVoicesHandler = () => {
      this.voices = this.synth?.getVoices() || [];
      this.voicesLoaded = true;
    };

    // Voices may be loaded asynchronously
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoicesHandler;
    }

    // Try to load immediately as well
    loadVoicesHandler();
    this.isInitialized = true;
  }

  private findBestVoice(preferredName?: string): SpeechSynthesisVoice | null {
    if (!this.voices.length) {
      this.voices = this.synth?.getVoices() || [];
    }

    if (preferredName) {
      const preferred = this.voices.find(v => 
        v.name.toLowerCase().includes(preferredName.toLowerCase())
      );
      if (preferred) return preferred;
    }

    // Fallback priorities
    const priorities = [
      "Google",
      "Microsoft",
      "Neural",
      "Premium",
      "Enhanced",
    ];

    for (const priority of priorities) {
      const match = this.voices.find(v => 
        v.name.includes(priority) && v.lang.startsWith("en")
      );
      if (match) return match;
    }

    // Return first English voice
    return this.voices.find(v => v.lang.startsWith("en")) || this.voices[0] || null;
  }

  speak(
    text: string,
    agentId: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (error: Event) => void
  ): void {
    if (!this.synth) return;

    // Cancel any ongoing speech
    this.synth.cancel();

    const profile = AGENT_VOICE_PROFILES[agentId] || {
      pitch: 1.0,
      rate: 1.0,
      volume: 1.0,
    };

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice
    const voice = this.findBestVoice(profile.preferredVoiceName);
    if (voice) {
      utterance.voice = voice;
    }

    // Set voice characteristics
    utterance.pitch = profile.pitch;
    utterance.rate = profile.rate;
    utterance.volume = profile.volume;

    // Event handlers
    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;
    if (onError) utterance.onerror = onError;

    this.synth.speak(utterance);
  }

  stop(): void {
    this.synth?.cancel();
  }

  isSpeaking(): boolean {
    return this.synth?.speaking || false;
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }
}

// Singleton instance
let voiceServiceInstance: VoiceService | null = null;

export function getVoiceService(): VoiceService {
  if (!voiceServiceInstance) {
    voiceServiceInstance = new VoiceService();
  }
  return voiceServiceInstance;
}

// Speech recognition service
class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;

  constructor() {
    if (typeof window !== "undefined") {
      const SpeechRecognition = 
        window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = "en-US";
        this.recognition.maxAlternatives = 1;
      }
    }
  }

  isSupported(): boolean {
    return this.recognition !== null;
  }

  start(
    onResult: (transcript: string, isFinal: boolean) => void,
    onEnd?: () => void,
    onError?: (error: Event) => void
  ): boolean {
    if (!this.recognition || this.isListening) return false;

    this.recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      onResult(transcript, result.isFinal);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd?.();
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      onError?.(event);
    };

    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch {
      return false;
    }
  }

  stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  abort(): void {
    if (this.recognition) {
      this.recognition.abort();
      this.isListening = false;
    }
  }

  getIsListening(): boolean {
    return this.isListening;
  }
}

let speechRecognitionInstance: SpeechRecognitionService | null = null;

export function getSpeechRecognition(): SpeechRecognitionService {
  if (!speechRecognitionInstance) {
    speechRecognitionInstance = new SpeechRecognitionService();
  }
  return speechRecognitionInstance;
}

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
