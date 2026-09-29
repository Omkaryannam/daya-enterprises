"use client";

import { useSyncExternalStore } from "react";
import { hasWebGL, isDebug3D } from "./webgl";

export type DeviceTier = "full" | "lite" | "minimal";

/**
 * Classifies the current device into three experience tiers for the Hero
 * WebGL scene:
 *
 *  - "full"    Desktops/laptops (fine pointer). Full scene: HDRI environment
 *              lighting, antialiasing, high pixel ratio, all particles.
 *  - "lite"    Touch devices with reasonable hardware (most modern phones
 *              and tablets). Same animated scene, but the expensive bits
 *              (environment map, antialiasing, extra particles, pixel
 *              ratio) are trimmed so it stays smooth.
 *  - "minimal" Touch devices that report very low cores/memory (older or
 *              budget phones). No WebGL at all — a lightweight, subtly
 *              animated CSS background instead, so there's still motion
 *              without any GPU cost.
 *
 * `prefers-reduced-motion` is handled separately by usePrefersReducedMotion
 * (and a global CSS rule) so it applies on top of whichever tier is chosen
 * here, rather than being baked into the tier itself.
 *
 * Uses useSyncExternalStore so the check runs safely on the client without
 * causing hydration mismatches.
 */
let logged = false;

function computeTier(): DeviceTier {
  // No WebGL at all -> CSS fallback, regardless of device class.
  if (!hasWebGL()) return logAndReturn("minimal");

  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  // Mouse/trackpad devices (including a laptop with a touchscreen used via
  // trackpad) always get the full experience.
  if (!coarsePointer) return logAndReturn("full");

  // hardwareConcurrency / deviceMemory are NOT reliable: Brave randomises
  // ("farbles") them for fingerprint protection and Chrome buckets/caps them,
  // so a good phone can report 2 cores or 0.5 GB. Only treat a device as
  // "minimal" when BOTH signals agree it is weak, or memory alone is <= 1 GB.
  const cores = navigator.hardwareConcurrency as number | undefined;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;

  const weakCores = cores !== undefined && cores <= 2;
  const weakMemory = memory !== undefined && memory <= 2;
  const veryWeakMemory = memory !== undefined && memory <= 1;
  if (veryWeakMemory || (weakCores && weakMemory)) return logAndReturn("minimal");

  // Every other touch device gets the (trimmed) animated scene.
  return logAndReturn("lite");
}

function logAndReturn(tier: DeviceTier): DeviceTier {
  if (!logged && typeof window !== "undefined" && isDebug3D()) {
    logged = true;
    console.log("[device-tier]", {
      tier,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: (navigator as Navigator & { deviceMemory?: number }).deviceMemory,
      width: window.innerWidth,
      height: window.innerHeight,
      dpr: window.devicePixelRatio,
      coarse: window.matchMedia("(pointer: coarse)").matches,
      webgl: hasWebGL(),
    });
  }
  return tier;
}

function subscribe(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function getServerSnapshot(): DeviceTier {
  return "full";
}

export function useDeviceTier() {
  const tier = useSyncExternalStore(subscribe, computeTier, getServerSnapshot);
  const checked = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  return { tier, checked };
}
