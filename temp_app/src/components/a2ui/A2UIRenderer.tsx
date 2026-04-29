import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { A2UIService, type A2AMessageEvent, type ImprovisationEvent } from '../../services/A2UIService';
import { MetricCard } from './MetricCard';
import { RealtimeLineChart } from './RealtimeLineChart';
import { RadialGauge } from './RadialGauge';
import { JobDescriptionPanel } from './JobDescriptionPanel';
import { A2AConversationTimeline } from './A2AConversationTimeline';
import '../../styles/claymation.css';

interface A2UIRendererProps {
  serverUrl?: string;
}

export function A2UIRenderer({ serverUrl }: A2UIRendererProps) {
  const [connected, setConnected] = useState(false);
  const [a2aMessages, setA2AMessages] = useState<A2AMessageEvent[]>([]);
  const [metrics, setMetrics] = useState<Array<{ label: string; value: number; unit?: string }>>([
    { label: 'Tasks Completed', value: 0 },
    { label: 'Active Agents', value: 0 },
    { label: 'Skills Created', value: 0 },
  ]);
  const [lineData, setLineData] = useState<Array<{ time: string; value: number }>>([]);
  const [latestJD, setLatestJD] = useState<{ taskId: string; jd: unknown } | null>(null);

  const addTimePoint = useCallback(() => {
    setLineData(prev => {
      const now = new Date().toLocaleTimeString();
      const next = [...prev, { time: now, value: Math.floor(Math.random() * 40 + 10) }];
      return next.slice(-20);
    });
  }, []);

  useEffect(() => {
    A2UIService.connect(serverUrl || 'http://localhost:3000');

    const checkConnected = setInterval(() => {
      setConnected(A2UIService.isConnected());
    }, 1000);

    const unsubA2A = A2UIService.on<A2AMessageEvent>('a2a:message', (msg) => {
      setA2AMessages(prev => [msg, ...prev].slice(0, 50));
    });

    const unsubSkill = A2UIService.on<ImprovisationEvent>('skill:created', () => {
      setMetrics(prev => prev.map(m => m.label === 'Skills Created' ? { ...m, value: m.value + 1 } : m));
    });

    const unsubCompleted = A2UIService.on('task:completed', () => {
      setMetrics(prev => prev.map(m => m.label === 'Tasks Completed' ? { ...m, value: m.value + 1 } : m));
      addTimePoint();
    });

    const unsubJD = A2UIService.on<ImprovisationEvent>('jobdescription:generated', (data) => {
      if (data.taskId && data.jobDescription) {
        setLatestJD({ taskId: data.taskId, jd: data.jobDescription });
      }
    });

    // Simulate some initial data for visual feedback
    const sim = setInterval(addTimePoint, 3000);

    return () => {
      clearInterval(checkConnected);
      clearInterval(sim);
      unsubA2A();
      unsubSkill();
      unsubCompleted();
      unsubJD();
    };
  }, [serverUrl, addTimePoint]);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Connection status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
        <motion.div
          animate={{ opacity: connected ? [1, 0.4, 1] : 1 }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            width: 10, height: 10, borderRadius: '50%',
            background: connected ? '#4caf50' : '#ff6b6b',
            boxShadow: connected ? '0 0 8px #4caf50' : '0 0 8px #ff6b6b',
          }}
        />
        <span style={{ color: '#aaa', fontSize: '0.8rem' }}>
          {connected ? 'Connected to Agent Swamps' : 'Connecting…'}
        </span>
      </div>

      {/* Metrics row */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {metrics.map((m, i) => (
          <MetricCard key={i} label={m.label} value={m.value} unit={m.unit} color={i === 0 ? 'purple' : i === 1 ? 'cyan' : 'pink'} />
        ))}
        <RadialGauge value={metrics[0].value % 101} label="Task Efficiency" color="#7c4dff" />
      </div>

      {/* Chart */}
      <div style={{ marginBottom: '1.5rem' }}>
        <RealtimeLineChart data={lineData} title="Task Throughput (live)" color="#7c4dff" />
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* JD panel */}
        {latestJD && (
          <JobDescriptionPanel taskId={latestJD.taskId} jobDescription={latestJD.jd as Parameters<typeof JobDescriptionPanel>[0]['jobDescription']} />
        )}
      </div>

      {/* A2A Timeline */}
      <A2AConversationTimeline messages={a2aMessages} />
    </div>
  );
}
