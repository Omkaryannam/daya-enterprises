"use client";

import { useRef } from "react";
import type { ServiceCard as ServiceCardType } from "@/lib/content";

export default function ServiceCard({
  service,
  onExplore,
}: {
  service: ServiceCardType;
  onExplore: (service: ServiceCardType) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${-y * 10}deg) rotateY(${x * 12}deg) translateZ(8px)`;
  };

  const reset = () => {
    if (cardRef.current) {
      cardRef.current.style.transform =
        "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onExplore(service);
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={() => onExplore(service)}
      onKeyDown={handleKeyDown}
      data-cursor="VIEW"
      role="button"
      aria-haspopup="dialog"
      tabIndex={0}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-line bg-white p-6 shadow-[0_1px_2px_rgba(26,26,26,0.05)] transition-[transform,border-color,box-shadow] duration-200 ease-out will-change-transform hover:border-sky/60 hover:shadow-[0_18px_40px_-20px_rgba(42,72,54,0.35)] focus-visible:border-sky/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-sky/0 blur-2xl transition-colors duration-300 group-hover:bg-sky/15"
      />

      {/* 3D-styled icon token */}
      <div
        aria-hidden="true"
        className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-forest text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] transition-transform duration-300 group-hover:-translate-y-1"
      >
        <span className="font-body text-lg font-semibold">{service.index}</span>
      </div>

      <h3 className="font-display text-lg font-bold text-ink">{service.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{service.description}</p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {service.bullets.map((b) => (
          <li
            key={b}
            className="rounded-full border border-line bg-paper px-2.5 py-1 text-[11px] text-ink-soft"
          >
            {b}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-center gap-2 pt-5 text-xs font-semibold tracking-wide text-sky-ink">
        EXPLORE SERVICE
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
          &rarr;
        </span>
      </div>
    </div>
  );
}
