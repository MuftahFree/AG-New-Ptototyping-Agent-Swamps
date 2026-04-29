import { Suspense, lazy } from 'react';
import { Badge, Button, Card, CardHeader, ProgressBar, Text, Title1, Title2, Title3 } from '@fluentui/react-components';
import { motion } from 'framer-motion';
import { A2UIRenderer } from './components/a2ui/A2UIRenderer';
import './App.css';
import './styles/claymation.css';

const ClaySwampScene = lazy(() => import('./components/three/ClaySwampScene').then(m => ({ default: m.ClaySwampScene })));

const SWAMP_EXPANSION_READINESS = 0.86;

const modelProviders = [
  'OpenAI', 'Gemini', 'Anthropic', 'Ollama', 'Azure OpenAI', 'Groq', 'Mistral', 'custom OpenAPI providers',
];
const providerList = `${modelProviders.slice(0, -1).join(', ')}, and ${modelProviders[modelProviders.length - 1]}`;

const agentHighlights = [
  'Voice Agent', 'Mobile Lead Developer', 'Agent Architecture Lead', 'Agent Skill Builder',
  'Database Developer', 'Data Architect', 'Data Scientist', 'Data Engineer', 'Data Analyst',
  'Document Automation Agent', 'Image Generation Agent', 'Video Classification Agent',
  'Cellphone Assistant', 'Pitch Deck Agent', 'Hermes Integration Agent', 'OpenClaw Connector Agent',
];

const skillPillars = [
  { title: 'Multimodal creation', items: ['Image Generation', 'Text-to-speech (TTS)', 'Speech-to-text (STT)', 'Video Classification', 'Audio Summarization', 'Creative Review'] },
  { title: 'Documents & business assets', items: ['PDF', 'PPTX', 'DOCX', 'XLSX', 'pitch decks', 'reports', 'RFP responses'] },
  { title: 'Engineering delivery', items: ['mobile apps', 'database development', 'data architecture', 'QA automation', 'DevOps', 'security'] },
  { title: 'User control', items: ['Bring Your Own Key (BYOK) OpenAI', 'BYOK Gemini', 'Ollama/local models', 'model routing', 'budget caps', 'audit logs'] },
];

const recommendations = [
  'Add a guided agent marketplace so users can activate Voice, Mobile, Data, Document, and Hermes agents by use case.',
  'Expose settings for BYOK model providers, fallback order, token budgets, and per-agent model preferences.',
  'Design a mobile-first Swamp companion with voice commands, notifications, task approvals, and cellphone assistant flows.',
  'Support both Hermes and OpenClaw orchestration connectors so users can choose the agent runtime that fits their stack.',
];

const CONNECTIONS = [
  { from: 'dev', to: 'qa', active: true },
  { from: 'qa', to: 'pm', active: false },
  { from: 'pm', to: 'dev', active: false },
  { from: 'dev', to: 'skill', active: true },
];

function App() {
  return (
    <main className="app-shell">
      {/* === Hero === */}
      <section className="hero-grid">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="panel hero-panel clay-card">
            <CardHeader
              header={<Title1>Agent Swamps Command Dashboard</Title1>}
              description={
                <Text>
                  Premium Fluent UI command center for a massive, multimodal AI software house: voice, mobile,
                  documents, data, media, Bring Your Own Key (BYOK) model settings, Hermes, and OpenClaw.
                </Text>
              }
            />
            <div className="status-row">
              <Badge appearance="filled" color="brand">Frontend: Fluent UI 2 + Claymation 3D</Badge>
              <Badge appearance="filled" color="success">Backend: Node.js + A2A Protocol</Badge>
              <Badge appearance="filled" color="important">Prompt Improvisation Layer</Badge>
            </div>
            <div className="workflow-row">
              <Text>Swamp expansion readiness</Text>
              <ProgressBar value={SWAMP_EXPANSION_READINESS} thickness="large" />
            </div>
            <div className="actions-row">
              <Button appearance="primary" className="clay-button">Open Neural Link</Button>
              <Button appearance="secondary">Configure BYOK Models</Button>
              <Button appearance="secondary">Explore Agent Marketplace</Button>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Card className="panel settings-panel">
            <CardHeader
              header={<Title2>Suggested User Settings</Title2>}
              description={<Text>Give users direct control over model providers, orchestration runtimes, and personal assistants.</Text>}
            />
            <div className="settings-list">
              <div><Text weight="semibold">Model keys</Text><Text>{providerList}.</Text></div>
              <div><Text weight="semibold">Runtime connectors</Text><Text>Hermes agent runtime, OpenClaw orchestration, MCP tools, webhooks, queues, and enterprise APIs.</Text></div>
              <div><Text weight="semibold">Mobile companion</Text><Text>Voice commands, speech-to-text/text-to-speech workflows, task approvals, push notifications, and cellphone assistant workflows.</Text></div>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* === Claymation 3D Swamp === */}
      <section style={{ marginBottom: '2rem' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}>
          <Title2 style={{ marginBottom: '0.75rem', display: 'block' }}>🌊 The Swamp — Live Agent View</Title2>
          <Suspense fallback={<div className="clay-card" style={{ height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>Loading 3D scene…</div>}>
            <ClaySwampScene connections={CONNECTIONS} />
          </Suspense>
        </motion.div>
      </section>

      {/* === A2UI Live Dashboard === */}
      <section style={{ marginBottom: '2rem' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}>
          <Title2 style={{ marginBottom: '0.75rem', display: 'block' }}>⚡ A2UI Live Dashboard</Title2>
          <A2UIRenderer />
        </motion.div>
      </section>

      {/* === Agent Universe === */}
      <section className="catalog-section">
        <Title2>Expanded Agent Universe</Title2>
        <Text>Core agents to add next so the Swamp can cover product, engineering, data, media, growth, and operations.</Text>
        <div className="agent-grid">
          {agentHighlights.map(agent => (
            <Badge key={agent} appearance="tint" color="brand" size="large">{agent}</Badge>
          ))}
        </div>
      </section>

      {/* === Skill Pillars === */}
      <section className="pillar-grid">
        {skillPillars.map(pillar => (
          <Card key={pillar.title} className="pillar-card clay-surface">
            <CardHeader header={<Title3>{pillar.title}</Title3>} />
            <div className="chip-row">
              {pillar.items.map(item => <span className="skill-chip" key={item}>{item}</span>)}
            </div>
          </Card>
        ))}
      </section>

      {/* === Recommendations === */}
      <section className="recommendations-panel">
        <Title2>Landing Page Recommendations</Title2>
        <div className="recommendation-list">
          {recommendations.map(item => (
            <Card key={item} className="recommendation-card clay-surface">
              <Text>{item}</Text>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
