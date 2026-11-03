"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Globe2 } from "lucide-react";
import gsap from "gsap";
import { HERO_AVATARS, HERO_CONTENT } from "@/data/mock-data";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-item]",
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.15,
        },
      );
      gsap.fromTo(
        "[data-hero-float]",
        { y: 24, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          delay: 0.9,
          ease: "back.out(1.4)",
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex w-full flex-col justify-center min-h-[85svh] overflow-hidden pb-16 pt-28 sm:min-h-[100svh] sm:pb-20 sm:pt-40"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src={HERO_CONTENT.image}
          alt={HERO_CONTENT.imageAlt}
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-[center_40%]"
        />
        <div className="pointer-events-none absolute inset-0 w-full bg-gradient-to-r from-black/65 via-black/30 to-transparent lg:w-8/12" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t sm:h-40 from-brand-canvas via-brand-canvas/40 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center sm:mx-0 sm:text-left">
          <div>
            <div
              data-hero-item
              className="mb-5 inline-flex sm:mb-6 items-center gap-2 rounded-full border border-white/40 bg-white/25 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm backdrop-blur-md"
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-brand-orange" />
              {HERO_CONTENT.eyebrow}
            </div>

            <h1
              data-hero-item
              className="text-4xl font-extrabold leading-[1.12] tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] sm:text-4xl md:text-5xl lg:text-[4.25rem]"
            >
              {HERO_CONTENT.headline}
            </h1>

            <p
              data-hero-item
              className="mx-auto mt-5 max-w-xl text-base sm:mx-0 font-medium leading-relaxed text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] sm:mt-7 md:text-lg"
            >
              {HERO_CONTENT.subtext}
            </p>

            <div
              data-hero-item
              className="mt-7 flex flex-col items-stretch gap-5 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:justify-start sm:gap-4"
            >
              <a
                href="#destinations"
                className="group relative flex w-full items-center justify-center gap-2.5 rounded-full bg-brand-orange px-3 py-4 font-semibold sm:w-auto sm:justify-start sm:py-2 sm:pl-5 sm:pr-2 text-white shadow-lg shadow-brand-orange/30 transition-all duration-300 hover:bg-brand-orange-hover"
              >
                <span className="text-[17px] sm:text-sm">Explore Destinations</span>
                <span className="absolute right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 sm:static sm:h-8 sm:w-8">
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </a>

            <div className="flex items-center justify-center gap-3 sm:rounded-full sm:border sm:border-white/40 sm:bg-white/85 sm:p-2 sm:pr-5 sm:shadow-glass sm:backdrop-blur-md">
              <div className="flex -space-x-2.5 p-0.5">
                {HERO_AVATARS.map((src) => (
                  <Image
                    key={src}
                    src={src}
                    alt=""
                    width={32}
                    height={32}
                    className="inline-block h-8 w-8 rounded-full object-cover ring-2 ring-white"
                  />
                ))}
              </div>
              <p className="text-xs text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.6)] sm:text-slate-800 sm:[text-shadow:none]">
                <span className="font-extrabold text-white sm:text-slate-900">24k+</span>{" "}
                travellers booked{" "}
                <span className="font-semibold text-brand-orange">with us</span>
              </p>
            </div>
            </div>

            <a
              href="#destinations"
              data-hero-item
              className="glass-card mt-10 flex items-center gap-4 rounded-3xl border border-white bg-white/95 p-3.5 text-left shadow-2xl lg:hidden"
            >
              <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-2xl">
                <Image
                  src={HERO_CONTENT.previewImage}
                  alt="Featured travel destination"
                  fill
                  sizes="72px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="mb-1 inline-block rounded-full bg-brand-blue/95 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-white">
                  FEATURED
                </span>
                <div className="flex items-center gap-1.5 text-base font-extrabold tracking-tight text-slate-900">
                  <Globe2 className="h-4 w-4 text-brand-orange" />
                  150+ destinations
                </div>
                <p className="text-[11px] font-medium leading-snug text-slate-500">
                  Vetted stays and local guides.
                </p>
              </div>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-navy text-white shadow-md">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </a>
          </div>
        </div>

          <a
            href="#destinations"
            data-hero-float
            className="glass-card group hidden w-[260px] lg:absolute lg:bottom-0 lg:right-8 rounded-3xl border border-white bg-white/95 p-3.5 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-brand-orange/40 lg:block"
          >
            <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={HERO_CONTENT.previewImage}
                alt="Featured travel destination"
                fill
                sizes="260px"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <span className="absolute left-2 top-2 rounded-full bg-brand-blue/95 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-white shadow-sm backdrop-blur-md">
                FEATURED
              </span>
            </div>
            <div className="flex items-end justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5 text-xl font-extrabold tracking-tight text-slate-900">
                  <Globe2 className="h-4 w-4 text-brand-orange" />
                  150+
                </div>
                <p className="mt-0.5 text-[11px] font-medium leading-snug text-slate-500">
                  Destinations with vetted stays and local guides.
                </p>
              </div>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-navy text-white shadow-md transition-colors duration-300 group-hover:bg-brand-orange">
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </a>
      </div>
    </section>
  );
}
