"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import type { TechBill } from "@/lib/capitol-pulse/congress";
import { STAGES, STAGE_INDEX, Stage, isAdvanced } from "@/lib/capitol-pulse/stages";
import { TOPICS, TopicSlug, TOPIC_BY_SLUG } from "@/lib/capitol-pulse/topics";
import { PartyCode } from "@/lib/capitol-pulse/format";
import { BillRow, EmptyState } from "./ui";

export interface BillFilters {
  q: string;
  topic: TopicSlug | "";
  stage: Stage | "advanced" | "";
  chamber: "house" | "senate" | "";
  party: PartyCode | "";
  sort: "activity" | "newest" | "cosponsors";
}

const PAGE = 30;

function toQuery(f: BillFilters): string {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.topic) p.set("topic", f.topic);
  if (f.stage) p.set("stage", f.stage);
  if (f.chamber) p.set("chamber", f.chamber);
  if (f.party) p.set("party", f.party);
  if (f.sort !== "activity") p.set("sort", f.sort);
  const s = p.toString();
  return s ? `?${s}` : "";
}

function downloadCsv(bills: TechBill[]) {
  const header = ["bill", "title", "topics", "stage", "sponsor", "party", "state", "cosponsors", "introduced", "latest_action_date", "latest_action", "url"];
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = bills.map((b) =>
    [b.label, b.title, b.topics.map((t) => TOPIC_BY_SLUG[t].name).join("; "), STAGES[STAGE_INDEX[b.stage]].label, b.sponsor?.name, b.sponsor?.party, b.sponsor?.state, b.cosponsorCount, b.introducedDate, b.latestActionDate, b.latestActionText, b.url]
      .map(esc)
      .join(",")
  );
  const blob = new Blob([[header.join(","), ...rows].join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "capitol-pulse-tech-bills.csv";
  a.click();
  URL.revokeObjectURL(a.href);
}

const selectCls = "rounded-lg border border-white/15 bg-navy-900 px-3 py-2 text-sm text-white focus:border-accent-blue focus:outline-none";

export function BillExplorer({ bills, initial }: { bills: TechBill[]; initial: BillFilters }) {
  const pathname = usePathname();
  const [f, setF] = useState<BillFilters>(initial);
  const [shown, setShown] = useState(PAGE);

  // Keep the URL in sync so filtered views can be shared and the back button works
  useEffect(() => {
    const t = setTimeout(() => window.history.replaceState(null, "", `${pathname}${toQuery(f)}`), 250);
    return () => clearTimeout(t);
  }, [f, pathname]);

  const update = (patch: Partial<BillFilters>) => {
    setF((prev) => ({ ...prev, ...patch }));
    setShown(PAGE);
  };

  const filtered = useMemo(() => {
    const q = f.q.trim().toLowerCase();
    const list = bills.filter((b) => {
      if (f.topic && !b.topics.includes(f.topic)) return false;
      if (f.stage === "advanced" ? !isAdvanced(b.stage) : f.stage && b.stage !== f.stage) return false;
      if (f.chamber && b.originChamber.toLowerCase() !== f.chamber) return false;
      if (f.party && b.sponsor?.party !== f.party) return false;
      if (q) {
        const hay = `${b.title} ${b.label} ${b.label.replace(/[.\s]/g, "")} ${b.sponsor?.name ?? ""}`.toLowerCase();
        if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
      }
      return true;
    });
    const by = {
      activity: (a: TechBill, b: TechBill) => b.latestActionDate.localeCompare(a.latestActionDate),
      newest: (a: TechBill, b: TechBill) => b.introducedDate.localeCompare(a.introducedDate),
      cosponsors: (a: TechBill, b: TechBill) => b.cosponsorCount - a.cosponsorCount
    }[f.sort];
    return [...list].sort(by);
  }, [bills, f]);

  const active = f.q || f.topic || f.stage || f.chamber || f.party;

  return (
    <div>
      {/* Topic chips */}
      <div className="-mx-6 px-6 flex gap-2 mb-4 overflow-x-auto md:mx-0 md:px-0 md:flex-wrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="group" aria-label="Filter by topic">
        <button
          onClick={() => update({ topic: "" })}
          className={`shrink-0 rounded-full px-3 py-1.5 text-sm transition-colors ${!f.topic ? "bg-white text-navy-950" : "bg-white/5 text-white/70 hover:bg-white/10"}`}
        >
          All topics
        </button>
        {TOPICS.map((t) => (
          <button
            key={t.slug}
            onClick={() => update({ topic: f.topic === t.slug ? "" : t.slug })}
            aria-pressed={f.topic === t.slug}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm transition-colors ${f.topic === t.slug ? "bg-white text-navy-950" : "bg-white/5 text-white/70 hover:bg-white/10"}`}
          >
            <span aria-hidden>{t.icon}</span> {t.name}
          </button>
        ))}
      </div>

      {/* Search + filters */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4 mb-4">
        <input
          type="search"
          value={f.q}
          onChange={(e) => update({ q: e.target.value })}
          placeholder="Search titles, bill numbers (HR 1234) or sponsors…"
          className="col-span-2 lg:col-span-4 rounded-lg border border-white/15 bg-navy-900 px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-accent-blue focus:outline-none"
          aria-label="Search bills"
        />
        <select value={f.stage} onChange={(e) => update({ stage: e.target.value as BillFilters["stage"] })} className={selectCls} aria-label="Progress">
          <option value="">Any progress</option>
          <option value="advanced">Out of committee or further</option>
          {STAGES.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
        <select value={f.chamber} onChange={(e) => update({ chamber: e.target.value as BillFilters["chamber"] })} className={selectCls} aria-label="Chamber">
          <option value="">House & Senate</option>
          <option value="house">House bills</option>
          <option value="senate">Senate bills</option>
        </select>
        <select value={f.party} onChange={(e) => update({ party: e.target.value as BillFilters["party"] })} className={selectCls} aria-label="Sponsor's party">
          <option value="">Any sponsor party</option>
          <option value="D">Democratic sponsor</option>
          <option value="R">Republican sponsor</option>
          <option value="I">Independent sponsor</option>
        </select>
        <select value={f.sort} onChange={(e) => update({ sort: e.target.value as BillFilters["sort"] })} className={selectCls} aria-label="Sort">
          <option value="activity">Latest activity</option>
          <option value="newest">Newest introduced</option>
          <option value="cosponsors">Most cosponsors</option>
        </select>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-sm text-white/50">
        <span aria-live="polite">
          Showing <span className="text-white">{Math.min(shown, filtered.length)}</span> of <span className="text-white">{filtered.length}</span> bills
          {active && (
            <button onClick={() => update({ q: "", topic: "", stage: "", chamber: "", party: "" })} className="ml-3 text-accent-blue hover:underline">
              Clear filters
            </button>
          )}
        </span>
        <button onClick={() => downloadCsv(filtered)} className="text-white/60 hover:text-white underline-offset-2 hover:underline" disabled={!filtered.length}>
          Download these as CSV
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No tech bills match those filters">Try a different search term or clear a filter.</EmptyState>
      ) : (
        <>
          <ul className="space-y-3">
            {filtered.slice(0, shown).map((b) => (
              <BillRow key={b.id} bill={b} />
            ))}
          </ul>
          {shown < filtered.length && (
            <div className="mt-6 text-center">
              <button onClick={() => setShown((n) => n + PAGE)} className="rounded-full border border-white/15 px-6 py-2.5 text-sm text-white hover:bg-white/5">
                Show {Math.min(PAGE, filtered.length - shown)} more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
