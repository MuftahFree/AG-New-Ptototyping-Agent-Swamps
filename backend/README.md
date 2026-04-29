# Agent Swamps - Backend

End-to-end multi-agent orchestration system with open model integration.

## Features

- **Multi-Agent System**: Specialized agents for different tasks (Developer, QA, Product Manager, etc.)
- **Intelligent Orchestration**: Smart agent selection based on capabilities, performance, and workload
- **Open Model Integration**: Support for Google Gemini, OpenAI, and other AI providers
- **Real-time Updates**: WebSocket support for live system monitoring
- **REST API**: Complete API for task and agent management
- **Behavior-based Selection**: Agents are selected based on historical performance and specialization
- **Prompt Improvisation Layer (PIL)**: Auto-generates Job Descriptions and System Instructions for every task; creates missing skills on-the-fly via `SkillCreatorAgent`
- **A2A Protocol**: Typed, HMAC-signed Agent-to-Agent messaging bus with capability discovery
- **A2UI API**: Backend → UI directive stream exposing live task/agent/skill events to the frontend

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and add your API keys:

```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Run Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
npm start
```

## Architecture

### Core Components

1. **Orchestrator**: Central coordinator managing agents and tasks
2. **Agent Registry**: Maintains pool of available agents
3. **Agent Selector**: Intelligently selects best agent for each task
4. **Task Queue**: Priority-based task management
5. **Model Router**: Manages multiple AI model providers with fallback
6. **Prompt Improvisation Layer**: Intercepts every task to synthesise a JD, System Instruction, and any missing skills
7. **A2A Bus**: In-process pub/sub bus for typed, signed agent-to-agent messages
8. **A2UI API**: REST + WebSocket surface for frontend directive consumption

### Agent Types

- **Developer Agent**: Code generation, review, refactoring
- **QA Agent**: Test creation, quality assurance
- **Product Manager Agent**: Requirements analysis, planning
- **SEO Agent**: SEO optimisation and keyword research
- **Lead Generation Agent**: Prospect research and outreach
- **AI/ML Agent**: Machine learning experiments and pipelines
- **Mentor Agent**: Learning, coaching, and knowledge sharing
- **Skill Creator Agent**: Synthesises new agent skills using the AGENT SKILLS STANDARD (ASS)

---

## Prompt Improvisation Layer (PIL)

When a task is submitted, the PIL runs **before** agent selection and does two things:

### 1. Job Description Synthesis

Generates a structured JD for the agent-to-be-hired:

```typescript
{
  role: "Software Engineer",
  seniority: "Senior",
  mission: "...",
  responsibilities: [...],
  requiredSkills: [...],   // checked against SkillRegistry
  niceToHaveSkills: [...],
  kpis: [...],
  deliverables: [...]
}
```

If any `requiredSkills` entry is absent from `SkillRegistry`, the `SkillCreatorAgent` is invoked to synthesise it using the provider-specific template (Gemini, Claude, MiniMax, Grok, GLM).

### 2. System Instruction Synthesis

Produces a detailed System Instruction injected into the agent's context:

```typescript
{
  purpose: "You are a Senior Software Engineer hired to...",
  boundaries: ["Do not access external systems...", ...],
  scope: ["Task type: CODE_GENERATION", ...],
  goals: ["Achieve: task-completion-rate", ...],
  outputContract: { type: "object", required: ["result", "confidence", ...] }
}
```

### Events Emitted

| Event | Payload |
|-------|---------|
| `prompt:improvised` | Full `ImprovisationResult` |
| `jobdescription:generated` | `{ taskId, jobDescription }` |
| `skill:created` | `{ taskId, skill: SkillDescriptor }` |
| `system_instruction:generated` | `{ taskId, systemInstruction }` |

---

## A2A Protocol

Located under `src/protocols/a2a/`.

### Message Envelope

```typescript
{
  id: string;
  conversationId: string;
  fromAgentId: string;
  toAgentId: string | 'BROADCAST';
  intent: 'REQUEST' | 'RESPONSE' | 'DELEGATE' | 'NEGOTIATE' | 'BROADCAST' | 'HANDOFF' | 'STATUS_UPDATE' | 'CANCEL';
  payload: Record<string, unknown>;
  signature: string;          // HMAC-SHA256
  timestamp: number;
  capabilities: string[];
  traceId: string;
}
```

### A2ABus Usage

```typescript
import { A2ABus } from './src/protocols/a2a/A2ABus.js';

const bus = A2ABus.getInstance();

// Publish agent capabilities
bus.publishCapabilities({ agentId, agentName, capabilities: ['code-generation'] });

// Send a message
const envelope = bus.send({
  conversationId: 'conv-1',
  fromAgentId: 'dev-agent',
  toAgentId: 'qa-agent',
  intent: 'HANDOFF',
  payload: { artifact: '...' },
  capabilities: ['code-generation'],
});

// Subscribe
bus.onMessage((envelope) => { /* react */ });
```

### REST Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/a2a/conversations` | List all conversation IDs |
| GET | `/api/a2a/conversations/:id` | Get full message history for a conversation |
| GET | `/api/a2a/capabilities?capability=X` | Find agents with a given capability |

### WebSocket

Connect with `socket.io-client` and subscribe:

```javascript
const socket = io('http://localhost:3000');
socket.on('a2a:message', (envelope) => { /* live A2A messages */ });
socket.on('prompt:improvised', (result) => { /* PIL results */ });
socket.on('skill:created', (data) => { /* new skill created */ });
```

---

## API Usage

### Create a Task

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Create Hello World app",
    "description": "Create a simple Node.js Hello World application",
    "type": "CODE_GENERATION",
    "priority": "MEDIUM"
  }'
```

### Get Task Status

```bash
curl http://localhost:3000/api/tasks/{taskId}
```

### List All Agents

```bash
curl http://localhost:3000/api/agents
```

### Get System Statistics

```bash
curl http://localhost:3000/api/system/stats
```

## WebSocket Events

Connect to `ws://localhost:3000` and subscribe to events:

```javascript
const socket = io('http://localhost:3000');

// Subscribe to task updates
socket.emit('subscribe:tasks');
socket.on('task:created', (data) => console.log(data));
socket.on('task:updated', (data) => console.log(data));

// Subscribe to agent updates
socket.emit('subscribe:agents');
socket.on('agent:updated', (data) => console.log(data));
```

## Agent Selection Algorithm

Agents are scored based on:

- **Specialization Match (35%)**: How well agent's skills match the task
- **Historical Success (25%)**: Success rate on similar tasks
- **Availability (20%)**: Current workload vs capacity
- **Recent Performance (15%)**: Recent success rate
- **Load Balance (5%)**: Distribution across agents

## Development

### Project Structure

```
backend/
├── src/
│   ├── agents/                     # Agent implementations
│   │   ├── Agent.ts                # Base agent class
│   │   ├── DeveloperAgent.ts
│   │   ├── QAAgent.ts
│   │   ├── ProductManagerAgent.ts
│   │   ├── SkillCreatorAgent.ts    # NEW: synthesises agent skills
│   │   └── skills/
│   │       ├── SkillRegistry.ts    # NEW: singleton skill store
│   │       └── providers/          # NEW: per-LLM skill templates
│   │           ├── GeminiSkillTemplate.ts
│   │           ├── ClaudeSkillTemplate.ts
│   │           ├── MiniMaxSkillTemplate.ts
│   │           ├── GrokSkillTemplate.ts
│   │           └── GLMSkillTemplate.ts
│   ├── orchestration/              # Orchestration components
│   │   ├── Orchestrator.ts         # Main orchestrator (integrates PIL)
│   │   ├── AgentRegistry.ts
│   │   ├── AgentSelector.ts
│   │   ├── TaskQueue.ts
│   │   └── promptImprovisation/    # NEW: Prompt Improvisation Layer
│   │       └── PromptImprovisationLayer.ts
│   ├── protocols/                  # NEW: Agent-to-Agent protocol
│   │   └── a2a/
│   │       ├── types.ts
│   │       ├── signatures.ts
│   │       ├── A2ABus.ts
│   │       └── index.ts
│   ├── models/                     # AI model integration
│   │   ├── ModelProvider.ts
│   │   ├── GeminiProvider.ts
│   │   └── ModelRouter.ts
│   ├── api/                        # API layer
│   │   ├── APIServer.ts
│   │   └── a2ui/                   # NEW: A2UI endpoints
│   │       └── A2UIRouter.ts
│   ├── shared/                     # Shared types
│   │   └── types.ts
│   └── index.ts                    # Entry point
├── tests/                          # Test files
│   ├── promptImprovisation/
│   │   └── PromptImprovisationLayer.test.ts
│   └── protocols/a2a/
│       └── A2ABus.test.ts
├── package.json
└── tsconfig.json
```

### Adding New Agents

1. Extend the `Agent` base class
2. Implement required abstract methods
3. Register in `index.ts`

Example:

```typescript
import { Agent } from './agents/Agent.js';

class CustomAgent extends Agent {
  protected async analyzeTask(task: Task): Promise<TaskAnalysis> {
    // Implementation
  }

  protected async execute(analysis: TaskAnalysis, task: Task): Promise<any> {
    // Implementation
  }

  protected async validate(result: any): Promise<ValidationResult> {
    // Implementation
  }
}
```

### Adding Model Providers

1. Implement `ModelProvider` interface
2. Register in `ModelRouter`

```typescript
import { ModelProvider } from './models/ModelProvider.js';

class CustomProvider implements ModelProvider {
  // Implementation
}

// Register
modelRouter.registerProvider('custom', new CustomProvider(config));
```

## Testing

```bash
npm test
```

## License

MIT
