"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { ArrowRight, Building2, Car, Check, Plane, Stamp, type LucideIcon } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "@/components/ui/section-heading";
import { SERVICES_DATA } from "@/data/mock-data";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  Stamp,
  Plane,
  Building2,
  Car,
};

const DEFAULT_ACTIVE_ID = "flights";

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const hasMounted = useRef(false);
  const [activeId, setActiveId] = useState(DEFAULT_ACTIVE_ID);

  const activeService = SERVICES_DATA.find((s) => s.id === activeId) ?? SERVICES_DATA[0];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-service-reveal]",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Skipped on first paint so it does not fight the scroll reveal above.
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-active='true'] [data-pillar]",
        { x: 16, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.07, delay: 0.25, ease: "power3.out" },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [activeId]);

  const handleKey = (event: KeyboardEvent, id: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setActiveId(id);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="services"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div data-service-reveal>
        <SectionHeading
          eyebrow="Four Pillars, One Desk"
          title="Everything a trip needs, under one roof"
          description="Paperwork, airfare, beds and wheels are handled by specialists who talk to each other, so nothing falls between the gaps."
        />
      </div>

      <div data-service-reveal className="hidden h-[500px] w-full items-stretch gap-3 lg:flex">
        {SERVICES_DATA.map((service) => {
          const Icon = ICONS[service.icon] ?? Plane;
          const isActive = service.id === activeId;

          return (
            <div
              key={service.id}
              data-active={isActive}
              className={cn(
                "relative overflow-hidden transition-[flex,border-radius,background-color,border-color,box-shadow] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[flex]",
                isActive
                  ? "min-w-0 flex-[1_1_0px] rounded-[28px] border border-brand-border bg-white shadow-card-hover"
                  : "flex-[0_0_74px] rounded-full border-[1.5px] border-white/10 bg-brand-navy shadow-card hover:border-brand-orange hover:bg-brand-navy-light",
              )}
            >
              <button
                type="button"
                onClick={() => setActiveId(service.id)}
                onKeyDown={(e) => handleKey(e, service.id)}
                aria-expanded={isActive}
                aria-label={`View ${service.title}`}
                tabIndex={isActive ? -1 : 0}
                className={cn(
                  "absolute inset-0 flex flex-col items-center justify-between pb-4 pt-6 transition-opacity duration-300",
                  isActive ? "pointer-events-none opacity-0" : "opacity-100",
                )}
              >
                <span className="mt-3.5 rotate-180 whitespace-nowrap text-sm font-bold tracking-wide text-slate-200 [writing-mode:vertical-rl]">
                  {service.title}
                </span>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-brand-orange shadow-md">
                  <Icon className="h-5 w-5" />
                </span>
              </button>

              <div
                aria-hidden={!isActive}
                className={cn(
                  "absolute inset-0 flex transition-opacity duration-[400ms]",
                  isActive ? "opacity-100 delay-150" : "pointer-events-none opacity-0",
                )}
              >
                <div className="relative h-full w-1/2 shrink-0 overflow-hidden bg-brand-navy">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    quality={85}
                    sizes="900px"
                    style={{ objectPosition: service.imagePosition }}
                    className="object-cover"
                  />
                </div>

                <div className="flex w-1/2 flex-col justify-center overflow-y-auto px-8 py-8 xl:px-11">
                  <ServiceInfo service={service} interactive={isActive} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div data-service-reveal className="lg:hidden">
        <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SERVICES_DATA.map((service) => {
            const Icon = ICONS[service.icon] ?? Plane;
            const isActive = service.id === activeId;
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => setActiveId(service.id)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border-[1.5px] px-4 py-2 text-[13px] font-bold transition-colors duration-200",
                  isActive
                    ? "border-brand-orange bg-brand-navy text-white"
                    : "border-brand-border bg-white text-brand-heading",
                )}
              >
                <Icon className="h-4 w-4" />
                {service.title}
              </button>
            );
          })}
        </div>

        <div
          data-active="true"
          className="overflow-hidden rounded-[20px] border border-brand-border bg-white shadow-card-hover"
        >
          <div className="relative h-60 w-full sm:h-72">
            <Image
              key={activeService.id}
              src={activeService.image}
              alt={activeService.title}
              fill
              quality={85}
              sizes="(min-width: 640px) 900px, 100vw"
              style={{ objectPosition: activeService.imagePosition }}
              className="object-cover"
            />
          </div>
          <div className="px-5 py-6 sm:px-8">
            <ServiceInfo service={activeService} interactive />
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceInfo({
  service,
  interactive,
}: {
  service: (typeof SERVICES_DATA)[number];
  interactive: boolean;
}) {
  return (
    <>
      <span className="mb-3 inline-block self-start rounded-full border border-brand-orange bg-brand-orange-light px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-orange">
        {service.badge}
      </span>
      <h3 className="mb-3 text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-3xl">
        {service.title}
      </h3>
      <p className="mb-5 text-sm leading-relaxed text-slate-500">{service.description}</p>

      <ul className="mb-6 flex flex-col gap-2.5">
        {service.pillars.map((pillar) => (
          <li
            key={pillar}
            data-pillar
            className="flex items-center gap-2.5 text-[13.5px] font-semibold text-slate-900"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-blue-light text-brand-blue">
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            {pillar}
          </li>
        ))}
      </ul>

      <a
        href="#contact"
        tabIndex={interactive ? 0 : -1}
        className="group/cta inline-flex items-center gap-1.5 self-start text-[15px] font-bold text-brand-orange transition-all duration-200 hover:gap-2.5 hover:text-brand-orange-hover"
      >
        {service.ctaLabel}
        <ArrowRight className="h-4 w-4" />
      </a>
    </>
  );
}
