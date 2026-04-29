import React, { useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '../../styles/claymation.css';

export interface DataPoint {
  /** Unix timestamp in milliseconds. */
  time: number;
  value: number;
}

interface RealtimeLineChartProps {
  data: DataPoint[];
  title?: string;
  color?: string;
}

/** Module-scope formatter reused for X-axis tick rendering. */
const tickFormatter = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

function formatTick(epochMs: number): string {
  return tickFormatter.format(new Date(epochMs));
}

function arePropsEqual(prev: RealtimeLineChartProps, next: RealtimeLineChartProps): boolean {
  if (prev.data.length !== next.data.length) return false;
  if (prev.color !== next.color || prev.title !== next.title) return false;
  const prevLast = prev.data[prev.data.length - 1];
  const nextLast = next.data[next.data.length - 1];
  if (!prevLast && !nextLast) return true;
  if (!prevLast || !nextLast) return false;
  return prevLast.time === nextLast.time && prevLast.value === nextLast.value;
}

export const RealtimeLineChart = React.memo(function RealtimeLineChart({
  data,
  title,
  color = '#7c4dff',
}: RealtimeLineChartProps) {
  const mounted = useRef(false);
  if (!mounted.current) mounted.current = true;

  return (
    <div className="clay-card" style={{ padding: '1rem' }}>
      {title && <p style={{ color: '#ccc', marginBottom: 8, fontWeight: 600 }}>{title}</p>}
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="time"
            type="number"
            domain={['dataMin', 'dataMax']}
            tickFormatter={formatTick}
            tick={{ fill: '#777', fontSize: 11 }}
            interval="preserveStartEnd"
            minTickGap={30}
          />
          <YAxis tick={{ fill: '#777', fontSize: 11 }} />
          <Tooltip
            contentStyle={{ background: '#1a1b30', border: `1px solid ${color}`, borderRadius: 8 }}
            labelStyle={{ color: '#ccc' }}
            labelFormatter={(label: unknown) => typeof label === 'number' ? formatTick(label) : String(label)}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: color, filter: `drop-shadow(0 0 6px ${color})` }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}, arePropsEqual);
