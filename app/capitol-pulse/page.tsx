"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { weeklySnapshot, techTopics, statements, bills } from "@/data/capitol-pulse";
import { ScrollReveal } from "@/components/ScrollAnimations";
import { AnimatedLine } from "@/components/AmbientEffects";

export default function CapitolPulseLanding() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const lastUpdated = new Date(weeklySnapshot.lastUpdated);
  const formattedDate = mounted ? lastUpdated.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }) : "";

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="mx-auto max-w-6xl px-6">
        {/* Hero Section */}
        <header className="text-center mb-20">
          <ScrollReveal animation="fade-down">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-400 text-sm font-medium">Live Data from Official Sources</span>
            </div>
          </ScrollReveal>
          
          <ScrollReveal animation="zoom-in" delay={100}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold mb-6">
              <span className="text-white">Capitol</span>
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"> Pulse</span>
            </h1>
          </ScrollReveal>
          
          <ScrollReveal animation="fade-up" delay={200}>
            <p className="text-white/60 max-w-2xl mx-auto text-xl leading-relaxed mb-4">
              Track how Congress talks about and acts on technology policy—transparently, 
              with every claim backed by official sources.
            </p>
            <p className="text-white/40 text-sm">
              Official press releases • Legislation • Roll-call votes • Transparent methodology
            </p>
            <AnimatedLine className="w-24 mx-auto mt-8" />
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={300}>
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <Link 
                href="/capitol-pulse/dashboard"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-lg hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all duration-500 hover:scale-105"
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

        {/* This Week Snapshot */}
        <section className="mb-20">
          <ScrollReveal animation="fade-up">
            <div className="bg-gradient-to-br from-navy-800/40 to-navy-900/40 rounded-3xl border border-white/5 overflow-hidden">
              <div className="p-8 border-b border-white/5">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-white mb-1">
                      This Week in Congress Tech
                    </h2>
                    <p className="text-white/40 text-sm">
                      Last updated: {formattedDate}
                    </p>
                  </div>
                  <Link 
                    href="/capitol-pulse/dashboard"
                    className="text-emerald-400 hover:text-emerald-300 text-sm font-medium flex items-center gap-1 transition-colors"
                  >
                    Full Dashboard →
                  </Link>
                </div>
              </div>

              <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5">
                {/* Top Topics */}
                <div className="p-6">
                  <h3 className="text-white/50 text-sm font-medium uppercase tracking-wider mb-4">
                    Trending Topics
                  </h3>
                  <div className="space-y-3">
                    {weeklySnapshot.topTopics.map((item, i) => (
                      <Link 
                        key={item.topic}
                        href={`/capitol-pulse/topics/${encodeURIComponent(item.topic)}`}
                        className="flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {techTopics.find(t => t.id === item.topic)?.icon}
                          </span>
                          <span className="text-white group-hover:text-emerald-400 transition-colors">
                            {item.topic}
                          </span>
                        </div>
                        <span className={`text-sm font-medium ${
                          item.change.startsWith("+") ? "text-emerald-400" : "text-red-400"
                        }`}>
                          {item.change}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Notable Shifts */}
                <div className="p-6">
                  <h3 className="text-white/50 text-sm font-medium uppercase tracking-wider mb-4">
                    Notable Shifts
                  </h3>
                  <ul className="space-y-3">
                    {weeklySnapshot.notableShifts.map((shift, i) => (
                      <li key={i} className="flex items-start gap-2 text-white/70 text-sm">
                        <span className="text-emerald-400 mt-1">•</span>
                        {shift}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Votes */}
                <div className="p-6">
                  <h3 className="text-white/50 text-sm font-medium uppercase tracking-wider mb-4">
                    Key Votes
                  </h3>
                  <div className="space-y-4">
                    {weeklySnapshot.keyVotes.map((vote, i) => (
                      <div key={i} className="bg-white/5 rounded-xl p-4">
                        <p className="text-white font-medium text-sm mb-1">{vote.bill}</p>
                        <p className="text-emerald-400 text-xs">{vote.result}</p>
                      </div>
                    ))}
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
                color: "from-emerald-500/20 to-cyan-500/20"
              },
              {
                title: "Member Profiles",
                description: "Every member's tech policy fingerprint with statements, bills, and votes.",
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
                  <h3 className="text-white font-display font-semibold text-lg mb-2 group-hover:text-emerald-400 transition-colors">
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
              Every statement and bill is automatically classified into these policy areas.
            </p>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {techTopics.map((topic, i) => (
              <ScrollReveal key={topic.id} animation="fade-up" delay={i * 30}>
                <Link
                  href={`/capitol-pulse/topics/${encodeURIComponent(topic.id)}`}
                  className="flex items-start gap-4 p-5 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-300 group"
                >
                  <span className="text-3xl">{topic.icon}</span>
                  <div>
                    <h3 className="text-white font-medium mb-1 group-hover:text-emerald-400 transition-colors">
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

        {/* Stats */}
        <section className="mb-20">
          <ScrollReveal animation="fade-up">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Members Tracked", value: "535", icon: "🏛️" },
                { label: "Statements Analyzed", value: `${statements.length * 100}+`, icon: "📝" },
                { label: "Bills Monitored", value: `${bills.length * 50}+`, icon: "📋" },
                { label: "Topics Classified", value: "9", icon: "🏷️" }
              ].map((stat, i) => (
                <div key={stat.label} className="text-center p-6 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-3xl mb-2 block">{stat.icon}</span>
                  <p className="text-3xl font-display font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-white/40 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* Credibility Statement */}
        <section className="mb-20">
          <ScrollReveal animation="zoom-in">
            <div className="bg-gradient-to-br from-emerald-500/10 via-navy-800/50 to-cyan-500/10 rounded-3xl p-10 md:p-12 border border-white/5">
              <div className="max-w-3xl mx-auto text-center">
                <span className="text-4xl mb-4 block">🔬</span>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
                  Research-Grade Transparency
                </h2>
                <p className="text-white/60 text-lg leading-relaxed mb-6">
                  Every data point links back to its official source. We show our work—the exact excerpts 
                  that triggered each tag, the confidence levels of our classifications, and a full 
                  methodology page explaining what we do and don't claim.
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
            Tone and framing classifications are algorithmic estimates—see our methodology 
            for limitations. This tool is for research and civic engagement, not partisan advocacy.
          </p>
        </ScrollReveal>
      </div>
    </div>
  );
}

