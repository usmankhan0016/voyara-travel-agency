"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "@/components/ui/section-heading";
import { TESTIMONIALS_DATA } from "@/data/mock-data";
import { cn } from "@/lib/utils";

const COUNT = TESTIMONIALS_DATA.length;

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const hasMounted = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const active = TESTIMONIALS_DATA[activeIndex];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-review-reveal]",
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

  // Entrance half of the swap: `goTo` sets the index, so this runs after the repaint.
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          isAnimating.current = false;
        },
      });

      tl.fromTo(
        "[data-review-tag]",
        { y: 8, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.25, ease: "power2.out" },
        0,
      )
        .fromTo(
          "[data-review-quote]",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35, ease: "power3.out" },
          0,
        )
        .fromTo(
          "[data-review-author]",
          { x: -8, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.25, ease: "power2.out" },
          0,
        )
        .fromTo(
          portraitRef.current,
          { opacity: 0, scale: 1.03, filter: "blur(10px)" },
          { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.4, ease: "power3.out" },
          0,
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [activeIndex]);

  const goTo = (index: number) => {
    if (isAnimating.current || index === activeIndex) return;
    isAnimating.current = true;

    const tl = gsap.timeline({
      onComplete: () => setActiveIndex(index),
    });

    tl.to(
      copyRef.current?.querySelectorAll(
        "[data-review-tag],[data-review-quote],[data-review-author]",
      ) ?? [],
      { y: -14, opacity: 0, duration: 0.22, ease: "power2.in" },
      0,
    ).to(
      portraitRef.current,
      { opacity: 0, scale: 0.97, filter: "blur(10px)", duration: 0.25, ease: "power2.in" },
      0,
    );
  };

  const next = () => goTo((activeIndex + 1) % COUNT);
  const prev = () => goTo((activeIndex - 1 + COUNT) % COUNT);

  return (
    <section
      ref={sectionRef}
      id="reviews"
      className="bg-brand-canvas py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div data-review-reveal>
          <SectionHeading
            eyebrow="Client Success Stories"
            title="What our travellers say when they land"
            description="Three recent trips, in their own words — from embassy paperwork cleared in under a week to a rebooked flight at midnight."
          />
        </div>

        <div
          data-review-reveal
          onClick={next}
          className="grid cursor-pointer grid-cols-1 items-center gap-8 rounded-3xl border border-brand-border bg-white p-7 shadow-card-hover transition-all duration-300 sm:p-9 md:grid-cols-[1fr_auto] md:gap-10 md:p-10"
        >
          <div ref={copyRef} className="flex w-full min-w-0 flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <span
                data-review-tag
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-brand-heading"
              >
                <span className="h-0.5 w-5 bg-brand-orange" />
                {active.service}
              </span>

              <span className="flex items-center gap-[3px]">
                {Array.from({ length: active.rating }).map((_, idx) => (
                  <Star key={idx} className="h-[15px] w-[15px] fill-brand-orange text-brand-orange" />
                ))}
              </span>
            </div>

            <div className="relative flex min-h-[110px] w-full items-center overflow-hidden">
              <Quote
                className="pointer-events-none absolute -left-2.5 -top-2.5 h-14 w-14 text-brand-heading opacity-5"
                aria-hidden="true"
              />
              <blockquote
                data-review-quote
                className="w-full text-lg font-medium leading-relaxed tracking-tight text-brand-heading sm:text-xl md:text-2xl"
              >
                &ldquo;{active.content}&rdquo;
              </blockquote>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3.5 border-t border-slate-100 pt-3.5">
              <span data-review-author className="flex items-center gap-3">
                <span className="h-0.5 w-6 bg-brand-orange" />
                <span className="block">
                  <span className="block text-[15px] font-bold text-brand-heading">{active.name}</span>
                  <span className="block text-[13px] font-medium text-brand-muted">{active.role}</span>
                </span>
              </span>

              <span className="rounded-md border border-brand-border bg-brand-canvas px-3 py-1.5 text-xs font-bold text-brand-heading">
                {active.stats}
              </span>
            </div>
          </div>

          <div className="group/portrait relative mx-auto h-[260px] w-[200px] shrink-0">
            <div
              ref={portraitRef}
              className="h-full w-full overflow-hidden rounded-[18px] border border-brand-border bg-brand-canvas shadow-card-hover"
            >
              <Image
                key={active.id}
                src={active.avatar}
                alt={active.name}
                width={200}
                height={260}
                className="h-full w-full object-cover object-top"
              />
            </div>

            <span className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap text-xs font-semibold text-brand-muted opacity-65 transition-all duration-200 group-hover/portrait:-translate-y-0.5 group-hover/portrait:opacity-100">
              Next story
              <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
        </div>

        <div data-review-reveal className="mt-10 flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            {TESTIMONIALS_DATA.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Go to testimonial ${index + 1}`}
                aria-current={index === activeIndex}
                className="px-1 py-1.5"
              >
                <span
                  className={cn(
                    "block h-2 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    index === activeIndex ? "w-[26px] bg-brand-orange" : "w-2 bg-slate-300",
                  )}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous testimonial"
              className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-slate-300 bg-white text-brand-heading shadow-pill transition-colors duration-200 hover:border-brand-orange hover:bg-brand-orange hover:text-white"
            >
              <ChevronLeft className="h-[19px] w-[19px]" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next testimonial"
              className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-slate-300 bg-white text-brand-heading shadow-pill transition-colors duration-200 hover:border-brand-orange hover:bg-brand-orange hover:text-white"
            >
              <ChevronRight className="h-[19px] w-[19px]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
