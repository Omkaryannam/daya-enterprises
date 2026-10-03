import Image from "next/image";
import { workedWith } from "@/lib/content";
import SectionHeading from "./SectionHeading";

/**
 * Infinite auto-scrolling logo/name marquee, in the style of a classic
 * "clientele" strip. Each entry renders its real logo (once one is supplied
 * in content.ts) or falls back to a clean text badge, so this works even
 * before any logo files exist.
 *
 * The track is duplicated once and the animation shifts by exactly -50%,
 * so the loop is seamless with no visible jump or gap.
 */
export default function WorkedWith() {
  const items = workedWith.entries;
  const track = [...items, ...items];

  return (
    <section aria-label="Companies we've worked with" className="relative overflow-hidden bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading eyebrow={workedWith.eyebrow} title={workedWith.title} align="center" accent="flame" />
      </div>

      <div className="relative mt-12">
        {/* Edge fade so logos scroll in/out smoothly instead of hard-cutting */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-paper to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-paper to-transparent sm:w-32" />

        <div className="worked-with-marquee flex w-max items-center gap-6">
          {track.map((entry, i) => (
            <div
              key={`${entry.name}-${i}`}
              className="flex h-24 w-48 shrink-0 items-center justify-center rounded-2xl border border-line bg-white px-6 shadow-[0_1px_2px_rgba(26,26,26,0.05)] transition-colors hover:border-forest/50 sm:w-56"
            >
              {entry.logo ? (
                <Image
                  src={entry.logo}
                  alt={entry.name}
                  width={160}
                  height={64}
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                <span className="font-display text-xl font-bold tracking-wide text-ink sm:text-2xl">
                  {entry.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
