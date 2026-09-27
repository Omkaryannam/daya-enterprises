import { cta, business, emailHrefWithMessage } from "@/lib/content";
import Reveal from "./Reveal";
import PhoneLink from "./PhoneLink";

export default function CTASection() {
  return (
    <section aria-label="Get in touch" className="relative overflow-hidden bg-forest py-24 md:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(255,255,255,0.09),transparent_60%)]"
      />
      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-10">
        <Reveal>
          <h2 className="font-display text-3xl font-bold uppercase leading-tight text-white sm:text-4xl md:text-6xl">
            {cta.headline}
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mx-auto mt-6 max-w-xl text-base text-white/80 md:text-lg">{cta.body}</p>
        </Reveal>
        <Reveal delay={0.16}>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <PhoneLink
              data-cursor="VIEW"
              className="rounded-full bg-flame px-7 py-3.5 text-sm font-bold tracking-wide text-ink transition-[transform,background-color] hover:scale-105 hover:bg-white"
            >
              Call {business.phone}
            </PhoneLink>
            <a
              href={emailHrefWithMessage}
              data-cursor="VIEW"
              className="rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold tracking-wide text-white transition-colors hover:border-sky-soft hover:text-sky-soft"
            >
              Send an Email
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
