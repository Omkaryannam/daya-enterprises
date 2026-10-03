import { workedWith } from "@/lib/content";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function WorkedWith() {
  return (
    <section aria-label="Companies we've worked with" className="relative bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading eyebrow={workedWith.eyebrow} title={workedWith.title} align="center" accent="flame" />

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          {workedWith.names.map((name, i) => (
            <Reveal key={name} delay={i * 0.06}>
              <span className="inline-flex items-center rounded-full border border-line bg-white px-8 py-4 font-display text-xl font-bold tracking-wide text-ink shadow-[0_1px_2px_rgba(26,26,26,0.05)] transition-colors hover:border-forest/50 sm:text-2xl">
                {name}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
