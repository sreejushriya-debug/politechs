"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { techTopics } from "@/data/capitol-pulse";
import { getBills, getMembers } from "@/lib/capitol-pulse/data-store";
import { Bill, CongressMember, TechTopic } from "@/lib/capitol-pulse/types";
import { ScrollReveal } from "@/components/ScrollAnimations";

export default function BillsPage() {
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState<Bill[]>([]);
  const [members, setMembers] = useState<CongressMember[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [dataSource, setDataSource] = useState<string>("");

  const [topicFilter, setTopicFilter] = useState<TechTopic | "All">("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [billsData, membersData] = await Promise.all([
          getBills(),
          getMembers()
        ]);
        setBills(billsData.bills);
        setMembers(membersData.members);
        setLastUpdated(billsData.lastUpdated);
        setDataSource(billsData.source);
      } catch (error) {
        console.error("Failed to load bills:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredBills = useMemo(() => {
    return bills.filter(bill => {
      if (topicFilter !== "All" && !bill.topics.includes(topicFilter)) return false;
      if (search && !bill.title.toLowerCase().includes(search.toLowerCase()) && 
          !`${bill.billType}.${bill.billNumber}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }).sort((a, b) => new Date(b.introducedDate).getTime() - new Date(a.introducedDate).getTime());
  }, [bills, topicFilter, search]);

  const getSponsor = (bioguideId: string) => members.find(m => m.bioguideId === bioguideId);

  const formattedDate = new Date(lastUpdated).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <header className="mb-10">
          <ScrollReveal animation="fade-down">
            <Link href="/capitol-pulse" className="text-accent-blue hover:text-accent-blue/80 text-sm mb-4 inline-block">
              ← Back to Capitol Pulse
            </Link>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Tech Legislation Tracker
            </h1>
            <p className="text-white/50 max-w-2xl">
              Track technology-related bills from Congress.gov. Every bill links to its official page.
            </p>
          </ScrollReveal>
        </header>

        {/* Data Status */}
        <ScrollReveal animation="fade-up">
          <div className={`rounded-xl border p-4 mb-8 ${
            bills.length > 0 ? "bg-emerald-500/10 border-emerald-500/20" : "bg-amber-500/10 border-amber-500/20"
          }`}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${bills.length > 0 ? "bg-emerald-500" : "bg-amber-500"}`} />
                <span className={`text-sm font-medium ${bills.length > 0 ? "text-emerald-400" : "text-amber-400"}`}>
                  {dataSource}
                </span>
              </div>
              <span className="text-white/40 text-sm">
                {bills.length} bills tracked • Updated: {formattedDate}
              </span>
            </div>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent-blue border-t-transparent" />
          </div>
        ) : bills.length === 0 ? (
          <ScrollReveal animation="fade-up">
            <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-12 text-center">
              <span className="text-6xl mb-6 block">📜</span>
              <h2 className="text-2xl font-display font-bold text-white mb-4">
                No Bill Data Available
              </h2>
              <p className="text-white/50 max-w-lg mx-auto mb-6">
                Connect to the Congress.gov API to load tech-related legislation.
                Bills are tagged using official subjects and keyword matching.
              </p>
              <Link 
                href="/capitol-pulse/methodology"
                className="text-accent-blue hover:text-accent-blue/80"
              >
                Learn about our methodology →
              </Link>
            </div>
          </ScrollReveal>
        ) : (
          <>
            {/* Filters */}
            <ScrollReveal animation="fade-up">
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Search bill number or title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-accent-blue/50"
                  />
                </div>
                
                <select
                  value={topicFilter}
                  onChange={(e) => setTopicFilter(e.target.value as TechTopic | "All")}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue/50"
                >
                  <option value="All">All Topics</option>
                  {techTopics.map(t => (
                    <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
                  ))}
                </select>
              </div>
            </ScrollReveal>

            {/* Results Count */}
            <p className="text-white/40 text-sm mb-6">
              Showing {filteredBills.length} of {bills.length} bills
            </p>

            {/* Bills List */}
            <div className="space-y-4">
              {filteredBills.map((bill, i) => {
                const sponsor = getSponsor(bill.sponsorBioguideId);
                const topic = techTopics.find(t => bill.topics.includes(t.id));
                
                return (
                  <ScrollReveal key={bill.billId} animation="fade-up" delay={Math.min(i * 30, 150)}>
                    <Link 
                      href={`/capitol-pulse/bills/${bill.billId}`}
                      className="block bg-navy-800/40 rounded-2xl border border-white/5 p-6 hover:border-accent-blue/30 transition-colors group"
                    >
                      {/* Header Row */}
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          <span className="text-accent-blue group-hover:text-accent-blue/80 font-mono text-lg font-bold">
                            {bill.billType.toUpperCase()}.{bill.billNumber}
                          </span>
                          <span className="text-white/30 text-sm ml-3">
                            Introduced {new Date(bill.introducedDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric"
                            })}
                          </span>
                        </div>
                        {bill.latestAction && (
                          <span className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-sm">
                            {bill.latestAction.substring(0, 50)}...
                          </span>
                        )}
                      </div>
                      
                      {/* Title */}
                      <h2 className="text-white font-display font-semibold text-xl mb-3 group-hover:text-accent-blue transition-colors">
                        {bill.title}
                      </h2>
                      
                      {/* Summary */}
                      {bill.summary && (
                        <p className="text-white/60 text-sm leading-relaxed mb-4 line-clamp-3">
                          {bill.summary}
                        </p>
                      )}
                      
                      {/* Topics */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {bill.topics.map(t => {
                          const topicInfo = techTopics.find(topic => topic.id === t);
                          return (
                            <span
                              key={t}
                              className="px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue text-sm"
                            >
                              {topicInfo?.icon} {t}
                            </span>
                          );
                        })}
                      </div>

                      {/* Matched Subjects (transparency) */}
                      {bill.matchedSubjects.length > 0 && (
                        <div className="bg-white/5 rounded-lg p-3 mb-4">
                          <p className="text-white/40 text-xs mb-1">Tagged because of official subjects:</p>
                          <p className="text-white/60 text-sm">
                            {bill.matchedSubjects.join(", ")}
                          </p>
                        </div>
                      )}
                      
                      {/* Footer */}
                      <div className="pt-4 border-t border-white/5 flex items-center justify-between flex-wrap gap-4">
                        {sponsor ? (
                          <div className="flex items-center gap-2 text-white/60">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                              sponsor.party === "Democratic" ? "bg-blue-500" :
                              sponsor.party === "Republican" ? "bg-red-500" :
                              "bg-purple-500"
                            }`}>
                              {sponsor.firstName[0]}
                            </span>
                            <span className="text-sm">{sponsor.name}</span>
                            <span className="text-white/30 text-xs">
                              ({sponsor.party.charAt(0)}-{sponsor.state})
                            </span>
                          </div>
                        ) : (
                          <span className="text-white/40 text-sm">Sponsor: {bill.sponsorBioguideId}</span>
                        )}
                        
                        <div className="flex items-center gap-4">
                          {bill.cosponsorCount > 0 && (
                            <span className="text-white/40 text-sm">
                              {bill.cosponsorCount} cosponsor{bill.cosponsorCount !== 1 ? 's' : ''}
                            </span>
                          )}
                          <span className="text-accent-blue group-hover:text-accent-blue/80 text-sm font-medium">
                            View Details & Explainer →
                          </span>
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>

            {filteredBills.length === 0 && (
              <div className="text-center py-16 bg-navy-800/20 rounded-2xl border border-white/5">
                <p className="text-white/50 text-lg mb-2">No bills match your filters.</p>
                <p className="text-white/30 text-sm">Try adjusting your search or topic filter.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
