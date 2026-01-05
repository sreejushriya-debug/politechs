"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { techTopics } from "@/data/capitol-pulse";
import { getMembers } from "@/lib/capitol-pulse/data-store";
import { CongressMember } from "@/lib/capitol-pulse/types";
import { ScrollReveal } from "@/components/ScrollAnimations";

type Chamber = "House" | "Senate" | "All";
type Party = "Democratic" | "Republican" | "Independent" | "All";

export default function MembersListPage() {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<CongressMember[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [dataSource, setDataSource] = useState<string>("");
  
  const [chamberFilter, setChamberFilter] = useState<Chamber>("All");
  const [partyFilter, setPartyFilter] = useState<Party>("All");
  const [stateFilter, setStateFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getMembers();
        setMembers(data.members);
        setLastUpdated(data.lastUpdated);
        setDataSource(data.source);
      } catch (error) {
        console.error("Failed to load members:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Get unique states for filter
  const states = useMemo(() => {
    const stateSet = new Set(members.map(m => m.state));
    return Array.from(stateSet).sort();
  }, [members]);

  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      if (chamberFilter !== "All" && m.chamber !== chamberFilter) return false;
      if (partyFilter !== "All" && m.party !== partyFilter) return false;
      if (stateFilter && m.state !== stateFilter) return false;
      if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && 
          !m.state.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }).sort((a, b) => a.lastName.localeCompare(b.lastName));
  }, [members, chamberFilter, partyFilter, stateFilter, search]);

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
              Member Profiles
            </h1>
            <p className="text-white/50 max-w-2xl">
              Explore how each member of Congress engages with technology policy.
            </p>
          </ScrollReveal>
        </header>

        {/* Data Status */}
        <ScrollReveal animation="fade-up">
          <div className={`rounded-xl border p-4 mb-8 ${
            members.length > 0 ? "bg-emerald-500/10 border-emerald-500/20" : "bg-amber-500/10 border-amber-500/20"
          }`}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${members.length > 0 ? "bg-emerald-500" : "bg-amber-500"}`} />
                <span className={`text-sm font-medium ${members.length > 0 ? "text-emerald-400" : "text-amber-400"}`}>
                  {dataSource}
                </span>
              </div>
              <span className="text-white/40 text-sm">
                {members.length} members loaded • Updated: {formattedDate}
              </span>
            </div>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent-blue border-t-transparent" />
          </div>
        ) : members.length === 0 ? (
          <ScrollReveal animation="fade-up">
            <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-12 text-center">
              <span className="text-6xl mb-6 block">🏛️</span>
              <h2 className="text-2xl font-display font-bold text-white mb-4">
                No Member Data Available
              </h2>
              <p className="text-white/50 max-w-lg mx-auto mb-6">
                Connect to the Congress.gov API to load member profiles.
                See the <Link href="/capitol-pulse/methodology" className="text-accent-blue hover:underline">methodology page</Link> for setup instructions.
              </p>
            </div>
          </ScrollReveal>
        ) : (
          <>
            {/* Filters */}
            <ScrollReveal animation="fade-up">
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Search by name or state..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-accent-blue/50"
                  />
                </div>
                
                <select
                  value={chamberFilter}
                  onChange={(e) => setChamberFilter(e.target.value as Chamber)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue/50"
                >
                  <option value="All">Both Chambers</option>
                  <option value="Senate">Senate</option>
                  <option value="House">House</option>
                </select>
                
                <select
                  value={partyFilter}
                  onChange={(e) => setPartyFilter(e.target.value as Party)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue/50"
                >
                  <option value="All">All Parties</option>
                  <option value="Democratic">Democratic</option>
                  <option value="Republican">Republican</option>
                  <option value="Independent">Independent</option>
                </select>

                <select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue/50"
                >
                  <option value="">All States</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </ScrollReveal>

            {/* Results Count */}
            <p className="text-white/40 text-sm mb-6">
              Showing {filteredMembers.length} of {members.length} members
            </p>

            {/* Members Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMembers.map((member, i) => {
                const partyColor = member.party === "Democratic" ? "from-blue-500 to-blue-600" :
                                   member.party === "Republican" ? "from-red-500 to-red-600" :
                                   "from-purple-500 to-purple-600";
                
                return (
                  <ScrollReveal key={member.bioguideId} animation="fade-up" delay={Math.min(i * 20, 200)}>
                    <Link
                      href={`/capitol-pulse/members/${member.bioguideId}`}
                      className="block p-5 rounded-2xl bg-navy-800/40 border border-white/5 hover:border-accent-blue/30 transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        {member.imageUrl ? (
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white/10">
                            <Image
                              src={member.imageUrl}
                              alt={member.name}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                // Fallback to initials on error
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        ) : (
                          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${partyColor} flex items-center justify-center text-white font-bold text-lg`}>
                            {member.firstName[0]}{member.lastName[0]}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium truncate group-hover:text-accent-blue transition-colors">
                            {member.name}
                          </h3>
                          <p className="text-white/40 text-sm">
                            {member.party.charAt(0)} • {member.state}{member.district ? `-${member.district}` : ""} • {member.chamber}
                          </p>
                          {member.officialUrl && (
                            <p className="text-white/30 text-xs mt-1 truncate">
                              {member.officialUrl.replace(/^https?:\/\//, '')}
                            </p>
                          )}
                        </div>
                      </div>
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
          </>
        )}
      </div>
    </div>
  );
}
