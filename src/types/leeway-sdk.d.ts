declare module 'leeway-sdk/src/core/AgentLeeRuntimeBootstrap' {
  export const agentLeeRuntimeBootstrap: {
    initialize(): Promise<void>;
    setLiteMode(enabled: boolean): void;
    getState(): { phase?: string };
  };
}

declare module 'leeway-sdk/src/core/AgentOrchestrationPipeline' {
  export const agentOrchestrationPipeline: {
    enablePerceptionSubscriptions(): void;
  };
}

declare module 'leeway-sdk/src/core/EventBus' {
  export const eventBus: {
    emit(eventName: string, payload?: unknown): void;
    on(eventName: string, listener: (payload: any) => void): () => void;
  };
}

declare module 'leeway-sdk/src/agents/legacy/AgentLee' {
  export const AgentLee: {
    respond(prompt: string, options?: unknown): Promise<string>;
    plan(input: string): Promise<string>;
  };
}

declare module 'leeway-sdk/src/core/UnifiedVoiceSession' {
  export const voiceSession: {
    start(): Promise<void>;
    stop(): Promise<void>;
  };
}

declare module 'leeway-sdk/src/core/LeewayVoiceClient' {
  export const leewayVoiceClient: {
    isConnected: boolean;
    connect(
      apiKey: string,
      handlers: { onMessage?: (message: { audioBase64?: string }) => void },
    ): Promise<void>;
    sendText(text: string): void;
  };
}

declare module 'leeway-sdk/src/core/VoiceService' {
  export const VoiceService: {
    speak(input: { text: string }): Promise<void>;
  };
}