import type { SkillDescriptor } from '../SkillRegistry.js';

export function buildGeminiSkillTemplate(skillName: string, description: string): Omit<SkillDescriptor, 'id'> {
  return {
    name: skillName,
    description,
    llmProvider: 'gemini',
    providerSpecificPromptTemplate: `You are a Gemini-powered skill executor for "${skillName}". ${description}\n\nInput: {{input}}\n\nProvide a detailed, structured response.`,
    inputSchema: { type: 'object', properties: { input: { type: 'string' } }, required: ['input'] },
    outputSchema: { type: 'object', properties: { result: { type: 'string' }, confidence: { type: 'number' } } },
    tools: ['google-search', 'code-interpreter'],
    evaluationCriteria: 'Accuracy, completeness, and adherence to Gemini output format guidelines.',
    version: '1.0.0',
  };
}
