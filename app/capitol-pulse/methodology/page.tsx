import Link from "next/link";
import { STAGES } from "@/lib/capitol-pulse/stages";
import { TOPICS } from "@/lib/capitol-pulse/topics";
import { Card, PageHeader } from "@/components/capitol-pulse/ui";

export const metadata = { title: "How it works | Capitol Pulse" };

export default function MethodologyPage() {
  return (
    <div className="max-w-3xl">
      <PageHeader title="How Capitol Pulse works">
        Capitol Pulse answers three questions: what tech bills exist, how far they&apos;ve gotten, and who is behind them. Here is exactly
        where the data comes from and how we decide what counts.
      </PageHeader>

      <div className="space-y-12 text-white/75 leading-relaxed">
        <section>
          <h2 className="text-xl font-display font-bold text-white mb-3">Where the data comes from</h2>
          <p>
            Everything comes from the official{" "}
            <a href="https://api.congress.gov" target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">Congress.gov API</a>,
            run by the Library of Congress. That includes bill titles, sponsors, cosponsors, official actions, committee assignments, and the
            nonpartisan bill summaries written by the Congressional Research Service (CRS). We don&apos;t write our own summaries or use AI to
            describe bills. Data refreshes every few hours.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold text-white mb-3">What counts as a tech bill</h2>
          <p className="mb-4">
            We check the official title of every bill and joint resolution introduced in the current Congress (simple and concurrent
            resolutions, which mostly honor people or set internal rules, are left out). A bill is tagged with a topic when its title contains one
            of the terms below as a whole word. For example, &ldquo;AI&rdquo; must appear as the capitalized acronym, so &ldquo;maintain&rdquo;
            doesn&apos;t count. A bill can have more than one topic.
          </p>
          <div className="space-y-3">
            {TOPICS.map((t) => (
              <Card key={t.slug} className="p-4">
                <div className="font-medium text-white">
                  {t.icon} {t.name}
                </div>
                <div className="mt-1 text-sm text-white/55">{t.examples.join(" · ")}</div>
              </Card>
            ))}
          </div>
          <p className="mt-4 text-sm text-white/50">
            Titles don&apos;t always say what a bill does, so a few tech-related bills with vague titles will be missed, and now and then a bill
            only touches tech in passing. If you spot one we got wrong, please <Link href="/contact" className="text-accent-blue hover:underline">let us know</Link>.
          </p>
        </section>

        <section id="stages">
          <h2 className="text-xl font-display font-bold text-white mb-3">What the progress stages mean</h2>
          <p className="mb-4">
            We read a bill&apos;s official actions to place it on the path every bill has to take to become law:
          </p>
          <ol className="space-y-3">
            {STAGES.map((s, i) => (
              <li key={s.id} className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm text-white">{i + 1}</span>
                <span>
                  <span className="font-medium text-white">{s.label}.</span> {s.description}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-white/50">
            Sometimes a bill&apos;s contents pass as part of a bigger package even though the original bill never moves. Those cases show up as
            &ldquo;Introduced&rdquo; here.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold text-white mb-3">Sponsors and cosponsors</h2>
          <p>
            The <span className="text-white">sponsor</span> is the lawmaker who introduced the bill. <span className="text-white">Cosponsors</span>{" "}
            publicly sign on to support it. Lots of cosponsors, especially from both parties, is one of the best early signs that a bill could
            move.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold text-white mb-3">What we don&apos;t cover yet</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Roll-call votes and floor speeches.</li>
            <li>Bills from earlier Congresses. Bills that don&apos;t pass by the end of a Congress expire and have to be reintroduced.</li>
            <li>Regulations from agencies like the FTC and FCC.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-display font-bold text-white mb-3">Using the data</h2>
          <p>
            Every filtered view on the <Link href="/capitol-pulse/bills" className="text-accent-blue hover:underline">bills page</Link> can be
            downloaded as a CSV. The full dataset is also available as JSON at{" "}
            <a href="/api/capitol-pulse/bills" className="font-mono text-sm text-accent-blue hover:underline">/api/capitol-pulse/bills</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
