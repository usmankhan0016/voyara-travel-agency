"use client";

import { useEffect, useRef } from "react";
import { BadgeCheck, Building2, Car, Plane, Stamp, type LucideIcon } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PARTNERS_DATA } from "@/data/mock-data";

const ICONS: Record<string, LucideIcon> = { BadgeCheck, Plane, Building2, Car, Stamp };

function PartnerLogo({ partner }: { partner: (typeof PARTNERS_DATA)[number] }) {
  const Icon = ICONS[partner.icon];
  return (
    <div className="group flex shrink-0 cursor-pointer items-center gap-2.5 px-6 py-2 text-slate-700 transition-colors hover:text-brand-orange sm:px-8 md:px-10">
      <Icon className="h-5 w-5 text-slate-400 transition-colors group-hover:text-brand-orange" />
      <div className="flex flex-col whitespace-nowrap">
        <span className="text-sm font-extrabold tracking-wider sm:text-base">{partner.name}</span>
        <span className="text-[10px] font-medium tracking-tight text-slate-400">{partner.category}</span>
      </div>
    </div>
  );
}

export function Partners() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-partner-label]",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="partners" className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div data-partner-label className="mb-8 text-center">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400 sm:text-sm">
          Our Trusted Partner
        </span>
      </div>

      <div className="group/marquee overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee group-hover/marquee:[animation-play-state:paused] motion-reduce:animate-none">
          <div className="flex shrink-0">
            {PARTNERS_DATA.map((partner) => (
              <PartnerLogo key={partner.name} partner={partner} />
            ))}
          </div>
          <div className="flex shrink-0" aria-hidden="true">
            {PARTNERS_DATA.map((partner) => (
              <PartnerLogo key={partner.name} partner={partner} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
