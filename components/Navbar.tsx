"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/articles", label: "Articles" },
  { href: "/forum", label: "Forum" },
  { href: "/hackathon", label: "Hackathon" },
  { href: "/contact", label: "Contact" }
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-navy-950/90 backdrop-blur-md border-b border-white/5">
      <nav className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        {/* Logo - Text only */}
        <Link href="/" className="group">
          <span className="font-display font-bold text-2xl tracking-tight">
            <span className="text-accent-red group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] transition-all duration-300">Poli</span>
            <span className="text-accent-blue group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-300">techs</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/70 hover:text-white transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/hackathon"
            className="ml-2 px-5 py-2 rounded-full bg-gradient-to-r from-accent-blue to-accent-red text-white text-sm font-medium hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-300"
          >
            Join Hacktivism
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-white/70 hover:text-white"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-navy-900 border-t border-white/5 px-6 py-4 space-y-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-white/70 hover:text-white py-2"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/hackathon"
            onClick={() => setMobileOpen(false)}
            className="block w-full text-center px-5 py-2.5 rounded-full bg-gradient-to-r from-accent-blue to-accent-red text-white text-sm font-medium mt-4"
          >
            Join Hacktivism
          </Link>
        </div>
      )}
    </header>
  );
}
