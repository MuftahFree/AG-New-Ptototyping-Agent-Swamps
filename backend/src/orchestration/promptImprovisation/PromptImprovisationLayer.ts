import { EventEmitter } from 'events';
import { SkillRegistry } from '../../agents/skills/SkillRegistry.js';
import { SkillCreatorAgent } from '../../agents/SkillCreatorAgent.js';
import type { ModelRouter } from '../../models/ModelRouter.js';
import type { Task } from '../../shared/types.js';

export interface JobDescription {
  role: string;
  seniority: string;
  mission: string;
  responsibilities: string[];
  requiredSkills: string[];
  niceToHaveSkills: string[];
  kpis: string[];
  deliverables: string[];
}

export interface SystemInstruction {
  purpose: string;
  boundaries: string[];
  scope: string[];
  goals: string[];
  outputContract: Record<string, unknown>;
}

export interface ImprovisationResult {
  taskId: string;
  jobDescription: JobDescription;
  systemInstruction: SystemInstruction;
  newSkillsCreated: string[];
}

export class PromptImprovisationLayer {
  private events: EventEmitter;
  private skillRegistry: SkillRegistry;
  private skillCreatorAgent: SkillCreatorAgent;

  constructor(modelRouter: ModelRouter, events: EventEmitter) {
    this.events = events;
    this.skillRegistry = SkillRegistry.getInstance();
    this.skillCreatorAgent = new SkillCreatorAgent(modelRouter);
  }

  async improvise(task: Task): Promise<ImprovisationResult> {
    // 1. Generate Job Description
    const jobDescription = this.synthesizeJobDescription(task);
    this.events.emit('jobdescription:generated', { taskId: task.id, jobDescription });

    // 2. Check for missing skills & create them
    const newSkillsCreated: string[] = [];
    for (const skill of jobDescription.requiredSkills) {
      if (!this.skillRegistry.hasSkill(skill)) {
        const provider = (task.context as any)?.llmProvider || 'gemini';
        const created = await this.skillCreatorAgent.createSkillForProvider(
          skill,
          `Required skill for task: ${task.title}`,
          provider
        );
        newSkillsCreated.push(created.name);
        this.events.emit('skill:created', { taskId: task.id, skill: created });
      }
    }

    // 3. Generate System Instruction
    const systemInstruction = this.synthesizeSystemInstruction(task, jobDescription);
    this.events.emit('system_instruction:generated', { taskId: task.id, systemInstruction });

    const result: ImprovisationResult = {
      taskId: task.id,
      jobDescription,
      systemInstruction,
      newSkillsCreated,
    };

    this.events.emit('prompt:improvised', result);

    // Inject into task context
    if (!task.context) task.context = { additionalData: {} };
    (task.context as any).jobDescription = jobDescription;
    (task.context as any).systemInstruction = systemInstruction;

    return result;
  }

  private synthesizeJobDescription(task: Task): JobDescription {
    const typeToRole: Record<string, string> = {
      CODE_GENERATION: 'Software Engineer',
      CODE_REVIEW: 'Senior Code Reviewer',
      TESTING: 'QA Engineer',
      DEPLOYMENT: 'DevOps Engineer',
      REQUIREMENTS_ANALYSIS: 'Business Analyst',
      DESIGN: 'UI/UX Designer',
      DOCUMENTATION: 'Technical Writer',
      RESEARCH: 'Research Analyst',
      SEO_OPTIMIZATION: 'SEO Specialist',
      LEAD_GENERATION: 'Growth Hacker',
      CONTENT_MARKETING: 'Content Strategist',
      GENERAL: 'Generalist Agent',
    };

    const role = typeToRole[task.type] || 'Generalist Agent';
    const requiredSkills = task.requiredCapabilities?.length
      ? task.requiredCapabilities
      : this.inferSkillsFromTask(task);

    return {
      role,
      seniority: 'Senior',
      mission: `Deliver high-quality output for: ${task.title}`,
      responsibilities: [
        `Analyse and execute: ${task.description.slice(0, 120)}`,
        'Ensure output meets defined quality criteria',
        'Communicate progress and blockers',
        'Document results in the agreed output format',
      ],
      requiredSkills,
      niceToHaveSkills: ['cross-domain knowledge', 'creative problem-solving'],
      kpis: ['task-completion-rate', 'output-quality-score', 'latency-ms'],
      deliverables: [`Completed ${task.type} artifact`, 'Validation report', 'Execution trace'],
    };
  }

  private synthesizeSystemInstruction(task: Task, jd: JobDescription): SystemInstruction {
    return {
      purpose: `You are a ${jd.role} agent hired to: ${jd.mission}`,
      boundaries: [
        'Do not access external systems unless explicitly authorized.',
        'Do not modify data outside the defined scope.',
        'Do not execute destructive operations without confirmation.',
        'Stay within the task description and do not deviate.',
      ],
      scope: [
        `Task type: ${task.type}`,
        `Priority: ${task.priority}`,
        `Description: ${task.description}`,
      ],
      goals: jd.kpis.map(k => `Achieve: ${k}`),
      outputContract: {
        type: 'object',
        required: ['result', 'confidence', 'executionTrace'],
        properties: {
          result: { type: 'string', description: 'The primary deliverable' },
          confidence: { type: 'number', minimum: 0, maximum: 1 },
          executionTrace: { type: 'array', items: { type: 'string' } },
        },
      },
    };
  }

  private inferSkillsFromTask(task: Task): string[] {
    const keywords = `${task.title} ${task.description}`.toLowerCase();
    const skillMap: Record<string, string[]> = {
      code: ['code-generation', 'debugging'],
      test: ['testing', 'qa-automation'],
      deploy: ['ci-cd', 'docker', 'kubernetes'],
      design: ['ui-design', 'ux-research'],
      seo: ['seo-optimization', 'keyword-research'],
      data: ['data-analysis', 'data-visualization'],
    };

    const skills: string[] = [];
    for (const [kw, kSkills] of Object.entries(skillMap)) {
      if (keywords.includes(kw)) skills.push(...kSkills);
    }
    return skills.length ? skills : ['general-task-execution'];
  }
}
