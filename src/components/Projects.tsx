"use client";

import { useRef } from "react";
import Image from "next/image";
import { projectCategories } from "@/lib/content";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function Projects() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: number) => {
    scrollerRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  return (
    <section id="projects" aria-label="Our work" className="relative bg-paper-alt py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="OUR WORK"
            title="Where Daya Enterprises delivers"
            body="Placeholder imagery shown below — ready to be replaced with real project photography as it becomes available."
          />
          <div className="hidden gap-3 md:flex">
            <button
              type="button"
              aria-label="Scroll projects left"
              onClick={() => scrollBy(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-forest text-white transition-colors hover:bg-sky hover:text-ink"
            >
              &larr;
            </button>
            <button
              type="button"
              aria-label="Scroll projects right"
              onClick={() => scrollBy(1)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-forest text-white transition-colors hover:bg-sky hover:text-ink"
            >
              &rarr;
            </button>
          </div>
        </div>
      </div>

      <Reveal delay={0.1}>
        <div
          ref={scrollerRef}
          className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 lg:px-10"
          style={{ scrollbarWidth: "thin" }}
        >
          {projectCategories.map((cat, i) => (
            <div
              key={cat.title}
              data-cursor="VIEW"
              className="group relative aspect-[4/5] w-[78vw] shrink-0 snap-start overflow-hidden rounded-2xl border border-forest/20 shadow-[0_18px_40px_-24px_rgba(15,27,20,0.6)] sm:w-[42vw] lg:w-[300px]"
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 grid-lines transition-transform duration-500 group-hover:scale-105"
                style={
                  cat.image
                    ? undefined
                    : {
                        background: `linear-gradient(160deg, hsl(${140 + i * 8} 28% 20%), #0f1b14 72%)`,
                      }
                }
              >
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="(min-width: 1024px) 300px, (min-width: 640px) 42vw, 78vw"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-forest-night via-forest-night/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="section-label text-[10px] font-semibold text-sky-soft">PROJECT CATEGORY</p>
                <h3 className="font-display mt-1 text-lg font-bold text-white">{cat.title}</h3>
                <p className="mt-1 text-xs text-white/75">{cat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
