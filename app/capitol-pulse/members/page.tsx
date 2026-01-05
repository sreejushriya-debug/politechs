"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { congressMembers, techTopics, Chamber, Party } from "@/data/capitol-pulse";
import { ScrollReveal } from "@/components/ScrollAnimations";

export default function MembersListPage() {
  const [chamberFilter, setChamberFilter] = useState<Chamber | "All">("All");
  const [partyFilter, setPartyFilter] = useState<Party | "All">("All");
  const [search, setSearch] = useState("");

  const filteredMembers = useMemo(() => {
    return congressMembers.filter(m => {
      if (chamberFilter !== "All" && m.chamber !== chamberFilter) return false;
      if (partyFilter !== "All" && m.party !== partyFilter) return false;
      if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && 
          !m.state.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }).sort((a, b) => {
      const aMax = Math.max(...a.techFingerprint.map(f => f.score));
      const bMax = Math.max(...b.techFingerprint.map(f => f.score));
      return bMax - aMax;
    });
  }, [chamberFilter, partyFilter, search]);

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
              Member Profiles
            </h1>
            <p className="text-white/50 max-w-2xl">
              Explore how each member of Congress engages with technology policy.
            </p>
          </ScrollReveal>
        </header>

        {/* Filters */}
        <ScrollReveal animation="fade-up">
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search by name or state..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            
            <select
              value={chamberFilter}
              onChange={(e) => setChamberFilter(e.target.value as Chamber | "All")}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
            >
              <option value="All">Both Chambers</option>
              <option value="Senate">Senate</option>
              <option value="House">House</option>
            </select>
            
            <select
              value={partyFilter}
              onChange={(e) => setPartyFilter(e.target.value as Party | "All")}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
            >
              <option value="All">All Parties</option>
              <option value="Democrat">Democrat</option>
              <option value="Republican">Republican</option>
              <option value="Independent">Independent</option>
            </select>
          </div>
        </ScrollReveal>

        {/* Results Count */}
        <p className="text-white/40 text-sm mb-6">
          Showing {filteredMembers.length} member{filteredMembers.length !== 1 ? "s" : ""}
        </p>

        {/* Members Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member, i) => {
            const partyColor = member.party === "Democrat" ? "from-blue-500 to-blue-600" :
                               member.party === "Republican" ? "from-red-500 to-red-600" :
                               "from-purple-500 to-purple-600";
            const topScore = Math.max(...member.techFingerprint.map(f => f.score));
            const topTopic = member.techFingerprint.find(f => f.score === topScore);
            
            return (
              <ScrollReveal key={member.id} animation="fade-up" delay={Math.min(i * 30, 200)}>
                <Link
                  href={`/capitol-pulse/members/${member.id}`}
                  className="block p-5 rounded-2xl bg-navy-800/40 border border-white/5 hover:border-emerald-500/30 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${partyColor} flex items-center justify-center text-white font-bold text-sm`}>
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate group-hover:text-emerald-400 transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-white/40 text-sm">
                        {member.party.charAt(0)} • {member.state}{member.district ? `-${member.district}` : ""} • {member.chamber}
                      </p>
                    </div>
                  </div>
                  
                  {topTopic && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <p className="text-white/40 text-xs mb-2">Top Tech Focus</p>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {techTopics.find(t => t.id === topTopic.topic)?.icon}
                        </span>
                        <span className="text-white/70 text-sm flex-1 truncate">
                          {topTopic.topic}
                        </span>
                        <span className="text-emerald-400 font-bold text-sm">
                          {topTopic.score}
                        </span>
                      </div>
                    </div>
                  )}
                </Link>
              </ScrollReveal>
            );
          })}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-16">
            <p className="text-white/50">No members match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

