"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { techTopics } from "@/data/capitol-pulse";
import { Statement, CongressMember, TechTopic } from "@/lib/capitol-pulse/types";
import { ScrollReveal } from "@/components/ScrollAnimations";

export default function StatementDetailPage() {
  const params = useParams();
  const statementId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [statement, setStatement] = useState<Statement | null>(null);
  const [member, setMember] = useState<CongressMember | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStatement() {
      try {
        // Fetch statement by ID
        const res = await fetch(`/api/capitol-pulse/statements/${statementId}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("Statement not found");
          } else {
            setError("Failed to load statement");
          }
          return;
        }
        
        const data = await res.json();
        setStatement(data.statement);
        
        // Fetch member info if we have bioguideId
        if (data.statement?.bioguideId) {
          const membersRes = await fetch('/api/capitol-pulse/members');
          const membersData = await membersRes.json();
          const foundMember = membersData.members?.find(
            (m: CongressMember) => m.bioguideId === data.statement.bioguideId
          );
          setMember(foundMember || null);
        }
      } catch (err) {
        console.error("Failed to load statement:", err);
        setError("Failed to load statement");
      } finally {
        setLoading(false);
      }
    }
    
    loadStatement();
  }, [statementId]);

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

  const getSourceTypeLabel = (sourceType: string) => {
    switch (sourceType) {
      case "congressional_record": return "Congressional Record";
      case "press_release": return "Press Release";
      case "committee_hearing": return "Committee Hearing";
      default: return "Official Source";
    }
  };

  if (loading) {
    return (
      <div className="pt-28 pb-24 min-h-screen">
        <div className="mx-auto max-w-4xl px-6">
          <div className="animate-pulse">
            <div className="h-6 bg-white/10 rounded w-32 mb-4" />
            <div className="h-12 bg-white/10 rounded w-3/4 mb-4" />
            <div className="h-64 bg-white/10 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !statement) {
    return (
      <div className="pt-28 pb-24 min-h-screen">
        <div className="mx-auto max-w-4xl px-6">
          <Link href="/capitol-pulse/search" className="text-accent-blue hover:text-accent-blue/80 text-sm mb-4 inline-block">
            ← Back to Search
          </Link>
          <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-12 text-center">
            <span className="text-6xl mb-6 block">🔍</span>
            <h1 className="text-2xl font-display font-bold text-white mb-4">
              {error || "Statement Not Found"}
            </h1>
            <p className="text-white/50 mb-6">
              This statement could not be found in our database.
            </p>
            <Link 
              href="/capitol-pulse/search"
              className="inline-block px-6 py-3 rounded-full bg-accent-blue text-white font-medium hover:bg-accent-blue/80 transition-colors"
            >
              Search All Statements
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="mx-auto max-w-4xl px-6">
        {/* Breadcrumb */}
        <ScrollReveal animation="fade-down">
          <Link href="/capitol-pulse/search" className="text-accent-blue hover:text-accent-blue/80 text-sm mb-4 inline-block">
            ← Back to Evidence Explorer
          </Link>
        </ScrollReveal>

        {/* Statement Card */}
        <ScrollReveal animation="fade-up">
          <article className="bg-navy-800/40 rounded-2xl border border-white/5 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-white/5">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  statement.sourceType === "press_release" 
                    ? "bg-purple-500/20 text-purple-400"
                    : "bg-blue-500/20 text-blue-400"
                }`}>
                  {getSourceTypeLabel(statement.sourceType)}
                </span>
                
                {statement.tone && (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statement.tone === "Support" ? "bg-emerald-500/20 text-emerald-400" :
                    statement.tone === "Concern" ? "bg-amber-500/20 text-amber-400" :
                    "bg-white/10 text-white/60"
                  }`}>
                    {statement.tone} {statement.toneConfidence && `(${statement.toneConfidence}%)`}
                  </span>
                )}
                
                <span className="text-white/30 text-sm ml-auto">
                  {formatDate(statement.publishedAt)}
                </span>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
                {statement.title}
              </h1>
              
              {/* Topics */}
              <div className="flex flex-wrap gap-2">
                {statement.topics.map(t => {
                  const topic = techTopics.find(tp => tp.id === t);
                  return (
                    <Link
                      key={t}
                      href={`/capitol-pulse/topics/${encodeURIComponent(t)}`}
                      className="px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue text-sm hover:bg-accent-blue/20 transition-colors"
                    >
                      {topic?.icon} {t}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Member Info */}
            {member && (
              <div className="p-6 border-b border-white/5 bg-white/5">
                <Link
                  href={`/capitol-pulse/members/${member.bioguideId}`}
                  className="flex items-center gap-4 hover:opacity-80 transition-opacity"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold ${
                    member.party === "Democratic" ? "bg-blue-500" :
                    member.party === "Republican" ? "bg-red-500" :
                    "bg-purple-500"
                  }`}>
                    {member.firstName[0]}{member.lastName[0]}
                  </div>
                  <div>
                    <p className="text-white font-medium">{member.name}</p>
                    <p className="text-white/50 text-sm">
                      {member.chamber} ({member.party.charAt(0)}) - {member.state}
                      {member.district && `, District ${member.district}`}
                    </p>
                  </div>
                </Link>
              </div>
            )}

            {/* Excerpt */}
            <div className="p-6 border-b border-white/5">
              <h2 className="text-white/50 text-sm font-medium uppercase tracking-wider mb-3">
                Key Excerpt
              </h2>
              <blockquote className="text-white/80 text-lg leading-relaxed pl-4 border-l-2 border-accent-blue/50 italic">
                "{statement.excerpt}"
              </blockquote>
            </div>

            {/* Full Text (if available) */}
            {statement.fullText && (
              <div className="p-6 border-b border-white/5">
                <h2 className="text-white/50 text-sm font-medium uppercase tracking-wider mb-3">
                  Full Text
                </h2>
                <div className="text-white/70 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto custom-scrollbar">
                  {statement.fullText}
                </div>
              </div>
            )}

            {/* Why Tagged (Transparency) */}
            {statement.matchedSnippet && (
              <div className="p-6 border-b border-white/5 bg-accent-blue/5">
                <h2 className="text-white/50 text-sm font-medium uppercase tracking-wider mb-3">
                  🔬 Why This Was Tagged
                </h2>
                <p className="text-white/60 text-sm">
                  This statement was tagged as tech-related because of the following matches:
                </p>
                <p className="text-white/80 text-sm mt-2 font-mono bg-white/5 p-3 rounded">
                  {statement.matchedSnippet}
                </p>
              </div>
            )}

            {/* Keywords & Entities */}
            {(statement.keywords.length > 0 || statement.entities.length > 0) && (
              <div className="p-6 border-b border-white/5">
                <h2 className="text-white/50 text-sm font-medium uppercase tracking-wider mb-3">
                  Keywords & Entities
                </h2>
                <div className="flex flex-wrap gap-2">
                  {statement.keywords.map(k => (
                    <Link 
                      key={k}
                      href={`/capitol-pulse/search?q=${encodeURIComponent(k)}`}
                      className="text-white/50 text-sm hover:text-accent-blue transition-colors"
                    >
                      #{k}
                    </Link>
                  ))}
                  {statement.entities.map(e => (
                    <Link
                      key={e}
                      href={`/capitol-pulse/search?q=${encodeURIComponent(e)}`}
                      className="px-2 py-0.5 rounded bg-white/5 text-white/60 text-sm hover:text-white transition-colors"
                    >
                      {e}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Source Link */}
            <div className="p-6 bg-navy-900/50">
              <h2 className="text-white/50 text-sm font-medium uppercase tracking-wider mb-3">
                📎 Original Source
              </h2>
              <a
                href={statement.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-blue hover:text-accent-blue/80 break-all"
              >
                {statement.sourceUrl}
              </a>
              <p className="text-white/30 text-xs mt-2">
                Always verify claims by checking the original official source.
              </p>
            </div>
          </article>
        </ScrollReveal>

        {/* Related Actions */}
        <ScrollReveal animation="fade-up" delay={100}>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={`/capitol-pulse/search?topic=${encodeURIComponent(statement.topics[0] || '')}`}
              className="px-4 py-2 rounded-full bg-white/5 text-white/70 text-sm hover:bg-white/10 transition-colors"
            >
              More on {statement.topics[0]}
            </Link>
            {member && (
              <Link
                href={`/capitol-pulse/members/${member.bioguideId}`}
                className="px-4 py-2 rounded-full bg-white/5 text-white/70 text-sm hover:bg-white/10 transition-colors"
              >
                All statements by {member.name}
              </Link>
            )}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}

