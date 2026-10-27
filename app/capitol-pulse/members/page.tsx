import { getMembers, getTechBills } from "@/lib/capitol-pulse/congress";
import { isAdvanced } from "@/lib/capitol-pulse/stages";
import { STATES, stateCode } from "@/lib/capitol-pulse/format";
import { MemberFinder, MemberWithActivity } from "@/components/capitol-pulse/MemberFinder";
import { PageHeader } from "@/components/capitol-pulse/ui";

export const dynamic = "force-dynamic";
export const maxDuration = 60;
export const metadata = { title: "Your lawmakers | Capitol Pulse" };

export default async function MembersPage({ searchParams }: { searchParams: { state?: string } }) {
  const [members, { bills }] = await Promise.all([getMembers(), getTechBills()]);

  const activity = new Map<string, { n: number; adv: number }>();
  for (const b of bills) {
    if (!b.sponsor) continue;
    const a = activity.get(b.sponsor.bioguideId) || { n: 0, adv: 0 };
    a.n++;
    if (isAdvanced(b.stage)) a.adv++;
    activity.set(b.sponsor.bioguideId, a);
  }
  const withActivity: MemberWithActivity[] = members.map((m) => ({
    ...m,
    techSponsored: activity.get(m.bioguideId)?.n ?? 0,
    techAdvanced: activity.get(m.bioguideId)?.adv ?? 0
  }));

  const state = stateCode(searchParams.state || "");

  return (
    <>
      <PageHeader title="Your lawmakers on tech">
        See who represents you and what they&apos;ve actually done on tech: the bills they wrote, the ones they signed on to, and how far
        those bills got.
      </PageHeader>
      <MemberFinder members={withActivity} initialState={state in STATES ? state : ""} />
    </>
  );
}
