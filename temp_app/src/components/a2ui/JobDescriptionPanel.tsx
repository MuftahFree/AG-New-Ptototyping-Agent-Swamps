import { motion } from 'framer-motion';
import { SkillBadge } from './SkillBadge';
import '../../styles/claymation.css';

interface JobDescription {
  role: string;
  seniority: string;
  mission: string;
  responsibilities: string[];
  requiredSkills: string[];
  niceToHaveSkills: string[];
  kpis: string[];
  deliverables: string[];
}

interface JobDescriptionPanelProps {
  taskId?: string;
  jobDescription: JobDescription;
}

export function JobDescriptionPanel({ taskId, jobDescription: jd }: JobDescriptionPanelProps) {
  return (
    <motion.div
      className="clay-card"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      style={{ maxWidth: 500 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 className="clay-neon-text-purple" style={{ fontSize: '1rem', fontWeight: 700 }}>
          📋 Job Description
        </h3>
        {taskId && <span className="clay-badge">Task #{taskId.slice(0, 8)}</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <div style={{ padding: '0.5rem', background: 'rgba(124,77,255,0.08)', borderRadius: 10 }}>
          <p style={{ color: '#aaa', fontSize: '0.65rem' }}>ROLE</p>
          <p style={{ color: '#e0e0e0', fontWeight: 600, fontSize: '0.85rem' }}>{jd.role}</p>
        </div>
        <div style={{ padding: '0.5rem', background: 'rgba(0,229,255,0.08)', borderRadius: 10 }}>
          <p style={{ color: '#aaa', fontSize: '0.65rem' }}>SENIORITY</p>
          <p style={{ color: '#00e5ff', fontWeight: 600, fontSize: '0.85rem' }}>{jd.seniority}</p>
        </div>
      </div>

      <p style={{ color: '#ccc', fontSize: '0.8rem', marginBottom: '0.75rem', lineHeight: 1.5 }}>{jd.mission}</p>

      <Section title="Responsibilities" items={jd.responsibilities} color="#7c4dff" />
      <div style={{ marginBottom: '0.75rem' }}>
        <p style={{ color: '#aaa', fontSize: '0.7rem', fontWeight: 700, marginBottom: 4 }}>REQUIRED SKILLS</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {jd.requiredSkills.map(s => <SkillBadge key={s} name={s} />)}
        </div>
      </div>
      <Section title="KPIs" items={jd.kpis} color="#00e5ff" />
      <Section title="Deliverables" items={jd.deliverables} color="#4caf50" />
    </motion.div>
  );
}

function Section({ title, items, color }: { title: string; items: string[]; color: string }) {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <p style={{ color: '#aaa', fontSize: '0.7rem', fontWeight: 700, marginBottom: 4 }}>{title.toUpperCase()}</p>
      <ul style={{ margin: 0, paddingLeft: '1rem' }}>
        {items.map((item, i) => (
          <li key={i} style={{ color: '#ccc', fontSize: '0.75rem', lineHeight: 1.6 }}>
            <span style={{ color }}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
