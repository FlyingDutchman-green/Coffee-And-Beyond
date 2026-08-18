import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Coffee And Beyond | Specialty Coffee & Casual Dining Pekalongan",
  description:
    "Crafted with Passion, Brewed with Precision. Specialty coffee, mocktails, and comfort food in Pekalongan.",
  keywords: [
    "Coffee And Beyond",
    "Coffee And Beyond Pekalongan",
    "Specialty Coffee Pekalongan",
    "Samasta Coffee Roastery",
    "Casual Dining Pekalongan",
    "Table QR Ordering",
  ],
  authors: [{ name: "Coffee And Beyond Pekalongan" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml", sizes: "512x512" },
    ],
    shortcut: "/favicon.svg",
    apple: [
      { url: "/favicon.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`}>
      <head>
        <link
          rel="icon"
          href="/favicon.svg"
          type="image/svg+xml"
          sizes="512x512"
        />
        <link rel="apple-touch-icon" href="/favicon.svg" sizes="512x512" />
      </head>
      <body className="min-h-full flex flex-col bg-canvas-primary text-text-primary selection:bg-[#E7E7E3] selection:text-[#1E1E1C]">
        {children}
        <Toaster
          position="bottom-right"
          expand={false}
          richColors={false}
          toastOptions={{
            className:
              "bg-[#1E1E1C] text-white border border-[#333] shadow-lg font-sans text-sm rounded-lg",
          }}
        />
      </body>
    </html>
  );
}

