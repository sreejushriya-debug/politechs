import { getTechBills } from "@/lib/capitol-pulse/congress";
import { STAGES } from "@/lib/capitol-pulse/stages";
import { isTopicSlug } from "@/lib/capitol-pulse/topics";
import { BillExplorer, BillFilters } from "@/components/capitol-pulse/BillExplorer";
import { PageHeader } from "@/components/capitol-pulse/ui";

export const dynamic = "force-dynamic";
export const maxDuration = 60;
export const metadata = { title: "Tech bills | Capitol Pulse" };

type Search = Record<string, string | string[] | undefined>;

function parseFilters(sp: Search): BillFilters {
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k]![0] : (sp[k] as string | undefined)) || "";
  const stage = one("stage");
  const chamber = one("chamber");
  const party = one("party").toUpperCase();
  const sort = one("sort");
  // Old links used ?search=
  const q = one("q") || one("search");
  return {
    q,
    topic: isTopicSlug(one("topic")) ? (one("topic") as BillFilters["topic"]) : "",
    stage: stage === "advanced" || STAGES.some((s) => s.id === stage) ? (stage as BillFilters["stage"]) : "",
    chamber: chamber === "house" || chamber === "senate" ? chamber : "",
    party: party === "D" || party === "R" || party === "I" ? party : "",
    sort: sort === "newest" || sort === "cosponsors" ? sort : "activity"
  };
}

export default async function BillsPage({ searchParams }: { searchParams: Search }) {
  const { bills } = await getTechBills();
  return (
    <>
      <PageHeader title="Tech bills in Congress">
        All {bills.length} technology bills introduced in this Congress. Filter by topic or progress, or search for a bill you heard about.
        Click any bill for a plain-English summary and its full history.
      </PageHeader>
      <BillExplorer bills={bills} initial={parseFilters(searchParams)} />
    </>
  );
}
