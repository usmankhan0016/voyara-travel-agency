import { Navbar } from "@/components/layouts/navbar";
import { Footer } from "@/components/layouts/footer";
import { Hero } from "@/components/sections/hero";
import { Partners } from "@/components/sections/partners";
import { BookingWidget } from "@/components/sections/booking-widget";
import { Services } from "@/components/sections/services";
import { Destinations } from "@/components/sections/destinations";
import { StatsCounter } from "@/components/sections/stats-counter";
import { Testimonials } from "@/components/sections/testimonials";
import { ContactForm } from "@/components/sections/contact-form";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Partners />
        <BookingWidget />
        <Services />
        <Destinations />
        <StatsCounter />
        <Testimonials />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
