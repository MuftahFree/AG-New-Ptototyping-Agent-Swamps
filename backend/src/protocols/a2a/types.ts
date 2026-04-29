export type A2AIntent =
  | 'REQUEST'
  | 'RESPONSE'
  | 'DELEGATE'
  | 'NEGOTIATE'
  | 'BROADCAST'
  | 'HANDOFF'
  | 'STATUS_UPDATE'
  | 'CANCEL';

export interface A2AEnvelope {
  id: string;
  conversationId: string;
  fromAgentId: string;
  toAgentId: string | 'BROADCAST';
  intent: A2AIntent;
  payload: Record<string, unknown>;
  signature: string;
  timestamp: number;
  capabilities: string[];
  traceId: string;
}

export interface AgentCapabilityAd {
  agentId: string;
  agentName: string;
  capabilities: string[];
  timestamp: number;
}
