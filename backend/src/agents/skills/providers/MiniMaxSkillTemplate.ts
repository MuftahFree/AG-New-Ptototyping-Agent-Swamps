import type { SkillDescriptor } from '../SkillRegistry.js';

export function buildMiniMaxSkillTemplate(skillName: string, description: string): Omit<SkillDescriptor, 'id'> {
  return {
    name: skillName,
    description,
    llmProvider: 'minimax',
    providerSpecificPromptTemplate: `[SKILL: ${skillName}]\n${description}\n\nUser Input: {{input}}\n\nPlease provide a comprehensive response following MiniMax output standards.`,
    inputSchema: { type: 'object', properties: { input: { type: 'string' } }, required: ['input'] },
    outputSchema: { type: 'object', properties: { result: { type: 'string' }, metadata: { type: 'object' } } },
    tools: ['text-generation', 'multimodal-understanding'],
    evaluationCriteria: 'Relevance, fluency, and MiniMax model-specific token efficiency.',
    version: '1.0.0',
  };
}
