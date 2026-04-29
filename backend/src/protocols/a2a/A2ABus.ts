import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import type { A2AEnvelope, AgentCapabilityAd } from './types.js';
import { signEnvelope, verifyEnvelope } from './signatures.js';

export class A2ABus {
  private static instance: A2ABus;
  private emitter = new EventEmitter();
  private conversations: Map<string, A2AEnvelope[]> = new Map();
  private capabilityRegistry: Map<string, AgentCapabilityAd> = new Map();

  private constructor() {}

  static getInstance(): A2ABus {
    if (!A2ABus.instance) A2ABus.instance = new A2ABus();
    return A2ABus.instance;
  }

  publishCapabilities(ad: Omit<AgentCapabilityAd, 'timestamp'>): void {
    this.capabilityRegistry.set(ad.agentId, { ...ad, timestamp: Date.now() });
  }

  findAgentsWithCapability(capability: string): AgentCapabilityAd[] {
    return Array.from(this.capabilityRegistry.values()).filter(a =>
      a.capabilities.includes(capability)
    );
  }

  send(
    params: Omit<A2AEnvelope, 'id' | 'signature' | 'timestamp' | 'traceId'> & { traceId?: string }
  ): A2AEnvelope {
    const partial = {
      ...params,
      id: uuidv4(),
      timestamp: Date.now(),
      traceId: params.traceId || uuidv4(),
    };
    const signature = signEnvelope(partial);
    const envelope: A2AEnvelope = { ...partial, signature };

    const conv = this.conversations.get(envelope.conversationId) || [];
    conv.push(envelope);
    this.conversations.set(envelope.conversationId, conv);

    this.emitter.emit('message', envelope);
    if (envelope.toAgentId !== 'BROADCAST') {
      this.emitter.emit(`agent:${envelope.toAgentId}`, envelope);
    } else {
      this.emitter.emit('broadcast', envelope);
    }

    return envelope;
  }

  onMessage(handler: (envelope: A2AEnvelope) => void): void {
    this.emitter.on('message', handler);
  }

  onAgentMessage(agentId: string, handler: (envelope: A2AEnvelope) => void): void {
    this.emitter.on(`agent:${agentId}`, handler);
  }

  getConversation(conversationId: string): A2AEnvelope[] {
    return this.conversations.get(conversationId) || [];
  }

  getAllConversationIds(): string[] {
    return Array.from(this.conversations.keys());
  }

  verify(envelope: A2AEnvelope): boolean {
    return verifyEnvelope(envelope);
  }
}
