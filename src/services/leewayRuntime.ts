import { eventBus } from './leewayEventBus';

type RuntimeBootstrap = {
  setLiteMode: (enabled: boolean) => void;
  initialize: () => Promise<void>;
};

type RuntimeEventBus = {
  on: (event: string, handler: (data: any) => void) => () => void;
  emit?: (event: string, data: any) => void;
};

type RuntimeModules = {
  runtimeBootstrap: RuntimeBootstrap;
  runtimeEventBus: RuntimeEventBus;
};

const fallbackRuntimeBootstrap: RuntimeBootstrap = {
  setLiteMode: () => {
    // No-op in lightweight mode.
  },
  initialize: async () => {
    eventBus.emit('runtime:ready', { source: 'lite-runtime' });
  },
};

let cachedRuntime: RuntimeModules | null = null;

const dynamicImport = new Function('specifier', 'return import(specifier);') as (specifier: string) => Promise<any>;

async function tryLoad(specifier: string) {
  try {
    return await dynamicImport(specifier);
  } catch {
    return null;
  }
}

export async function loadRuntimeModules(): Promise<RuntimeModules> {
  if (cachedRuntime) return cachedRuntime;

  const runtimeCandidates = [
    'leeway-sdk/src/core/AgentLeeRuntimeBootstrap',
  ];
  const eventBusCandidates = [
    'leeway-sdk/src/core/EventBus',
  ];

  let runtimeModule: any = null;
  let sdkEventModule: any = null;

  for (const candidate of runtimeCandidates) {
    runtimeModule = await tryLoad(candidate);
    if (runtimeModule?.agentLeeRuntimeBootstrap) break;
  }

  for (const candidate of eventBusCandidates) {
    sdkEventModule = await tryLoad(candidate);
    if (sdkEventModule?.eventBus) break;
  }

  const runtimeBootstrap = (runtimeModule?.agentLeeRuntimeBootstrap || fallbackRuntimeBootstrap) as RuntimeBootstrap;
  const runtimeEventBus = (sdkEventModule?.eventBus || eventBus) as RuntimeEventBus;

  cachedRuntime = {
    runtimeBootstrap,
    runtimeEventBus,
  };

  return cachedRuntime;
}
