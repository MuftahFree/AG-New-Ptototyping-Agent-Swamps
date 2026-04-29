import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/claymation.css';

interface A2AMessage {
  id: string;
  conversationId: string;
  fromAgentId: string;
  toAgentId: string;
  intent: string;
  payload: Record<string, unknown>;
  timestamp: number;
}

interface A2AConversationTimelineProps {
  messages: A2AMessage[];
  title?: string;
}

const intentColors: Record<string, string> = {
  REQUEST: '#7c4dff',
  RESPONSE: '#00e5ff',
  DELEGATE: '#ff9800',
  NEGOTIATE: '#e91e63',
  BROADCAST: '#4caf50',
  HANDOFF: '#ff6b6b',
  STATUS_UPDATE: '#9c27b0',
  CANCEL: '#f44336',
};

export function A2AConversationTimeline({ messages, title }: A2AConversationTimelineProps) {
  return (
    <div className="clay-card clay-scroll" style={{ maxHeight: 360, overflowY: 'auto' }}>
      <p style={{ color: '#00e5ff', fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.9rem' }}>
        📡 {title || 'A2A Message Timeline'}
      </p>
      <div style={{ position: 'relative' }}>
        {/* Vertical line */}
        <div style={{ position: 'absolute', left: 15, top: 0, bottom: 0, width: 2, background: 'rgba(124,77,255,0.2)' }} />
        <AnimatePresence>
          {messages.length === 0 && (
            <p style={{ color: '#555', fontSize: '0.8rem', textAlign: 'center', padding: '1rem' }}>
              Awaiting A2A messages…
            </p>
          )}
          {messages.map((msg, i) => {
            const color = intentColors[msg.intent] || '#aaa';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.04 }}
                style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.6rem', paddingLeft: 28 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                  style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: color, boxShadow: `0 0 8px ${color}`,
                    position: 'absolute', left: 11, marginTop: 4,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className="clay-badge" style={{ borderColor: `${color}66`, color, fontSize: '0.65rem' }}>
                      {msg.intent}
                    </span>
                    <span style={{ color: '#777', fontSize: '0.65rem' }}>
                      {msg.fromAgentId.slice(0, 8)} → {msg.toAgentId === 'BROADCAST' ? 'ALL' : msg.toAgentId.slice(0, 8)}
                    </span>
                    <span style={{ color: '#555', fontSize: '0.6rem', marginLeft: 'auto' }}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  {Object.keys(msg.payload).length > 0 && (
                    <pre style={{ margin: '2px 0 0', color: '#666', fontSize: '0.6rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                      {JSON.stringify(msg.payload).slice(0, 80)}…
                    </pre>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
