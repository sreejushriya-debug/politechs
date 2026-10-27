import Link from "next/link";
import { getTechBills, CURRENT_CONGRESS } from "@/lib/capitol-pulse/congress";
import { newest, recentlyAdvanced, stageFunnel, topSponsors, topicSummaries } from "@/lib/capitol-pulse/stats";
import { TOPIC_BY_SLUG } from "@/lib/capitol-pulse/topics";
import { formatDate } from "@/lib/capitol-pulse/format";
import { BillRow, Card, PartyBar, PartyTag, SectionHeader, Stat } from "@/components/capitol-pulse/ui";
import { StatePicker } from "@/components/capitol-pulse/StatePicker";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function CapitolPulseOverview() {
  const { bills, totalBillsScanned, fetchedAt } = await getTechBills();
  const funnel = stageFunnel(bills);
  const topics = topicSummaries(bills);
  const moving = recentlyAdvanced(bills, 6);
  const fresh = newest(bills, 5);
  const sponsors = topSponsors(bills, 6);

  const total = bills.length;
  const stuck = total - (funnel.find((f) => f.stage === "committee")?.count ?? 0);
  const laws = funnel.find((f) => f.stage === "law")?.count ?? 0;
  const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-accent-blue mb-3">{CURRENT_CONGRESS}th Congress · 2025–2027</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white leading-[1.05]">
            What is Congress actually doing about tech?
          </h1>
          <p className="mt-5 text-lg text-white/60 max-w-2xl leading-relaxed">
            Every bill on AI, privacy, social media, crypto and more, in plain English: what it would do, who wrote it,
            and how far it has really gotten. Pulled straight from Congress.gov.
          </p>
        </div>
        <Card className="p-6">
          <p className="font-display font-semibold text-white text-lg">See what your lawmakers are doing</p>
          <p className="text-sm text-white/50 mt-1 mb-4">Pick your state to see your senators and representatives and the tech bills they&apos;ve written.</p>
          <StatePicker size="lg" />
          <Link href="/capitol-pulse/bills" className="mt-4 inline-block text-sm text-accent-blue hover:underline">
            Or browse all {total} tech bills →
          </Link>
        </Card>
      </section>

      {/* Key numbers */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat value={total.toLocaleString()} label="tech bills introduced" hint={`out of ${totalBillsScanned.toLocaleString()} bills this Congress`} />
          <Stat value={`${pct(stuck)}%`} label="never left committee" hint="no committee vote, no floor vote" />
          <Stat value={(total - stuck).toLocaleString()} label="made it out of committee" hint="eligible for a floor vote" />
          <Stat value={laws.toLocaleString()} label="became law" hint={`${pct(laws) || "<1"}% of tech bills`} />
        </div>
      </section>

      {/* Funnel */}
      <section>
        <SectionHeader
          title="Most tech bills go nowhere"
          subtitle="Introducing a bill is easy; getting it through committee, both chambers, and signed is not. Here is how far this Congress's tech bills have gotten."
        />
        <Card className="p-6 space-y-3">
          {funnel.map((f) => (
            <div key={f.stage} className="grid grid-cols-[9rem_1fr_3.5rem] sm:grid-cols-[12rem_1fr_4rem] items-center gap-3 text-sm">
              <span className="text-white/70">{f.label}</span>
              <div className="h-6 rounded-md bg-white/5 overflow-hidden">
                <div
                  className={`h-full rounded-md ${f.stage === "law" ? "bg-emerald-500/70" : "bg-gradient-to-r from-accent-blue/80 to-accent-blue/40"}`}
                  style={{ width: `${Math.max(total ? (f.count / total) * 100 : 0, f.count ? 0.8 : 0)}%` }}
                />
              </div>
              <span className="text-right font-mono text-white">{f.count}</span>
            </div>
          ))}
          <p className="pt-2 text-xs text-white/40">
            Based on each bill&apos;s latest official action. <Link href="/capitol-pulse/methodology#stages" className="underline hover:text-white/70">What each stage means</Link>
          </p>
        </Card>
      </section>

      {/* Moving now */}
      <section>
        <SectionHeader
          title="Bills on the move"
          subtitle="Tech bills that have cleared committee or gone further, most recent activity first. These are the ones with a real shot."
          action={<Link href="/capitol-pulse/bills?stage=advanced" className="text-sm text-accent-blue hover:underline">All advancing bills →</Link>}
        />
        <ul className="grid gap-3 md:grid-cols-2">
          {moving.map((b) => (
            <BillRow key={b.id} bill={b} />
          ))}
        </ul>
      </section>

      {/* Topics */}
      <section>
        <SectionHeader title="Browse by topic" subtitle="Pick an issue to see every bill on it, who is pushing them, and which ones are moving." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((t) => {
            const topic = TOPIC_BY_SLUG[t.slug];
            return (
              <Link key={t.slug} href={`/capitol-pulse/topics/${t.slug}`} className="group">
                <Card className="h-full p-5 transition-colors group-hover:border-white/25 group-hover:bg-white/[0.06]">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-2xl" aria-hidden>{topic.icon}</span>
                    <span className="font-mono text-2xl font-bold text-white">{t.total}</span>
                  </div>
                  <h3 className="mt-3 font-display font-semibold text-white group-hover:text-accent-blue transition-colors">{topic.name}</h3>
                  <p className="mt-1 text-sm text-white/50 leading-relaxed">{topic.description}</p>
                  <p className="mt-3 text-xs text-white/60">
                    {t.advanced} advancing · {t.becameLaw} became law{t.recent ? ` · ${t.recent} with activity this month` : ""}
                  </p>
                  <div className="mt-3">
                    <PartyBar split={t.parties} />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-white/40">The bar shows the party of each bill&apos;s sponsor. A bill can belong to more than one topic.</p>
      </section>

      {/* Newest + most active */}
      <section className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div className="min-w-0">
          <SectionHeader
            title="Just introduced"
            action={<Link href="/capitol-pulse/bills?sort=newest" className="text-sm text-accent-blue hover:underline">All bills →</Link>}
          />
          <ul className="space-y-3">
            {fresh.map((b) => (
              <BillRow key={b.id} bill={b} showAction={false} />
            ))}
          </ul>
        </div>
        <div>
          <SectionHeader
            title="Most active on tech"
            action={<Link href="/capitol-pulse/members" className="text-sm text-accent-blue hover:underline">All lawmakers →</Link>}
          />
          <Card className="divide-y divide-white/5">
            {sponsors.map((s, i) => (
              <Link
                key={s.sponsor.bioguideId}
                href={`/capitol-pulse/members/${s.sponsor.bioguideId}`}
                className="flex items-center gap-3 p-4 hover:bg-white/[0.04] transition-colors"
              >
                <span className="w-5 text-right font-mono text-white/30">{i + 1}</span>
                <span className="flex-1 min-w-0">
                  <span className="block truncate text-white">{s.sponsor.name}</span>
                  <span className="text-xs">
                    <PartyTag party={s.sponsor.party} state={s.sponsor.state} district={s.sponsor.district} />
                  </span>
                </span>
                <span className="text-right text-sm">
                  <span className="block font-mono text-white">{s.count}</span>
                  <span className="text-xs text-white/40">{s.advanced} advancing</span>
                </span>
              </Link>
            ))}
          </Card>
          <p className="mt-2 text-xs text-white/40">Ranked by tech bills sponsored this Congress.</p>
        </div>
      </section>

      <p className="text-xs text-white/40 border-t border-white/10 pt-6">
        Source: Congress.gov API, refreshed every few hours (last refresh {formatDate(fetchedAt)}).{" "}
        <Link href="/capitol-pulse/methodology" className="underline hover:text-white/70">How we pick tech bills</Link>
      </p>
    </div>
  );
}
