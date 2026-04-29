import { Agent } from './Agent.js';
import type { ModelRouter } from '../models/ModelRouter.js';
import type { Task, TaskAnalysis, ValidationResult } from '../shared/types.js';
import { SkillRegistry, type SkillDescriptor } from './skills/SkillRegistry.js';
import { buildGeminiSkillTemplate } from './skills/providers/GeminiSkillTemplate.js';
import { buildClaudeSkillTemplate } from './skills/providers/ClaudeSkillTemplate.js';
import { buildMiniMaxSkillTemplate } from './skills/providers/MiniMaxSkillTemplate.js';
import { buildGrokSkillTemplate } from './skills/providers/GrokSkillTemplate.js';
import { buildGLMSkillTemplate } from './skills/providers/GLMSkillTemplate.js';

export class SkillCreatorAgent extends Agent {
  private registry: SkillRegistry;

  constructor(modelRouter: ModelRouter) {
    super(
      'Skill Creator Agent',
      'DEVELOPER' as any,
      {
        skills: ['skill-creation', 'prompt-engineering', 'schema-design'],
        maxConcurrentTasks: 5,
        specializations: ['skill-synthesis', 'llm-adaptation'],
        supportedTaskTypes: ['GENERAL' as any],
      },
      modelRouter
    );
    this.registry = SkillRegistry.getInstance();
  }

  async createSkillForProvider(skillName: string, description: string, provider: string): Promise<SkillDescriptor> {
    let template: Omit<SkillDescriptor, 'id'>;

    switch (provider.toLowerCase()) {
      case 'claude':
        template = buildClaudeSkillTemplate(skillName, description);
        break;
      case 'minimax':
        template = buildMiniMaxSkillTemplate(skillName, description);
        break;
      case 'grok':
        template = buildGrokSkillTemplate(skillName, description);
        break;
      case 'glm':
        template = buildGLMSkillTemplate(skillName, description);
        break;
      default:
        template = buildGeminiSkillTemplate(skillName, description);
    }

    const skill = this.registry.register(template);
    return skill;
  }

  protected async analyzeTask(task: Task): Promise<TaskAnalysis> {
    return {
      estimatedComplexity: 'low',
      requiredSteps: ['identify-missing-skills', 'build-skill-descriptors', 'register-skills'],
      potentialChallenges: ['provider-specific-nuances'],
      recommendedApproach: 'Use provider templates for rapid skill synthesis.',
      additionalInfo: { task },
    };
  }

  protected async execute(_analysis: TaskAnalysis, task: Task): Promise<SkillDescriptor[]> {
    const provider = (task.context as any)?.llmProvider || 'gemini';
    const missingSkills: string[] = (task.context as any)?.missingSkills || [];
    const created: SkillDescriptor[] = [];

    for (const skillName of missingSkills) {
      const description = `Auto-generated skill for ${skillName} used in task: ${task.title}`;
      const skill = await this.createSkillForProvider(skillName, description, provider);
      created.push(skill);
    }

    return created;
  }

  protected async validate(result: SkillDescriptor[]): Promise<ValidationResult> {
    return { isValid: Array.isArray(result), reason: result.length === 0 ? 'No skills created' : undefined };
  }
}
