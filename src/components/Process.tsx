import { process } from "@/lib/content";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function Process() {
  return (
    <section id="process" aria-label="Our process" className="relative bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading eyebrow="HOW WE WORK" title="From consultation to support & AMC" align="center" />

        <div className="relative mt-16">
          <div
            aria-hidden="true"
            className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-sky/70 via-forest/30 to-transparent md:left-[10%] md:right-[10%] md:top-6 md:h-px md:w-auto md:bg-gradient-to-r"
          />
          <ol className="relative grid grid-cols-1 gap-10 md:grid-cols-5 md:gap-6">
            {process.map((step, i) => (
              <li key={step.index} className="relative flex gap-5 pl-16 md:flex-col md:items-center md:pl-0 md:text-center">
                <Reveal delay={i * 0.08} className="absolute left-0 top-0 md:static md:mb-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-forest font-body text-sm font-bold text-white shadow-[0_0_0_4px_var(--color-paper)]">
                    {step.index}
                  </span>
                </Reveal>
                <Reveal delay={i * 0.08 + 0.05}>
                  <div>
                    <h3 className="font-display text-base font-bold text-ink">{step.title}</h3>
                    <p className="mt-1.5 text-sm text-ink-soft">{step.detail}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
