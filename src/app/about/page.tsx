import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Compass,
  Sparkles,
  HeartHandshake,
  Coffee,
  Quote,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Clock,
  Layers,
  Award,
} from "lucide-react";
import {
  ABOUT_TIMELINE_EVENTS,
  ABOUT_SOURCING_PILLARS,
} from "@/data/about";

export const metadata: Metadata = {
  title: "About Us & Journey | Coffee And Beyond Pekalongan",
  description:
    "Mengenal filosofi, sejarah pendirian 1 Juli 2015, ekosistem sangrai Samasta Coffee Roastery, dan perjalanan satu dekade Coffee And Beyond di Pekalongan.",
  keywords: [
    "About Coffee And Beyond",
    "Specialty Coffee Pekalongan",
    "Samasta Coffee Roastery",
    "Giesen 6 Pekalongan",
    "Kopi Tahlil Siphon Pekalongan",
    "Casual Dining Pekalongan",
  ],
};

const ICON_MAP: Record<string, React.ElementType> = {
  Compass,
  Sparkles,
  Layers,
  HeartHandshake,
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas-primary text-text-primary">
      <Navbar />

      <main className="flex-1">
        {/* Editorial Hero Banner */}
        <section className="w-full bg-canvas-secondary border-b border-border-subtle py-14 sm:py-20">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 text-xs uppercase font-semibold tracking-wider text-text-muted">
                <span className="w-6 h-[1px] bg-accent-warm" />
                <span>Est. 1 Juli 2015 • Pekalongan</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary leading-[1.15]">
                Crafted with Passion, Brewed with Precision.
              </h1>
              <p className="text-base sm:text-lg text-text-muted leading-relaxed">
                Berdiri sejak 1 Juli 2015 di Jl. Diponegoro No. 15, Pekalongan. Coffee And Beyond hadir sebagai ruang temu yang memadukan sajian specialty coffee sangrai mandiri bersama Samasta Coffee Roastery dengan kenyamanan casual dining keluarga dan profesional.
              </p>
            </div>
          </div>
        </section>

        {/* Brand Statement / Manifesto Callout */}
        <section className="w-full border-b border-border-subtle py-16 bg-canvas-primary">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 text-xs uppercase font-semibold tracking-wider text-text-muted">
                  <Award className="w-4 h-4 text-accent-warm" />
                  <span>The Pekalongan Third Space</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary leading-tight">
                  Lebih dari sekadar cangkir kopi. Ruang hangat untuk berkumpul, berkreasi, dan merayakan momen.
                </h2>
                <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                  Bagi kami di Pekalongan, kedai kopi adalah ruang ketiga antara rumah dan ruang kerja—tempat di mana obrolan hangat terjalin, ide-ide baru bertumbuh, dan hidangan lezat dinikmati tanpa tergesa-gesa.
                </p>
                <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                  Dari kurva sangrai mesin Giesen 6, presisi mesin espresso La Marzocco dan grinder Mahlkönig, seduhan Siphon Kopi Tahlil, hingga kelezatan Pasta Bebek Betutu dan Wagyu Rib Eye—setiap detail kami persembahkan dengan dedikasi tinggi.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-border-subtle">
                  <div className="space-y-1">
                    <p className="font-mono text-2xl font-bold text-text-primary">2015</p>
                    <p className="text-xs text-text-muted">Established in Pekalongan</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-mono text-2xl font-bold text-text-primary">Giesen 6</p>
                    <p className="text-xs text-text-muted">Samasta In-House Roastery</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-mono text-2xl font-bold text-text-primary">4.5★</p>
                    <p className="text-xs text-text-muted">3,000+ Happy Guests</p>
                  </div>
                </div>
              </div>

              {/* Founder Editorial Quote Card */}
              <div className="lg:col-span-5">
                <div className="bg-canvas-secondary border border-border-subtle rounded-lg p-6 sm:p-8 space-y-6 relative shadow-xs">
                  <Quote className="w-8 h-8 text-accent-warm opacity-70" />
                  <blockquote className="text-base sm:text-lg font-medium text-text-primary leading-relaxed italic">
                    &ldquo;Kami tidak terburu-buru dalam menyeduh. Kami tidak terburu-buru menikmati momen.&rdquo;
                  </blockquote>

                  <div className="pt-4 border-t border-border-subtle flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-canvas-primary border border-border-subtle flex items-center justify-center font-bold text-text-primary font-mono text-sm">
                      CB
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary text-sm">Coffee And Beyond</p>
                      <p className="text-xs text-text-muted">Jl. Diponegoro No. 15, Pekalongan Utara</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline / Brand Journey (2015 to 2026) */}
        <section className="w-full bg-canvas-secondary border-b border-border-subtle py-16 sm:py-24">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 text-xs uppercase font-semibold tracking-wider text-text-muted">
                <span className="w-6 h-[1px] bg-accent-warm" />
                <span>Our Journey</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-text-primary">
                Perjalanan Coffee And Beyond (2015 – 2026)
              </h2>
              <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                Menelusuri satu dekade dedikasi dari pionir slow bar di Pekalongan hingga integrasi rumah sangrai mandiri Samasta Coffee dan casual dining komprehensif.
              </p>
            </div>

            {/* Editorial Timeline Grid */}
            <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 sm:before:left-1/2 before:w-[1px] before:bg-border-subtle before:hidden sm:before:block">
              {ABOUT_TIMELINE_EVENTS.map((event, idx) => (
                <div
                  key={event.year}
                  className={`relative flex flex-col sm:flex-row gap-6 sm:gap-12 items-start ${
                    idx % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                >
                  {/* Timeline Content Card */}
                  <div className="w-full sm:w-[calc(50%-2rem)] bg-canvas-primary border border-border-subtle rounded-lg p-6 sm:p-8 space-y-4 hover:border-[#D0D0CA] transition-colors shadow-2xs">
                    <div className="flex items-center justify-between gap-2 border-b border-border-subtle pb-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                        {event.tagline}
                      </span>
                      <span className="font-mono text-base sm:text-lg font-bold text-text-primary px-2.5 py-0.5 bg-canvas-secondary border border-border-subtle rounded-md">
                        {event.year}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-text-primary tracking-tight">
                      {event.title}
                    </h3>

                    <p className="text-sm text-text-muted leading-relaxed">
                      {event.description}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-border-subtle">
                      <p className="text-xs font-semibold uppercase tracking-wider text-text-primary">
                        Milestones Utama
                      </p>
                      <ul className="space-y-1.5 text-xs text-text-muted">
                        {event.milestones.map((m, mIdx) => (
                          <li key={mIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-accent-warm shrink-0 mt-0.5" />
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Center Dot Indicator */}
                  <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 top-8 w-6 h-6 rounded-full bg-canvas-primary border-2 border-charcoal items-center justify-center z-10">
                    <span className="w-2 h-2 rounded-full bg-charcoal" />
                  </div>

                  {/* Empty Spacer Column for symmetrical desktop grid */}
                  <div className="hidden sm:block w-[calc(50%-2rem)]" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pillar: Our Craft & Roastery Ecosystem */}
        <section className="w-full bg-canvas-primary border-b border-border-subtle py-16 sm:py-24">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 text-xs uppercase font-semibold tracking-wider text-text-muted">
                <span className="w-6 h-[1px] bg-accent-warm" />
                <span>Our Craft &amp; Sourcing</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-text-primary">
                Ekosistem Sangrai Samasta &amp; Standar Peralatan Presisi
              </h2>
              <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                Kami percaya kopi istimewa lahir dari perpaduan biji pilihan petani Nusantara, profil sangrai presisi, dan ekstraksi teliti barista profesional.
              </p>
            </div>

            {/* Sourcing Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {ABOUT_SOURCING_PILLARS.map((pillar) => {
                const Icon = ICON_MAP[pillar.iconName] || Sparkles;
                return (
                  <div
                    key={pillar.title}
                    className="bg-canvas-secondary border border-border-subtle rounded-lg p-6 sm:p-8 space-y-4 hover:border-[#D0D0CA] transition-colors"
                  >
                    <div className="w-10 h-10 rounded-md bg-canvas-primary border border-border-subtle flex items-center justify-center text-text-primary">
                      <Icon className="w-5 h-5 text-text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Visit & Menu CTA */}
        <section className="w-full bg-canvas-secondary py-16 sm:py-20">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-canvas-primary border border-border-subtle rounded-lg p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xs">
              <div className="space-y-3 max-w-xl text-center md:text-left">
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
                  Kunjungi Coffee And Beyond Pekalongan
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Buka setiap hari 10.00 – 23.00 WIB di Jl. Diponegoro No. 15, Pekalongan Utara. Nikmati seduhan kopi sangrai segar, slow bar siphon, dan hidangan casual dining hangat.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
                <Link
                  href="/menu"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-charcoal text-white text-sm font-medium rounded-md hover:bg-[#3A3A37] transition-colors"
                >
                  <span>Explore Menu</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/order"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent text-text-primary text-sm font-medium border border-border-subtle rounded-md hover:bg-canvas-secondary transition-colors"
                >
                  <span>Order at Table</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
