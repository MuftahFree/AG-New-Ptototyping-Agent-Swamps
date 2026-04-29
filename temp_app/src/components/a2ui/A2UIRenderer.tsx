import { useEffect, useState, useCallback, useRef, useReducer, useMemo } from 'react';
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

/** Ring-buffer capacity for A2A messages. */
const MSG_CAPACITY = 50;

/** Keyed metrics state type. */
type MetricsRecord = Record<string, { value: number; unit?: string }>;

const INITIAL_METRICS: MetricsRecord = {
  'Tasks Completed': { value: 0 },
  'Active Agents': { value: 0 },
  'Skills Created': { value: 0 },
};

/** Colours for the three primary metric cards (by label index). */
const METRIC_COLORS = ['purple', 'cyan', 'pink'] as const;
const METRIC_LABELS = ['Tasks Completed', 'Active Agents', 'Skills Created'] as const;

export function A2UIRenderer({ serverUrl }: A2UIRendererProps) {
  const [connected, setConnected] = useState(false);
  const [metrics, setMetrics] = useState<MetricsRecord>(INITIAL_METRICS);
  const [lineData, setLineData] = useState<Array<{ time: number; value: number }>>([]);
  const [latestJD, setLatestJD] = useState<{ taskId: string; jd: unknown } | null>(null);

  // --- rAF-coalesced ring buffer for A2A messages ---
  const msgBuffer = useRef<A2AMessageEvent[]>([]);
  const rafPending = useRef(false);
  const [msgVersion, bumpVersion] = useReducer((v: number) => v + 1, 0);

  /** Schedule a single rAF to flush the buffer version to consumers. */
  const scheduleFlush = useCallback(() => {
    if (rafPending.current) return;
    rafPending.current = true;
    requestAnimationFrame(() => {
      rafPending.current = false;
      bumpVersion();
    });
  }, []);

  /** Derive visible messages from the ring buffer, keyed on msgVersion. */
  const a2aMessages = useMemo(
    () => [...msgBuffer.current],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [msgVersion],
  );

  const addTimePoint = useCallback(() => {
    setLineData(prev => {
      const next = [...prev, { time: Date.now(), value: Math.floor(Math.random() * 40 + 10) }];
      return next.slice(-20);
    });
  }, []);

  // --- Effect 1: connection lifecycle (mount/unmount only) ---
  useEffect(() => {
    A2UIService.connect(serverUrl);
    return () => {
      A2UIService.disconnect();
    };
  // intentionally run once; serverUrl changes are intentionally ignored after mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Effect 2: subscriptions ---
  useEffect(() => {
    const unsubConnected = A2UIService.on('__connected', () => setConnected(true));
    const unsubDisconnected = A2UIService.on('__disconnected', () => setConnected(false));

    const unsubA2A = A2UIService.on<A2AMessageEvent>('a2a:message', (msg) => {
      // Pre-compute preview once at ingestion time.
      const preview = JSON.stringify(msg.payload).slice(0, 80);
      const enriched: A2AMessageEvent = { ...msg, _preview: preview };
      // Push to front of ring buffer, trim to capacity.
      msgBuffer.current = [enriched, ...msgBuffer.current].slice(0, MSG_CAPACITY);
      scheduleFlush();
    });

    const unsubSkill = A2UIService.on<ImprovisationEvent>('skill:created', () => {
      setMetrics(prev => ({
        ...prev,
        'Skills Created': { ...prev['Skills Created'], value: prev['Skills Created'].value + 1 },
      }));
    });

    const unsubCompleted = A2UIService.on('task:completed', () => {
      setMetrics(prev => ({
        ...prev,
        'Tasks Completed': { ...prev['Tasks Completed'], value: prev['Tasks Completed'].value + 1 },
      }));
      addTimePoint();
    });

    const unsubJD = A2UIService.on<ImprovisationEvent>('jobdescription:generated', (data) => {
      if (data.taskId && data.jobDescription) {
        setLatestJD({ taskId: data.taskId, jd: data.jobDescription });
      }
    });

    // Synthetic samples only in development for visual feedback.
    let sim: ReturnType<typeof setInterval> | undefined;
    if (import.meta.env.DEV) {
      sim = setInterval(addTimePoint, 3000);
    }

    return () => {
      unsubConnected();
      unsubDisconnected();
      unsubA2A();
      unsubSkill();
      unsubCompleted();
      unsubJD();
      if (sim !== undefined) clearInterval(sim);
    };
  }, [addTimePoint, scheduleFlush]);

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
        {METRIC_LABELS.map((label, i) => (
          <MetricCard
            key={label}
            label={label}
            value={metrics[label].value}
            unit={metrics[label].unit}
            color={METRIC_COLORS[i]}
          />
        ))}
        <RadialGauge value={metrics['Tasks Completed'].value % 101} label="Task Efficiency" color="#7c4dff" />
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
