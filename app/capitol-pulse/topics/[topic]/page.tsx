"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  techTopics, 
  getStatementsByTopic, 
  getBillsByTopic,
  getTopMembersByTopic,
  topicTrends,
  congressMembers,
  TechTopic
} from "@/data/capitol-pulse";
import { ScrollReveal } from "@/components/ScrollAnimations";

export default function TopicPage() {
  const params = useParams();
  const topicId = decodeURIComponent(params.topic as string) as TechTopic;
  
  const topic = techTopics.find(t => t.id === topicId);
  const statements = getStatementsByTopic(topicId);
  const bills = getBillsByTopic(topicId);
  const topMembers = getTopMembersByTopic(topicId, 10);
  const trends = topicTrends.filter(t => t.topic === topicId);

  if (!topic) {
    return (
      <div className="pt-28 pb-24 min-h-screen">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-display font-bold text-white mb-4">Topic Not Found</h1>
          <Link href="/capitol-pulse" className="text-emerald-400 hover:text-emerald-300">
            ← Back to Capitol Pulse
          </Link>
        </div>
      </div>
    );
  }

  // Calculate framing breakdown
  const framingCounts = new Map<string, number>();
  statements.forEach(s => {
    s.framings.forEach(f => {
      framingCounts.set(f, (framingCounts.get(f) || 0) + 1);
    });
  });
  const framingBreakdown = Array.from(framingCounts.entries())
    .map(([framing, count]) => ({ framing, count }))
    .sort((a, b) => b.count - a.count);

  // Calculate tone breakdown
  const toneCounts = { Support: 0, Concern: 0, Neutral: 0 };
  statements.forEach(s => {
    toneCounts[s.tone]++;
  });

  const maxFraming = Math.max(...framingBreakdown.map(f => f.count), 1);

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <header className="mb-12">
          <ScrollReveal animation="fade-down">
            <Link href="/capitol-pulse/dashboard" className="text-emerald-400 hover:text-emerald-300 text-sm mb-4 inline-block">
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
        </header>

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
              <p className="text-3xl font-display font-bold text-white mb-1">{topMembers.length}</p>
              <p className="text-white/40 text-sm">Active Members</p>
            </div>
            <div className="bg-white/5 rounded-xl p-5 border border-white/5 text-center">
              <p className="text-3xl font-display font-bold text-emerald-400 mb-1">
                {trends.length > 1 ? "+12%" : "—"}
              </p>
              <p className="text-white/40 text-sm">Trend (30d)</p>
            </div>
          </div>
        </ScrollReveal>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {/* Tone & Framing */}
          <div className="space-y-6">
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
                          style={{ width: `${(count / statements.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={200}>
              <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6">
                <h3 className="text-white font-display font-semibold text-lg mb-6">
                  How It's Framed
                </h3>
                <div className="space-y-3">
                  {framingBreakdown.slice(0, 5).map(f => (
                    <div key={f.framing}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/70">{f.framing}</span>
                        <span className="text-white/40">{f.count}</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                          style={{ width: `${(f.count / maxFraming) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Top Members */}
          <ScrollReveal animation="fade-up" delay={250}>
            <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6">
              <h3 className="text-white font-display font-semibold text-lg mb-6">
                Most Active Members
              </h3>
              <div className="space-y-3">
                {topMembers.map((member, i) => {
                  const score = member.techFingerprint.find(f => f.topic === topicId)?.score || 0;
                  return (
                    <Link
                      key={member.id}
                      href={`/capitol-pulse/members/${member.id}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                    >
                      <span className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate group-hover:text-emerald-400 transition-colors">
                          {member.name}
                        </p>
                        <p className="text-white/40 text-xs">
                          {member.party.charAt(0)} • {member.state}
                        </p>
                      </div>
                      <div className="text-emerald-400 font-bold text-sm">{score}</div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>

          {/* Key Bills */}
          <ScrollReveal animation="fade-up" delay={300}>
            <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6">
              <h3 className="text-white font-display font-semibold text-lg mb-6">
                Key Legislation
              </h3>
              {bills.length > 0 ? (
                <div className="space-y-4">
                  {bills.map(bill => (
                    <a
                      key={bill.id}
                      href={bill.congressGovUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-emerald-400 font-mono text-sm group-hover:text-emerald-300">
                          {bill.number}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          bill.status === "Enacted" ? "bg-emerald-500/20 text-emerald-400" :
                          bill.status.includes("Passed") ? "bg-cyan-500/20 text-cyan-400" :
                          "bg-white/10 text-white/60"
                        }`}>
                          {bill.status}
                        </span>
                      </div>
                      <p className="text-white text-sm font-medium line-clamp-2">
                        {bill.title}
                      </p>
                      <p className="text-white/40 text-xs mt-2 line-clamp-2">
                        {bill.summary}
                      </p>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-white/40 text-sm text-center py-8">
                  No bills currently tracked for this topic.
                </p>
              )}
            </div>
          </ScrollReveal>
        </div>

        {/* Recent Statements */}
        <ScrollReveal animation="fade-up" delay={350}>
          <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-display font-semibold text-lg">
                Recent Statements
              </h3>
              <Link 
                href={`/capitol-pulse/search?topic=${encodeURIComponent(topicId)}`}
                className="text-emerald-400 hover:text-emerald-300 text-sm"
              >
                View All →
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {statements.slice(0, 6).map(stmt => {
                const member = congressMembers.find(m => m.id === stmt.memberId);
                return (
                  <div 
                    key={stmt.id}
                    className="p-5 rounded-xl bg-white/5 border border-white/5"
                  >
                    <div className="flex items-center gap-2 mb-3">
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
                    
                    <h4 className="text-white font-medium text-sm mb-2 line-clamp-2">
                      {stmt.title}
                    </h4>
                    
                    <p className="text-white/50 text-sm mb-3 line-clamp-2">
                      "{stmt.excerpt}"
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Link 
                        href={`/capitol-pulse/members/${member?.id}`}
                        className="text-white/60 text-xs hover:text-emerald-400 transition-colors"
                      >
                        {member?.name} ({member?.party.charAt(0)}-{member?.state})
                      </Link>
                      <a 
                        href={stmt.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400/70 hover:text-emerald-400 text-xs"
                      >
                        Source →
                      </a>
                    </div>

                    {/* Highlighted excerpts */}
                    {stmt.highlightedExcerpts.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <p className="text-white/30 text-xs mb-1">Why this was tagged:</p>
                        {stmt.highlightedExcerpts.slice(0, 1).map((h, i) => (
                          <p key={i} className="text-white/50 text-xs italic">
                            "{h.text}" <span className="text-emerald-400/60">— {h.reason}</span>
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}

