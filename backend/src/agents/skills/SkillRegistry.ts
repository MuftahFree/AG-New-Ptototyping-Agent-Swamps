import { v4 as uuidv4 } from 'uuid';

export interface SkillDescriptor {
  id: string;
  name: string;
  description: string;
  llmProvider: string;
  providerSpecificPromptTemplate: string;
  inputSchema: Record<string, unknown>;
  outputSchema: Record<string, unknown>;
  tools: string[];
  evaluationCriteria: string;
  version: string;
}

export class SkillRegistry {
  private static instance: SkillRegistry;
  private skills: Map<string, SkillDescriptor> = new Map();

  private constructor() {}

  static getInstance(): SkillRegistry {
    if (!SkillRegistry.instance) {
      SkillRegistry.instance = new SkillRegistry();
    }
    return SkillRegistry.instance;
  }

  register(skill: Omit<SkillDescriptor, 'id'>): SkillDescriptor {
    const descriptor: SkillDescriptor = { ...skill, id: uuidv4() };
    this.skills.set(descriptor.id, descriptor);
    return descriptor;
  }

  findByName(name: string): SkillDescriptor | undefined {
    return Array.from(this.skills.values()).find(s => s.name.toLowerCase() === name.toLowerCase());
  }

  hasSkill(name: string): boolean {
    return !!this.findByName(name);
  }

  getAll(): SkillDescriptor[] {
    return Array.from(this.skills.values());
  }

  getById(id: string): SkillDescriptor | undefined {
    return this.skills.get(id);
  }
}
