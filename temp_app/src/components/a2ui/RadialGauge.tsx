import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { motion } from 'framer-motion';
import '../../styles/claymation.css';

interface RadialGaugeProps {
  value: number;
  max?: number;
  label?: string;
  color?: string;
}

export function RadialGauge({ value, max = 100, label, color = '#7c4dff' }: RadialGaugeProps) {
  const pct = Math.round((value / max) * 100);
  const data = [{ value: pct }];

  return (
    <motion.div
      className="clay-card"
      style={{ textAlign: 'center', padding: '1rem' }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {label && <p style={{ color: '#aaa', fontSize: '0.75rem', marginBottom: 4 }}>{label}</p>}
      <div style={{ position: 'relative', height: 120 }}>
        <ResponsiveContainer width="100%" height={120}>
          <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={data} startAngle={225} endAngle={-45}>
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar background={{ fill: 'rgba(255,255,255,0.05)' }} dataKey="value" fill={color} angleAxisId={0} cornerRadius={8} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color, fontWeight: 700, fontSize: '1.4rem', textShadow: `0 0 12px ${color}` }}>
          {pct}%
        </div>
      </div>
    </motion.div>
  );
}
