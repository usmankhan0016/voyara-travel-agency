"use client";

import { useState } from "react";
import { ArrowUp, AtSign, Check, Globe, Send, Share2 } from "lucide-react";
import { BRAND, FOOTER_SERVICE_LINKS, NAV_LINKS } from "@/data/mock-data";

const SOCIALS = [
  { label: "Website", icon: Globe },
  { label: "Share", icon: Share2 },
  { label: "Social handle", icon: AtSign },
];

export function Footer() {
  const [copied, setCopied] = useState<"phone" | "email" | null>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleCopy = (type: "phone" | "email", value: string) => {
    navigator.clipboard?.writeText(value);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="relative overflow-hidden border-t border-slate-800 bg-brand-navy pt-20 text-white">
      <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-[600px] -translate-x-1/2 bg-brand-blue/10 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:mb-12">
          <p className="mx-auto mb-6 max-w-xl text-sm text-slate-400">{BRAND.manifesto}</p>
          <div className="mb-2">
            <button
              type="button"
              onClick={() => handleCopy("phone", BRAND.phone)}
              title="Click to copy phone"
              className="inline-flex items-center gap-2 text-xl font-bold text-slate-300 transition-colors hover:text-brand-orange sm:text-2xl md:text-3xl"
            >
              {BRAND.phone}
              {copied === "phone" && (
                <span className="rounded-full bg-brand-orange px-2 py-0.5 text-xs text-white">Copied</span>
              )}
            </button>
          </div>
          <button
            type="button"
            onClick={() => handleCopy("email", BRAND.email)}
            title="Click to copy email"
            className="inline-flex max-w-full items-center gap-2 break-all text-2xl font-extrabold tracking-tight text-white transition-colors hover:text-brand-orange sm:text-4xl md:text-5xl lg:text-6xl"
          >
            {BRAND.email}
            {copied === "email" && (
              <span className="rounded-full bg-brand-orange px-2 py-0.5 text-xs font-normal text-white">Copied</span>
            )}
          </button>

          <div className="mt-8 flex items-center justify-center gap-3">
            {SOCIALS.map(({ label, icon: Icon }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white shadow-sm transition-all duration-200 hover:scale-110 hover:bg-white hover:text-brand-navy"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 border-t border-white/10 pb-8 pt-10 text-xs font-semibold tracking-wider md:grid-cols-4">
          <div className="flex flex-col gap-3">
            <span className="text-[11px] uppercase tracking-widest text-slate-500">Explore</span>
            {NAV_LINKS.map((l) => (
              <a key={l.name} href={l.href} className="uppercase text-slate-400 transition-colors hover:text-white">
                {l.name}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[11px] uppercase tracking-widest text-slate-500">Services</span>
            {FOOTER_SERVICE_LINKS.map((l) => (
              <a key={l.name} href={l.href} className="uppercase text-slate-400 transition-colors hover:text-white">
                {l.name}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[11px] uppercase tracking-widest text-slate-500">Address</span>
            <p className="text-xs font-normal uppercase leading-relaxed text-slate-300">{BRAND.address}</p>
            <span className="mt-3 text-[11px] uppercase tracking-widest text-slate-500">All rights reserved</span>
            <span className="font-bold text-slate-300">{BRAND.name.toUpperCase()} {new Date().getFullYear()}</span>
          </div>

          <div className="col-span-2 flex flex-col gap-3 md:col-span-1">
            <span className="text-[11px] uppercase tracking-widest text-slate-500">Newsletter</span>
            <form onSubmit={handleSubscribe} className="flex items-center rounded-full border border-white/15 bg-white/10 p-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                aria-label="Email for newsletter"
                className="min-w-0 flex-1 bg-transparent px-3 text-xs font-normal text-white placeholder:text-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-orange text-white transition-colors hover:bg-brand-orange-hover"
              >
                {subscribed ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
              </button>
            </form>
            <p className="text-[11px] font-normal normal-case tracking-normal text-slate-500" aria-live="polite">
              {subscribed ? "Thanks! You're on the list." : "Travel deals and visa updates, monthly."}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pb-8 pt-4 text-xs text-slate-500 sm:flex-row">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <a href="#" className="transition-colors hover:text-slate-300">Terms &amp; Conditions</a>
            <span>•</span>
            <a href="#" className="transition-colors hover:text-slate-300">Privacy policy</a>
            <span>•</span>
            <span>Visa approvals are subject to embassy discretion.</span>
          </div>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-1 text-slate-400 transition-colors hover:text-brand-orange"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="pointer-events-none relative mt-2 w-full select-none overflow-hidden">
        <div className="text-center text-[18vw] font-black uppercase leading-none tracking-tighter text-white/[0.07] blur-[1px]">
          {BRAND.watermark}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent" />
        <div className="absolute bottom-0 left-1/4 right-1/4 h-16 rounded-full bg-white/[0.08] blur-2xl" />
      </div>
    </footer>
  );
}
