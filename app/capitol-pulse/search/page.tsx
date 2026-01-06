"use client";

import Link from "next/link";
import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { techTopics } from "@/data/capitol-pulse";
import { TechTopic } from "@/lib/capitol-pulse/types";
import { ScrollReveal } from "@/components/ScrollAnimations";

interface SearchResult {
  id: string;
  type: 'bill' | 'statement' | 'vote';
  title: string;
  date: string;
  snippet: string;
  topics: TechTopic[];
  member?: { name: string; bioguideId: string; party: string; state: string };
  sourceUrl: string;
  sourceType?: string;
  matchedTerms: string[];
}

interface DataSources {
  bills: string;
  statements: string;
  votes: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Parse URL params
  const initialQuery = searchParams.get("q") || "";
  const initialTopic = searchParams.get("topic") || "";
  const initialType = searchParams.get("type") || "all";
  
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [dataSources, setDataSources] = useState<DataSources | null>(null);

  // Filter state
  const [query, setQuery] = useState(initialQuery);
  const [topicFilter, setTopicFilter] = useState<TechTopic | "">(initialTopic as TechTopic | "");
  const [typeFilter, setTypeFilter] = useState<"all" | "bills" | "statements" | "votes">(initialType as any);
  const [sourceTypeFilter, setSourceTypeFilter] = useState<"" | "press_release" | "congressional_record">("");
  const [chamberFilter, setChamberFilter] = useState<"" | "House" | "Senate">("");
  const [partyFilter, setPartyFilter] = useState<"" | "Democratic" | "Republican" | "Independent">("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [offset, setOffset] = useState(0);
  const LIMIT = 20;

  // Perform search
  const doSearch = async (resetOffset = true) => {
    setLoading(true);
    const currentOffset = resetOffset ? 0 : offset;
    if (resetOffset) setOffset(0);
    
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (topicFilter) params.set('topic', topicFilter);
      if (typeFilter !== 'all') params.set('type', typeFilter);
      if (sourceTypeFilter) params.set('sourceType', sourceTypeFilter);
      if (chamberFilter) params.set('chamber', chamberFilter);
      if (partyFilter) params.set('party', partyFilter);
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);
      params.set('offset', String(currentOffset));
      params.set('limit', String(LIMIT));
      
      console.log('[Search] Fetching:', `/api/capitol-pulse/search?${params.toString()}`);
      const res = await fetch(`/api/capitol-pulse/search?${params.toString()}`);
      const data = await res.json();
      console.log('[Search] Results:', data.total, 'items');
      
      if (resetOffset) {
        setResults(data.results || []);
      } else {
        setResults(prev => [...prev, ...(data.results || [])]);
      }
      setTotal(data.total || 0);
      setHasMore(data.hasMore || false);
      setDataSources(data.dataSources || null);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    doSearch(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update URL when searching
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (topicFilter) params.set('topic', topicFilter);
    if (typeFilter !== 'all') params.set('type', typeFilter);
    router.push(`/capitol-pulse/search?${params.toString()}`);
    doSearch(true);
  };

  const clearFilters = () => {
    setQuery("");
    setTopicFilter("");
    setTypeFilter("all");
    setSourceTypeFilter("");
    setChamberFilter("");
    setPartyFilter("");
    setDateFrom("");
    setDateTo("");
    router.push('/capitol-pulse/search');
  };

  const loadMore = () => {
    setOffset(prev => prev + LIMIT);
    doSearch(false);
  };

  const highlightMatch = (text: string, terms: string[]): React.ReactNode => {
    if (!terms.length) return text;
    const pattern = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`(${pattern})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? (
        <mark key={i} className="bg-accent-blue/30 text-accent-blue px-0.5 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Date unavailable";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch {
      return "Date unavailable";
    }
  };

  const getResultLink = (result: SearchResult) => {
    switch (result.type) {
      case 'bill':
        return `/capitol-pulse/bills/${result.id}`;
      case 'statement':
        return `/capitol-pulse/statements/${result.id}`;
      case 'vote':
        return `/capitol-pulse/votes/${result.id}`;
      default:
        return result.sourceUrl;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bill': return '📜';
      case 'statement': return '💬';
      case 'vote': return '🗳️';
      default: return '📄';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'bill': return 'Bill';
      case 'statement': return 'Statement';
      case 'vote': return 'Vote';
      default: return 'Record';
    }
  };

  const hasFilters = query || topicFilter || typeFilter !== 'all' || sourceTypeFilter || chamberFilter || partyFilter || dateFrom || dateTo;

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
              Search through Congressional bills, floor statements, press releases, and votes on technology policy.
              Every result links to its original official source.
            </p>
          </ScrollReveal>
        </header>

        {/* Data Source Status */}
        {dataSources && (
          <ScrollReveal animation="fade-up">
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <div className={`rounded-xl border p-4 ${
                dataSources.bills.includes('API') ? "bg-emerald-500/10 border-emerald-500/20" : "bg-amber-500/10 border-amber-500/20"
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">📜</span>
                  <span className="text-white/80 text-sm font-medium">Bills</span>
                </div>
                <p className="text-xs text-white/50">{dataSources.bills}</p>
              </div>
              <div className={`rounded-xl border p-4 ${
                dataSources.statements.includes('Pending') ? "bg-amber-500/10 border-amber-500/20" : "bg-emerald-500/10 border-emerald-500/20"
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">💬</span>
                  <span className="text-white/80 text-sm font-medium">Statements</span>
                </div>
                <p className="text-xs text-white/50">{dataSources.statements}</p>
              </div>
              <div className={`rounded-xl border p-4 ${
                dataSources.votes.includes('Pending') ? "bg-amber-500/10 border-amber-500/20" : "bg-emerald-500/10 border-emerald-500/20"
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">🗳️</span>
                  <span className="text-white/80 text-sm font-medium">Votes</span>
                </div>
                <p className="text-xs text-white/50">{dataSources.votes}</p>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Search & Filters */}
        <ScrollReveal animation="fade-up">
          <form onSubmit={handleSearch} className="bg-navy-800/40 rounded-2xl border border-white/5 p-6 mb-8">
            {/* Main Search */}
            <div className="mb-6">
              <label className="text-white/50 text-sm mb-2 block">Search Keywords</label>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Search by keyword, bill number, member name..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-lg placeholder:text-white/30 focus:outline-none focus:border-accent-blue/50"
                />
                <button
                  type="submit"
                  className="px-8 py-4 rounded-xl bg-accent-blue text-white font-medium hover:bg-accent-blue/80 transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
            
            {/* Filter Row 1: Type & Topic */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="text-white/50 text-sm mb-2 block">Content Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue/50"
                >
                  <option value="all">All Types</option>
                  <option value="bills">📜 Bills Only</option>
                  <option value="statements">💬 Statements Only</option>
                  <option value="votes">🗳️ Votes Only</option>
                </select>
              </div>
              
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

            {/* Filter Row 2: Chamber, Party, Source Type */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-white/50 text-sm mb-2 block">Chamber</label>
                <select
                  value={chamberFilter}
                  onChange={(e) => setChamberFilter(e.target.value as any)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue/50"
                >
                  <option value="">Both Chambers</option>
                  <option value="House">House</option>
                  <option value="Senate">Senate</option>
                </select>
              </div>
              
              <div>
                <label className="text-white/50 text-sm mb-2 block">Party</label>
                <select
                  value={partyFilter}
                  onChange={(e) => setPartyFilter(e.target.value as any)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue/50"
                >
                  <option value="">All Parties</option>
                  <option value="Democratic">Democratic</option>
                  <option value="Republican">Republican</option>
                  <option value="Independent">Independent</option>
                </select>
              </div>
              
              <div>
                <label className="text-white/50 text-sm mb-2 block">Statement Source</label>
                <select
                  value={sourceTypeFilter}
                  onChange={(e) => setSourceTypeFilter(e.target.value as any)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue/50"
                  disabled={typeFilter !== 'statements' && typeFilter !== 'all'}
                >
                  <option value="">All Sources</option>
                  <option value="press_release">Press Releases Only</option>
                  <option value="congressional_record">Official Record Only</option>
                </select>
              </div>
            </div>
            
            {/* Clear Filters */}
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 text-accent-blue hover:text-accent-blue/80 text-sm"
              >
                Clear all filters
              </button>
            )}
          </form>
        </ScrollReveal>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-white/40 text-sm">
            {loading ? "Searching..." : `Found ${total} result${total !== 1 ? "s" : ""}`}
          </p>
          {!loading && results.length > 0 && (
            <p className="text-white/30 text-xs">
              Showing {results.length} of {total}
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && results.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent-blue border-t-transparent" />
          </div>
        )}

        {/* No Results */}
        {!loading && results.length === 0 && (
          <ScrollReveal animation="fade-up">
            <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-12 text-center">
              <span className="text-6xl mb-6 block">🔍</span>
              <h2 className="text-2xl font-display font-bold text-white mb-4">
                No Results Found
              </h2>
              <p className="text-white/50 max-w-lg mx-auto mb-6">
                {hasFilters 
                  ? "No records match your current filters. Try broadening your search or removing some filters."
                  : "Enter a search term or select filters to find Congressional records on tech policy."}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => setTopicFilter("AI & Automation")}
                  className="px-4 py-2 rounded-full bg-white/5 text-white/60 hover:bg-white/10 transition-colors"
                >
                  Browse AI Bills
                </button>
                <button
                  onClick={() => setTopicFilter("Cybersecurity")}
                  className="px-4 py-2 rounded-full bg-white/5 text-white/60 hover:bg-white/10 transition-colors"
                >
                  Browse Cybersecurity
                </button>
                <button
                  onClick={() => setTopicFilter("Data Privacy & Surveillance")}
                  className="px-4 py-2 rounded-full bg-white/5 text-white/60 hover:bg-white/10 transition-colors"
                >
                  Browse Privacy
                </button>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Results */}
        <div className="space-y-4">
          {results.map((result, i) => (
            <ScrollReveal key={`${result.type}-${result.id}`} animation="fade-up" delay={Math.min(i * 30, 150)}>
              <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-6 hover:border-white/10 transition-colors">
                {/* Header */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    result.type === "bill" ? "bg-purple-500/20 text-purple-400" :
                    result.type === "statement" ? "bg-blue-500/20 text-blue-400" :
                    "bg-emerald-500/20 text-emerald-400"
                  }`}>
                    {getTypeIcon(result.type)} {getTypeLabel(result.type)}
                  </span>
                  
                  {result.sourceType && (
                    <span className="px-2 py-0.5 rounded-full bg-white/5 text-white/50 text-xs">
                      {result.sourceType === 'press_release' ? 'Press Release' : 'Official Record'}
                    </span>
                  )}
                  
                  {result.topics.slice(0, 2).map(t => {
                    const topic = techTopics.find(tp => tp.id === t);
                    return (
                      <Link
                        key={t}
                        href={`/capitol-pulse/topics/${encodeURIComponent(t)}`}
                        className="px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue text-xs hover:bg-accent-blue/20 transition-colors"
                      >
                        {topic?.icon} {t}
                      </Link>
                    );
                  })}
                  
                  <span className="text-white/30 text-sm ml-auto">
                    {formatDate(result.date)}
                  </span>
                </div>
                
                {/* Title */}
                <Link 
                  href={getResultLink(result)}
                  className="block group"
                >
                  <h3 className="text-white font-display font-semibold text-lg mb-3 group-hover:text-accent-blue transition-colors">
                    {highlightMatch(result.title, result.matchedTerms)}
                  </h3>
                </Link>
                
                {/* Snippet */}
                <p className="text-white/60 text-sm leading-relaxed mb-4">
                  {highlightMatch(result.snippet, result.matchedTerms)}
                </p>
                
                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  {result.member ? (
                    <Link
                      href={`/capitol-pulse/members/${result.member.bioguideId}`}
                      className="flex items-center gap-2 text-white/60 hover:text-accent-blue transition-colors"
                    >
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                        result.member.party === "Democratic" ? "bg-blue-500" :
                        result.member.party === "Republican" ? "bg-red-500" :
                        "bg-purple-500"
                      }`}>
                        {result.member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                      <span className="text-sm">{result.member.name}</span>
                      <span className="text-white/30 text-xs">
                        ({result.member.party?.charAt(0)}-{result.member.state})
                      </span>
                    </Link>
                  ) : (
                    <span className="text-white/40 text-sm">
                      {result.type === 'bill' ? 'Legislative Record' : 'Congressional Record'}
                    </span>
                  )}
                  
                  <div className="flex items-center gap-4">
                    <Link
                      href={getResultLink(result)}
                      className="text-accent-blue hover:text-accent-blue/80 text-sm transition-colors"
                    >
                      View Details →
                    </Link>
                    <a
                      href={result.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/40 hover:text-white/60 text-sm transition-colors"
                    >
                      Official Source ↗
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Load More */}
        {hasMore && !loading && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              className="px-8 py-3 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors"
            >
              Load More Results
            </button>
          </div>
        )}

        {/* Loading More Indicator */}
        {loading && results.length > 0 && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent-blue border-t-transparent" />
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
