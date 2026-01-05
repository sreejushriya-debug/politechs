"use client";

import Link from "next/link";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { techTopics } from "@/data/capitol-pulse";
import { getStatements, getMembers } from "@/lib/capitol-pulse/data-store";
import { Statement, CongressMember, TechTopic } from "@/lib/capitol-pulse/types";
import { ScrollReveal } from "@/components/ScrollAnimations";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get("topic") || "";
  
  const [loading, setLoading] = useState(true);
  const [statements, setStatements] = useState<Statement[]>([]);
  const [members, setMembers] = useState<CongressMember[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [dataSource, setDataSource] = useState<string>("");

  const [query, setQuery] = useState("");
  const [topicFilter, setTopicFilter] = useState<TechTopic | "">(initialTopic as TechTopic | "");
  const [toneFilter, setToneFilter] = useState<"Support" | "Concern" | "Neutral" | "">("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [statementsData, membersData] = await Promise.all([
          getStatements(),
          getMembers()
        ]);
        setStatements(statementsData.statements);
        setMembers(membersData.members);
        setLastUpdated(statementsData.lastUpdated);
        setDataSource(statementsData.source);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

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
  }, [query, topicFilter, toneFilter, dateFrom, dateTo, statements]);

  const getMember = (bioguideId: string) => members.find(m => m.bioguideId === bioguideId);

  const highlightMatch = (text: string, searchQuery: string): React.ReactNode => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? (
        <mark key={i} className="bg-accent-blue/30 text-accent-blue px-0.5 rounded">
          {part}
        </mark>
      ) : part
    );
  };

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
              Evidence Explorer
            </h1>
            <p className="text-white/50 max-w-2xl">
              Search through official Congressional statements on technology policy. 
              Every result links to its original source.
            </p>
          </ScrollReveal>
        </header>

        {/* Data Status */}
        <ScrollReveal animation="fade-up">
          <div className={`rounded-xl border p-4 mb-8 ${
            statements.length > 0 ? "bg-emerald-500/10 border-emerald-500/20" : "bg-amber-500/10 border-amber-500/20"
          }`}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${statements.length > 0 ? "bg-emerald-500" : "bg-amber-500"}`} />
                <span className={`text-sm font-medium ${statements.length > 0 ? "text-emerald-400" : "text-amber-400"}`}>
                  {dataSource}
                </span>
              </div>
              <span className="text-white/40 text-sm">
                {statements.length} statements indexed • Updated: {formattedDate}
              </span>
            </div>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent-blue border-t-transparent" />
          </div>
        ) : statements.length === 0 ? (
          <ScrollReveal animation="fade-up">
            <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-12 text-center">
              <span className="text-6xl mb-6 block">🔍</span>
              <h2 className="text-2xl font-display font-bold text-white mb-4">
                No Statement Data Available
              </h2>
              <p className="text-white/50 max-w-lg mx-auto mb-6">
                Statement data from the Congressional Record requires additional API integration.
                This feature is coming soon.
              </p>
              <div className="bg-navy-900/50 rounded-xl p-6 max-w-md mx-auto text-left">
                <p className="text-white/70 text-sm mb-3">Sources we plan to support:</p>
                <ul className="text-white/50 text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-accent-blue">•</span>
                    Congressional Record (floor speeches)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-accent-blue">•</span>
                    Official member press releases (.gov)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-accent-blue">•</span>
                    Committee hearing transcripts
                  </li>
                </ul>
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
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-lg placeholder:text-white/30 focus:outline-none focus:border-accent-blue/50"
                  />
                </div>
                
                {/* Filter Row */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-white/50 text-sm mb-2 block">Topic</label>
                    <select
                      value={topicFilter}
                      onChange={(e) => setTopicFilter(e.target.value as TechTopic | "")}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue/50"
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
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue/50"
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
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue/50"
                    />
                  </div>
                  
                  <div>
                    <label className="text-white/50 text-sm mb-2 block">To Date</label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue/50"
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
                    className="mt-4 text-accent-blue hover:text-accent-blue/80 text-sm"
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
                const member = getMember(stmt.bioguideId);
                
                return (
                  <ScrollReveal key={stmt.id} animation="fade-up" delay={Math.min(i * 30, 150)}>
                    <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6 hover:border-white/10 transition-colors">
                      {/* Header */}
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        {stmt.tone && (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            stmt.tone === "Support" ? "bg-emerald-500/20 text-emerald-400" :
                            stmt.tone === "Concern" ? "bg-amber-500/20 text-amber-400" :
                            "bg-white/10 text-white/60"
                          }`}>
                            {stmt.tone} {stmt.toneConfidence && `(${stmt.toneConfidence}% confidence)`}
                          </span>
                        )}
                        
                        {stmt.topics.map(t => (
                          <Link
                            key={t}
                            href={`/capitol-pulse/topics/${encodeURIComponent(t)}`}
                            className="px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue text-xs hover:bg-accent-blue/20 transition-colors"
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
                      <blockquote className="text-white/60 text-sm leading-relaxed mb-4 pl-4 border-l-2 border-accent-blue/30">
                        "{highlightMatch(stmt.excerpt, query)}"
                      </blockquote>
                      
                      {/* Matched Snippet (transparency) */}
                      {stmt.matchedSnippet && (
                        <div className="bg-white/5 rounded-xl p-4 mb-4">
                          <p className="text-white/40 text-xs mb-2 font-medium">Why this was tagged:</p>
                          <p className="text-white/60 text-sm italic">
                            {stmt.matchedSnippet}
                          </p>
                        </div>
                      )}
                      
                      {/* Keywords & Entities */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {stmt.keywords.map(k => (
                          <span 
                            key={k} 
                            className="text-white/40 text-xs cursor-pointer hover:text-accent-blue transition-colors"
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
                      
                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        {member ? (
                          <Link
                            href={`/capitol-pulse/members/${member.bioguideId}`}
                            className="flex items-center gap-2 text-white/60 hover:text-accent-blue transition-colors"
                          >
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                              member.party === "Democratic" ? "bg-blue-500" :
                              member.party === "Republican" ? "bg-red-500" :
                              "bg-purple-500"
                            }`}>
                              {member.firstName[0]}{member.lastName[0]}
                            </span>
                            <span className="text-sm">{member.name}</span>
                            <span className="text-white/30 text-xs">
                              ({member.party.charAt(0)}-{member.state})
                            </span>
                          </Link>
                        ) : (
                          <span className="text-white/40 text-sm">Speaker: {stmt.bioguideId}</span>
                        )}
                        
                        <a
                          href={stmt.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-accent-blue hover:text-accent-blue/80 text-sm transition-colors"
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
          </>
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
