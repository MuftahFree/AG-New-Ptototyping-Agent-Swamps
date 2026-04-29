import { motion } from 'framer-motion';
import '../../styles/claymation.css';

interface SkillBadgeProps {
  name: string;
  provider?: string;
  version?: string;
}

const providerColors: Record<string, string> = {
  gemini: '#4285f4',
  claude: '#c8553d',
  minimax: '#00bcd4',
  grok: '#1da1f2',
  glm: '#ff6f00',
};

const providerEmoji: Record<string, string> = {
  gemini: '✦',
  claude: '◆',
  minimax: '⬡',
  grok: '𝕏',
  glm: '智',
};

export function SkillBadge({ name, provider = 'gemini', version }: SkillBadgeProps) {
  const color = providerColors[provider.toLowerCase()] || '#7c4dff';
  const emoji = providerEmoji[provider.toLowerCase()] || '◉';

  return (
    <motion.div
      className="clay-badge"
      style={{ borderColor: `${color}66`, color, boxShadow: `0 0 8px ${color}33` }}
      whileHover={{ scale: 1.1, boxShadow: `0 0 14px ${color}55` }}
      title={`Provider: ${provider}${version ? ` | v${version}` : ''}`}
    >
      <span>{emoji}</span>
      <span>{name}</span>
      {version && <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>v{version}</span>}
    </motion.div>
  );
}
