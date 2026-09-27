import { about } from "@/lib/content";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function About() {
  return (
    <section id="about" aria-label="About Daya Enterprises" className="relative bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading eyebrow="ABOUT DAYA ENTERPRISES" title={about.headline} body={about.body} />

        <Reveal delay={0.1}>
          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 md:grid-cols-4">
            {about.pillars.map((pillar, i) => (
              <li key={pillar} className="flex items-center gap-2 text-sm text-ink-soft md:text-base">
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${i % 2 === 0 ? "bg-sky" : "bg-flame"}`}
                  aria-hidden="true"
                />
                {pillar}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Timeline */}
        <div className="mt-20">
          {/* Desktop horizontal */}
          <div className="hidden md:block">
            <Reveal>
              <div className="relative">
                <div className="absolute left-0 right-0 top-6 h-px bg-gradient-to-r from-transparent via-forest/30 to-transparent" />
                <ol className="relative grid grid-cols-4 gap-6">
                  {about.timeline.map((item) => (
                    <li key={item.label} className="flex flex-col items-start">
                      <span className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-forest/25 bg-white text-forest shadow-sm">
                        <span className="h-2.5 w-2.5 rounded-full bg-sky" />
                      </span>
                      <p className="font-display text-lg font-bold text-ink">{item.label}</p>
                      <p className="mt-1 text-sm text-ink-soft">{item.detail}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>

          {/* Mobile vertical */}
          <ol className="relative space-y-8 border-l border-forest/25 pl-6 md:hidden">
            {about.timeline.map((item, i) => (
              <li key={item.label} className="relative">
                <span className="absolute -left-[29px] top-1 flex h-4 w-4 items-center justify-center rounded-full border border-forest/30 bg-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky" />
                </span>
                <Reveal delay={i * 0.05}>
                  <p className="font-display text-base font-bold text-ink">{item.label}</p>
                  <p className="mt-1 text-sm text-ink-soft">{item.detail}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
