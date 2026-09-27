import { industries } from "@/lib/content";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const dotColors = ["bg-sky", "bg-flame", "bg-forest"];

export default function Industries() {
  return (
    <section aria-label="Industries we serve" className="relative bg-paper-alt py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading eyebrow="INDUSTRIES WE SERVE" title="Built for real-world infrastructure" align="center" accent="forest" />

        <div className="mt-14 flex flex-wrap justify-center gap-3">
          {industries.map((ind, i) => (
            <Reveal key={ind} delay={(i % 6) * 0.04}>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:border-forest/50 hover:text-ink">
                <span className={`h-1.5 w-1.5 rounded-full ${dotColors[i % dotColors.length]}`} aria-hidden="true" />
                {ind}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
