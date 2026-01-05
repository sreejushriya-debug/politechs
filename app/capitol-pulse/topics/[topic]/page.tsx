"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { techTopics } from "@/data/capitol-pulse";
import { getStatements, getBills, getMembers } from "@/lib/capitol-pulse/data-store";
import { Statement, Bill, CongressMember, TechTopic } from "@/lib/capitol-pulse/types";
import { ScrollReveal } from "@/components/ScrollAnimations";

export default function TopicPage() {
  const params = useParams();
  const topicId = decodeURIComponent(params.topic as string) as TechTopic;
  
  const [loading, setLoading] = useState(true);
  const [statements, setStatements] = useState<Statement[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [members, setMembers] = useState<CongressMember[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  
  const topic = techTopics.find(t => t.id === topicId);

  useEffect(() => {
    async function loadData() {
      try {
        const [stmtsData, billsData, membersData] = await Promise.all([
          getStatements(),
          getBills(),
          getMembers()
        ]);
        
        // Filter by topic
        setStatements(stmtsData.statements.filter(s => s.topics.includes(topicId)));
        setBills(billsData.bills.filter(b => b.topics.includes(topicId)));
        setMembers(membersData.members);
        setLastUpdated(billsData.lastUpdated);
      } catch (error) {
        console.error("Failed to load topic data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [topicId]);

  // Calculate active members for this topic
  const activeMemberIds = useMemo(() => {
    const ids = new Set<string>();
    statements.forEach(s => ids.add(s.bioguideId));
    bills.forEach(b => {
      ids.add(b.sponsorBioguideId);
      b.cosponsorBioguideIds.forEach(id => ids.add(id));
    });
    return ids;
  }, [statements, bills]);

  const activeMembers = useMemo(() => {
    return members.filter(m => activeMemberIds.has(m.bioguideId));
  }, [members, activeMemberIds]);

  // Calculate tone breakdown
  const toneCounts = useMemo(() => {
    const counts = { Support: 0, Concern: 0, Neutral: 0 };
    statements.forEach(s => {
      if (s.tone) counts[s.tone]++;
    });
    return counts;
  }, [statements]);

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

  const formattedDate = new Date(lastUpdated).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

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

          {/* Data Status */}
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
            {/* Stats */}
            <ScrollReveal animation="fade-up" delay={100}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <div className="bg-white/5 rounded-xl p-5 border border-white/5 text-center">
                  <p className="text-3xl font-display font-bold text-white mb-1">{statements.length}</p>
                  <p className="text-white/40 text-sm">Statements</p>
                </div>
                <div className="bg-white/5 rounded-xl p-5 border border-white/5 text-center">
                  <p className="text-3xl font-display font-bold text-white mb-1">{bills.length}</p>
                  <p className="text-white/40 text-sm">Bills</p>
                </div>
                <div className="bg-white/5 rounded-xl p-5 border border-white/5 text-center">
                  <p className="text-3xl font-display font-bold text-white mb-1">{activeMembers.length}</p>
                  <p className="text-white/40 text-sm">Active Members</p>
                </div>
                <div className="bg-white/5 rounded-xl p-5 border border-white/5 text-center">
                  <p className="text-white/40 text-sm mb-1">Last Updated</p>
                  <p className="text-white text-sm">{formattedDate}</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6 mb-12">
              {/* Tone Breakdown */}
              {statements.length > 0 && (
                <ScrollReveal animation="fade-up" delay={150}>
                  <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6">
                    <h3 className="text-white font-display font-semibold text-lg mb-6">
                      Tone Distribution
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(toneCounts).map(([tone, count]) => (
                        <div key={tone}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className={`font-medium ${
                              tone === "Support" ? "text-emerald-400" :
                              tone === "Concern" ? "text-amber-400" :
                              "text-white/60"
                            }`}>{tone}</span>
                            <span className="text-white/40">{count}</span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                tone === "Support" ? "bg-emerald-500" :
                                tone === "Concern" ? "bg-amber-500" :
                                "bg-white/30"
                              }`}
                              style={{ width: statements.length > 0 ? `${(count / statements.length) * 100}%` : '0%' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Key Bills */}
              <ScrollReveal animation="fade-up" delay={200}>
                <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6">
                  <h3 className="text-white font-display font-semibold text-lg mb-6">
                    Key Legislation
                  </h3>
                  {bills.length > 0 ? (
                    <div className="space-y-4">
                      {bills.slice(0, 4).map(bill => (
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
                          </div>
                          <p className="text-white text-sm font-medium line-clamp-2">
                            {bill.title}
                          </p>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/40 text-sm text-center py-8">
                      No bills found for this topic.
                    </p>
                  )}
                  {bills.length > 4 && (
                    <Link 
                      href={`/capitol-pulse/bills?topic=${encodeURIComponent(topicId)}`}
                      className="block text-center text-accent-blue hover:text-accent-blue/80 text-sm mt-4"
                    >
                      View All {bills.length} Bills →
                    </Link>
                  )}
                </div>
              </ScrollReveal>

              {/* Active Members */}
              <ScrollReveal animation="fade-up" delay={250}>
                <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6">
                  <h3 className="text-white font-display font-semibold text-lg mb-6">
                    Active Members
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
                      No active members found for this topic.
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

            {/* Recent Statements */}
            {statements.length > 0 && (
              <ScrollReveal animation="fade-up" delay={300}>
                <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white font-display font-semibold text-lg">
                      Recent Statements
                    </h3>
                    <Link 
                      href={`/capitol-pulse/search?topic=${encodeURIComponent(topicId)}`}
                      className="text-accent-blue hover:text-accent-blue/80 text-sm"
                    >
                      View All →
                    </Link>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {statements.slice(0, 6).map(stmt => {
                      const member = members.find(m => m.bioguideId === stmt.bioguideId);
                      return (
                        <div 
                          key={stmt.id}
                          className="p-5 rounded-xl bg-white/5 border border-white/5"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            {stmt.tone && (
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                stmt.tone === "Support" ? "bg-emerald-500/20 text-emerald-400" :
                                stmt.tone === "Concern" ? "bg-amber-500/20 text-amber-400" :
                                "bg-white/10 text-white/60"
                              }`}>
                                {stmt.tone}
                              </span>
                            )}
                            <span className="text-white/30 text-xs">
                              {new Date(stmt.publishedAt).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <h4 className="text-white font-medium text-sm mb-2 line-clamp-2">
                            {stmt.title}
                          </h4>
                          
                          <p className="text-white/50 text-sm mb-3 line-clamp-2">
                            "{stmt.excerpt}"
                          </p>
                          
                          <div className="flex items-center justify-between">
                            {member ? (
                              <Link 
                                href={`/capitol-pulse/members/${member.bioguideId}`}
                                className="text-white/60 text-xs hover:text-accent-blue transition-colors"
                              >
                                {member.name} ({member.party.charAt(0)}-{member.state})
                              </Link>
                            ) : (
                              <span className="text-white/40 text-xs">{stmt.bioguideId}</span>
                            )}
                            <a 
                              href={stmt.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-accent-blue/70 hover:text-accent-blue text-xs"
                            >
                              Source →
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Empty State */}
            {statements.length === 0 && bills.length === 0 && (
              <ScrollReveal animation="fade-up">
                <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-12 text-center">
                  <span className="text-6xl mb-6 block">📊</span>
                  <h2 className="text-2xl font-display font-bold text-white mb-4">
                    No Data Yet
                  </h2>
                  <p className="text-white/50 max-w-lg mx-auto">
                    Connect to official data sources to see Congressional activity on this topic.
                    Bills are tagged using Congress.gov subjects, statements from the Congressional Record.
                  </p>
                </div>
              </ScrollReveal>
            )}
          </>
        )}
      </div>
    </div>
  );
}
