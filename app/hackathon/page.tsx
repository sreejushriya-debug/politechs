"use client";

import Image from "next/image";
import { ScrollReveal, StaggerContainer, CountUp } from "@/components/ScrollAnimations";
import { AnimatedLine } from "@/components/AmbientEffects";
import { useState } from "react";

// Sponsor data
const sponsors = [
  { name: "NordVPN", logo: "/sponsors/nordvpn.png" },
  { name: "NordPass", logo: "/sponsors/nordpass.png" },
  { name: "NordLocker", logo: "/sponsors/nordlocker.png" },
  { name: ".xyz", logo: "/sponsors/xyz.png" },
  { name: "Desmos", logo: "/sponsors/desmos.png" },
  { name: "Certopus", logo: "/sponsors/certopus.png" },
  { name: "Wolfram", logo: "/sponsors/wolfram.png" },
  { name: "Wolfram Alpha", logo: "/sponsors/wolframalpha.png" },
  { name: "Incogni", logo: "/sponsors/incogni.png" },
  { name: "Balsamiq", logo: "/sponsors/balsamiq.png" },
];

// Hackathon data with real winners
const hackathons = [
  {
    year: 2025,
    name: "Hacktivism II",
    participants: 850,
    prizes: 56000,
    sponsors: 10,
    countries: 62,
    managers: ["Shriya", "Ayush"],
    badge: "Most Recent",
    hackathonWinners: [
      {
        place: "1st Place",
        project: "Impact Horizon",
        description: "Step into the policymaker's seat and experience the consequences of your climate decisions in real time.",
        link: "https://devpost.com/software/impact-horizon"
      },
      {
        place: "2nd Place",
        project: "Label AI",
        description: "Label AI – Your food, decoded in 3 seconds.",
        link: "https://devpost.com/software/label-ai-okrcpq"
      },
      {
        place: "3rd Place",
        project: "Smart Hearing AID",
        description: "Smart AI-powered hearing aid with noise cancellation, adaptive sound filtering & smartphone control, making communication clear & confident.",
        link: "https://devpost.com/software/smart-dsp-hearing-aid"
      }
    ],
    ideathonWinners: [
      {
        place: "1st Place",
        project: "CivicConnect",
        description: "CivicConnect empowers citizens to report local issues like potholes or broken lights, track progress, and build trust through transparent communication between people and their local governments.",
        link: "https://devpost.com/software/civicconnect-as4chj"
      },
      {
        place: "2nd Place",
        project: "Anti Jungle Justice (AntiJJ)",
        description: "AntiJJ is a mobile app that helps stop jungle justice by enabling users to report mob attacks in real time with images, videos, and location data, promoting justice through tech and awareness.",
        link: "https://devpost.com/software/anti-jungle-justice-antijj"
      },
      {
        place: "3rd Place",
        project: "CivicLink",
        description: "CivicLink turns civic education into an adventure - where young people learn, act, and make real impact through gamified stories and community missions.",
        link: "https://devpost.com/software/civiclink"
      }
    ]
  },
  {
    year: 2024,
    name: "Hacktivism I",
    participants: 350,
    prizes: 35000,
    sponsors: 10,
    countries: 62,
    managers: ["Shriya", "Ayush", "Yaksh"],
    badge: "Inaugural",
    hackathonWinners: [
      {
        place: "1st Place",
        project: "RetinaGuard",
        description: "AI-driven early diabetic retinopathy detection.",
        link: "https://devpost.com/software/retinaguard"
      },
      {
        place: "2nd Place",
        project: "PodiumAI",
        description: "Transforming lecture transcripts into personalized learning resources for first-generation, low-income students, enhancing their educational journey and opportunities.",
        link: "https://devpost.com/software/podiumai-iny9f2"
      },
      {
        place: "3rd Place",
        project: "Fitness for All - RAFA",
        description: "AI trainer that tracks your exercise routine like a real workout buddy. Providing athletes and non-athletes with an easily accessible platform for effective workouts!",
        link: "https://devpost.com/software/fitness-for-all-rafa-iy65us"
      }
    ],
    ideathonWinners: [
      {
        place: "1st Place",
        project: "IvoryCane",
        description: "A.I Integrated device to revolutionize the way visually challenged people navigate through their lives, they no longer have to depend on other humans or expensive dog guides.",
        link: "https://devpost.com/software/ivorycane"
      },
      {
        place: "2nd Place",
        project: "MediConnect",
        description: "Your Comprehensive Health Companion for Seamless Care.",
        link: "https://devpost.com/software/mediconnect-iyoup8"
      },
      {
        place: "3rd Place",
        project: "VIEW",
        description: "Voter Information and Engagement Website - Your all-in-one voter resource. Empowering first-time, disengaged, and informed voters with personalized guides, candidate info, and real-time alerts.",
        link: "https://devpost.com/software/view-voter-information-and-engagement-website"
      }
    ]
  }
];

type TrackState = Record<number, 'hackathon' | 'ideathon'>;

export default function HackathonPage() {
  const [activeTrack, setActiveTrack] = useState<TrackState>({
    0: 'hackathon',
    1: 'hackathon'
  });

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <header className="text-center mb-20">
          <ScrollReveal animation="fade-down">
            <p className="text-accent-blue font-medium tracking-[0.3em] uppercase text-sm mb-6">
              Hacktivism
            </p>
          </ScrollReveal>
          <ScrollReveal animation="zoom-in" delay={100}>
            <h1 className="page-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-8">
              Civic Hackathon
            </h1>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={200}>
            <p className="text-white/50 max-w-3xl mx-auto text-xl leading-relaxed">
              Driving innovation, creating solutions: coding for a brighter future. 
              Join students from around the world to <span className="text-accent-red font-medium">hack for good</span>.
            </p>
            <AnimatedLine className="w-24 mx-auto mt-8" />
          </ScrollReveal>
        </header>

        {/* Impact Stats */}
        <StaggerContainer className="grid sm:grid-cols-3 gap-6 mb-20">
          {[
            { value: 1200, label: "Total Participants", suffix: "+" },
            { value: 91000, label: "Prize Funding Raised", prefix: "$" },
            { value: 62, label: "Countries Represented", suffix: "+" }
          ].map((stat) => (
            <div
              key={stat.label}
              className="stagger-item group bg-navy-800/30 rounded-3xl p-8 text-center border border-white/5 hover-glow shine-effect"
            >
              <p className="text-4xl md:text-5xl font-display font-bold text-white mb-2 group-hover:text-glow-blue transition-all">
                <CountUp 
                  end={stat.value} 
                  prefix={stat.prefix || ""} 
                  suffix={stat.suffix || ""} 
                  duration={2000}
                />
              </p>
              <p className="text-white/50">{stat.label}</p>
            </div>
          ))}
        </StaggerContainer>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-5 gap-10 mb-20">
          {/* Challenge Description */}
          <div className="lg:col-span-3">
            <ScrollReveal animation="fade-right">
              <div className="bg-navy-800/20 rounded-3xl p-10 border border-white/5 h-full hover-glow">
                <h2 className="font-display font-bold text-white text-3xl md:text-4xl mb-6">
                  The Challenge
                </h2>
                <div className="space-y-5 text-white/60 text-lg leading-relaxed">
                  <p>
                    We're calling on you to tackle <span className="text-white font-medium">pressing civic challenges</span> using 
                    the power of <span className="text-white font-medium">technology</span>. From improving access to education and healthcare 
                    to promoting environmental sustainability and fostering community engagement.
                  </p>
                  <p>
                    Whether you're passionate about social justice, environmental conservation, or economic development, 
                    this is your opportunity to <span className="text-accent-blue font-medium">make a difference</span>.
                  </p>
                  <p>
                    Think creatively, collaborate with peers, and leverage technology to develop solutions with 
                    <span className="text-accent-red font-medium"> meaningful impact</span>. Let's <span className="text-white font-medium">hack for good</span>!
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Status Panel - Submissions Closed */}
          <div className="lg:col-span-2">
            <ScrollReveal animation="fade-left" delay={200}>
              <div className="bg-gradient-to-br from-accent-blue/20 via-navy-800/50 to-accent-red/20 rounded-3xl p-8 border border-accent-blue/30 sticky top-28 glow-mixed">
                <div className="text-center mb-6">
                  <span className="inline-block px-4 py-2 rounded-full bg-accent-red/20 text-accent-red text-sm font-medium mb-4">
                    Submissions Closed
                  </span>
                  <h3 className="font-display font-bold text-white text-2xl mb-2">
                    Hacktivism II has ended
                  </h3>
                  <p className="text-white/50">
                    Thank you to all participants!
                  </p>
                </div>
                
                <div className="bg-navy-900/50 rounded-2xl p-6 mb-6 border border-white/10">
                  <p className="text-center text-white/70 mb-2">🚀 Coming Soon</p>
                  <h4 className="font-display font-bold text-white text-xl text-center gradient-text">
                    Stay Posted for Hacktivism III
                  </h4>
                </div>

                <div className="space-y-4">
                  <a
                    href="https://linktr.ee/politechs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-6 py-4 rounded-full bg-white text-navy-950 font-bold text-center text-lg hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] transition-all duration-300 shine-effect"
                  >
                    All Links
                  </a>
                </div>

                <p className="text-xs text-white/40 text-center mt-6">
                  Follow us on social media to stay updated
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Thank You Sponsors Section */}
        <ScrollReveal animation="fade-up">
          <div className="mb-20 bg-gradient-to-br from-navy-800/30 to-navy-900/30 rounded-3xl p-10 md:p-12 border border-white/5 hover-glow">
            <h2 className="font-display font-bold text-white text-3xl md:text-4xl mb-4 text-center">
              Thank You to Our <span className="gradient-text">Sponsors</span>
            </h2>
            <p className="text-white/50 text-center mb-10 max-w-2xl mx-auto">
              Hacktivism wouldn't be possible without the generous support of these amazing organizations.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {sponsors.map((sponsor, i) => (
                <div
                  key={sponsor.name}
                  className="bg-white rounded-xl p-6 flex items-center justify-center h-24 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    width={140}
                    height={60}
                    className="object-contain max-h-12"
                  />
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Past Hackathons with Winners */}
        <div className="mb-20">
          <ScrollReveal animation="fade-up">
            <h2 className="font-display font-bold text-white text-3xl md:text-4xl mb-10 text-center">
              Our <span className="gradient-text">Hackathons</span>
            </h2>
          </ScrollReveal>
          
          <div className="space-y-16">
            {hackathons.map((hackathon, idx) => (
              <ScrollReveal key={hackathon.year} animation="fade-up" delay={idx * 150}>
                {/* Hackathon Header */}
                <div className="bg-navy-800/30 rounded-3xl p-8 md:p-10 border border-white/5 mb-8 hover-glow shine-effect">
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                      idx === 0 
                        ? 'bg-accent-blue/20 text-accent-blue animate-pulse' 
                        : 'bg-white/10 text-white/60'
                    }`}>
                      {hackathon.badge}
                    </span>
                    <span className="text-white/30">•</span>
                    <span className="text-white/50">{hackathon.year}</span>
                  </div>
                  
                  <h3 className="font-display font-bold text-white text-2xl md:text-3xl mb-6">
                    {hackathon.name}
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div className="group">
                      <p className="text-3xl font-display font-bold text-white group-hover:text-glow-blue transition-all">
                        <CountUp end={hackathon.participants} suffix="+" duration={1500} />
                      </p>
                      <p className="text-sm text-white/50">Participants</p>
                    </div>
                    <div className="group">
                      <p className="text-3xl font-display font-bold text-white group-hover:text-glow-blue transition-all">
                        <CountUp end={hackathon.prizes / 1000} prefix="$" suffix="K" duration={1500} />
                      </p>
                      <p className="text-sm text-white/50">Prize Pool</p>
                    </div>
                    <div className="group">
                      <p className="text-3xl font-display font-bold text-white group-hover:text-glow-blue transition-all">
                        <CountUp end={hackathon.sponsors} suffix="+" duration={1500} />
                      </p>
                      <p className="text-sm text-white/50">Sponsors</p>
                    </div>
                    <div className="group">
                      <p className="text-3xl font-display font-bold text-white group-hover:text-glow-blue transition-all">
                        <CountUp end={hackathon.countries} suffix="+" duration={1500} />
                      </p>
                      <p className="text-sm text-white/50">Countries</p>
                    </div>
                  </div>

                  {/* Managers */}
                  <div className="pt-6 border-t border-white/10">
                    <p className="text-sm text-white/40 mb-2">Organized by</p>
                    <div className="flex flex-wrap gap-3">
                      {hackathon.managers.map(manager => (
                        <span key={manager} className="px-4 py-2 rounded-full bg-white/5 text-white/80 text-sm font-medium hover:bg-white/10 transition-colors">
                          {manager}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Track Tabs */}
                <div className="flex justify-center gap-4 mb-8">
                  <button
                    onClick={() => setActiveTrack(prev => ({ ...prev, [idx]: 'hackathon' }))}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                      activeTrack[idx] === 'hackathon'
                        ? 'bg-gradient-to-r from-accent-blue to-accent-red text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    Hackathon Track
                  </button>
                  <button
                    onClick={() => setActiveTrack(prev => ({ ...prev, [idx]: 'ideathon' }))}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                      activeTrack[idx] === 'ideathon'
                        ? 'bg-gradient-to-r from-accent-blue to-accent-red text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    Ideathon Track
                  </button>
                </div>

                {/* Winners */}
                <div>
                  <h4 className="font-display font-semibold text-white text-xl mb-6 text-center">
                    {activeTrack[idx] === 'hackathon' ? 'Hackathon' : 'Ideathon'} Winners
                  </h4>
                  <div key={`${idx}-${activeTrack[idx]}`} className="grid md:grid-cols-3 gap-6">
                    {(activeTrack[idx] === 'hackathon' ? hackathon.hackathonWinners : hackathon.ideathonWinners).map((winner, i) => (
                      <a
                        href={winner.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={winner.project}
                        className={`bg-navy-800/20 rounded-2xl p-6 border hover-lift hover-glow cursor-pointer transition-all duration-300 ${
                          i === 0 
                            ? 'border-yellow-500/30 hover:border-yellow-500/50' 
                            : i === 1 
                              ? 'border-gray-400/30 hover:border-gray-400/50' 
                              : 'border-orange-600/30 hover:border-orange-600/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`text-sm font-medium ${
                            i === 0 
                              ? 'text-yellow-500' 
                              : i === 1 
                                ? 'text-gray-400' 
                                : 'text-orange-500'
                          }`}>
                            {winner.place}
                          </span>
                        </div>
                        <h5 className="font-display font-semibold text-white text-lg mb-2 group-hover:text-accent-blue transition-colors">
                          {winner.project}
                        </h5>
                        <p className="text-white/50 text-sm leading-relaxed mb-3">
                          {winner.description}
                        </p>
                        <span className="text-accent-blue text-xs flex items-center gap-1">
                          View on Devpost →
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Hackathon Managers Section */}
        <ScrollReveal animation="zoom-in">
          <div className="mb-20">
            <div className="bg-gradient-to-br from-navy-800/50 to-navy-900/50 rounded-3xl p-10 md:p-12 border border-white/5 glow-mixed">
              <h2 className="font-display font-bold text-white text-3xl md:text-4xl mb-4 text-center">
                Meet the <span className="gradient-text">Organizers</span>
              </h2>
              <p className="text-white/50 text-center mb-10 max-w-2xl mx-auto">
                The passionate team behind Hacktivism, working to empower the next generation of civic technologists.
              </p>
              
              <StaggerContainer staggerDelay={200} className="grid md:grid-cols-3 gap-8">
                {[
                  { name: "Shriya", role: "Lead Organizer", years: "2024 & 2025", initial: "S" },
                  { name: "Ayush", role: "Lead Organizer", years: "2024 & 2025", initial: "A" },
                  { name: "Yaksh", role: "Co-Organizer", years: "2024", initial: "Y" }
                ].map((person, i) => (
                  <div key={person.name} className="stagger-item text-center group">
                    <div className={`w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br ${
                      i === 0 ? 'from-accent-red to-accent-blue' :
                      i === 1 ? 'from-accent-blue to-accent-red' :
                      'from-accent-red to-accent-blue'
                    } flex items-center justify-center text-3xl font-display font-bold text-white group-hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-all duration-500 group-hover:scale-110 animate-morph`}>
                      {person.initial}
                    </div>
                    <h3 className="font-display font-semibold text-white text-xl mb-1">{person.name}</h3>
                    <p className="text-white/50 text-sm">{person.role}</p>
                    <p className="text-accent-blue text-xs mt-2">{person.years}</p>
                  </div>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </ScrollReveal>

        {/* Become a Sponsor */}
        <ScrollReveal animation="fade-up">
          <div className="bg-navy-800/20 rounded-3xl p-10 md:p-12 border border-dashed border-white/10 text-center hover-glow">
            <h3 className="font-display font-bold text-white text-2xl md:text-3xl mb-4">
              Become a Sponsor
            </h3>
            <p className="text-white/50 mb-8 max-w-lg mx-auto text-lg">
              Support the largest youth-led civic hackathon. Partner with us to empower the next generation.
            </p>
            <a
              href="mailto:politechs.info@gmail.com?subject=Hacktivism%20Sponsorship"
              className="inline-block px-8 py-4 rounded-full border-2 border-white/20 text-white font-semibold hover:border-white/40 hover:bg-white/5 transition-all duration-300 border-glow"
            >
              Contact for Sponsorship
            </a>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
