"use client";

import Image from "next/image";
import { featured } from "@/lib/content";
import Reveal from "./Reveal";

export default function FeaturedLED() {
  const { led } = featured;

  return (
    <section
      aria-label="LED display solutions"
      className="relative overflow-hidden bg-paper py-24 md:py-32"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:px-10">
        <Reveal>
          <div>
            <p className="section-label text-xs font-semibold text-forest md:text-sm">{led.eyebrow}</p>
            <h2 className="font-display mt-3 text-3xl font-bold uppercase leading-tight text-ink sm:text-4xl md:text-5xl">
              {led.title}
            </h2>
            <p className="mt-5 max-w-lg text-base text-ink-soft md:text-lg">{led.body}</p>
            <ul className="mt-7 flex flex-wrap gap-2.5">
              {led.useCases.map((u) => (
                <li
                  key={u}
                  className="rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-medium text-ink-soft"
                >
                  {u}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-forest/20 bg-forest-night shadow-[0_24px_60px_-28px_rgba(15,27,20,0.65)]">
            <Image
              src="/images/projects/led-display-projects.jpg"
              alt="Daya Enterprises LED display installation"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
