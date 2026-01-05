"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { techTopics } from "@/data/capitol-pulse";
import { getMemberById, getStatementsByMember, getBillsByTopic } from "@/lib/capitol-pulse/data-store";
import { CongressMember, Statement, Bill, TechTopic } from "@/lib/capitol-pulse/types";
import { ScrollReveal } from "@/components/ScrollAnimations";

export default function MemberProfilePage() {
  const params = useParams();
  const bioguideId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<CongressMember | null>(null);
  const [statements, setStatements] = useState<Statement[]>([]);
  const [sponsoredBills, setSponsoredBills] = useState<Bill[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const memberData = await getMemberById(bioguideId);
        setMember(memberData);
        
        if (memberData) {
          const stmts = await getStatementsByMember(bioguideId);
          setStatements(stmts);
          
          // Get bills would need to filter by sponsor - simplified for now
          // In production, this would be a dedicated query
        }
      } catch (error) {
        console.error("Failed to load member:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [bioguideId]);

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

  // Get topic distribution from statements
  const topicCounts = new Map<TechTopic, number>();
  statements.forEach(s => {
    s.topics.forEach(t => {
      topicCounts.set(t, (topicCounts.get(t) || 0) + 1);
    });
  });
  const topTopics = Array.from(topicCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

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

        {/* Topic Focus */}
        {topTopics.length > 0 && (
          <ScrollReveal animation="fade-up" delay={150}>
            <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6 mb-8">
              <h2 className="text-white font-display font-semibold text-lg mb-6">
                Tech Policy Focus
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {topTopics.map(([topic, count]) => {
                  const topicInfo = techTopics.find(t => t.id === topic);
                  return (
                    <Link
                      key={topic}
                      href={`/capitol-pulse/topics/${encodeURIComponent(topic)}`}
                      className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{topicInfo?.icon}</span>
                        <span className="text-accent-blue font-bold">{count}</span>
                      </div>
                      <p className="text-white/70 text-sm group-hover:text-white transition-colors truncate">
                        {topic}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Statements */}
          <ScrollReveal animation="fade-up" delay={250}>
            <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6">
              <h2 className="text-white font-display font-semibold text-lg mb-6">
                Tech Statements ({statements.length})
              </h2>
              
              {statements.length > 0 ? (
                <div className="space-y-4">
                  {statements.slice(0, 5).map(stmt => (
                    <div key={stmt.id} className="p-4 rounded-xl bg-white/5">
                      <div className="flex items-center gap-2 mb-2">
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
                      
                      <h3 className="text-white font-medium text-sm mb-2">
                        {stmt.title}
                      </h3>
                      
                      <p className="text-white/50 text-sm line-clamp-2 mb-3">
                        "{stmt.excerpt}"
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {stmt.topics.map(t => (
                          <span key={t} className="px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue text-xs">
                            {t}
                          </span>
                        ))}
                      </div>
                      
                      <a 
                        href={stmt.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-blue/70 hover:text-accent-blue text-xs"
                      >
                        View Source →
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/40 mb-2">No tech-related statements found.</p>
                  <p className="text-white/30 text-sm">
                    Statement data is sourced from the Congressional Record.
                  </p>
                </div>
              )}
              
              {statements.length > 5 && (
                <Link 
                  href={`/capitol-pulse/search?member=${bioguideId}`}
                  className="block text-center text-accent-blue hover:text-accent-blue/80 text-sm mt-4"
                >
                  View All {statements.length} Statements →
                </Link>
              )}
            </div>
          </ScrollReveal>

          {/* Legislation */}
          <ScrollReveal animation="fade-up" delay={300}>
            <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6">
              <h2 className="text-white font-display font-semibold text-lg mb-6">
                Tech Legislation
              </h2>
              
              <div className="text-center py-8">
                <p className="text-white/40 mb-2">Bill sponsorship data coming soon.</p>
                <p className="text-white/30 text-sm">
                  Will show tech-related bills sponsored and cosponsored by this member.
                </p>
              </div>
              
              <a 
                href={`https://www.congress.gov/member/${member.lastName.toLowerCase()}-${member.firstName.toLowerCase()}/${member.bioguideId}?q=%7B%22sponsorship%22%3A%22sponsored%22%7D`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-accent-blue hover:text-accent-blue/80 text-sm mt-4"
              >
                View All Legislation on Congress.gov →
              </a>
            </div>
          </ScrollReveal>
        </div>

        {/* Disclaimer */}
        <ScrollReveal animation="fade-up" delay={350}>
          <p className="text-white/30 text-xs text-center max-w-2xl mx-auto">
            All data comes from official Congressional sources. Member information from the 
            <a href="https://bioguide.congress.gov" target="_blank" rel="noopener noreferrer" className="text-accent-blue/70 hover:text-accent-blue mx-1">
              Biographical Directory
            </a>
            and <a href="https://api.congress.gov" target="_blank" rel="noopener noreferrer" className="text-accent-blue/70 hover:text-accent-blue mx-1">Congress.gov API</a>.
          </p>
        </ScrollReveal>
      </div>
    </div>
  );
}
