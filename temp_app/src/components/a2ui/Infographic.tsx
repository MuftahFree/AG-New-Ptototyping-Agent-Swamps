import { motion } from 'framer-motion';
import '../../styles/claymation.css';

interface InfoBlock {
  icon?: string;
  label: string;
  value: string | number;
  description?: string;
}

interface InfographicProps {
  title: string;
  blocks: InfoBlock[];
}

export function Infographic({ title, blocks }: InfographicProps) {
  return (
    <motion.div className="clay-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h3 style={{ color: '#00e5ff', fontWeight: 700, marginBottom: '1rem', textShadow: '0 0 10px rgba(0,229,255,0.5)' }}>{title}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
        {blocks.map((b, i) => (
          <motion.div
            key={i}
            className="clay-surface"
            style={{ padding: '0.75rem', textAlign: 'center' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.05 }}
          >
            {b.icon && <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{b.icon}</div>}
            <div style={{ color: '#7c4dff', fontWeight: 700, fontSize: '1.1rem' }}>{b.value}</div>
            <div style={{ color: '#ccc', fontSize: '0.75rem', fontWeight: 600 }}>{b.label}</div>
            {b.description && <div style={{ color: '#777', fontSize: '0.65rem', marginTop: 4 }}>{b.description}</div>}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
