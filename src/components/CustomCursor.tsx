"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

function subscribeTouch(callback: () => void) {
  const mq = window.matchMedia("(pointer: coarse)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}
function getTouchSnapshot() {
  return window.matchMedia("(pointer: coarse)").matches;
}
function getTouchServerSnapshot() {
  return true;
}

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string>("");
  const [visible, setVisible] = useState(false);
  const isTouch = useSyncExternalStore(subscribeTouch, getTouchSnapshot, getTouchServerSnapshot);

  useEffect(() => {
    if (isTouch) return;

    const pos = { x: 0, y: 0 };
    const render = { x: 0, y: 0 };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      setVisible(true);

      const target = e.target as HTMLElement;
      const interactive = target.closest("[data-cursor]");
      setLabel(interactive ? interactive.getAttribute("data-cursor") ?? "" : "");
    };

    const loop = () => {
      render.x += (pos.x - render.x) * 0.18;
      render.y += (pos.y - render.y) * 0.18;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${render.x}px, ${render.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden md:flex items-center justify-center rounded-full border border-sky transition-[width,height,background-color] duration-200 ease-out"
      style={{
        width: label ? 76 : 14,
        height: label ? 76 : 14,
        background: "var(--color-sky)",
        opacity: visible ? 1 : 0,
      }}
    >
      {label && (
        <span className="font-body text-[10px] font-bold tracking-[0.2em] text-ink">
          {label}
        </span>
      )}
    </div>
  );
}
