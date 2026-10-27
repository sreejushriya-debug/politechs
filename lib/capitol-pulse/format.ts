// Small, client-safe helpers shared by Capitol Pulse pages.

export type BillType = "hr" | "s" | "hjres" | "sjres";
export type PartyCode = "D" | "R" | "I";

export const BILL_TYPES: BillType[] = ["hr", "s", "hjres", "sjres"];

const BILL_LABELS: Record<BillType, string> = {
  hr: "H.R.",
  s: "S.",
  hjres: "H.J.Res.",
  sjres: "S.J.Res."
};

const BILL_URL_SLUGS: Record<BillType, string> = {
  hr: "house-bill",
  s: "senate-bill",
  hjres: "house-joint-resolution",
  sjres: "senate-joint-resolution"
};

export function billLabel(type: BillType, number: number | string): string {
  return `${BILL_LABELS[type]} ${number}`;
}

export function congressGovBillUrl(congress: number, type: BillType, number: number | string): string {
  return `https://www.congress.gov/bill/${congress}th-congress/${BILL_URL_SLUGS[type]}/${number}`;
}

export function parseBillId(id: string): { congress: number; type: BillType; number: number } | null {
  const m = /^(\d{2,3})-(hr|s|hjres|sjres)-(\d+)$/.exec(id);
  if (!m) return null;
  return { congress: Number(m[1]), type: m[2] as BillType, number: Number(m[3]) };
}

export function partyCode(name: string | undefined): PartyCode {
  if (!name) return "I";
  const n = name.trim().toUpperCase();
  if (n.startsWith("D")) return "D";
  if (n.startsWith("R")) return "R";
  return "I";
}

export const PARTY_NAMES: Record<PartyCode, string> = {
  D: "Democrat",
  R: "Republican",
  I: "Independent"
};

export const PARTY_TEXT: Record<PartyCode, string> = {
  D: "text-blue-400",
  R: "text-red-400",
  I: "text-violet-300"
};

export const PARTY_BG: Record<PartyCode, string> = {
  D: "bg-blue-500",
  R: "bg-red-500",
  I: "bg-violet-400"
};

export const STATES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  // Non-voting delegates
  AS: "American Samoa", DC: "District of Columbia", GU: "Guam",
  MP: "Northern Mariana Islands", PR: "Puerto Rico", VI: "Virgin Islands"
};

export const TERRITORIES = new Set(["AS", "DC", "GU", "MP", "PR", "VI"]);

const STATE_CODE_BY_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(STATES).map(([code, name]) => [name.toLowerCase(), code])
);

export function stateCode(nameOrCode: string): string {
  if (!nameOrCode) return "";
  if (nameOrCode.length === 2) return nameOrCode.toUpperCase();
  return STATE_CODE_BY_NAME[nameOrCode.toLowerCase()] || nameOrCode;
}

export function formatDate(iso: string | undefined, opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }): string {
  if (!iso) return "";
  // Dates from Congress.gov are YYYY-MM-DD; parse as UTC so they don't shift a day
  const d = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? new Date(`${iso}T12:00:00Z`) : new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { timeZone: "UTC", ...opts });
}

export function daysAgo(iso: string | undefined): number {
  if (!iso) return Infinity;
  const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(iso) ? `${iso}T12:00:00Z` : iso);
  return Math.floor((Date.now() - d.getTime()) / 86_400_000);
}

export function relativeDate(iso: string | undefined): string {
  const n = daysAgo(iso);
  if (!isFinite(n)) return "";
  if (n <= 0) return "today";
  if (n === 1) return "yesterday";
  if (n < 7) return `${n} days ago`;
  if (n < 60) return `${Math.round(n / 7)} weeks ago`;
  return formatDate(iso);
}

export function pluralize(n: number, one: string, many = `${one}s`): string {
  return `${n.toLocaleString()} ${n === 1 ? one : many}`;
}

export function ordinal(n: number): string {
  const v = n % 100;
  const suffix = v >= 11 && v <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] || "th";
  return `${n}${suffix}`;
}
