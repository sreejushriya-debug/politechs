// Presentational building blocks shared by Capitol Pulse pages.
// No hooks here, so these render on the server or the client.

import Link from "next/link";
import type { ReactNode } from "react";
import { STAGES, STAGE_INDEX, STAGE_STYLE, Stage } from "@/lib/capitol-pulse/stages";
import { TOPIC_BY_SLUG, TopicSlug } from "@/lib/capitol-pulse/topics";
import { PARTY_TEXT, PartyCode, formatDate } from "@/lib/capitol-pulse/format";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-white/10 bg-white/[0.03] ${className}`}>{children}</div>;
}

export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
      <div>
        <h2 className="text-xl md:text-2xl font-display font-bold text-white">{title}</h2>
        {subtitle && <p className="text-white/50 text-sm mt-1 max-w-2xl">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StageBadge({ stage }: { stage: Stage }) {
  const s = STAGES[STAGE_INDEX[stage]];
  return (
    <span title={s.description} className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${STAGE_STYLE[stage]}`}>
      {s.label}
    </span>
  );
}

// Compact five-step progress meter: introduced → committee → one chamber → both → law
export function StageMeter({ stage }: { stage: Stage }) {
  const steps = ["introduced", "committee", "passed-one", "passed-both", "law"] as Stage[];
  const reached = STAGE_INDEX[stage];
  return (
    <div className="flex items-center gap-1" aria-label={`Progress: ${STAGES[reached].label}`}>
      {steps.map((s) => (
        <span
          key={s}
          className={`h-1.5 w-5 rounded-full ${STAGE_INDEX[s] <= reached ? (stage === "law" ? "bg-emerald-400" : "bg-sky-400") : "bg-white/10"}`}
        />
      ))}
    </div>
  );
}

export function TopicChip({ slug, link = true }: { slug: TopicSlug; link?: boolean }) {
  const t = TOPIC_BY_SLUG[slug];
  const cls = "inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/70";
  const body = (
    <>
      <span aria-hidden>{t.icon}</span>
      {t.name}
    </>
  );
  return link ? (
    <Link href={`/capitol-pulse/topics/${slug}`} className={`${cls} hover:bg-white/10 hover:text-white transition-colors`}>
      {body}
    </Link>
  ) : (
    <span className={cls}>{body}</span>
  );
}

export function PartyTag({ party, state, district }: { party: PartyCode; state: string; district?: number }) {
  return (
    <span className={`font-medium ${PARTY_TEXT[party]}`}>
      {party}-{state}
      {district ? `-${district}` : ""}
    </span>
  );
}

export interface BillRowData {
  id: string;
  label: string;
  title: string;
  stage: Stage;
  topics: TopicSlug[];
  latestActionDate: string;
  latestActionText: string;
  introducedDate?: string;
  cosponsorCount?: number;
  sponsor?: { bioguideId: string; name: string; party: PartyCode; state: string; district?: number };
}

export function BillRow({ bill, showAction = true }: { bill: BillRowData; showAction?: boolean }) {
  return (
    <li className="group relative min-w-0 rounded-xl border border-white/10 bg-white/[0.02] p-4 hover:border-white/20 hover:bg-white/[0.05] transition-colors">
      <div className="flex flex-wrap items-center gap-2 mb-1.5 text-xs">
        <span className="font-mono text-white/50">{bill.label}</span>
        <StageBadge stage={bill.stage} />
        {bill.topics.map((t) => (
          <span key={t} className="text-white/40" title={TOPIC_BY_SLUG[t].name}>
            {TOPIC_BY_SLUG[t].icon}
          </span>
        ))}
      </div>
      <Link href={`/capitol-pulse/bills/${bill.id}`} className="block font-medium text-white leading-snug group-hover:text-accent-blue transition-colors after:absolute after:inset-0">
        {bill.title}
      </Link>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/45">
        {bill.sponsor && (
          <span>
            By {bill.sponsor.name} (<PartyTag party={bill.sponsor.party} state={bill.sponsor.state} />)
          </span>
        )}
        {typeof bill.cosponsorCount === "number" && bill.cosponsorCount > 0 && <span>{bill.cosponsorCount} cosponsors</span>}
        {showAction && bill.latestActionDate && (
          <span className="block min-w-0 max-w-full truncate">
            {formatDate(bill.latestActionDate)}: {bill.latestActionText}
          </span>
        )}
      </div>
    </li>
  );
}

export function PartyBar({ split, showLegend = false }: { split: Record<PartyCode, number>; showLegend?: boolean }) {
  const total = split.D + split.R + split.I;
  if (!total) return null;
  const parts = (["D", "R", "I"] as PartyCode[]).filter((p) => split[p] > 0);
  const colors: Record<PartyCode, string> = { D: "bg-blue-500", R: "bg-red-500", I: "bg-violet-400" };
  const names: Record<PartyCode, string> = { D: "Democrats", R: "Republicans", I: "Independents" };
  return (
    <div>
      <div className="flex h-2 overflow-hidden rounded-full bg-white/10" role="img" aria-label={parts.map((p) => `${split[p]} ${names[p]}`).join(", ")}>
        {parts.map((p) => (
          <span key={p} className={colors[p]} style={{ width: `${(split[p] / total) * 100}%` }} />
        ))}
      </div>
      {showLegend && (
        <div className="mt-1.5 flex flex-wrap gap-x-3 text-xs text-white/50">
          {parts.map((p) => (
            <span key={p}>
              <span className={PARTY_TEXT[p]}>●</span> {split[p]} {names[p]}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center">
      <p className="text-white font-medium">{title}</p>
      {children && <div className="text-white/50 text-sm mt-2">{children}</div>}
    </div>
  );
}

export function Stat({ value, label, hint }: { value: ReactNode; label: string; hint?: string }) {
  return (
    <Card className="p-5">
      <div className="text-3xl font-display font-bold text-white">{value}</div>
      <div className="text-sm text-white/70 mt-1">{label}</div>
      {hint && <div className="text-xs text-white/40 mt-1">{hint}</div>}
    </Card>
  );
}

export function PageHeader({ eyebrow, title, children }: { eyebrow?: ReactNode; title: ReactNode; children?: ReactNode }) {
  return (
    <header className="mb-10">
      {eyebrow && <div className="mb-3 text-sm text-white/50">{eyebrow}</div>}
      <h1 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight">{title}</h1>
      {children && <div className="mt-4 text-white/60 text-lg max-w-3xl leading-relaxed">{children}</div>}
    </header>
  );
}
