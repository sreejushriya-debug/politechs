"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/capitol-pulse", label: "Overview", match: (p: string) => p === "/capitol-pulse" || p.startsWith("/capitol-pulse/topics") },
  { href: "/capitol-pulse/bills", label: "Tech bills", match: (p: string) => p.startsWith("/capitol-pulse/bills") },
  { href: "/capitol-pulse/members", label: "Your lawmakers", match: (p: string) => p.startsWith("/capitol-pulse/members") },
  { href: "/capitol-pulse/methodology", label: "How it works", match: (p: string) => p.startsWith("/capitol-pulse/methodology") }
];

export function SubNav() {
  const pathname = usePathname() || "";
  return (
    <div className="sticky top-[65px] z-40 -mx-6 mb-10 border-b border-white/10 bg-navy-950/85 px-6 backdrop-blur-md">
      <nav className="flex items-center gap-1 overflow-x-auto py-2 text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Capitol Pulse">
        <Link href="/capitol-pulse" className="mr-3 shrink-0 font-display font-bold text-white">
          Capitol <span className="bg-gradient-to-r from-accent-blue to-accent-red bg-clip-text text-transparent">Pulse</span>
        </Link>
        {TABS.map((t) => {
          const active = t.match(pathname);
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={active ? "page" : undefined}
              className={`shrink-0 rounded-full px-3 py-1.5 transition-colors ${active ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"}`}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
