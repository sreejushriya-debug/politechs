"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { techTopics } from "@/data/capitol-pulse";
import { CongressMember, Bill, Statement, TechTopic, CoverageMetrics, TECH_TOPICS } from "@/lib/capitol-pulse/types";
import { ScrollReveal } from "@/components/ScrollAnimations";

type Chamber = "House" | "Senate" | "All";
type Party = "Democratic" | "Republican" | "Independent" | "All";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<CongressMember[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [statements, setStatements] = useState<Statement[]>([]);
  const [coverage, setCoverage] = useState<CoverageMetrics | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [dataSource, setDataSource] = useState<string>("");
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    topic: "All" as TechTopic | "All",
    chamber: "All" as Chamber,
    party: "All" as Party,
    search: ""
  });

  useEffect(() => {
    async function loadData() {
      setFetchError(null);
      console.log("[Capitol Pulse] Starting data fetch from API routes...");
      
      try {
        // Directly fetch from our API routes
        console.log("[Capitol Pulse] Fetching /api/capitol-pulse/members...");
        const membersRes = await fetch('/api/capitol-pulse/members');
        console.log("[Capitol Pulse] Members response status:", membersRes.status);
        
        console.log("[Capitol Pulse] Fetching /api/capitol-pulse/bills...");
        const billsRes = await fetch('/api/capitol-pulse/bills');
        console.log("[Capitol Pulse] Bills response status:", billsRes.status);
        
        if (!membersRes.ok) {
          const errorText = await membersRes.text();
          throw new Error(`Members API returned ${membersRes.status}: ${errorText}`);
        }
        if (!billsRes.ok) {
          const errorText = await billsRes.text();
          throw new Error(`Bills API returned ${billsRes.status}: ${errorText}`);
        }
        
        const membersData = await membersRes.json();
        const billsData = await billsRes.json();
        
        console.log("[Capitol Pulse] Members loaded:", membersData.members?.length || 0);
        console.log("[Capitol Pulse] Bills loaded:", billsData.bills?.length || 0);
        console.log("[Capitol Pulse] Data source:", membersData.source);
        
        setMembers(membersData.members || []);
        setBills(billsData.bills || []);
        setStatements([]); // Statements not yet implemented
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
        console.error("[Capitol Pulse] Failed to load data:", error);
        setFetchError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter bills by topic
  const filteredBills = useMemo(() => {
    if (filters.topic === "All") return bills;
    return bills.filter(b => b.topics.includes(filters.topic as TechTopic));
  }, [bills, filters.topic]);

  // Filter statements
  const filteredStatements = useMemo(() => {
    return statements.filter(stmt => {
      const member = members.find(m => m.bioguideId === stmt.bioguideId);
      if (!member) return false;
      if (filters.topic !== "All" && !stmt.topics.includes(filters.topic as TechTopic)) return false;
      if (filters.chamber !== "All" && member.chamber !== filters.chamber) return false;
      if (filters.party !== "All" && member.party !== filters.party) return false;
      return true;
    });
  }, [statements, members, filters]);

  // Topic stats
  const topicStats = useMemo(() => {
    return techTopics.map(topic => ({
      topic: topic.id,
      icon: topic.icon,
      billCount: bills.filter(b => b.topics.includes(topic.id)).length,
      statementCount: statements.filter(s => s.topics.includes(topic.id)).length
    })).sort((a, b) => (b.billCount + b.statementCount) - (a.billCount + a.statementCount));
  }, [bills, statements]);

  const formattedDate = new Date(lastUpdated).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });

  const hasData = members.length > 0 || bills.length > 0 || statements.length > 0;

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
              Explore how Congress is discussing and legislating on technology issues.
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
                  Data Source: {dataSource}
                </span>
              </div>
              <span className="text-white/40 text-sm">
                Last updated: {formattedDate}
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
                Connect to Official Data
              </h2>
              {fetchError && (
                <p className="text-red-400 bg-red-500/10 p-3 rounded-lg mb-4 text-sm">
                  Error: {fetchError}
                </p>
              )}
              <p className="text-white/50 max-w-lg mx-auto mb-6">
                Capitol Pulse requires a Congress.gov API key to display real Congressional data.
                All data comes from official government sources—no placeholders or fake data.
              </p>
              <div className="bg-navy-900/50 rounded-xl p-6 max-w-md mx-auto text-left">
                <p className="text-white/70 text-sm mb-3">To enable live data:</p>
                <ol className="text-white/50 text-sm space-y-2 list-decimal list-inside">
                  <li>Get a free API key from <a href="https://api.congress.gov/sign-up/" target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">api.congress.gov</a></li>
                  <li>Add <code className="bg-white/10 px-1 rounded">CONGRESS_API_KEY=your_key</code> to your .env file</li>
                  <li>Restart the development server</li>
                </ol>
              </div>
              <Link 
                href="/capitol-pulse/methodology"
                className="inline-block mt-8 text-accent-blue hover:text-accent-blue/80 text-sm"
              >
                Learn more about our data sources →
              </Link>
            </div>
          </ScrollReveal>
        ) : (
          <>
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
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue/50"
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
                      onChange={(e) => setFilters(f => ({ ...f, chamber: e.target.value as Chamber }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue/50"
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
                      onChange={(e) => setFilters(f => ({ ...f, party: e.target.value as Party }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue/50"
                    >
                      <option value="All">All Parties</option>
                      <option value="Democratic">Democratic</option>
                      <option value="Republican">Republican</option>
                      <option value="Independent">Independent</option>
                    </select>
                  </div>

                  {/* Search */}
                  <div>
                    <label className="text-white/50 text-sm mb-2 block">Search</label>
                    <input
                      type="text"
                      placeholder="Search bills..."
                      value={filters.search}
                      onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-accent-blue/50"
                    />
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Stats Row */}
            <ScrollReveal animation="fade-up" delay={100}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                  <p className="text-white/40 text-sm mb-1">Members</p>
                  <p className="text-3xl font-display font-bold text-white">{coverage?.members.total || 0}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                  <p className="text-white/40 text-sm mb-1">Tech Bills</p>
                  <p className="text-3xl font-display font-bold text-white">{filteredBills.length}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                  <p className="text-white/40 text-sm mb-1">Statements</p>
                  <p className="text-3xl font-display font-bold text-white">{filteredStatements.length}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                  <p className="text-white/40 text-sm mb-1">Topics</p>
                  <p className="text-3xl font-display font-bold text-white">{techTopics.length}</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Topic Breakdown */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <ScrollReveal animation="fade-up" delay={150}>
                <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6">
                  <h3 className="text-white font-display font-semibold text-lg mb-6">
                    Activity by Topic
                  </h3>
                  <div className="space-y-4">
                    {topicStats.slice(0, 6).map(stat => (
                      <Link
                        key={stat.topic}
                        href={`/capitol-pulse/topics/${encodeURIComponent(stat.topic)}`}
                        className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                      >
                        <span className="text-2xl">{stat.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate group-hover:text-accent-blue transition-colors">
                            {stat.topic}
                          </p>
                          <p className="text-white/40 text-sm">
                            {stat.billCount} bills • {stat.statementCount} statements
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Recent Bills */}
              <ScrollReveal animation="fade-up" delay={200}>
                <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6">
                  <h3 className="text-white font-display font-semibold text-lg mb-6">
                    Recent Tech Bills
                  </h3>
                  {filteredBills.length > 0 ? (
                    <div className="space-y-4">
                      {filteredBills.slice(0, 5).map(bill => (
                        <a
                          key={bill.billId}
                          href={bill.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-accent-blue font-mono text-sm group-hover:text-accent-blue/80">
                              {bill.billType.toUpperCase()}.{bill.billNumber}
                            </span>
                            <span className="text-white/30 text-xs">
                              {new Date(bill.introducedDate).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-white font-medium text-sm line-clamp-2">
                            {bill.title}
                          </p>
                          <div className="flex gap-1 mt-2">
                            {bill.topics.slice(0, 2).map(t => (
                              <span key={t} className="px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue text-xs">
                                {t}
                              </span>
                            ))}
                          </div>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/40 text-center py-8">
                      No bills found for this filter.
                    </p>
                  )}
                  <Link 
                    href="/capitol-pulse/bills"
                    className="block text-center text-accent-blue hover:text-accent-blue/80 text-sm mt-4"
                  >
                    View All Bills →
                  </Link>
                </div>
              </ScrollReveal>
            </div>

            {/* Coverage Info */}
            <ScrollReveal animation="fade-up" delay={250}>
              <div className="bg-gradient-to-br from-accent-blue/10 via-navy-800/50 to-accent-red/10 rounded-2xl border border-white/5 p-6">
                <h3 className="text-white font-display font-semibold text-lg mb-4">
                  Data Coverage
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-white/40 text-sm mb-1">House Members</p>
                    <p className="text-white font-bold">{coverage?.members.house || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/40 text-sm mb-1">Senate Members</p>
                    <p className="text-white font-bold">{coverage?.members.senate || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/40 text-sm mb-1">Congressional Record</p>
                    <p className="text-white font-bold">{coverage?.statements.congressionalRecord || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/40 text-sm mb-1">Press Releases</p>
                    <p className="text-white font-bold">{coverage?.statements.pressReleases || 0}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </>
        )}
      </div>
    </div>
  );
}
