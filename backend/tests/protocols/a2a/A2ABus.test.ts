import { describe, it, expect } from 'vitest';
import { A2ABus } from '../../../src/protocols/a2a/A2ABus.js';

describe('A2ABus', () => {
  const bus = A2ABus.getInstance();

  it('sends and receives messages', { timeout: 5000 }, () => {
    return new Promise<void>((resolve) => {
      bus.onMessage((envelope) => {
        if (envelope.conversationId === 'test-conv-1') {
          expect(envelope.intent).toBe('REQUEST');
          resolve();
        }
      });

      bus.send({
        conversationId: 'test-conv-1',
        fromAgentId: 'agent-a',
        toAgentId: 'agent-b',
        intent: 'REQUEST',
        payload: { msg: 'hello' },
        capabilities: ['code-generation'],
      });
    });
  });

  it('verifies envelope signatures', () => {
    const envelope = bus.send({
      conversationId: 'sig-test',
      fromAgentId: 'agent-a',
      toAgentId: 'agent-b',
      intent: 'HANDOFF',
      payload: {},
      capabilities: [],
    });
    expect(bus.verify(envelope)).toBe(true);
  });

  it('retrieves conversation history', () => {
    bus.send({
      conversationId: 'history-test',
      fromAgentId: 'agent-x',
      toAgentId: 'agent-y',
      intent: 'STATUS_UPDATE',
      payload: { status: 'done' },
      capabilities: [],
    });
    const history = bus.getConversation('history-test');
    expect(history.length).toBeGreaterThan(0);
  });

  it('finds agents with capability', () => {
    bus.publishCapabilities({
      agentId: 'cap-agent-1',
      agentName: 'Cap Agent',
      capabilities: ['special-power'],
    });
    const found = bus.findAgentsWithCapability('special-power');
    expect(found.length).toBeGreaterThan(0);
  });
});
