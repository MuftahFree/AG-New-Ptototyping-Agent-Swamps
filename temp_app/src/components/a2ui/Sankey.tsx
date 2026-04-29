import { motion } from 'framer-motion';
import '../../styles/claymation.css';

interface SankeyNode { id: string; label: string; }
interface SankeyLink { source: string; target: string; value: number; }
interface SankeyProps { nodes: SankeyNode[]; links: SankeyLink[]; title?: string; }

export function Sankey({ nodes, links, title }: SankeyProps) {
  const maxValue = Math.max(...links.map(l => l.value), 1);
  return (
    <motion.div className="clay-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {title && <p style={{ color: '#ccc', marginBottom: 8, fontWeight: 600 }}>{title}</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {links.map((link, i) => {
          const width = `${(link.value / maxValue) * 100}%`;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 80, fontSize: '0.7rem', color: '#aaa', textAlign: 'right' }}>{link.source}</span>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden', height: 16 }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  style={{ height: '100%', background: `linear-gradient(90deg, #7c4dff, #00e5ff)`, borderRadius: 4 }}
                />
              </div>
              <span style={{ width: 80, fontSize: '0.7rem', color: '#aaa' }}>{link.target}</span>
              <span style={{ width: 32, fontSize: '0.7rem', color: '#7c4dff', textAlign: 'right' }}>{link.value}</span>
            </div>
          );
        })}
        {!links.length && (
          <p style={{ color: '#666', fontSize: '0.8rem', textAlign: 'center' }}>No flow data</p>
        )}
        <div style={{ display: 'none' }}>{nodes.map(n => n.id).join(',')}</div>
      </div>
    </motion.div>
  );
}
