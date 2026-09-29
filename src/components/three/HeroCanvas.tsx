"use client";

import { Component, Suspense, useCallback, useEffect, useRef, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import InfrastructureScene from "./InfrastructureScene";
import type { ProgressStore } from "@/lib/scrollProgress";
import { isDebug3D } from "@/lib/webgl";

// Catches anything thrown while the scene mounts (WebGL init failure, texture
// 404, shader compile error) so the page shows the fallback instead of an
// empty canvas.
class CanvasErrorBoundary extends Component<
  { children: ReactNode; onError: (msg: string) => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error) {
    console.error("[HeroCanvas] scene crashed:", error);
    this.props.onError(error.message);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function HeroCanvas({
  progressRef,
  reducedMotion,
  tier,
  onFail,
}: {
  progressRef: ProgressStore;
  reducedMotion: boolean;
  tier: "full" | "lite";
  onFail?: (reason: string) => void;
}) {
  const isFull = tier === "full";
  const restoreTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cleanup = useRef<(() => void) | null>(null);

  useEffect(
    () => () => {
      if (restoreTimer.current) clearTimeout(restoreTimer.current);
      cleanup.current?.();
    },
    []
  );

  const fail = useCallback((reason: string) => onFail?.(reason), [onFail]);

  return (
    <CanvasErrorBoundary onError={fail}>
      <Canvas
        // 1.5 (not 1) on lite: a phone with a 3x screen upscales a dpr-1
        // canvas 3x, which is what makes the centre line look stair-stepped.
        dpr={isFull ? [1, 1.8] : [1, 1.5]}
        gl={{
          antialias: isFull,
          powerPreference: isFull ? "high-performance" : "low-power",
          alpha: false,
          stencil: false,
          failIfMajorPerformanceCaveat: false,
        }}
        camera={{ fov: 52, near: 0.1, far: 200, position: [0, 3.4, 15] }}
        onCreated={({ gl }) => {
          const el = gl.domElement;
          if (isDebug3D()) {
            const ctx = gl.getContext();
            const dbg = ctx.getExtension("WEBGL_debug_renderer_info");
            console.log("[HeroCanvas] created", {
              webgl2: typeof WebGL2RenderingContext !== "undefined" && ctx instanceof WebGL2RenderingContext,
              renderer: dbg ? ctx.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : "n/a",
              maxTextureSize: ctx.getParameter(ctx.MAX_TEXTURE_SIZE),
            });
          }
          const onLost = (e: Event) => {
            e.preventDefault(); // required, otherwise the browser will never restore it
            console.warn("[HeroCanvas] WebGL context lost");
            // three.js re-initialises itself on 'webglcontextrestored'. If that
            // doesn't happen within 4s, give up and show the fallback.
            restoreTimer.current = setTimeout(() => fail("context-lost"), 4000);
          };
          const onRestored = () => {
            console.warn("[HeroCanvas] WebGL context restored");
            if (restoreTimer.current) clearTimeout(restoreTimer.current);
          };
          el.addEventListener("webglcontextlost", onLost);
          el.addEventListener("webglcontextrestored", onRestored);
          cleanup.current = () => {
            el.removeEventListener("webglcontextlost", onLost);
            el.removeEventListener("webglcontextrestored", onRestored);
          };
        }}
      >
        <Suspense fallback={null}>
          <InfrastructureScene progressRef={progressRef} reducedMotion={reducedMotion} tier={tier} />
        </Suspense>
      </Canvas>
    </CanvasErrorBoundary>
  );
}
