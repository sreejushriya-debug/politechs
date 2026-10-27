// Server-only data layer for Capitol Pulse. Everything comes from the official
// Congress.gov API (https://api.congress.gov) and is cached in Next's data
// cache, so visitors almost never wait on Congress.gov directly.

import { unstable_cache } from "next/cache";
import { classifyTitle, TopicSlug } from "./topics";
import { Stage, stageFromActions } from "./stages";
import {
  BILL_TYPES,
  BillType,
  PartyCode,
  TERRITORIES,
  billLabel,
  congressGovBillUrl,
  partyCode,
  stateCode
} from "./format";

export const CURRENT_CONGRESS = 119;

const API_BASE = "https://api.congress.gov/v3";

export class CongressApiError extends Error {}

function apiKey(): string {
  const key = process.env.CONGRESS_API_KEY;
  if (!key) throw new CongressApiError("CONGRESS_API_KEY is not set");
  return key;
}

async function api<T = any>(path: string, params: Record<string, string | number> = {}): Promise<T> {
  const url = new URL(path.startsWith("http") ? path : `${API_BASE}${path}`);
  url.searchParams.set("api_key", apiKey());
  url.searchParams.set("format", "json");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));

  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, { cache: "no-store", headers: { Accept: "application/json" } });
    if (res.ok) return res.json();
    // Retry transient failures once or twice
    if (attempt < 2 && (res.status === 429 || res.status >= 500)) {
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
      continue;
    }
    throw new CongressApiError(`Congress.gov ${res.status} for ${url.pathname}`);
  }
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i]);
      }
    })
  );
  return out;
}

// ---------- Types ----------

export interface MemberRef {
  bioguideId: string;
  name: string;
  party: PartyCode;
  state: string; // two-letter code
  district?: number;
}

export interface TechBill {
  id: string; // e.g. "119-hr-1234"
  congress: number;
  type: BillType;
  number: number;
  label: string; // e.g. "H.R. 1234"
  title: string;
  originChamber: "House" | "Senate";
  introducedDate: string;
  latestActionDate: string;
  latestActionText: string;
  stage: Stage;
  topics: TopicSlug[];
  sponsor?: MemberRef;
  cosponsorCount: number;
  policyArea?: string;
  url: string;
}

export interface Member {
  bioguideId: string;
  name: string; // "First Last"
  sortName: string; // "Last, First"
  party: PartyCode;
  state: string; // two-letter code
  district?: number;
  chamber: "House" | "Senate";
  isDelegate: boolean;
  imageUrl?: string;
}

// ---------- Tech bills ----------

interface ListBill {
  congress: number;
  type: string;
  number: string;
  title: string;
  introducedDate?: string;
  originChamber?: string;
  latestAction?: { actionDate?: string; text?: string };
  updateDate?: string;
}

async function listAllBills(congress: number): Promise<ListBill[]> {
  const pageSize = 250;
  const first = await api<{ bills: ListBill[]; pagination: { count: number } }>(`/bill/${congress}`, { limit: pageSize, offset: 0 });
  const total = first.pagination?.count ?? first.bills.length;
  const offsets: number[] = [];
  for (let o = pageSize; o < total; o += pageSize) offsets.push(o);
  const pages = await mapLimit(offsets, 10, (offset) =>
    api<{ bills: ListBill[] }>(`/bill/${congress}`, { limit: pageSize, offset }).then((d) => d.bills || [])
  );
  return [first.bills, ...pages].flat();
}

interface BillDetail {
  sponsor?: MemberRef;
  cosponsorCount: number;
  policyArea?: string;
}

function sponsorFrom(raw: any): MemberRef | undefined {
  if (!raw?.bioguideId) return undefined;
  return {
    bioguideId: raw.bioguideId,
    name: [raw.firstName, raw.lastName].filter(Boolean).join(" ") || raw.fullName,
    party: partyCode(raw.party),
    state: stateCode(raw.state || ""),
    district: raw.district ?? undefined
  };
}

// Sponsor and cosponsor counts only come from the per-bill endpoint. Cache each
// one keyed on the bill's updateDate, so it is refetched only when the bill changes.
function getBillDetail(congress: number, type: string, number: string, updateDate: string): Promise<BillDetail> {
  return unstable_cache(
    async (): Promise<BillDetail> => {
      const { bill } = await api<{ bill: any }>(`/bill/${congress}/${type}/${number}`);
      return {
        sponsor: sponsorFrom(bill?.sponsors?.[0]),
        cosponsorCount: bill?.cosponsors?.count ?? 0,
        policyArea: bill?.policyArea?.name
      };
    },
    ["cp-bill-detail", String(congress), type, number, updateDate || ""],
    { revalidate: 7 * 24 * 3600 }
  )();
}

async function buildTechBills(congress: number): Promise<{ bills: TechBill[]; scanned: number }> {
  const all = await listAllBills(congress);
  let scanned = 0;
  const seen = new Set<string>();
  const tech: { b: ListBill; type: BillType; topics: TopicSlug[] }[] = [];

  for (const b of all) {
    const type = b.type?.toLowerCase() as BillType;
    if (!BILL_TYPES.includes(type)) continue; // skip simple/concurrent resolutions
    scanned++;
    const topics = classifyTitle(b.title || "");
    if (topics.length === 0) continue;
    const id = `${congress}-${type}-${b.number}`;
    if (seen.has(id)) continue;
    seen.add(id);
    tech.push({ b, type, topics });
  }

  const details = await mapLimit(tech, 16, ({ b, type }) =>
    getBillDetail(congress, type, b.number, b.updateDate || "").catch((): BillDetail => ({ cosponsorCount: 0 }))
  );

  const bills = tech
    .map(({ b, type, topics }, i): TechBill => {
      const originChamber = b.originChamber === "Senate" ? "Senate" : "House";
      return {
        id: `${congress}-${type}-${b.number}`,
        congress,
        type,
        number: Number(b.number),
        label: billLabel(type, b.number),
        title: b.title,
        originChamber,
        introducedDate: b.introducedDate || "",
        latestActionDate: b.latestAction?.actionDate || "",
        latestActionText: b.latestAction?.text || "",
        stage: stageFromActions([b.latestAction?.text || ""], originChamber),
        topics,
        sponsor: details[i].sponsor,
        cosponsorCount: details[i].cosponsorCount,
        policyArea: details[i].policyArea,
        url: congressGovBillUrl(congress, type, b.number)
      };
    })
    .sort((a, b) => b.latestActionDate.localeCompare(a.latestActionDate));
  return { bills, scanned };
}

export interface TechBillsResult {
  bills: TechBill[];
  totalBillsScanned: number;
  fetchedAt: string;
}

export const getTechBills = unstable_cache(
  async (): Promise<TechBillsResult> => {
    const { bills, scanned } = await buildTechBills(CURRENT_CONGRESS);
    return { bills, totalBillsScanned: scanned, fetchedAt: new Date().toISOString() };
  },
  ["cp-tech-bills-v1"],
  { revalidate: 3 * 3600 }
);

// ---------- Members ----------

function memberFromList(m: any): Member {
  const terms: any[] = m.terms?.item ?? [];
  // Terms are listed oldest first; the current chamber is the last one
  const chamber = String(terms[terms.length - 1]?.chamber || "").includes("Senate") ? "Senate" : "House";
  const [last = "", first = ""] = String(m.name || "").split(", ");
  const code = stateCode(m.state || "");
  return {
    bioguideId: m.bioguideId,
    name: first ? `${first.split(" ")[0]} ${last}` : m.name,
    sortName: m.name,
    party: partyCode(m.partyName),
    state: code,
    district: chamber === "House" ? m.district ?? undefined : undefined,
    chamber,
    isDelegate: TERRITORIES.has(code),
    imageUrl: m.depiction?.imageUrl
  };
}

export const getMembers = unstable_cache(
  async (): Promise<Member[]> => {
    const pages = await mapLimit([0, 250, 500], 3, (offset) =>
      api<{ members: any[] }>("/member", { currentMember: "true", limit: 250, offset }).then((d) => d.members || [])
    );
    const byId = new Map<string, Member>();
    for (const m of pages.flat()) byId.set(m.bioguideId, memberFromList(m));
    return [...byId.values()].sort((a, b) => a.sortName.localeCompare(b.sortName));
  },
  ["cp-members-v1"],
  { revalidate: 24 * 3600 }
);

// ---------- Single bill ----------

export interface BillAction {
  date: string;
  text: string;
  chamber?: string;
}

export interface Cosponsor extends MemberRef {
  date: string;
  original: boolean;
}

export interface BillPage {
  bill: TechBill;
  summary?: { blocks: { kind: "p" | "li"; text: string }[]; version: string; date: string };
  cosponsors: Cosponsor[];
  actions: BillAction[];
  committees: string[];
  subjects: string[];
}

function htmlToBlocks(html: string): { kind: "p" | "li"; text: string }[] {
  const decode = (s: string) =>
    s
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;|&rsquo;|&lsquo;/g, "'")
      .replace(/&ldquo;|&rdquo;/g, '"')
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")
      .trim();
  const blocks: { kind: "p" | "li"; text: string }[] = [];
  const re = /<(p|li)[^>]*>([\s\S]*?)<\/\1>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const text = decode(m[2]);
    if (text) blocks.push({ kind: m[1].toLowerCase() as "p" | "li", text });
  }
  if (blocks.length === 0) {
    const text = decode(html);
    if (text) blocks.push({ kind: "p", text });
  }
  return blocks;
}

export function getBillPage(congress: number, type: BillType, number: number): Promise<BillPage | null> {
  return unstable_cache(
    async (): Promise<BillPage | null> => {
      const base = `/bill/${congress}/${type}/${number}`;
      let bill: any;
      try {
        bill = (await api<{ bill: any }>(base)).bill;
      } catch (e) {
        if (e instanceof CongressApiError && /\b404\b/.test(e.message)) return null;
        throw e;
      }
      if (!bill) return null;

      const [summaries, cosponsors, actions, committees, subjects] = await Promise.all([
        api<{ summaries: any[] }>(`${base}/summaries`).then((d) => d.summaries || []).catch(() => []),
        api<{ cosponsors: any[] }>(`${base}/cosponsors`, { limit: 250 }).then((d) => d.cosponsors || []).catch(() => []),
        api<{ actions: any[] }>(`${base}/actions`, { limit: 250 }).then((d) => d.actions || []).catch(() => []),
        api<{ committees: any[] }>(`${base}/committees`).then((d) => d.committees || []).catch(() => []),
        api<{ subjects: any }>(`${base}/subjects`, { limit: 100 })
          .then((d) => (d.subjects?.legislativeSubjects || []).map((s: any) => s.name as string))
          .catch(() => [] as string[])
      ]);

      const originChamber: "House" | "Senate" = bill.originChamber === "Senate" ? "Senate" : "House";
      const actionList: BillAction[] = actions
        .map((a: any) => ({ date: a.actionDate, text: a.text, chamber: a.sourceSystem?.name?.includes("Senate") ? "Senate" : a.sourceSystem?.name?.includes("House") ? "House" : undefined }))
        .filter((a: BillAction) => a.date && a.text);
      // The same action is often recorded by both the House and Library of Congress; dedupe
      const uniqueActions = actionList.filter(
        (a, i) => actionList.findIndex((b) => b.date === a.date && b.text === a.text) === i
      );

      const latestSummary = [...summaries].sort((a, b) =>
        String(a.actionDate || a.updateDate).localeCompare(String(b.actionDate || b.updateDate))
      ).pop();

      const techTopics = classifyTitle(bill.title || "");

      const result: BillPage = {
        bill: {
          id: `${congress}-${type}-${number}`,
          congress,
          type,
          number,
          label: billLabel(type, number),
          title: bill.title,
          originChamber,
          introducedDate: bill.introducedDate || "",
          latestActionDate: bill.latestAction?.actionDate || "",
          latestActionText: bill.latestAction?.text || "",
          stage: stageFromActions(uniqueActions.map((a) => a.text).concat(bill.latestAction?.text || ""), originChamber),
          topics: techTopics,
          sponsor: sponsorFrom(bill.sponsors?.[0]),
          cosponsorCount: bill.cosponsors?.count ?? cosponsors.length,
          policyArea: bill.policyArea?.name,
          url: congressGovBillUrl(congress, type, number)
        },
        summary: latestSummary?.text
          ? { blocks: htmlToBlocks(latestSummary.text), version: latestSummary.actionDesc || "Summary", date: latestSummary.actionDate || "" }
          : undefined,
        cosponsors: cosponsors
          .filter((c: any) => !c.sponsorshipWithdrawnDate)
          .map((c: any) => ({ ...sponsorFrom(c)!, date: c.sponsorshipDate || "", original: !!c.isOriginalCosponsor })),
        actions: uniqueActions.sort((a, b) => b.date.localeCompare(a.date)),
        committees: committees.map((c: any) => c.name).filter(Boolean),
        subjects
      };
      return result;
    },
    ["cp-bill-page-v1", String(congress), type, String(number)],
    { revalidate: 3600 }
  )();
}

// ---------- Single member ----------

export interface MemberBill {
  id: string;
  label: string;
  title: string;
  introducedDate: string;
  latestActionDate: string;
  latestActionText: string;
  stage: Stage;
  topics: TopicSlug[];
}

export interface MemberPage {
  member: Member;
  website?: string;
  phone?: string;
  office?: string;
  servingSince?: number;
  sponsored: MemberBill[];
  cosponsored: MemberBill[];
  totalSponsoredThisCongress: number;
  totalCosponsoredThisCongress: number;
}

async function memberLegislation(bioguideId: string, kind: "sponsored" | "cosponsored", congress: number) {
  const items: any[] = [];
  // Newest first; stop once we reach older Congresses
  for (let offset = 0; offset < 2000; offset += 250) {
    const d = await api<Record<string, any>>(`/member/${bioguideId}/${kind}-legislation`, { limit: 250, offset });
    const page: any[] = d[`${kind}Legislation`] || [];
    items.push(...page);
    if (page.length < 250 || page.some((b) => b.congress && b.congress < congress)) break;
  }
  const thisCongress = items.filter((b) => b.congress === congress && b.type && BILL_TYPES.includes(b.type.toLowerCase()));
  const tech: MemberBill[] = [];
  for (const b of thisCongress) {
    const topics = classifyTitle(b.title || "");
    if (!topics.length) continue;
    const type = b.type.toLowerCase() as BillType;
    const origin = type.startsWith("s") ? "Senate" : "House";
    tech.push({
      id: `${congress}-${type}-${b.number}`,
      label: billLabel(type, b.number),
      title: b.title,
      introducedDate: b.introducedDate || "",
      latestActionDate: b.latestAction?.actionDate || "",
      latestActionText: b.latestAction?.text || "",
      stage: stageFromActions([b.latestAction?.text || ""], origin),
      topics
    });
  }
  tech.sort((a, b) => b.introducedDate.localeCompare(a.introducedDate));
  return { tech, total: thisCongress.length };
}

export function getMemberPage(bioguideId: string): Promise<MemberPage | null> {
  return unstable_cache(
    async (): Promise<MemberPage | null> => {
      let m: any;
      try {
        m = (await api<{ member: any }>(`/member/${bioguideId}`)).member;
      } catch (e) {
        if (e instanceof CongressApiError && /\b(400|404)\b/.test(e.message)) return null;
        throw e;
      }
      if (!m) return null;

      const terms: any[] = m.terms || [];
      const current = terms[terms.length - 1] || {};
      const chamber: "House" | "Senate" = String(current.chamber || "").includes("Senate") ? "Senate" : "House";
      const code = current.stateCode || stateCode(m.state || "");
      const firstInChamber = terms.filter((t) => t.chamber === current.chamber).map((t) => t.startYear).filter(Boolean);

      const [sponsored, cosponsored] = await Promise.all([
        memberLegislation(bioguideId, "sponsored", CURRENT_CONGRESS),
        memberLegislation(bioguideId, "cosponsored", CURRENT_CONGRESS)
      ]);

      return {
        member: {
          bioguideId,
          name: m.directOrderName || `${m.firstName} ${m.lastName}`,
          sortName: m.invertedOrderName || `${m.lastName}, ${m.firstName}`,
          party: partyCode(m.partyHistory?.[m.partyHistory.length - 1]?.partyAbbreviation || m.partyHistory?.[0]?.partyName),
          state: code,
          district: chamber === "House" ? current.district ?? m.district ?? undefined : undefined,
          chamber,
          isDelegate: TERRITORIES.has(code),
          imageUrl: m.depiction?.imageUrl
        },
        website: m.officialWebsiteUrl,
        phone: m.addressInformation?.phoneNumber,
        office: m.addressInformation?.officeAddress,
        servingSince: firstInChamber.length ? Math.min(...firstInChamber) : undefined,
        sponsored: sponsored.tech,
        cosponsored: cosponsored.tech,
        totalSponsoredThisCongress: sponsored.total,
        totalCosponsoredThisCongress: cosponsored.total
      };
    },
    ["cp-member-page-v1", bioguideId],
    { revalidate: 6 * 3600 }
  )();
}
