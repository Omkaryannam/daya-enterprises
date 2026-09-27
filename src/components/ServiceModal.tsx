"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { ServiceCard as ServiceCardType } from "@/lib/content";
import { business, serviceOptions } from "@/lib/content";

/** Custom event ContactSection listens for to pre-select the matching service option. */
export const SELECT_SERVICE_EVENT = "daya:select-service";

export default function ServiceModal({
  service,
  onClose,
}: {
  service: ServiceCardType | null;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!service) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [service, onClose]);

  if (!service) return null;

  const requestQuote = () => {
    const matchedOption = serviceOptions.includes(service.title) ? service.title : "Other";
    window.dispatchEvent(new CustomEvent(SELECT_SERVICE_EVENT, { detail: matchedOption }));
    onClose();
    // Let the modal close/unmount before scrolling so focus and layout settle.
    requestAnimationFrame(() => {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-modal-title"
        tabIndex={-1}
        className={`grid max-h-[92vh] w-full max-w-3xl grid-cols-1 overflow-y-auto rounded-t-2xl border border-line bg-white shadow-[0_24px_60px_-20px_rgba(26,26,26,0.35)] focus:outline-none sm:rounded-2xl ${
          service.image ? "sm:grid-cols-2" : ""
        }`}
      >
        {service.image ? (
          <div className="relative h-48 w-full shrink-0 sm:order-2 sm:h-full sm:min-h-[22rem]">
            <Image
              src={service.image}
              alt={`${service.title} — completed work by Daya Enterprises`}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}

        <div className="p-7 sm:order-1">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-forest text-white">
              <span className="font-body text-base font-semibold">{service.index}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-paper hover:text-ink"
            >
              &#10005;
            </button>
          </div>

          <h2 id="service-modal-title" className="mt-5 font-display text-2xl font-bold text-ink">
            {service.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{service.description}</p>

          <ul className="mt-5 flex flex-wrap gap-2">
            {service.bullets.map((b) => (
              <li
                key={b}
                className="rounded-full border border-line bg-paper px-3 py-1.5 text-xs text-ink-soft"
              >
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-col gap-3">
            <button
              type="button"
              onClick={requestQuote}
              className="rounded-full bg-flame px-6 py-3 text-sm font-bold tracking-wide text-ink transition-[transform,background-color] hover:scale-[1.02] hover:bg-flame-deep hover:text-white"
            >
              Request a quote for this service
            </button>
            <a
              href={business.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-sky/60 hover:text-sky-ink"
            >
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
