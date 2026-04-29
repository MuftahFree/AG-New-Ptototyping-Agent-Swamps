import { motion } from 'framer-motion';
import '../../styles/claymation.css';

interface HeatmapProps {
  data: number[][];
  labels?: string[];
  title?: string;
}

function getColor(v: number, max: number): string {
  const t = v / max;
  const r = Math.round(124 + t * 131);
  const g = Math.round(77 - t * 77);
  const b = Math.round(255 - t * 100);
  return `rgba(${r},${g},${b},${0.3 + t * 0.7})`;
}

export function Heatmap({ data, labels, title }: HeatmapProps) {
  const max = Math.max(...data.flat(), 1);
  return (
    <motion.div className="clay-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {title && <p style={{ color: '#ccc', marginBottom: 8, fontWeight: 600 }}>{title}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${data[0]?.length || 1}, 1fr)`, gap: 3 }}>
        {data.flat().map((v, i) => (
          <motion.div
            key={i}
            style={{
              background: getColor(v, max),
              borderRadius: 6,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.65rem',
              color: 'rgba(255,255,255,0.7)',
            }}
            whileHover={{ scale: 1.1 }}
            title={labels?.[i] || String(v)}
          >
            {v}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
