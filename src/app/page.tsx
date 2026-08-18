import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { IntroVideoBanner } from "@/components/home/IntroVideoBanner";
import { EditorialHeroSection } from "@/components/home/EditorialHeroSection";
import { PhilosophySection } from "@/components/home/PhilosophySection";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { SpaceExperienceSection } from "@/components/home/SpaceExperienceSection";
import { FAQSection } from "@/components/home/FAQSection";
import { LocationHoursSection } from "@/components/home/LocationHoursSection";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas-primary text-text-primary">
      <Navbar />
      <main className="flex-1">
        <IntroVideoBanner />
        <EditorialHeroSection />
        <PhilosophySection />
        <FeaturedSection />
        <SpaceExperienceSection />
        <FAQSection />
        <LocationHoursSection />
      </main>
      <Footer />
    </div>
  );
}
