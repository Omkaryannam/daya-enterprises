// A plain mutable object used to pass scroll progress (0..1) from a GSAP
// ScrollTrigger into an R3F useFrame loop without causing React re-renders
// on every scroll tick. Each Hero mount gets its own instance via factory.
export function createProgressStore() {
  return { value: 0 };
}

export type ProgressStore = ReturnType<typeof createProgressStore>;
