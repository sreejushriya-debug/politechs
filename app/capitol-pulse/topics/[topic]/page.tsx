"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { techTopics } from "@/data/capitol-pulse";
import { Statement, Bill, CongressMember, TechTopic, TECH_TOPICS } from "@/lib/capitol-pulse/types";
import { ScrollReveal } from "@/components/ScrollAnimations";
import {
  aggregateByTopic,
  TopicAggregate,
  TimeRange,
  generateEvidenceLink,
  getGapLabelDisplay,
  GapLabel
} from "@/lib/capitol-pulse/words-vs-actions";

// Simple trend chart component
function TrendChart({ 
  data, 
  color = 'accent-blue',
  height = 60 
}: { 
  data: { weekStart: string; count: number }[]; 
  color?: string;
  height?: number;
}) {
  if (!data || data.length < 2) {
    return <div className="text-white/30 text-xs text-center py-4">Insufficient trend data</div>;
  }
  
  const max = Math.max(...data.map(d => d.count), 1);
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: ((max - d.count) / max) * height
  }));
  
  const pathD = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ');
  
  // Create area path for fill
  const areaD = `${pathD} L 100 ${height} L 0 ${height} Z`;
  
  const strokeColor = color === 'amber' ? 'rgb(245, 158, 11)' : 'rgb(16, 185, 129)';
  const fillColor = color === 'amber' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)';
  
  return (
    <svg viewBox={`0 0 100 ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      <path d={areaD} fill={fillColor} />
      <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function TopicPage() {
  const params = useParams();
  const topicId = decodeURIComponent(params.topic as string) as TechTopic;
  
  const [loading, setLoading] = useState(true);
  const [statements, setStatements] = useState<Statement[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [members, setMembers] = useState<CongressMember[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [timeRange, setTimeRange] = useState<TimeRange>('90d');
  
  const topic = techTopics.find(t => t.id === topicId);

  useEffect(() => {
    async function loadData() {
      try {
        const [billsRes, membersRes] = await Promise.all([
          fetch('/api/capitol-pulse/bills'),
          fetch('/api/capitol-pulse/members')
        ]);
        
        const billsData = await billsRes.json();
        const membersData = await membersRes.json();
        
        // Filter by topic
        setStatements([]); // Statements integration pending
        setBills((billsData.bills || []).filter((b: Bill) => b.topics.includes(topicId)));
        setMembers(membersData.members || []);
        setLastUpdated(billsData.lastUpdated || new Date().toISOString());
      } catch (error) {
        console.error("Failed to load topic data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [topicId]);

  // Calculate topic aggregate with Words vs Actions
  const topicAggregate: TopicAggregate | null = useMemo(() => {
    if (!topic) return null;
    return aggregateByTopic(statements, bills, [], members, topicId, timeRange);
  }, [statements, bills, members, topicId, timeRange, topic]);

  // Calculate active members for this topic
  const activeMemberIds = useMemo(() => {
    const ids = new Set<string>();
    statements.forEach(s => ids.add(s.bioguideId));
    bills.forEach(b => {
      ids.add(b.sponsorBioguideId);
      (b.cosponsorBioguideIds || []).forEach(id => ids.add(id));
    });
    return ids;
  }, [statements, bills]);

  const activeMembers = useMemo(() => {
    return members.filter(m => activeMemberIds.has(m.bioguideId));
  }, [members, activeMemberIds]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Date unavailable";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch {
      return "Date unavailable";
    }
  };

  if (!topic) {
    return (
      <div className="pt-28 pb-24 min-h-screen">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="text-6xl mb-6 block">🏷️</span>
          <h1 className="text-4xl font-display font-bold text-white mb-4">Topic Not Found</h1>
          <p className="text-white/50 mb-6">
            This topic is not in our tracking list.
          </p>
          <Link href="/capitol-pulse" className="text-accent-blue hover:text-accent-blue/80">
            ← Back to Capitol Pulse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <header className="mb-12">
          <ScrollReveal animation="fade-down">
            <Link href="/capitol-pulse/dashboard" className="text-accent-blue hover:text-accent-blue/80 text-sm mb-4 inline-block">
              ← Back to Dashboard
            </Link>
          </ScrollReveal>
          
          <ScrollReveal animation="zoom-in" delay={100}>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-6xl">{topic.icon}</span>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
                {topic.name}
              </h1>
            </div>
          </ScrollReveal>
          
          <ScrollReveal animation="fade-up" delay={200}>
            <p className="text-white/60 text-lg max-w-3xl leading-relaxed">
              {topic.description}
            </p>
          </ScrollReveal>

          {/* Classification Keywords */}
          <ScrollReveal animation="fade-up" delay={250}>
            <div className="mt-6 bg-white/5 rounded-xl p-4 border border-white/5">
              <p className="text-white/50 text-sm">
                <span className="text-white/70">Classification keywords:</span>{" "}
                {topic.keywords.slice(0, 8).join(", ")}
                {topic.keywords.length > 8 && ` +${topic.keywords.length - 8} more`}
              </p>
            </div>
          </ScrollReveal>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent-blue border-t-transparent" />
          </div>
        ) : (
          <>
            {/* Time Range & Quick Stats */}
            <ScrollReveal animation="fade-up">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-2">
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
                      {range === '30d' ? '30D' : 
                       range === '90d' ? '90D' :
                       range === '6m' ? '6M' :
                       range === '1y' ? '1Y' : 'All'}
                    </button>
                  ))}
                </div>
                <span className="text-white/40 text-sm">
                  Last updated: {formatDate(lastUpdated)}
                </span>
              </div>
            </ScrollReveal>

            {/* Words vs Actions Cards */}
            <ScrollReveal animation="fade-up" delay={100}>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Words (Attention) Card */}
                <div className="bg-gradient-to-br from-amber-500/10 to-navy-800/50 rounded-2xl border border-amber-500/20 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white font-display font-semibold text-lg flex items-center gap-2">
                        📢 Words (Attention)
                      </h3>
                      <p className="text-white/50 text-sm">Press releases + floor remarks</p>
                    </div>
                    <Link
                      href={topicAggregate?.attention.evidenceQuery || '#'}
                      className="text-4xl font-bold text-amber-400 hover:underline"
                    >
                      {topicAggregate?.attention.count || 0}
                    </Link>
                  </div>
                  
                  <div className="mb-4">
                    <TrendChart 
                      data={topicAggregate?.attention.trend || []} 
                      color="amber" 
                      height={60} 
                    />
                  </div>
                  
                  {topicAggregate && topicAggregate.topMembers.byAttention.length > 0 && (
                    <div>
                      <p className="text-white/50 text-xs mb-2">Top by Attention:</p>
                      <div className="flex flex-wrap gap-2">
                        {topicAggregate.topMembers.byAttention.slice(0, 3).map(m => (
                          <Link
                            key={m.bioguideId}
                            href={`/capitol-pulse/members/${m.bioguideId}`}
                            className="px-2 py-1 rounded bg-amber-500/10 text-amber-400 text-xs hover:bg-amber-500/20"
                          >
                            {m.name} ({m.count})
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions Card */}
                <div className="bg-gradient-to-br from-emerald-500/10 to-navy-800/50 rounded-2xl border border-emerald-500/20 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white font-display font-semibold text-lg flex items-center gap-2">
                        🔧 Actions
                      </h3>
                      <p className="text-white/50 text-sm">Bills + votes</p>
                    </div>
                    <Link
                      href={topicAggregate?.action.evidenceQuery || '#'}
                      className="text-4xl font-bold text-emerald-400 hover:underline"
                    >
                      {topicAggregate?.action.count || 0}
                    </Link>
                  </div>
                  
                  <div className="mb-4">
                    <TrendChart 
                      data={topicAggregate?.action.trend || []} 
                      color="emerald" 
                      height={60} 
                    />
                  </div>
                  
                  {topicAggregate && topicAggregate.topMembers.byAction.length > 0 && (
                    <div>
                      <p className="text-white/50 text-xs mb-2">Top by Action:</p>
                      <div className="flex flex-wrap gap-2">
                        {topicAggregate.topMembers.byAction.slice(0, 3).map(m => (
                          <Link
                            key={m.bioguideId}
                            href={`/capitol-pulse/members/${m.bioguideId}`}
                            className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs hover:bg-emerald-500/20"
                          >
                            {m.name} ({m.count})
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6 mb-12">
              {/* Key Bills */}
              <ScrollReveal animation="fade-up" delay={150} className="lg:col-span-2">
                <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white font-display font-semibold text-lg">
                      📜 Key Legislation
                    </h3>
                    <Link 
                      href={`/capitol-pulse/search?type=bills&topic=${encodeURIComponent(topicId)}`}
                      className="text-accent-blue text-sm hover:text-accent-blue/80"
                    >
                      View All →
                    </Link>
                  </div>
                  {bills.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {bills.slice(0, 4).map(bill => (
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
                          <p className="text-white text-sm font-medium line-clamp-2 group-hover:text-accent-blue transition-colors">
                            {bill.title}
                          </p>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/40 text-sm text-center py-8">
                      No bills found for this topic.
                    </p>
                  )}
                </div>
              </ScrollReveal>

              {/* Active Members */}
              <ScrollReveal animation="fade-up" delay={200}>
                <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6">
                  <h3 className="text-white font-display font-semibold text-lg mb-6">
                    👥 Active Members
                  </h3>
                  {activeMembers.length > 0 ? (
                    <div className="space-y-3">
                      {activeMembers.slice(0, 6).map(member => (
                        <Link
                          key={member.bioguideId}
                          href={`/capitol-pulse/members/${member.bioguideId}`}
                          className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                        >
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                            member.party === "Democratic" ? "bg-blue-500" :
                            member.party === "Republican" ? "bg-red-500" :
                            "bg-purple-500"
                          }`}>
                            {member.firstName[0]}{member.lastName[0]}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium text-sm truncate group-hover:text-accent-blue transition-colors">
                              {member.name}
                            </p>
                            <p className="text-white/40 text-xs">
                              {member.party.charAt(0)} • {member.state}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/40 text-sm text-center py-8">
                      No active members found.
                    </p>
                  )}
                  {activeMembers.length > 6 && (
                    <Link 
                      href="/capitol-pulse/members"
                      className="block text-center text-accent-blue hover:text-accent-blue/80 text-sm mt-4"
                    >
                      View All Members →
                    </Link>
                  )}
                </div>
              </ScrollReveal>
            </div>

            {/* Empty State */}
            {statements.length === 0 && bills.length === 0 && (
              <ScrollReveal animation="fade-up">
                <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-12 text-center">
                  <span className="text-6xl mb-6 block">📊</span>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">
                    Limited Data Available
                  </h2>
                  <p className="text-white/50 max-w-lg mx-auto">
                    No tech-related activity found for this topic in the current time range.
                    Try expanding the time range or check back as more data becomes available.
                  </p>
                </div>
              </ScrollReveal>
            )}

            {/* Explore More */}
            <ScrollReveal animation="fade-up" delay={300}>
              <div className="mt-12">
                <h3 className="text-white/50 text-sm font-medium uppercase tracking-wider mb-4">
                  Explore Other Topics
                </h3>
                <div className="flex flex-wrap gap-3">
                  {techTopics.filter(t => t.id !== topicId).slice(0, 6).map(t => (
                    <Link
                      key={t.id}
                      href={`/capitol-pulse/topics/${encodeURIComponent(t.id)}`}
                      className="px-4 py-2 rounded-full bg-white/5 text-white/70 text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
                    >
                      <span>{t.icon}</span>
                      <span>{t.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </>
        )}
      </div>
    </div>
  );
}
