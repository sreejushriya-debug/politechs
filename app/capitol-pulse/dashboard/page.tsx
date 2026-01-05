"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { 
  techTopics, 
  congressMembers, 
  statements, 
  bills,
  topicTrends,
  memberAlignments,
  getTopMembersByTopic,
  TechTopic,
  Chamber,
  Party
} from "@/data/capitol-pulse";
import { ScrollReveal } from "@/components/ScrollAnimations";

type FilterState = {
  topic: TechTopic | "All";
  chamber: Chamber | "All";
  party: Party | "All";
  search: string;
};

export default function DashboardPage() {
  const [filters, setFilters] = useState<FilterState>({
    topic: "All",
    chamber: "All",
    party: "All",
    search: ""
  });

  const [activeTab, setActiveTab] = useState<"attention" | "action" | "alignment">("attention");

  // Filter statements
  const filteredStatements = useMemo(() => {
    return statements.filter(stmt => {
      const member = congressMembers.find(m => m.id === stmt.memberId);
      if (!member) return false;

      if (filters.topic !== "All" && !stmt.topics.includes(filters.topic)) return false;
      if (filters.chamber !== "All" && member.chamber !== filters.chamber) return false;
      if (filters.party !== "All" && member.party !== filters.party) return false;
      if (filters.search && !stmt.title.toLowerCase().includes(filters.search.toLowerCase())) return false;

      return true;
    });
  }, [filters]);

  // Filter bills
  const filteredBills = useMemo(() => {
    return bills.filter(bill => {
      if (filters.topic !== "All" && !bill.topics.includes(filters.topic)) return false;
      return true;
    });
  }, [filters.topic]);

  // Get trend data for selected topic
  const trendData = useMemo(() => {
    if (filters.topic === "All") {
      // Aggregate all topics
      const dateMap = new Map<string, number>();
      topicTrends.forEach(t => {
        const current = dateMap.get(t.date) || 0;
        dateMap.set(t.date, current + t.statementsCount);
      });
      return Array.from(dateMap.entries())
        .map(([date, count]) => ({ date, statementsCount: count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    return topicTrends
      .filter(t => t.topic === filters.topic)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filters.topic]);

  // Get top members for topic
  const topMembers = useMemo(() => {
    if (filters.topic === "All") return congressMembers.slice(0, 5);
    return getTopMembersByTopic(filters.topic as TechTopic, 5);
  }, [filters.topic]);

  // Get framing breakdown
  const framingBreakdown = useMemo(() => {
    const counts = new Map<string, number>();
    filteredStatements.forEach(stmt => {
      stmt.framings.forEach(f => {
        counts.set(f, (counts.get(f) || 0) + 1);
      });
    });
    return Array.from(counts.entries())
      .map(([framing, count]) => ({ framing, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [filteredStatements]);

  const maxTrendValue = Math.max(...trendData.map(d => d.statementsCount), 1);
  const maxFramingValue = Math.max(...framingBreakdown.map(d => d.count), 1);

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <header className="mb-10">
          <ScrollReveal animation="fade-down">
            <Link href="/capitol-pulse" className="text-emerald-400 hover:text-emerald-300 text-sm mb-4 inline-block">
              ← Back to Capitol Pulse
            </Link>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Tech Policy Dashboard
            </h1>
            <p className="text-white/50 max-w-2xl">
              Explore how Congress is discussing and legislating on technology issues.
              Filter by topic, chamber, or party to drill down.
            </p>
          </ScrollReveal>
        </header>

        {/* Filters */}
        <ScrollReveal animation="fade-up">
          <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6 mb-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Topic Filter */}
              <div>
                <label className="text-white/50 text-sm mb-2 block">Topic</label>
                <select
                  value={filters.topic}
                  onChange={(e) => setFilters(f => ({ ...f, topic: e.target.value as TechTopic | "All" }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="All">All Topics</option>
                  {techTopics.map(t => (
                    <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
                  ))}
                </select>
              </div>

              {/* Chamber Filter */}
              <div>
                <label className="text-white/50 text-sm mb-2 block">Chamber</label>
                <select
                  value={filters.chamber}
                  onChange={(e) => setFilters(f => ({ ...f, chamber: e.target.value as Chamber | "All" }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="All">Both Chambers</option>
                  <option value="Senate">Senate</option>
                  <option value="House">House</option>
                </select>
              </div>

              {/* Party Filter */}
              <div>
                <label className="text-white/50 text-sm mb-2 block">Party</label>
                <select
                  value={filters.party}
                  onChange={(e) => setFilters(f => ({ ...f, party: e.target.value as Party | "All" }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="All">All Parties</option>
                  <option value="Democrat">Democrat</option>
                  <option value="Republican">Republican</option>
                  <option value="Independent">Independent</option>
                </select>
              </div>

              {/* Search */}
              <div>
                <label className="text-white/50 text-sm mb-2 block">Search</label>
                <input
                  type="text"
                  placeholder="Search statements..."
                  value={filters.search}
                  onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Stats Row */}
        <ScrollReveal animation="fade-up" delay={100}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 rounded-xl p-5 border border-white/5">
              <p className="text-white/40 text-sm mb-1">Statements</p>
              <p className="text-3xl font-display font-bold text-white">{filteredStatements.length}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-5 border border-white/5">
              <p className="text-white/40 text-sm mb-1">Bills</p>
              <p className="text-3xl font-display font-bold text-white">{filteredBills.length}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-5 border border-white/5">
              <p className="text-white/40 text-sm mb-1">Members Speaking</p>
              <p className="text-3xl font-display font-bold text-white">
                {new Set(filteredStatements.map(s => s.memberId)).size}
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-5 border border-white/5">
              <p className="text-white/40 text-sm mb-1">Topics Covered</p>
              <p className="text-3xl font-display font-bold text-white">
                {new Set(filteredStatements.flatMap(s => s.topics)).size}
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Trend Chart */}
          <ScrollReveal animation="fade-up" delay={150}>
            <div className="lg:col-span-2 bg-navy-800/40 rounded-2xl border border-white/5 p-6">
              <h3 className="text-white font-display font-semibold text-lg mb-6">
                Attention Over Time
                {filters.topic !== "All" && (
                  <span className="text-emerald-400 ml-2">— {filters.topic}</span>
                )}
              </h3>
              
              {/* Simple bar chart */}
              <div className="h-48 flex items-end gap-2">
                {trendData.slice(-8).map((d, i) => (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-gradient-to-t from-emerald-500/80 to-cyan-500/80 rounded-t-lg transition-all duration-500 hover:from-emerald-400 hover:to-cyan-400"
                      style={{ height: `${(d.statementsCount / maxTrendValue) * 100}%`, minHeight: '8px' }}
                      title={`${d.statementsCount} statements`}
                    />
                    <span className="text-white/30 text-xs transform -rotate-45 origin-top-left whitespace-nowrap">
                      {new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                ))}
              </div>
              
              <p className="text-white/30 text-xs mt-8 text-center">
                Click any bar to see underlying statements
              </p>
            </div>
          </ScrollReveal>

          {/* Framing Breakdown */}
          <ScrollReveal animation="fade-up" delay={200}>
            <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6">
              <h3 className="text-white font-display font-semibold text-lg mb-6">
                How It's Being Framed
              </h3>
              
              <div className="space-y-4">
                {framingBreakdown.map((f, i) => (
                  <div key={f.framing}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/70">{f.framing}</span>
                      <span className="text-white/40">{f.count}</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-500"
                        style={{ width: `${(f.count / maxFramingValue) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Top Members and Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Top Members */}
          <ScrollReveal animation="fade-up" delay={250}>
            <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6">
              <h3 className="text-white font-display font-semibold text-lg mb-6">
                Top Members
                {filters.topic !== "All" && (
                  <span className="text-emerald-400 ml-2">— {filters.topic}</span>
                )}
              </h3>
              
              <div className="space-y-3">
                {topMembers.map((member, i) => {
                  const score = filters.topic === "All" 
                    ? Math.max(...member.techFingerprint.map(f => f.score))
                    : member.techFingerprint.find(f => f.topic === filters.topic)?.score || 0;
                  
                  return (
                    <Link
                      key={member.id}
                      href={`/capitol-pulse/members/${member.id}`}
                      className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                    >
                      <span className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate group-hover:text-emerald-400 transition-colors">
                          {member.name}
                        </p>
                        <p className="text-white/40 text-sm">
                          {member.party.charAt(0)} • {member.state} • {member.chamber}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-400 font-bold">{score}</p>
                        <p className="text-white/30 text-xs">score</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
              
              <Link 
                href="/capitol-pulse/members"
                className="block text-center text-emerald-400 hover:text-emerald-300 text-sm mt-4"
              >
                View All Members →
              </Link>
            </div>
          </ScrollReveal>

          {/* Recent Statements */}
          <ScrollReveal animation="fade-up" delay={300}>
            <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6">
              <h3 className="text-white font-display font-semibold text-lg mb-6">
                Recent Statements
              </h3>
              
              <div className="space-y-4">
                {filteredStatements.slice(0, 4).map(stmt => {
                  const member = congressMembers.find(m => m.id === stmt.memberId);
                  return (
                    <Link
                      key={stmt.id}
                      href={`/capitol-pulse/search?id=${stmt.id}`}
                      className="block p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          stmt.tone === "Support" ? "bg-emerald-500/20 text-emerald-400" :
                          stmt.tone === "Concern" ? "bg-amber-500/20 text-amber-400" :
                          "bg-white/10 text-white/60"
                        }`}>
                          {stmt.tone}
                        </span>
                        <span className="text-white/30 text-xs">
                          {new Date(stmt.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-white font-medium text-sm line-clamp-2 mb-2 group-hover:text-emerald-400 transition-colors">
                        {stmt.title}
                      </p>
                      <p className="text-white/40 text-xs">
                        {member?.name} ({member?.party.charAt(0)}-{member?.state})
                      </p>
                    </Link>
                  );
                })}
              </div>
              
              <Link 
                href="/capitol-pulse/search"
                className="block text-center text-emerald-400 hover:text-emerald-300 text-sm mt-4"
              >
                Search All Statements →
              </Link>
            </div>
          </ScrollReveal>
        </div>

        {/* Recent Bills */}
        <ScrollReveal animation="fade-up" delay={350}>
          <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6">
            <h3 className="text-white font-display font-semibold text-lg mb-6">
              Tech-Related Legislation
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-white/40 text-sm font-medium py-3 px-4">Bill</th>
                    <th className="text-left text-white/40 text-sm font-medium py-3 px-4">Title</th>
                    <th className="text-left text-white/40 text-sm font-medium py-3 px-4">Topics</th>
                    <th className="text-left text-white/40 text-sm font-medium py-3 px-4">Status</th>
                    <th className="text-left text-white/40 text-sm font-medium py-3 px-4">Sponsors</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBills.map(bill => (
                    <tr key={bill.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4">
                        <a 
                          href={bill.congressGovUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:text-emerald-300 font-mono text-sm"
                        >
                          {bill.number}
                        </a>
                      </td>
                      <td className="py-4 px-4 text-white text-sm max-w-xs truncate">
                        {bill.title}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-1 flex-wrap">
                          {bill.topics.slice(0, 2).map(t => (
                            <span key={t} className="px-2 py-0.5 rounded-full bg-white/10 text-white/60 text-xs">
                              {techTopics.find(topic => topic.id === t)?.icon} {t.split(" ")[0]}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          bill.status === "Enacted" ? "bg-emerald-500/20 text-emerald-400" :
                          bill.status.includes("Passed") ? "bg-cyan-500/20 text-cyan-400" :
                          bill.status === "Failed" ? "bg-red-500/20 text-red-400" :
                          "bg-white/10 text-white/60"
                        }`}>
                          {bill.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-white/60 text-sm">
                        {bill.sponsors.map(s => congressMembers.find(m => m.id === s)?.name).join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}

