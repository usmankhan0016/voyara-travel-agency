"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "@/components/ui/section-heading";
import { STATS_DATA } from "@/data/mock-data";
import { tiltProps } from "@/lib/tilt";
import { cn } from "@/lib/utils";

const CARD_TILT = tiltProps({ max: 5, scale: 1.02, lift: 8 });

/** 99.4 keeps one decimal while 150 counts in whole numbers. */
function formatValue(value: number, decimals: number) {
  return value.toFixed(decimals);
}

export function StatsCounter() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-stat-card]",
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

      if (reduceMotion) return;

      gsap.utils.toArray<HTMLElement>("[data-stat-value]").forEach((el) => {
        const target = Number(el.dataset.target ?? 0);
        const decimals = Number(el.dataset.decimals ?? 0);
        const counter = { value: 0 };

        gsap.to(counter, {
          value: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
          onUpdate: () => {
            el.textContent = formatValue(counter.value, decimals);
          },
          onComplete: () => {
            el.textContent = formatValue(target, decimals);
          },
        });
      });

      gsap.fromTo(
        "[data-stat-bar]",
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "bottom center",
          duration: 0.9,
          stagger: 0.04,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="stats"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <SectionHeading
        eyebrow="Measured, Not Claimed"
        title="Numbers our travellers hold us to"
        description="Every figure below comes from our own booking desk — approval rates, destination reach and the response times we answer for around the clock."
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STATS_DATA.map((stat, idx) => {
          const decimals = Number.isInteger(stat.value) ? 0 : 1;
          const isBlue = idx % 2 === 1;

          return (
            <article
              key={stat.label}
              data-stat-card
              {...CARD_TILT}
              className="group rounded-3xl border border-slate-100 bg-white p-6 shadow-card transition-[box-shadow,border-color] duration-300 hover:border-brand-orange/30 hover:shadow-card-hover"
            >
              <span className="mb-2 block text-xs font-semibold text-slate-400">{stat.label}</span>

              <div className="mb-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                {stat.prefix}
                <span data-stat-value data-target={stat.value} data-decimals={decimals}>
                  {formatValue(stat.value, decimals)}
                </span>
                {stat.suffix}
              </div>

              <p className="mb-5 text-xs leading-relaxed text-slate-500">{stat.sublabel}</p>

              <div className="flex h-12 items-end gap-1.5 border-t border-slate-100 pt-2">
                {stat.bars.map((height, barIdx) => {
                  const isPeak = height >= 80;
                  return (
                    <div
                      key={barIdx}
                      data-stat-bar
                      style={{ height: `${height}%` }}
                      className={cn(
                        "flex-1 rounded-t-sm transition-colors duration-500",
                        isPeak
                          ? isBlue
                            ? "bg-brand-blue"
                            : "bg-brand-orange"
                          : isBlue
                            ? "bg-slate-200 group-hover:bg-brand-blue/60"
                            : "bg-slate-200 group-hover:bg-brand-orange/60",
                      )}
                    />
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
