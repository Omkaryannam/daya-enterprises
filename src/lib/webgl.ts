// WebGL capability helpers. The result is cached because useDeviceTier reads
// it on every snapshot and creating a GL context is not free.

let cached: boolean | null = null;

export function hasWebGL(): boolean {
  if (typeof window === "undefined") return false;
  if (cached !== null) return cached;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      (canvas.getContext("webgl2") as WebGL2RenderingContext | null) ||
      (canvas.getContext("webgl") as WebGLRenderingContext | null) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    cached = !!(window.WebGLRenderingContext && gl);
    // Release the probe context immediately so it doesn't count against the
    // browser's active-context limit (Android Chrome allows very few).
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    cached = false;
  }
  return cached;
}

export function isDebug3D(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).has("debug3d");
}

export function isForce3D(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).has("force3d");
}
