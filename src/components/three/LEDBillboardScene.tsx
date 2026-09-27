"use client";

import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { Environment, Text } from "@react-three/drei";
import * as THREE from "three";

function Billboard({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const t = useRef(0);

  useFrame((_, delta) => {
    t.current += delta;
    if (!reducedMotion && groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t.current * 0.35) * 0.28;
    }
    if (matRef.current) {
      matRef.current.emissiveIntensity = 2.1 + Math.sin(t.current * 1.6) * 0.35;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Support pole */}
      <mesh position={[0, -2.2, 0]}>
        <cylinderGeometry args={[0.16, 0.2, 2.6, 16]} />
        <meshStandardMaterial color="#4a5158" metalness={0.8} roughness={0.35} />
      </mesh>

      {/* Billboard frame */}
      <mesh>
        <boxGeometry args={[4.6, 2.4, 0.18]} />
        <meshStandardMaterial color="#0d0f11" metalness={0.6} roughness={0.5} />
      </mesh>

      {/* Screen */}
      <mesh position={[0, 0, 0.11]}>
        <planeGeometry args={[4.2, 2]} />
        <meshStandardMaterial
          ref={matRef}
          color="#071f3d"
          emissive="#2f9bff"
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>

      <Text position={[0, 0, 0.18]} fontSize={0.38} color="#eef6ff" anchorX="center" anchorY="middle">
        DAYA ENTERPRISES
      </Text>

      <pointLight position={[0, 0, 3]} color="#2f9bff" intensity={4} distance={9} />
      <pointLight position={[-4, 2, 2]} color="#ff6a13" intensity={0.6} distance={8} />
    </group>
  );
}

export default function LEDBillboardScene({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ fov: 42, position: [1.5, 0.6, 6] }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={["#0f1b14"]} />
      <fogExp2 attach="fog" args={["#0f1b14", 0.05]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 6, 4]} intensity={0.8} color="#ffb27a" />
      <Environment preset="city" environmentIntensity={0.3} />
      <Suspense fallback={null}>
        <Billboard reducedMotion={reducedMotion} />
      </Suspense>
    </Canvas>
  );
}
