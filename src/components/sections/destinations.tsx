"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Bookmark, MapPin, Star } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  DESTINATIONS_DATA,
  DESTINATION_CATEGORIES,
  type DestinationCategory,
} from "@/data/mock-data";
import { resetTilt, tiltProps } from "@/lib/tilt";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 6500;
const SLIDE_DURATION = 0.85;
const CARD_TILT = tiltProps({ max: 6, scale: 1.03, lift: 8 });

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface Incoming {
  index: number;
  from: number;
  to: number;
  rect: { top: number; right: number; bottom: number; left: number } | null;
}

export function Destinations() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLSpanElement>(null);
  const morphRef = useRef<HTMLDivElement>(null);
  const morphImageRef = useRef<HTMLDivElement>(null);

  const viRef = useRef(0);
  const stepRef = useRef(0);
  const busyRef = useRef(false);
  const enteredRef = useRef(false);
  const reducedRef = useRef(false);

  const [category, setCategory] = useState<DestinationCategory>("All");
  const [activeIndex, setActiveIndex] = useState(0);
  const [incoming, setIncoming] = useState<Incoming | null>(null);
  const [hiddenKey, setHiddenKey] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState<string[]>([]);
  const [paused, setPaused] = useState(false);

  const items = useMemo(
    () =>
      category === "All"
        ? DESTINATIONS_DATA
        : DESTINATIONS_DATA.filter((item) => item.category === category),
    [category],
  );
  const count = items.length;
  // Tripled so the track never runs out of cards; a lone destination is doubled
  // because the track parks one slot left and would otherwise show an empty queue.
  const loop = useMemo(
    () => (count > 1 ? [...items, ...items, ...items] : [...items, ...items]),
    [items, count],
  );

  const active = items[activeIndex] ?? items[0];

  const trackX = (virtual: number) => -((virtual + 1) * stepRef.current);

  // Measure one card + gap so the track can be shifted by whole slots.
  const measure = useCallback((reposition = true) => {
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!track || !card) return 0;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    stepRef.current = card.offsetWidth + gap;
    if (reposition && !busyRef.current) gsap.set(track, { x: trackX(viRef.current) });
    return stepRef.current;
  }, []);

  useIsoLayoutEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    measure();
    const observer = new ResizeObserver(() => measure());
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [measure]);

  const advance = useCallback((by: number, cardEl?: HTMLElement | null, key?: string) => {
    if (busyRef.current || by === 0 || Math.abs(by) >= count) return;
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;
    if (!stepRef.current && !measure(false)) return;

    busyRef.current = true;

    let from = viRef.current;
    let to = from + by;
    if (to < 0) {
      from += count;
      to += count;
      gsap.set(trackRef.current, { x: trackX(from) });
    }

    let rect: Incoming["rect"] = null;
    if (cardEl) {
      const card = cardEl.getBoundingClientRect();
      const section = sectionEl.getBoundingClientRect();
      rect = {
        top: card.top - section.top,
        right: section.right - card.right,
        bottom: section.bottom - card.bottom,
        left: card.left - section.left,
      };
      if (key) setHiddenKey(key);
    }

    setIncoming({ index: ((to % count) + count) % count, from, to, rect });
  }, [count, measure]);

  const next = useCallback(() => advance(1), [advance]);
  const prev = useCallback(() => advance(-1), [advance]);

  // Reset rather than animate: the track is rebuilt around a different collection.
  const selectCategory = (nextCategory: DestinationCategory) => {
    if (nextCategory === category) return;
    busyRef.current = false;
    viRef.current = 0;
    setIncoming(null);
    setHiddenKey(null);
    setActiveIndex(0);
    setCategory(nextCategory);
  };

  // Morph the card into the background, shift the track, swap the copy.
  useIsoLayoutEffect(() => {
    if (!incoming) return;
    const morphEl = morphRef.current;
    const sectionEl = sectionRef.current;
    if (!morphEl || !sectionEl) return;

    const fast = reducedRef.current;
    const duration = fast ? 0.25 : SLIDE_DURATION;
    const { rect } = incoming;

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        viRef.current = ((incoming.to % count) + count) % count;
        gsap.set(trackRef.current, { x: trackX(viRef.current) });
        gsap.set(morphEl, { clearProps: "clipPath,opacity" });
        setActiveIndex(incoming.index);
        setHiddenKey(null);
        setIncoming(null);
      },
    });

    if (rect) {
      gsap.set(morphEl, {
        opacity: 1,
        clipPath: `inset(${rect.top}px ${rect.right}px ${rect.bottom}px ${rect.left}px round 24px)`,
      });
      tl.to(morphEl, { clipPath: "inset(0px 0px 0px 0px round 0px)", duration }, 0);
      tl.fromTo(morphImageRef.current, { scale: 1.08 }, { scale: 1, duration }, 0);
    } else {
      gsap.set(morphEl, { opacity: 0, clipPath: "inset(0px 0px 0px 0px round 0px)" });
      tl.to(morphEl, { opacity: 1, duration: duration * 0.8, ease: "power2.out" }, 0);
      tl.fromTo(morphImageRef.current, { scale: 1.06 }, { scale: 1, duration }, 0);
    }

    tl.to(trackRef.current, { x: trackX(incoming.to), duration }, 0);

    const copy = gsap.utils.toArray<HTMLElement>("[data-slide-text]", copyRef.current);
    tl.to(copy, { y: -26, opacity: 0, duration: fast ? 0.15 : 0.35, ease: "power2.in", stagger: 0.04 }, 0);
    tl.to(watermarkRef.current, { opacity: 0, duration: fast ? 0.15 : 0.3, ease: "power2.in" }, 0);

    return () => {
      tl.kill();
    };
  }, [count, incoming]);

  const hasFiltered = useRef(false);
  useIsoLayoutEffect(() => {
    if (!hasFiltered.current) {
      hasFiltered.current = true;
      return;
    }

    busyRef.current = false;
    viRef.current = 0;
    measure(false);
    gsap.set(trackRef.current, { x: trackX(0) });
    gsap.set(morphRef.current, { clearProps: "clipPath,opacity" });

    const cards = gsap.utils.toArray<HTMLElement>("[data-queue-card]", trackRef.current);
    const tl = gsap.timeline();
    tl.fromTo(
      cards.slice(0, 6),
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.06,
        ease: "power3.out",
        clearProps: "transform",
      },
    );

    return () => {
      tl.kill();
      gsap.set(cards, { opacity: 1, clearProps: "transform" });
    };
  }, [category, measure]);

  // Mount-only: a `from` tween applies its start state at once, so killing one
  // before its trigger fires would strand the element at opacity 0.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const trigger = { trigger: sectionRef.current, start: "top 75%", once: true };
      gsap.from("[data-slide-text]", {
        y: 26,
        opacity: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: trigger,
      });
      gsap.from(watermarkRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: trigger,
      });
      gsap.from(gsap.utils.toArray<HTMLElement>("[data-queue-card]", trackRef.current).slice(0, 6), {
        x: 60,
        opacity: 0,
        duration: 0.7,
        stagger: 0.07,
        ease: "power3.out",
        clearProps: "opacity,transform",
        scrollTrigger: trigger,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useIsoLayoutEffect(() => {
    busyRef.current = false;
    if (!enteredRef.current) {
      enteredRef.current = true;
      return;
    }

    const copy = gsap.utils.toArray<HTMLElement>("[data-slide-text]", copyRef.current);
    const targets = [...copy, watermarkRef.current];
    const tl = gsap.timeline();
    tl.fromTo(
      copy,
      { y: 26, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.07, ease: "power3.out" },
      0,
    ).fromTo(
      watermarkRef.current,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      0,
    );

    return () => {
      tl.kill();
      gsap.set(targets, { y: 0, opacity: 1 });
    };
  }, [activeIndex, category]);

  useEffect(() => {
    if (paused || incoming || reducedRef.current || count < 2) return;
    const id = window.setTimeout(next, AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [paused, incoming, next, activeIndex, count]);

  const toggleBookmark = (id: string) =>
    setBookmarked((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id],
    );

  const controlClass =
    "flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/15 text-white backdrop-blur-md transition-colors duration-300 enabled:hover:bg-white enabled:hover:text-brand-navy disabled:cursor-not-allowed disabled:opacity-40";

  const controls = (
    <>
      <button
        type="button"
        onClick={prev}
        disabled={count < 2}
        aria-label="Previous destination"
        className={controlClass}
      >
        <ArrowLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={next}
        disabled={count < 2}
        aria-label="Next destination"
        className={controlClass}
      >
        <ArrowRight className="h-4 w-4" />
      </button>
    </>
  );

  return (
    <section
      ref={sectionRef}
      id="destinations"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="relative isolate flex w-full flex-col justify-center overflow-hidden py-14 sm:py-16 lg:min-h-[680px] lg:py-20"
    >
      <div className="absolute inset-0 -z-20">
        <Image
          key={active.id}
          src={active.image}
          alt={active.locationTag}
          fill
          quality={85}
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div
        ref={morphRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 opacity-0 will-change-[clip-path]"
      >
        <div ref={morphImageRef} className="absolute inset-0">
          {/* Idles on the next slide so it is decoded before it is needed. */}
          <Image
            src={(items[incoming?.index ?? (activeIndex + 1) % count] ?? active).image}
            alt=""
            fill
            quality={85}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-brand-navy/90 via-brand-navy/55 to-brand-navy/20" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-brand-navy/80 via-transparent to-brand-navy/45" />

      <span
        ref={watermarkRef}
        aria-hidden
        className="pointer-events-none absolute bottom-6 left-0 -z-10 w-full select-none px-4 text-[17vw] font-extrabold uppercase leading-none tracking-tighter text-white/[0.07] sm:px-6 lg:px-8 lg:text-[11vw]"
      >
        {active.headline}
      </span>

      <div
        className={cn(
          "absolute left-5 top-1/2 z-10 -translate-y-1/2 flex-col items-center gap-3",
          count > 1 ? "hidden xl:flex" : "hidden",
        )}
      >
        <span className="h-14 w-px bg-gradient-to-b from-transparent to-white/30" />
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => advance(index - viRef.current)}
              aria-label={`Show ${item.headline}`}
              aria-current={isActive}
              className={
                isActive
                  ? "flex h-8 w-8 items-center justify-center rounded-full border border-white/60 bg-white/15 text-[10px] font-bold text-white backdrop-blur-md"
                  : "h-2 w-2 rounded-full bg-white/40 transition-transform duration-300 hover:scale-150 hover:bg-white"
              }
            >
              {isActive ? String(index + 1).padStart(2, "0") : null}
            </button>
          );
        })}
        <span className="h-14 w-px bg-gradient-to-t from-transparent to-white/30" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:gap-10 lg:px-8 xl:pl-20">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/40 bg-white/20 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
              <MapPin className="h-3.5 w-3.5 text-brand-orange" />
              Popular Destinations
            </span>

            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter destinations by region">
              {DESTINATION_CATEGORIES.map((option) => {
                const isActive = option === category;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => selectCategory(option)}
                    aria-pressed={isActive}
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-xs font-semibold backdrop-blur-md transition-colors duration-200",
                      isActive
                        ? "border-brand-orange bg-brand-orange text-white shadow-lg shadow-brand-orange/25"
                        : "border-white/35 bg-white/10 text-white/85 hover:border-white/60 hover:bg-white/20 hover:text-white",
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="hidden items-center gap-3 lg:flex">{controls}</div>
        </div>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-8">
          <div ref={copyRef} className="w-full min-w-0 shrink-0 lg:w-[44%]">
            <span
              data-slide-text
              className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange"
            >
              {active.country}
            </span>

            <h2
              data-slide-text
              className="mt-3 text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-white drop-shadow-[0_6px_20px_rgba(0,0,0,0.45)] sm:text-6xl lg:text-[4.5rem] xl:text-[5.25rem]"
            >
              {active.headline}
            </h2>

            <p
              data-slide-text
              className="mt-4 max-w-lg text-sm font-medium leading-relaxed text-white/85 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] sm:text-base"
            >
              {active.description}
            </p>

            <div data-slide-text className="mt-7 flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="group flex items-center gap-2.5 rounded-full bg-brand-orange py-2 pl-6 pr-2 font-semibold text-white shadow-lg shadow-brand-orange/30 transition-colors duration-300 hover:bg-brand-orange-hover"
              >
                <span className="text-sm">Explore</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </a>

              <div className="flex items-center gap-2 text-xs font-medium text-white/80">
                <Star className="h-4 w-4 fill-brand-orange text-brand-orange" />
                <span className="font-bold text-white">{active.rating.toFixed(2)}</span>
                <span>· {active.duration} · from {active.price}</span>
              </div>
            </div>
          </div>

          {/* Absolute track so its width never feeds the flex row; the clip-path trims
              only the left edge, letting the queue still bleed off-screen right. */}
          <div className="relative h-[244px] w-full min-w-0 [clip-path:inset(-60px_-100vw_-60px_0px)] sm:h-[284px] lg:h-[318px] lg:w-[56%] xl:h-[344px]">
            <div
              ref={trackRef}
              className="absolute left-0 top-0 flex w-max items-start gap-4 will-change-transform lg:gap-5"
            >
              {loop.map((item, index) => {
                const key = `${item.id}-${index}`;
                const isSaved = bookmarked.includes(item.id);
                return (
                  <div
                    key={key}
                    data-queue-card
                    className={`w-[150px] shrink-0 sm:w-[180px] lg:w-[205px] xl:w-[225px] ${
                      hiddenKey === key ? "opacity-0" : ""
                    }`}
                  >
                    <div className="mb-2 flex h-9 flex-col justify-end px-1">
                      <span className="truncate text-xs font-semibold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
                        {item.locationTag}
                      </span>
                      <span className="mt-1 flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, star) => (
                          <Star
                            key={star}
                            className={
                              star < Math.round(item.rating)
                                ? "h-2.5 w-2.5 fill-brand-orange text-brand-orange"
                                : "h-2.5 w-2.5 text-white/40"
                            }
                          />
                        ))}
                      </span>
                    </div>

                    <div
                      role="button"
                      tabIndex={0}
                      aria-label={`Show ${item.headline}`}
                      {...CARD_TILT}
                      onClick={(event) => {
                        // The morph reads this card's box, so drop the tilt first.
                        resetTilt(event.currentTarget);
                        advance(index - viRef.current, event.currentTarget, key);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          resetTilt(event.currentTarget);
                          advance(index - viRef.current, event.currentTarget, key);
                        }
                      }}
                      className="group relative aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-3xl border border-white/25 shadow-2xl"
                    >
                      <Image
                        src={item.image}
                        alt={item.locationTag}
                        fill
                        quality={85}
                        loading={index < 6 ? "eager" : "lazy"}
                        sizes="(max-width: 640px) 180px, (max-width: 1280px) 256px, 320px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-navy/50 via-transparent to-transparent" />
                      <button
                        type="button"
                        aria-label={isSaved ? `Remove ${item.headline} from saved` : `Save ${item.headline}`}
                        aria-pressed={isSaved}
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleBookmark(item.id);
                        }}
                        className="glass-pill absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-brand-navy transition-colors duration-300 hover:bg-white"
                      >
                        <Bookmark
                          className={isSaved ? "h-4 w-4 fill-brand-orange text-brand-orange" : "h-4 w-4"}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 lg:hidden">{controls}</div>

          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {items.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => advance(index - viRef.current)}
                  aria-label={`Show ${item.headline}`}
                  className={
                    index === activeIndex
                      ? "h-1 w-8 rounded-full bg-brand-orange transition-all duration-300"
                      : "h-1 w-3 rounded-full bg-white/40 transition-all duration-300 hover:bg-white"
                  }
                />
              ))}
            </div>
            <span className="text-xs font-semibold tabular-nums text-white/90">
              {String(activeIndex + 1).padStart(2, "0")}
              <span className="text-white/50"> / {String(count).padStart(2, "0")}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
