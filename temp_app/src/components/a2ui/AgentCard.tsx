import { motion } from 'framer-motion';
import { SkillBadge } from './SkillBadge';
import '../../styles/claymation.css';

interface AgentCardProps {
  name: string;
  type: string;
  status?: 'idle' | 'thinking' | 'executing' | 'completed' | 'error';
  skills?: Array<{ name: string; provider?: string; version?: string }>;
  jobDescription?: { role: string; mission: string; };
  systemInstruction?: { purpose: string; };
}

const statusColors = {
  idle: '#aaa',
  thinking: '#00e5ff',
  executing: '#7c4dff',
  completed: '#4caf50',
  error: '#ff6b6b',
};
const statusEmoji = { idle: '😴', thinking: '🤔', executing: '⚡', completed: '✅', error: '❌' };

export function AgentCard({ name, type, status = 'idle', skills = [], jobDescription, systemInstruction }: AgentCardProps) {
  const sColor = statusColors[status];

  return (
    <motion.div
      className="clay-card clay-float"
      style={{ minWidth: 220, maxWidth: 280 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03 }}
    >
      {/* Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <motion.div
          className="clay-breathe"
          style={{
            width: 48, height: 48, borderRadius: '50%',
            background: `radial-gradient(circle at 35% 35%, ${sColor}88, ${sColor}22)`,
            border: `2px solid ${sColor}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem', boxShadow: `0 0 16px ${sColor}55`,
          }}
        >
          🤖
        </motion.div>
        <div>
          <p style={{ fontWeight: 700, color: '#e0e0e0', fontSize: '0.9rem' }}>{name}</p>
          <span className="clay-badge" style={{ fontSize: '0.65rem' }}>{type}</span>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: '1.1rem' }} title={status}>{statusEmoji[status]}</div>
      </div>

      {/* Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '0.75rem' }}>
        <motion.div
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ width: 8, height: 8, borderRadius: '50%', background: sColor, boxShadow: `0 0 6px ${sColor}` }}
        />
        <span style={{ color: sColor, fontSize: '0.75rem', fontWeight: 600 }}>{status.toUpperCase()}</span>
      </div>

      {/* JD */}
      {jobDescription && (
        <div style={{ marginBottom: '0.75rem', padding: '0.5rem', background: 'rgba(255,255,255,0.04)', borderRadius: 10 }}>
          <p style={{ color: '#7c4dff', fontSize: '0.7rem', fontWeight: 700 }}>ROLE: {jobDescription.role}</p>
          <p style={{ color: '#999', fontSize: '0.65rem' }}>{jobDescription.mission}</p>
        </div>
      )}

      {/* System instruction */}
      {systemInstruction && (
        <div style={{ marginBottom: '0.75rem', padding: '0.5rem', background: 'rgba(0,229,255,0.04)', borderRadius: 10 }}>
          <p style={{ color: '#00e5ff', fontSize: '0.7rem', fontWeight: 700 }}>MISSION</p>
          <p style={{ color: '#999', fontSize: '0.65rem' }}>{systemInstruction.purpose}</p>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {skills.map(s => <SkillBadge key={s.name} {...s} />)}
        </div>
      )}
    </motion.div>
  );
}
