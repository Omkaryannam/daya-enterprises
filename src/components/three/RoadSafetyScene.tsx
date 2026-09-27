"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

function Scene({ reducedMotion }: { reducedMotion: boolean }) {
  const t = useRef(0);
  const studRefs = useRef<(THREE.Mesh | null)[]>([]);
  const studs = useMemo(() => Array.from({ length: 8 }, (_, i) => i), []);

  useFrame((_, delta) => {
    t.current += delta;
    studs.forEach((i) => {
      const mesh = studRefs.current[i];
      if (!mesh) return;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      const phase = reducedMotion ? 1 : (Math.sin(t.current * 1.6 - i * 0.6) + 1) / 2;
      mat.emissiveIntensity = 0.6 + phase * 2.6;
    });
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 16]} />
        <meshStandardMaterial color="#0f1a14" roughness={0.9} />
      </mesh>

      {/* Barriers */}
      {[-2.6, -1.4, 1.4, 2.6].map((x, i) => (
        <mesh key={i} position={[x, 0.35, -1 + i * 0.4]}>
          <boxGeometry args={[0.28, 0.7, 1.7]} />
          <meshStandardMaterial color="#ff6a13" emissive="#ff6a13" emissiveIntensity={0.3} roughness={0.5} />
        </mesh>
      ))}

      {/* Delineators */}
      {[-3.4, -2.2, 2.2, 3.4].map((x, i) => (
        <mesh key={`d-${i}`} position={[x, 0.5, 2.4]}>
          <cylinderGeometry args={[0.06, 0.06, 1, 10]} />
          <meshStandardMaterial color="#eef1f3" emissive="#2f9bff" emissiveIntensity={0.4} />
        </mesh>
      ))}

      {/* Studs */}
      {studs.map((i) => (
        <mesh
          key={i}
          ref={(el) => {
            studRefs.current[i] = el;
          }}
          position={[0, 0.05, -5 + i * 1.2]}
        >
          <boxGeometry args={[0.22, 0.06, 0.22]} />
          <meshStandardMaterial color="#2f9bff" emissive="#2f9bff" emissiveIntensity={1} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

export default function RoadSafetyScene({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <Canvas dpr={[1, 1.6]} camera={{ fov: 48, position: [4, 3.4, 6] }} gl={{ antialias: true }}>
      <color attach="background" args={["#0f1b14"]} />
      <fogExp2 attach="fog" args={["#0f1b14", 0.05]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 6, 3]} intensity={0.8} color="#ffb27a" />
      <Environment preset="city" environmentIntensity={0.3} />
      <Suspense fallback={null}>
        <Scene reducedMotion={reducedMotion} />
      </Suspense>
    </Canvas>
  );
}
