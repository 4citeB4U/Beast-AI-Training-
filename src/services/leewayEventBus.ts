type Handler = (data: any) => void;

const listeners = new Map<string, Set<Handler>>();

export const eventBus = {
  on(event: string, handler: Handler) {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event)!.add(handler);
    return () => listeners.get(event)?.delete(handler);
  },
  emit(event: string, data: any = {}) {
    const handlers = listeners.get(event);
    if (!handlers) return;
    handlers.forEach((handler) => {
      try {
        handler(data);
      } catch {
        // Swallow handler errors to keep event fanout resilient.
      }
    });
  },
};
