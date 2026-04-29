import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float } from '@react-three/drei';
import { ClayAgentAvatar } from './ClayAgentAvatar';
import { ClayConnection } from './ClayConnection';

interface AgentNode {
  id: string;
  name: string;
  position: [number, number, number];
  status?: 'idle' | 'thinking' | 'executing' | 'completed' | 'error';
}

interface ClaySwampSceneProps {
  agents?: AgentNode[];
  connections?: Array<{ from: string; to: string; active?: boolean }>;
}

function ClayIsland({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh receiveShadow castShadow>
        <cylinderGeometry args={[0.8, 1.0, 0.3, 8]} />
        <meshStandardMaterial color="#2d3561" roughness={0.9} metalness={0.05} />
      </mesh>
      {/* Grass top */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.75, 0.75, 0.1, 8]} />
        <meshStandardMaterial color="#3a4d7a" roughness={0.95} />
      </mesh>
    </group>
  );
}

const DEFAULT_AGENTS: AgentNode[] = [
  { id: 'dev', name: 'Developer', position: [-2, 0, 0], status: 'idle' },
  { id: 'qa', name: 'QA', position: [0, 0, -2], status: 'idle' },
  { id: 'pm', name: 'Product Manager', position: [2, 0, 0], status: 'idle' },
  { id: 'skill', name: 'Skill Creator', position: [0, 0, 2], status: 'idle' },
];

export function ClaySwampScene({ agents = DEFAULT_AGENTS, connections = [] }: ClaySwampSceneProps) {
  const agentMap = new Map(agents.map(a => [a.id, a]));

  return (
    <div style={{ width: '100%', height: 360, borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(124,77,255,0.25)' }}>
      <Canvas
        shadows
        camera={{ position: [0, 4, 6], fov: 50 }}
        style={{ background: 'linear-gradient(180deg, #0d0e1a 0%, #1a1b30 100%)' }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 8, 5]} intensity={0.8} castShadow />
          <pointLight position={[0, 3, 0]} color="#7c4dff" intensity={0.5} distance={8} />
          <pointLight position={[0, 2, 0]} color="#00e5ff" intensity={0.3} distance={6} />

          {/* Fog */}
          <fog attach="fog" args={['#0d0e1a', 8, 20]} />

          {/* Ground plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#0a0b18" roughness={1} />
          </mesh>

          {/* Clay islands under agents */}
          {agents.map(agent => (
            <Float key={`island-${agent.id}`} speed={1} rotationIntensity={0.05} floatIntensity={0.2}>
              <ClayIsland position={[agent.position[0], agent.position[1] - 0.5, agent.position[2]]} />
            </Float>
          ))}

          {/* Agent avatars */}
          {agents.map(agent => (
            <Float key={agent.id} speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
              <ClayAgentAvatar
                position={agent.position}
                status={agent.status}
              />
            </Float>
          ))}

          {/* Connections */}
          {connections.map((conn, i) => {
            const fromAgent = agentMap.get(conn.from);
            const toAgent = agentMap.get(conn.to);
            if (!fromAgent || !toAgent) return null;
            return (
              <ClayConnection
                key={i}
                start={fromAgent.position}
                end={toAgent.position}
                active={conn.active}
                color="#7c4dff"
              />
            );
          })}

          <OrbitControls enablePan={false} minDistance={3} maxDistance={12} />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}
