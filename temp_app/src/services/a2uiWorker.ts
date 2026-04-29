/**
 * A2UI Web Worker — optional off-main-thread socket ingestion.
 *
 * Activated when `VITE_A2UI_USE_WORKER=true`.
 * The worker maintains the socket.io-client connection, pre-computes a preview
 * string for each A2A message, and posts normalised events back to the main thread.
 *
 * Message protocol (worker → main thread):
 *   { type: '__connected' }
 *   { type: '__disconnected' }
 *   { type: string; data: unknown }   — forwarded socket events
 */

import { io, type Socket } from 'socket.io-client';

/** Shape of messages sent from the main thread to this worker. */
interface WorkerCommand {
  cmd: 'connect' | 'disconnect';
  url?: string;
  token?: string;
}

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

let socket: Socket | null = null;

function attachListeners(sock: Socket): void {
  sock.on('connect', () => {
    sock.emit('subscribe:tasks');
    sock.emit('subscribe:agents');
    self.postMessage({ type: '__connected' });
  });

  sock.on('disconnect', () => {
    self.postMessage({ type: '__disconnected' });
  });

  for (const event of FORWARDED_EVENTS) {
    sock.off(event);
    sock.on(event, (raw: unknown) => {
      let data = raw;
      // Pre-compute _preview for A2A messages to avoid JSON.stringify on the main thread.
      if (event === 'a2a:message' && typeof raw === 'object' && raw !== null) {
        const msg = raw as Record<string, unknown>;
        const preview = JSON.stringify(msg['payload']).slice(0, 80);
        data = { ...msg, _preview: preview };
      }
      self.postMessage({ type: event, data });
    });
  }
}

self.addEventListener('message', (ev: MessageEvent<WorkerCommand>) => {
  const { cmd, url, token } = ev.data;

  if (cmd === 'connect') {
    if (socket?.connected) return;
    const serverUrl = url ?? 'http://localhost:3000';
    socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelayMax: 5000,
      timeout: 8000,
      auth: token ? { token } : {},
    });
    attachListeners(socket);
  } else if (cmd === 'disconnect') {
    socket?.disconnect();
    socket = null;
  }
});
