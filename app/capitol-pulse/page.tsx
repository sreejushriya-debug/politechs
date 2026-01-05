"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { techTopics } from "@/data/capitol-pulse";
import { ScrollReveal } from "@/components/ScrollAnimations";
import { AnimatedLine } from "@/components/AmbientEffects";

export default function CapitolPulseLanding() {
  const [mounted, setMounted] = useState(false);
  const [dataStatus, setDataStatus] = useState<{
    hasApiKey: boolean;
    membersCount: number;
    billsCount: number;
    statementsCount: number;
    message: string;
  } | null>(null);
  
  useEffect(() => {
    setMounted(true);
    
    // Fetch data availability from API routes
    async function checkDataAvailability() {
      try {
        const [healthRes, membersRes, billsRes] = await Promise.all([
          fetch('/api/capitol-pulse/health'),
          fetch('/api/capitol-pulse/members'),
          fetch('/api/capitol-pulse/bills')
        ]);
        
        const health = await healthRes.json();
        const members = await membersRes.json();
        const bills = await billsRes.json();
        
        setDataStatus({
          hasApiKey: health.hasApiKey && health.available,
          membersCount: members.members?.length || 0,
          billsCount: bills.bills?.length || 0,
          statementsCount: 0, // Statements not yet implemented
          message: health.available 
            ? `Connected to Congress.gov API` 
            : health.message || "API not available"
        });
      } catch (error) {
        console.error("Failed to check data availability:", error);
        setDataStatus({
          hasApiKey: false,
          membersCount: 0,
          billsCount: 0,
          statementsCount: 0,
          message: "Failed to connect to API"
        });
      }
    }
    
    checkDataAvailability();
  }, []);

  const formattedDate = mounted ? new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }) : "";

  const isLiveData = dataStatus?.hasApiKey && dataStatus.membersCount > 0;

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="mx-auto max-w-6xl px-6">
        {/* Hero Section */}
        <header className="text-center mb-20">
          <ScrollReveal animation="zoom-in" delay={100}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold mb-6">
              <span className="text-white">Capitol</span>
              <span className="bg-gradient-to-r from-accent-blue to-accent-red bg-clip-text text-transparent"> Pulse</span>
            </h1>
          </ScrollReveal>
          
          <ScrollReveal animation="fade-up" delay={200}>
            <p className="text-white/60 max-w-2xl mx-auto text-xl leading-relaxed mb-4">
              Track how Congress talks about and acts on technology policy—transparently, 
              with every claim backed by official sources.
            </p>
            <p className="text-white/40 text-sm">
              Congressional Record • Legislation • Roll-call votes • Transparent methodology
            </p>
            <AnimatedLine className="w-24 mx-auto mt-8" />
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={300}>
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <Link 
                href="/capitol-pulse/dashboard"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-accent-blue to-accent-red text-white font-bold text-lg hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-all duration-500 hover:scale-105"
              >
                Explore Dashboard
              </Link>
              <Link 
                href="/capitol-pulse/methodology"
                className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium text-lg hover:bg-white/10 transition-all duration-300"
              >
                View Methodology
              </Link>
            </div>
          </ScrollReveal>
        </header>

        {/* Data Status Banner */}
        <section className="mb-12">
          <ScrollReveal animation="fade-up">
            <div className={`rounded-2xl border p-6 ${
              isLiveData 
                ? "bg-emerald-500/10 border-emerald-500/20" 
                : "bg-amber-500/10 border-amber-500/20"
            }`}>
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${isLiveData ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                <div className="flex-1">
                  <p className={`font-medium ${isLiveData ? "text-emerald-400" : "text-amber-400"}`}>
                    {isLiveData ? "Connected to Official Sources" : "API Configuration Required"}
                  </p>
                  <p className="text-white/50 text-sm">
                    {dataStatus?.message || "Checking data availability..."}
                  </p>
                </div>
                {isLiveData && dataStatus && (
                  <div className="text-right text-sm">
                    <p className="text-white/60">{dataStatus.membersCount} members</p>
                    <p className="text-white/40">{dataStatus.billsCount} bills tracked</p>
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Data Sources Info */}
        <section className="mb-20">
          <ScrollReveal animation="fade-up">
            <div className="bg-gradient-to-br from-navy-800/40 to-navy-900/40 rounded-3xl border border-white/5 overflow-hidden">
              <div className="p-8 border-b border-white/5">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-white mb-1">
                      Official Data Sources
                    </h2>
                    <p className="text-white/40 text-sm">
                      Last checked: {formattedDate}
                    </p>
                  </div>
                  <Link 
                    href="/capitol-pulse/methodology"
                    className="text-accent-blue hover:text-accent-blue/80 text-sm font-medium flex items-center gap-1 transition-colors"
                  >
                    View Methodology →
                  </Link>
                </div>
              </div>

              <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5">
                {/* Congress.gov API */}
                <div className="p-6">
                  <h3 className="text-white/50 text-sm font-medium uppercase tracking-wider mb-4">
                    Legislation Data
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📜</span>
                      <div>
                        <p className="text-white font-medium">Congress.gov API</p>
                        <p className="text-white/40 text-sm">Bills, resolutions, sponsors</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🗳️</span>
                      <div>
                        <p className="text-white font-medium">Roll-Call Votes</p>
                        <p className="text-white/40 text-sm">House Clerk & Senate.gov</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Congressional Record */}
                <div className="p-6">
                  <h3 className="text-white/50 text-sm font-medium uppercase tracking-wider mb-4">
                    Floor Statements
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🏛️</span>
                      <div>
                        <p className="text-white font-medium">Congressional Record</p>
                        <p className="text-white/40 text-sm">Official floor speeches</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📄</span>
                      <div>
                        <p className="text-white font-medium">Member Websites</p>
                        <p className="text-white/40 text-sm">Official .gov domains only</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coverage Info */}
                <div className="p-6">
                  <h3 className="text-white/50 text-sm font-medium uppercase tracking-wider mb-4">
                    Coverage
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Members</span>
                      <span className="text-white font-medium">{dataStatus?.membersCount || 0}/535</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Tech Bills</span>
                      <span className="text-white font-medium">{dataStatus?.billsCount || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Statements</span>
                      <span className="text-white font-medium">{dataStatus?.statementsCount || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Feature Cards */}
        <section className="mb-20">
          <ScrollReveal animation="fade-up">
            <h2 className="text-3xl font-display font-bold text-white text-center mb-12">
              What You Can Explore
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Topic Tracker",
                description: "See how Congress discusses AI, privacy, antitrust, and 6 more tech topics over time.",
                icon: "📊",
                href: "/capitol-pulse/dashboard",
                color: "from-blue-500/20 to-red-500/20"
              },
              {
                title: "Member Profiles",
                description: "Every member's tech policy activity with official statements and legislation.",
                icon: "👤",
                href: "/capitol-pulse/members",
                color: "from-purple-500/20 to-pink-500/20"
              },
              {
                title: "Words vs Actions",
                description: "Compare what members say about tech with how they actually vote.",
                icon: "⚖️",
                href: "/capitol-pulse/dashboard",
                color: "from-amber-500/20 to-orange-500/20"
              },
              {
                title: "Evidence Explorer",
                description: "Search every statement with highlighted excerpts and source links.",
                icon: "🔍",
                href: "/capitol-pulse/search",
                color: "from-blue-500/20 to-indigo-500/20"
              },
              {
                title: "Bill Tracker",
                description: "Track tech-related legislation from introduction to enactment.",
                icon: "📜",
                href: "/capitol-pulse/bills",
                color: "from-rose-500/20 to-red-500/20"
              },
              {
                title: "Data Downloads",
                description: "Export statements, tags, and votes as CSV or JSON for your research.",
                icon: "📥",
                href: "/capitol-pulse/data",
                color: "from-teal-500/20 to-green-500/20"
              }
            ].map((feature, i) => (
              <ScrollReveal key={feature.title} animation="fade-up" delay={i * 50}>
                <Link 
                  href={feature.href}
                  className={`block h-full bg-gradient-to-br ${feature.color} rounded-2xl p-6 border border-white/5 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] group`}
                >
                  <span className="text-4xl mb-4 block">{feature.icon}</span>
                  <h3 className="text-white font-display font-semibold text-lg mb-2 group-hover:text-accent-blue transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Topics Grid */}
        <section className="mb-20">
          <ScrollReveal animation="fade-up">
            <h2 className="text-3xl font-display font-bold text-white text-center mb-4">
              Technology Topics We Track
            </h2>
            <p className="text-white/50 text-center mb-12 max-w-2xl mx-auto">
              Every statement and bill is automatically classified into these policy areas 
              using official Congress.gov subjects and keyword matching.
            </p>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {techTopics.map((topic, i) => (
              <ScrollReveal key={topic.id} animation="fade-up" delay={i * 30}>
                <Link
                  href={`/capitol-pulse/topics/${encodeURIComponent(topic.id)}`}
                  className="flex items-start gap-4 p-5 rounded-xl bg-white/5 border border-white/5 hover:border-accent-blue/30 hover:bg-accent-blue/5 transition-all duration-300 group"
                >
                  <span className="text-3xl">{topic.icon}</span>
                  <div>
                    <h3 className="text-white font-medium mb-1 group-hover:text-accent-blue transition-colors">
                      {topic.name}
                    </h3>
                    <p className="text-white/40 text-sm line-clamp-2">
                      {topic.description}
                    </p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Stats - Now shows actual counts */}
        <section className="mb-20">
          <ScrollReveal animation="fade-up">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Congress Members", value: "535", icon: "🏛️", sublabel: "House + Senate" },
                { label: "Statements", value: dataStatus?.statementsCount?.toString() || "0", icon: "📝", sublabel: "From official sources" },
                { label: "Tech Bills", value: dataStatus?.billsCount?.toString() || "0", icon: "📋", sublabel: "119th Congress" },
                { label: "Topics Tracked", value: "9", icon: "🏷️", sublabel: "Policy areas" }
              ].map((stat, i) => (
                <div key={stat.label} className="text-center p-6 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-3xl mb-2 block">{stat.icon}</span>
                  <p className="text-3xl font-display font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-white/40 text-sm">{stat.label}</p>
                  <p className="text-white/25 text-xs mt-1">{stat.sublabel}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* Credibility Statement */}
        <section className="mb-20">
          <ScrollReveal animation="zoom-in">
            <div className="bg-gradient-to-br from-accent-blue/10 via-navy-800/50 to-accent-red/10 rounded-3xl p-10 md:p-12 border border-white/5">
              <div className="max-w-3xl mx-auto text-center">
                <span className="text-4xl mb-4 block">🔬</span>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
                  Research-Grade Transparency
                </h2>
                <p className="text-white/60 text-lg leading-relaxed mb-6">
                  Every data point links back to its official source. We show our work—the exact excerpts 
                  that triggered each tag, the methodology behind classifications, and a full 
                  explanation of what we do and don't claim.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link 
                    href="/capitol-pulse/methodology"
                    className="px-6 py-3 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
                  >
                    Read Our Methodology
                  </Link>
                  <Link 
                    href="/capitol-pulse/data"
                    className="px-6 py-3 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
                  >
                    Download Raw Data
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Disclaimer */}
        <ScrollReveal animation="fade-up">
          <p className="text-center text-white/30 text-sm max-w-2xl mx-auto">
            Capitol Pulse uses official Congressional sources and public records. 
            Topic classifications use Congress.gov subjects and keyword matching—see our methodology 
            for details. This tool is for research and civic engagement, not partisan advocacy.
          </p>
        </ScrollReveal>
      </div>
    </div>
  );
}
