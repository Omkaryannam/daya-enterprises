"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import InfrastructureScene from "./InfrastructureScene";
import type { ProgressStore } from "@/lib/scrollProgress";

export default function HeroCanvas({
  progressRef,
  reducedMotion,
  tier,
}: {
  progressRef: ProgressStore;
  reducedMotion: boolean;
  tier: "full" | "lite";
}) {
  const isFull = tier === "full";

  return (
    <Canvas
      dpr={isFull ? [1, 1.8] : [1, 1]}
      gl={{
        antialias: isFull,
        powerPreference: isFull ? "high-performance" : "low-power",
      }}
      camera={{ fov: 52, near: 0.1, far: 200, position: [0, 3.4, 15] }}
    >
      <Suspense fallback={null}>
        <InfrastructureScene progressRef={progressRef} reducedMotion={reducedMotion} tier={tier} />
      </Suspense>
    </Canvas>
  );
}
