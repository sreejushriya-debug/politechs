"use client";

import Link from "next/link";
import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { statements, congressMembers, techTopics, TechTopic } from "@/data/capitol-pulse";
import { ScrollReveal } from "@/components/ScrollAnimations";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get("topic") || "";
  
  const [query, setQuery] = useState("");
  const [topicFilter, setTopicFilter] = useState<TechTopic | "">(initialTopic as TechTopic | "");
  const [toneFilter, setToneFilter] = useState<"Support" | "Concern" | "Neutral" | "">("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredStatements = useMemo(() => {
    return statements.filter(stmt => {
      // Query search
      if (query) {
        const q = query.toLowerCase();
        const matchesQuery = 
          stmt.title.toLowerCase().includes(q) ||
          stmt.excerpt.toLowerCase().includes(q) ||
          stmt.keywords.some(k => k.toLowerCase().includes(q)) ||
          stmt.entities.some(e => e.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }
      
      // Topic filter
      if (topicFilter && !stmt.topics.includes(topicFilter)) return false;
      
      // Tone filter
      if (toneFilter && stmt.tone !== toneFilter) return false;
      
      // Date filters
      if (dateFrom && new Date(stmt.publishedAt) < new Date(dateFrom)) return false;
      if (dateTo && new Date(stmt.publishedAt) > new Date(dateTo)) return false;
      
      return true;
    }).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }, [query, topicFilter, toneFilter, dateFrom, dateTo]);

  const highlightMatch = (text: string, searchQuery: string) => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? (
        <mark key={i} className="bg-emerald-500/30 text-emerald-300 px-0.5 rounded">
          {part}
        </mark>
      ) : part
    );
  };

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
              Evidence Explorer
            </h1>
            <p className="text-white/50 max-w-2xl">
              Search through official Congressional statements on technology policy. 
              Every result links to its original source.
            </p>
          </ScrollReveal>
        </header>

        {/* Search & Filters */}
        <ScrollReveal animation="fade-up">
          <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6 mb-8">
            {/* Main Search */}
            <div className="mb-6">
              <label className="text-white/50 text-sm mb-2 block">Search Keywords</label>
              <input
                type="text"
                placeholder="Search by keyword, entity, or phrase..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-lg placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            
            {/* Filter Row */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-white/50 text-sm mb-2 block">Topic</label>
                <select
                  value={topicFilter}
                  onChange={(e) => setTopicFilter(e.target.value as TechTopic | "")}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="">All Topics</option>
                  {techTopics.map(t => (
                    <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-white/50 text-sm mb-2 block">Tone</label>
                <select
                  value={toneFilter}
                  onChange={(e) => setToneFilter(e.target.value as "Support" | "Concern" | "Neutral" | "")}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="">All Tones</option>
                  <option value="Support">Support</option>
                  <option value="Concern">Concern</option>
                  <option value="Neutral">Neutral</option>
                </select>
              </div>
              
              <div>
                <label className="text-white/50 text-sm mb-2 block">From Date</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              
              <div>
                <label className="text-white/50 text-sm mb-2 block">To Date</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>
            
            {/* Clear Filters */}
            {(query || topicFilter || toneFilter || dateFrom || dateTo) && (
              <button
                onClick={() => {
                  setQuery("");
                  setTopicFilter("");
                  setToneFilter("");
                  setDateFrom("");
                  setDateTo("");
                }}
                className="mt-4 text-emerald-400 hover:text-emerald-300 text-sm"
              >
                Clear all filters
              </button>
            )}
          </div>
        </ScrollReveal>

        {/* Results Count */}
        <p className="text-white/40 text-sm mb-6">
          Found {filteredStatements.length} statement{filteredStatements.length !== 1 ? "s" : ""}
        </p>

        {/* Results */}
        <div className="space-y-4">
          {filteredStatements.map((stmt, i) => {
            const member = congressMembers.find(m => m.id === stmt.memberId);
            
            return (
              <ScrollReveal key={stmt.id} animation="fade-up" delay={Math.min(i * 30, 150)}>
                <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6 hover:border-white/10 transition-colors">
                  {/* Header */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      stmt.tone === "Support" ? "bg-emerald-500/20 text-emerald-400" :
                      stmt.tone === "Concern" ? "bg-amber-500/20 text-amber-400" :
                      "bg-white/10 text-white/60"
                    }`}>
                      {stmt.tone} ({stmt.toneConfidence}% confidence)
                    </span>
                    
                    {stmt.topics.map(t => (
                      <Link
                        key={t}
                        href={`/capitol-pulse/topics/${encodeURIComponent(t)}`}
                        className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs hover:bg-emerald-500/20 transition-colors"
                      >
                        {techTopics.find(topic => topic.id === t)?.icon} {t}
                      </Link>
                    ))}
                    
                    <span className="text-white/30 text-sm ml-auto">
                      {new Date(stmt.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-white font-display font-semibold text-lg mb-3">
                    {highlightMatch(stmt.title, query)}
                  </h3>
                  
                  {/* Excerpt */}
                  <blockquote className="text-white/60 text-sm leading-relaxed mb-4 pl-4 border-l-2 border-emerald-500/30">
                    "{highlightMatch(stmt.excerpt, query)}"
                  </blockquote>
                  
                  {/* Keywords & Entities */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {stmt.keywords.map(k => (
                      <span 
                        key={k} 
                        className="text-white/40 text-xs cursor-pointer hover:text-emerald-400 transition-colors"
                        onClick={() => setQuery(k)}
                      >
                        #{k}
                      </span>
                    ))}
                    {stmt.entities.map(e => (
                      <span 
                        key={e} 
                        className="px-2 py-0.5 rounded bg-white/5 text-white/50 text-xs cursor-pointer hover:text-white transition-colors"
                        onClick={() => setQuery(e)}
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                  
                  {/* Why Tagged */}
                  {stmt.highlightedExcerpts.length > 0 && (
                    <div className="bg-white/5 rounded-xl p-4 mb-4">
                      <p className="text-white/40 text-xs mb-2 font-medium">Why this was tagged:</p>
                      <div className="space-y-1">
                        {stmt.highlightedExcerpts.map((h, i) => (
                          <p key={i} className="text-white/60 text-sm">
                            <span className="text-emerald-400/80">"</span>
                            {h.text}
                            <span className="text-emerald-400/80">"</span>
                            <span className="text-white/30 ml-2">— {h.reason}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Framings */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {stmt.framings.map(f => (
                      <span key={f} className="px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs">
                        {f}
                      </span>
                    ))}
                  </div>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <Link
                      href={`/capitol-pulse/members/${member?.id}`}
                      className="flex items-center gap-2 text-white/60 hover:text-emerald-400 transition-colors"
                    >
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                        member?.party === "Democrat" ? "bg-blue-500" :
                        member?.party === "Republican" ? "bg-red-500" :
                        "bg-purple-500"
                      }`}>
                        {member?.name.split(" ").map(n => n[0]).join("")}
                      </span>
                      <span className="text-sm">{member?.name}</span>
                      <span className="text-white/30 text-xs">
                        ({member?.party.charAt(0)}-{member?.state})
                      </span>
                    </Link>
                    
                    <a
                      href={stmt.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
                    >
                      View Original Source →
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {filteredStatements.length === 0 && (
          <div className="text-center py-16 bg-navy-800/20 rounded-2xl border border-white/5">
            <p className="text-white/50 text-lg mb-2">No statements match your search.</p>
            <p className="text-white/30 text-sm">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SearchLoading() {
  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="mx-auto max-w-6xl px-6">
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded w-48 mb-4" />
          <div className="h-12 bg-white/10 rounded w-96 mb-4" />
          <div className="h-6 bg-white/10 rounded w-64 mb-10" />
          <div className="h-40 bg-white/10 rounded-2xl mb-8" />
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-white/10 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchContent />
    </Suspense>
  );
}

