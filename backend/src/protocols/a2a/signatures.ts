import { createHmac } from 'crypto';

function resolveSecret(): string {
  const envSecret = process.env.A2A_HMAC_SECRET;
  if (envSecret) return envSecret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      '[A2ABus] A2A_HMAC_SECRET environment variable is required in production. ' +
      'Set it to a strong random secret (e.g. `openssl rand -hex 32`).'
    );
  }
  // Development/test only — log a clear warning so developers know to set the variable
  console.warn(
    '[A2ABus] WARNING: A2A_HMAC_SECRET is not set. ' +
    'Using a default development secret. Set A2A_HMAC_SECRET in your .env file.'
  );
  return 'agent-swamps-a2a-dev-secret';
}

const SECRET = resolveSecret();

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
