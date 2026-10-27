import Link from "next/link";
import { notFound } from "next/navigation";
import { getBillPage, getTechBills } from "@/lib/capitol-pulse/congress";
import { STAGES, STAGE_INDEX, Stage } from "@/lib/capitol-pulse/stages";
import { formatDate, parseBillId } from "@/lib/capitol-pulse/format";
import { partySplit } from "@/lib/capitol-pulse/stats";
import { Card, PartyBar, PartyTag, StageBadge, TopicChip } from "@/components/capitol-pulse/ui";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Props = { params: { billId: string } };

export async function generateMetadata({ params }: Props) {
  const id = parseBillId(params.billId);
  if (!id) return { title: "Bill not found | Capitol Pulse" };
  const page = await getBillPage(id.congress, id.type, id.number).catch(() => null);
  return { title: page ? `${page.bill.label}: ${page.bill.title} | Capitol Pulse` : "Bill | Capitol Pulse" };
}

function ProgressSteps({ stage, origin }: { stage: Stage; origin: "House" | "Senate" }) {
  const other = origin === "House" ? "Senate" : "House";
  const steps: { id: Stage; label: string }[] = [
    { id: "introduced", label: "Introduced" },
    { id: "committee", label: "Out of committee" },
    { id: "passed-one", label: `Passed ${origin}` },
    { id: "passed-both", label: `Passed ${other}` },
    { id: "law", label: "Became law" }
  ];
  const reached = STAGE_INDEX[stage];
  return (
    <ol className="grid grid-cols-5 gap-1 sm:gap-2">
      {steps.map((s, i) => {
        const done = STAGE_INDEX[s.id] <= reached;
        const current = done && (i === steps.length - 1 || STAGE_INDEX[steps[i + 1].id] > reached);
        return (
          <li key={s.id} className="text-center">
            <div className={`h-2 rounded-full ${done ? (stage === "law" ? "bg-emerald-400" : "bg-sky-400") : "bg-white/10"}`} />
            <div className={`mt-2 text-[11px] sm:text-xs leading-tight ${current ? "text-white font-semibold" : done ? "text-white/70" : "text-white/35"}`}>
              {s.label}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default async function BillPage({ params }: Props) {
  const id = parseBillId(params.billId);
  if (!id) notFound();
  const [page, all] = await Promise.all([getBillPage(id.congress, id.type, id.number), getTechBills().catch(() => null)]);
  if (!page) notFound();

  const { bill, summary, cosponsors, actions, committees, subjects } = page;
  const stageInfo = STAGES[STAGE_INDEX[bill.stage]];
  const companions = (all?.bills ?? []).filter(
    (b) => b.id !== bill.id && b.title.trim().toLowerCase() === bill.title.trim().toLowerCase()
  );
  const split = partySplit([bill.sponsor, ...cosponsors]);
  const bipartisan = split.D > 0 && split.R > 0;
  const recentActions = actions.slice(0, 6);
  const olderActions = actions.slice(6);

  return (
    <article>
      <nav className="mb-6 text-sm text-white/50">
        <Link href="/capitol-pulse/bills" className="hover:text-white">Tech bills</Link>
        <span className="mx-2">/</span>
        <span className="text-white/70">{bill.label}</span>
      </nav>

      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3 text-sm">
          <span className="font-mono text-white/60">{bill.label}</span>
          <StageBadge stage={bill.stage} />
          {bipartisan && <span className="rounded-full bg-violet-500/15 px-2.5 py-0.5 text-xs text-violet-300">Bipartisan</span>}
        </div>
        <h1 className="text-2xl md:text-4xl font-display font-bold text-white leading-tight max-w-4xl">{bill.title}</h1>
        <p className="mt-3 text-white/50 text-sm">
          Introduced in the {bill.originChamber} on {formatDate(bill.introducedDate, { month: "long", day: "numeric", year: "numeric" })}
        </p>
        {bill.topics.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {bill.topics.map((t) => (
              <TopicChip key={t} slug={t} />
            ))}
          </div>
        )}
      </header>

      <Card className="p-6 mb-10">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-5">
          <h2 className="font-display font-semibold text-white">Where it stands</h2>
          <span className="text-sm text-white/50">{stageInfo.description}</span>
        </div>
        <ProgressSteps stage={bill.stage} origin={bill.originChamber} />
        {bill.latestActionText && (
          <p className="mt-5 text-sm text-white/70">
            <span className="text-white/40">Latest ({formatDate(bill.latestActionDate)}):</span> {bill.latestActionText}
          </p>
        )}
      </Card>

      <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-10 min-w-0">
          <section>
            <h2 className="text-xl font-display font-bold text-white mb-1">{bill.stage === "law" ? "What it does" : "What it would do"}</h2>
            {summary ? (
              <>
                <p className="text-xs text-white/40 mb-4">
                  Nonpartisan summary by the Congressional Research Service ({summary.version}
                  {summary.date ? `, ${formatDate(summary.date)}` : ""})
                </p>
                <div className="space-y-3 text-white/80 leading-relaxed">
                  {summary.blocks
                    .filter((b, i) => !(i === 0 && b.text.trim().toLowerCase() === bill.title.trim().toLowerCase()))
                    .map((b, i) =>
                    b.kind === "li" ? (
                      <p key={i} className="pl-5 relative before:absolute before:left-1 before:content-['•'] before:text-white/40">{b.text}</p>
                    ) : (
                      <p key={i}>{b.text}</p>
                    )
                  )}
                </div>
              </>
            ) : (
              <div className="mt-3 rounded-xl border border-dashed border-white/15 p-5 text-sm text-white/60">
                The Congressional Research Service hasn&apos;t published a summary of this bill yet. Summaries usually appear a few weeks
                after a bill is introduced. Until then, the title above and the{" "}
                <a href={`${bill.url}/text`} target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">
                  full bill text on Congress.gov
                </a>{" "}
                are the best sources.
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white mb-4">History</h2>
            {actions.length === 0 ? (
              <p className="text-white/50 text-sm">No actions recorded yet.</p>
            ) : (
              <ol className="relative border-l border-white/10 ml-2 space-y-5">
                {recentActions.map((a, i) => (
                  <li key={i} className="pl-5 relative">
                    <span className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full ${i === 0 ? "bg-sky-400" : "bg-white/25"}`} />
                    <div className="text-xs text-white/40">
                      {formatDate(a.date)}
                      {a.chamber ? ` · ${a.chamber}` : ""}
                    </div>
                    <div className="text-sm text-white/80 mt-0.5">{a.text}</div>
                  </li>
                ))}
              </ol>
            )}
            {olderActions.length > 0 && (
              <details className="mt-4 ml-2">
                <summary className="cursor-pointer text-sm text-accent-blue hover:underline">Show {olderActions.length} earlier actions</summary>
                <ol className="relative border-l border-white/10 mt-4 space-y-5">
                  {olderActions.map((a, i) => (
                    <li key={i} className="pl-5 relative">
                      <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-white/25" />
                      <div className="text-xs text-white/40">{formatDate(a.date)}{a.chamber ? ` · ${a.chamber}` : ""}</div>
                      <div className="text-sm text-white/80 mt-0.5">{a.text}</div>
                    </li>
                  ))}
                </ol>
              </details>
            )}
          </section>
        </div>

        <aside className="space-y-5">
          {bill.sponsor && (
            <Card className="p-5">
              <h3 className="text-xs uppercase tracking-wider text-white/40 mb-3">Written by</h3>
              <Link href={`/capitol-pulse/members/${bill.sponsor.bioguideId}`} className="group block">
                <span className="block text-white font-medium group-hover:text-accent-blue">{bill.sponsor.name}</span>
                <span className="text-sm">
                  <PartyTag party={bill.sponsor.party} state={bill.sponsor.state} district={bill.sponsor.district} />
                </span>
                <span className="block mt-2 text-xs text-accent-blue">See their other tech bills →</span>
              </Link>
            </Card>
          )}

          <Card className="p-5">
            <h3 className="text-xs uppercase tracking-wider text-white/40 mb-3">Support</h3>
            <p className="text-white">
              <span className="text-2xl font-display font-bold">{cosponsors.length}</span>{" "}
              <span className="text-white/60 text-sm">cosponsor{cosponsors.length === 1 ? "" : "s"}</span>
            </p>
            {cosponsors.length > 0 && (
              <>
                <div className="mt-3">
                  <PartyBar split={split} showLegend />
                </div>
                <p className="mt-1 text-xs text-white/40">Sponsor plus cosponsors, by party</p>
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-accent-blue hover:underline">See all cosponsors</summary>
                  <ul className="mt-3 max-h-72 overflow-y-auto space-y-1.5 text-sm pr-1">
                    {cosponsors.map((c) => (
                      <li key={c.bioguideId} className="flex justify-between gap-2">
                        <Link href={`/capitol-pulse/members/${c.bioguideId}`} className="text-white/80 hover:text-white truncate">
                          {c.name}
                        </Link>
                        <PartyTag party={c.party} state={c.state} />
                      </li>
                    ))}
                  </ul>
                </details>
              </>
            )}
          </Card>

          {(committees.length > 0 || bill.policyArea) && (
            <Card className="p-5 text-sm">
              {committees.length > 0 && (
                <>
                  <h3 className="text-xs uppercase tracking-wider text-white/40 mb-2">Committees</h3>
                  <ul className="space-y-1 text-white/80 mb-4">
                    {committees.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </>
              )}
              {bill.policyArea && (
                <>
                  <h3 className="text-xs uppercase tracking-wider text-white/40 mb-2">Policy area</h3>
                  <p className="text-white/80">{bill.policyArea}</p>
                </>
              )}
              {subjects.length > 0 && (
                <p className="mt-3 text-xs text-white/45 leading-relaxed">{subjects.slice(0, 8).join(" · ")}</p>
              )}
            </Card>
          )}

          {companions.length > 0 && (
            <Card className="p-5 text-sm">
              <h3 className="text-xs uppercase tracking-wider text-white/40 mb-2">Companion bill</h3>
              <p className="text-white/50 text-xs mb-2">Same bill introduced in the other chamber:</p>
              {companions.map((c) => (
                <Link key={c.id} href={`/capitol-pulse/bills/${c.id}`} className="flex items-center justify-between gap-2 text-white hover:text-accent-blue">
                  <span className="font-mono">{c.label}</span>
                  <StageBadge stage={c.stage} />
                </Link>
              ))}
            </Card>
          )}

          <Card className="p-5 text-sm space-y-3">
            <a href={bill.url} target="_blank" rel="noopener noreferrer" className="block text-accent-blue hover:underline">
              Official page on Congress.gov ↗
            </a>
            <a href={`${bill.url}/text`} target="_blank" rel="noopener noreferrer" className="block text-accent-blue hover:underline">
              Read the full bill text ↗
            </a>
            <Link href="/capitol-pulse/members" className="block text-accent-blue hover:underline">
              Tell your lawmakers what you think →
            </Link>
          </Card>
        </aside>
      </div>
    </article>
  );
}
