"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  congressMembers, 
  getStatementsByMember,
  bills,
  memberAlignments,
  techTopics
} from "@/data/capitol-pulse";
import { ScrollReveal } from "@/components/ScrollAnimations";

export default function MemberProfilePage() {
  const params = useParams();
  const memberId = params.id as string;
  
  const member = congressMembers.find(m => m.id === memberId);
  const statements = getStatementsByMember(memberId);
  const sponsoredBills = bills.filter(b => b.sponsors.includes(memberId) || b.cosponsors.includes(memberId));
  const alignments = memberAlignments.filter(a => a.memberId === memberId);

  if (!member) {
    return (
      <div className="pt-28 pb-24 min-h-screen">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-display font-bold text-white mb-4">Member Not Found</h1>
          <Link href="/capitol-pulse/members" className="text-emerald-400 hover:text-emerald-300">
            ← Browse All Members
          </Link>
        </div>
      </div>
    );
  }

  const partyColor = member.party === "Democrat" ? "from-blue-500 to-blue-600" :
                     member.party === "Republican" ? "from-red-500 to-red-600" :
                     "from-purple-500 to-purple-600";

  const partyBg = member.party === "Democrat" ? "bg-blue-500/10 border-blue-500/20" :
                  member.party === "Republican" ? "bg-red-500/10 border-red-500/20" :
                  "bg-purple-500/10 border-purple-500/20";

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <header className="mb-12">
          <ScrollReveal animation="fade-down">
            <Link href="/capitol-pulse/members" className="text-emerald-400 hover:text-emerald-300 text-sm mb-4 inline-block">
              ← All Members
            </Link>
          </ScrollReveal>
          
          <ScrollReveal animation="zoom-in" delay={100}>
            <div className="flex items-start gap-6 flex-wrap">
              {/* Avatar */}
              <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${partyColor} flex items-center justify-center text-white text-3xl font-bold`}>
                {member.name.split(" ").map(n => n[0]).join("")}
              </div>
              
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
              
              <a 
                href={member.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
              >
                Official Website →
              </a>
            </div>
          </ScrollReveal>
        </header>

        {/* Tech Fingerprint */}
        <ScrollReveal animation="fade-up" delay={150}>
          <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6 mb-8">
            <h2 className="text-white font-display font-semibold text-lg mb-6">
              Tech Policy Fingerprint
            </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {member.techFingerprint.map(fp => {
                const topic = techTopics.find(t => t.id === fp.topic);
                return (
                  <Link
                    key={fp.topic}
                    href={`/capitol-pulse/topics/${encodeURIComponent(fp.topic)}`}
                    className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{topic?.icon}</span>
                      <span className="text-emerald-400 font-bold text-xl">{fp.score}</span>
                    </div>
                    <p className="text-white/70 text-sm group-hover:text-white transition-colors">
                      {fp.topic}
                    </p>
                    <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                        style={{ width: `${fp.score}%` }}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Words vs Actions */}
        {alignments.length > 0 && (
          <ScrollReveal animation="fade-up" delay={200}>
            <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6 mb-8">
              <h2 className="text-white font-display font-semibold text-lg mb-6">
                Words vs Actions
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {alignments.map(a => {
                  const topic = techTopics.find(t => t.id === a.topic);
                  const alignmentColor = a.alignment === "Aligned" ? "text-emerald-400" :
                                         a.alignment === "High Attention, Low Action" ? "text-amber-400" :
                                         a.alignment === "Low Attention, High Action" ? "text-cyan-400" :
                                         "text-white/40";
                  return (
                    <div key={a.topic} className="p-5 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">{topic?.icon}</span>
                        <span className="text-white font-medium text-sm">{a.topic}</span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/50">Attention</span>
                          <span className="text-white">{a.attentionScore}</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full">
                          <div 
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${a.attentionScore}%` }}
                          />
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-white/50">Action</span>
                          <span className="text-white">{a.actionScore}</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full">
                          <div 
                            className="h-full bg-cyan-500 rounded-full"
                            style={{ width: `${a.actionScore}%` }}
                          />
                        </div>
                      </div>
                      
                      <p className={`text-sm font-medium mb-2 ${alignmentColor}`}>
                        {a.alignment}
                      </p>
                      <p className="text-white/40 text-xs">
                        {a.explanation}
                      </p>
                    </div>
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
                Recent Tech Statements
              </h2>
              
              {statements.length > 0 ? (
                <div className="space-y-4">
                  {statements.slice(0, 5).map(stmt => (
                    <div key={stmt.id} className="p-4 rounded-xl bg-white/5">
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
                      
                      <h3 className="text-white font-medium text-sm mb-2">
                        {stmt.title}
                      </h3>
                      
                      <p className="text-white/50 text-sm line-clamp-2 mb-3">
                        "{stmt.excerpt}"
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {stmt.topics.map(t => (
                          <span key={t} className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs">
                            {t}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex flex-wrap gap-1">
                          {stmt.keywords.slice(0, 3).map(k => (
                            <span key={k} className="text-white/30 text-xs">#{k}</span>
                          ))}
                        </div>
                        <a 
                          href={stmt.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400/70 hover:text-emerald-400 text-xs"
                        >
                          View Source →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/40 text-center py-8">
                  No tech-related statements found for this member.
                </p>
              )}
            </div>
          </ScrollReveal>

          {/* Legislation */}
          <ScrollReveal animation="fade-up" delay={300}>
            <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6">
              <h2 className="text-white font-display font-semibold text-lg mb-6">
                Tech Legislation
              </h2>
              
              {sponsoredBills.length > 0 ? (
                <div className="space-y-4">
                  {sponsoredBills.map(bill => {
                    const isSponsor = bill.sponsors.includes(memberId);
                    return (
                      <a
                        key={bill.id}
                        href={bill.congressGovUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-emerald-400 font-mono text-sm">
                            {bill.number}
                          </span>
                          <div className="flex gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              isSponsor 
                                ? "bg-emerald-500/20 text-emerald-400" 
                                : "bg-white/10 text-white/60"
                            }`}>
                              {isSponsor ? "Sponsor" : "Cosponsor"}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              bill.status === "Enacted" ? "bg-emerald-500/20 text-emerald-400" :
                              bill.status.includes("Passed") ? "bg-cyan-500/20 text-cyan-400" :
                              "bg-white/10 text-white/60"
                            }`}>
                              {bill.status}
                            </span>
                          </div>
                        </div>
                        
                        <h3 className="text-white font-medium text-sm mb-2">
                          {bill.title}
                        </h3>
                        
                        <p className="text-white/50 text-xs line-clamp-2">
                          {bill.summary}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mt-3">
                          {bill.topics.map(t => (
                            <span key={t} className="px-2 py-0.5 rounded-full bg-white/5 text-white/50 text-xs">
                              {techTopics.find(topic => topic.id === t)?.icon} {t.split(" ")[0]}
                            </span>
                          ))}
                        </div>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <p className="text-white/40 text-center py-8">
                  No tech-related bills sponsored or cosponsored by this member.
                </p>
              )}
            </div>
          </ScrollReveal>
        </div>

        {/* Disclaimer */}
        <ScrollReveal animation="fade-up" delay={350}>
          <p className="text-white/30 text-xs text-center max-w-2xl mx-auto">
            All data comes from official Congressional sources. Tone and framing labels are 
            algorithmic estimates—see our <Link href="/capitol-pulse/methodology" className="text-emerald-400/70 hover:text-emerald-400">methodology</Link> for 
            details and limitations.
          </p>
        </ScrollReveal>
      </div>
    </div>
  );
}

