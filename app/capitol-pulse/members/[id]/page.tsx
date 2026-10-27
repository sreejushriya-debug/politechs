import Link from "next/link";
import { notFound } from "next/navigation";
import { getMemberPage, MemberBill } from "@/lib/capitol-pulse/congress";
import { isAdvanced } from "@/lib/capitol-pulse/stages";
import { TOPIC_BY_SLUG, TopicSlug } from "@/lib/capitol-pulse/topics";
import { PARTY_NAMES, PARTY_TEXT, STATES, ordinal } from "@/lib/capitol-pulse/format";
import { BillRow, Card, EmptyState, Stat } from "@/components/capitol-pulse/ui";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props) {
  const page = await getMemberPage(params.id).catch(() => null);
  return { title: page ? `${page.member.name} on tech | Capitol Pulse` : "Lawmaker | Capitol Pulse" };
}

function topicCounts(bills: MemberBill[]): { slug: TopicSlug; n: number }[] {
  const m = new Map<TopicSlug, number>();
  for (const b of bills) for (const t of b.topics) m.set(t, (m.get(t) || 0) + 1);
  return [...m.entries()].map(([slug, n]) => ({ slug, n })).sort((a, b) => b.n - a.n);
}

function BillList({ bills, limit = 8 }: { bills: MemberBill[]; limit?: number }) {
  const first = bills.slice(0, limit);
  const rest = bills.slice(limit);
  return (
    <>
      <ul className="space-y-3">
        {first.map((b) => (
          <BillRow key={b.id} bill={b} />
        ))}
      </ul>
      {rest.length > 0 && (
        <details className="mt-3">
          <summary className="cursor-pointer text-sm text-accent-blue hover:underline">Show {rest.length} more</summary>
          <ul className="space-y-3 mt-3">
            {rest.map((b) => (
              <BillRow key={b.id} bill={b} />
            ))}
          </ul>
        </details>
      )}
    </>
  );
}

export default async function MemberPage({ params }: Props) {
  if (!/^[A-Z]\d{6}$/.test(params.id)) notFound();
  const page = await getMemberPage(params.id);
  if (!page) notFound();

  const { member: m, sponsored, cosponsored } = page;
  const role = m.chamber === "Senate" ? "Senator" : m.isDelegate ? "Delegate" : "Representative";
  const place =
    m.chamber === "Senate" || m.isDelegate
      ? STATES[m.state] ?? m.state
      : m.district
        ? `${STATES[m.state] ?? m.state}'s ${ordinal(m.district)} district`
        : `${STATES[m.state] ?? m.state} (at large)`;
  const focus = topicCounts([...sponsored, ...cosponsored]);
  const advancedWritten = sponsored.filter((b) => isAdvanced(b.stage)).length;
  const lastName = m.name.split(" ").slice(-1)[0];

  let takeaway: string;
  if (sponsored.length === 0 && cosponsored.length === 0) {
    takeaway = `${m.name} hasn't written or cosponsored any tech bills in this Congress yet.`;
  } else {
    const parts: string[] = [];
    parts.push(sponsored.length ? `has written ${sponsored.length} tech bill${sponsored.length === 1 ? "" : "s"}` : "hasn't written a tech bill");
    if (cosponsored.length) parts.push(`signed on to ${cosponsored.length} more`);
    takeaway = `${m.name} ${parts.join(" and ")} this Congress`;
    if (focus.length) takeaway += `, mostly on ${focus.slice(0, 2).map((f) => TOPIC_BY_SLUG[f.slug].name.toLowerCase()).join(" and ")}`;
    takeaway += ".";
    if (sponsored.length) {
      takeaway += advancedWritten
        ? ` ${advancedWritten} of the bills ${lastName} wrote ${advancedWritten === 1 ? "has" : "have"} made it out of committee.`
        : ` None of the bills ${lastName} wrote has made it out of committee yet.`;
    }
  }

  return (
    <article>
      <nav className="mb-6 text-sm text-white/50">
        <Link href={`/capitol-pulse/members?state=${m.state}`} className="hover:text-white">
          Lawmakers from {STATES[m.state] ?? m.state}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-white/70">{m.name}</span>
      </nav>

      <header className="grid gap-6 md:grid-cols-[auto_1fr_auto] md:items-center mb-10">
        {m.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={m.imageUrl} alt={m.name} className="h-28 w-28 rounded-2xl object-cover object-top bg-white/10" />
        ) : (
          <div className="h-28 w-28 rounded-2xl bg-white/10" />
        )}
        <div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white">{m.name}</h1>
          <p className="mt-2 text-white/60">
            <span className={PARTY_TEXT[m.party]}>{PARTY_NAMES[m.party]}</span> · {role} for {place}
            {page.servingSince ? ` · in the ${m.chamber} since ${page.servingSince}` : ""}
          </p>
        </div>
        {(page.website || page.phone) && (
          <Card className="p-4 text-sm space-y-1.5 md:min-w-[16rem]">
            <div className="text-xs uppercase tracking-wider text-white/40">Contact</div>
            {page.website && (
              <a href={page.website} target="_blank" rel="noopener noreferrer" className="block text-accent-blue hover:underline">
                Official website ↗
              </a>
            )}
            {page.phone && (
              <a href={`tel:${page.phone.replace(/[^\d+]/g, "")}`} className="block text-white/80 hover:text-white">
                {page.phone}
              </a>
            )}
            {page.office && <div className="text-xs text-white/40">{page.office}</div>}
          </Card>
        )}
      </header>

      <Card className="p-6 mb-8">
        <p className="text-lg text-white/85 leading-relaxed">{takeaway}</p>
        {focus.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {focus.map((f) => (
              <Link
                key={f.slug}
                href={`/capitol-pulse/topics/${f.slug}`}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/75 hover:bg-white/10 hover:text-white"
              >
                {TOPIC_BY_SLUG[f.slug].icon} {TOPIC_BY_SLUG[f.slug].name} <span className="text-white/40">{f.n}</span>
              </Link>
            ))}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <Stat value={sponsored.length} label="tech bills written" hint={`of ${page.totalSponsoredThisCongress} bills they wrote this Congress`} />
        <Stat value={advancedWritten} label="out of committee" hint="bills they wrote that advanced" />
        <Stat value={cosponsored.length} label="tech bills cosponsored" hint={`of ${page.totalCosponsoredThisCongress} they signed on to`} />
        <Stat value={focus.length} label="tech topics" hint="they've worked on" />
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        <section className="min-w-0">
          <h2 className="text-xl font-display font-bold text-white mb-1">Tech bills they wrote</h2>
          <p className="text-sm text-white/50 mb-4">As the lead sponsor, they introduced these bills.</p>
          {sponsored.length ? <BillList bills={sponsored} /> : <EmptyState title="None yet this Congress" />}
        </section>
        <section className="min-w-0">
          <h2 className="text-xl font-display font-bold text-white mb-1">Tech bills they signed on to</h2>
          <p className="text-sm text-white/50 mb-4">As a cosponsor, they publicly backed someone else&apos;s bill.</p>
          {cosponsored.length ? <BillList bills={cosponsored} /> : <EmptyState title="None yet this Congress" />}
        </section>
      </div>

      <p className="mt-12 text-xs text-white/40 border-t border-white/10 pt-6">
        Covers the current (119th) Congress. Capitol Pulse doesn&apos;t track floor votes or speeches yet; for a full voting record see{" "}
        <a href={`https://www.congress.gov/member/${m.name.toLowerCase().replace(/[^a-z]+/g, "-")}/${m.bioguideId}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-white/70">
          Congress.gov
        </a>
        .
      </p>
    </article>
  );
}
