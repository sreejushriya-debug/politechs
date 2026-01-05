"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { bills, congressMembers, techTopics, TechTopic } from "@/data/capitol-pulse";
import { ScrollReveal } from "@/components/ScrollAnimations";

type StatusFilter = "All" | "Introduced" | "In Committee" | "Passed House" | "Passed Senate" | "Enacted" | "Failed";

export default function BillsPage() {
  const [topicFilter, setTopicFilter] = useState<TechTopic | "All">("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [search, setSearch] = useState("");

  const filteredBills = useMemo(() => {
    return bills.filter(bill => {
      if (topicFilter !== "All" && !bill.topics.includes(topicFilter)) return false;
      if (statusFilter !== "All" && bill.status !== statusFilter) return false;
      if (search && !bill.title.toLowerCase().includes(search.toLowerCase()) && 
          !bill.number.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }).sort((a, b) => new Date(b.introducedAt).getTime() - new Date(a.introducedAt).getTime());
  }, [topicFilter, statusFilter, search]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { All: bills.length };
    bills.forEach(b => {
      counts[b.status] = (counts[b.status] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <header className="mb-10">
          <ScrollReveal animation="fade-down">
            <Link href="/capitol-pulse" className="text-emerald-400 hover:text-emerald-300 text-sm mb-4 inline-block">
              ← Back to Capitol Pulse
            </Link>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Tech Legislation Tracker
            </h1>
            <p className="text-white/50 max-w-2xl">
              Follow technology-related bills through Congress. See who's sponsoring what 
              and track progress from introduction to enactment.
            </p>
          </ScrollReveal>
        </header>

        {/* Filters */}
        <ScrollReveal animation="fade-up">
          <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6 mb-8">
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-white/50 text-sm mb-2 block">Search</label>
                <input
                  type="text"
                  placeholder="Bill number or title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              
              <div>
                <label className="text-white/50 text-sm mb-2 block">Topic</label>
                <select
                  value={topicFilter}
                  onChange={(e) => setTopicFilter(e.target.value as TechTopic | "All")}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="All">All Topics</option>
                  {techTopics.map(t => (
                    <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-white/50 text-sm mb-2 block">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="All">All Statuses ({statusCounts.All})</option>
                  <option value="Introduced">Introduced ({statusCounts.Introduced || 0})</option>
                  <option value="In Committee">In Committee ({statusCounts["In Committee"] || 0})</option>
                  <option value="Passed House">Passed House ({statusCounts["Passed House"] || 0})</option>
                  <option value="Passed Senate">Passed Senate ({statusCounts["Passed Senate"] || 0})</option>
                  <option value="Enacted">Enacted ({statusCounts.Enacted || 0})</option>
                  <option value="Failed">Failed ({statusCounts.Failed || 0})</option>
                </select>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Results Count */}
        <p className="text-white/40 text-sm mb-6">
          Showing {filteredBills.length} bill{filteredBills.length !== 1 ? "s" : ""}
        </p>

        {/* Bills List */}
        <div className="space-y-4">
          {filteredBills.map((bill, i) => {
            const sponsors = bill.sponsors.map(id => congressMembers.find(m => m.id === id)).filter(Boolean);
            const cosponsors = bill.cosponsors.map(id => congressMembers.find(m => m.id === id)).filter(Boolean);
            
            return (
              <ScrollReveal key={bill.id} animation="fade-up" delay={Math.min(i * 30, 150)}>
                <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6 hover:border-white/10 transition-colors">
                  {/* Header Row */}
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <a 
                        href={bill.congressGovUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 font-mono text-lg font-bold"
                      >
                        {bill.number}
                      </a>
                      <span className="text-white/30 text-sm ml-3">
                        Introduced {new Date(bill.introducedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}
                      </span>
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      bill.status === "Enacted" ? "bg-emerald-500/20 text-emerald-400" :
                      bill.status.includes("Passed") ? "bg-cyan-500/20 text-cyan-400" :
                      bill.status === "Failed" ? "bg-red-500/20 text-red-400" :
                      bill.status === "In Committee" ? "bg-amber-500/20 text-amber-400" :
                      "bg-white/10 text-white/60"
                    }`}>
                      {bill.status}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-white font-display font-semibold text-xl mb-3">
                    {bill.title}
                  </h2>
                  
                  {/* Summary */}
                  <p className="text-white/60 text-sm leading-relaxed mb-4">
                    {bill.summary}
                  </p>
                  
                  {/* Topics */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {bill.topics.map(t => {
                      const topic = techTopics.find(top => top.id === t);
                      return (
                        <Link
                          key={t}
                          href={`/capitol-pulse/topics/${encodeURIComponent(t)}`}
                          className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm hover:bg-emerald-500/20 transition-colors"
                        >
                          {topic?.icon} {t}
                        </Link>
                      );
                    })}
                  </div>
                  
                  {/* Sponsors */}
                  <div className="pt-4 border-t border-white/5">
                    <div className="flex flex-wrap gap-4">
                      <div>
                        <p className="text-white/40 text-xs mb-2">Sponsor{sponsors.length > 1 ? "s" : ""}</p>
                        <div className="flex flex-wrap gap-2">
                          {sponsors.map(s => s && (
                            <Link
                              key={s.id}
                              href={`/capitol-pulse/members/${s.id}`}
                              className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                            >
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                                s.party === "Democrat" ? "bg-blue-500" :
                                s.party === "Republican" ? "bg-red-500" :
                                "bg-purple-500"
                              }`}>
                                {s.name.charAt(0)}
                              </span>
                              <span className="text-white text-sm">{s.name}</span>
                              <span className="text-white/30 text-xs">({s.party.charAt(0)}-{s.state})</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                      
                      {cosponsors.length > 0 && (
                        <div>
                          <p className="text-white/40 text-xs mb-2">{cosponsors.length} Cosponsor{cosponsors.length > 1 ? "s" : ""}</p>
                          <div className="flex flex-wrap gap-2">
                            {cosponsors.slice(0, 3).map(c => c && (
                              <Link
                                key={c.id}
                                href={`/capitol-pulse/members/${c.id}`}
                                className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                              >
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                                  c.party === "Democrat" ? "bg-blue-500" :
                                  c.party === "Republican" ? "bg-red-500" :
                                  "bg-purple-500"
                                }`}>
                                  {c.name.charAt(0)}
                                </span>
                                <span className="text-white text-sm">{c.name}</span>
                              </Link>
                            ))}
                            {cosponsors.length > 3 && (
                              <span className="text-white/40 text-sm px-2 py-1">
                                +{cosponsors.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Link */}
                  <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
                    <a
                      href={bill.congressGovUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
                    >
                      View on Congress.gov →
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {filteredBills.length === 0 && (
          <div className="text-center py-16 bg-navy-800/20 rounded-2xl border border-white/5">
            <p className="text-white/50 text-lg mb-2">No bills match your filters.</p>
            <p className="text-white/30 text-sm">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

