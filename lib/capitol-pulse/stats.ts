// Aggregations over the tech-bill dataset used by the overview and topic pages.

import type { MemberRef, TechBill } from "./congress";
import { STAGES, STAGE_INDEX, Stage, isAdvanced } from "./stages";
import { TOPICS, TopicSlug } from "./topics";
import { PartyCode, daysAgo } from "./format";

export interface StageCount {
  stage: Stage;
  label: string;
  count: number; // bills that reached at least this stage
}

// Funnel: how many bills reached each stage or beyond
export function stageFunnel(bills: TechBill[]): StageCount[] {
  return STAGES.filter((s) => s.id !== "to-president").map((s) => ({
    stage: s.id,
    label: s.label,
    count: bills.filter((b) => STAGE_INDEX[b.stage] >= STAGE_INDEX[s.id]).length
  }));
}

export function partySplit(refs: (MemberRef | undefined)[]): Record<PartyCode, number> {
  const out: Record<PartyCode, number> = { D: 0, R: 0, I: 0 };
  for (const r of refs) if (r) out[r.party]++;
  return out;
}

export interface TopicSummary {
  slug: TopicSlug;
  total: number;
  advanced: number;
  becameLaw: number;
  recent: number; // bills with any action in the last 30 days
  parties: Record<PartyCode, number>;
}

export function topicSummaries(bills: TechBill[]): TopicSummary[] {
  return TOPICS.map((t) => {
    const inTopic = bills.filter((b) => b.topics.includes(t.slug));
    return {
      slug: t.slug,
      total: inTopic.length,
      advanced: inTopic.filter((b) => isAdvanced(b.stage)).length,
      becameLaw: inTopic.filter((b) => b.stage === "law").length,
      recent: inTopic.filter((b) => daysAgo(b.latestActionDate) <= 30).length,
      parties: partySplit(inTopic.map((b) => b.sponsor))
    };
  }).sort((a, b) => b.total - a.total);
}

export interface SponsorCount {
  sponsor: MemberRef;
  count: number;
  advanced: number;
}

export function topSponsors(bills: TechBill[], limit = 8): SponsorCount[] {
  const map = new Map<string, SponsorCount>();
  for (const b of bills) {
    if (!b.sponsor) continue;
    const e = map.get(b.sponsor.bioguideId) || { sponsor: b.sponsor, count: 0, advanced: 0 };
    e.count++;
    if (isAdvanced(b.stage)) e.advanced++;
    map.set(b.sponsor.bioguideId, e);
  }
  return [...map.values()].sort((a, b) => b.count - a.count || b.advanced - a.advanced).slice(0, limit);
}

// Bills that recently moved forward (not just introduced), newest action first
export function recentlyAdvanced(bills: TechBill[], limit = 6): TechBill[] {
  return bills
    .filter((b) => isAdvanced(b.stage))
    .sort((a, b) => b.latestActionDate.localeCompare(a.latestActionDate))
    .slice(0, limit);
}

export function newest(bills: TechBill[], limit = 6): TechBill[] {
  return [...bills].sort((a, b) => b.introducedDate.localeCompare(a.introducedDate)).slice(0, limit);
}
