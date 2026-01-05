"use client";

import Link from "next/link";
import { techTopics } from "@/data/capitol-pulse";
import { ScrollReveal } from "@/components/ScrollAnimations";

export default function MethodologyPage() {
  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <header className="mb-12">
          <ScrollReveal animation="fade-down">
            <Link href="/capitol-pulse" className="text-emerald-400 hover:text-emerald-300 text-sm mb-4 inline-block">
              ← Back to Capitol Pulse
            </Link>
          </ScrollReveal>
          
          <ScrollReveal animation="zoom-in" delay={100}>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Methodology
            </h1>
          </ScrollReveal>
          
          <ScrollReveal animation="fade-up" delay={200}>
            <p className="text-white/60 text-lg leading-relaxed">
              Capitol Pulse is designed to be transparent and research-grade. This page 
              explains exactly what data we collect, how we classify it, and the limitations 
              you should be aware of.
            </p>
          </ScrollReveal>
        </header>

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
                  <h3 className="text-white font-semibold mb-2">What We Collect</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong className="text-white">Press Releases & Statements:</strong> Official 
                      communications published on members' official government websites (.gov domains).
                    </li>
                    <li>
                      <strong className="text-white">Legislation:</strong> Bills and resolutions from 
                      Congress.gov, including sponsor, cosponsor, and status information.
                    </li>
                    <li>
                      <strong className="text-white">Roll-Call Votes:</strong> Official voting records 
                      from the House Clerk and Senate.gov.
                    </li>
                    <li>
                      <strong className="text-white">Member Information:</strong> Official member 
                      rosters from the House and Senate directories.
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-white font-semibold mb-2">What We Do NOT Collect</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4 text-white/50">
                    <li>Social media posts (Twitter/X, Facebook, Instagram, etc.)</li>
                    <li>Campaign materials or fundraising communications</li>
                    <li>News articles or third-party reporting</li>
                    <li>Interview transcripts or unofficial statements</li>
                  </ul>
                </div>
                
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                  <p className="text-emerald-400 text-sm">
                    <strong>Why this matters:</strong> By limiting our sources to official 
                    government communications, we ensure verifiability and avoid the complications 
                    of platform-specific content policies.
                  </p>
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* Topic Classification */}
          <ScrollReveal animation="fade-up" delay={100}>
            <section className="bg-navy-800/40 rounded-2xl border border-white/5 p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-emerald-400">02</span>
                Topic Classification
              </h2>
              
              <div className="space-y-6 text-white/70 leading-relaxed">
                <p>
                  Each statement is automatically classified into one or more of {techTopics.length} technology 
                  policy topics. Classification uses a combination of:
                </p>
                
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Keyword matching against curated topic lexicons</li>
                  <li>Named entity recognition for tech companies, agencies, and legislation</li>
                  <li>Semantic similarity scoring using text embeddings</li>
                </ul>
                
                <div className="grid sm:grid-cols-2 gap-3 mt-6">
                  {techTopics.map(topic => (
                    <div key={topic.id} className="flex items-center gap-2 p-3 rounded-lg bg-white/5">
                      <span className="text-xl">{topic.icon}</span>
                      <span className="text-white text-sm">{topic.name}</span>
                    </div>
                  ))}
                </div>
                
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                  <p className="text-amber-400 text-sm">
                    <strong>Limitation:</strong> Some statements may address multiple topics or 
                    fall between categories. We assign up to 3 topics per statement and accept 
                    that edge cases exist.
                  </p>
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* Tone Analysis */}
          <ScrollReveal animation="fade-up" delay={150}>
            <section className="bg-navy-800/40 rounded-2xl border border-white/5 p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-emerald-400">03</span>
                Tone Analysis
              </h2>
              
              <div className="space-y-6 text-white/70 leading-relaxed">
                <p>
                  We assign each statement a simple tone label: <span className="text-emerald-400">Support</span>, 
                  <span className="text-amber-400 ml-1">Concern</span>, or <span className="text-white/60 ml-1">Neutral</span>. 
                  This is NOT sentiment analysis in the traditional sense.
                </p>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <h4 className="text-emerald-400 font-semibold mb-2">Support</h4>
                    <p className="text-white/60 text-sm">
                      The statement expresses positive framing toward a technology, policy approach, 
                      or legislative action. Example: "This bill will foster innovation and create jobs."
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <h4 className="text-amber-400 font-semibold mb-2">Concern</h4>
                    <p className="text-white/60 text-sm">
                      The statement raises warnings, criticisms, or calls for regulatory action. 
                      Example: "Big Tech's unchecked power threatens our democracy."
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <h4 className="text-white/70 font-semibold mb-2">Neutral</h4>
                    <p className="text-white/60 text-sm">
                      Informational statements, procedural announcements, or balanced descriptions 
                      without clear advocacy. Example: "The committee will hold a hearing on AI policy."
                    </p>
                  </div>
                </div>
                
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                  <p className="text-amber-400 text-sm">
                    <strong>Important:</strong> Tone labels are probabilistic estimates with confidence 
                    scores. They describe rhetorical framing, NOT the member's underlying beliefs, 
                    voting intentions, or the merits of their position. A "Support" label doesn't 
                    mean we endorse that view.
                  </p>
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* Framing Labels */}
          <ScrollReveal animation="fade-up" delay={200}>
            <section className="bg-navy-800/40 rounded-2xl border border-white/5 p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-emerald-400">04</span>
                Framing Labels
              </h2>
              
              <div className="space-y-6 text-white/70 leading-relaxed">
                <p>
                  Beyond tone, we identify HOW members frame technology issues. These labels 
                  reveal the angles and arguments being used:
                </p>
                
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { label: "Innovation", desc: "Framed around technological progress and competitiveness" },
                    { label: "National Security", desc: "Framed around defense, foreign threats, or intelligence" },
                    { label: "Jobs & Economy", desc: "Framed around employment, growth, or industry" },
                    { label: "Rights & Privacy", desc: "Framed around civil liberties and individual rights" },
                    { label: "Competition", desc: "Framed around antitrust, market power, or monopolies" },
                    { label: "Child Safety", desc: "Framed around protecting minors online" },
                    { label: "Consumer Protection", desc: "Framed around protecting users from harm" },
                    { label: "Global Competitiveness", desc: "Framed around competing with other nations" }
                  ].map(f => (
                    <div key={f.label} className="p-3 rounded-lg bg-white/5">
                      <p className="text-cyan-400 font-medium text-sm">{f.label}</p>
                      <p className="text-white/50 text-xs">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* Words vs Actions */}
          <ScrollReveal animation="fade-up" delay={250}>
            <section className="bg-navy-800/40 rounded-2xl border border-white/5 p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-emerald-400">05</span>
                Words vs Actions Methodology
              </h2>
              
              <div className="space-y-6 text-white/70 leading-relaxed">
                <p>
                  Our "alignment" scores compare communication frequency with legislative activity:
                </p>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-white/5">
                    <h4 className="text-white font-semibold mb-2">Attention Score (0-100)</h4>
                    <p className="text-sm">
                      Calculated from: frequency of statements on the topic, recency weighting, 
                      and depth of engagement (mere mentions vs. substantive discussion).
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-white/5">
                    <h4 className="text-white font-semibold mb-2">Action Score (0-100)</h4>
                    <p className="text-sm">
                      Calculated from: bills sponsored/cosponsored on the topic, votes on 
                      relevant legislation, and committee activity.
                    </p>
                  </div>
                </div>
                
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                  <p className="text-amber-400 text-sm">
                    <strong>Interpretation warning:</strong> "High attention, low action" doesn't 
                    necessarily mean hypocrisy—a member may be in the minority party, on different 
                    committees, or early in building coalitions. Always click through to the evidence.
                  </p>
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* Known Limitations */}
          <ScrollReveal animation="fade-up" delay={300}>
            <section className="bg-navy-800/40 rounded-2xl border border-white/5 p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-emerald-400">06</span>
                Known Limitations
              </h2>
              
              <div className="space-y-4 text-white/70 leading-relaxed">
                <div className="p-4 rounded-lg border border-white/10">
                  <h4 className="text-white font-semibold mb-2">Coverage Gaps</h4>
                  <p className="text-sm">
                    Not all official websites are structured the same way. Some members may have 
                    fewer indexed statements due to website format differences.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border border-white/10">
                  <h4 className="text-white font-semibold mb-2">Classification Errors</h4>
                  <p className="text-sm">
                    Automated classification will sometimes misinterpret sarcasm, context, or 
                    nuanced positions. We aim for accuracy, not perfection.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border border-white/10">
                  <h4 className="text-white font-semibold mb-2">Recency Bias</h4>
                  <p className="text-sm">
                    Our scoring weights recent activity more heavily. Long-serving members with 
                    historical tech engagement may appear less active if quiet recently.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border border-white/10">
                  <h4 className="text-white font-semibold mb-2">Missing Context</h4>
                  <p className="text-sm">
                    We can't capture private negotiations, amendment strategies, or committee 
                    dynamics that don't appear in public records.
                  </p>
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* How to Use */}
          <ScrollReveal animation="fade-up" delay={350}>
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
                  <span><strong className="text-white">Do:</strong> Compare multiple members and look for patterns over time.</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-emerald-400">✓</span>
                  <span><strong className="text-white">Do:</strong> Consider why a member might have certain alignment scores.</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-red-400">✗</span>
                  <span><strong className="text-white">Don't:</strong> Use tone labels as proof of a member's character or integrity.</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-red-400">✗</span>
                  <span><strong className="text-white">Don't:</strong> Cite scores without acknowledging their limitations.</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-red-400">✗</span>
                  <span><strong className="text-white">Don't:</strong> Assume this tool captures the full picture of tech policy.</span>
                </p>
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

