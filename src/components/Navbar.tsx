"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import { nav, business } from "@/lib/content";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-transparent text-white transition-[padding] duration-300 ${
        scrolled ? "py-2" : "py-3"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10"
      >
        <a href="#home" data-cursor="VIEW" aria-label="Daya Enterprises - home">
          <Logo
            priority
            heightClass={scrolled ? "h-6 md:h-7" : "h-7 md:h-8"}
          />
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                data-cursor="VIEW"
                className="relative py-1 text-sm font-medium tracking-wide text-white/85 transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-sky-soft after:transition-transform after:duration-200 hover:text-white hover:after:scale-x-100"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          data-cursor="EXPLORE"
          className="hidden rounded-full bg-flame px-5 py-2 text-xs font-bold tracking-[0.15em] text-ink transition-[transform,background-color] hover:scale-105 hover:bg-white md:inline-block"
        >
          GET A QUOTE
        </a>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`h-[2px] w-6 bg-white transition-transform ${
              open ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`h-[2px] w-6 bg-white transition-opacity ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`h-[2px] w-6 bg-white transition-transform ${
              open ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      <div
        className={`grid overflow-hidden transition-[grid-template-rows] duration-300 md:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="glass mx-4 mt-3 flex flex-col gap-1 rounded-2xl p-4">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-base font-medium text-white/90 hover:bg-white/10"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-2 block rounded-lg bg-flame px-3 py-3 text-center text-sm font-bold tracking-wide text-ink"
              >
                Get a Quote
              </a>
            </li>
            <li className="px-3 pt-2 text-xs text-white/70">
              Call {business.phone}
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
