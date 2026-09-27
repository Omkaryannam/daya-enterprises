"use client";

import { useSyncExternalStore } from "react";

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
function computeTier(): DeviceTier {
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  // Mouse/trackpad devices (including a laptop with a touchscreen used via
  // trackpad) always get the full experience.
  if (!coarsePointer) return "full";

  const cores =
    typeof navigator !== "undefined" && "hardwareConcurrency" in navigator
      ? navigator.hardwareConcurrency
      : 8;
  // deviceMemory is Chromium-only; treat "unknown" (e.g. Safari) as
  // "don't downgrade on this signal alone".
  const memory =
    typeof navigator !== "undefined" && "deviceMemory" in navigator
      ? (navigator as Navigator & { deviceMemory?: number }).deviceMemory
      : undefined;
  const isNarrow = window.innerWidth < 768;

  const veryLowPower = (cores !== undefined && cores <= 3) || (memory !== undefined && memory <= 2);
  if (veryLowPower) return "minimal";

  const midPower = isNarrow || (cores !== undefined && cores <= 6);
  if (midPower) return "lite";

  return "full";
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
