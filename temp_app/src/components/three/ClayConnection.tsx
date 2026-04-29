import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ClayConnectionProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  active?: boolean;
}

export function ClayConnection({ start, end, color = '#7c4dff', active = false }: ClayConnectionProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const { points } = useMemo(() => {
    const s = new THREE.Vector3(...start);
    const e = new THREE.Vector3(...end);
    const m = s.clone().lerp(e, 0.5);
    m.y += 0.8;
    const curve = new THREE.QuadraticBezierCurve3(s, m, e);
    return { points: curve.getPoints(40) };
  }, [start, end]);

  const geometry = useMemo(() => {
    const tubeGeom = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(points),
      40, 0.04, 6, false
    );
    return tubeGeom;
  }, [points]);

  useFrame((state) => {
    if (!meshRef.current || !active) return;
    const t = state.clock.getElapsedTime();
    (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.4 + Math.sin(t * 3) * 0.3;
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={active ? 0.5 : 0.1}
        roughness={0.7}
        metalness={0.1}
      />
    </mesh>
  );
}
