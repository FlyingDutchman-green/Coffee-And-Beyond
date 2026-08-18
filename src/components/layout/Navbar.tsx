"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Menu", href: "/menu" },
    { name: "Promotions", href: "/promotions" },
    { name: "Articles", href: "/articles" },
    { name: "Location", href: "/#location" },
  ];

  const isLinkActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-canvas-primary/95 backdrop-blur-xs border-b border-border-subtle">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center py-1 hover:opacity-90 transition-opacity shrink-0"
          aria-label="Coffee And Beyond Home"
        >
          <BrandLogo size="sm" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {navLinks.map((link) => {
            const active = isLinkActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-colors py-1 ${
                  active
                    ? "text-text-primary font-semibold border-b-2 border-charcoal -mb-[2px]"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Action Button */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/order"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-text-primary border border-border-subtle rounded-md hover:bg-canvas-secondary hover:border-[#D0D0CA] transition-colors"
          >
            <span>Order at Table</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-text-muted" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          className="md:hidden p-2 text-text-primary hover:bg-canvas-secondary rounded-md border border-border-subtle focus:outline-none focus:ring-1 focus:ring-[#1E1E1C]"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-border-subtle bg-canvas-primary px-4 pt-3 pb-5 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2.5 text-base font-medium rounded-md transition-colors flex items-center justify-between ${
                    active
                      ? "bg-canvas-secondary text-text-primary font-semibold"
                      : "text-text-muted hover:text-text-primary hover:bg-canvas-secondary"
                  }`}
                >
                  <span>{link.name}</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-charcoal" />}
                </Link>
              );
            })}
          </nav>
          <div className="pt-3 border-t border-border-subtle">
            <Link
              href="/order"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium text-text-primary border border-border-subtle bg-canvas-secondary rounded-md hover:bg-[#EFEFEA] transition-colors"
            >
              <span>Order at Table</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-text-muted" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
