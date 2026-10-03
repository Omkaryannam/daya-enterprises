"use client";

import { useEffect, useState } from "react";
import { business, emailHrefWithMessage, serviceOptions } from "@/lib/content";
import { SELECT_SERVICE_EVENT } from "./ServiceModal";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

type FormState = {
  name: string;
  company: string;
  phone: string;
  email: string;
  service: string;
  details: string;
};

const initialState: FormState = {
  name: "",
  company: "",
  phone: "",
  email: "",
  service: serviceOptions[0],
  details: "",
};

export default function ContactSection() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "fallback" | "error">("idle");

  const update = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  // Lets a "Request a quote for this service" click in the Services modal
  // pre-select the matching option here, without introducing shared state.
  useEffect(() => {
    const onSelectService = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (serviceOptions.includes(detail)) {
        setForm((f) => ({ ...f, service: detail }));
      }
    };
    window.addEventListener(SELECT_SERVICE_EVENT, onSelectService);
    return () => window.removeEventListener(SELECT_SERVICE_EVENT, onSelectService);
  }, []);

  const openMailFallback = () => {
    const subject = encodeURIComponent(`Consultation request — ${form.service}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nCompany: ${form.company}\nPhone: ${form.phone}\nEmail: ${form.email}\nService Required: ${form.service}\n\nProject Details:\n${form.details}`
    );
    const link = document.createElement("a");
    link.href = `${business.emailHref}?subject=${subject}&body=${body}`;
    link.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("sent");
        return;
      }

      // Backend isn't configured yet (or failed) — fall back to opening an email draft.
      openMailFallback();
      setStatus("fallback");
    } catch {
      openMailFallback();
      setStatus("fallback");
    }
  };

  return (
    <section id="contact" aria-label="Contact Daya Enterprises" className="relative bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="GET IN TOUCH"
          title="Request a consultation"
          body="Tell us about your project and the Daya Enterprises team will get back to you."
        />

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <div className="h-full rounded-2xl border border-line bg-white p-7 shadow-[0_1px_2px_rgba(26,26,26,0.05)]">
              <h3 className="font-display text-lg font-bold text-ink">{business.name}</h3>
              <p className="mt-1 text-sm text-ink-soft">{business.addressLine1}</p>
              <p className="text-sm text-ink-soft">{business.addressLine2}</p>

              <div className="mt-6 space-y-4">
                <a
                  href={business.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="VIEW"
                  aria-label="Chat with Daya Enterprises on WhatsApp"
                  className="group flex items-center gap-3 text-sm font-medium text-ink transition-colors hover:text-sky-ink"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest text-white transition-colors group-hover:bg-sky group-hover:text-ink">
                    &#9742;
                  </span>
                  {business.name}
                </a>
                <a
                  href={emailHrefWithMessage}
                  data-cursor="VIEW"
                  aria-label="Email Daya Enterprises"
                  className="group flex items-center gap-3 text-sm font-medium text-ink transition-colors hover:text-sky-ink"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest text-white transition-colors group-hover:bg-sky group-hover:text-ink">
                    &#9993;
                  </span>
                  {business.email}
                </a>
              </div>

              <div className="mt-8 aspect-[4/3] w-full overflow-hidden rounded-xl border border-line bg-paper-alt">
                <iframe
                  title="Daya Enterprises location"
                  src={`https://www.google.com/maps?q=${business.mapCoords}&z=16&output=embed`}
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="rounded-2xl border border-line bg-white p-7 shadow-[0_1px_2px_rgba(26,26,26,0.05)]">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Name" required>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={update("name")}
                    className={inputClass}
                    autoComplete="name"
                  />
                </Field>
                <Field label="Company">
                  <input
                    type="text"
                    value={form.company}
                    onChange={update("company")}
                    className={inputClass}
                    autoComplete="organization"
                  />
                </Field>
                <Field label="Phone" required>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={update("phone")}
                    className={inputClass}
                    autoComplete="tel"
                  />
                </Field>
                <Field label="Email" required>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={update("email")}
                    className={inputClass}
                    autoComplete="email"
                  />
                </Field>
                <Field label="Service Required" full>
                  <select value={form.service} onChange={update("service")} className={inputClass}>
                    {serviceOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Project Details" full>
                  <textarea
                    value={form.details}
                    onChange={update("details")}
                    rows={4}
                    className={`${inputClass} resize-none`}
                  />
                </Field>
              </div>

              <button
                type="submit"
                data-cursor="SEND"
                disabled={status === "sending"}
                className="mt-6 w-full rounded-full bg-flame py-3.5 text-sm font-bold tracking-wide text-ink transition-[transform,background-color] hover:scale-[1.02] hover:bg-flame-deep hover:text-white disabled:opacity-60 disabled:hover:scale-100 sm:w-auto sm:px-8"
              >
                {status === "sending" ? "Sending..." : "Request a Consultation"}
              </button>

              {status === "sent" && (
                <p role="status" className="mt-4 text-sm font-medium text-forest">
                  Thanks, {form.name.split(" ")[0] || "there"} — your request has been sent to {business.name}. We&apos;ll get back to you shortly.
                </p>
              )}
              {status === "fallback" && (
                <p role="status" className="mt-4 text-sm font-medium text-forest">
                  Your email app should now be open with this request pre-filled — press send to reach{" "}
                  {business.name}.
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const inputClass =
  "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/75 focus:border-sky";

function Field({
  label,
  children,
  required,
  full,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  full?: boolean;
}) {
  return (
    <label className={`block text-xs font-semibold tracking-wide text-ink-soft ${full ? "sm:col-span-2" : ""}`}>
      {label} {required && <span className="text-flame-deep">*</span>}
      <div className="mt-2">{children}</div>
    </label>
  );
}
