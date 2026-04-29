import { createHmac } from 'crypto';

const SECRET = process.env.A2A_HMAC_SECRET || 'agent-swamps-a2a-secret';

export function signEnvelope(payload: Omit<import('./types.js').A2AEnvelope, 'signature'>): string {
  const data = JSON.stringify({
    id: payload.id,
    conversationId: payload.conversationId,
    fromAgentId: payload.fromAgentId,
    toAgentId: payload.toAgentId,
    intent: payload.intent,
    timestamp: payload.timestamp,
  });
  return createHmac('sha256', SECRET).update(data).digest('hex');
}

export function verifyEnvelope(envelope: import('./types.js').A2AEnvelope): boolean {
  const expected = signEnvelope(envelope);
  return expected === envelope.signature;
}
