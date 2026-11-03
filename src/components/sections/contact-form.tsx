"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { CheckCircle, Mail, MapPin, Phone, Send, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "@/components/ui/section-heading";
import { BRAND, SERVICES_DATA } from "@/data/mock-data";

const INPUT_CLASS =
  "w-full rounded-xl border border-neutral-200 bg-neutral-100 px-4 py-2.5 text-xs text-slate-800 transition-colors placeholder:text-neutral-400 focus:border-brand-orange focus:outline-none sm:text-sm";

const LABEL_CLASS = "mb-1 block text-xs font-semibold text-slate-700";

const CONTACT_CHANNELS = [
  { icon: Phone, label: "Call the desk", value: BRAND.phone, href: `tel:${BRAND.phone.replace(/[^\d+]/g, "")}` },
  { icon: Mail, label: "Email us", value: BRAND.email, href: `mailto:${BRAND.email}` },
  { icon: MapPin, label: "Visit the office", value: BRAND.address, href: null },
];

export function ContactForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(SERVICES_DATA[0].title);
  const [message, setMessage] = useState("");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-contact-reveal]",
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

  useEffect(() => {
    if (!submitted) return;
    const timer = window.setTimeout(() => {
      setSubmitted(false);
      setFullName("");
      setEmail("");
      setPhone("");
      setService(SERVICES_DATA[0].title);
      setMessage("");
    }, 2800);
    return () => window.clearTimeout(timer);
  }, [submitted]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section ref={sectionRef} id="contact" className="bg-neutral-100 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div data-contact-reveal>
          <SectionHeading
            eyebrow="Talk To A Travel Desk"
            title="Tell us where you're headed"
            description="Send the outline of your trip and an advisor replies within one business hour with routes, paperwork and a first quote."
          />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1fr] lg:gap-10">
          <div data-contact-reveal className="flex flex-col gap-4">
            {CONTACT_CHANNELS.map((channel) => {
              const Icon = channel.icon;
              const body = (
                <>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-orange-light text-brand-orange transition-colors duration-300 group-hover:bg-brand-orange group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-brand-blue">
                      {channel.label}
                    </span>
                    <span className="mt-0.5 block text-sm font-bold text-slate-900">
                      {channel.value}
                    </span>
                  </span>
                </>
              );

              const shared =
                "group flex items-center gap-4 rounded-3xl border border-neutral-200 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-orange/40 hover:shadow-card-hover";

              return channel.href ? (
                <a key={channel.label} href={channel.href} className={shared}>
                  {body}
                </a>
              ) : (
                <div key={channel.label} className={shared}>
                  {body}
                </div>
              );
            })}

            <div className="rounded-3xl border border-brand-blue/20 bg-brand-blue-light p-5">
              <p className="text-xs font-semibold leading-relaxed text-slate-600">
                Every enquiry is handled by a named advisor who stays with your trip from the first
                visa form to the return flight. No call centres, no handovers.
              </p>
            </div>
          </div>

          <div
            data-contact-reveal
            className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-card-hover sm:p-8"
          >
            {submitted ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center py-8 text-center">
                <div className="mb-4 flex h-16 w-16 animate-bounce items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-900">Request Received</h3>
                <p className="max-w-xs text-xs text-slate-500 sm:text-sm">
                  Our travel desk has your details. An advisor will contact you within one business
                  hour to confirm dates and paperwork.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-brand-blue/20 bg-brand-blue-light px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-blue">
                    <Sparkles className="h-3 w-3" />
                    No Obligation
                  </span>
                  <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">
                    Request a trip consultation
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Visas, contracted airfares, verified stays and airport-ready wheels — priced as
                    one itinerary.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="contact-name" className={LABEL_CLASS}>
                      Full Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Alexander Wright"
                      className={INPUT_CLASS}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-email" className={LABEL_CLASS}>
                        Email Address
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@domain.com"
                        className={INPUT_CLASS}
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-phone" className={LABEL_CLASS}>
                        Phone Number
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className={INPUT_CLASS}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-service" className={LABEL_CLASS}>
                      Service Required
                    </label>
                    <select
                      id="contact-service"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className={`${INPUT_CLASS} cursor-pointer`}
                    >
                      {SERVICES_DATA.map((item) => (
                        <option key={item.id} value={item.title}>
                          {item.title}
                        </option>
                      ))}
                      <option value="Full Itinerary">Full Itinerary (All Four)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className={LABEL_CLASS}>
                      Destinations &amp; Travel Dates
                    </label>
                    <textarea
                      id="contact-message"
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="e.g. Two adults to Kyoto in early April, Schengen visa needed first, prefer a machiya stay near Arashiyama..."
                      className={INPUT_CLASS}
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange py-3.5 text-xs font-bold text-white shadow-lg shadow-brand-orange/30 transition-colors hover:bg-brand-orange-hover sm:text-sm"
                  >
                    <Send className="h-4 w-4" />
                    Submit Travel Request
                  </button>

                  <p className="text-center text-[11px] text-slate-400">
                    Demo form — submissions are not sent anywhere.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
