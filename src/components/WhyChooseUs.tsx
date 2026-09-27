import { whyChooseUs } from "@/lib/content";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const accents = ["sky", "flame", "forest"] as const;

export default function WhyChooseUs() {
  return (
    <section aria-label="Why choose Daya Enterprises" className="relative bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading eyebrow="WHY CHOOSE US" title="Execution you can rely on" accent="flame" />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {whyChooseUs.map((item, i) => {
            const accent = accents[i % accents.length];
            const dot =
              accent === "sky" ? "bg-sky" : accent === "flame" ? "bg-flame" : "bg-forest";
            return (
              <Reveal key={item.label} delay={(i % 3) * 0.06}>
                <div className="h-full rounded-2xl border border-line bg-white p-6 shadow-[0_1px_2px_rgba(26,26,26,0.05)] transition-colors hover:border-forest/40">
                  <div
                    className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-paper"
                    aria-hidden="true"
                  >
                    <span className={`h-2 w-2 rounded-full ${dot}`} />
                  </div>
                  <h3 className="font-display text-base font-bold text-ink">{item.label}</h3>
                  <p className="mt-2 text-sm text-ink-soft">{item.detail}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

