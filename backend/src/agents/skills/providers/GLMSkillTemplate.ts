import type { SkillDescriptor } from '../SkillRegistry.js';

export function buildGLMSkillTemplate(skillName: string, description: string): Omit<SkillDescriptor, 'id'> {
  return {
    name: skillName,
    description,
    llmProvider: 'glm',
    providerSpecificPromptTemplate: `[GLM技能: ${skillName}]\n描述: ${description}\n\n输入/Input: {{input}}\n\nProvide a bilingual response optimized for GLM's multilingual capabilities.`,
    inputSchema: { type: 'object', properties: { input: { type: 'string' } }, required: ['input'] },
    outputSchema: { type: 'object', properties: { result: { type: 'string' }, language: { type: 'string' } } },
    tools: ['multilingual-generation', 'code-generation'],
    evaluationCriteria: 'Multilingual accuracy, cultural relevance, and GLM-specific instruction following.',
    version: '1.0.0',
  };
}
