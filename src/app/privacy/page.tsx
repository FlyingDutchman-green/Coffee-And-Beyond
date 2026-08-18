import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  ShieldCheck,
  Lock,
  Database,
  Smartphone,
  EyeOff,
  Mail,
  ArrowLeft,
  Calendar,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Coffee And Beyond",
  description:
    "Learn how Coffee And Beyond handles guest privacy, contactless table-side ordering, local device storage, and transaction security.",
  keywords: [
    "Privacy Policy",
    "Coffee And Beyond privacy",
    "Table ordering data security",
    "Guest privacy policy",
  ],
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "August 18, 2026";

  return (
    <div className="min-h-screen flex flex-col bg-canvas-primary text-text-primary">
      <Navbar />

      <main className="flex-1">
        {/* Editorial Header Banner */}
        <section className="w-full bg-canvas-secondary border-b border-border-subtle py-12 sm:py-16">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="max-w-3xl space-y-4">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-primary transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Home</span>
              </Link>

              <div className="inline-flex items-center gap-2 text-xs uppercase font-semibold tracking-wider text-text-muted">
                <span className="w-6 h-[1px] bg-accent-warm" />
                <span>Legal &amp; Transparency</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary">
                Privacy Policy
              </h1>

              <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                Transparency in how we handle your in-café and digital experience. We respect your attention, your time, and your personal data.
              </p>

              <div className="flex items-center gap-2 text-xs text-text-muted pt-2">
                <Calendar className="w-3.5 h-3.5 text-accent-warm" />
                <span>Last updated: {lastUpdated}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Policy Structured Content */}
        <section className="w-full py-12 sm:py-16 bg-canvas-primary">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            {/* Core Privacy Pillars Summary Box */}
            <div className="p-6 bg-canvas-secondary border border-border-subtle rounded-lg space-y-4">
              <div className="flex items-center gap-2 text-text-primary">
                <ShieldCheck className="w-5 h-5 text-accent-warm" />
                <h2 className="text-base font-semibold">Our Privacy Commitments at a Glance</h2>
              </div>
              <ul className="space-y-2 text-xs text-text-muted leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-warm mt-1.5 shrink-0" />
                  <span><strong>No mandatory guest registration:</strong> You do not need to create an account, password, or install an app to order at your table.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-warm mt-1.5 shrink-0" />
                  <span><strong>Zero third-party advertising trackers:</strong> We do not sell your personal information or host third-party tracking pixels.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-warm mt-1.5 shrink-0" />
                  <span><strong>Encrypted table transactions:</strong> All payment sessions are processed through certified, PCI-DSS compliant payment gateways.</span>
                </li>
              </ul>
            </div>

            {/* Section 1: Table-Side Guest Ordering */}
            <div className="space-y-4 border-b border-border-subtle pb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-canvas-secondary border border-border-subtle flex items-center justify-center text-text-primary">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold text-text-primary tracking-tight">
                  1. Table-Side Guest Ordering
                </h2>
              </div>

              <p className="text-sm text-text-muted leading-relaxed">
                When you scan a QR code at your table, our web application accesses your selected table identifier (e.g., Table 04) to associate your food and beverage selections directly with our kitchen baristas.
              </p>
              <p className="text-sm text-text-muted leading-relaxed">
                We only collect the minimum information required to prepare and serve your order accurately (such as your table number, item temperature preferences, and optional dietary notes). You are never required to provide sensitive personal identity documents or install invasive third-party applications.
              </p>
            </div>

            {/* Section 2: Local Storage & Device Preferences */}
            <div className="space-y-4 border-b border-border-subtle pb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-canvas-secondary border border-border-subtle flex items-center justify-center text-text-primary">
                  <Lock className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold text-text-primary tracking-tight">
                  2. Local Storage &amp; Device Preferences
                </h2>
              </div>

              <p className="text-sm text-text-muted leading-relaxed">
                We utilize your browser&apos;s native <code className="text-xs bg-canvas-secondary px-1.5 py-0.5 rounded border border-border-subtle font-mono text-text-primary">localStorage</code> solely to remember your active table cart and order state during your stay. This ensures that if your browser refreshes or your mobile connection briefly fluctuates, your selected items remain safely preserved.
              </p>
              <p className="text-sm text-text-muted leading-relaxed">
                This data is stored exclusively on your personal device and can be cleared at any time simply by clearing your browser cache or closing your private browsing session.
              </p>
            </div>

            {/* Section 3: Data Retention & Operational Records */}
            <div className="space-y-4 border-b border-border-subtle pb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-canvas-secondary border border-border-subtle flex items-center justify-center text-text-primary">
                  <Database className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold text-text-primary tracking-tight">
                  3. Data Retention &amp; Financial Records
                </h2>
              </div>

              <p className="text-sm text-text-muted leading-relaxed">
                Transaction records (including item summaries, order timestamps, and fiscal invoice numbers) are retained strictly for internal accounting, inventory audit, and tax compliance as mandated by Indonesian commercial law.
              </p>
              <p className="text-sm text-text-muted leading-relaxed">
                We do not store complete credit card numbers or financial credentials on our servers; all payment transactions are handled through secure, regulated payment service providers (QRIS and authorized banking gateways).
              </p>
            </div>

            {/* Section 4: Absence of Third-Party Ad Trackers */}
            <div className="space-y-4 border-b border-border-subtle pb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-canvas-secondary border border-border-subtle flex items-center justify-center text-text-primary">
                  <EyeOff className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold text-text-primary tracking-tight">
                  4. No Third-Party Tracking or Data Selling
                </h2>
              </div>

              <p className="text-sm text-text-muted leading-relaxed">
                We believe that a serene physical sanctuary extends to a calm digital sanctuary. We do not participate in cross-site behavioral tracking networks, data broker exchanges, or programmatic advertising retargeting.
              </p>
            </div>

            {/* Section 5: Contact for Privacy Inquiries */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-canvas-secondary border border-border-subtle flex items-center justify-center text-text-primary">
                  <Mail className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold text-text-primary tracking-tight">
                  5. Contact for Privacy Inquiries
                </h2>
              </div>

              <p className="text-sm text-text-muted leading-relaxed">
                If you have any questions regarding our privacy practices, data handling, or wish to request an inquiry regarding your past transaction records, please reach out directly to our management team:
              </p>

              <div className="p-4 bg-canvas-secondary border border-border-subtle rounded-md space-y-1 text-xs text-text-muted">
                <p className="font-semibold text-text-primary">Coffee And Beyond Pekalongan — Guest Privacy Operations</p>
                <p>Email: <a href="mailto:contact@coffeeandbeyond.id" className="text-text-primary underline hover:opacity-80">contact@coffeeandbeyond.id</a></p>
                <p>Address: Jl. Diponegoro No. 15, Dukuh, Kec. Pekalongan Utara, Kota Pekalongan, Jawa Tengah 51146</p>
                <p>Phone / WhatsApp: +62 811-2748-585</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
