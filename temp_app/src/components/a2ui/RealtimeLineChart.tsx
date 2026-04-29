import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import '../../styles/claymation.css';

interface DataPoint {
  time: string;
  value: number;
}

interface RealtimeLineChartProps {
  data: DataPoint[];
  title?: string;
  color?: string;
}

export function RealtimeLineChart({ data, title, color = '#7c4dff' }: RealtimeLineChartProps) {
  return (
    <motion.div
      className="clay-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ padding: '1rem' }}
    >
      {title && <p style={{ color: '#ccc', marginBottom: 8, fontWeight: 600 }}>{title}</p>}
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="time" tick={{ fill: '#777', fontSize: 11 }} />
          <YAxis tick={{ fill: '#777', fontSize: 11 }} />
          <Tooltip
            contentStyle={{ background: '#1a1b30', border: `1px solid ${color}`, borderRadius: 8 }}
            labelStyle={{ color: '#ccc' }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: color, filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
