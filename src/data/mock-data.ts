export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  features: string[];
  badge: string;
  pillars: string[];
  ctaLabel: string;
  image: string;
  /** object-position keeping the subject framed when cropped to a portrait panel. */
  imagePosition: string;
}

export interface DestinationItem {
  id: string;
  title: string;
  country: string;
  category: "Europe" | "Asia" | "Middle East" | "Islands";
  price: string;
  duration: string;
  rating: number;
  reviewsCount: number;
  image: string;
  featured?: boolean;
  /** Oversized slider headline, kept short so it stays on one line. */
  headline: string;
  locationTag: string;
  description: string;
}

export interface StatItem {
  value: number;
  prefix?: string;
  suffix: string;
  label: string;
  sublabel: string;
  /** Heights (0-100) for the micro bar chart under each counter card. */
  bars: number[];
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  service: string;
  content: string;
  stats: string;
}

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: "visa",
    title: "Visa Services",
    subtitle: "Fast-Track Embassy Clearance",
    description: "Comprehensive visa processing support with 99.4% approval track record for tourist, student, and business categories.",
    icon: "Stamp",
    features: ["Document Verification", "Appointment Expediting", "Interview Preparation"],
    badge: "Embassy-Ready Filing",
    pillars: [
      "Complete Document Verification & Checklist Audit",
      "Priority Embassy Appointment Expediting",
      "Mock Interview Coaching & Travel History Review",
      "99.4% Approval Track Record Across Categories",
    ],
    ctaLabel: "Start Your Visa Application",
    image: "/services/visa-service.jpg",
    imagePosition: "39% 50%",
  },
  {
    id: "flights",
    title: "Flight Ticket Booking",
    subtitle: "Global Carrier Network",
    description: "Exclusive contracted fares across 500+ commercial airlines with 24/7 rebooking assistance and baggage protection.",
    icon: "Plane",
    features: ["Multi-City Routing", "Flexible Date Search", "Instant Seat Allocation"],
    badge: "500+ Airline Network",
    pillars: [
      "Contracted Fares Across 500+ Commercial Airlines",
      "Multi-City Routing & Flexible Date Search",
      "Instant Seat Allocation & Baggage Protection",
      "24/7 Rebooking & Disruption Assistance",
    ],
    ctaLabel: "Book Your Flight",
    image: "/services/flight-service.jpg",
    imagePosition: "58% 50%",
  },
  {
    id: "hotels",
    title: "Hotel Booking",
    subtitle: "Luxury Resorts & Stays",
    description: "Curated portfolio of verified 4-star and 5-star boutique resorts with complimentary room upgrades and breakfast deals.",
    icon: "Building2",
    features: ["Best Price Guarantee", "Free Cancellation", "Verified Guest Feedback"],
    badge: "Verified 4 & 5-Star Stays",
    pillars: [
      "Curated Boutique Resorts & Verified Guest Feedback",
      "Best Price Guarantee on Every Booking",
      "Free Cancellation on Selected Stays",
      "Complimentary Upgrades & Breakfast Deals",
    ],
    ctaLabel: "Reserve Your Stay",
    image: "/services/hotel-service.jpg",
    imagePosition: "52% 50%",
  },
  {
    id: "cars",
    title: "Car Rental",
    subtitle: "Airport & Chauffeur Fleet",
    description: "Seamless on-demand vehicle rentals from premium convertibles to 7-seater SUVs available in over 120 global airports.",
    icon: "Car",
    features: ["Zero Security Deposit", "Unlimited Mileage", "GPS & Child Seat Support"],
    badge: "120+ Airport Locations",
    pillars: [
      "Zero Security Deposit on Every Rental",
      "Unlimited Mileage Across All Fleet Classes",
      "Premium Convertibles to 7-Seater SUVs",
      "GPS, Child Seats & Chauffeur Add-Ons",
    ],
    ctaLabel: "Reserve Your Car",
    image: "/services/car-service.jpg",
    imagePosition: "85% 50%",
  },
];

export const DESTINATION_CATEGORIES = ["All", "Europe", "Asia", "Middle East", "Islands"] as const;

export type DestinationCategory = (typeof DESTINATION_CATEGORIES)[number];

export const DESTINATIONS_DATA: DestinationItem[] = [
  {
    id: "1",
    title: "Santorini Caldera Retreat",
    country: "Greece",
    category: "Europe",
    price: "$1,250",
    duration: "6 Days / 5 Nights",
    rating: 4.95,
    reviewsCount: 142,
    image: "/destinations/santorini.jpg",
    featured: true,
    headline: "Santorini",
    locationTag: "Santorini, Greece",
    description:
      "Whitewashed villages spill down volcanic cliffs above the Aegean. Mornings belong to the caldera path, evenings to Oia's slow sunset and a terrace table booked in your name.",
  },
  {
    id: "2",
    title: "Kyoto Temples & Old Town Streets",
    country: "Japan",
    category: "Asia",
    price: "$1,890",
    duration: "8 Days / 7 Nights",
    rating: 4.98,
    reviewsCount: 210,
    image: "/destinations/kyoto.jpg",
    featured: true,
    headline: "Kyoto",
    locationTag: "Kyoto, Japan",
    description:
      "Seventeen centuries of temples, tea houses and lantern-lit lanes, walked at the pace they were built for. Private machiya stays sit minutes from the Yasaka Pagoda in Higashiyama.",
  },
  {
    id: "7",
    title: "Tokyo Neon Districts & Night Markets",
    country: "Japan",
    category: "Asia",
    price: "$1,640",
    duration: "6 Days / 5 Nights",
    rating: 4.92,
    reviewsCount: 176,
    image: "/destinations/tokyo.jpg",
    headline: "Tokyo",
    locationTag: "Tokyo, Japan",
    description:
      "Akihabara after rain, when the signage doubles in the wet pavement and the arcades are still full. Days run on the Yamanote line, nights on counter seats booked ahead in Shinjuku.",
  },
  {
    id: "3",
    title: "Dubai Skyline & Desert Luxury",
    country: "United Arab Emirates",
    category: "Middle East",
    price: "$1,450",
    duration: "5 Days / 4 Nights",
    rating: 4.91,
    reviewsCount: 98,
    image: "/destinations/dubai.jpg",
    headline: "Dubai",
    locationTag: "Dubai, UAE",
    description:
      "Glass towers and the Burj Khalifa at first light, red dunes by dusk. Fast-tracked entry, a chauffeur on call and a rooftop suite make the switch between the two effortless.",
  },
  {
    id: "8",
    title: "Petra Rose City & Wadi Rum Camps",
    country: "Jordan",
    category: "Middle East",
    price: "$1,380",
    duration: "6 Days / 5 Nights",
    rating: 4.94,
    reviewsCount: 134,
    image: "/destinations/petra.jpg",
    headline: "Petra",
    locationTag: "Petra, Jordan",
    description:
      "The Siq opens without warning onto the Treasury, carved straight into rose sandstone two thousand years ago. Nights are spent under canvas in Wadi Rum, with a Bedouin guide and no light pollution.",
  },
  {
    id: "4",
    title: "Amalfi Coast Scenic Cliffside",
    country: "Italy",
    category: "Europe",
    price: "$1,720",
    duration: "7 Days / 6 Nights",
    rating: 4.93,
    reviewsCount: 115,
    image: "/destinations/amalfi.jpg",
    headline: "Amalfi",
    locationTag: "Amalfi, Italy",
    description:
      "Pastel harbour houses stacked beneath limestone cliffs, lemon terraces and a coast road that earns every hairpin. Boat transfers along the coast are arranged before you land.",
  },
  {
    id: "5",
    title: "Bali Lake Temples & Tropical Villas",
    country: "Indonesia",
    category: "Islands",
    price: "$980",
    duration: "6 Days / 5 Nights",
    rating: 4.88,
    reviewsCount: 320,
    image: "/destinations/bali.jpg",
    headline: "Bali",
    locationTag: "Bali, Indonesia",
    description:
      "Misty mornings at the Ulun Danu Beratan water temple, rice terraces and waterfalls reached before the crowds wake. Private villas come with a driver and guide attached to your stay.",
  },
  {
    id: "9",
    title: "Maldives Reef Lagoons & Private Sands",
    country: "Maldives",
    category: "Islands",
    price: "$2,340",
    duration: "5 Days / 4 Nights",
    rating: 4.96,
    reviewsCount: 258,
    image: "/destinations/maldives.jpg",
    featured: true,
    headline: "Maldives",
    locationTag: "Dhigurah, Maldives",
    description:
      "Palm forest runs to white sand, then straight into a reef you can snorkel from the beach. Seaplane transfers, an overwater villa and a dhoni on call for the sandbank at low tide.",
  },
  {
    id: "6",
    title: "Swiss Alps Valleys & Waterfalls",
    country: "Switzerland",
    category: "Europe",
    price: "$2,100",
    duration: "7 Days / 6 Nights",
    rating: 4.97,
    reviewsCount: 88,
    image: "/destinations/swiss-alps.jpg",
    headline: "Swiss Alps",
    locationTag: "Swiss Alps, Switzerland",
    description:
      "Timber chalets, glacial rivers and cliff-side waterfalls in the Lauterbrunnen valley, with scenic rail connections through the Jungfrau region and a reserved window seat throughout.",
  },
];

export const STATS_DATA: StatItem[] = [
  {
    value: 99.4,
    suffix: "%",
    label: "Visa Approval Rate",
    sublabel: "Over 8,000 successful visas processed",
    bars: [30, 42, 38, 55, 65, 52, 75, 88, 70, 95],
  },
  {
    value: 150,
    suffix: "+",
    label: "Destinations Covered",
    sublabel: "Spanning across 6 continents",
    bars: [25, 30, 35, 45, 50, 60, 68, 80, 88, 100],
  },
  {
    value: 24,
    suffix: "k+",
    label: "Delighted Explorers",
    sublabel: "98% repeat booking preference",
    bars: [20, 25, 50, 40, 60, 75, 45, 80, 70, 90],
  },
  {
    value: 24,
    suffix: "/7",
    label: "Concierge Assistance",
    sublabel: "Round-the-clock emergency travel desk",
    bars: [45, 60, 55, 70, 62, 85, 72, 90, 84, 98],
  },
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: "1",
    name: "Sarah Jenkins",
    role: "Adventure Traveler",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=520&q=80",
    rating: 5,
    service: "Schengen Visa & Alps Package",
    content: "My European visa process was approved in just 6 business days without a single hitch. Their concierge handled flight itineraries and boutique stays seamlessly.",
    stats: "Approved in 6 Days",
  },
  {
    id: "2",
    name: "Marcus Vance",
    role: "Corporate Executive",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=520&q=80",
    rating: 5,
    service: "Business Flight Booking",
    content: "When our Tokyo flight was delayed due to weather, their team re-routed us onto another carrier within 30 minutes. Superb customer commitment.",
    stats: "Rebooked in 30 Minutes",
  },
  {
    id: "3",
    name: "Elena Rostova",
    role: "Photographer & Solo Traveler",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=520&q=80",
    rating: 5,
    service: "Car Rental & Bali Stay",
    content: "Renting an SUV right at the airport with clear pricing and zero security deposit surprises made our road trip across Bali completely worry-free.",
    stats: "Zero Deposit Rental",
  },
];

export interface NavLinkItem {
  name: string;
  href: string;
}

export const BRAND = {
  name: "Voyara",
  tagline: "Travel",
  watermark: "VOYARA",
  phone: "+1 (555) 019-2024",
  email: "hello@voyara.travel",
  address: "Suite 450, 123 Market Street, San Francisco, California",
  manifesto:
    "Visas, flights, hotels and wheels, handled by one team that treats every journey as personal.",
};

export const NAV_LINKS: NavLinkItem[] = [
  { name: "Home", href: "#hero" },
  { name: "Services", href: "#services" },
  { name: "Destinations", href: "#destinations" },
  { name: "Stats", href: "#stats" },
  { name: "Reviews", href: "#reviews" },
  { name: "Contact", href: "#contact" },
];

export const FOOTER_SERVICE_LINKS: NavLinkItem[] = [
  { name: "Visa Services", href: "#services" },
  { name: "Flight Tickets", href: "#services" },
  { name: "Hotel Booking", href: "#services" },
  { name: "Car Rental", href: "#services" },
];

export const HERO_CONTENT = {
  eyebrow: "Visas · Flights · Hotels · Car Rental",
  headline: "Your Next Journey, Handled End to End",
  subtext:
    "One concierge team for embassy paperwork, contracted airfares, verified luxury stays and airport-ready wheels.",
  image: "/hero-bg-voyara.jpg",
  imageAlt: "Golden sunrise over a tropical beach with palm trees and a plane soaring across the amber sky",
  previewImage:
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
};

export type BookingTabId = "flights" | "hotels" | "visa" | "cars";

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  price: string;
  priceNote: string;
  badge?: string;
}

export const SEARCH_RESULTS: Record<BookingTabId, SearchResultItem[]> = {
  flights: [
    {
      id: "f1",
      title: "Emirates EK 202",
      subtitle: "Nonstop · 13h 45m",
      meta: "Departs 08:40 — Arrives 21:25",
      price: "$842",
      priceNote: "round trip",
      badge: "Fastest",
    },
    {
      id: "f2",
      title: "Qatar Airways QR 708",
      subtitle: "1 stop via Doha · 16h 10m",
      meta: "Departs 22:15 — Arrives 18:25",
      price: "$689",
      priceNote: "round trip",
      badge: "Best value",
    },
    {
      id: "f3",
      title: "Turkish Airlines TK 79",
      subtitle: "1 stop via Istanbul · 17h 55m",
      meta: "Departs 10:05 — Arrives 09:00",
      price: "$651",
      priceNote: "round trip",
    },
  ],
  hotels: [
    {
      id: "h1",
      title: "The Aster Harbour",
      subtitle: "5-star · Marina district",
      meta: "Free cancellation · Breakfast included",
      price: "$320",
      priceNote: "per night",
      badge: "Guest favourite",
    },
    {
      id: "h2",
      title: "Casa Lumière Boutique",
      subtitle: "4-star · Old town",
      meta: "Rooftop pool · 0.4 km from centre",
      price: "$186",
      priceNote: "per night",
    },
    {
      id: "h3",
      title: "Serein Garden Residences",
      subtitle: "5-star · Beachfront",
      meta: "Suite upgrade on arrival · Spa credit",
      price: "$412",
      priceNote: "per night",
      badge: "Upgrade included",
    },
  ],
  visa: [
    {
      id: "v1",
      title: "Standard Processing",
      subtitle: "12 – 15 working days",
      meta: "Document review, appointment booking, tracking",
      price: "$140",
      priceNote: "per applicant",
    },
    {
      id: "v2",
      title: "Expedited Processing",
      subtitle: "5 – 7 working days",
      meta: "Priority slot, interview coaching, courier return",
      price: "$265",
      priceNote: "per applicant",
      badge: "Most chosen",
    },
    {
      id: "v3",
      title: "Premium Concierge",
      subtitle: "48 – 72 hours",
      meta: "Dedicated case officer, same-day submission",
      price: "$480",
      priceNote: "per applicant",
    },
  ],
  cars: [
    {
      id: "c1",
      title: "BMW 5 Series",
      subtitle: "Luxury sedan · Automatic",
      meta: "Unlimited mileage · Airport counter pickup",
      price: "$96",
      priceNote: "per day",
    },
    {
      id: "c2",
      title: "Toyota Land Cruiser",
      subtitle: "7-seater SUV · Automatic",
      meta: "Child seats available · Full-to-full fuel",
      price: "$128",
      priceNote: "per day",
      badge: "Family pick",
    },
    {
      id: "c3",
      title: "Mercedes S-Class + Chauffeur",
      subtitle: "Chauffeur service · 8h block",
      meta: "Meet and greet · Bottled water and Wi-Fi",
      price: "$240",
      priceNote: "per day",
    },
  ],
};

export const HERO_AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
];

export const BOOKING_OPTIONS = {
  cabinClasses: ["Economy", "Premium Economy", "Business", "First Class"],
  guestOptions: ["1 guest · 1 room", "2 guests · 1 room", "3 guests · 2 rooms", "4+ guests · 2 rooms"],
  visaCountries: ["United Kingdom", "Schengen Area", "United States", "Japan", "United Arab Emirates", "Canada"],
  citizenships: ["Pakistan", "India", "Nigeria", "Egypt", "Philippines", "Bangladesh"],
  visaTypes: ["Tourist", "Business", "Student"],
  vehicleTypes: ["Economy", "Luxury Sedan", "SUV (7-seater)", "Chauffeur Service"],
} as const;

export interface PartnerItem {
  name: string;
  category: string;
  icon: "BadgeCheck" | "Plane" | "Building2" | "Car" | "Stamp";
}

export const PARTNERS_DATA: PartnerItem[] = [
  { name: "IATA", category: "Accredited Agent", icon: "BadgeCheck" },
  { name: "EMIRATES", category: "Official Airline Partner", icon: "Plane" },
  { name: "BOOKING.COM", category: "Hotel Network", icon: "Building2" },
  { name: "HERTZ", category: "Car Rental", icon: "Car" },
  { name: "VISA GLOBAL", category: "Visa Facilitation", icon: "Stamp" },
  { name: "MARRIOTT", category: "Hotel Partner", icon: "Building2" },
  { name: "QATAR AIRWAYS", category: "Airline Partner", icon: "Plane" },
  { name: "AVIS", category: "Car Rental", icon: "Car" },
];

export const BOOKING_SECTION_CONTENT = {
  eyebrow: "Plan Your Trip",
  title: "Book flights, stays, visas and rides in one place",
  description:
    "Pick a service, tell us where you're headed and we'll line up sample options from our trusted network in seconds.",
  extraOptions: {
    flexibleLabel: "Flexible dates (±3 days)",
    requestsLabel: "Special requests",
    requestsPlaceholder: "e.g. halal meals, wheelchair assistance, late check-in",
  },
} as const;
