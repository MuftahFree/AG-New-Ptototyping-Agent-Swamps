import { io, type Socket } from 'socket.io-client';

export type A2UIDirectiveType =
  | 'RENDER_WIDGET'
  | 'RENDER_CARD'
  | 'RENDER_CHART'
  | 'RENDER_INFOGRAPHIC'
  | 'RENDER_IMAGE'
  | 'STREAM_DATA'
  | 'UPDATE_STATE'
  | 'REQUEST_INPUT';

export interface A2UIDirective {
  id: string;
  type: A2UIDirectiveType;
  payload: Record<string, unknown>;
  theme?: string;
  animation?: string;
  dataBinding?: Record<string, unknown>;
  timestamp: number;
}

export interface ImprovisationEvent {
  taskId: string;
  jobDescription?: Record<string, unknown>;
  systemInstruction?: Record<string, unknown>;
  skill?: Record<string, unknown>;
}

export interface A2AMessageEvent {
  id: string;
  conversationId: string;
  fromAgentId: string;
  toAgentId: string;
  intent: string;
  payload: Record<string, unknown>;
  timestamp: number;
  /** Pre-computed preview string (first 80 chars of JSON payload). */
  _preview?: string;
}

export type A2UIEventHandler<T> = (data: T) => void;

/** Reads the optional auth token from the VITE_A2UI_TOKEN env variable. */
function getAuthToken(): string | undefined {
  return import.meta.env.VITE_A2UI_TOKEN as string | undefined;
}

/** The list of socket events forwarded to internal listeners. */
const FORWARDED_EVENTS = [
  'task:completed',
  'agent:status',
  'prompt:improvised',
  'skill:created',
  'jobdescription:generated',
  'system_instruction:generated',
  'a2a:message',
  'a2ui:directive',
] as const;

class A2UIServiceClass {
  private socket: Socket | null = null;
  private connecting = false;
  private listeners: Map<string, Set<A2UIEventHandler<unknown>>> = new Map();

  /**
   * Connects to the Agent Swamps backend.
   * Idempotent — safe to call multiple times (e.g. under React 18 StrictMode).
   * Prefers VITE_A2UI_URL if defined, otherwise falls back to the provided URL
   * or `http://localhost:3000`.
   *
   * @param serverUrl - Optional override for the WebSocket server URL.
   */
  connect(serverUrl?: string): void {
    const url =
      (import.meta.env.VITE_A2UI_URL as string | undefined) ??
      serverUrl ??
      'http://localhost:3000';

    // Warn about cleartext connections in production.
    if (import.meta.env.PROD && url.startsWith('http://')) {
      console.warn(
        '[A2UI] Connecting over cleartext HTTP in production. ' +
          'Set VITE_A2UI_URL to a secure wss:// / https:// endpoint.',
      );
    }

    // Prevent duplicate connections (idempotent under StrictMode double-invoke).
    if (this.connecting || this.socket?.connected) return;
    this.connecting = true;

    this.socket = io(url, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelayMax: 5000,
      timeout: 8000,
      auth: (cb: (data: Record<string, unknown>) => void) => {
        const token = getAuthToken();
        cb(token ? { token } : {});
      },
    });

    this.socket.on('connect', () => {
      this.connecting = false;
      console.log('[A2UI] Connected to Agent Swamps backend');
      this.socket?.emit('subscribe:tasks');
      this.socket?.emit('subscribe:agents');
      this.emit('__connected', undefined);
    });

    this.socket.on('disconnect', () => {
      this.emit('__disconnected', undefined);
    });

    // Remove any stale listeners, then re-register — prevents duplicates when
    // connect() is called more than once (React 18 StrictMode).
    for (const event of FORWARDED_EVENTS) {
      this.socket.off(event);
      this.socket.on(event, (data: unknown) => {
        this.emit(event, data);
      });
    }
  }

  /**
   * Disconnects from the backend and resets internal state.
   */
  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
    this.connecting = false;
  }

  /**
   * Subscribes to an internal event emitted by the service.
   * Returns an unsubscribe function.
   *
   * @param event - Event name (socket event or `__connected` / `__disconnected`).
   * @param handler - Callback invoked when the event fires.
   */
  on<T>(event: string, handler: A2UIEventHandler<T>): () => void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(handler as A2UIEventHandler<unknown>);
    return () => this.listeners.get(event)?.delete(handler as A2UIEventHandler<unknown>);
  }

  /**
   * Dispatches an event to all registered listeners.
   * Each handler is wrapped in try/catch to prevent one throwing listener from
   * breaking the bus, and scheduled via queueMicrotask to decouple producers
   * from consumers.
   *
   * @param event - Event name.
   * @param data - Payload passed to each handler.
   */
  private emit(event: string, data: unknown): void {
    this.listeners.get(event)?.forEach(h => {
      queueMicrotask(() => {
        try {
          h(data);
        } catch (err) {
          console.error(`[A2UI] Handler for "${event}" threw:`, err);
        }
      });
    });
  }

  /**
   * Returns true when the underlying socket is currently connected.
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const A2UIService = new A2UIServiceClass();
