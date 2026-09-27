"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { hero, business } from "@/lib/content";
import { createProgressStore } from "@/lib/scrollProgress";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { useDeviceTier } from "@/lib/useDeviceTier";

const HeroCanvas = dynamic(() => import("./three/HeroCanvas"), {
  ssr: false,
  loading: () => null,
});

const captions = [
  { at: 0.02, text: "A GLOWING LINE APPEARS." },
  { at: 0.18, text: "THE HIGHWAY TAKES SHAPE." },
  { at: 0.32, text: "A STRUCTURE RISES." },
  { at: 0.47, text: "DISPLAYS COME ALIVE." },
  { at: 0.6, text: "SECURITY THAT NEVER LOOKS AWAY." },
  { at: 0.72, text: "EVERY LINE, ENGINEERED." },
  { at: 0.83, text: "SAFETY, BUILT IN." },
  { at: 0.94, text: "ONE CONNECTED SYSTEM." },
];

export default function Hero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const progressRef = useMemo(() => createProgressStore(), []);
  const reducedMotion = usePrefersReducedMotion();
  const { tier, checked } = useDeviceTier();
  const [captionIndex, setCaptionIndex] = useState(0);

  // Only "minimal" (older/low-power touch devices) skips WebGL entirely.
  // "full" and "lite" both get the animated scene, just tuned differently.
  const useCanvas = checked && tier !== "minimal";
  const canvasTier = tier === "full" ? "full" : "lite";

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!wrapperRef.current || !pinRef.current) return;

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        onUpdate: (self) => {
          progressRef.value = self.progress;
          let idx = 0;
          for (let i = 0; i < captions.length; i++) {
            if (self.progress >= captions[i].at) idx = i;
          }
          setCaptionIndex(idx);
        },
      });

      gsap.to(headlineRef.current, {
        opacity: 0,
        y: -40,
        ease: "power1.out",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "18% top",
          scrub: 0.6,
        },
      });

      return () => st.kill();
    }, wrapperRef);

    return () => ctx.revert();
  }, [progressRef]);

  return (
    <section id="home" aria-label="Introduction" ref={wrapperRef} className="relative h-[520vh]">
      <div ref={pinRef} className="sticky top-0 left-0 h-screen w-full overflow-hidden bg-forest-night">
        {/* 3D layer or static fallback */}
        <div className="absolute inset-0">
          {useCanvas ? (
            <HeroCanvas progressRef={progressRef} reducedMotion={reducedMotion} tier={canvasTier} />
          ) : (
            <div
              aria-hidden="true"
              className="relative h-full w-full overflow-hidden bg-[linear-gradient(180deg,#14251b_0%,#0f1b14_60%)] grid-lines"
            >
              {/* No WebGL on this device, but still a little life in the
                  background: a slow, GPU-cheap (transform/opacity only)
                  glow drift. prefers-reduced-motion freezes this via the
                  global rule in globals.css. */}
              <div className="hero-fallback-glow" />
            </div>
          )}
        </div>

        {/* Vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_35%,rgba(15,27,20,0.78)_100%)]" />

        {/* Headline overlay */}
        <div
          ref={headlineRef}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        >
          <p className="section-label mb-4 text-xs font-semibold text-sky-soft md:text-sm">
            DAYA ENTERPRISES &middot; EST. {business.established}
          </p>
          <h1 className="font-display max-w-3xl text-3xl font-bold uppercase leading-[1.1] text-gradient sm:text-4xl md:text-5xl lg:text-6xl">
            {hero.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-sm font-medium tracking-wide text-white/85 sm:text-base md:text-lg">
            {hero.subheadline}
          </p>
          <p className="mt-4 max-w-xl text-sm text-white/70 md:text-base">
            {hero.supporting}
          </p>
          <div className="pointer-events-auto mt-9 flex flex-col items-center gap-4 sm:flex-row">
            <a
              href="#services"
              data-cursor="EXPLORE"
              className="rounded-full bg-flame px-7 py-3.5 text-sm font-bold tracking-wide text-ink transition-[transform,background-color] hover:scale-105 hover:bg-white"
            >
              {hero.primaryCta}
            </a>
            <a
              href="#contact"
              data-cursor="VIEW"
              className="rounded-full border border-white/40 bg-forest-night/50 px-7 py-3.5 text-sm font-semibold tracking-wide text-white backdrop-blur-sm transition-colors hover:border-sky-soft hover:text-sky-soft"
            >
              {hero.secondaryCta} &middot; {business.phone}
            </a>
          </div>
        </div>

        {/* Scroll narrative caption */}
        <div className="pointer-events-none absolute inset-x-0 bottom-16 flex justify-center px-6">
          <p
            key={captionIndex}
            className="font-body animate-[fadeIn_0.6s_ease] text-xs font-semibold tracking-[0.3em] text-sky-soft md:text-sm"
          >
            {captions[captionIndex].text}
          </p>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
          <div className="h-9 w-[1px] animate-pulse bg-gradient-to-b from-sky-soft to-transparent" />
        </div>
      </div>
    </section>
  );
}
