import Link from "next/link";
import { notFound } from "next/navigation";
import { getTechBills } from "@/lib/capitol-pulse/congress";
import { TOPICS, TOPIC_BY_SLUG, isTopicSlug } from "@/lib/capitol-pulse/topics";
import { newest, partySplit, recentlyAdvanced, stageFunnel, topSponsors } from "@/lib/capitol-pulse/stats";
import { BillRow, Card, EmptyState, PartyBar, PartyTag, SectionHeader, Stat } from "@/components/capitol-pulse/ui";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Props = { params: { topic: string } };

export function generateMetadata({ params }: Props) {
  const t = isTopicSlug(params.topic) ? TOPIC_BY_SLUG[params.topic] : null;
  return { title: t ? `${t.name} bills in Congress | Capitol Pulse` : "Topic | Capitol Pulse" };
}

export default async function TopicPage({ params }: Props) {
  if (!isTopicSlug(params.topic)) notFound();
  const topic = TOPIC_BY_SLUG[params.topic];
  const { bills: all } = await getTechBills();
  const bills = all.filter((b) => b.topics.includes(topic.slug));

  const funnel = stageFunnel(bills);
  const advancedCount = funnel.find((f) => f.stage === "committee")?.count ?? 0;
  const lawCount = funnel.find((f) => f.stage === "law")?.count ?? 0;
  const split = partySplit(bills.map((b) => b.sponsor));
  const withCosponsors = bills.filter((b) => b.sponsor && b.cosponsorCount > 0).length;
  const sponsors = topSponsors(bills, 8);
  const moving = recentlyAdvanced(bills, 6);
  const fresh = newest(bills, 6);

  return (
    <div className="space-y-14">
      <header>
        <nav className="mb-6 text-sm text-white/50">
          <Link href="/capitol-pulse" className="hover:text-white">Overview</Link>
          <span className="mx-2">/</span>
          <span className="text-white/70">{topic.name}</span>
        </nav>
        <div className="text-4xl mb-3" aria-hidden>{topic.icon}</div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-white">{topic.name}</h1>
        <p className="mt-4 text-lg text-white/60 max-w-3xl">{topic.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {TOPICS.filter((t) => t.slug !== topic.slug).map((t) => (
            <Link key={t.slug} href={`/capitol-pulse/topics/${t.slug}`} className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/60 hover:bg-white/10 hover:text-white">
              {t.icon} {t.name}
            </Link>
          ))}
        </div>
      </header>

      {bills.length === 0 ? (
        <EmptyState title="No bills on this topic yet this Congress" />
      ) : (
        <>
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat value={bills.length} label="bills introduced" />
            <Stat value={advancedCount} label="out of committee" hint={`${Math.round((advancedCount / bills.length) * 100)}% of them`} />
            <Stat value={lawCount} label="became law" />
            <Card className="p-5">
              <div className="text-sm text-white/70 mb-3">Who&apos;s writing them</div>
              <PartyBar split={split} showLegend />
              <div className="mt-2 text-xs text-white/40">{withCosponsors} have at least one cosponsor</div>
            </Card>
          </section>

          <section>
            <SectionHeader
              title={moving.length ? "Moving forward" : "Nothing has cleared committee yet"}
              subtitle={moving.length ? "These bills have made it past the committee stage, where most bills stall." : "Every bill on this topic is still waiting for a committee to act."}
              action={<Link href={`/capitol-pulse/bills?topic=${topic.slug}&stage=advanced`} className="text-sm text-accent-blue hover:underline">See all advancing →</Link>}
            />
            {moving.length > 0 && (
              <ul className="grid gap-3 md:grid-cols-2">
                {moving.map((b) => (
                  <BillRow key={b.id} bill={b} />
                ))}
              </ul>
            )}
          </section>

          <section className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
            <div className="min-w-0">
              <SectionHeader
                title="Newest bills"
                action={<Link href={`/capitol-pulse/bills?topic=${topic.slug}`} className="text-sm text-accent-blue hover:underline">All {bills.length} bills →</Link>}
              />
              <ul className="space-y-3">
                {fresh.map((b) => (
                  <BillRow key={b.id} bill={b} showAction={false} />
                ))}
              </ul>
            </div>
            <div>
              <SectionHeader title="Leading voices" subtitle="Lawmakers who wrote the most bills on this topic." />
              <Card className="divide-y divide-white/5">
                {sponsors.map((s) => (
                  <Link key={s.sponsor.bioguideId} href={`/capitol-pulse/members/${s.sponsor.bioguideId}`} className="flex items-center justify-between gap-3 p-4 hover:bg-white/[0.04]">
                    <span className="min-w-0">
                      <span className="block truncate text-white">{s.sponsor.name}</span>
                      <span className="text-xs"><PartyTag party={s.sponsor.party} state={s.sponsor.state} district={s.sponsor.district} /></span>
                    </span>
                    <span className="text-right text-sm">
                      <span className="block font-mono text-white">{s.count}</span>
                      <span className="text-xs text-white/40">{s.advanced} advancing</span>
                    </span>
                  </Link>
                ))}
              </Card>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
