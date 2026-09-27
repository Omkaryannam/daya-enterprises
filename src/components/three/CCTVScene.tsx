"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

function Camera({ reducedMotion }: { reducedMotion: boolean }) {
  const headRef = useRef<THREE.Group>(null);
  const beamRef = useRef<THREE.Mesh>(null);
  const t = useRef(0);

  useFrame((_, delta) => {
    t.current += delta;
    if (headRef.current) {
      headRef.current.rotation.y = reducedMotion ? 0.2 : Math.sin(t.current * 0.5) * 0.9;
    }
    if (beamRef.current) {
      const mat = beamRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.14 + Math.sin(t.current * 2) * 0.05;
    }
  });

  return (
    <group>
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 3.2, 14]} />
        <meshStandardMaterial color="#3d4247" metalness={0.7} roughness={0.4} />
      </mesh>

      <group ref={headRef} position={[0, 3.1, 0]}>
        <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 1.05, 24]} />
          <meshStandardMaterial color="#e7e9eb" metalness={0.5} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0, 1.05]}>
          <cylinderGeometry args={[0.2, 0.2, 0.06, 24]} />
          <meshStandardMaterial color="#0c0e10" metalness={0.3} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[0.12, 0.5, 0.5]} />
          <meshStandardMaterial color="#2b2f33" metalness={0.6} roughness={0.4} />
        </mesh>

        <mesh ref={beamRef} position={[0, 0, 5.4]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[2.4, 9, 32, 1, true]} />
          <meshBasicMaterial color="#2f9bff" transparent opacity={0.14} side={THREE.DoubleSide} />
        </mesh>

        <pointLight position={[0, 0, 1]} color="#2f9bff" intensity={1.6} distance={4} />
      </group>
    </group>
  );
}

export default function CCTVScene({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <Canvas dpr={[1, 1.6]} camera={{ fov: 44, position: [3.2, 2.2, 6] }} gl={{ antialias: true }}>
      <color attach="background" args={["#0f1b14"]} />
      <fogExp2 attach="fog" args={["#0f1b14", 0.045]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 6, 4]} intensity={0.7} color="#cfe3ff" />
      <Environment preset="city" environmentIntensity={0.3} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0f1a14" roughness={0.9} />
      </mesh>
      <Suspense fallback={null}>
        <Camera reducedMotion={reducedMotion} />
      </Suspense>
    </Canvas>
  );
}
