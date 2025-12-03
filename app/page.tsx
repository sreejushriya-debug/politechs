import Link from "next/link";
import Image from "next/image";
import { articles, getAuthorForArticle } from "@/data/articles";
import { ScrollReveal, StaggerContainer, CountUp } from "@/components/ScrollAnimations";
import { AnimatedLine } from "@/components/AmbientEffects";
import { ArticleGraphic } from "@/components/ArticleGraphic";

// Cumulative stats
const TOTAL_PARTICIPANTS = 350 + 850;
const TOTAL_PRIZES = 35000 + 56000;

export default function HomePage() {
  const latestArticles = [...articles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950" />
        
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-blue/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-red/20 rounded-full blur-[120px] animate-float delay-300" />
        
        {/* Morphing shape */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-accent-blue/10 to-accent-red/10 animate-morph animate-spin-slow opacity-50" />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <p className="animate-fade-in-down animate-on-load text-white/60 font-medium tracking-[0.3em] uppercase text-sm mb-8">
            Where Politics Meets Tech
          </p>
          
          <h1 className="animate-fade-in-up animate-on-load delay-100 page-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-8">
            Empowering the future of{" "}
            <span className="text-accent-red text-glow-red inline-block hover:scale-105 transition-transform duration-300">civic</span>{" "}
            <span className="text-accent-blue text-glow-blue inline-block hover:scale-105 transition-transform duration-300">innovation</span>
          </h1>
          
          <p className="animate-fade-in-up animate-on-load delay-200 text-xl md:text-2xl text-white/50 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            Explore, learn, and engage at the crossroads of political science and technology.
          </p>
          
          <div className="animate-fade-in-up animate-on-load delay-300 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/hackathon"
              className="group px-10 py-4 rounded-full bg-gradient-to-r from-accent-blue to-accent-red text-white font-semibold text-lg hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] transition-all duration-500 shine-effect"
            >
              <span className="group-hover:tracking-wider transition-all duration-300">Join Hacktivism</span>
            </Link>
            <Link
              href="/articles"
              className="group px-10 py-4 rounded-full border-2 border-white/20 text-white font-semibold text-lg hover:border-white/40 hover:bg-white/5 transition-all duration-300 border-glow"
            >
              <span className="group-hover:tracking-wider transition-all duration-300">Read Our Work</span>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/40 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient" />
        
        <div className="relative mx-auto max-w-6xl px-6">
          <ScrollReveal animation="fade-up" className="text-center mb-16">
            <p className="text-accent-blue font-medium tracking-[0.2em] uppercase text-sm mb-4">
              Our Impact
            </p>
            <h2 className="page-title text-4xl md:text-5xl lg:text-6xl">
              Building a <span className="gradient-text">global community</span>
            </h2>
            <AnimatedLine className="w-24 mx-auto mt-6" />
          </ScrollReveal>

          <StaggerContainer className="grid sm:grid-cols-3 gap-8">
            {[
              { value: TOTAL_PARTICIPANTS, label: "Participants", sub: "Across 2 hackathons", suffix: "+" },
              { value: TOTAL_PRIZES / 1000, label: "Prize Funding", sub: "In prizes raised", prefix: "$", suffix: "K" },
              { value: 62, label: "Countries", sub: "Global participation", suffix: "+" }
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="stagger-item group bg-navy-800/30 rounded-3xl p-10 text-center border border-white/5 hover-lift hover-glow shine-effect"
              >
                <p className="text-5xl md:text-6xl font-display font-bold text-white mb-3 group-hover:text-glow-blue transition-all duration-300">
                  <CountUp 
                    end={stat.value} 
                    prefix={stat.prefix || ""} 
                    suffix={stat.suffix || ""} 
                    duration={2500}
                  />
                </p>
                <p className="text-white/70 text-lg font-medium">{stat.label}</p>
                <p className="text-sm text-white/40 mt-1">{stat.sub}</p>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-28">
        <div className="mx-auto max-w-6xl px-6">
          <ScrollReveal animation="fade-left">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
              <div>
                <p className="text-accent-red font-medium tracking-[0.2em] uppercase text-sm mb-4">
                  Thought Gallery
                </p>
                <h2 className="page-title text-4xl md:text-5xl lg:text-6xl">
                  Latest Articles
                </h2>
                <p className="text-white/50 mt-4 text-lg max-w-xl">
                  Explore how technology is reshaping the political landscape.
                </p>
              </div>
              <Link
                href="/articles"
                className="group text-accent-blue hover:text-white transition-colors font-medium flex items-center gap-2 animated-underline"
              >
                View all articles 
                <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
              </Link>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid lg:grid-cols-3 gap-8">
            {latestArticles.map((article, i) => {
              const author = getAuthorForArticle(article);
              return (
                <Link key={article.slug} href={`/articles/${article.slug}`}>
                  <article className="stagger-item group h-full bg-navy-800/20 rounded-3xl overflow-hidden border border-white/5 hover-lift hover-glow shine-effect cursor-pointer">
                    <ArticleGraphic 
                      colors={article.graphicColors}
                      icon={article.graphicIcon}
                      title={article.title}
                      size="sm"
                    />
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue text-xs font-medium">
                          {article.category}
                        </span>
                        <span className="text-white/30 text-xs">{article.readTime}</span>
                      </div>
                      <h3 className="font-display font-semibold text-white text-xl leading-snug mb-4 group-hover:text-accent-blue transition-colors duration-300 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-white/50 leading-relaxed mb-4 line-clamp-2">
                        {article.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-white/40 pt-3 border-t border-white/5">
                        {author?.image ? (
                          <Image
                            src={author.image}
                            alt={author.name}
                            width={20}
                            height={20}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                        ) : (
                          <div 
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                            style={{
                              background: `linear-gradient(135deg, ${article.graphicColors[0]}, ${article.graphicColors[1]})`
                            }}
                          >
                            {author?.name.charAt(0) || "P"}
                          </div>
                        )}
                        <span>{author?.name || "Politechs Team"}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Hackathon CTA */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/10 via-transparent to-accent-red/10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-blue/15 rounded-full blur-[100px] animate-glow-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-red/15 rounded-full blur-[100px] animate-glow-pulse delay-500" />
        
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <ScrollReveal animation="zoom-in">
            <p className="text-accent-blue font-medium tracking-[0.2em] uppercase text-sm mb-4">
              Hacktivism Civic Hackathon
            </p>
            <h2 className="page-title text-4xl md:text-5xl lg:text-6xl mb-6">
              Hack for <span className="text-accent-red text-glow-red">good</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
              Join our one-of-a-kind civic hackathon designed for middle and high schoolers worldwide. 
              Build solutions to real civic challenges and compete for prizes.
            </p>
          </ScrollReveal>
          
          <ScrollReveal animation="fade-up" delay={200}>
            <div className="flex flex-wrap justify-center gap-12 mb-12">
              {[
                { value: 2, label: "Hackathons" },
                { value: 1200, label: "Participants", suffix: "+" },
                { value: 91, label: "In Prizes", prefix: "$", suffix: "K" }
              ].map((stat) => (
                <div key={stat.label} className="text-center group">
                  <p className="text-3xl md:text-4xl font-display font-bold text-white group-hover:text-glow-blue transition-all">
                    <CountUp 
                      end={stat.value} 
                      prefix={stat.prefix || ""} 
                      suffix={stat.suffix || ""} 
                    />
                  </p>
                  <p className="text-sm text-white/40 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <Link
              href="/hackathon"
              className="inline-block px-10 py-4 rounded-full bg-white text-navy-950 font-bold text-lg hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-all duration-500 hover:scale-105 shine-effect"
            >
              Learn More & Sign Up
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-28">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <ScrollReveal animation="fade-up">
            <h2 className="page-title text-4xl md:text-5xl mb-6">
              Stay <span className="gradient-text">informed</span>
            </h2>
            <p className="text-white/50 mb-10 text-lg">
              Join our mailing list for the latest in politics and technology.
            </p>
            
            <form
              action="mailto:politechs.info@gmail.com"
              method="post"
              encType="text/plain"
              className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
            >
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                className="flex-1 px-6 py-4 rounded-full bg-navy-800/50 border border-white/10 text-white placeholder:text-white/30 text-lg transition-all duration-300"
              />
              <button
                type="submit"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-accent-blue to-accent-red text-white font-semibold hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-all duration-300 whitespace-nowrap shine-effect"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-white/30 mt-6">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Join Us */}
      <section className="py-28">
        <div className="mx-auto max-w-5xl px-6">
          <ScrollReveal animation="zoom-in">
            <div className="bg-gradient-to-br from-navy-800/50 to-navy-900/50 rounded-[2rem] p-12 md:p-16 border border-white/5 glow-mixed hover-glow">
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <p className="text-accent-blue font-medium tracking-[0.2em] uppercase text-sm mb-4">
                    Join Our Team
                  </p>
                  <h2 className="page-title text-4xl md:text-5xl mb-6">
                    Help shape the <span className="gradient-text">future</span>
                  </h2>
                  <p className="text-white/50 text-lg leading-relaxed">
                    We're looking for talented writers, editors, researchers, and developers 
                    to join <span className="text-accent-red">Poli</span><span className="text-accent-blue">techs</span>.
                  </p>
                </div>
                <div className="flex justify-center md:justify-end">
                  <a
                    href="https://linktr.ee/politechs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-10 py-4 rounded-full bg-white text-navy-950 font-bold text-lg hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-all duration-500 hover:scale-105 shine-effect"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
