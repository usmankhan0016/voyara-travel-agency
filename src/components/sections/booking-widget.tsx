"use client";

import { useEffect, useRef, useState } from "react";
import {
  BedDouble,
  Car,
  Check,
  ChevronDown,
  Loader2,
  PlaneTakeoff,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Stamp,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  BOOKING_OPTIONS,
  BOOKING_SECTION_CONTENT,
  SEARCH_RESULTS,
  type BookingTabId,
} from "@/data/mock-data";
import { cn } from "@/lib/utils";

type FieldType = "text" | "date" | "select";

interface Field {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: readonly string[];
}

const TABS: {
  id: BookingTabId;
  label: string;
  icon: typeof PlaneTakeoff;
  fields: Field[];
}[] = [
  {
    id: "flights",
    label: "Flights",
    icon: PlaneTakeoff,
    fields: [
      {
        key: "origin",
        label: "From",
        type: "text",
        placeholder: "Dubai (DXB)",
      },
      {
        key: "destination",
        label: "To",
        type: "text",
        placeholder: "Tokyo (HND)",
      },
      { key: "departure", label: "Departure", type: "date" },
      { key: "return", label: "Return", type: "date" },
      {
        key: "cabin",
        label: "Cabin class",
        type: "select",
        options: BOOKING_OPTIONS.cabinClasses,
      },
    ],
  },
  {
    id: "hotels",
    label: "Hotels",
    icon: BedDouble,
    fields: [
      {
        key: "city",
        label: "City or hotel",
        type: "text",
        placeholder: "Santorini, Greece",
      },
      { key: "checkIn", label: "Check-in", type: "date" },
      { key: "checkOut", label: "Check-out", type: "date" },
      {
        key: "guests",
        label: "Guests & rooms",
        type: "select",
        options: BOOKING_OPTIONS.guestOptions,
      },
    ],
  },
  {
    id: "visa",
    label: "Visa",
    icon: Stamp,
    fields: [
      {
        key: "country",
        label: "Destination country",
        type: "select",
        options: BOOKING_OPTIONS.visaCountries,
      },
      {
        key: "citizenOf",
        label: "Citizen of",
        type: "select",
        options: BOOKING_OPTIONS.citizenships,
      },
      {
        key: "visaType",
        label: "Visa type",
        type: "select",
        options: BOOKING_OPTIONS.visaTypes,
      },
    ],
  },
  {
    id: "cars",
    label: "Car Rental",
    icon: Car,
    fields: [
      {
        key: "pickupLocation",
        label: "Pickup location",
        type: "text",
        placeholder: "Dubai Intl. Airport",
      },
      { key: "pickupDate", label: "Pickup date", type: "date" },
      { key: "dropoffDate", label: "Drop-off date", type: "date" },
      {
        key: "vehicleType",
        label: "Vehicle type",
        type: "select",
        options: BOOKING_OPTIONS.vehicleTypes,
      },
    ],
  },
];

type Errors = Record<string, string>;

const todayISO = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// Fields whose validity depends on another field, so their errors clear together.
const DEPENDENT_FIELDS: Record<string, string[]> = {
  origin: ["destination"],
  destination: ["origin"],
  departure: ["return"],
  checkIn: ["checkOut"],
  pickupDate: ["dropoffDate"],
  country: ["citizenOf"],
  citizenOf: ["country"],
};

const norm =(v: string) => v.trim().toLowerCase();

function validate(tabId: BookingTabId, get: (key: string) => string): Errors {
  const errors: Errors = {};
  const today = todayISO();

  const place = (key: string, label: string) => {
    const v = get(key).trim();
    if (!v) errors[key] = `${label} is required`;
    else if (v.length < 3)
      errors[key] = `${label} must be at least 3 characters`;
    else if (!/[a-z]/i.test(v))
      errors[key] = `Enter a valid ${label.toLowerCase()}`;
  };
  const startDate = (key: string, label: string) => {
    const v = get(key);
    if (!v) errors[key] = `${label} is required`;
    else if (v < today) errors[key] = `${label} cannot be in the past`;
  };
  const endDate = (
    key: string,
    label: string,
    startKey: string,
    startLabel: string,
  ) => {
    const v = get(key);
    if (!v) errors[key] = `${label} is required`;
    else if (get(startKey) && v < get(startKey))
      errors[key] = `${label} must be on or after ${startLabel.toLowerCase()}`;
  };

  if (tabId === "flights") {
    place("origin", "Departure city");
    place("destination", "Destination");
    if (
      !errors.origin &&
      !errors.destination &&
      norm(get("origin")) === norm(get("destination"))
    )
      errors.destination = "Destination must differ from origin";
    startDate("departure", "Departure");
    endDate("return", "Return", "departure", "Departure");
  } else if (tabId === "hotels") {
    place("city", "City or hotel");
    startDate("checkIn", "Check-in");
    endDate("checkOut", "Check-out", "checkIn", "Check-in");
    if (
      !errors.checkOut &&
      get("checkIn") &&
      get("checkOut") === get("checkIn")
    )
      errors.checkOut = "Stay must be at least one night";
  } else if (tabId === "visa") {
    if (norm(get("country")) === norm(get("citizenOf")))
      errors.citizenOf = "You do not need a visa for your own country";
  } else {
    place("pickupLocation", "Pickup location");
    startDate("pickupDate", "Pickup date");
    endDate("dropoffDate", "Drop-off date", "pickupDate", "Pickup date");
  }
  return errors;
}

const initialValues = () =>
  Object.fromEntries(
    TABS.flatMap((tab) =>
      tab.fields.map((f) => [
        `${tab.id}.${f.key}`,
        f.type === "select" ? (f.options?.[0] ?? "") : "",
      ]),
    ),
  ) as Record<string, string>;

export function BookingWidget() {
  const [activeTab, setActiveTab] = useState<BookingTabId>("flights");
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [isSearching, setIsSearching] = useState(false);
  const [resultsFor, setResultsFor] = useState<BookingTabId | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [errors, setErrors] = useState<Errors>({});
  const [reserved, setReserved] = useState<Record<string, string>>({});
  const [reservingId, setReservingId] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);
  const [flexible, setFlexible] = useState(false);
  const [requests, setRequests] = useState("");

  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
    },
    [],
  );

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-booking-reveal]",
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || !resultsFor) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        panel,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.5, ease: "power2.out" },
      );
      gsap.fromTo(
        panel.querySelectorAll("[data-result-row]"),
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.07,
          delay: 0.15,
          ease: "power2.out",
        },
      );
    }, panel);
    return () => ctx.revert();
  }, [resultsFor]);

  const tab = TABS.find((t) => t.id === activeTab)!;
  const results = resultsFor ? SEARCH_RESULTS[resultsFor] : [];

  const getValue = (key: string) => values[`${activeTab}.${key}`] ?? "";

  const showToast = (message: string) => {
    setToast(message);
    timers.current.push(setTimeout(() => setToast(null), 3500));
  };

  const setValue = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [`${activeTab}.${key}`]: value }));
    setErrors((prev) => {
      const related = [key, ...(DEPENDENT_FIELDS[key] ?? [])].filter((k) => prev[k]);
      if (!related.length) return prev;
      const next = { ...prev };
      related.forEach((k) => delete next[k]);
      return next;
    });
  };

  const handleReserve = (itemId: string, title: string) => {
    if (reservingId || reserved[itemId]) return;
    setReservingId(itemId);
    timers.current.push(
      setTimeout(() => {
        const ref = `TRV-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
        setReserved((prev) => ({ ...prev, [itemId]: ref }));
        setReservingId(null);
        showToast(`${title} reserved · Ref ${ref}`);
      }, 900),
    );
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validate(activeTab, getValue);
    setErrors(found);
    const firstKey = tab.fields.find((f) => found[f.key])?.key;
    if (firstKey) {
      setResultsFor(null);
      e.currentTarget
        .querySelector<HTMLElement>(`#${tab.id}-${firstKey}`)
        ?.focus();
      return;
    }
    setIsSearching(true);
    setResultsFor(null);
    timers.current.push(
      setTimeout(() => {
        setIsSearching(false);
        setResultsFor(activeTab);
        setToast(
          `${SEARCH_RESULTS[activeTab].length} ${tab.label.toLowerCase()} options matched`,
        );
        timers.current.push(setTimeout(() => setToast(null), 3500));
      }, 1100),
    );
  };

  const handleReset = () => {
    setValues(initialValues());
    setResultsFor(null);
    setErrors({});
    setFlexible(false);
    setRequests("");
  };

  return (
    <section
      ref={sectionRef}
      id="booking"
      className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8"
    >
      <div data-booking-reveal>
        <SectionHeading
          eyebrow={BOOKING_SECTION_CONTENT.eyebrow}
          title={BOOKING_SECTION_CONTENT.title}
          description={BOOKING_SECTION_CONTENT.description}
        />
      </div>
      <div
        data-booking-reveal
        className="w-full rounded-3xl border border-slate-100 bg-white p-4 shadow-card sm:p-6"
      >
        <div
          role="tablist"
          aria-label="Booking service"
          className="no-scrollbar mb-5 flex items-center gap-1 overflow-x-auto border-b border-slate-100 pb-4 sm:gap-2"
        >
          {TABS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setActiveTab(id);
                  setResultsFor(null);
                  setErrors({});
                }}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 sm:px-5 sm:text-sm",
                  isActive
                    ? "bg-brand-navy text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    isActive ? "text-brand-orange" : "text-slate-400",
                  )}
                />
                {label}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSearch} noValidate>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {tab.fields.map((field) => {
              const id = `${tab.id}-${field.key}`;
              const value = getValue(field.key);
              const error = errors[field.key];
              const fieldClass = cn(
                "w-full rounded-2xl border bg-brand-surface px-4 py-3 text-xs font-medium text-slate-800 transition-all placeholder:text-slate-400 focus:bg-white focus:outline-none sm:text-sm",
                error
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-200 focus:border-brand-orange",
              );
              const minDate =
                field.type !== "date"
                  ? undefined
                  : (
                      {
                        return: getValue("departure"),
                        checkOut: getValue("checkIn"),
                        dropoffDate: getValue("pickupDate"),
                      } as Record<string, string>
                    )[field.key] || todayISO();
              return (
                <div key={field.key} className="flex flex-col gap-1.5">
                  <label
                    htmlFor={id}
                    className="px-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {field.label}
                  </label>
                  {field.type === "select" ? (
                    <div className="relative">
                      <select
                        id={id}
                        value={value}
                        onChange={(e) => setValue(field.key, e.target.value)}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${id}-error` : undefined}
                        className={cn(
                          fieldClass,
                          "cursor-pointer appearance-none",
                        )}
                      >
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                  ) : (
                    <input
                      id={id}
                      type={field.type}
                      value={value}
                      min={minDate}
                      placeholder={field.placeholder}
                      aria-invalid={!!error}
                      aria-describedby={error ? `${id}-error` : undefined}
                      onChange={(e) => setValue(field.key, e.target.value)}
                      className={fieldClass}
                    />
                  )}
                  {error && (
                    <p
                      id={`${id}-error`}
                      role="alert"
                      className="px-1 text-[11px] font-medium text-red-500"
                    >
                      {error}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {showMore && (
            <div className="mt-4 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
              <label className="flex cursor-pointer items-center gap-2.5 text-xs font-semibold text-slate-700 sm:text-sm">
                <input
                  type="checkbox"
                  checked={flexible}
                  onChange={(e) => setFlexible(e.target.checked)}
                  className="h-4 w-4 accent-brand-orange"
                />
                {BOOKING_SECTION_CONTENT.extraOptions.flexibleLabel}
              </label>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="booking-requests"
                  className="px-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                >
                  {BOOKING_SECTION_CONTENT.extraOptions.requestsLabel}
                </label>
                <input
                  id="booking-requests"
                  type="text"
                  value={requests}
                  onChange={(e) => setRequests(e.target.value)}
                  placeholder={
                    BOOKING_SECTION_CONTENT.extraOptions.requestsPlaceholder
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-brand-surface px-4 py-3 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-brand-orange focus:bg-white focus:outline-none sm:text-sm"
                />
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setShowMore((v) => !v)}
                aria-expanded={showMore}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 transition-colors hover:text-brand-orange"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                {showMore ? "− Less options" : "+ More options"}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition-colors hover:text-slate-700"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Clear filters
              </button>
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="group flex items-center justify-center gap-2 rounded-full border border-slate-700/40 bg-brand-navy px-6 py-2.5 text-xs font-semibold text-white shadow-md transition-all duration-200 hover:bg-slate-800 active:scale-[0.98] disabled:cursor-wait disabled:opacity-80 sm:text-sm"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching…
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 transition-transform group-hover:scale-110" />
                  Search {tab.label}
                  <span className="rounded-full bg-brand-blue px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
                    {SEARCH_RESULTS[activeTab].length}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>

        {resultsFor && (
          <div ref={panelRef} className="overflow-hidden">
            <div className="mt-5 border-t border-slate-100 pt-5">
              <div className="mb-3 flex items-center justify-between px-1">
                <h3 className="text-sm font-bold tracking-tight text-slate-900">
                  {results.length} options available
                </h3>
                <span className="text-[11px] font-semibold text-slate-400">
                  Sample availability
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                {results.map((item) => (
                  <div
                    key={item.id}
                    data-result-row
                    className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-brand-surface/60 p-3.5 transition-all duration-200 hover:border-brand-orange/40 hover:bg-white hover:shadow-card sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate text-sm font-bold text-slate-900">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="rounded-full bg-brand-blue-light px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-blue">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs font-medium text-slate-600">
                        {item.subtitle}
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-400">
                        {item.meta}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-1">
                      <div className="text-right">
                        <div className="text-base font-extrabold tracking-tight text-slate-900">
                          {item.price}
                        </div>
                        <div className="text-[10px] font-medium text-slate-400">
                          {item.priceNote}
                        </div>
                      </div>
                      {reserved[item.id] ? (
                        <div className="flex flex-col items-end gap-0.5">
                          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-4 py-2 text-[11px] font-bold text-emerald-600">
                            <Check className="h-3.5 w-3.5" />
                            Reserved
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400">
                            Ref {reserved[item.id]}
                          </span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={reservingId !== null}
                          onClick={() => handleReserve(item.id, item.title)}
                          className="flex items-center gap-1.5 rounded-full bg-brand-navy px-4 py-2 text-[11px] font-bold text-white transition-colors hover:bg-brand-orange disabled:cursor-wait disabled:opacity-70"
                        >
                          {reservingId === item.id && (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          )}
                          {reservingId === item.id ? "Reserving…" : "Reserve"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div
          aria-live="polite"
          className={cn(
            "pointer-events-none fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-full bg-brand-navy px-4 py-2.5 text-xs font-semibold text-white shadow-2xl transition-all duration-300",
            toast ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
          )}
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange">
            <Check className="h-3 w-3" />
          </span>
          {toast ?? ""}
        </div>
      </div>
    </section>
  );
}
