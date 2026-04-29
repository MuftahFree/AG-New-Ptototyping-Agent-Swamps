import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface ClayAgentAvatarProps {
  position?: [number, number, number];
  color?: string;
  status?: 'idle' | 'thinking' | 'executing' | 'completed' | 'error';
}

const statusColors: Record<string, string> = {
  idle: '#6e72b8',
  thinking: '#00e5ff',
  executing: '#7c4dff',
  completed: '#4caf50',
  error: '#ff6b6b',
};

export function ClayAgentAvatar({ position = [0, 0, 0], color, status = 'idle' }: ClayAgentAvatarProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const resolvedColor = color || statusColors[status];

  useFrame((state) => {
    if (!meshRef.current) return;
    // Breathing animation
    const t = state.clock.getElapsedTime();
    meshRef.current.scale.setScalar(1 + Math.sin(t * 0.8) * 0.03);
    meshRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.08;
  });

  return (
    <group position={position}>
      {/* Body */}
      <Sphere ref={meshRef} args={[0.5, 32, 32]}>
        <MeshDistortMaterial
          color={resolvedColor}
          distort={0.2}
          speed={2}
          roughness={0.8}
          metalness={0.1}
        />
      </Sphere>
      {/* Eyes */}
      <Sphere args={[0.08, 16, 16]} position={[-0.16, 0.12, 0.44]}>
        <meshStandardMaterial color="#fff" />
      </Sphere>
      <Sphere args={[0.08, 16, 16]} position={[0.16, 0.12, 0.44]}>
        <meshStandardMaterial color="#fff" />
      </Sphere>
      <Sphere args={[0.04, 16, 16]} position={[-0.16, 0.12, 0.5]}>
        <meshStandardMaterial color="#1a1a2e" />
      </Sphere>
      <Sphere args={[0.04, 16, 16]} position={[0.16, 0.12, 0.5]}>
        <meshStandardMaterial color="#1a1a2e" />
      </Sphere>
      {/* Glow point light */}
      <pointLight color={resolvedColor} intensity={0.6} distance={2} />
    </group>
  );
}
