import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import '../../styles/claymation.css';

interface DataPoint {
  time: string;
  value: number;
}

interface RealtimeAreaChartProps {
  data: DataPoint[];
  title?: string;
  color?: string;
}

export function RealtimeAreaChart({ data, title, color = '#00e5ff' }: RealtimeAreaChartProps) {
  return (
    <motion.div
      className="clay-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ padding: '1rem' }}
    >
      {title && <p style={{ color: '#ccc', marginBottom: 8, fontWeight: 600 }}>{title}</p>}
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="time" tick={{ fill: '#777', fontSize: 11 }} />
          <YAxis tick={{ fill: '#777', fontSize: 11 }} />
          <Tooltip contentStyle={{ background: '#1a1b30', border: `1px solid ${color}`, borderRadius: 8 }} />
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill="url(#areaGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
