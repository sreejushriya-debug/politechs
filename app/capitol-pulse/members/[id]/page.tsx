"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { techTopics } from "@/data/capitol-pulse";
import { CongressMember, Statement, Bill, TechTopic, TECH_TOPICS } from "@/lib/capitol-pulse/types";
import { ScrollReveal } from "@/components/ScrollAnimations";
import {
  aggregateByMember,
  MemberOverview,
  MemberTopicAggregate,
  getGapLabelDisplay,
  GapLabel,
  TimeRange,
  generateEvidenceLink
} from "@/lib/capitol-pulse/words-vs-actions";

// Gap badge component
function GapBadge({ gap, size = 'md' }: { gap: GapLabel; size?: 'sm' | 'md' }) {
  const display = getGapLabelDisplay(gap);
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  
  const colorClasses = {
    amber: 'bg-amber-500/20 text-amber-400',
    emerald: 'bg-emerald-500/20 text-emerald-400',
    blue: 'bg-blue-500/20 text-blue-400',
    gray: 'bg-white/10 text-white/50'
  }[display.color];
  
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses} ${colorClasses}`} title={display.description}>
      <span>{display.icon}</span>
      <span>{display.text}</span>
    </span>
  );
}

export default function MemberProfilePage() {
  const params = useParams();
  const bioguideId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<CongressMember | null>(null);
  const [statements, setStatements] = useState<Statement[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [allBills, setAllBills] = useState<Bill[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>('all');

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch member data
        const membersRes = await fetch('/api/capitol-pulse/members');
        const membersData = await membersRes.json();
        const foundMember = (membersData.members || []).find(
          (m: CongressMember) => m.bioguideId === bioguideId
        );
        setMember(foundMember || null);
        
        // Fetch bills
        const billsRes = await fetch('/api/capitol-pulse/bills');
        const billsData = await billsRes.json();
        const allBillsList = billsData.bills || [];
        setAllBills(allBillsList);
        
        // Filter bills sponsored/cosponsored by this member
        const memberBills = allBillsList.filter((b: Bill) => 
          b.sponsorBioguideId === bioguideId || 
          (b.cosponsorBioguideIds || []).includes(bioguideId)
        );
        setBills(memberBills);
        
        // Statements would come from search API
        // For now, we don't have statement data
        setStatements([]);
        
      } catch (error) {
        console.error("Failed to load member:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [bioguideId]);

  // Calculate member overview with Words vs Actions
  const memberOverview: MemberOverview | null = useMemo(() => {
    if (!member) return null;
    return aggregateByMember(member, statements, allBills, [], timeRange);
  }, [member, statements, allBills, timeRange]);

  // Bills this member sponsored
  const sponsoredBills = useMemo(() => {
    return bills.filter(b => b.sponsorBioguideId === bioguideId);
  }, [bills, bioguideId]);

  // Bills this member cosponsored
  const cosponsoredBills = useMemo(() => {
    return bills.filter(b => 
      (b.cosponsorBioguideIds || []).includes(bioguideId)
    );
  }, [bills, bioguideId]);

  if (loading) {
    return (
      <div className="pt-28 pb-24 min-h-screen">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent-blue border-t-transparent" />
          </div>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="pt-28 pb-24 min-h-screen">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="text-6xl mb-6 block">🔍</span>
          <h1 className="text-4xl font-display font-bold text-white mb-4">Member Not Found</h1>
          <p className="text-white/50 mb-6">
            This member may not be in our current database, or the bioguide ID may be incorrect.
          </p>
          <Link href="/capitol-pulse/members" className="text-accent-blue hover:text-accent-blue/80">
            ← Browse All Members
          </Link>
        </div>
      </div>
    );
  }

  const partyColor = member.party === "Democratic" ? "from-blue-500 to-blue-600" :
                     member.party === "Republican" ? "from-red-500 to-red-600" :
                     "from-purple-500 to-purple-600";

  const partyBg = member.party === "Democratic" ? "bg-blue-500/10 border-blue-500/20" :
                  member.party === "Republican" ? "bg-red-500/10 border-red-500/20" :
                  "bg-purple-500/10 border-purple-500/20";

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Date unavailable";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch {
      return "Date unavailable";
    }
  };

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <header className="mb-12">
          <ScrollReveal animation="fade-down">
            <Link href="/capitol-pulse/members" className="text-accent-blue hover:text-accent-blue/80 text-sm mb-4 inline-block">
              ← All Members
            </Link>
          </ScrollReveal>
          
          <ScrollReveal animation="zoom-in" delay={100}>
            <div className="flex items-start gap-6 flex-wrap">
              {/* Avatar */}
              {member.imageUrl ? (
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-white/10">
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${partyColor} flex items-center justify-center text-white text-3xl font-bold`}>
                  {member.firstName[0]}{member.lastName[0]}
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                  {member.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${partyBg}`}>
                    {member.party}
                  </span>
                  <span className="text-white/60">
                    {member.chamber === "Senate" ? "Senator" : "Representative"} • {member.state}
                    {member.district && `-${member.district}`}
                  </span>
                  {memberOverview && memberOverview.overallGap !== 'no_data' && (
                    <GapBadge gap={memberOverview.overallGap} />
                  )}
                </div>
              </div>
              
              {member.officialUrl && (
                <a 
                  href={member.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
                >
                  Official Website →
                </a>
              )}
            </div>
          </ScrollReveal>

          {/* Official Source Notice */}
          <ScrollReveal animation="fade-up" delay={200}>
            <div className="mt-6 bg-white/5 rounded-xl p-4 border border-white/5">
              <p className="text-white/50 text-sm">
                <span className="text-accent-blue font-medium">Official ID:</span> {member.bioguideId} • 
                <a 
                  href={`https://bioguide.congress.gov/search/bio/${member.bioguideId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-blue hover:underline ml-1"
                >
                  View Bioguide →
                </a>
              </p>
            </div>
          </ScrollReveal>
        </header>

        {/* Words vs Actions Summary */}
        <ScrollReveal animation="fade-up" delay={150}>
          <div className="bg-gradient-to-br from-amber-500/10 via-navy-800/50 to-emerald-500/10 rounded-2xl border border-white/5 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-white font-display font-semibold text-lg flex items-center gap-2">
                  ⚡ Words vs Actions
                </h2>
                <p className="text-white/50 text-sm">
                  What {member.firstName} says vs. what they do on tech policy
                </p>
              </div>
              {/* Time Range Selector */}
              <div className="flex gap-2">
                {(['90d', '1y', 'all'] as TimeRange[]).map(range => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded-full text-xs ${
                      timeRange === range 
                        ? 'bg-accent-blue text-white' 
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {range === '90d' ? '90 Days' : range === '1y' ? '1 Year' : 'All'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div className="p-4 rounded-xl bg-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60">📢 Words (Attention)</span>
                  <Link
                    href={generateEvidenceLink({ type: 'statements', member: bioguideId })}
                    className="text-3xl font-bold text-amber-400 hover:underline"
                  >
                    {memberOverview?.totalAttention || 0}
                  </Link>
                </div>
                <p className="text-white/40 text-xs">Press releases + floor remarks</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60">🔧 Actions</span>
                  <Link
                    href={generateEvidenceLink({ type: 'bills', member: bioguideId })}
                    className="text-3xl font-bold text-emerald-400 hover:underline"
                  >
                    {memberOverview?.totalAction || 0}
                  </Link>
                </div>
                <p className="text-white/40 text-xs">Bills sponsored + cosponsored + votes</p>
              </div>
            </div>

            {/* Gaps and Aligned */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Biggest Gaps */}
              {memberOverview && memberOverview.biggestGaps.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <h3 className="text-amber-400 text-sm font-medium mb-3">⚠️ Biggest Gaps</h3>
                  <div className="space-y-2">
                    {memberOverview.biggestGaps.slice(0, 3).map(topicData => {
                      const topic = TECH_TOPICS.find(t => t.id === topicData.topic);
                      return (
                        <Link
                          key={topicData.topic}
                          href={generateEvidenceLink({ topic: topicData.topic, member: bioguideId })}
                          className="flex items-center justify-between p-2 rounded bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <span className="flex items-center gap-2 text-white/80 text-sm">
                            <span>{topic?.icon}</span>
                            <span>{topicData.topic}</span>
                          </span>
                          <GapBadge gap={topicData.gap} size="sm" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Most Aligned */}
              {memberOverview && memberOverview.mostAligned.length > 0 && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <h3 className="text-emerald-400 text-sm font-medium mb-3">✓ Most Aligned</h3>
                  <div className="space-y-2">
                    {memberOverview.mostAligned.slice(0, 3).map(topicData => {
                      const topic = TECH_TOPICS.find(t => t.id === topicData.topic);
                      return (
                        <Link
                          key={topicData.topic}
                          href={generateEvidenceLink({ topic: topicData.topic, member: bioguideId })}
                          className="flex items-center justify-between p-2 rounded bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <span className="flex items-center gap-2 text-white/80 text-sm">
                            <span>{topic?.icon}</span>
                            <span>{topicData.topic}</span>
                          </span>
                          <GapBadge gap={topicData.gap} size="sm" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* Topic Fingerprint Grid */}
        {memberOverview && memberOverview.topicBreakdown.some(t => t.attention.count > 0 || t.action.count > 0) && (
          <ScrollReveal animation="fade-up" delay={200}>
            <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6 mb-8">
              <h2 className="text-white font-display font-semibold text-lg mb-6">
                📊 Topic Fingerprint
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {memberOverview.topicBreakdown
                  .filter(t => t.attention.count > 0 || t.action.count > 0)
                  .map(topicData => {
                    const topic = TECH_TOPICS.find(t => t.id === topicData.topic);
                    return (
                      <div
                        key={topicData.topic}
                        className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xl">{topic?.icon}</span>
                          <Link
                            href={`/capitol-pulse/topics/${encodeURIComponent(topicData.topic)}`}
                            className="text-white font-medium text-sm hover:text-accent-blue transition-colors"
                          >
                            {topicData.topic}
                          </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-center">
                          <Link
                            href={topicData.attention.evidenceQuery}
                            className="p-2 rounded bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
                          >
                            <p className="text-amber-400 font-bold">{topicData.attention.count}</p>
                            <p className="text-white/40 text-xs">Words</p>
                          </Link>
                          <Link
                            href={topicData.action.evidenceQuery}
                            className="p-2 rounded bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
                          >
                            <p className="text-emerald-400 font-bold">{topicData.action.count}</p>
                            <p className="text-white/40 text-xs">Actions</p>
                          </Link>
                        </div>
                        <div className="mt-2 text-center">
                          <GapBadge gap={topicData.gap} size="sm" />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Bills Sponsored */}
          <ScrollReveal animation="fade-up" delay={250}>
            <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6">
              <h2 className="text-white font-display font-semibold text-lg mb-6">
                📜 Tech Bills Sponsored ({sponsoredBills.length})
              </h2>
              
              {sponsoredBills.length > 0 ? (
                <div className="space-y-4">
                  {sponsoredBills.slice(0, 5).map(bill => (
                    <Link
                      key={bill.billId}
                      href={`/capitol-pulse/bills/${bill.billId}`}
                      className="block p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-accent-blue font-mono text-sm group-hover:text-accent-blue/80">
                          {bill.billType.toUpperCase()}.{bill.billNumber}
                        </span>
                        <span className="text-white/30 text-xs">
                          {formatDate(bill.introducedDate)}
                        </span>
                      </div>
                      <p className="text-white font-medium text-sm line-clamp-2 group-hover:text-accent-blue transition-colors">
                        {bill.title}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {bill.topics.slice(0, 2).map(t => (
                          <span key={t} className="px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue text-xs">
                            {t}
                          </span>
                        ))}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/40 mb-2">No tech-related bills sponsored.</p>
                  <p className="text-white/30 text-sm">
                    Check back as more bills are introduced.
                  </p>
                </div>
              )}
              
              {sponsoredBills.length > 5 && (
                <Link 
                  href={`/capitol-pulse/search?type=bills&member=${bioguideId}`}
                  className="block text-center text-accent-blue hover:text-accent-blue/80 text-sm mt-4"
                >
                  View All {sponsoredBills.length} Bills →
                </Link>
              )}
            </div>
          </ScrollReveal>

          {/* Bills Cosponsored */}
          <ScrollReveal animation="fade-up" delay={300}>
            <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6">
              <h2 className="text-white font-display font-semibold text-lg mb-6">
                ✍️ Tech Bills Cosponsored ({cosponsoredBills.length})
              </h2>
              
              {cosponsoredBills.length > 0 ? (
                <div className="space-y-4">
                  {cosponsoredBills.slice(0, 5).map(bill => (
                    <Link
                      key={bill.billId}
                      href={`/capitol-pulse/bills/${bill.billId}`}
                      className="block p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-accent-blue font-mono text-sm group-hover:text-accent-blue/80">
                          {bill.billType.toUpperCase()}.{bill.billNumber}
                        </span>
                        <span className="text-white/30 text-xs">
                          {formatDate(bill.introducedDate)}
                        </span>
                      </div>
                      <p className="text-white font-medium text-sm line-clamp-2 group-hover:text-accent-blue transition-colors">
                        {bill.title}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/40 mb-2">No tech-related bills cosponsored.</p>
                </div>
              )}
              
              <a 
                href={`https://www.congress.gov/member/${member.lastName.toLowerCase()}-${member.firstName.toLowerCase()}/${member.bioguideId}?q=%7B%22sponsorship%22%3A%22cosponsored%22%7D`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-accent-blue hover:text-accent-blue/80 text-sm mt-4"
              >
                View All on Congress.gov →
              </a>
            </div>
          </ScrollReveal>
        </div>

        {/* Statements Section */}
        <ScrollReveal animation="fade-up" delay={350}>
          <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-display font-semibold text-lg">
                💬 Tech Statements ({statements.length})
              </h2>
              <Link
                href={`/capitol-pulse/search?type=statements&member=${bioguideId}`}
                className="text-accent-blue text-sm hover:text-accent-blue/80"
              >
                Search All →
              </Link>
            </div>
            
            {statements.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {statements.slice(0, 4).map(stmt => (
                  <Link
                    key={stmt.id}
                    href={`/capitol-pulse/statements/${stmt.id}`}
                    className="block p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        stmt.sourceType === 'press_release' 
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {stmt.sourceType === 'press_release' ? 'Press Release' : 'Official Record'}
                      </span>
                      <span className="text-white/30 text-xs">
                        {formatDate(stmt.publishedAt)}
                      </span>
                    </div>
                    <p className="text-white font-medium text-sm line-clamp-2 group-hover:text-accent-blue transition-colors">
                      {stmt.title}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {stmt.topics.slice(0, 2).map(t => (
                        <span key={t} className="px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue text-xs">
                          {t}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-amber-500/5 rounded-xl border border-amber-500/20">
                <span className="text-3xl mb-3 block">📢</span>
                <p className="text-amber-400 mb-2">Statement Data Coming Soon</p>
                <p className="text-white/40 text-sm max-w-md mx-auto">
                  We're working on integrating press releases from official .gov sites
                  and floor remarks from the Congressional Record.
                </p>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Disclaimer */}
        <ScrollReveal animation="fade-up" delay={400}>
          <p className="text-white/30 text-xs text-center max-w-2xl mx-auto">
            All data comes from official Congressional sources. Member information from the 
            <a href="https://bioguide.congress.gov" target="_blank" rel="noopener noreferrer" className="text-accent-blue/70 hover:text-accent-blue mx-1">
              Biographical Directory
            </a>
            and <a href="https://api.congress.gov" target="_blank" rel="noopener noreferrer" className="text-accent-blue/70 hover:text-accent-blue mx-1">Congress.gov API</a>.
            Every count shown links to its underlying evidence.
          </p>
        </ScrollReveal>
      </div>
    </div>
  );
}
