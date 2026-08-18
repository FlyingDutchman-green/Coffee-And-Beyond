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
  title: "Coffee And Beyond Pekalongan | Specialty Roastery & Casual Dining",
  description:
    "Specialty coffee sangrai mandiri bersama Samasta Coffee Roastery, casual dining lezat, dan ruang hangat untuk berkumpul dan bekerja di Jl. Diponegoro No. 15, Pekalongan.",
  keywords: [
    "Coffee And Beyond",
    "Coffee And Beyond Pekalongan",
    "Specialty Coffee Pekalongan",
    "Samasta Coffee Roastery",
    "Casual Dining Pekalongan",
    "Table QR Ordering",
  ],
  authors: [{ name: "Coffee And Beyond Pekalongan" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`}>
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

