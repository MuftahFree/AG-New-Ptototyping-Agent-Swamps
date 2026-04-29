import { motion } from 'framer-motion';
import '../../styles/claymation.css';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'flat';
  color?: 'purple' | 'cyan' | 'pink';
}

const trendIcon = { up: '▲', down: '▼', flat: '━' };
const trendColor = { up: '#00e5ff', down: '#ff6b6b', flat: '#aaa' };
const glowColors = {
  purple: '124, 77, 255',
  cyan: '0, 229, 255',
  pink: '255, 107, 107',
};

export function MetricCard({ label, value, unit, trend = 'flat', color = 'purple' }: MetricCardProps) {
  const glow = glowColors[color];
  return (
    <motion.div
      className="clay-card clay-glow"
      style={{ minWidth: 160, textAlign: 'center' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.04 }}
    >
      <p style={{ fontSize: '0.75rem', color: '#aaa', marginBottom: 4 }}>{label}</p>
      <motion.div
        key={String(value)}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          fontSize: '2rem',
          fontWeight: 700,
          color: `rgb(${glow})`,
          textShadow: `0 0 16px rgba(${glow}, 0.7)`,
          lineHeight: 1,
        }}
      >
        {value}
        {unit && <span style={{ fontSize: '1rem', marginLeft: 4 }}>{unit}</span>}
      </motion.div>
      {trend !== 'flat' && (
        <p style={{ color: trendColor[trend], fontSize: '0.8rem', marginTop: 4 }}>
          {trendIcon[trend]} {trend}
        </p>
      )}
    </motion.div>
  );
}
