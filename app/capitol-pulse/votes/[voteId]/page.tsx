"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { techTopics } from "@/data/capitol-pulse";
import { Vote, CongressMember } from "@/lib/capitol-pulse/types";
import { ScrollReveal } from "@/components/ScrollAnimations";

export default function VoteDetailPage() {
  const params = useParams();
  const voteId = params.voteId as string;
  
  const [loading, setLoading] = useState(true);
  const [vote, setVote] = useState<Vote | null>(null);
  const [members, setMembers] = useState<CongressMember[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"summary" | "yeas" | "nays" | "all">("summary");

  useEffect(() => {
    async function loadVote() {
      try {
        // Fetch vote by ID
        const res = await fetch(`/api/capitol-pulse/votes/${voteId}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("Vote not found");
          } else {
            setError("Failed to load vote");
          }
          return;
        }
        
        const data = await res.json();
        setVote(data.vote);
        
        // Fetch members for vote breakdown
        const membersRes = await fetch('/api/capitol-pulse/members');
        const membersData = await membersRes.json();
        setMembers(membersData.members || []);
      } catch (err) {
        console.error("Failed to load vote:", err);
        setError("Failed to load vote");
      } finally {
        setLoading(false);
      }
    }
    
    loadVote();
  }, [voteId]);

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

  const getMember = (bioguideId: string) => members.find(m => m.bioguideId === bioguideId);

  const getFilteredVotes = () => {
    if (!vote?.memberVotes) return [];
    switch (viewMode) {
      case "yeas": return vote.memberVotes.filter(v => v.vote === "Yea");
      case "nays": return vote.memberVotes.filter(v => v.vote === "Nay");
      case "all": return vote.memberVotes;
      default: return [];
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

  if (error || !vote) {
    return (
      <div className="pt-28 pb-24 min-h-screen">
        <div className="mx-auto max-w-4xl px-6">
          <Link href="/capitol-pulse/search" className="text-accent-blue hover:text-accent-blue/80 text-sm mb-4 inline-block">
            ← Back to Search
          </Link>
          <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-12 text-center">
            <span className="text-6xl mb-6 block">🗳️</span>
            <h1 className="text-2xl font-display font-bold text-white mb-4">
              {error || "Vote Not Found"}
            </h1>
            <p className="text-white/50 mb-6">
              This roll-call vote could not be found in our database.
            </p>
            <Link 
              href="/capitol-pulse/search?type=votes"
              className="inline-block px-6 py-3 rounded-full bg-accent-blue text-white font-medium hover:bg-accent-blue/80 transition-colors"
            >
              Browse All Votes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalVotes = vote.yeas + vote.nays + vote.present + vote.notVoting;
  const passedPercent = totalVotes > 0 ? Math.round((vote.yeas / totalVotes) * 100) : 0;

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="mx-auto max-w-4xl px-6">
        {/* Breadcrumb */}
        <ScrollReveal animation="fade-down">
          <Link href="/capitol-pulse/search?type=votes" className="text-accent-blue hover:text-accent-blue/80 text-sm mb-4 inline-block">
            ← Back to Votes
          </Link>
        </ScrollReveal>

        {/* Vote Card */}
        <ScrollReveal animation="fade-up">
          <article className="bg-navy-800/40 rounded-2xl border border-white/5 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-white/5">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-medium">
                  Roll Call #{vote.rollNumber}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  vote.chamber === "House" ? "bg-blue-500/20 text-blue-400" : "bg-red-500/20 text-red-400"
                }`}>
                  {vote.chamber}
                </span>
                <span className="text-white/30 text-sm ml-auto">
                  {formatDate(vote.date)}
                </span>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
                {vote.question}
              </h1>
              
              {vote.description && (
                <p className="text-white/60 mb-4">
                  {vote.description}
                </p>
              )}
              
              {/* Topics */}
              {vote.topics.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {vote.topics.map(t => {
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
              )}
            </div>

            {/* Vote Result */}
            <div className="p-6 border-b border-white/5">
              <h2 className="text-white/50 text-sm font-medium uppercase tracking-wider mb-4">
                Result
              </h2>
              
              <div className={`text-3xl font-display font-bold mb-4 ${
                vote.result.toLowerCase().includes("pass") || vote.result.toLowerCase().includes("agreed")
                  ? "text-emerald-400" 
                  : vote.result.toLowerCase().includes("fail") || vote.result.toLowerCase().includes("reject")
                  ? "text-red-400"
                  : "text-white"
              }`}>
                {vote.result}
              </div>
              
              {/* Vote Breakdown Bar */}
              <div className="h-8 rounded-full overflow-hidden flex bg-white/10 mb-4">
                <div 
                  className="bg-emerald-500 flex items-center justify-center text-white text-xs font-bold"
                  style={{ width: `${(vote.yeas / totalVotes) * 100}%` }}
                >
                  {vote.yeas > 0 && vote.yeas}
                </div>
                <div 
                  className="bg-red-500 flex items-center justify-center text-white text-xs font-bold"
                  style={{ width: `${(vote.nays / totalVotes) * 100}%` }}
                >
                  {vote.nays > 0 && vote.nays}
                </div>
                {vote.present > 0 && (
                  <div 
                    className="bg-amber-500 flex items-center justify-center text-white text-xs font-bold"
                    style={{ width: `${(vote.present / totalVotes) * 100}%` }}
                  >
                    {vote.present}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-emerald-400">{vote.yeas}</p>
                  <p className="text-white/40 text-sm">Yea</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-400">{vote.nays}</p>
                  <p className="text-white/40 text-sm">Nay</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-400">{vote.present}</p>
                  <p className="text-white/40 text-sm">Present</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white/40">{vote.notVoting}</p>
                  <p className="text-white/40 text-sm">Not Voting</p>
                </div>
              </div>
            </div>

            {/* Related Bill */}
            {vote.billId && (
              <div className="p-6 border-b border-white/5 bg-white/5">
                <h2 className="text-white/50 text-sm font-medium uppercase tracking-wider mb-3">
                  Related Legislation
                </h2>
                <Link
                  href={`/capitol-pulse/bills/${vote.billId}`}
                  className="text-accent-blue hover:text-accent-blue/80 font-medium"
                >
                  View Bill Details →
                </Link>
              </div>
            )}

            {/* Why Tagged */}
            {vote.matchedText && (
              <div className="p-6 border-b border-white/5 bg-accent-blue/5">
                <h2 className="text-white/50 text-sm font-medium uppercase tracking-wider mb-3">
                  🔬 Why This Was Tagged as Tech-Related
                </h2>
                <p className="text-white/80 text-sm font-mono bg-white/5 p-3 rounded">
                  {vote.matchedText}
                </p>
              </div>
            )}

            {/* Member Votes */}
            {vote.memberVotes && vote.memberVotes.length > 0 && (
              <div className="p-6 border-b border-white/5">
                <h2 className="text-white/50 text-sm font-medium uppercase tracking-wider mb-4">
                  How Members Voted
                </h2>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => setViewMode("summary")}
                    className={`px-4 py-2 rounded-full text-sm ${
                      viewMode === "summary" ? "bg-accent-blue text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    Summary
                  </button>
                  <button
                    onClick={() => setViewMode("yeas")}
                    className={`px-4 py-2 rounded-full text-sm ${
                      viewMode === "yeas" ? "bg-emerald-500 text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    Yeas ({vote.yeas})
                  </button>
                  <button
                    onClick={() => setViewMode("nays")}
                    className={`px-4 py-2 rounded-full text-sm ${
                      viewMode === "nays" ? "bg-red-500 text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    Nays ({vote.nays})
                  </button>
                  <button
                    onClick={() => setViewMode("all")}
                    className={`px-4 py-2 rounded-full text-sm ${
                      viewMode === "all" ? "bg-white/20 text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    All Votes
                  </button>
                </div>
                
                {viewMode !== "summary" && (
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {getFilteredVotes().map(mv => {
                      const member = getMember(mv.bioguideId);
                      return (
                        <Link
                          key={mv.bioguideId}
                          href={`/capitol-pulse/members/${mv.bioguideId}`}
                          className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                              member?.party === "Democratic" ? "bg-blue-500" :
                              member?.party === "Republican" ? "bg-red-500" :
                              "bg-purple-500"
                            }`}>
                              {member ? `${member.firstName[0]}${member.lastName[0]}` : "?"}
                            </div>
                            <div>
                              <p className="text-white text-sm">{member?.name || mv.bioguideId}</p>
                              {member && (
                                <p className="text-white/40 text-xs">
                                  {member.party.charAt(0)}-{member.state}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            mv.vote === "Yea" ? "bg-emerald-500/20 text-emerald-400" :
                            mv.vote === "Nay" ? "bg-red-500/20 text-red-400" :
                            "bg-white/10 text-white/60"
                          }`}>
                            {mv.vote}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Source Link */}
            <div className="p-6 bg-navy-900/50">
              <h2 className="text-white/50 text-sm font-medium uppercase tracking-wider mb-3">
                📎 Official Source
              </h2>
              <a
                href={vote.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-blue hover:text-accent-blue/80 break-all"
              >
                {vote.url}
              </a>
              <p className="text-white/30 text-xs mt-2">
                Vote data from {vote.chamber === "House" ? "clerk.house.gov" : "senate.gov"}
              </p>
            </div>
          </article>
        </ScrollReveal>
      </div>
    </div>
  );
}

