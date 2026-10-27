"use client";

import { useRouter } from "next/navigation";
import { STATES, TERRITORIES } from "@/lib/capitol-pulse/format";

const OPTIONS = Object.entries(STATES).sort((a, b) => a[1].localeCompare(b[1]));

export function StatePicker({ value = "", size = "md" }: { value?: string; size?: "md" | "lg" }) {
  const router = useRouter();
  return (
    <label className="block">
      <span className="sr-only">Choose your state</span>
      <select
        value={value}
        onChange={(e) => router.push(e.target.value ? `/capitol-pulse/members?state=${e.target.value}` : "/capitol-pulse/members")}
        className={`w-full rounded-xl border border-white/15 bg-navy-900 text-white focus:border-accent-blue focus:outline-none ${size === "lg" ? "px-4 py-3.5 text-base" : "px-3 py-2 text-sm"}`}
      >
        <option value="">Choose your state…</option>
        <optgroup label="States">
          {OPTIONS.filter(([c]) => !TERRITORIES.has(c)).map(([code, name]) => (
            <option key={code} value={code}>{name}</option>
          ))}
        </optgroup>
        <optgroup label="DC & territories">
          {OPTIONS.filter(([c]) => TERRITORIES.has(c)).map(([code, name]) => (
            <option key={code} value={code}>{name}</option>
          ))}
        </optgroup>
      </select>
    </label>
  );
}
