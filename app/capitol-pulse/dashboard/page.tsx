"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { techTopics } from "@/data/capitol-pulse";
import { CongressMember, Bill, Statement, TechTopic, CoverageMetrics, TECH_TOPICS } from "@/lib/capitol-pulse/types";
import { ScrollReveal } from "@/components/ScrollAnimations";
import {
  TopicAggregate,
  TimeRange,
  aggregateByTopic,
  getDashboardGaps,
  aggregateByMember,
  getGapLabelDisplay,
  GapLabel,
  generateEvidenceLink
} from "@/lib/capitol-pulse/words-vs-actions";

type Chamber = "House" | "Senate" | "All";
type Party = "Democratic" | "Republican" | "Independent" | "All";

// Simple trend chart component
function TrendMiniChart({ 
  data, 
  color = 'accent-blue',
  height = 40 
}: { 
  data: { weekStart: string; count: number }[]; 
  color?: string;
  height?: number;
}) {
  if (!data || data.length < 2) {
    return <div className="text-white/30 text-xs">No trend data</div>;
  }
  
  const max = Math.max(...data.map(d => d.count), 1);
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: ((max - d.count) / max) * height
  }));
  
  const pathD = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ');
  
  return (
    <svg viewBox={`0 0 100 ${height}`} className="w-full" style={{ height }}>
      <path
        d={pathD}
        fill="none"
        stroke={color === 'accent-blue' ? 'rgb(59, 130, 246)' : color === 'emerald' ? 'rgb(16, 185, 129)' : 'rgb(249, 115, 22)'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses} ${colorClasses}`}>
      <span>{display.icon}</span>
      <span>{display.text}</span>
    </span>
  );
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<CongressMember[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [statements, setStatements] = useState<Statement[]>([]);
  const [coverage, setCoverage] = useState<CoverageMetrics | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [dataSource, setDataSource] = useState<string>("");
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('90d');

  const [filters, setFilters] = useState({
    topic: "All" as TechTopic | "All",
    chamber: "All" as Chamber,
    party: "All" as Party,
    search: ""
  });

  useEffect(() => {
    async function loadData() {
      setFetchError(null);
      
      try {
        const [membersRes, billsRes] = await Promise.all([
          fetch('/api/capitol-pulse/members'),
          fetch('/api/capitol-pulse/bills')
        ]);
        
        if (!membersRes.ok) {
          throw new Error(`Members API returned ${membersRes.status}`);
        }
        if (!billsRes.ok) {
          throw new Error(`Bills API returned ${billsRes.status}`);
        }
        
        const membersData = await membersRes.json();
        const billsData = await billsRes.json();
        
        setMembers(membersData.members || []);
        setBills(billsData.bills || []);
        setStatements([]); // Statements integration pending
        setLastUpdated(membersData.lastUpdated || new Date().toISOString());
        setDataSource(membersData.source || 'Unknown');
        
        // Calculate coverage
        const membersList = membersData.members || [];
        const billsList = billsData.bills || [];
        
        const billsByTopic: Record<TechTopic, number> = {} as Record<TechTopic, number>;
        for (const topic of TECH_TOPICS) {
          billsByTopic[topic.id] = billsList.filter((b: Bill) => b.topics.includes(topic.id)).length;
        }
        
        setCoverage({
          lastUpdated: new Date().toISOString(),
          members: {
            total: membersList.length,
            house: membersList.filter((m: CongressMember) => m.chamber === 'House').length,
            senate: membersList.filter((m: CongressMember) => m.chamber === 'Senate').length,
            withStatements: 0,
            withBills: 0
          },
          bills: {
            total: billsList.length,
            byTopic: billsByTopic
          },
          votes: { total: 0, houseTotal: 0, senateTotal: 0 },
          statements: { total: 0, congressionalRecord: 0, pressReleases: 0 }
        });
        
      } catch (error) {
        console.error("Failed to load data:", error);
        setFetchError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Calculate Words vs Actions aggregates
  const topicAggregates = useMemo(() => {
    return TECH_TOPICS.map(t => 
      aggregateByTopic(statements, bills, [], members, t.id, timeRange)
    ).sort((a, b) => (b.attention.count + b.action.count) - (a.attention.count + a.action.count));
  }, [statements, bills, members, timeRange]);

  // Member overviews for gap analysis
  const memberOverviews = useMemo(() => {
    return members.slice(0, 100).map(m => 
      aggregateByMember(m, statements, bills, [], timeRange)
    );
  }, [members, statements, bills, timeRange]);

  // Dashboard gaps
  const dashboardGaps = useMemo(() => {
    return getDashboardGaps(memberOverviews);
  }, [memberOverviews]);

  // Filter bills by topic
  const filteredBills = useMemo(() => {
    if (filters.topic === "All") return bills;
    return bills.filter(b => b.topics.includes(filters.topic as TechTopic));
  }, [bills, filters.topic]);

  // Top active members (by bill sponsorship)
  const topActiveMembers = useMemo(() => {
    const counts = new Map<string, { member: CongressMember; bills: number; cosponsored: number }>();
    
    for (const bill of bills) {
      if (bill.sponsorBioguideId) {
        const member = members.find(m => m.bioguideId === bill.sponsorBioguideId);
        if (member) {
          const existing = counts.get(member.bioguideId) || { member, bills: 0, cosponsored: 0 };
          existing.bills++;
          counts.set(member.bioguideId, existing);
        }
      }
      for (const cosponsorId of bill.cosponsorBioguideIds || []) {
        const member = members.find(m => m.bioguideId === cosponsorId);
        if (member) {
          const existing = counts.get(member.bioguideId) || { member, bills: 0, cosponsored: 0 };
          existing.cosponsored++;
          counts.set(member.bioguideId, existing);
        }
      }
    }
    
    return Array.from(counts.values())
      .sort((a, b) => (b.bills * 2 + b.cosponsored) - (a.bills * 2 + a.cosponsored))
      .slice(0, 8);
  }, [bills, members]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Last updated: unavailable";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
      });
    } catch {
      return "Last updated: unavailable";
    }
  };

  const hasData = members.length > 0 || bills.length > 0;

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <header className="mb-10">
          <ScrollReveal animation="fade-down">
            <Link href="/capitol-pulse" className="text-accent-blue hover:text-accent-blue/80 text-sm mb-4 inline-block">
              ← Back to Capitol Pulse
            </Link>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Tech Policy Dashboard
            </h1>
            <p className="text-white/50 max-w-2xl">
              Track what Congress <strong className="text-white/70">says</strong> (words) vs. what they <strong className="text-white/70">do</strong> (actions) on tech policy.
              Every number links to its evidence.
            </p>
          </ScrollReveal>
        </header>

        {/* Data Status */}
        <ScrollReveal animation="fade-up">
          <div className={`rounded-xl border p-4 mb-8 ${
            hasData ? "bg-emerald-500/10 border-emerald-500/20" : "bg-amber-500/10 border-amber-500/20"
          }`}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${hasData ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                <span className={`text-sm font-medium ${hasData ? "text-emerald-400" : "text-amber-400"}`}>
                  {dataSource}
                </span>
              </div>
              <span className="text-white/40 text-sm">
                {formatDate(lastUpdated)}
              </span>
            </div>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent-blue border-t-transparent" />
          </div>
        ) : !hasData ? (
          // No Data State
          <ScrollReveal animation="fade-up">
            <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-12 text-center">
              <span className="text-6xl mb-6 block">🔌</span>
              <h2 className="text-2xl font-display font-bold text-white mb-4">
                API Configuration Required
              </h2>
              {fetchError && (
                <p className="text-red-400 bg-red-500/10 p-3 rounded-lg mb-4 text-sm">
                  Error: {fetchError}
                </p>
              )}
              <p className="text-white/50 max-w-lg mx-auto mb-6">
                Capitol Pulse requires a Congress.gov API key to display real Congressional data.
              </p>
              <div className="bg-navy-900/50 rounded-xl p-6 max-w-md mx-auto text-left">
                <p className="text-white/70 text-sm mb-3">To enable live data:</p>
                <ol className="text-white/50 text-sm space-y-2 list-decimal list-inside">
                  <li>Get a free API key from <a href="https://api.congress.gov/sign-up/" target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">api.congress.gov</a></li>
                  <li>Add <code className="bg-white/10 px-1 rounded">CONGRESS_API_KEY=your_key</code> to .env.local</li>
                  <li>Restart the development server</li>
                </ol>
              </div>
            </div>
          </ScrollReveal>
        ) : (
          <>
            {/* Time Range Selector */}
            <ScrollReveal animation="fade-up">
              <div className="flex items-center gap-2 mb-8">
                <span className="text-white/50 text-sm">Time Range:</span>
                {(['30d', '90d', '6m', '1y', 'all'] as TimeRange[]).map(range => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      timeRange === range 
                        ? 'bg-accent-blue text-white' 
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {range === '30d' ? '30 Days' : 
                     range === '90d' ? '90 Days' :
                     range === '6m' ? '6 Months' :
                     range === '1y' ? '1 Year' : 'All Time'}
                  </button>
                ))}
              </div>
            </ScrollReveal>

            {/* Stats Row - Words vs Actions */}
            <ScrollReveal animation="fade-up" delay={100}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                  <p className="text-white/40 text-sm mb-1 flex items-center gap-2">
                    📢 Words (Attention)
                  </p>
                  <p className="text-3xl font-display font-bold text-amber-400">{statements.length}</p>
                  <p className="text-white/30 text-xs mt-1">Press releases + floor remarks</p>
                </div>
                <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                  <p className="text-white/40 text-sm mb-1 flex items-center gap-2">
                    🔧 Actions
                  </p>
                  <p className="text-3xl font-display font-bold text-emerald-400">{bills.length}</p>
                  <p className="text-white/30 text-xs mt-1">Bills + votes</p>
                </div>
                <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                  <p className="text-white/40 text-sm mb-1">Members Tracked</p>
                  <p className="text-3xl font-display font-bold text-white">{members.length}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                  <p className="text-white/40 text-sm mb-1">Tech Topics</p>
                  <p className="text-3xl font-display font-bold text-white">{TECH_TOPICS.length}</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Words vs Actions by Topic */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <ScrollReveal animation="fade-up" delay={150}>
                <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white font-display font-semibold text-lg">
                      📊 Words vs Actions by Topic
                    </h3>
                    <Link 
                      href="/capitol-pulse/search"
                      className="text-accent-blue text-sm hover:text-accent-blue/80"
                    >
                      View All →
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {topicAggregates.slice(0, 6).map(agg => {
                      const topic = TECH_TOPICS.find(t => t.id === agg.topic);
                      return (
                        <div
                          key={agg.topic}
                          className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl">{topic?.icon}</span>
                            <Link
                              href={`/capitol-pulse/topics/${encodeURIComponent(agg.topic)}`}
                              className="text-white font-medium hover:text-accent-blue transition-colors"
                            >
                              {agg.topic}
                            </Link>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-white/50 text-xs">Words</span>
                                <Link
                                  href={agg.attention.evidenceQuery}
                                  className="text-amber-400 font-bold hover:underline"
                                >
                                  {agg.attention.count}
                                </Link>
                              </div>
                              <TrendMiniChart data={agg.attention.trend} color="amber" height={24} />
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-white/50 text-xs">Actions</span>
                                <Link
                                  href={agg.action.evidenceQuery}
                                  className="text-emerald-400 font-bold hover:underline"
                                >
                                  {agg.action.count}
                                </Link>
                              </div>
                              <TrendMiniChart data={agg.action.trend} color="emerald" height={24} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ScrollReveal>

              {/* Top Active Members */}
              <ScrollReveal animation="fade-up" delay={200}>
                <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white font-display font-semibold text-lg">
                      🏆 Most Active on Tech
                    </h3>
                    <Link 
                      href="/capitol-pulse/members"
                      className="text-accent-blue text-sm hover:text-accent-blue/80"
                    >
                      View All →
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {topActiveMembers.map(({ member, bills: billCount, cosponsored }) => (
                      <Link
                        key={member.bioguideId}
                        href={`/capitol-pulse/members/${member.bioguideId}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          member.party === "Democratic" ? "bg-blue-500" :
                          member.party === "Republican" ? "bg-red-500" :
                          "bg-purple-500"
                        }`}>
                          {member.firstName[0]}{member.lastName[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate group-hover:text-accent-blue transition-colors">
                            {member.name}
                          </p>
                          <p className="text-white/40 text-xs">
                            {member.party.charAt(0)}-{member.state} • {member.chamber}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-emerald-400 font-bold">{billCount}</p>
                          <p className="text-white/30 text-xs">bills sponsored</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Biggest Gaps Section */}
            {dashboardGaps.topGaps.length > 0 && (
              <ScrollReveal animation="fade-up" delay={250}>
                <div className="bg-gradient-to-br from-amber-500/10 via-navy-800/50 to-emerald-500/10 rounded-2xl border border-white/5 p-6 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-white font-display font-semibold text-lg flex items-center gap-2">
                        ⚡ Biggest Gaps: Words vs Actions
                      </h3>
                      <p className="text-white/50 text-sm">
                        Members with the largest difference between what they say and what they do
                      </p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dashboardGaps.topGaps.slice(0, 6).map((gap, i) => (
                      <Link
                        key={`${gap.member.bioguideId}-${gap.topic}-${i}`}
                        href={gap.evidenceLink}
                        className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                              gap.member.party === "Democratic" ? "bg-blue-500" :
                              gap.member.party === "Republican" ? "bg-red-500" :
                              "bg-purple-500"
                            }`}>
                              {gap.member.name.split(' ').map(n => n[0]).join('')}
                            </span>
                            <div>
                              <p className="text-white text-sm font-medium group-hover:text-accent-blue transition-colors">
                                {gap.member.name}
                              </p>
                              <p className="text-white/40 text-xs">
                                {gap.member.party.charAt(0)}-{gap.member.state}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/60 text-sm">{gap.topic}</span>
                          <GapBadge gap={gap.gapLabel} size="sm" />
                        </div>
                        <div className="flex justify-between mt-2 text-xs">
                          <span className="text-amber-400">{gap.attentionCount} words</span>
                          <span className="text-emerald-400">{gap.actionCount} actions</span>
                        </div>
                        <p className="text-white/30 text-xs mt-2 group-hover:text-accent-blue/50">
                          Click to view evidence →
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Recent Bills */}
            <ScrollReveal animation="fade-up" delay={300}>
              <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-display font-semibold text-lg">
                    📜 Recent Tech Bills
                  </h3>
                  <Link 
                    href="/capitol-pulse/bills"
                    className="text-accent-blue text-sm hover:text-accent-blue/80"
                  >
                    View All Bills →
                  </Link>
                </div>
                {filteredBills.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredBills.slice(0, 6).map(bill => (
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
                            {bill.introducedDate ? new Date(bill.introducedDate).toLocaleDateString() : 'Date unavailable'}
                          </span>
                        </div>
                        <p className="text-white font-medium text-sm line-clamp-2 group-hover:text-accent-blue transition-colors">
                          {bill.title}
                        </p>
                        <div className="flex gap-1 mt-2 flex-wrap">
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
                  <p className="text-white/40 text-center py-8">
                    No bills found.
                  </p>
                )}
              </div>
            </ScrollReveal>

            {/* Coverage Panel */}
            <ScrollReveal animation="fade-up" delay={350}>
              <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6">
                <h3 className="text-white font-display font-semibold text-lg mb-4">
                  📊 Data Coverage
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/50 text-sm">Members</span>
                      <span className="text-emerald-400 text-sm font-medium">
                        {coverage?.members.total || 0}/535
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${((coverage?.members.total || 0) / 535) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/50 text-sm">Bills</span>
                      <span className="text-emerald-400 text-sm font-medium">
                        {coverage?.bills.total || 0}
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/50 text-sm">Press Releases</span>
                      <span className="text-amber-400 text-sm font-medium">
                        {coverage?.statements.pressReleases || 0} (pending)
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '0%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/50 text-sm">Official Record</span>
                      <span className="text-amber-400 text-sm font-medium">
                        {coverage?.statements.congressionalRecord || 0} (pending)
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '0%' }} />
                    </div>
                  </div>
                </div>
                <Link 
                  href="/capitol-pulse/methodology"
                  className="block text-center text-white/40 hover:text-white/60 text-sm mt-6"
                >
                  Learn about our data sources →
                </Link>
              </div>
            </ScrollReveal>
          </>
        )}
      </div>
    </div>
  );
}
