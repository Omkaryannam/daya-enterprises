import { featured } from "@/lib/content";
import Reveal from "./Reveal";

function GantryAccent() {
  return (
    <div className="relative flex h-full items-end justify-center gap-3 pb-4" aria-hidden="true">
      {[0.55, 0.85, 1, 0.85, 0.55].map((h, i) => (
        <span
          key={i}
          className="w-3 rounded-t-sm bg-gradient-to-t from-sky/70 to-sky-soft"
          style={{ height: `${h * 100}%` }}
        />
      ))}
    </div>
  );
}

function ThermoplasticAccent() {
  return (
    <svg viewBox="0 0 200 120" className="h-full w-full" aria-hidden="true">
      <rect width="200" height="120" fill="#1f3628" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={10 + i * 40} y="55" width="24" height="10" rx="2" fill="#ff6a13" opacity="0.95" />
      ))}
      <rect x="70" y="20" width="60" height="16" rx="2" fill="#f8f9fa" opacity="0.95" />
    </svg>
  );
}

function RPMAccent() {
  return (
    <div className="grid h-full grid-cols-5 items-center justify-items-center gap-2 px-6" aria-hidden="true">
      {Array.from({ length: 10 }, (_, i) => (
        <span
          key={i}
          className="h-2.5 w-2.5 rounded-full bg-sky-soft"
          style={{ animation: `pulseGlow 1.8s ${i * 0.15}s ease-in-out infinite` }}
        />
      ))}
    </div>
  );
}

const panels = [
  { data: featured.gantry, Accent: GantryAccent, tint: "from-sky/15" },
  { data: featured.thermoplastic, Accent: ThermoplasticAccent, tint: "from-flame/15" },
  { data: featured.rpm, Accent: RPMAccent, tint: "from-sky/15" },
];

export default function FeaturedStrip() {
  return (
    <section aria-label="Fabrication and road marking services" className="relative bg-paper-alt py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {panels.map(({ data, Accent, tint }) => (
            <Reveal key={data.eyebrow}>
              <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(26,26,26,0.05)]">
                <div className={`h-40 w-full bg-forest bg-gradient-to-b ${tint} to-transparent`}>
                  <Accent />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="section-label text-[11px] font-semibold text-forest">{data.eyebrow}</p>
                  <h3 className="font-display mt-2 text-xl font-bold uppercase leading-snug text-ink">
                    {data.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{data.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
