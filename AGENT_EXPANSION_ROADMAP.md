# Agent Expansion Roadmap

This roadmap expands Agent Swamps into a broad, multimodal agentic software house. It captures the missing agents, skills, user settings, mobile companion ideas, and orchestration integrations requested for the next major planning cycle.

## Vision

Agent Swamps should become an extensible agent operating system where users can assemble specialized teams for engineering, data, media, business operations, growth, personal productivity, and mobile-first workflows. The system should support OpenClaw, Hermes, local models, hosted models, and bring-your-own-key (BYOK) provider settings.

## Expanded Agent Catalog

| Agent | Primary value | Example skills |
| --- | --- | --- |
| Voice Agent | Voice-first interaction and media workflows | Text-to-speech (TTS), speech-to-text (STT), voice cloning policy checks, call summarization, meeting notes, multilingual voice UX |
| Mobile Lead Developer Agent | Owns iOS, Android, React Native, Flutter, and mobile release quality | mobile architecture, offline sync, app store readiness, push notifications, device permissions |
| Agent Architecture Agent | Designs swarm topologies, agent contracts, and orchestration boundaries | agent protocols, memory design, model routing, tool permissions, observability, failure recovery |
| Agent Skill Builder | Creates and evaluates new agent skills | curriculum design, prompt packs, skill tests, feedback loops, reinforcement learning datasets |
| Image Generation Agent | Produces visual assets for product and marketing | image generation, prompt engineering, brand consistency, image QA, visual variants |
| Document Creation Agent | Generates structured business documents | PDF, PPTX, DOCX, XLSX, templates, formatting, citations, document QA |
| Pitch Deck Agent | Builds investor, sales, and product pitch decks | story arcs, TAM/SAM/SOM, competitive slides, financial model summaries, speaker notes |
| Video Classification Agent | Understands video content and safety | scene classification, object labels, transcript alignment, highlight detection, policy review |
| Cellphone Assistant Agent | Helps users operate the Swamp from a phone | voice commands, reminders, approvals, SMS-style updates, mobile task triage |
| Database Developer Agent | Builds schemas, migrations, and data access layers | SQL, PostgreSQL, indexing, migrations, query tuning, backup planning |
| Data Architecture Agent | Designs data platforms and governance | lakehouse design, lineage, contracts, warehousing, master data, privacy zones |
| Data Scientist Agent | Converts data into models and experiments | notebooks, feature engineering, forecasting, classification, evaluation metrics |
| Data Engineer Agent | Builds pipelines and reliable data movement | ETL/ELT, streaming, Airflow/Dagster, Spark, quality checks, CDC |
| Data Analyst Agent | Creates reporting and decision support | dashboards, SQL analysis, KPI definitions, cohort analysis, executive summaries |
| Analytics Engineer Agent | Owns metric layers and semantic models | dbt, dimensional modeling, metric contracts, BI-ready datasets |
| Security Agent | Protects code, data, and infrastructure | threat modeling, secrets review, SAST/DAST triage, IAM, OWASP checks |
| Compliance Agent | Maps delivery to policy and regulation | audit trails, SOC2 evidence, GDPR/PII handling, retention policies |
| DevOps/SRE Agent | Runs production delivery and reliability | CI/CD, IaC, incident response, observability, autoscaling, rollback plans |
| Cloud Architect Agent | Designs AWS/Azure/GCP infrastructure | landing zones, networking, Cloud Run, Kubernetes, cost optimization |
| API Integration Agent | Connects external systems | OpenAPI, OAuth, webhooks, retries, pagination, contract testing |
| MCP Tooling Agent | Maintains MCP-compatible tool access | tool registry, permission scopes, tool health checks, audit logs |
| Hermes Integration Agent | Adds Hermes agent runtime compatibility | Hermes adapters, handoff policies, runtime routing, capability discovery |
| OpenClaw Connector Agent | Maintains OpenClaw orchestration compatibility | OpenClaw connectors, workflow translation, runtime diagnostics |
| Knowledge Graph Agent | Organizes domain knowledge | entity extraction, graph schema, retrieval, relationship reasoning |
| Memory Steward Agent | Manages long-term agent memory safely | memory retention, summarization, deletion policies, privacy controls |
| UX Research Agent | Converts user insights into product direction | interviews, personas, journey maps, usability findings |
| UI Designer Agent | Creates visual systems and screens | design systems, accessibility, wireframes, responsive layouts |
| Prompt Engineer Agent | Improves prompts and evaluations | prompt libraries, eval sets, red teaming, prompt versioning |
| Financial Analyst Agent | Supports finance and business modeling | forecasts, pricing, unit economics, budgets, variance analysis |
| Legal Ops Agent | Drafts and reviews operational legal material | contract summaries, clause comparison, risk flags, approval workflows |
| Customer Support Agent | Handles support knowledge and triage | ticket classification, reply drafts, escalation, sentiment analysis |
| Sales Agent | Supports outbound and sales enablement | account research, outreach, objection handling, CRM notes |
| Marketing Agent | Runs growth campaigns | content calendar, campaign copy, segmentation, conversion optimization |
| Localization Agent | Adapts products and assets globally | translation, locale QA, cultural review, multilingual SEO |
| Accessibility Agent | Ensures inclusive products | WCAG review, screen reader notes, contrast checks, keyboard flows |
| QA Automation Agent | Builds automated tests | unit, integration, E2E, visual regression, mobile test matrices |
| Release Manager Agent | Coordinates launches | release notes, deployment checklist, go/no-go, rollback coordination |

## Skill Domains to Add

### Multimodal AI
- Text-to-speech (TTS)
- Speech-to-text (STT)
- Voice command handling
- Image generation and visual variation
- Image classification and brand review
- Video classification and scene detection
- Audio/video summarization
- OCR and document extraction
- Multilingual translation and localization

### Document and Office Automation
- PDF generation and extraction
- PPTX pitch decks and executive decks
- DOCX reports, proposals, RFP responses, SOPs, and policies
- XLSX financial models, KPI trackers, import/export templates, and forecasting sheets
- Versioned templates and approval workflows
- Citation, source tracking, and document QA

### Engineering and Delivery
- Web, mobile, backend, database, infrastructure, and QA delivery
- React, Fluent UI, TypeScript, Node.js, .NET, Python, mobile app frameworks
- API contracts, schema design, migrations, caching, queues, and event systems
- CI/CD, Cloud Run, Docker, Kubernetes, observability, and rollback readiness

### Data and Intelligence
- Data architecture and governance
- Data engineering pipelines
- Analytics engineering and semantic layers
- Data science experiments and model evaluation
- MLOps, model registries, drift detection, evaluation dashboards
- Knowledge graphs, embeddings, retrieval, and long-term memory controls

### Business and Growth
- SEO, lead generation, sales enablement, marketing automation
- Pitch decks, product launch plans, investor updates, financial analysis
- Customer support, success playbooks, onboarding flows, churn analysis
- Legal operations, compliance evidence, risk registers, procurement documents

## BYOK and Model Settings Roadmap

Add user settings that let teams bring their own model keys and decide how the Swamp routes work.

### Provider Settings
- OpenAI
- Azure OpenAI
- Google Gemini
- Anthropic
- Ollama/local models
- Mistral
- Groq
- OpenRouter-compatible APIs
- Custom OpenAPI-compatible model gateways

### Per-Agent Controls
- Preferred provider and model
- Fallback provider order
- Temperature, max tokens, context window, and streaming settings
- Cost caps per task, per workflow, and per billing period
- Data retention mode: no-retain, encrypted retain, or workspace memory
- Tool permission scopes per agent
- Audit log visibility

### Recommended UX
- Provider setup wizard with connection tests
- Secret validation without exposing key values
- Cost preview before running large workflows
- Model compatibility matrix by skill: text, image, audio, video, embeddings, coding, documents
- Safe default routing for sensitive tasks

## Landing Page and Product UX Suggestions

- Add an agent marketplace section grouped by Engineering, Data, Media, Business, Security, Growth, and Personal Assistant.
- Add a BYOK settings preview so users immediately understand they can use OpenAI, Gemini, Ollama, or other providers.
- Add a mobile companion section showing voice commands, task approvals, notifications, and cellphone assistant flows.
- Add a workflow gallery: Build App, Launch Product, Generate Pitch Deck, Create Data Platform, Produce Marketing Campaign, Review Security.
- Add Hermes + OpenClaw runtime badges to position Agent Swamps as orchestration-runtime-neutral.
- Add trust controls: audit logs, approvals, key isolation, model routing policy, and human-in-the-loop gates.
- Add document examples: PDF report, PPTX pitch deck, DOCX proposal, XLSX forecast.

## Mobile Swamp Roadmap

The mobile version should be more than a responsive page. It should act as a command companion.

- Voice-first task submission using STT
- TTS status summaries from active agents
- Push notifications for approvals, blockers, and completed workflows
- Quick approve/reject/reassign controls
- Agent health dashboard optimized for one-handed use
- Offline notes that sync into Neural Link
- Cellphone assistant mode for reminders, follow-ups, and executive summaries

## Hermes + OpenClaw Runtime Strategy

Agent Swamps should avoid being locked to one runtime.

- Keep the core agent contract runtime-neutral.
- Build adapter layers for Hermes and OpenClaw.
- Let users pick a runtime per workflow.
- Record runtime telemetry for success rate, latency, cost, and failure modes.
- Provide workflow import/export between Swamp canvas, BPMN, Hermes manifests, and OpenClaw flows.

## Priority Build Phases

### Phase 1: Catalog and UX Foundation
- Document agent taxonomy and skill matrix.
- Add landing page sections for BYOK, agent marketplace, mobile companion, and runtime connectors.
- Add settings data model for providers, keys, routing, and budgets.

### Phase 2: BYOK and Runtime Connectors
- Implement encrypted key storage.
- Add provider connection testing.
- Add OpenAI/Gemini/Ollama routing configuration.
- Add Hermes/OpenClaw adapter interfaces.

### Phase 3: Multimodal and Documents
- Add document generation pipeline for PDF, PPTX, DOCX, XLSX.
- Add voice agent with TTS/STT.
- Add image generation and video classification workflows.

### Phase 4: Data and Mobile
- Add database developer, data architecture, data scientist, data engineer, and data analyst agents.
- Add mobile companion app experience.
- Add push notifications and approval workflows.

### Phase 5: Enterprise Readiness
- Add compliance, security, audit, cost controls, team permissions, and policy governance.
- Add marketplace packaging for custom agents and skills.

## Success Metrics

- Number of active agent types available in catalog
- Skill coverage by modality and business domain
- BYOK setup completion rate
- Workflow completion rate
- Average cost per workflow
- Human approval latency
- Mobile task completion rate
- Document generation acceptance rate
- Agent skill improvement over time
