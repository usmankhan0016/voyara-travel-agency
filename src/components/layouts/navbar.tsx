"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, Plane, X } from "lucide-react";
import gsap from "gsap";
import { BRAND, NAV_LINKS } from "@/data/mock-data";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Home");
  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((l) =>
      document.querySelector(l.href),
    ).filter((el): el is Element => !!el);
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const link = NAV_LINKS.find(
              (l) => l.href === `#${entry.target.id}`,
            );
            if (link) setActiveNav(link.name);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (drawerRef.current) gsap.set(drawerRef.current, { xPercent: 100 });
  }, []);

  // No ctx.revert(): it would snap interrupted tweens back and cause visible jumps.
  useEffect(() => {
    const drawer = drawerRef.current;
    const backdrop = backdropRef.current;
    if (!drawer || !backdrop) return;
    const items = drawer.querySelectorAll("[data-drawer-item]");
    gsap.killTweensOf([drawer, backdrop, items]);

    if (menuOpen) {
      gsap.set([drawer, backdrop], { visibility: "visible" });
      gsap.to(backdrop, { opacity: 1, duration: 0.3, ease: "power1.out" });
      gsap.to(drawer, { xPercent: 0, duration: 0.45, ease: "power3.out" });
      gsap.fromTo(
        items,
        { x: 24, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.05,
          delay: 0.12,
          ease: "power2.out",
        },
      );
    } else {
      gsap.to(backdrop, {
        opacity: 0,
        duration: 0.25,
        ease: "power1.in",
        onComplete: () => {
          gsap.set(backdrop, { visibility: "hidden" });
        },
      });
      gsap.to(drawer, {
        xPercent: 100,
        duration: 0.35,
        ease: "power3.in",
        onComplete: () => {
          gsap.set(drawer, { visibility: "hidden" });
        },
      });
    }
  }, [menuOpen]);

  // iOS needs the root element locked too, not just body.
  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setMenuOpen(false);
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
    };
  }, [menuOpen]);

  useEffect(
    () => () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    },
    [],
  );

  const handleNavClick = (href: string, name: string) => {
    setActiveNav(name);
    // Unlock synchronously, or scrollIntoView is ignored while the lock still applies.
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,padding] duration-300",
          isScrolled
            ? "bg-white/90 py-2.5 shadow-sm backdrop-blur-xl sm:py-3"
            : "bg-transparent py-4 sm:py-6",
        )}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#hero", "Home");
            }}
            className={cn(
              "group -ml-1 flex items-center gap-2.5 rounded-full px-3 py-1.5 transition-all duration-300",
              isScrolled
                ? "bg-transparent hover:bg-slate-100/50"
                : "border border-white/70 bg-white/90 shadow-sm backdrop-blur-md hover:bg-white",
            )}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-orange text-white transition-transform duration-300 group-hover:scale-105">
              <Plane className="h-3.5 w-3.5" />
            </span>
            <span className="flex select-none items-center whitespace-nowrap text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl md:text-2xl">
              {BRAND.name}
              <span className="ml-1 font-semibold text-brand-orange">
                {BRAND.tagline}
              </span>
            </span>
          </a>

          <nav className="hidden items-center rounded-full border border-white/70 bg-white/80 px-2 py-1.5 shadow-glass backdrop-blur-xl lg:flex">
            {NAV_LINKS.map((link) => {
              const isActive = activeNav === link.name;
              return (
                <button
                  key={link.name}
                  type="button"
                  onClick={() => handleNavClick(link.href, link.name)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-white font-semibold text-slate-900 shadow-sm"
                      : "text-slate-600 hover:bg-white/60 hover:text-slate-900",
                  )}
                >
                  {isActive && (
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-orange" />
                  )}
                  {link.name}
                </button>
              );
            })}
          </nav>

          <div className="hidden items-center sm:flex">
            <button
              type="button"
              onClick={() => handleNavClick("#contact", "Contact")}
              className="group flex items-center gap-2.5 rounded-full border border-white/80 bg-white/90 py-1.5 pl-4 pr-1.5 shadow-glass backdrop-blur-md transition-all duration-300 hover:border-brand-orange/30 hover:bg-white hover:shadow-lg"
            >
              <span className="text-sm font-semibold text-slate-800">
                Plan My Trip
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-orange text-white shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:bg-brand-orange-hover">
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="rounded-full border border-white/80 bg-white/90 p-2 text-slate-800 shadow-sm backdrop-blur-md active:scale-95 lg:hidden"
            aria-label="Open navigation"
            aria-expanded={menuOpen}
            aria-controls="mobile-drawer"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Outside <header> so its backdrop-filter can't contain these fixed layers. */}
      <div
        ref={backdropRef}
        onClick={() => setMenuOpen(false)}
        className="invisible fixed inset-0 z-[70] bg-brand-navy/50 opacity-0 lg:hidden"
        aria-hidden="true"
      />
      <div
        ref={drawerRef}
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="no-scrollbar invisible fixed inset-y-0 right-0 z-[80] w-[85%] max-w-sm overflow-y-auto overscroll-contain bg-white p-6 shadow-2xl will-change-transform lg:hidden"
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="text-lg font-extrabold tracking-tight text-slate-900">
            {BRAND.name}
            <span className="ml-1 font-semibold text-brand-orange">
              {BRAND.tagline}
            </span>
          </span>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="rounded-full bg-slate-100 p-2 text-slate-800 active:scale-95"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          {NAV_LINKS.map((link) => {
            const isActive = activeNav === link.name;
            return (
              <button
                key={link.name}
                data-drawer-item
                type="button"
                onClick={() => handleNavClick(link.href, link.name)}
                className={cn(
                  "flex items-center gap-2 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-orange-light font-semibold text-brand-orange"
                    : "text-slate-700 hover:bg-slate-50",
                )}
              >
                {isActive && (
                  <span className="h-2 w-2 rounded-full bg-brand-orange" />
                )}
                {link.name}
              </button>
            );
          })}
          <div data-drawer-item className="mt-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => handleNavClick("#contact", "Contact")}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-orange px-4 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-brand-orange-hover"
            >
              Plan My Trip
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
