/*
LEEWAY HEADER — DO NOT REMOVE

DISCOVERY_PIPELINE: Voice -> Intent -> Location -> Vertical -> Ranking -> Render

REGION: AI.BEAST.COGNITION
TAG: AI.BEAST.CORE_SYNAPSE

5WH:
WHAT = BEAST AI Core Cognition Layer
WHY = Lightweight, non-blocking assistant behavior with optional Leeway runtime integration
WHO = Leeway Innovations
WHERE = src/services/ai.ts
WHEN = 2026-05-05
HOW = Optional SDK loading + local event bus + Gemini fallback
*/

import { GoogleGenAI } from '@google/genai';
import {
  getRtcBridgeStatus,
  speakWithRtcVoice,
  startRtcCallMode,
  stopRtcCallMode,
  startAgentLeeEyes,
  stopAgentLeeEyes,
} from './leewayRtcBridge';
import { eventBus } from './leewayEventBus';

export const AGENT_HIERARCHY = {
  VECTOR: 'Network/Diagnostics - Monitoring RTT and Bitrate.',
  ARIA: 'Voice/Audio Studio - TTS and Emotion Inference.',
  WARD: 'System Janitor - Memory and Cache cleanup.',
  GOVERNOR: 'System Overlord - Licensing and Structural Integrity.',
};

const MODEL_NAME = 'gemini-1.5-flash';
let recognitionRef: any = null;

function getAIClient(): GoogleGenAI | null {
  const key = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  if (!key) return null;
  return new GoogleGenAI({ apiKey: key });
}

function fallbackResponse(question: string): string {
  return [
    'Agent Lee here. SDK is running in lightweight mode so your app stays fast and stable.',
    '1. Continue training in Curriculum tracks.',
    '2. Use Agent VM tools for practical builds.',
    `3. For this request, start with: ${question.slice(0, 120)}`,
  ].join('\n');
}

export async function askAssistant(question: string, context: string): Promise<string> {
  eventBus.emit('agent:thinking', { message: 'AGENT_LEE: Processing request.' });
  const ai = getAIClient();

  if (!ai) {
    const reply = fallbackResponse(question);
    eventBus.emit('agent:done', { message: reply });
    return reply;
  }

  try {
    const prompt = [
      'You are Agent Lee, mentor for BEAST AI.',
      'Keep response concise, practical, and step-based.',
      'Mention official certification should be launched externally when relevant.',
      'Context:',
      context,
      'Question:',
      question,
    ].join('\n');

    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    const text = result.text || fallbackResponse(question);
    eventBus.emit('agent:done', { message: text });
    return text;
  } catch (error: any) {
    const failText = `[SYSTEM_ALERT] AI fallback engaged: ${error?.message || 'Unknown error'}`;
    eventBus.emit('agent:error', { error: failText });
    return failText;
  }
}

export async function generateAgentLeeNarration(text: string, context: string): Promise<string> {
  const prompt = `Narrate this lesson as Agent Lee in one coherent coaching paragraph.\nContext:\n${context}\nContent:\n${text}`;
  return askAssistant(prompt, context);
}

export async function generateSpeech(text: string): Promise<string | null> {
  const rtcSpoken = await speakWithRtcVoice(text);
  if (rtcSpoken) return null;
  return null;
}

export async function startVoiceSession() {
  const bridgeStatus = await getRtcBridgeStatus();
  if (bridgeStatus.connected) {
    await startRtcCallMode();
    await startAgentLeeEyes();
  }

  const Recognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!Recognition) return;

  const recognition = new Recognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onstart = () => {
    eventBus.emit('perception:voice-listening', { state: 'listening' });
    eventBus.emit('voice:state', { state: 'listening' });
  };

  recognition.onresult = (event: any) => {
    const transcript = event?.results?.[0]?.[0]?.transcript || '';
    eventBus.emit('perception:voice-final', { transcript });
    eventBus.emit('voice:state', { state: 'idle' });
  };

  recognition.onerror = () => {
    eventBus.emit('voice:state', { state: 'idle' });
  };

  recognition.onend = () => {
    eventBus.emit('voice:state', { state: 'idle' });
  };

  recognitionRef = recognition;
  recognition.start();
}

export async function stopVoiceSession() {
  await stopRtcCallMode();
  stopAgentLeeEyes();
  if (recognitionRef) {
    try {
      recognitionRef.stop();
    } catch {
      // Ignore stop errors in lightweight mode.
    }
  }
  recognitionRef = null;
  eventBus.emit('voice:state', { state: 'idle' });
}

export async function workshopResponse(input: string, persona: string) {
  const prompt = `Workshop task (${persona}): ${input}`;
  return askAssistant(prompt, `Workshop persona: ${persona}`);
}

export function subscribeToAgentEvents(callback: (event: any) => void) {
  const events = [
    'agent:active',
    'agent:done',
    'agent:thinking',
    'agent:speaking',
    'agent:error',
    'perception:voice-listening',
    'perception:voice-final',
    'runtime:ready',
  ];

  const unsubscribes = events.map((eventName) =>
    eventBus.on(eventName, (data: any) => {
      callback({ type: eventName, ...data });
    }),
  );

  return () => {
    unsubscribes.forEach((unsubscribe) => unsubscribe());
  };
}
