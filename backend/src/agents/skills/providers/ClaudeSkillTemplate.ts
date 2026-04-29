import type { SkillDescriptor } from '../SkillRegistry.js';

export function buildClaudeSkillTemplate(skillName: string, description: string): Omit<SkillDescriptor, 'id'> {
  return {
    name: skillName,
    description,
    llmProvider: 'claude',
    providerSpecificPromptTemplate: `<task>\nYou are a Claude-powered skill executor for "${skillName}". ${description}\n</task>\n<input>{{input}}</input>\n<instructions>Respond in structured XML or JSON as appropriate.</instructions>`,
    inputSchema: { type: 'object', properties: { input: { type: 'string' } }, required: ['input'] },
    outputSchema: { type: 'object', properties: { result: { type: 'string' }, reasoning: { type: 'string' } } },
    tools: ['computer-use', 'web-search'],
    evaluationCriteria: 'Clarity, safety, and alignment with Anthropic Constitutional AI guidelines.',
    version: '1.0.0',
  };
}
