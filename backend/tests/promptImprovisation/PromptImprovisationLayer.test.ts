import { describe, it, expect, beforeEach } from 'vitest';
import { EventEmitter } from 'events';
import { PromptImprovisationLayer } from '../../src/orchestration/promptImprovisation/PromptImprovisationLayer.js';
import { SkillRegistry } from '../../src/agents/skills/SkillRegistry.js';

const mockModelRouter = {
  generate: async (_prompt: string) => '{"result":"mock"}',
  registerProvider: () => {},
  setDefaultProvider: () => {},
} as any;

describe('PromptImprovisationLayer', () => {
  let pil: PromptImprovisationLayer;
  let events: EventEmitter;

  beforeEach(() => {
    events = new EventEmitter();
    pil = new PromptImprovisationLayer(mockModelRouter, events);
  });

  it('emits jobdescription:generated', async () => {
    let jdEmitted = false;
    events.on('jobdescription:generated', () => { jdEmitted = true; });

    const task = {
      id: 'test-1', title: 'Test Task', description: 'A test task',
      type: 'CODE_GENERATION' as any, priority: 'MEDIUM' as any,
      status: 'PENDING' as any, requiredCapabilities: [],
      context: { additionalData: {} }, dependencies: [],
      createdAt: new Date(), updatedAt: new Date(),
    };

    await pil.improvise(task);
    expect(jdEmitted).toBe(true);
  });

  it('emits prompt:improvised', async () => {
    let improvised = false;
    events.on('prompt:improvised', () => { improvised = true; });

    const task = {
      id: 'test-2', title: 'Test Task', description: 'A test task',
      type: 'GENERAL' as any, priority: 'LOW' as any,
      status: 'PENDING' as any, requiredCapabilities: ['new-unique-skill-xyz'],
      context: { additionalData: {} }, dependencies: [],
      createdAt: new Date(), updatedAt: new Date(),
    };

    const result = await pil.improvise(task);
    expect(improvised).toBe(true);
    expect(result.jobDescription).toBeDefined();
    expect(result.systemInstruction).toBeDefined();
  });

  it('creates missing skills', async () => {
    const task = {
      id: 'test-3', title: 'Skill Test', description: 'Needs a rare skill',
      type: 'GENERAL' as any, priority: 'LOW' as any,
      status: 'PENDING' as any, requiredCapabilities: ['hyper-rare-skill-abc123'],
      context: { additionalData: {}, llmProvider: 'gemini' }, dependencies: [],
      createdAt: new Date(), updatedAt: new Date(),
    };

    const result = await pil.improvise(task);
    expect(result.newSkillsCreated).toContain('hyper-rare-skill-abc123');
    expect(SkillRegistry.getInstance().hasSkill('hyper-rare-skill-abc123')).toBe(true);
  });
});
