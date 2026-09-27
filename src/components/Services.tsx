"use client";

import { useState } from "react";
import { serviceCards, type ServiceCard as ServiceCardType } from "@/lib/content";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import ServiceCard from "./ServiceCard";
import ServiceModal from "./ServiceModal";

export default function Services() {
  const [activeService, setActiveService] = useState<ServiceCardType | null>(null);

  return (
    <section id="services" aria-label="Our services" className="relative bg-paper-alt py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="WHAT WE DO"
          title="Engineering, technology & infrastructure services"
          body="Explore the core services Daya Enterprises delivers across LED display, surveillance, road safety and fabrication."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {serviceCards.map((service, i) => (
            <Reveal key={service.index} delay={(i % 3) * 0.06} className="h-full">
              <ServiceCard service={service} onExplore={setActiveService} />
            </Reveal>
          ))}
        </div>
      </div>

      <ServiceModal service={activeService} onClose={() => setActiveService(null)} />
    </section>
  );
}
