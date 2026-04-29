import { eventBus } from 'leeway-sdk/src/core/EventBus';

const RTC_SDK_BASES = [
  'leeway-edge-rtc/src',
  '/.tmp-leeway-edge-rtc/src',
];

interface RtcSdkLike {
  speakWithSavedVoice?: (text: string, priority?: 'high' | 'normal' | 'low') => void;
  cancelSpeech?: () => void;
  callModeController?: {
    init?: () => void;
    startSession?: () => void;
    stopSession?: () => void;
    getState?: () => unknown;
  };
}

let cachedRtcSdk: RtcSdkLike | null = null;
let cachedRtcSdkSource: string | null = null;
let cameraStream: MediaStream | null = null;

async function loadRtcSdk(): Promise<RtcSdkLike | null> {
  if (cachedRtcSdk) return cachedRtcSdk;

  const envBase = import.meta.env.VITE_LEEWAY_RTC_SDK_ENTRY as string | undefined;
  const bases = envBase
    ? [envBase, ...RTC_SDK_BASES]
    : RTC_SDK_BASES;

  try {
    const dynamicImport = new Function('specifier', 'return import(specifier);') as (specifier: string) => Promise<RtcSdkLike>;
    for (const base of bases) {
      try {
        const normalized = base.replace(/\/$/, '');
        const [callModeModule, voiceModule] = await Promise.all([
          dynamicImport(`${normalized}/runtime/CallMode.ts`),
          dynamicImport(`${normalized}/voice/voice-output.ts`),
        ]);

        cachedRtcSdk = {
          callModeController: callModeModule.callModeController,
          speakWithSavedVoice: voiceModule.speakWithSavedVoice,
          cancelSpeech: voiceModule.cancelSpeech,
        };
        cachedRtcSdkSource = normalized;
        return cachedRtcSdk;
      } catch {
        // Try next candidate.
      }
    }

    console.warn('[LeeWayRTCBridge] Unable to load LeeWay-Edge-RTC SDK from candidates:', bases.join(', '));
    return null;
  } catch (error) {
    console.warn('[LeeWayRTCBridge] Unable to load LeeWay-Edge-RTC SDK:', error);
    return null;
  }
}

export async function getRtcBridgeStatus(): Promise<{ connected: boolean; hasCallMode: boolean; source: string | null }> {
  const sdk = await loadRtcSdk();
  return {
    connected: !!sdk,
    hasCallMode: !!sdk?.callModeController,
    source: cachedRtcSdkSource,
  };
}

export async function speakWithRtcVoice(text: string): Promise<boolean> {
  const sdk = await loadRtcSdk();
  if (!sdk?.speakWithSavedVoice) {
    return false;
  }

  sdk.speakWithSavedVoice(text, 'high');
  eventBus.emit('voice:rtc-spoken' as any, {
    source: 'leeway-edge-rtc',
    length: text.length,
  });
  return true;
}

export async function startRtcCallMode(): Promise<boolean> {
  const sdk = await loadRtcSdk();
  if (!sdk?.callModeController) {
    return false;
  }

  sdk.callModeController.init?.();
  sdk.callModeController.startSession?.();
  eventBus.emit('voice:rtc-callmode-started' as any, { source: 'leeway-edge-rtc' });
  return true;
}

export async function stopRtcCallMode(): Promise<void> {
  const sdk = await loadRtcSdk();
  sdk?.callModeController?.stopSession?.();
  sdk?.cancelSpeech?.();
  eventBus.emit('voice:rtc-callmode-stopped' as any, { source: 'leeway-edge-rtc' });
}

export async function startAgentLeeEyes(): Promise<boolean> {
  const shouldEnable = (import.meta.env.VITE_ENABLE_RTC_CAMERA ?? 'true') === 'true';
  if (!shouldEnable || !navigator.mediaDevices?.getUserMedia) {
    return false;
  }

  if (cameraStream) {
    return true;
  }

  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    eventBus.emit('vision:agent-lee-eyes-ready' as any, {
      source: 'leeway-edge-rtc',
      tracks: cameraStream.getVideoTracks().length,
    });
    return true;
  } catch (error) {
    console.warn('[LeeWayRTCBridge] Camera initialization failed:', error);
    return false;
  }
}

export function stopAgentLeeEyes(): void {
  if (!cameraStream) {
    return;
  }

  cameraStream.getTracks().forEach((track) => track.stop());
  cameraStream = null;
  eventBus.emit('vision:agent-lee-eyes-stopped' as any, { source: 'leeway-edge-rtc' });
}
