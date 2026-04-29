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
}

export type A2UIEventHandler<T> = (data: T) => void;

class A2UIServiceClass {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<A2UIEventHandler<unknown>>> = new Map();

  connect(serverUrl = 'http://localhost:3000'): void {
    if (this.socket?.connected) return;
    this.socket = io(serverUrl, { transports: ['websocket', 'polling'] });

    this.socket.on('connect', () => {
      console.log('[A2UI] Connected to Agent Swamps backend');
      this.socket?.emit('subscribe:tasks');
      this.socket?.emit('subscribe:agents');
    });

    // Forward all relevant events
    const events = [
      'task:completed',
      'agent:status',
      'prompt:improvised',
      'skill:created',
      'jobdescription:generated',
      'system_instruction:generated',
      'a2a:message',
      'a2ui:directive',
    ];

    for (const event of events) {
      this.socket.on(event, (data: unknown) => {
        this.emit(event, data);
      });
    }
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  on<T>(event: string, handler: A2UIEventHandler<T>): () => void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(handler as A2UIEventHandler<unknown>);
    return () => this.listeners.get(event)?.delete(handler as A2UIEventHandler<unknown>);
  }

  private emit(event: string, data: unknown): void {
    this.listeners.get(event)?.forEach(h => h(data));
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const A2UIService = new A2UIServiceClass();
