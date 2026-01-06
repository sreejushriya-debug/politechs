"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { techTopics } from "@/data/capitol-pulse";
import { ScrollReveal } from "@/components/ScrollAnimations";

interface CoverageStatus {
  members: { total: number; house: number; senate: number };
  bills: number;
  statements: { total: number; pressReleases: number; congressionalRecord: number };
  votes: number;
}

export default function MethodologyPage() {
  const [coverage, setCoverage] = useState<CoverageStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCoverage() {
      try {
        const [membersRes, billsRes] = await Promise.all([
          fetch('/api/capitol-pulse/members'),
          fetch('/api/capitol-pulse/bills')
        ]);
        
        const membersData = await membersRes.json();
        const billsData = await billsRes.json();
        
        const members = membersData.members || [];
        
        setCoverage({
          members: {
            total: members.length,
            house: members.filter((m: any) => m.chamber === 'House').length,
            senate: members.filter((m: any) => m.chamber === 'Senate').length
          },
          bills: (billsData.bills || []).length,
          statements: { total: 0, pressReleases: 0, congressionalRecord: 0 },
          votes: 0
        });
      } catch (error) {
        console.error("Failed to load coverage:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCoverage();
  }, []);

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <header className="mb-12">
          <ScrollReveal animation="fade-down">
            <Link href="/capitol-pulse" className="text-accent-blue hover:text-accent-blue/80 text-sm mb-4 inline-block">
              ← Back to Capitol Pulse
            </Link>
          </ScrollReveal>
          
          <ScrollReveal animation="zoom-in" delay={100}>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Methodology & Data Sources
            </h1>
          </ScrollReveal>
          
          <ScrollReveal animation="fade-up" delay={200}>
            <p className="text-white/60 text-lg leading-relaxed">
              Capitol Pulse uses only official government data sources. This page 
              documents exactly what data we have, how we classify it, and current 
              limitations in our coverage.
            </p>
          </ScrollReveal>
        </header>

        {/* Current Coverage Status */}
        <ScrollReveal animation="fade-up">
          <section className="bg-gradient-to-br from-emerald-500/10 via-navy-800/50 to-amber-500/10 rounded-2xl border border-white/5 p-8 mb-8">
            <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
              📊 Current Data Coverage
            </h2>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent-blue border-t-transparent" />
              </div>
            ) : coverage ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-sm">Members</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      coverage.members.total > 500 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {coverage.members.total > 500 ? 'Complete' : 'Partial'}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-white">{coverage.members.total}/535</p>
                  <p className="text-white/40 text-xs mt-1">
                    {coverage.members.house} House • {coverage.members.senate} Senate
                  </p>
                </div>
                
                <div className="p-4 rounded-xl bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-sm">Tech Bills</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                      Live
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-white">{coverage.bills}</p>
                  <p className="text-white/40 text-xs mt-1">119th Congress</p>
                </div>
                
                <div className="p-4 rounded-xl bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-sm">Statements</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                      Live
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-white">{coverage.statements.total}</p>
                  <p className="text-white/40 text-xs mt-1">
                    Congressional Record floor remarks
                  </p>
                </div>
                
                <div className="p-4 rounded-xl bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-sm">Votes</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                      Pending
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-white">{coverage.votes}</p>
                  <p className="text-white/40 text-xs mt-1">Tech-related roll calls</p>
                </div>
              </div>
            ) : (
              <p className="text-white/50">Unable to load coverage data.</p>
            )}
            
            <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-emerald-400 text-sm">
                <strong>✓ Data Sources:</strong> Bills from Congress.gov API. Statements from Congressional Record.
                Press release integration is in development. Words vs Actions analysis uses available data.
              </p>
            </div>
          </section>
        </ScrollReveal>

        {/* Content */}
        <div className="space-y-12">
          {/* Data Sources */}
          <ScrollReveal animation="fade-up">
            <section className="bg-navy-800/40 rounded-2xl border border-white/5 p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-emerald-400">01</span>
                Data Sources
              </h2>
              
              <div className="space-y-6 text-white/70 leading-relaxed">
                <div>
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    ✅ Currently Integrated
                  </h3>
                  <ul className="space-y-3 ml-4">
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-400 mt-1">•</span>
                      <div>
                        <strong className="text-white">Congress.gov API</strong>
                        <p className="text-sm text-white/50">
                          Member roster, bill text, subjects, sponsors, cosponsors, and status.
                          <a href="https://api.congress.gov" target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline ml-1">
                            api.congress.gov →
                          </a>
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-400 mt-1">•</span>
                      <div>
                        <strong className="text-white">Biographical Directory</strong>
                        <p className="text-sm text-white/50">
                          Official member information and bioguide IDs.
                          <a href="https://bioguide.congress.gov" target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline ml-1">
                            bioguide.congress.gov →
                          </a>
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    ✅ Currently Integrated (continued)
                  </h3>
                  <ul className="space-y-3 ml-4">
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-400 mt-1">•</span>
                      <div>
                        <strong className="text-white">Congressional Record</strong>
                        <p className="text-sm text-white/50">
                          Floor speeches and remarks from Congress.gov. We filter for tech-related content
                          using keyword matching and topic classification.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    🔄 In Development
                  </h3>
                  <ul className="space-y-3 ml-4">
                    <li className="flex items-start gap-3">
                      <span className="text-amber-400 mt-1">•</span>
                      <div>
                        <strong className="text-white">Press Releases</strong>
                        <p className="text-sm text-white/50">
                          Official communications from member .gov websites (house.gov, senate.gov domains only).
                          Coverage varies by member—not all official sites are structured the same.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-400 mt-1">•</span>
                      <div>
                        <strong className="text-white">Roll-Call Votes</strong>
                        <p className="text-sm text-white/50">
                          Tech-related votes from House Clerk (clerk.house.gov) and Senate (senate.gov).
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    ❌ Not Included (By Design)
                  </h3>
                  <ul className="space-y-2 ml-4 text-white/50">
                    <li className="flex items-start gap-3">
                      <span className="text-red-400 mt-1">•</span>
                      <span>Social media posts (Twitter/X, Facebook, Instagram, etc.)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-400 mt-1">•</span>
                      <span>Campaign materials or fundraising communications</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-400 mt-1">•</span>
                      <span>News articles or third-party reporting</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-400 mt-1">•</span>
                      <span>Interview transcripts or unofficial statements</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                  <p className="text-emerald-400 text-sm">
                    <strong>Why official sources only?</strong> By limiting to official government 
                    communications, we ensure verifiability—you can always click through to the 
                    original source.
                  </p>
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* Words vs Actions Definition */}
          <ScrollReveal animation="fade-up" delay={100}>
            <section className="bg-navy-800/40 rounded-2xl border border-white/5 p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-emerald-400">02</span>
                Words vs Actions: Definitions
              </h2>
              
              <div className="space-y-6 text-white/70 leading-relaxed">
                <p>
                  Capitol Pulse tracks the relationship between what members <strong className="text-amber-400">say</strong> about 
                  tech policy (Words/Attention) and what they <strong className="text-emerald-400">do</strong> (Actions).
                </p>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <h4 className="text-amber-400 font-semibold mb-2 flex items-center gap-2">
                      📢 Words (Attention)
                    </h4>
                    <ul className="text-sm space-y-2">
                      <li>• Press releases from official .gov sites</li>
                      <li>• Floor remarks from Congressional Record</li>
                      <li>• Committee hearing statements</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <h4 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
                      🔧 Actions
                    </h4>
                    <ul className="text-sm space-y-2">
                      <li>• Bills sponsored (weighted higher)</li>
                      <li>• Bills cosponsored</li>
                      <li>• Roll-call votes on tech legislation</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white font-semibold mb-3">Gap Labels</h3>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <p className="text-amber-400 font-medium text-sm">📢 All Talk (High Attention, Low Action)</p>
                      <p className="text-white/50 text-xs">Member discusses this topic frequently but has limited legislative activity.</p>
                    </div>
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <p className="text-emerald-400 font-medium text-sm">🔧 Quiet Doer (Low Attention, High Action)</p>
                      <p className="text-white/50 text-xs">Member takes legislative action without much public commentary.</p>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <p className="text-blue-400 font-medium text-sm">⚖️ Aligned</p>
                      <p className="text-white/50 text-xs">Member's public statements and legislative activity are balanced.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                  <p className="text-amber-400 text-sm">
                    <strong>Interpretation warning:</strong> "All Talk" doesn't mean hypocrisy—a member 
                    may be in the minority party, on different committees, or building coalitions. 
                    <strong className="text-white"> Always click through to the evidence.</strong>
                  </p>
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* Topic Classification */}
          <ScrollReveal animation="fade-up" delay={150}>
            <section className="bg-navy-800/40 rounded-2xl border border-white/5 p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-emerald-400">03</span>
                Topic Classification
              </h2>
              
              <div className="space-y-6 text-white/70 leading-relaxed">
                <p>
                  Each item is classified into one or more of {techTopics.length} technology 
                  policy topics using:
                </p>
                
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Keyword matching against curated topic lexicons</li>
                  <li>Congress.gov subject area tags</li>
                  <li>Named entity recognition for tech companies and agencies</li>
                </ul>
                
                <div className="grid sm:grid-cols-2 gap-3 mt-6">
                  {techTopics.map(topic => (
                    <Link
                      key={topic.id} 
                      href={`/capitol-pulse/topics/${encodeURIComponent(topic.id)}`}
                      className="flex items-center gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <span className="text-xl">{topic.icon}</span>
                      <span className="text-white text-sm">{topic.name}</span>
                    </Link>
                  ))}
                </div>
                
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-white/60 text-sm">
                    <strong className="text-white">Tagging Transparency:</strong> Every item shows 
                    a "Why Tagged" explanation showing the exact keywords or subjects that triggered 
                    its classification.
                  </p>
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* Bill Explainers */}
          <ScrollReveal animation="fade-up" delay={200}>
            <section className="bg-navy-800/40 rounded-2xl border border-white/5 p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-emerald-400">04</span>
                Plain-English Bill Explainers
              </h2>
              
              <div className="space-y-6 text-white/70 leading-relaxed">
                <p>
                  Each bill detail page includes a plain-English explainer section. These are 
                  generated <strong className="text-white">only from official sources</strong>:
                </p>
                
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Official bill summary from Congress.gov</li>
                  <li>Bill text (when available)</li>
                  <li>Subject tags assigned by the Library of Congress</li>
                </ul>
                
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                  <p className="text-emerald-400 text-sm">
                    <strong>No hallucinations:</strong> We do NOT generate explanations when 
                    the official summary is unavailable. You'll see "Explainer unavailable" 
                    rather than guesswork.
                  </p>
                </div>
                
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                  <p className="text-amber-400 text-sm">
                    <strong>Limitations:</strong> "Arguments for/against" sections are general 
                    policy framings, not actual stakeholder positions. Always verify with the 
                    official sources linked on each page.
                  </p>
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* Known Limitations */}
          <ScrollReveal animation="fade-up" delay={250}>
            <section className="bg-navy-800/40 rounded-2xl border border-white/5 p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-emerald-400">05</span>
                Known Limitations
              </h2>
              
              <div className="space-y-4 text-white/70 leading-relaxed">
                <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5">
                  <h4 className="text-amber-400 font-semibold mb-2">Press Release Coverage Gaps</h4>
                  <p className="text-sm">
                    Not all official member websites are structured the same way. Some members 
                    may have fewer indexed statements due to website format differences. The 
                    dashboard shows coverage counts to be transparent about this.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border border-white/10">
                  <h4 className="text-white font-semibold mb-2">Classification Errors</h4>
                  <p className="text-sm">
                    Automated classification will sometimes misinterpret sarcasm, context, or 
                    nuanced positions. We aim for accuracy, not perfection. Click "Why Tagged" 
                    to see why something was classified.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border border-white/10">
                  <h4 className="text-white font-semibold mb-2">Missing Context</h4>
                  <p className="text-sm">
                    We can't capture private negotiations, amendment strategies, or committee 
                    dynamics that don't appear in public records.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border border-white/10">
                  <h4 className="text-white font-semibold mb-2">Minority Party Disadvantage</h4>
                  <p className="text-sm">
                    Members in the minority party have fewer legislative options. Low "Action" 
                    scores may reflect institutional constraints, not lack of effort.
                  </p>
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* How to Use */}
          <ScrollReveal animation="fade-up" delay={300}>
            <section className="bg-gradient-to-br from-emerald-500/10 via-navy-800/50 to-cyan-500/10 rounded-2xl border border-white/5 p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6">
                How to Use This Data Responsibly
              </h2>
              
              <div className="space-y-4 text-white/70">
                <p className="flex items-start gap-3">
                  <span className="text-emerald-400">✓</span>
                  <span><strong className="text-white">Do:</strong> Click through to source URLs to verify claims and read full context.</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-emerald-400">✓</span>
                  <span><strong className="text-white">Do:</strong> Check "Why Tagged" explanations to understand classifications.</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-emerald-400">✓</span>
                  <span><strong className="text-white">Do:</strong> Consider why a member might have certain gap labels (minority party, committee assignment, etc.).</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-red-400">✗</span>
                  <span><strong className="text-white">Don't:</strong> Use gap labels as proof of a member's character or integrity.</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-red-400">✗</span>
                  <span><strong className="text-white">Don't:</strong> Cite scores without acknowledging data coverage limitations.</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-red-400">✗</span>
                  <span><strong className="text-white">Don't:</strong> Assume zero statements means a member doesn't discuss a topic—coverage varies.</span>
                </p>
              </div>
            </section>
          </ScrollReveal>

          {/* Evidence Links */}
          <ScrollReveal animation="fade-up" delay={350}>
            <section className="bg-navy-800/40 rounded-2xl border border-white/5 p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-emerald-400">06</span>
                Evidence-Backed Numbers
              </h2>
              
              <div className="space-y-6 text-white/70 leading-relaxed">
                <p>
                  Every count shown in Capitol Pulse is clickable and links to the underlying 
                  evidence in the Evidence Explorer. You can always verify what's behind a number.
                </p>
                
                <div className="p-4 rounded-lg bg-white/5">
                  <p className="text-sm">
                    Example: If a member shows "5 Actions" on AI, clicking that number opens a 
                    search filtered to show exactly those 5 bills—not a summary, the actual records.
                  </p>
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* Contact */}
          <ScrollReveal animation="fade-up" delay={400}>
            <section className="text-center">
              <p className="text-white/50 mb-4">
                Questions about our methodology or found an error?
              </p>
              <Link 
                href="mailto:contact@politechs.org"
                className="text-emerald-400 hover:text-emerald-300 font-medium"
              >
                Contact Us →
              </Link>
            </section>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
