import Reveal from "./Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
  accent = "sky",
}: {
  eyebrow: string;
  title: string;
  body?: string;
  align?: "left" | "center";
  accent?: "sky" | "flame" | "forest";
}) {
  const dotColor =
    accent === "flame" ? "bg-flame" : accent === "forest" ? "bg-forest" : "bg-sky";
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <Reveal>
        <p
          className={`section-label flex items-center gap-2 text-xs font-semibold text-forest md:text-sm ${
            align === "center" ? "justify-center" : ""
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} aria-hidden="true" />
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          className={`font-display mt-3 max-w-3xl text-3xl font-bold uppercase leading-tight text-ink sm:text-4xl md:text-5xl ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {title}
        </h2>
      </Reveal>
      {body && (
        <Reveal delay={0.16}>
          <p className={`mt-5 max-w-2xl text-base text-ink-soft md:text-lg ${align === "center" ? "mx-auto" : ""}`}>
            {body}
          </p>
        </Reveal>
      )}
    </div>
  );
}
