import type { SkillDescriptor } from '../SkillRegistry.js';

export function buildGrokSkillTemplate(skillName: string, description: string): Omit<SkillDescriptor, 'id'> {
  return {
    name: skillName,
    description,
    llmProvider: 'grok',
    providerSpecificPromptTemplate: `[GROK SKILL: ${skillName}]\nContext: ${description}\n\nReal-time Input: {{input}}\n\nRespond with up-to-date, accurate information leveraging Grok's real-time knowledge.`,
    inputSchema: { type: 'object', properties: { input: { type: 'string' } }, required: ['input'] },
    outputSchema: { type: 'object', properties: { result: { type: 'string' }, sources: { type: 'array', items: { type: 'string' } } } },
    tools: ['real-time-search', 'x-platform-data'],
    evaluationCriteria: 'Timeliness, factual accuracy, and effective use of real-time Grok capabilities.',
    version: '1.0.0',
  };
}
